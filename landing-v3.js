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
});
