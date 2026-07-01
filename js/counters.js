/**
 * counters.js — Counter-up animation on scroll into view
 * Elements: [data-counter="NUMBER"] with optional [data-suffix="+"]
 */

export function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function animateCounter(el) {
    const target   = parseInt(el.dataset.counter, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = Math.max(800, Math.min(2000, target * 1.5));
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOut(progress);
      const current  = Math.round(eased * target);

      el.textContent = current.toLocaleString('ru-RU') + (progress === 1 ? suffix : '');

      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(counter => {
      counter.textContent = '0';
      observer.observe(counter);
    });
  } else {
    // Fallback: show final values immediately
    counters.forEach(el => {
      const target = parseInt(el.dataset.counter, 10);
      const suffix = el.dataset.suffix || '';
      el.textContent = target.toLocaleString('ru-RU') + suffix;
    });
  }
}
