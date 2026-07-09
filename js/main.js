/**
 * main.js — Entry point. Imports and initialises all modules.
 * All DOM binding via data-* attributes, never via classes/ids for logic.
 */

import { initMenu }        from './menu.js';
import { initModal }       from './modal.js';
import { initConfigurator} from './configurator.js';
import { initCounters }    from './counters.js';
import { initTimers }      from './timer.js';
import { initValidation }  from './validation.js';
import { initHeroVideo }   from './hero-video.js';
import { initReviews }    from './reviews.js';

document.addEventListener('DOMContentLoaded', () => {
  initHeroVideo();
  initMenu();
  initModal();
  initConfigurator();
  initReviews();
  initCounters();
  initTimers();
  initValidation();

  /* Animate loyalty bars when they scroll into view */
  const bars = document.querySelectorAll('[data-bar-fill]');
  if (bars.length && 'IntersectionObserver' in window) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const w = fill.dataset.barFill || '0';
          fill.style.setProperty('--bar-width', w + '%');
          fill.classList.add('loyalty-level__bar-fill--animated');
          barObserver.unobserve(fill);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(b => barObserver.observe(b));
  }

  /* Set min date on booking date input */
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  /* ---- Booking form step progression ---- */
  const bookingSteps = document.querySelectorAll('.booking__step');
  if (bookingSteps.length) {
    const serviceEl = document.getElementById('service');
    const timeEl    = document.getElementById('time');
    const dateEl    = document.getElementById('date');
    const nameEl    = document.getElementById('name');

    function updateSteps() {
      const step1done = serviceEl?.value;
      const step2done = dateEl?.value && timeEl?.value;
      const step3done = nameEl?.value?.trim().length >= 2;

      bookingSteps.forEach((step, i) => {
        step.classList.remove('booking__step--active', 'booking__step--done');
        if (i === 0) {
          if (step1done) step.classList.add('booking__step--done');
          else step.classList.add('booking__step--active');
        }
        if (i === 1) {
          if (step2done) step.classList.add('booking__step--done');
          else if (step1done) step.classList.add('booking__step--active');
        }
        if (i === 2) {
          if (step3done) step.classList.add('booking__step--done');
          else if (step1done && step2done) step.classList.add('booking__step--active');
        }
      });
    }

    [serviceEl, dateEl, timeEl, nameEl].forEach(el => {
      el?.addEventListener('change', updateSteps);
      el?.addEventListener('input', updateSteps);
    });
  }

  /* ---- Interactive Services Logic ---- */
  const serviceCards = document.querySelectorAll('.service-card[data-service-name]');
  const bookingComment = document.getElementById('comment');
  const bookingSection = document.getElementById('booking');

  serviceCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't override if user clicked on 'Подобрать дизайн' link specifically
      if (e.target.closest('a')) return;
      
      const serviceName = card.dataset.serviceName;
      if (bookingComment && bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          bookingComment.value = `Хочу записаться на услугу: ${serviceName}`;
          bookingComment.focus();
        }, 500); // Wait for scroll
      }
    });
  });

  /* ---- Loyalty Accordion Certificates ---- */
  const accordions = document.querySelectorAll('.certificate[data-accordion]');
  accordions.forEach(acc => {
    const header = acc.querySelector('.certificate__header');
    if (header) {
      header.addEventListener('click', () => {
        acc.classList.toggle('is-open');
      });
    }
  });

  /* ---- Newbie Button Logic ---- */
  const newbieBtn = document.getElementById('btn-loyalty-newbie');
  if (newbieBtn) {
    newbieBtn.addEventListener('click', () => {
      if (bookingComment && bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          bookingComment.value = `Я новый клиент, хочу использовать приветственный бонус по программе лояльности!`;
          bookingComment.focus();
        }, 500);
      }
    });
  }
  /* ---- Promo Glare Hover Effect ---- */
  const promos = document.querySelectorAll('.promo-banner');
  promos.forEach(promo => {
    promo.addEventListener('mousemove', (e) => {
      const rect = promo.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      promo.style.setProperty('--mouse-x', `${x}px`);
      promo.style.setProperty('--mouse-y', `${y}px`);
    });
  });
});
