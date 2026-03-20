/**
 * CINETIKA — main.js
 * Version: 1.0
 *
 * Features:
 *   - Mobile navigation toggle
 *   - Hero carousel / slideshow
 *   - Sticky nav shadow on scroll
 *   - Active nav link detection
 *   - Smooth scroll for anchor links
 *   - CMS data binding helpers (async/await, data-cms attributes)
 *   - Simple contact form validation
 *
 * CMS Integration notes:
 *   Functions marked with "CMS:" comments show where API calls would be made.
 *   All dynamic sections use [data-cms="key"] attributes so a CMS adapter
 *   can target and hydrate them without touching component logic.
 */

'use strict';

/* ============================================================================
   1. UTILITIES
   ============================================================================ */

/**
 * Shorthand querySelector
 * @param {string} selector
 * @param {Element} [scope=document]
 */
const $ = (selector, scope = document) => scope.querySelector(selector);

/**
 * Shorthand querySelectorAll → Array
 * @param {string} selector
 * @param {Element} [scope=document]
 */
const $$ = (selector, scope = document) =>
  Array.from(scope.querySelectorAll(selector));

/**
 * Debounce a function
 * @param {Function} fn
 * @param {number} delay ms
 */
const debounce = (fn, delay = 150) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/* ============================================================================
   2. NAVIGATION
   ============================================================================ */
const initNav = () => {
  const nav     = $('.site-nav');
  const toggle  = $('.nav-toggle');
  const menu    = $('.nav-links');

  if (!nav || !toggle || !menu) return;

  // --- Mobile menu toggle ---
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a nav link is clicked
  $$('.nav-links__link', menu).forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      toggle.focus();
    }
  });

  // --- Sticky nav shadow on scroll ---
  const onScroll = debounce(() => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, 50);

  window.addEventListener('scroll', onScroll, { passive: true });

  // --- Active nav link ---
  setActiveNavLink();
};

/**
 * Marks the nav link matching the current page URL as active.
 */
const setActiveNavLink = () => {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  $$('.nav-links__link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Normalise: strip trailing slash and handle index
    const linkPath = href.replace(/\/$/, '') || '/';
    const isHome   = currentPath.endsWith('index.html') || currentPath === '/';
    const linkHome = linkPath.endsWith('index.html') || linkPath === '/' || linkPath === '';

    const match = isHome
      ? linkHome
      : currentPath.includes(linkPath) && linkPath !== '/';

    link.classList.toggle('active', match);
    if (match) link.setAttribute('aria-current', 'page');
  });
};

/* ============================================================================
   3. HERO CAROUSEL
   ============================================================================ */
const initHeroCarousel = () => {
  const hero   = $('.hero');
  if (!hero) return;

  const slides     = $$('.hero__slide', hero);
  const dotsWrap   = $('.hero__controls', hero);
  const prevBtn    = $('.hero__arrow--prev', hero);
  const nextBtn    = $('.hero__arrow--next', hero);

  if (slides.length < 2) {
    // Only one slide — show it and bail
    if (slides[0]) slides[0].classList.add('is-active');
    return;
  }

  let current  = 0;
  let autoTimer = null;
  const INTERVAL = 5500; // ms between auto-advances

  // Build dot indicators
  let dots = [];
  if (dotsWrap) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'hero__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `Ir a la diapositiva ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });
  }

  const goTo = (index) => {
    slides[current].classList.remove('is-active');
    if (dots[current]) dots[current].classList.remove('is-active');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('is-active');
    if (dots[current]) dots[current].classList.add('is-active');
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  // Auto-play
  const startAuto = () => {
    stopAuto();
    autoTimer = setInterval(next, INTERVAL);
  };

  const stopAuto = () => {
    if (autoTimer) clearInterval(autoTimer);
  };

  // Pause on hover / focus
  hero.addEventListener('mouseenter', stopAuto);
  hero.addEventListener('mouseleave', startAuto);
  hero.addEventListener('focusin', stopAuto);
  hero.addEventListener('focusout', startAuto);

  // Arrow buttons
  if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); next(); startAuto(); });

  // Keyboard support on hero
  hero.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { stopAuto(); next(); startAuto(); }
    if (e.key === 'ArrowLeft')  { stopAuto(); prev(); startAuto(); }
  });

  // Touch / swipe support
  let touchStartX = 0;
  hero.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  hero.addEventListener('touchend', (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > 50) {
      stopAuto();
      deltaX < 0 ? next() : prev();
      startAuto();
    }
  }, { passive: true });

  // Init first slide and start
  slides[0].classList.add('is-active');
  startAuto();
};

/* ============================================================================
   4. SMOOTH SCROLL
   ============================================================================ */
const initSmoothScroll = () => {
  // Native CSS `scroll-behavior: smooth` handles most cases.
  // This handles hash links to IDs that might be hidden behind the sticky nav.
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id     = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();

      const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
        10
      ) || 70;

      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
      target.focus({ preventScroll: true });
    });
  });
};

/* ============================================================================
   5. CONTACT FORM VALIDATION
   ============================================================================ */
const initContactForm = () => {
  const form = $('form.contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let valid = true;

    // Clear previous errors
    $$('.form-control', form).forEach(input => {
      input.classList.remove('is-invalid');
    });

    // Required field validation
    $$('[required]', form).forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('is-invalid');
        valid = false;
      }
    });

    // Email format
    const emailField = $('[type="email"]', form);
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      emailField.classList.add('is-invalid');
      valid = false;
    }

    if (!valid) {
      const firstInvalid = $('.form-control.is-invalid', form);
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const submitBtn = $('[type="submit"]', form);
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando…';
    submitBtn.disabled = true;

    try {
      // CMS: Replace with actual form submission endpoint
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(Object.fromEntries(new FormData(form)))
      // });
      // if (!response.ok) throw new Error('Server error');

      // Simulate network delay for demo
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success state
      form.innerHTML = `
        <div style="text-align:center; padding: 2rem 1rem;">
          <div style="font-size:3rem; margin-bottom:1rem;">✓</div>
          <h3 style="font-size:1.25rem; margin-bottom:.5rem;">¡Mensaje enviado!</h3>
          <p style="color:var(--color-text-muted);">
            Nos pondremos en contacto contigo lo antes posible.
          </p>
        </div>
      `;
    } catch (err) {
      console.error('Form submission error:', err);
      submitBtn.textContent = 'Error — inténtalo de nuevo';
      submitBtn.disabled = false;
    }
  });

  // Real-time validation feedback
  $$('.form-control', form).forEach(input => {
    input.addEventListener('blur', () => {
      if (input.hasAttribute('required') && !input.value.trim()) {
        input.classList.add('is-invalid');
      } else {
        input.classList.remove('is-invalid');
      }
    });

    input.addEventListener('input', () => {
      if (input.value.trim()) input.classList.remove('is-invalid');
    });
  });
};

/* ============================================================================
   6. CMS DATA BINDING
   ============================================================================ */

/**
 * Fetches content from a CMS endpoint and injects it into elements
 * with matching [data-cms] attributes.
 *
 * Usage in HTML: <span data-cms="site.tagline"></span>
 *
 * CMS: In production, replace `fetchLocalData` with a real API call:
 *   const response = await fetch('https://your-cms.io/api/content');
 *   const data = await response.json();
 */
const loadCMSContent = async () => {
  try {
    // CMS: Replace this URL with your headless CMS API endpoint
    // Example: const response = await fetch('/api/content?populate=*');
    const response = await fetch('../data/content.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    bindCMSData(data);
  } catch (err) {
    // Graceful degradation — static HTML fallback content remains visible
    console.info('[CMS] Could not load dynamic content, using static fallback.', err.message);
  }
};

/**
 * Walks the DOM for [data-cms="dot.path"] attributes and fills them
 * with values from the CMS data object.
 * @param {Object} data
 */
const bindCMSData = (data) => {
  $$('[data-cms]').forEach(el => {
    const path  = el.dataset.cms;
    const value = resolvePath(data, path);
    if (value == null) return;

    if (el.tagName === 'IMG') {
      el.src = value;
    } else if (el.tagName === 'A') {
      el.href = value;
    } else {
      el.textContent = value;
    }
  });
};

/**
 * Resolves a dot-notation path against an object.
 * e.g. resolvePath({site:{name:'Cinetika'}}, 'site.name') → 'Cinetika'
 * @param {Object} obj
 * @param {string} path
 */
const resolvePath = (obj, path) =>
  path.split('.').reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);

/* ============================================================================
   7. INTERSECTION OBSERVER — fade-in on scroll
   ============================================================================ */
const initScrollAnimations = () => {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  // Pause all animations initially; let observer trigger them
  $$('.animate-fade-in-up, .animate-fade-in').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
};

/* ============================================================================
   8. GALLERY LIGHTBOX (minimal)
   ============================================================================ */
const initGalleryLightbox = () => {
  const galleryItems = $$('.gallery-item');
  if (!galleryItems.length) return;

  // Create lightbox overlay
  const overlay = document.createElement('div');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Galería de imágenes');
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 500;
    background: rgba(0,0,0,0.92);
    display: none; align-items: center; justify-content: center;
    cursor: zoom-out;
  `;

  const img = document.createElement('img');
  img.style.cssText = `
    max-width: 90vw; max-height: 90vh;
    object-fit: contain; border-radius: 8px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.8);
  `;
  img.alt = '';

  const close = document.createElement('button');
  close.textContent = '✕';
  close.setAttribute('aria-label', 'Cerrar');
  close.style.cssText = `
    position: absolute; top: 1.5rem; right: 1.5rem;
    background: rgba(255,255,255,0.15); color: #fff; border: none;
    width: 44px; height: 44px; border-radius: 50%; font-size: 1.1rem;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
  `;

  overlay.appendChild(img);
  overlay.appendChild(close);
  document.body.appendChild(overlay);

  const openLightbox = (src, alt) => {
    img.src = src;
    img.alt = alt || '';
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    close.focus();
  };

  const closeLightbox = () => {
    overlay.style.display = 'none';
    img.src = '';
    document.body.style.overflow = '';
  };

  galleryItems.forEach(item => {
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', () => {
      const imgEl = item.querySelector('img');
      if (imgEl) openLightbox(imgEl.src, imgEl.alt);
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const imgEl = item.querySelector('img');
        if (imgEl) openLightbox(imgEl.src, imgEl.alt);
      }
    });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
  });

  close.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
};

/* ============================================================================
   9. SCHEDULE TABS (for horarios page)
   ============================================================================ */
const initScheduleTabs = () => {
  const tabList   = $('.schedule-tabs');
  if (!tabList) return;

  const tabs      = $$('[role="tab"]', tabList);
  const panels    = $$('[role="tabpanel"]');

  const activate = (tab) => {
    tabs.forEach(t => {
      t.setAttribute('aria-selected', 'false');
      t.classList.remove('is-active');
    });
    panels.forEach(p => p.hidden = true);

    tab.setAttribute('aria-selected', 'true');
    tab.classList.add('is-active');

    const panelId = tab.getAttribute('aria-controls');
    const panel   = document.getElementById(panelId);
    if (panel) panel.hidden = false;
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activate(tab));

    tab.addEventListener('keydown', (e) => {
      let idx = i;
      if (e.key === 'ArrowRight') idx = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft')  idx = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home')       idx = 0;
      if (e.key === 'End')        idx = tabs.length - 1;
      if (idx !== i) { tabs[idx].focus(); activate(tabs[idx]); }
    });
  });

  if (tabs[0]) activate(tabs[0]);
};

/* ============================================================================
   10. INIT
   ============================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHeroCarousel();
  initSmoothScroll();
  initContactForm();
  initScrollAnimations();
  initGalleryLightbox();
  initScheduleTabs();

  // CMS: Load dynamic content — comment out if using SSR/static generation
  // loadCMSContent();
});

/* ============================================================================
   11. EXPORT (for module usage / testing)
   ============================================================================ */
// In a build-tool environment (Vite, Webpack, etc.) you would export:
// export { initNav, initHeroCarousel, loadCMSContent, bindCMSData };
