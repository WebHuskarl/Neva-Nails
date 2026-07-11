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
import { initReveal }     from './reveal.js';

/* ---- Global Comment Manager ---- */
window.updateBookingComment = function(type, text) {
  const commentField = document.getElementById('comment');
  if (!commentField) return;
  
  let val = commentField.value;
  
  const prefixes = {
    design: '[Дизайн]',
    promo: '[Акция]',
  };
  
  const prefix = prefixes[type];
  if (!prefix) return;

  // Remove existing line with this prefix
  const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^${escapedPrefix}.*$(\\r\\n|\\r|\\n)?`, 'gm');
  val = val.replace(regex, '');
  
  // Append new line if text is provided
  if (text) {
    if (val && !val.endsWith('\n')) val += '\n';
    val += `${prefix} ${text}\n`;
  }
  
  commentField.value = val.trimStart();
};

document.addEventListener('DOMContentLoaded', () => {
  initHeroVideo();
  initMenu();
  initModal();
  initConfigurator();
  initReviews();
  initCounters();
  initTimers();
  initValidation();
  initReveal();

  const monthsGenitive = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const el = document.getElementById('dynamic-month');
  if (el) el.textContent = monthsGenitive[new Date().getMonth()];

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

  /* ---- Anti-Injection for Comment Field ---- */
  const commentFieldGlobal = document.getElementById('comment');
  if (commentFieldGlobal) {
    commentFieldGlobal.addEventListener('input', (e) => {
      const sanitized = e.target.value.replace(/[<>]/g, '');
      if (e.target.value !== sanitized) {
        e.target.value = sanitized;
      }
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
      const bookingService = document.getElementById('service');
      if (bookingComment && bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          if (serviceName.toLowerCase().includes('все включено')) {
            if (bookingService) bookingService.value = 'set_all_inclusive';
            window.updateBookingComment('promo', 'Сет «Всё включено» (маникюр, педикюр, покрытие и снятие)');
          } else {
            if (bookingService) {
              const opts = Array.from(bookingService.options);
              const opt = opts.find(o => o.text.includes(serviceName) || o.value === serviceName);
              if (opt) bookingService.value = opt.value;
            }
          }
          // trigger change event to update step indicators
          if (bookingService) bookingService.dispatchEvent(new Event('change'));
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
          window.updateBookingComment('promo', 'Приветственный бонус по программе лояльности');
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

  /* ---- Promo & Service Sync Logic ---- */
  const promoSelect = document.getElementById('promo');
  const serviceSelect = document.getElementById('service');
  
  if (promoSelect) {
    promoSelect.addEventListener('change', (e) => {
      const val = promoSelect.value;
      const isAutoSync = e.detail === 'auto-sync';
      
      // Always update the comment to match the dropdown exactly (max 1 promo)
      if (val === 'set') {
        window.updateBookingComment('promo', 'Сет «Всё включено» (маникюр, педикюр, покрытие и снятие)');
      } else if (val === 'welcome') {
        window.updateBookingComment('promo', 'Welcome-бонус на первый визит (-15%)');
      } else if (val === 'birthday') {
        window.updateBookingComment('promo', 'День рождения (-20%)');
      } else if (val === 'wedding') {
        window.updateBookingComment('promo', 'Свадьба / Годовщина (-15%)');
      } else if (val === 'holiday') {
        window.updateBookingComment('promo', 'Праздник (-7%)');
      } else if (val === 'corporate') {
        window.updateBookingComment('promo', 'Корпоратив (-10%)');
      } else {
        window.updateBookingComment('promo', '');
      }

      if (isAutoSync) return; // Stop here if triggered by another component

      // If promo changed away from 'set' but service is still 'set_all_inclusive', clear service
      if (val !== 'set' && serviceSelect && serviceSelect.value === 'set_all_inclusive') {
        serviceSelect.value = '';
        serviceSelect.dispatchEvent(new CustomEvent('change', { detail: 'auto-sync' }));
      }

      if (val === 'set') {
        if (serviceSelect && serviceSelect.value !== 'set_all_inclusive') {
          serviceSelect.value = 'set_all_inclusive';
          serviceSelect.dispatchEvent(new CustomEvent('change', { detail: 'auto-sync' }));
        }
        if (window.selectConfiguratorSeason) window.selectConfiguratorSeason('everyday');
      } else if (val === 'welcome') {
        if (window.selectConfiguratorSeason) window.selectConfiguratorSeason('everyday');
      } else if (val === 'birthday') {
        if (window.selectConfiguratorSeason) window.selectConfiguratorSeason('birthday');
      } else if (val === 'wedding') {
        if (window.selectConfiguratorSeason) window.selectConfiguratorSeason('wedding');
      } else if (val === 'holiday') {
        if (window.selectConfiguratorSeason) window.selectConfiguratorSeason('holiday');
      } else if (val === 'corporate') {
        if (window.selectConfiguratorSeason) window.selectConfiguratorSeason('corporate');
      } else {
        if (window.selectConfiguratorSeason) window.selectConfiguratorSeason('everyday');
      }
    });
  }

  if (serviceSelect) {
    serviceSelect.addEventListener('change', (e) => {
      if (e.detail === 'auto-sync') return;
      
      const val = serviceSelect.value;
      
      // If service changed away from 'set_all_inclusive' but promo is still 'set', clear promo
      if (val !== 'set_all_inclusive' && promoSelect && promoSelect.value === 'set') {
        promoSelect.value = '';
        promoSelect.dispatchEvent(new CustomEvent('change', { detail: 'auto-sync' }));
        window.updateBookingComment('promo', '');
      }

      if (val === 'set_all_inclusive') {
        if (promoSelect && promoSelect.value !== 'set') {
          promoSelect.value = 'set';
          promoSelect.dispatchEvent(new CustomEvent('change', { detail: 'auto-sync' }));
        }
        window.updateBookingComment('promo', 'Сет «Всё включено» (маникюр, педикюр, покрытие и снятие)');
      }
    });
  }
});
