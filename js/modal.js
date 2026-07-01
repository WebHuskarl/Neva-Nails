/**
 * modal.js — Gallery lightbox with keyboard navigation and focus trap
 */

export function initModal() {
  const lightbox    = document.querySelector('[data-lightbox]');
  if (!lightbox) return;

  const img         = lightbox.querySelector('[data-lightbox-img]');
  const tagText     = lightbox.querySelector('[data-lightbox-tag-text]');
  const titleText   = lightbox.querySelector('[data-lightbox-title-text]');
  const closeBtn    = lightbox.querySelector('[data-lightbox-close]');
  const prevBtn     = lightbox.querySelector('[data-lightbox-prev]');
  const nextBtn     = lightbox.querySelector('[data-lightbox-next]');
  const galleryItems = () => [...document.querySelectorAll('[data-gallery-item]:not([data-hidden])')];

  let currentIndex = 0;

  /* ---- Open ---- */
  function open(item) {
    const items = galleryItems();
    currentIndex = items.indexOf(item);
    loadItem(items[currentIndex]);

    lightbox.classList.add('is-open');
    document.body.classList.add('modal-open');
    closeBtn?.focus();

    // View Transitions API (progressive enhancement)
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        lightbox.classList.add('is-open');
      });
    }
  }

  /* ---- Close ---- */
  function close() {
    lightbox.classList.remove('is-open');
    document.body.classList.remove('modal-open');
  }

  /* ---- Load item ---- */
  function loadItem(item) {
    if (!item || !img) return;
    const src   = item.dataset.lightboxSrc || '';
    const tag   = item.dataset.lightboxTag || '';
    const title = item.dataset.lightboxTitle || '';

    img.alt = title || tag || 'Фото работы';
    if (src) {
      img.src = src;
    }
    if (tagText)   tagText.textContent   = tag;
    if (titleText) titleText.textContent = title;
  }

  /* ---- Navigation ---- */
  function navigate(dir) {
    const items = galleryItems();
    if (!items.length) return;
    currentIndex = (currentIndex + dir + items.length) % items.length;
    loadItem(items[currentIndex]);
  }

  /* ---- Event listeners ---- */
  // Open on gallery item click/Enter
  document.addEventListener('click', e => {
    const item = e.target.closest('[data-gallery-item]');
    if (item) {
      e.preventDefault();
      open(item);
    }
  });

  document.addEventListener('keydown', e => {
    const item = e.target.closest('[data-gallery-item]');
    if (item && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      open(item);
    }
  });

  closeBtn?.addEventListener('click', close);
  prevBtn?.addEventListener('click', () => navigate(-1));
  nextBtn?.addEventListener('click', () => navigate(1));

  // Click outside inner to close
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) close();
  });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape')     { close(); }
    if (e.key === 'ArrowLeft')  { navigate(-1); }
    if (e.key === 'ArrowRight') { navigate(1); }
  });

  // Focus trap inside lightbox
  lightbox.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = [...lightbox.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )].filter(el => !el.hasAttribute('disabled'));
    if (!focusable.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });
}
