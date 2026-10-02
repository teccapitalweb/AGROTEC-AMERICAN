(() => {
  'use strict';

  const config = window.AGROTEC_ASSISTANT_CONFIG;
  if (!config || document.querySelector('[data-agx-root]')) return;

  const stateKey = config.storage?.sessionKey || `${config.id}-assistant`;
  const positionKey = `${config.id}-assistant-position`;
  const panelPositionKey = `${config.id}-assistant-panel-position`;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const stopwords = new Set(['quiero','curso','cursos','sobre','para','como','algo','una','uno','unos','unas','del','las','los','que','con','por','me','interesa','busco','aprender','capacitacion']);

  const safeRead = () => {
    try { return JSON.parse(sessionStorage.getItem(stateKey) || '{}'); } catch { return {}; }
  };
  const saved = safeRead();
  const readPosition = (key) => {
    try {
      const position = JSON.parse(localStorage.getItem(key) || '{}');
      return Number.isFinite(position.x) && Number.isFinite(position.y) ? position : { x: 0, y: 0 };
    } catch { return { x: 0, y: 0 }; }
  };
  const state = {
    open: false,
    paused: Boolean(saved.paused) || reducedMotion.matches,
    messages: Array.isArray(saved.messages) ? saved.messages : [],
    flow: saved.flow || 'home'
  };
  let launcherPosition = readPosition(positionKey);
  let panelPosition = readPosition(panelPositionKey);

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
  const normalize = (value) => String(value ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const tokens = (value) => normalize(value).split(' ').filter((token) => token.length > 2 && !stopwords.has(token));
  const timeNow = () => new Intl.DateTimeFormat('es-MX', { hour: '2-digit', minute: '2-digit' }).format(new Date());

  function save() {
    try {
      sessionStorage.setItem(stateKey, JSON.stringify({ paused: state.paused, messages: state.messages.slice(-30), flow: state.flow }));
    } catch {}
  }

  function readCatalog() {
    try {
      return [...document.querySelectorAll(config.catalog.cardSelector)].map((card) => {
        const meta = [...card.querySelectorAll(config.catalog.metaSelector)].map((node) => node.textContent.trim()).filter(Boolean);
        const link = card.querySelector(config.catalog.linkSelector);
        return {
          title: card.querySelector(config.catalog.titleSelector)?.textContent.trim() || '',
          area: meta[0] || '',
          level: meta[1] || '',
          detail: card.querySelector(config.catalog.detailSelector)?.textContent.trim() || '',
          modality: config.catalog.modality || '',
          href: link?.href || ''
        };
      }).filter((course) => course.title);
    } catch { return []; }
  }

  function readPlans() {
    try {
      return [...document.querySelectorAll(config.plans.cardSelector)].map((card) => ({
        label: card.querySelector(config.plans.labelSelector)?.textContent.trim() || 'Plan',
        price: card.querySelector(config.plans.priceSelector)?.innerText.replace(/\s+/g, ' ').trim() || '',
        description: card.querySelector(config.plans.descriptionSelector)?.textContent.trim() || ''
      })).filter((plan) => plan.price);
    } catch { return []; }
  }

  const root = document.createElement('div');
  root.dataset.agxRoot = '';
  root.dataset.agxState = 'idle';
  root.dataset.agxMotion = state.paused ? 'paused' : 'running';
  root.style.setProperty('--agx-primary', config.colors.primary);
  root.style.setProperty('--agx-primary-dark', config.colors.primaryDark);
  root.style.setProperty('--agx-accent', config.colors.accent);
  root.style.setProperty('--agx-accent-warm', config.colors.accentWarm);
  root.style.setProperty('--agx-mint', config.colors.mint);
  root.style.setProperty('--agx-surface', config.colors.surface);
  root.style.setProperty('--agx-ink', config.colors.ink);
  root.innerHTML = `
    <button class="agx-launcher" type="button" aria-label="Agro, asistente virtual movible. Arrástrala para cambiarla de lugar, usa las flechas para moverla o presiona Inicio para restaurarla. Toca para abrir el chat." title="Arrastra a Agro · toca para abrir" aria-expanded="false" data-agx-open>
      ${avatarMarkup('agx-avatar--launcher')}
      <span class="agx-prompts" aria-hidden="true">
        <span class="agx-prompt agx-prompt--one">¡Hola! Soy Agro <b>👋</b></span>
        <span class="agx-prompt agx-prompt--two">¿Qué quieres aprender?</span>
        <span class="agx-prompt agx-prompt--three">Encuentra tu curso ideal <b>→</b></span>
      </span>
      <span class="agx-launcher__hint" aria-hidden="true">Arrastra a Agro · toca para conversar</span>
    </button>
    <section class="agx-panel" role="dialog" aria-modal="false" aria-label="Conversación con ${escapeHtml(config.assistantName)}, asistente virtual" aria-hidden="true" data-agx-panel>
      <header class="agx-header">
        ${avatarMarkup('agx-avatar--header')}
        <span class="agx-header__title"><strong>${escapeHtml(config.assistantName)}</strong><small>${escapeHtml(config.assistantLabel)} · Guía de cursos</small></span>
        <span class="agx-header__actions">
          <button class="agx-icon-btn" type="button" aria-label="Repetir saludo" title="Repetir saludo" data-agx-wave>${icon('wave')}</button>
          <button class="agx-icon-btn" type="button" aria-label="${state.paused ? 'Reanudar' : 'Pausar'} movimiento" title="${state.paused ? 'Reanudar' : 'Pausar'} movimiento" data-agx-pause>${icon(state.paused ? 'play' : 'pause')}</button>
          <button class="agx-icon-btn" type="button" aria-label="Minimizar asistente" title="Minimizar" data-agx-close>${icon('minus')}</button>
        </span>
      </header>
      <div class="agx-disclosure">Respuestas guiadas con el catálogo visible de AgroTec. No hay una persona conectada; puedes contactar al equipo.</div>
      <div class="agx-messages" role="log" aria-live="polite" data-agx-messages></div>
      <div class="agx-typing" aria-label="El asistente está preparando una respuesta" data-agx-typing hidden><i></i><i></i><i></i></div>
      <div class="agx-quick" aria-label="Opciones rápidas" data-agx-quick></div>
      <form class="agx-composer" data-agx-form>
        <label class="agx-sr" for="agx-input">Escribe tu pregunta</label>
        <input id="agx-input" type="text" maxlength="280" autocomplete="off" placeholder="¿Qué te gustaría aprender?" data-agx-input>
        <button class="agx-send" type="submit" aria-label="Enviar mensaje">${icon('send')}</button>
      </form>
      <footer class="agx-footer"><button type="button" data-agx-human-footer>Hablar con un asesor</button><button type="button" data-agx-reset>Empezar de nuevo</button></footer>
    </section>`;
  document.body.append(root);

  const panel = root.querySelector('[data-agx-panel]');
  const launcher = root.querySelector('[data-agx-open]');
  const messagesEl = root.querySelector('[data-agx-messages]');
  const quickEl = root.querySelector('[data-agx-quick]');
  const typingEl = root.querySelector('[data-agx-typing]');
  const input = root.querySelector('[data-agx-input]');
  const pauseButton = root.querySelector('[data-agx-pause]');
  const panelDragHandle = root.querySelector('[data-agx-panel-drag]');
  let suppressLauncherClick = false;
  let keepLauncherOnScreen = () => {};
  let keepPanelOnScreen = () => {};

  if (!state.messages.length) {
    state.messages.push({ role: 'assistant', text: config.welcome, time: timeNow() });
    save();
  }
  renderMessages();
  showHomeActions();

  initLauncherDrag();
  initPanelDrag();
  launcher.addEventListener('click', (event) => {
    if (suppressLauncherClick) {
      event.preventDefault();
      return;
    }
    open();
  });
  root.querySelector('[data-agx-close]').addEventListener('click', close);
  root.querySelector('[data-agx-wave]').addEventListener('click', wave);
  pauseButton.addEventListener('click', togglePause);
  root.querySelector('[data-agx-human-footer]').addEventListener('click', () => handleInput('humano', 'Hablar con un asesor'));
  root.querySelector('[data-agx-reset]').addEventListener('click', resetConversation);
  root.querySelector('[data-agx-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    input.value = '';
    handleInput(value);
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && state.open) close(); });
  document.addEventListener('visibilitychange', syncVisibility);
  reducedMotion.addEventListener?.('change', () => { if (reducedMotion.matches) setPaused(true); });

  function avatarMarkup(extraClass) {
    const image = config.character.src
      ? `<img class="agx-avatar__open" src="${escapeHtml(config.character.src)}" alt="${escapeHtml(config.character.alt)}" onerror="this.remove()">`
      : '';
    const blinkImage = config.character.blinkSrc
      ? `<img class="agx-avatar__blink" src="${escapeHtml(config.character.blinkSrc)}" alt="" aria-hidden="true" onerror="this.remove()">`
      : '';
    const fallback = config.character.src ? '' : `<span class="agx-avatar__fallback" aria-hidden="true">${escapeHtml(config.character.placeholder || 'A')}</span>`;
    const dragAttributes = extraClass === 'agx-avatar--header'
      ? ' role="button" tabindex="0" data-agx-panel-drag aria-label="Mover el chatbot. Arrastra a Agro, usa las flechas para mover el panel o presiona Inicio para restaurarlo." title="Arrastra a Agro para mover el chat"'
      : '';
    return `<span class="agx-avatar ${extraClass}"${dragAttributes}>
      <span class="agx-avatar__art">${fallback}${image}${blinkImage}</span>
    </span>`;
  }

  function icon(name) {
    const paths = {
      send: '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
      minus: '<path d="M5 12h14"/>',
      pause: '<path d="M9 5v14M15 5v14"/>',
      play: '<path d="m9 6 9 6-9 6Z"/>',
      wave: '<path d="M8 11V6a1.5 1.5 0 0 1 3 0v4-6a1.5 1.5 0 0 1 3 0v6-5a1.5 1.5 0 0 1 3 0v8l2-2a1.8 1.8 0 0 1 2.5 2.5L17 19a5 5 0 0 1-3.8 1.8H11A6 6 0 0 1 5 15v-3a1.5 1.5 0 0 1 3 0v1"/>'
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`;
  }

  function open() {
    state.open = true;
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    launcher.hidden = true;
    launcher.setAttribute('aria-expanded', 'true');
    wave();
    requestAnimationFrame(() => {
      keepPanelOnScreen();
      input.focus({ preventScroll: true });
    });
  }

  function close() {
    state.open = false;
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    launcher.hidden = false;
    launcher.setAttribute('aria-expanded', 'false');
    root.dataset.agxState = 'idle';
    requestAnimationFrame(() => keepLauncherOnScreen());
    launcher.focus({ preventScroll: true });
  }

  function wave() {
    if (state.paused || document.hidden) return;
    root.dataset.agxState = 'wave';
    setTimeout(() => { if (root.dataset.agxState === 'wave') root.dataset.agxState = 'idle'; }, 2500);
  }

  function setPaused(value) {
    state.paused = value;
    root.dataset.agxMotion = value || document.hidden ? 'paused' : 'running';
    pauseButton.setAttribute('aria-label', value ? 'Reanudar movimiento' : 'Pausar movimiento');
    pauseButton.setAttribute('title', value ? 'Reanudar movimiento' : 'Pausar movimiento');
    pauseButton.innerHTML = icon(value ? 'play' : 'pause');
    save();
  }

  function togglePause() { setPaused(!state.paused); }
  function syncVisibility() {
    root.dataset.agxMotion = state.paused || document.hidden ? 'paused' : 'running';
  }

  function initLauncherDrag() {
    const applyPosition = () => {
      launcher.style.setProperty('--agx-drag-x', `${Math.round(launcherPosition.x)}px`);
      launcher.style.setProperty('--agx-drag-y', `${Math.round(launcherPosition.y)}px`);
    };
    const savePosition = () => {
      try { localStorage.setItem(positionKey, JSON.stringify(launcherPosition)); } catch {}
    };
    const moveWithinViewport = (deltaX, deltaY, rect = launcher.getBoundingClientRect()) => {
      const margin = 8;
      const safeX = Math.min(Math.max(deltaX, margin - rect.left), window.innerWidth - margin - rect.right);
      const safeY = Math.min(Math.max(deltaY, margin - rect.top), window.innerHeight - margin - rect.bottom);
      launcherPosition = { x: launcherPosition.x + safeX, y: launcherPosition.y + safeY };
      applyPosition();
    };
    const resetPosition = () => {
      launcherPosition = { x: 0, y: 0 };
      applyPosition();
      savePosition();
    };
    keepLauncherOnScreen = () => {
      if (launcher.hidden) return;
      moveWithinViewport(0, 0);
      savePosition();
    };

    applyPosition();
    let drag = null;

    launcher.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 || state.open) return;
      drag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startPosition: { ...launcherPosition },
        rect: launcher.getBoundingClientRect(),
        moved: false
      };
      launcher.setPointerCapture(event.pointerId);
    });

    launcher.addEventListener('pointermove', (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const rawX = event.clientX - drag.startX;
      const rawY = event.clientY - drag.startY;
      if (!drag.moved && Math.hypot(rawX, rawY) < 6) return;
      drag.moved = true;
      event.preventDefault();
      const margin = 8;
      const deltaX = Math.min(Math.max(rawX, margin - drag.rect.left), window.innerWidth - margin - drag.rect.right);
      const deltaY = Math.min(Math.max(rawY, margin - drag.rect.top), window.innerHeight - margin - drag.rect.bottom);
      launcherPosition = { x: drag.startPosition.x + deltaX, y: drag.startPosition.y + deltaY };
      applyPosition();
      launcher.classList.add('is-dragging');
    });

    const finishDrag = (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      suppressLauncherClick = drag.moved;
      if (drag.moved) savePosition();
      drag = null;
      launcher.classList.remove('is-dragging');
      if (suppressLauncherClick) setTimeout(() => { suppressLauncherClick = false; }, 0);
    };
    launcher.addEventListener('pointerup', finishDrag);
    launcher.addEventListener('pointercancel', finishDrag);

    launcher.addEventListener('keydown', (event) => {
      if (event.key === 'Home') {
        event.preventDefault();
        resetPosition();
        return;
      }
      const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
      const direction = directions[event.key];
      if (!direction) return;
      event.preventDefault();
      const distance = event.shiftKey ? 48 : 16;
      moveWithinViewport(direction[0] * distance, direction[1] * distance);
      savePosition();
    });

    window.addEventListener('resize', () => {
      if (state.open || launcher.hidden) return;
      moveWithinViewport(0, 0);
      savePosition();
    });
    requestAnimationFrame(() => {
      moveWithinViewport(0, 0);
      savePosition();
    });
  }

  function initPanelDrag() {
    if (!panelDragHandle) return;
    const applyPosition = () => {
      panel.style.setProperty('--agx-panel-drag-x', `${Math.round(panelPosition.x)}px`);
      panel.style.setProperty('--agx-panel-drag-y', `${Math.round(panelPosition.y)}px`);
    };
    const savePosition = () => {
      try { localStorage.setItem(panelPositionKey, JSON.stringify(panelPosition)); } catch {}
    };
    const getVisibleBounds = () => {
      const panelRect = panel.getBoundingClientRect();
      const mascotRect = panelDragHandle.getBoundingClientRect();
      return {
        left: Math.min(panelRect.left, mascotRect.left),
        top: Math.min(panelRect.top, mascotRect.top),
        right: Math.max(panelRect.right, mascotRect.right),
        bottom: Math.max(panelRect.bottom, mascotRect.bottom)
      };
    };
    const moveWithinViewport = (deltaX, deltaY, rect = getVisibleBounds()) => {
      const margin = 8;
      const safeX = Math.min(Math.max(deltaX, margin - rect.left), window.innerWidth - margin - rect.right);
      const safeY = Math.min(Math.max(deltaY, margin - rect.top), window.innerHeight - margin - rect.bottom);
      panelPosition = { x: panelPosition.x + safeX, y: panelPosition.y + safeY };
      applyPosition();
    };
    const resetPosition = () => {
      panelPosition = { x: 0, y: 0 };
      applyPosition();
      savePosition();
    };
    keepPanelOnScreen = () => {
      if (!state.open) return;
      moveWithinViewport(0, 0);
      savePosition();
    };

    applyPosition();
    let drag = null;
    panelDragHandle.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 || !state.open) return;
      event.preventDefault();
      drag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startPosition: { ...panelPosition },
        rect: getVisibleBounds()
      };
      panel.classList.add('is-dragging');
      panelDragHandle.setPointerCapture(event.pointerId);
    });
    panelDragHandle.addEventListener('pointermove', (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const margin = 8;
      const deltaX = Math.min(Math.max(event.clientX - drag.startX, margin - drag.rect.left), window.innerWidth - margin - drag.rect.right);
      const deltaY = Math.min(Math.max(event.clientY - drag.startY, margin - drag.rect.top), window.innerHeight - margin - drag.rect.bottom);
      panelPosition = { x: drag.startPosition.x + deltaX, y: drag.startPosition.y + deltaY };
      applyPosition();
    });
    const finishPanelDrag = (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      drag = null;
      panel.classList.remove('is-dragging');
      savePosition();
    };
    panelDragHandle.addEventListener('pointerup', finishPanelDrag);
    panelDragHandle.addEventListener('pointercancel', finishPanelDrag);
    panelDragHandle.addEventListener('keydown', (event) => {
      if (event.key === 'Home') {
        event.preventDefault();
        resetPosition();
        return;
      }
      const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
      const direction = directions[event.key];
      if (!direction) return;
      event.preventDefault();
      const distance = event.shiftKey ? 48 : 16;
      moveWithinViewport(direction[0] * distance, direction[1] * distance);
      savePosition();
    });
    window.addEventListener('resize', () => {
      if (!state.open) return;
      keepPanelOnScreen();
    });
  }

  function addMessage(role, text, extra = {}) {
    state.messages.push({ role, text, time: timeNow(), ...extra });
    save();
    renderMessages();
  }

  function renderMessages() {
    messagesEl.innerHTML = state.messages.map((message) => {
      const extra = message.kind === 'courses' ? courseCards(message.items || []) : message.kind === 'human' ? `<a href="${escapeHtml(config.humanContact.url)}" target="_blank" rel="noopener">${escapeHtml(config.humanContact.label)}</a>` : '';
      const name = message.role === 'assistant' ? '<div class="agx-message-name">AGRO · ASISTENTE VIRTUAL</div>' : '';
      return `<div class="agx-message-row ${message.role === 'user' ? 'is-user' : ''}">${name}<div class="agx-message">${escapeHtml(message.text)}${extra}<span class="agx-time">${escapeHtml(message.time)}</span></div></div>`;
    }).join('');
    requestAnimationFrame(() => { messagesEl.scrollTop = messagesEl.scrollHeight; });
  }

  function courseCards(items) {
    return `<div class="agx-course-list">${items.map((course) => `<article class="agx-course"><strong>${escapeHtml(course.title)}</strong><span>${escapeHtml([course.area, course.level, course.modality, course.detail].filter(Boolean).join(' · '))}</span>${course.href ? `<a href="${escapeHtml(course.href)}">Ver curso</a>` : ''}</article>`).join('')}</div>`;
  }

  function showQuick(items) {
    quickEl.innerHTML = '';
    items.forEach(({ label, value }) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'agx-chip';
      button.textContent = label;
      button.addEventListener('click', () => handleInput(value, label));
      quickEl.append(button);
    });
  }

  function showHomeActions() {
    showQuick([
      { label: 'Buscar un curso', value: 'buscar-curso' },
      { label: 'Conocer la membresía', value: 'membresia' },
      { label: 'Ver próximos cursos', value: 'proximos' },
      { label: 'Resolver una duda', value: 'duda' },
      { label: 'Hablar con un asesor', value: 'humano' }
    ]);
  }

  function resetConversation() {
    state.messages = [{ role: 'assistant', text: config.welcome, time: timeNow() }];
    state.flow = 'home';
    save();
    renderMessages();
    showHomeActions();
    wave();
    input.focus({ preventScroll: true });
  }

  async function handleInput(value, displayValue = value) {
    addMessage('user', displayValue);
    quickEl.innerHTML = '';
    setWaiting(true);
    await new Promise((resolve) => setTimeout(resolve, 380));
    setWaiting(false);

    const normalized = normalize(value);
    if (value === 'inicio') {
      state.flow = 'home'; save();
      reply('¿Qué te gustaría consultar ahora?');
      showHomeActions();
      return;
    }
    if (value === 'buscar-curso') {
      state.flow = 'search'; save();
      reply('¿Sobre qué cultivo, actividad o tema te gustaría aprender?');
      return;
    }
    if (value === 'membresia' || /membresia|agroclub|plan/.test(normalized)) { explainMembership(); return; }
    if (/en vivo|curso vivo|sesion vivo/.test(normalized)) {
      reply('La página confirma que AgroClub incluye sesiones en vivo, además de cursos en línea a tu ritmo. No publica aquí un calendario ni permite verificar si una actividad en vivo específica requiere inscripción adicional. Para ese dato conviene consultar a un asesor.');
      showQuick([{ label: 'Conocer la membresía', value: 'membresia' }, { label: 'Consultar por WhatsApp', value: 'humano' }]);
      return;
    }
    if (value === 'proximos' || /proximo|fecha|cuando|inicia/.test(normalized)) {
      reply('Esta landing no publica un calendario verificable de próximas fechas. No voy a inventarlo. Puedo ayudarte a explorar el catálogo grabado o abrir WhatsApp para preguntar por cursos en vivo.');
      showQuick([{ label: 'Explorar catálogo', value: 'buscar-curso' }, { label: 'Consultar por WhatsApp', value: 'humano' }]);
      return;
    }
    if (value === 'duda') {
      state.flow = 'question'; save();
      reply('Claro. Escribe una pregunta sobre acceso, aprendizaje, membresía o certificados.');
      return;
    }
    if (value === 'humano' || /asesor|persona|humano|whatsapp|contact/.test(normalized)) { offerHuman(); return; }
    if (/certificado|constancia|folio|qr/.test(normalized)) {
      reply('La página indica que AgroClub ofrece certificados verificables. Para conocer los requisitos exactos de un curso, conviene revisarlo en el portal o confirmarlo con un asesor.');
      showQuick([{ label: 'Buscar un curso', value: 'buscar-curso' }, { label: 'Hablar con un asesor', value: 'humano' }]);
      return;
    }
    if (/precio|cuesta|costo|compar/.test(normalized)) { explainMembership(true); return; }
    if (/acceso|entrar|login|cuenta|contrasena/.test(normalized)) {
      reply('Puedes entrar desde “Quiero entrar” en la parte superior. El asistente no modifica tu cuenta, inicio de sesión ni pagos.');
      return;
    }
    if (state.flow === 'search' || /curso|aprender|cultivo|agricultura|berries|amaranto|flor|nutricion|hierba/.test(normalized)) { searchCourses(value); return; }

    reply('No tengo una respuesta verificada para esa consulta. Puedo ayudarte a buscar un curso, explicar la membresía o abrir WhatsApp para atención humana.');
    showHomeActions();
  }

  function setWaiting(waiting) {
    typingEl.hidden = !waiting;
    root.dataset.agxState = waiting ? 'waiting' : 'idle';
  }

  function reply(text, extra = {}) {
    root.dataset.agxState = 'response';
    addMessage('assistant', text, extra);
    setTimeout(() => { if (root.dataset.agxState === 'response') root.dataset.agxState = 'idle'; }, 650);
  }

  function searchCourses(query) {
    const catalog = readCatalog();
    state.flow = 'home'; save();
    if (!catalog.length) {
      reply('No pude leer el catálogo en este momento. No mostraré cursos de ejemplo como si fueran reales.');
      showQuick([{ label: 'Hablar con un asesor', value: 'humano' }]);
      return;
    }
    const wanted = tokens(query);
    const ranked = catalog.map((course) => {
      const haystack = normalize(`${course.title} ${course.area} ${course.level}`);
      const score = wanted.reduce((total, token) => total + (haystack.includes(token) ? 2 : 0), 0);
      return { course, score };
    }).sort((a, b) => b.score - a.score);
    const matches = ranked.filter((item) => item.score > 0).slice(0, 3).map((item) => item.course);
    const selected = matches.length ? matches : catalog.slice(0, 3);
    const intro = matches.length ? 'Encontré estas opciones relacionadas en el catálogo visible:' : 'No encontré una coincidencia exacta. Estas son algunas opciones disponibles en el catálogo visible:';
    reply(intro, { kind: 'courses', items: selected });
    showQuick([{ label: 'Buscar otro tema', value: 'buscar-curso' }, { label: 'Conocer la membresía', value: 'membresia' }, { label: 'Hablar con un asesor', value: 'humano' }]);
  }

  function explainMembership(compare = false) {
    const plans = readPlans();
    state.flow = 'home'; save();
    if (!plans.length) {
      reply('No pude verificar los planes visibles en la página. Prefiero no mostrar precios de ejemplo.');
      showQuick([{ label: 'Hablar con un asesor', value: 'humano' }]);
      return;
    }
    const summary = plans.map((plan) => `${plan.label}: ${plan.price}${plan.description ? ` — ${plan.description}` : ''}`).join('\n\n');
    reply(`${compare ? 'Comparación con los datos publicados en esta página:' : 'AgroClub incluye el catálogo de cursos en línea a tu ritmo, materiales, sesiones en vivo, herramientas y comunidad. La landing no publica un calendario de actividades en vivo.'}\n\n${summary}`);
    showQuick([{ label: 'Buscar un curso', value: 'buscar-curso' }, { label: '¿Cómo obtengo certificado?', value: '¿Cómo obtengo mi certificado?' }, { label: 'Hablar con un asesor', value: 'humano' }]);
  }

  function offerHuman() {
    state.flow = 'home'; save();
    reply(config.humanContact.disclosure, { kind: 'human' });
    showQuick([{ label: 'Volver a opciones', value: 'inicio' }]);
  }
})();
