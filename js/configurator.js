/**
 * configurator.js — Nail design picker: shape, length, color, occasion
 * Passes choice to booking form via sessionStorage
 */

export function initConfigurator() {
  const preview      = document.querySelector('[data-nail-preview]');
  const resultText   = document.querySelector('[data-config-result]');
  const bookBtn      = document.querySelector('[data-config-book]');
  const spotlight    = document.querySelector('[data-spotlight]');
  const discountWrap = document.querySelector('[data-config-discount]');
  const discountText = document.querySelector('[data-config-discount-text]');
  const discountNote = document.querySelector('[data-config-discount-note]');

  if (!preview) return;

  const nails = [...preview.querySelectorAll('.nail')];

  /* ---- State ---- */
  const state = {
    shape:     'square',
    length:    'medium',
    color:     '#C9A98B',
    colorName: 'Nude',
    season:    'everyday',
    discount:  0,
    discountNote: '',
  };

  /* Light-colored nails that need a dark preview background */
  const LIGHT_COLORS = ['#F0EDE8', '#F4A7B9', '#C9A98B', '#FFFFFF', '#FFF0F0'];

  const seasonLabels = {
    everyday:  'Каждый день',
    birthday:  'День рождения',
    wedding:   'Свадьба / Годовщина',
    holiday:   'Праздник',
    corporate: 'Корпоратив',
  };

  /* ---- Determine if a color is "light" ---- */
  function isLightColor(hex) {
    if (!hex || hex.startsWith('linear-gradient')) return false;
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    const luminance = (0.299*r + 0.587*g + 0.114*b) / 255;
    return luminance > 0.72;
  }

  /* ---- Update preview ---- */
  function updatePreview() {
    // Shape & length
    preview.dataset.shape  = state.shape;
    preview.dataset.length = state.length;

    // Color
    nails.forEach(nail => {
      nail.style.background = state.color;
    });

    // Light color → dark preview background
    if (isLightColor(state.color)) {
      preview.classList.add('is-light-bg');
    } else {
      preview.classList.remove('is-light-bg');
    }

    // Result text
    const shapeLabel  = document.querySelector(`input[name="shape"][value="${state.shape}"]`)?.closest('.config-option')?.querySelector('.config-option__label')?.textContent?.trim() || state.shape;
    const lengthLabel = document.querySelector(`input[name="length"][value="${state.length}"]`)?.closest('.config-option')?.querySelector('.config-option__label')?.textContent?.trim() || state.length;
    const seasonLabel = seasonLabels[state.season] || state.season;

    const result = `${shapeLabel} / ${lengthLabel} / ${state.colorName} / ${seasonLabel}`;
    if (resultText) resultText.textContent = result;

    // Discount display
    if (discountWrap && discountText && discountNote) {
      if (state.discount > 0) {
        discountWrap.style.display = '';
        discountText.textContent   = `Скидка -${state.discount}% по поводу: ${seasonLabel}`;
        discountNote.textContent   = `[Внимание] ${state.discountNote}`;
      } else {
        discountWrap.style.display = 'none';
      }
    }

    // We do NOT save to sessionStorage or update the booking form here anymore.
    // That only happens when the user clicks 'bookBtn'.
  }

  /* ---- Pass to booking ---- */
  function updateBookingDesign(result) {
    const choiceWrap = document.getElementById('booking-design-choice');
    const choiceText = document.querySelector('[data-design-choice-text]');
    const clearBtn   = document.querySelector('[data-clear-design]');
    if (!choiceWrap || !choiceText) return;
    choiceText.textContent = result;
    if (clearBtn) clearBtn.style.display = 'inline-flex';

    const commentField = document.querySelector('#comment');
    if (window.updateBookingComment) {
      window.updateBookingComment('design', result);
    } else if (commentField && !commentField.dataset.userEdited) {
      commentField.value = `Дизайн: ${result}`;
    }
  }

  /* ---- Clear design from booking ---- */
  const clearBtn = document.querySelector('[data-clear-design]');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      const choiceText = document.querySelector('[data-design-choice-text]');
      if (choiceText) choiceText.innerHTML = '<a href="#configurator" style="color: inherit; text-decoration: underline; text-underline-offset: 2px;">Выберите дизайн в конфигураторе</a>';
      clearBtn.style.display = 'none';
      sessionStorage.removeItem('nail_design');
      if (window.updateBookingComment) {
        window.updateBookingComment('design', '');
      } else {
        const commentField = document.querySelector('#comment');
        if (commentField) commentField.value = '';
      }
    });
  }

  /* ---- Radio change handlers ---- */
  document.querySelectorAll('input[name="shape"]').forEach(input => {
    input.addEventListener('change', () => {
      state.shape = input.value;
      updatePreview();
    });
  });

  document.querySelectorAll('input[name="length"]').forEach(input => {
    input.addEventListener('change', () => {
      state.length = input.value;
      updatePreview();
    });
  });

  document.querySelectorAll('input[name="season"]').forEach(input => {
    input.addEventListener('change', (e) => {
      state.season       = input.value;
      state.discount     = parseInt(input.dataset.discount || '0', 10);
      state.discountNote = input.dataset.discountNote || '';
      updatePreview();

      const promoSelect = document.getElementById('promo');
      if (promoSelect && !e.detail?.autoSync) {
        if (['birthday', 'wedding', 'holiday', 'corporate'].includes(state.season)) {
          promoSelect.value = state.season;
          promoSelect.dispatchEvent(new CustomEvent('change', { detail: 'auto-sync' }));
        } else if (promoSelect.value && ['birthday', 'wedding', 'holiday', 'corporate'].includes(promoSelect.value)) {
          promoSelect.value = '';
          promoSelect.dispatchEvent(new CustomEvent('change', { detail: 'auto-sync' }));
        }
      }
    });
  });

  document.querySelectorAll('input[name="color"]').forEach(input => {
    input.addEventListener('change', () => {
      state.color     = input.dataset.colorHex || '#C9A98B';
      state.colorName = input.dataset.colorName || input.value;
      updatePreview();
    });
  });

  window.selectPromo = function(value) {
    const select = document.getElementById('promo');
    if (select) {
      select.value = value;
      select.dispatchEvent(new Event('change'));
    }
  };

  window.selectConfiguratorSeason = function(value) {
    const input = document.querySelector(`input[name="season"][value="${value}"]`);
    if (input && !input.checked) {
      input.checked = true;
      input.dispatchEvent(new CustomEvent('change', { detail: { autoSync: true } }));
    }
  };

  /* ---- Spotlight / cursor follow in hero ---- */
  if (spotlight) {
    const heroSection = document.querySelector('[data-section="hero"]');
    if (heroSection) {
      heroSection.addEventListener('mousemove', e => {
        const rect = heroSection.getBoundingClientRect();
        spotlight.style.left = (e.clientX - rect.left) + 'px';
        spotlight.style.top  = (e.clientY - rect.top)  + 'px';
      });
    }
  }

  /* ---- Book with design button ---- */
  if (bookBtn) {
    bookBtn.addEventListener('click', e => {
      e.preventDefault();
      
      const shapeLabel  = document.querySelector(`input[name="shape"][value="${state.shape}"]`)?.closest('.config-option')?.querySelector('.config-option__label')?.textContent?.trim() || state.shape;
      const lengthLabel = document.querySelector(`input[name="length"][value="${state.length}"]`)?.closest('.config-option')?.querySelector('.config-option__label')?.textContent?.trim() || state.length;
      const seasonLabel = seasonLabels[state.season] || state.season;
      const result = `${shapeLabel} / ${lengthLabel} / ${state.colorName}`;
      const bookingResult = result;
      
      sessionStorage.setItem('nail_design', bookingResult);
      updateBookingDesign(bookingResult);

      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  /* ---- Restore from sessionStorage on page load ---- */
  const saved = sessionStorage.getItem('nail_design');
  if (saved) {
    updateBookingDesign(saved);
    if (resultText) resultText.textContent = saved;
  }

  // Initial render
  updatePreview();
}
