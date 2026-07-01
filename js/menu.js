/**
 * menu.js — Burger toggle, mobile menu, scroll-spy, scroll progress, header glass
 */

export function initMenu() {
  const header      = document.querySelector('[data-header]');
  const burger      = document.querySelector('[data-burger]');
  const mobileMenu  = document.querySelector('[data-mobile-menu]');
  const mobileClose = document.querySelector('[data-mobile-close]');
  const mobileLinks = document.querySelectorAll('[data-mobile-link]');
  const navLinks    = document.querySelectorAll('[data-nav-link]');
  const progressBar = document.querySelector('[data-scroll-progress]');
  const sections    = document.querySelectorAll('[data-section]');

  if (!header) return;

  /* ---- Burger toggle ---- */
  function openMenu() {
    burger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    // Focus first link
    const firstLink = mobileMenu.querySelector('a, button');
    firstLink?.focus();
  }

  function closeMenu() {
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpen = burger.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => closeMenu());
    });

    if (mobileClose) {
      mobileClose.addEventListener('click', () => {
        closeMenu();
        burger.focus();
      });
    }

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMenu();
        burger.focus();
      }
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (
        mobileMenu.classList.contains('is-open') &&
        !mobileMenu.contains(e.target) &&
        !burger.contains(e.target)
      ) {
        closeMenu();
      }
    });
  }

  /* ---- Scroll handler: header glass + progress bar + scroll-spy ---- */
  let ticking = false;

  function onScroll() {
    const scrollY   = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    // Header glass
    if (scrollY > 20) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    // Progress bar
    if (progressBar) {
      const pct = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
      progressBar.style.width = pct + '%';
    }

    // Scroll-spy
    if (sections.length && navLinks.length) {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (scrollY >= sectionTop) {
          current = section.dataset.section;
        }
      });
      navLinks.forEach(link => {
        const href = link.getAttribute('href')?.replace('#', '');
        link.classList.toggle('is-active', href === current);
      });
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  // Initial call
  onScroll();
}
