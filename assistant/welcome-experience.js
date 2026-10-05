(() => {
  'use strict';

  if (document.querySelector('[data-agx-welcome]')) return;

  const cookieKey = 'agrotec-cookie-notice-v1';
  const escapeKey = (event) => event.key === 'Escape' || event.key === 'Esc';
  const mascot = 'assistant/assets/agro-robot-v6.png';

  const welcome = document.createElement('div');
  welcome.className = 'agx-welcome-layer';
  welcome.dataset.agxWelcome = '';
  welcome.hidden = true;
  welcome.innerHTML = `
    <div class="agx-welcome__backdrop" aria-hidden="true"></div>
    <section class="agx-welcome__card" role="dialog" aria-modal="true" aria-labelledby="agx-welcome-title">
      <img class="agx-welcome__mascot" src="${mascot}" alt="" width="256" height="384" draggable="false">
      <button class="agx-welcome__close" type="button" aria-label="Cerrar invitación" data-agx-welcome-close>×</button>
      <p class="agx-welcome__eyebrow">Tu guía AgroTec</p>
      <h2 class="agx-welcome__title" id="agx-welcome-title">¡Hola! Quiero conocerte un poquito para recomendarte una ruta hecha para ti.</h2>
      <p class="agx-welcome__note">¿Comenzamos? Son 7 preguntas sencillas y toma menos de 2 minutos.</p>
      <ul class="agx-welcome__features" aria-label="Características del cuestionario">
        <li>Sin nombre</li>
        <li>Sin teléfono</li>
        <li>Resultado inmediato</li>
      </ul>
      <div class="agx-welcome__actions">
        <button class="agx-welcome__button agx-welcome__button--primary" type="button" data-agx-welcome-start>Preparar mi ruta</button>
        <button class="agx-welcome__button agx-welcome__button--secondary" type="button" data-agx-welcome-close>Ahora no</button>
      </div>
    </section>`;

  const cookie = document.createElement('aside');
  cookie.className = 'agx-cookie';
  cookie.dataset.agxCookie = '';
  cookie.hidden = true;
  cookie.setAttribute('role', 'dialog');
  cookie.setAttribute('aria-label', 'Aviso de cookies');
  cookie.innerHTML = `
    <div class="agx-cookie__copy">
      <strong>Tu privacidad importa</strong>
      <span>Usamos cookies necesarias para que el sitio funcione y guardar tus preferencias. Consulta nuestra <a href="privacidad.html">Política de Privacidad</a>.</span>
    </div>
    <button class="agx-cookie__accept" type="button" data-agx-cookie-accept>Acepto</button>`;

  document.body.append(welcome, cookie);

  const card = welcome.querySelector('.agx-welcome__card');
  const startButton = welcome.querySelector('[data-agx-welcome-start]');
  const closeButtons = [...welcome.querySelectorAll('[data-agx-welcome-close]')];
  const acceptButton = cookie.querySelector('[data-agx-cookie-accept]');
  let lastFocus = null;

  function openWelcome() {
    lastFocus = document.activeElement;
    welcome.hidden = false;
    document.body.classList.add('agx-welcome-open');
    requestAnimationFrame(() => {
      welcome.classList.add('is-open');
      startButton.focus({ preventScroll: true });
    });
  }

  function closeWelcome() {
    welcome.classList.remove('is-open');
    document.body.classList.remove('agx-welcome-open');
    setTimeout(() => { welcome.hidden = true; }, 270);
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus({ preventScroll: true });
  }

  function keepFocusInside(event) {
    if (event.key !== 'Tab' || welcome.hidden) return;
    const focusable = [...card.querySelectorAll('button, a[href]')].filter((element) => !element.disabled);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  closeButtons.forEach((button) => button.addEventListener('click', closeWelcome));
  startButton.addEventListener('click', () => { window.location.assign('/encuesta/'); });
  document.addEventListener('keydown', (event) => {
    if (escapeKey(event) && !welcome.hidden) closeWelcome();
    else keepFocusInside(event);
  });

  let cookiesAccepted = false;
  try { cookiesAccepted = localStorage.getItem(cookieKey) === 'accepted'; } catch {}
  window.agrotecCookieConsent = { necessary: true, preferences: cookiesAccepted };
  if (!cookiesAccepted) cookie.hidden = false;

  acceptButton.addEventListener('click', () => {
    try { localStorage.setItem(cookieKey, 'accepted'); } catch {}
    window.agrotecCookieConsent = { necessary: true, preferences: true, acceptedAt: new Date().toISOString() };
    cookie.hidden = true;
  });

  // Se abre en cada carga por solicitud del proyecto; no se guarda una marca de cierre.
  openWelcome();
})();
