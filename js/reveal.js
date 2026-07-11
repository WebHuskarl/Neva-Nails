/**
 * reveal.js — Плавное появление элементов при скролле.
 * Использует аппаратное ускорение и не блокирует основной поток.
 */

export function initReveal() {
  if (!('IntersectionObserver' in window)) return;

  // Заголовки и тексты под ними выезжают слева
  const leftSelectors = [
    'section:not(.hero) .section__label',
    'section:not(.hero) .section__title',
    'section:not(.hero) .section__subtitle',
    '.booking__info-text'
  ];

  // Все остальное (карточки, кнопки, обычный текст) выезжает снизу
  const bottomSelectors = [
    'section:not(.hero) p:not(.trust__brand-text):not(.booking__info-text)',
    '.services__card',
    '.gallery__item',
    '.masters__card',
    '.booking__step',
    '.review-card',
    '.loyalty__offer',
    '.trust__stat',
    'section:not(.hero) .btn',
    '.footer__info',
    '.footer__nav-col',
    '.footer__map'
  ];

  const leftElements = document.querySelectorAll(leftSelectors.join(', '));
  const bottomElements = document.querySelectorAll(bottomSelectors.join(', '));
  
  leftElements.forEach(el => {
    if (el.closest('.marquee__track')) return; 
    el.classList.add('reveal-item', 'reveal-left');
  });

  bottomElements.forEach(el => {
    if (el.closest('.marquee__track')) return; 
    el.classList.add('reveal-item');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        
        const staggerIndex = el.dataset.stagger || 0;
        if (staggerIndex) {
          el.style.transitionDelay = `${staggerIndex * 100}ms`;
        }

        // Используем requestAnimationFrame для синхронизации с отрисовкой браузера
        requestAnimationFrame(() => {
          el.classList.add('is-revealed');
        });
        
        observer.unobserve(el);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -50px 0px', // Срабатывает за 50px до появления
    threshold: 0.1
  });

  document.querySelectorAll('.reveal-item').forEach(el => observer.observe(el));

  // Автоматическая расстановка stagger (шахматной задержки) для сеток
  const grids = document.querySelectorAll('.services__grid, .gallery__grid, .masters__grid, .reviews__grid, .trust__stats, .booking__steps, .footer__inner');
  grids.forEach(grid => {
    const children = Array.from(grid.children).filter(child => child.classList.contains('reveal-item') || child.querySelector('.reveal-item'));
    
    children.forEach((child, index) => {
      // Ищем сам reveal-item внутри ребенка сетки, или берем самого ребенка
      const target = child.classList.contains('reveal-item') ? child : child.querySelector('.reveal-item');
      if (target) {
        target.dataset.stagger = index % 4; // Задержка от 0 до 300мс
      }
    });
  });
}
