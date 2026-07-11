/**
 * hero-video.js — нативный <video> плеер + слайдшоу после паузы
 *
 * ЛОГИКА:
 *  • Видео воспроизводится с начала до 7 сек, затем пауза.
 *  • После паузы плавно запускается слайдшоу из 4 фото (каждые 5 сек).
 *  • Видео перезапускается ТОЛЬКО когда:
 *      - hero полностью уходит из viewport и возвращается обратно
 *      - перезагрузка страницы (естественное поведение)
 *  • Плавное появление: видео невидимо пока не готово к воспроизведению.
 */

const PAUSE_AT       = 7;    /* секунды */
const SLIDE_INTERVAL = 5000; /* мс между сменой фото */

export function initHeroVideo() {
  const hero      = document.querySelector('[data-section="hero"]');
  const video     = document.querySelector('[data-hero-video]');
  const slideshow = document.querySelector('[data-hero-slideshow]');
  const slides    = slideshow ? [...slideshow.querySelectorAll('.hero__slide')] : [];

  if (!hero || !video) return;

  let played       = false;
  let heroGone     = false;
  let slideTimer   = null;
  let currentSlide = 0;

  /* ── Плавная загрузка ─────────────────────────────────────── */
  video.style.opacity   = '0';
  video.style.transition = 'opacity 0.6s ease';

  function revealVideo() {
    hero.classList.add('hero--canvas-ready');
    video.style.opacity = '1';
  }

  /* ── Слайдшоу ─────────────────────────────────────────────── */
  function startSlideshow() {
    if (!slideshow || slides.length === 0) return;
    clearInterval(slideTimer);
    currentSlide = 0;
    slides.forEach(s => s.classList.remove('is-active'));
    slides[currentSlide].classList.add('is-active');
    slideshow.classList.add('is-active');

    slideTimer = setInterval(() => {
      slides[currentSlide].classList.remove('is-active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('is-active');
    }, SLIDE_INTERVAL);
  }

  function stopSlideshow() {
    clearInterval(slideTimer);
    slideTimer = null;
    if (slideshow) {
      slideshow.classList.remove('is-active');
      slides.forEach(s => s.classList.remove('is-active'));
    }
  }

  /* ── Остановка на 7 секундах → запуск слайдшоу ──────────── */
  function onTimeUpdate() {
    if (video.currentTime >= PAUSE_AT) {
      video.pause();
      video.removeEventListener('timeupdate', onTimeUpdate);
      played = true;
      hero.classList.add('hero--idle');
      /* Плавно скрываем видео и запускаем слайдшоу */
      video.style.opacity = '0';
      setTimeout(() => startSlideshow(), 600);
    }
  }

  /* ── Старт воспроизведения ───────────────────────────────── */
  function playIntro() {
    hero.classList.remove('hero--idle');
    stopSlideshow();
    video.currentTime = 0;
    video.style.opacity = '1';
    video.addEventListener('timeupdate', onTimeUpdate);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => { revealVideo(); });
    }
  }

  /* ── Mobile or Reduced Motion: skip video completely ──────── */
  const isMobile = window.innerWidth < 768;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isMobile || reducedMotion) {
    revealVideo();
    hero.classList.add('hero--idle');
    startSlideshow();
    return;
  }

  /* ── Desktop: Load video lazily ──────────────────────────── */
  const source = video.querySelector('source');
  if (source && source.dataset.src) {
    source.src = source.dataset.src;
    video.load();
  }

  /* ── Обработчики готовности видео ────────────────────────── */
  if (video.readyState >= 3) {
    revealVideo();
    playIntro();
  } else {
    video.addEventListener('canplay', () => {
      revealVideo();
      playIntro();
    }, { once: true });
  }

  /* ── IntersectionObserver: рестарт при возврате ──────────── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        heroGone = true;
        hero.classList.remove('hero--idle');
        video.pause();
        stopSlideshow();
      } else if (heroGone) {
        heroGone = false;
        video.style.opacity = '0';
        stopSlideshow();
        setTimeout(() => {
          video.removeEventListener('timeupdate', onTimeUpdate);
          played = false;
          playIntro();
        }, 350);
      }
    });
  }, { threshold: 0 });

  io.observe(hero);
}
