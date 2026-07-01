/**
 * reviews.js — centered auto-play carousel
 * Padding-based centering: track gets dynamic inline padding so the first
 * and last card can also be centred in the viewport.
 */

export function initReviews() {
  const carousel  = document.querySelector('[data-reviews-carousel]');
  const viewport  = document.querySelector('[data-reviews-viewport]');
  const track     = document.querySelector('[data-reviews-track]');
  const dotsWrap  = document.querySelector('[data-reviews-dots]');
  const prevBtn   = document.querySelector('[data-reviews-prev]');
  const nextBtn   = document.querySelector('[data-reviews-next]');

  if (!track) return;

  const cards = [...track.querySelectorAll('.review-card')];
  const total = cards.length;
  if (!total) return;

  let current   = 0;
  let autoTimer = null;
  let startX    = null;
  let dragDelta = 0;
  const AUTO_MS = 5000;

  /* ── helpers ───────────────────────────────────────────── */

  function getGap() {
    return parseFloat(getComputedStyle(track).gap) || 24;
  }

  /** Set symmetric padding so card[0] and card[last] can center. */
  function syncPadding() {
    const vpW   = viewport.offsetWidth;
    const cardW = cards[0]?.offsetWidth || 320;
    const pad   = Math.max(0, (vpW - cardW) / 2);
    track.style.paddingInline = `${pad}px`;
  }

  /** Pixel offset for a given index (measured from track start). */
  function targetOffset(idx) {
    const gap   = getGap();
    const cardW = cards[0]?.offsetWidth || 320;
    return idx * (cardW + gap);
  }

  function goTo(idx, animate = true) {
    current = ((idx % total) + total) % total;

    syncPadding();

    if (!animate) {
      track.style.transition = 'none';
    }

    track.style.transform = `translateX(-${targetOffset(current)}px)`;

    if (!animate) {
      /* Force reflow, re-enable transition */
      void track.offsetHeight;
      track.style.transition = '';
    }

    /* Active card class */
    cards.forEach((c, i) => c.classList.toggle('is-active', i === current));

    /* Dots */
    dotsWrap?.querySelectorAll('[data-dot]').forEach(dot => {
      const active = parseInt(dot.dataset.dot, 10) === current;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', String(active));
    });
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goTo(current + 1), AUTO_MS);
  }

  function stopAuto() {
    clearInterval(autoTimer);
    autoTimer = null;
  }

  /* ── init ──────────────────────────────────────────────── */
  /* Wait a frame so layout is complete before first render */
  requestAnimationFrame(() => {
    syncPadding();
    goTo(0, false);
    startAuto();
  });

  /* ── nav buttons ───────────────────────────────────────── */
  prevBtn?.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); startAuto(); });

  /* ── dot clicks ────────────────────────────────────────── */
  dotsWrap?.querySelectorAll('[data-dot]').forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.dot, 10));
      startAuto();
    });
  });

  /* ── pause on hover ────────────────────────────────────── */
  carousel?.addEventListener('mouseenter', stopAuto);
  carousel?.addEventListener('mouseleave', startAuto);

  /* ── touch / drag swipe ────────────────────────────────── */
  viewport?.addEventListener('touchstart', e => {
    startX    = e.touches[0].clientX;
    dragDelta = 0;
    stopAuto();
  }, { passive: true });

  viewport?.addEventListener('touchmove', e => {
    if (startX === null) return;
    dragDelta = e.touches[0].clientX - startX;
  }, { passive: true });

  viewport?.addEventListener('touchend', () => {
    if (Math.abs(dragDelta) > 40) {
      goTo(dragDelta < 0 ? current + 1 : current - 1);
    }
    startX = null;
    startAuto();
  });

  /* ── resize: re-sync padding + offset ─────────────────── */
  const ro = new ResizeObserver(() => {
    syncPadding();
    goTo(current, false);
  });
  if (viewport) ro.observe(viewport);
}
