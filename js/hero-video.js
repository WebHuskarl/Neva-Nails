/**
 * hero-video.js — Слайдшоу -> Видео
 *
 * ЛОГИКА:
 *  • Сразу запускается слайдшоу из 4 фото БЕЗ задержек и лагов.
 *  • В фоне грузится страница и видео (на ПК).
 *  • Видео НЕ проигрывается при первой загрузке страницы.
 *  • Видео проигрывается (7 сек) ТОЛЬКО когда пользователь проскроллил вниз и вернулся обратно к главному экрану.
 */

const PAUSE_AT       = 7;    /* секунды для видео */
const SLIDE_INTERVAL = 5000; /* мс между сменой фото */

export function initHeroVideo() {
  const hero      = document.querySelector('[data-section="hero"]');
  const video     = document.querySelector('[data-hero-video]');
  const slideshow = document.querySelector('[data-hero-slideshow]');
  const slides    = slideshow ? [...slideshow.querySelectorAll('.hero__slide')] : [];

  if (!hero || !video) return;

  let heroGone     = false;
  let slideTimer   = null;
  let currentSlide = 0;

  const isMobile = window.innerWidth < 768;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Плавная загрузка ─────────────────────────────────────── */
  video.style.opacity   = '0';
  video.style.transition = 'opacity 0.8s ease-in-out';

  // Показываем контент хиро-секции немедленно
  hero.classList.add('hero--canvas-ready');

  /* ── Слайдшоу ─────────────────────────────────────────────── */
  function startSlideshow() {
    if (!slideshow || slides.length === 0) return;
    clearInterval(slideTimer);
    
    slideshow.classList.add('is-active');
    
    currentSlide = 0;
    slides.forEach(s => s.classList.remove('is-active'));
    slides[currentSlide].classList.add('is-active');
    
    // Скрываем видео плавно, если оно было
    video.style.opacity = '0';
    setTimeout(() => {
      if (video.style.opacity === '0') video.pause();
    }, 800);

    slideTimer = setInterval(() => {
      slides[currentSlide].classList.remove('is-active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('is-active');
    }, SLIDE_INTERVAL);
  }

  function stopSlideshow() {
    clearInterval(slideTimer);
  }

  /* ── Видео: от 0 до 7 секунд ────────────────────────────── */
  function onTimeUpdate() {
    if (video.currentTime >= PAUSE_AT) {
      video.pause();
      video.removeEventListener('timeupdate', onTimeUpdate);
      hero.classList.add('hero--idle');
      
      // Сразу запускаем слайдшоу обратно
      startSlideshow();
    }
  }

  function playIntro() {
    // Проигрываем видео только если оно успело загрузиться (хотя бы метаданные)
    if (video.readyState < 2) {
      startSlideshow();
      return;
    }
    
    hero.classList.remove('hero--idle');
    stopSlideshow();
    video.currentTime = 0;
    
    // Показываем видео
    video.style.opacity = '1';
    video.addEventListener('timeupdate', onTimeUpdate);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => { 
        startSlideshow(); 
      });
    }
  }

  /* ── Инициализация ───────────────────────────────────────── */
  
  // 1. СРАЗУ запускаем фото без пауз и ожиданий
  hero.classList.add('hero--idle');
  startSlideshow();
  
  // 2. В фоне начинаем грузить видео ТОЛЬКО после того как весь контент окна загрузился
  if (!isMobile && !reducedMotion) {
    window.addEventListener('load', () => {
      const source = video.querySelector('source');
      if (source && source.dataset.src) {
        source.src = source.dataset.src;
        video.load();
      }
    });
  }

  /* ── IntersectionObserver: логика Возвращения ────────────── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        // Мы ушли с хиро
        heroGone = true;
        video.pause();
        stopSlideshow();
      } else if (heroGone) {
        // МЫ ВЕРНУЛИСЬ В ХИРО
        heroGone = false;
        
        // ВОТ ЗДЕСЬ И ТОЛЬКО ЗДЕСЬ МЫ ЗАПУСКАЕМ ВИДЕО (если на ПК)
        if (!isMobile && !reducedMotion) {
          playIntro();
        } else {
          startSlideshow();
        }
      }
    });
  }, { threshold: 0 });

  io.observe(hero);
}
