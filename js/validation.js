/**
 * validation.js — Booking form validation, phone mask, honeypot spam protection
 */

/** Map service option values to human-readable names for auto-fill */
const SERVICE_NAMES = {
  manicure:  'Маникюр',
  pedicure:  'Педикюр',
  gel:       'Гель-лак',
  design:    'Авторский дизайн',
  extension: 'Наращивание',
  care:      'Уход',
  spa:       'Полный SPA-комплекс',
};

export function initValidation() {
  const form        = document.querySelector('[data-booking-form]');
  if (!form) return;

  const successEl   = document.getElementById('booking-success');
  const formInner   = document.querySelector('[data-booking-form-inner]');
  const phoneInput  = document.getElementById('phone');
  const serviceEl   = document.getElementById('service');
  const masterEl    = document.getElementById('master');
  const commentEl   = document.getElementById('comment');

  /* ---- Auto-fill comment when service / master changes ---- */
  function buildAutoComment() {
    const service = SERVICE_NAMES[serviceEl?.value] || '';
    const master  = masterEl?.options[masterEl.selectedIndex]?.text || '';
    const hasMaster = masterEl?.value && masterEl.value !== '';
    /* Only auto-fill if comment is currently auto-generated or empty */
    if (!commentEl) return;
    const designFromStorage = sessionStorage.getItem('nail_design') || '';
    const parts = [];
    if (designFromStorage) parts.push(designFromStorage);
    if (service) parts.push(`Услуга: ${service}`);
    if (hasMaster) parts.push(`Мастер: ${master}`);
    /* Set if the field is empty or previously auto-filled */
    if (!commentEl.dataset.userEdited) {
      commentEl.value = parts.join(' · ');
    }
  }

  serviceEl?.addEventListener('change', buildAutoComment);
  masterEl?.addEventListener('change', buildAutoComment);
  /* Mark as user-edited if user types directly */
  commentEl?.addEventListener('input', () => {
    commentEl.dataset.userEdited = '1';
  });

  /* ---- Phone mask ---- */
  if (phoneInput) {
    phoneInput.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.startsWith('8')) v = '7' + v.slice(1);
      if (!v.startsWith('7') && v.length > 0) v = '7' + v;
      v = v.slice(0, 11);

      let formatted = '';
      if (v.length > 0)  formatted = '+7';
      if (v.length > 1)  formatted += ' (' + v.slice(1, 4);
      if (v.length >= 4) formatted += ') ' + v.slice(4, 7);
      if (v.length >= 7) formatted += '-' + v.slice(7, 9);
      if (v.length >= 9) formatted += '-' + v.slice(9, 11);

      e.target.value = formatted;
    });
  }

  /* ---- Validators ---- */
  const validators = {
    name(value) {
      return value.trim().length >= 2;
    },
    phone(value) {
      const digits = value.replace(/\D/g, '');
      return digits.length === 11;
    },
    required(value) {
      return value.trim().length > 0;
    },
  };

  /* ---- Validate single field ---- */
  function validateField(field) {
    const group     = field.closest('[data-form-group]');
    const type      = field.dataset.validate || 'required';
    const isValid   = validators[type]
      ? validators[type](field.value)
      : field.value.trim().length > 0;

    const required  = field.hasAttribute('required');
    if (!required) return true;

    if (!isValid) {
      group?.classList.add('form__group--error');
      field.setAttribute('aria-invalid', 'true');
    } else {
      group?.classList.remove('form__group--error');
      field.removeAttribute('aria-invalid');
    }

    return isValid;
  }

  /* ---- Live validation on blur ---- */
  form.querySelectorAll('[data-form-field]').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.closest('[data-form-group]')?.classList.contains('form__group--error')) {
        validateField(field);
      }
    });
  });

  /* ---- Submit ---- */
  form.addEventListener('submit', e => {
    e.preventDefault();

    // Honeypot check
    const honeypot = form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value.trim() !== '') {
      // Bot detected — silently ignore
      return;
    }

    // Validate all required fields
    const fields  = [...form.querySelectorAll('[data-form-field][required]')];
    let allValid  = true;

    fields.forEach(field => {
      const valid = validateField(field);
      if (!valid) allValid = false;
    });

    if (!allValid) {
      // Focus first invalid field
      const firstError = form.querySelector('[aria-invalid="true"]');
      firstError?.focus();
      return;
    }

    // Disable submit button to prevent double-submit
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправляем...';
    }

    // Hide design banner immediately on submit (don't wait for timeout)
    const designBannerImmediate = document.getElementById('booking-design-choice');
    if (designBannerImmediate) designBannerImmediate.classList.remove('is-visible');
    sessionStorage.removeItem('nail_design');

    // Simulate async send (replace with real fetch/API call)
    setTimeout(() => {
      /* Hide entire form inner block (label + design tag + form) */
      if (formInner) formInner.style.display = 'none';
      if (successEl) {
        successEl.classList.add('is-visible');
        successEl.querySelector('h3')?.focus();
      }
    }, 800);
  });

  /* ---- Gallery filter ---- */
  const filterBtns = document.querySelectorAll('[data-filter]');
  const galleryGrid = document.querySelector('[data-gallery-grid]');

  if (filterBtns.length && galleryGrid) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');

        const filter = btn.dataset.filter;
        const items  = galleryGrid.querySelectorAll('[data-gallery-item]');

        items.forEach(item => {
          const tags = item.dataset.tags || '';
          const show = filter === 'all' || tags.includes(filter);
          if (show) {
            delete item.dataset.hidden;
          } else {
            item.dataset.hidden = '1';
          }
        });
      });
    });
  }
}
