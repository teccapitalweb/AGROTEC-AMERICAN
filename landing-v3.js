document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('[data-ag3-menu]');
  const menu = document.querySelector('[data-ag3-mobile]');
  const nav = document.querySelector('.ag3-nav');
  const whatsapp = document.querySelector('.ag3-wa');

  const syncNav = () => {
    nav?.classList.toggle('is-compact', window.scrollY > 36);
    whatsapp?.classList.toggle('is-visible', window.scrollY > 240);
  };
  syncNav();
  window.addEventListener('scroll', syncNav, { passive: true });

  button?.addEventListener('click', () => {
    const open = menu?.classList.toggle('is-open') ?? false;
    button.setAttribute('aria-expanded', String(open));
  });

  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menu.classList.remove('is-open');
    button?.setAttribute('aria-expanded', 'false');
  }));

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll('.ag3-reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: '0px 0px -40px' });
  items.forEach((item) => observer.observe(item));

  // ── Telemetría y Analítica de Conversión ──────────────────────────────
  window.trackAgroEvent = function(eventName, eventParams = {}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...eventParams });
    if (typeof window.fbq === 'function') {
      if (eventName === 'select_plan') {
        window.fbq('track', 'InitiateCheckout', {
          value: eventParams.value,
          currency: eventParams.currency,
          content_name: eventParams.plan_name
        });
      } else if (eventName === 'whatsapp_click') {
        window.fbq('trackCustom', 'WhatsAppClick', eventParams);
      } else {
        window.fbq('trackCustom', eventName, eventParams);
      }
    }
  };

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!target) return;

    const waLink = target.closest('a[href*="wa.me"]');
    if (waLink) {
      const location = waLink.closest('.ag3-footer') ? 'footer' : waLink.closest('.ag3-wa') ? 'floating' : 'content';
      window.trackAgroEvent('whatsapp_click', { link_url: waLink.href, location });
      return;
    }

    const loginLink = target.closest('a[href*="/login"]');
    if (loginLink) {
      const location = loginLink.closest('.ag3-nav') ? 'navbar' : loginLink.closest('.ag3-mobile') ? 'mobile_menu' : 'content';
      window.trackAgroEvent('login_click', { link_url: loginLink.href, location });
      return;
    }

    const planBtn = target.closest('button[onclick*="iniciarCheckout"]');
    if (planBtn) {
      const attr = planBtn.getAttribute('onclick') || '';
      const isAnual = attr.includes('Anual');
      window.trackAgroEvent('select_plan', {
        plan_name: isAnual ? 'anual' : 'mensual',
        value: isAnual ? 1920 : 200,
        currency: 'MXN'
      });
      return;
    }

    const surveyLink = target.closest('a[href*="encuesta"]');
    if (surveyLink) {
      window.trackAgroEvent('survey_open', {
        location: surveyLink.closest('.ag3-nav') ? 'navbar' : 'content'
      });
    }
  });

  // ── Filtro y Buscador Dinámico del Catálogo V3 ────────────────────────
  const searchInput = document.getElementById('ag3CourseSearch');
  const searchClear = document.getElementById('ag3SearchClear');
  const countEl = document.getElementById('ag3CourseCount');
  const chips = document.querySelectorAll('.ag3-chip');
  const courseCards = document.querySelectorAll('.ag3-courses .ag3-course');
  const toggleBtn = document.getElementById('ag3ToggleAllCourses');

  let activeCat = 'all';
  let searchTerm = '';
  let isExpanded = false;

  const updateCourseVisibility = () => {
    let visibleCount = 0;
    const term = searchTerm.trim().toLowerCase();

    courseCards.forEach((card, idx) => {
      const cat = card.dataset.category || '';
      const keywords = (card.dataset.keywords || '') + ' ' + (card.querySelector('h3')?.textContent || '').toLowerCase();

      let matchesCat = (activeCat === 'all');
      if (activeCat !== 'all') matchesCat = (cat === activeCat);

      const matchesSearch = !term || keywords.includes(term);
      const passesFilter = matchesCat && matchesSearch;

      const shouldShow = passesFilter && (isExpanded || activeCat !== 'all' || term !== '' || idx < 6);

      card.hidden = !shouldShow;
      if (passesFilter) visibleCount++;
    });

    if (countEl) {
      if (term || activeCat !== 'all') {
        countEl.textContent = `Mostrando ${visibleCount} de ${courseCards.length} cursos encontrados`;
      } else {
        countEl.textContent = isExpanded ? `Mostrando los ${courseCards.length} cursos del catálogo` : `Mostrando 6 de ${courseCards.length} cursos destacados`;
      }
    }

    if (toggleBtn) {
      if (term || activeCat !== 'all') {
        toggleBtn.hidden = true;
      } else {
        toggleBtn.hidden = false;
        toggleBtn.textContent = isExpanded ? 'Ver menos cursos' : `Ver los ${courseCards.length} cursos del catálogo`;
      }
    }

    if (searchClear) {
      searchClear.hidden = !term;
    }
  };

  searchInput?.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    updateCourseVisibility();
  });

  searchClear?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    searchTerm = '';
    updateCourseVisibility();
    searchInput?.focus();
  });

  chips?.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      activeCat = chip.dataset.cat || 'all';
      updateCourseVisibility();
      window.trackAgroEvent?.('catalog_filter', { category: activeCat });
    });
  });

  toggleBtn?.addEventListener('click', () => {
    isExpanded = !isExpanded;
    updateCourseVisibility();
    if (!isExpanded) {
      document.getElementById('catalogo-real')?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  updateCourseVisibility();


  // ── Calculadora de Impacto Agro (ROI) ─────────────────────────────────
  const cropButtons = document.querySelectorAll('.ag3-roi__crop');
  const haSlider = document.getElementById('ag3RoiHa');
  const haVal = document.getElementById('ag3RoiHaVal');
  const lossEl = document.getElementById('ag3RoiLoss');
  const multipleEl = document.getElementById('ag3RoiMultiple');
  const verdictEl = document.getElementById('ag3RoiVerdict');

  let currentRiskPerHa = 28000;
  let currentCropName = 'Hortalizas';

  const updateRoiCalc = () => {
    const ha = parseInt(haSlider?.value || '2', 10);
    if (haVal) haVal.textContent = `${ha} ${ha === 1 ? 'Hectárea' : 'Hectáreas'}`;

    const totalRisk = currentRiskPerHa * ha;
    const annualMembership = 2400; // $200 x 12
    const multiple = Math.max(1, Math.round(totalRisk / annualMembership));
    const savedTenPercent = Math.round(totalRisk * 0.10);

    if (lossEl) lossEl.innerHTML = `$${totalRisk.toLocaleString('es-MX')} <small>MXN</small>`;
    if (multipleEl) multipleEl.textContent = `${multiple}x`;

    if (verdictEl) {
      const yearsPaid = (savedTenPercent / annualMembership).toFixed(1);
      verdictEl.innerHTML = `💡 Prevenir apenas el 10% de estas mermas protege <strong>$${savedTenPercent.toLocaleString('es-MX')} MXN</strong>, pagando más de ${yearsPaid} años de tu membresía.`;
    }
  };

  cropButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      cropButtons.forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-checked', 'true');
      currentRiskPerHa = parseInt(btn.dataset.risk || '28000', 10);
      currentCropName = btn.querySelector('b')?.textContent || 'Cultivo';
      updateRoiCalc();
      window.trackAgroEvent?.('roi_crop_selected', { crop: currentCropName, riskPerHa: currentRiskPerHa });
    });
  });

  haSlider?.addEventListener('input', () => {
    updateRoiCalc();
  });

  haSlider?.addEventListener('change', () => {
    window.trackAgroEvent?.('roi_slider_change', { hectares: haSlider.value, crop: currentCropName });
  });

  updateRoiCalc();

  // ── Registro de Service Worker para PWA Móvil ─────────────────────────
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }

});
