/**
 * hero-video.js — canvas frame scrubber (Apple-style)
 *
 * INTRO  : кадры 0–69 автоматически (12 fps).
 *          Скролл во время intro → немедленно в scrub.
 * SCRUB  : кадры 70–99 управляются скроллом.
 *          Прогресс 0→1 = прокрутка на 55% высоты hero.
 *          В последних 20% прогресса холст плавно исчезает.
 * ВОЗВРАТ: когда пользователь скроллит назад до верха —
 *          плавный fade out → frame 0 → fade in → intro заново.
 * IDLE   : 2 сек паузы на кадре 69 → «дыхание» холста.
 */

const TOTAL_FRAMES = 100;
const INTRO_FRAMES = 70;
const FPS          = 12;
const FRAME_DIR    = 'images/hero/frames/';

export function initHeroVideo() {
  const hero   = document.querySelector('[data-section="hero"]');
  const canvas = document.querySelector('[data-hero-canvas]');
  if (!hero || !canvas) return;

  const ctx   = canvas.getContext('2d');
  const wrap  = canvas.parentElement; /* .hero__video-wrap */

  /* ── состояние ─────────────────────────────────────────────── */
  const imgs       = new Array(TOTAL_FRAMES).fill(null);
  let readyCnt     = 0;
  let phase        = 'loading';   /* loading | intro | scrub | returning */
  let curFrame     = 0;
  let scrubStart   = INTRO_FRAMES - 1; /* кадр, с которого начался scrub */
  let lastTime     = null;
  let ticking      = false;
  let rafId        = null;
  let idleTimer    = null;
  let heroTop      = 0;
  let prevProgress = -1;

  /* ── утилиты ────────────────────────────────────────────────── */
  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

  function cacheHeroTop() {
    heroTop = hero.getBoundingClientRect().top + window.scrollY;
  }

  function resize() {
    canvas.width  = hero.offsetWidth  || window.innerWidth;
    canvas.height = hero.offsetHeight || window.innerHeight;
    cacheHeroTop();
    drawFrame(curFrame);
  }

  function drawFrame(idx) {
    const img = imgs[idx];
    if (!img?.complete || !img.naturalWidth) return;
    const cw = canvas.width,  ch = canvas.height;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const s  = Math.max(cw / iw, ch / ih);
    // On mobile portrait (narrow canvas), shift crop right to center the hand
    // The hand/subject is at ~62% of the image width
    const pX = (cw < 520 && ch >= cw) ? 0.62 : 0.5;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, cw/2 - iw*s*pX, (ch - ih*s)/2, iw*s, ih*s);
    curFrame = idx;
  }

  /* ── загрузка ───────────────────────────────────────────────── */
  function loadFrames() {
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src   = `${FRAME_DIR}${String(i).padStart(4,'0')}.jpg`;
      img.onload = () => {
        readyCnt++;
        if (i === 0) { drawFrame(0); hero.classList.add('hero--canvas-ready'); }
        if (readyCnt === INTRO_FRAMES && phase === 'loading') startIntro();
      };
      imgs[i] = img;
    }
  }

  /* ── scrub-прогресс ─────────────────────────────────────────── */
  function scrubProgress() {
    return clamp((window.scrollY - heroTop) / (hero.offsetHeight * 0.55), 0, 1);
  }

  /**
   * Маппинг прогресса скролла на кадр.
   * scrubStart — кадр, на котором прервалось intro (или 69 если дошло до конца).
   * p=0 → scrubStart, p=1 → кадр 99.
   * Нет скачка: scrub продолжает именно оттуда, где остановилось intro.
   */
  function frameFromProgress(p) {
    return Math.round(scrubStart + (TOTAL_FRAMES - 1 - scrubStart) * p);
  }

  /* ── прозрачность wrap при уходе hero ──────────────────────── */
  function applyEndFade(p) {
    /* последние 25% scrub — плавно исчезаем */
    const fade = p > 0.75 ? clamp(1 - (p - 0.75) / 0.25, 0, 1) : 1;
    wrap.style.opacity = String(fade);
  }

  /* ══ INTRO ══════════════════════════════════════════════════════ */
  function startIntro() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    phase      = 'intro';
    curFrame   = 0;
    scrubStart = INTRO_FRAMES - 1;
    lastTime   = null;
    wrap.style.opacity = '';
    prevProgress = -1;
    hero.classList.remove('hero--idle');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      enterScrub(); return;
    }
    rafId = requestAnimationFrame(stepIntro);
  }

  function stepIntro(ts) {
    /* Скролл начался → в scrub с текущего кадра (без скачка) */
    if (scrubProgress() > 0.01) { enterScrub(curFrame); return; }

    if (lastTime === null) lastTime = ts;
    const elapsed = ts - lastTime;
    const adv = Math.floor(elapsed / (1000 / FPS));
    if (adv > 0) {
      lastTime = ts - (elapsed % (1000 / FPS));
      curFrame = Math.min(curFrame + adv, INTRO_FRAMES - 1);
      drawFrame(curFrame);
    }

    if (curFrame < INTRO_FRAMES - 1) rafId = requestAnimationFrame(stepIntro);
    else enterScrub(INTRO_FRAMES - 1);
  }

  /* ══ SCRUB ══════════════════════════════════════════════════════ */
  function enterScrub(fromFrame) {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    phase      = 'scrub';
    scrubStart = (fromFrame !== undefined) ? fromFrame : INTRO_FRAMES - 1;
    const p    = scrubProgress();
    applyEndFade(p);
    drawFrame(frameFromProgress(p));
    /* Idle только если мы в самом начале scrub (без скролла) */
    if (p < 0.05) scheduleIdle();
  }

  function updateScrub() {
    ticking = false;
    if (phase !== 'scrub') return;

    const p = scrubProgress();
    const f = frameFromProgress(p);

    /* Пользователь прокрутил назад до самого начала → возврат */
    if (p <= 0 && prevProgress > 0.02) {
      returnToTop(); return;
    }

    if (f !== curFrame) {
      stopIdle();
      drawFrame(f);
      applyEndFade(p);
    }

    prevProgress = p;
  }

  function scheduleScrub() {
    if (phase === 'intro' && scrubProgress() > 0.01) {
      if (rafId) cancelAnimationFrame(rafId);
      enterScrub(curFrame); return;
    }
    if (phase !== 'scrub' || ticking) return;
    ticking = true;
    requestAnimationFrame(updateScrub);
  }

  /* ══ ВОЗВРАТ К НАЧАЛУ ═══════════════════════════════════════════
     Плавный fade out → frame 0 → fade in → intro               */
  function returnToTop() {
    if (phase === 'returning') return;
    phase = 'returning';
    stopIdle();

    /* 1. fade out (0.45s через CSS transition на wrap) */
    wrap.style.transition = 'opacity 0.45s ease';
    wrap.style.opacity    = '0';

    setTimeout(() => {
      /* 2. ставим кадр 0 пока холст невидим */
      drawFrame(0);
      prevProgress = -1;

      /* 3. fade in */
      requestAnimationFrame(() => {
        wrap.style.opacity = '';
        /* убираем inline transition — возвращаемся к CSS */
        setTimeout(() => { wrap.style.transition = ''; }, 50);

        /* 4. старт intro */
        startIntro();
      });
    }, 460);
  }

  /* ══ IDLE-анимация ══════════════════════════════════════════════ */
  function scheduleIdle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (phase === 'scrub' && scrubProgress() < 0.05)
        hero.classList.add('hero--idle');
    }, 2000);
  }

  function stopIdle() {
    clearTimeout(idleTimer);
    hero.classList.remove('hero--idle');
  }

  /* ── старт ──────────────────────────────────────────────────── */
  cacheHeroTop();
  resize();
  loadFrames();

  window.addEventListener('scroll', scheduleScrub, { passive: true });
  window.addEventListener('resize', () => { resize(); cacheHeroTop(); }, { passive: true });
}
