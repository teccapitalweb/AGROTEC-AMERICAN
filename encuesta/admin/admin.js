/* ==========================================================================
   AgroTec América · Panel administrativo de la encuesta
   Pestañas: Resumen (gráficas) · Preguntas · Cursos · Respuestas · Textos
   Acceso: Google (Firebase Auth) + documento en `encuesta_admins/{correo}`.
   ========================================================================== */
(() => {
  'use strict';

  const DEFAULTS = window.AGROTEC_ENCUESTA_DEFAULTS;
  const { clone, normalizeConfig } = window.AGROTEC_ENCUESTA_UTILS;
  const FB = window.AGROTEC_FIREBASE;
  const SITE_BASE = '../../';
  const PAGE_SIZE = 50;
  const MAX_RESPONSES = 3000;
  /* Serie categórica validada (orden fijo). El color sigue a la opción, no al ranking. */
  const PALETTE = ['#5c8c3a', '#2a78d6', '#eb6834', '#4a3aa7', '#eda100', '#e87ba4', '#1baf7a', '#e34948'];
  const OTHER_COLOR = '#b9c0b8';
  const STAT_ICONS = ['list', 'clock', 'lock'];
  const BRAND_ICONS = ['brand:instagram', 'brand:facebook', 'brand:tiktok', 'brand:google', 'brand:whatsapp'];

  /* ---------- Utilidades ---------- */
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad2 = (n) => String(n).padStart(2, '0');
  const num = (n) => Number(n || 0).toLocaleString('es-MX');
  const pct = (part, total) => (total ? Math.round((part / total) * 100) : 0);
  const slug = (text) => String(text || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
  const uid = () => Math.random().toString(36).slice(2, 7);
  const assetUrl = (path) => (!path ? '' : /^(https?:)?\/\//i.test(path) || path.startsWith('/') ? path : SITE_BASE + path);
  const startOfDay = (date) => { const d = new Date(date); d.setHours(0, 0, 0, 0); return d; };
  const dayKey = (date) => `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
  const fmtDate = (date) => (date ? date.toLocaleString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—');
  const fmtDay = (date) => date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
  const relTime = (date) => {
    if (!date) return '—';
    const diff = Math.round((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return 'hace un momento';
    if (diff < 3600) return `hace ${Math.round(diff / 60)} min`;
    if (diff < 86400) return `hace ${Math.round(diff / 3600)} h`;
    return `hace ${Math.round(diff / 86400)} días`;
  };
  const getPath = (obj, path) => path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
  const setPath = (obj, path, value) => {
    const keys = path.split('.');
    const last = keys.pop();
    const target = keys.reduce((acc, key) => (acc[key] == null ? (acc[key] = {}) : acc[key]), obj);
    target[last] = value;
  };
  const move = (array, from, to) => {
    if (to < 0 || to >= array.length) return;
    const [item] = array.splice(from, 1);
    array.splice(to, 0, item);
  };

  const ICON = {
    up: '<svg viewBox="0 0 24 24"><path d="m6 14 6-6 6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24"><path d="m6 10 6 6 6-6"/></svg>',
    trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
    caret: '<svg class="item__caret" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>'
  };

  /* ---------- Estado ---------- */
  const state = {
    user: null, authKit: null,
    config: null, configExists: false, draft: null, dirty: false,
    responses: [], loadedAt: null,
    tab: 'resumen', period: 'all',
    open: { preguntas: new Set([0]), cursos: new Set() },
    search: { respuestas: '', cursos: '' }, cursosFilter: 'all', page: 1
  };

  const els = {
    gate: $('#gate'), gateText: $('#gate-text'), gateNote: $('#gate-note'), btnLogin: $('#btn-login'), btnLogoutGate: $('#btn-logout-gate'),
    panel: $('#panel'), status: $('#topbar-status'), userChip: $('#user-chip'), btnLogout: $('#btn-logout'),
    tabs: $('.tabs'), content: $('.content'), banner: $('#banner'), savebar: $('#savebar'), btnSave: $('#btn-save'), btnDiscard: $('#btn-discard'),
    tooltip: $('#tooltip'), toast: $('#toast')
  };
  const view = (name) => $(`#view-${name}`);

  /* ---------- Avisos ---------- */
  let toastTimer = 0;
  const toast = (message, type = '') => {
    els.toast.textContent = message;
    els.toast.className = `toast ${type ? `is-${type}` : ''}`;
    els.toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { els.toast.hidden = true; }, 3800);
  };
  const setStatus = (text) => { els.status.textContent = text; };

  /* ---------- Acceso ---------- */
  const showGate = (mode = 'login', detail = '') => {
    els.panel.hidden = true;
    els.gate.hidden = false;
    els.gateNote.className = 'gate__note';
    if (mode === 'denied') {
      els.gateText.textContent = `La cuenta ${state.user?.email || ''} no tiene acceso al panel.`;
      els.gateNote.textContent = 'Pide que agreguen tu correo a la lista de administradores (encuesta/firebase-shared.js o Firestore → encuesta_admins).';
      els.gateNote.classList.add('is-error');
      els.btnLogin.hidden = true;
      els.btnLogoutGate.hidden = false;
      return;
    }
    els.gateText.textContent = 'Inicia sesión con tu cuenta de Google autorizada para ver las respuestas y editar la encuesta.';
    els.gateNote.textContent = detail;
    if (detail) els.gateNote.classList.add('is-error');
    els.btnLogin.hidden = false;
    els.btnLogoutGate.hidden = true;
  };

  const showPanel = () => {
    els.gate.hidden = true;
    els.panel.hidden = false;
    const user = state.user;
    const initial = (user.displayName || user.email || '?').trim().charAt(0).toUpperCase();
    els.userChip.innerHTML = `${user.photoURL ? `<img src="${esc(user.photoURL)}" alt="" referrerpolicy="no-referrer">` : `<span class="avatar">${esc(initial)}</span>`}<b>${esc(user.email || '')}</b>`;
  };

  const isAdmin = async (user) => {
    const email = String(user.email || '').toLowerCase();
    if (!email) return false;
    if ((FB.ADMIN_EMAILS || []).map((e) => String(e).toLowerCase()).includes(email)) return true;
    try {
      const { db, doc, getDoc } = await FB.getDb();
      const snap = await getDoc(doc(db, FB.COLLECTIONS.admins, email));
      return snap.exists();
    } catch (error) {
      console.warn('[panel] No se pudo verificar el acceso', error);
      return false;
    }
  };

  const login = async () => {
    const kit = state.authKit;
    if (!kit) return;
    els.btnLogin.classList.add('is-busy');
    els.gateNote.textContent = '';
    try {
      const provider = new kit.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await kit.signInWithPopup(kit.auth, provider);
    } catch (error) {
      console.error('[panel] Error al iniciar sesión', error);
      const code = error?.code || '';
      const message = code === 'auth/popup-closed-by-user' ? 'Cerraste la ventana de Google antes de terminar.'
        : code === 'auth/unauthorized-domain' ? 'Este dominio no está autorizado en Firebase Auth.'
        : 'No se pudo iniciar sesión. Intenta de nuevo.';
      showGate('login', message);
    } finally {
      els.btnLogin.classList.remove('is-busy');
    }
  };

  const logout = async () => {
    if (state.dirty && !window.confirm('Tienes cambios sin guardar. ¿Salir de todos modos?')) return;
    state.dirty = false;
    els.savebar.hidden = true;
    try { await state.authKit.signOut(state.authKit.auth); } catch { /* ignorar */ }
  };

  /* ---------- Datos ---------- */
  const loadConfig = async () => {
    const { db, doc, getDoc } = await FB.getDb();
    const snap = await getDoc(doc(db, FB.COLLECTIONS.config, 'main'));
    state.configExists = snap.exists();
    state.config = normalizeConfig(snap.exists() ? snap.data() : null);
    state.draft = clone(state.config);
    state.dirty = false;
    els.savebar.hidden = true;
  };

  const loadResponses = async () => {
    const { db, collection, getDocs, query, orderBy, limit } = await FB.getDb();
    const snap = await getDocs(query(collection(db, FB.COLLECTIONS.responses), orderBy('createdAt', 'desc'), limit(MAX_RESPONSES)));
    state.responses = snap.docs.map((d) => {
      const data = d.data() || {};
      const createdAt = data.createdAt && typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate() : null;
      return {
        id: d.id, createdAt, answers: data.answers || {}, labels: data.labels || {}, recommended: Array.isArray(data.recommended) ? data.recommended : [],
        device: data.device || '', durationSec: Number.isFinite(data.durationSec) ? data.durationSec : null, configVersion: data.configVersion ?? '', ref: data.ref || ''
      };
    });
    state.loadedAt = new Date();
  };

  const showBanner = (html) => {
    els.banner.innerHTML = html;
    els.banner.hidden = !html;
  };

  const loadAll = async () => {
    setStatus('Cargando datos…');
    const results = await Promise.allSettled([loadConfig(), loadResponses()]);
    const failed = results.filter((r) => r.status === 'rejected').map((r) => r.reason);
    if (results[0].status === 'rejected') {
      /* Sin acceso a la configuración: trabajar con la predeterminada para que el panel sea usable. */
      state.configExists = false;
      state.config = normalizeConfig(null);
      state.draft = clone(state.config);
      state.dirty = false;
      els.savebar.hidden = true;
    }
    if (results[1].status === 'rejected') state.responses = [];
    updateTabBadges();
    render();
    if (failed.length) {
      console.error('[panel] Error cargando datos', failed);
      setStatus('Sin conexión con Firestore');
      const denied = failed.some((e) => e?.code === 'permission-denied');
      showBanner(denied
        ? '<strong>Firestore rechazó la lectura.</strong> Faltan las reglas de seguridad de la encuesta: copia el bloque de <code>encuesta/admin/README.md</code> en Firebase → Firestore → Reglas y vuelve a cargar. Hasta entonces no se verán respuestas ni se podrán guardar cambios.'
        : '<strong>No se pudieron cargar los datos.</strong> Revisa tu conexión y vuelve a intentar.');
      return;
    }
    showBanner('');
    setStatus(`${num(state.responses.length)} respuestas · actualizado ${relTime(state.loadedAt)}`);
  };

  const validateDraft = (draft) => {
    const errors = [];
    const ids = new Set();
    draft.preguntas.forEach((q, i) => {
      const n = `Pregunta ${i + 1}`;
      const id = String(q.id || '').trim();
      if (!id) errors.push(`${n}: falta el ID.`);
      else if (ids.has(id)) errors.push(`${n}: el ID "${id}" está repetido.`);
      ids.add(id);
      if (!String(q.title || '').trim()) errors.push(`${n}: falta el título.`);
      if (!Array.isArray(q.options) || q.options.length < 2) errors.push(`${n}: necesita al menos 2 opciones.`);
      const values = new Set();
      (q.options || []).forEach((o, j) => {
        const value = String(o.value || '').trim();
        if (!String(o.title || '').trim()) errors.push(`${n}, opción ${j + 1}: falta el texto.`);
        if (!value) errors.push(`${n}, opción ${j + 1}: falta el valor interno.`);
        else if (values.has(value)) errors.push(`${n}, opción ${j + 1}: el valor "${value}" está repetido.`);
        values.add(value);
      });
      if (q.type === 'multi' && !(Number(q.max) >= 1)) errors.push(`${n}: el máximo de opciones debe ser 1 o más.`);
    });
    const cids = new Set();
    draft.cursos.forEach((c, i) => {
      const n = `Curso ${i + 1}`;
      const id = String(c.id || '').trim();
      if (!id) errors.push(`${n}: falta el ID.`);
      else if (cids.has(id)) errors.push(`${n}: el ID "${id}" está repetido.`);
      cids.add(id);
      if (!String(c.title || '').trim()) errors.push(`${n}: falta el nombre.`);
    });
    return errors;
  };

  const cleanDraft = (draft) => {
    const out = clone(draft);
    out.preguntas = out.preguntas.map((q) => ({
      id: String(q.id).trim(), kicker: q.kicker || '', title: q.title, hint: q.hint || '',
      type: q.type === 'multi' ? 'multi' : 'single', max: Math.max(1, Number(q.max) || 3),
      layout: ['list', 'tiles', 'chips'].includes(q.layout) ? q.layout : 'list',
      options: q.options.map((o) => ({ value: String(o.value).trim(), icon: o.icon || '', title: o.title, detail: o.detail || '' }))
    }));
    out.cursos = out.cursos.map((c) => ({
      id: String(c.id).trim(), title: c.title, category: c.category || '', level: c.level || '', image: c.image || '', url: c.url || '',
      areas: Array.isArray(c.areas) ? c.areas : [], available: c.available !== false
    }));
    return out;
  };

  const save = async () => {
    const errors = validateDraft(state.draft);
    if (errors.length) {
      toast(errors[0] + (errors.length > 1 ? ` (+${errors.length - 1} más)` : ''), 'error');
      return;
    }
    els.btnSave.classList.add('is-busy');
    els.btnSave.textContent = 'Guardando…';
    try {
      const { db, doc, setDoc, serverTimestamp } = await FB.getDb();
      const data = cleanDraft(state.draft);
      data.version = (Number(state.config.version) || 0) + 1;
      await setDoc(doc(db, FB.COLLECTIONS.config, 'main'), { ...data, updatedAt: serverTimestamp(), updatedBy: state.user?.email || '' });
      state.config = clone(data);
      state.draft = clone(data);
      state.configExists = true;
      state.dirty = false;
      els.savebar.hidden = true;
      toast('Cambios publicados. La encuesta ya los usa.', 'ok');
      render();
    } catch (error) {
      console.error('[panel] Error al guardar', error);
      toast(error?.code === 'permission-denied' ? 'Firestore rechazó el guardado. Revisa que tu correo esté en encuesta_admins.' : 'No se pudo guardar. Intenta de nuevo.', 'error');
    } finally {
      els.btnSave.classList.remove('is-busy');
      els.btnSave.textContent = 'Guardar cambios';
    }
  };

  const discard = () => {
    state.draft = clone(state.config);
    state.dirty = false;
    els.savebar.hidden = true;
    render();
  };

  const markDirty = () => {
    state.dirty = true;
    els.savebar.hidden = false;
  };

  /* ---------- Análisis ---------- */
  const periodSince = () => {
    const now = new Date();
    if (state.period === 'today') return startOfDay(now);
    if (state.period === '7d') return new Date(now.getTime() - 7 * 86400000);
    if (state.period === '30d') return new Date(now.getTime() - 30 * 86400000);
    return null;
  };
  const filteredResponses = () => {
    const since = periodSince();
    return since ? state.responses.filter((r) => r.createdAt && r.createdAt >= since) : state.responses;
  };

  const valuesFor = (response, question) => {
    const raw = response.answers?.[question.id];
    return Array.isArray(raw) ? raw : raw != null && raw !== '' ? [raw] : [];
  };

  const labelsFor = (response, question) => {
    const stored = response.labels?.[question.id];
    if (Array.isArray(stored) && stored.length) return stored;
    return valuesFor(response, question).map((v) => question.options.find((o) => o.value === v)?.title || String(v));
  };

  const countQuestion = (question, rows) => {
    const counts = new Map(question.options.map((o) => [o.value, 0]));
    let legacy = 0;
    let respondents = 0;
    rows.forEach((row) => {
      const values = valuesFor(row, question);
      if (!values.length) return;
      respondents += 1;
      values.forEach((v) => { if (counts.has(v)) counts.set(v, counts.get(v) + 1); else legacy += 1; });
    });
    const data = question.options.map((o, i) => ({ key: o.value, label: o.title, count: counts.get(o.value) || 0, color: i < PALETTE.length ? PALETTE[i] : OTHER_COLOR }));
    if (question.options.length > PALETTE.length) {
      const head = data.slice(0, PALETTE.length - 1);
      const tail = data.slice(PALETTE.length - 1);
      head.push({ key: '__fold', label: 'Otras opciones', count: tail.reduce((s, d) => s + d.count, 0), color: OTHER_COLOR, folded: tail });
      data.splice(0, data.length, ...head);
    }
    if (legacy) data.push({ key: '__legacy', label: 'Opciones anteriores', count: legacy, color: OTHER_COLOR });
    return { data, respondents, total: data.reduce((s, d) => s + d.count, 0) };
  };

  /* ---------- Gráficas ---------- */
  const donutMarkup = (stats) => {
    const r = 44; const C = 2 * Math.PI * r;
    const active = stats.data.filter((d) => d.count > 0);
    let offset = 0;
    const gap = active.length > 1 ? 2.5 : 0;
    const segments = stats.data.map((d, i) => {
      if (!d.count) return '';
      const len = (d.count / stats.total) * C;
      const dash = Math.max(0.6, len - gap);
      const markup = `<circle class="donut__seg" data-i="${i}" cx="60" cy="60" r="${r}" fill="none" stroke="${d.color}" stroke-width="16" stroke-dasharray="${dash.toFixed(2)} ${(C - dash).toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}" transform="rotate(-90 60 60)"></circle>`;
      offset += len;
      return markup;
    }).join('');
    const legend = stats.data.map((d, i) => `
      <li data-i="${i}" data-label="${esc(d.label)}" data-count="${d.count}" data-pct="${pct(d.count, stats.total)}">
        <i style="background:${d.color}"></i>
        <span title="${esc(d.label)}">${esc(d.label)}</span>
        <b>${num(d.count)}<em>${pct(d.count, stats.total)}%</em></b>
      </li>`).join('');
    return `
      <div class="donut" data-chart="donut">
        <svg viewBox="0 0 120 120" role="img" aria-label="Distribución de respuestas">
          ${stats.total ? segments : `<circle cx="60" cy="60" r="${r}" fill="none" stroke="#edeee8" stroke-width="16"></circle>`}
          <text class="donut__total" x="60" y="58" text-anchor="middle">${num(stats.respondents)}</text>
          <text class="donut__total-label" x="60" y="72" text-anchor="middle">respuestas</text>
        </svg>
        <ul class="legend">${legend}</ul>
      </div>`;
  };

  const barsMarkup = (items, denominator, denominatorLabel = 'de quienes respondieron') => {
    const max = Math.max(1, ...items.map((d) => d.count));
    return `
      <div class="bars" data-chart="bars">
        ${items.map((d, i) => `
          <div class="bar" data-i="${i}" data-label="${esc(d.label)}" data-count="${d.count}" data-pct="${pct(d.count, denominator)}">
            <span class="bar__label" title="${esc(d.label)}">${esc(d.label)}</span>
            <span class="bar__track"><i class="bar__fill" style="width:${(d.count / max) * 100}%"></i><span class="bar__value">${num(d.count)}<em>${pct(d.count, denominator)}%</em></span></span>
          </div>`).join('')}
      </div>
      <p class="small muted" style="margin:12px 0 0">Porcentaje ${esc(denominatorLabel)}.</p>`;
  };

  const columnsMarkup = (days) => {
    const max = Math.max(1, ...days.map((d) => d.count));
    return `
      <div class="columns" data-chart="columns">
        ${days.map((d) => `<div class="col" data-label="${esc(d.label)}" data-count="${d.count}"><i style="height:${Math.max(2, (d.count / max) * 100)}%"></i></div>`).join('')}
      </div>
      <div class="columns__axis"><span>${esc(days[0].label)}</span><span>${esc(days[days.length - 1].label)}</span></div>`;
  };

  const chartCard = (eyebrow, title, body, wide = false) => `
    <article class="card ${wide ? 'chart-card--wide' : ''}">
      <div class="card__head"><div><p class="eyebrow">${esc(eyebrow)}</p><h3>${esc(title)}</h3></div></div>
      <div class="card__body">${body}</div>
    </article>`;

  /* ---------- Vista: Resumen ---------- */
  const renderResumen = () => {
    const rows = filteredResponses();
    const all = state.responses;
    const now = new Date();
    const today = startOfDay(now);
    const week = new Date(now.getTime() - 7 * 86400000);
    const mobile = rows.filter((r) => r.device === 'mobile').length;
    const durations = rows.map((r) => r.durationSec).filter((s) => Number.isFinite(s) && s > 0 && s < 3600);
    const avgSec = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : null;
    const periodLabel = { all: 'en total', today: 'hoy', '7d': 'en 7 días', '30d': 'en 30 días' }[state.period];

    const days = [];
    for (let i = 13; i >= 0; i -= 1) {
      const d = new Date(today.getTime() - i * 86400000);
      days.push({ key: dayKey(d), label: fmtDay(d), count: 0 });
    }
    all.forEach((r) => { if (!r.createdAt) return; const hit = days.find((d) => d.key === dayKey(r.createdAt)); if (hit) hit.count += 1; });

    const courseCounts = new Map();
    rows.forEach((r) => r.recommended.forEach((id) => courseCounts.set(id, (courseCounts.get(id) || 0) + 1)));
    const courseItems = Array.from(courseCounts.entries())
      .map(([id, count]) => ({ label: state.config.cursos.find((c) => c.id === id)?.title || id, count }))
      .sort((a, b) => b.count - a.count);
    const topCourses = courseItems.slice(0, 8);
    if (courseItems.length > 8) topCourses.push({ label: 'Otros cursos', count: courseItems.slice(8).reduce((s, d) => s + d.count, 0) });

    view('resumen').innerHTML = `
      <div class="view__head">
        <div><h2>Resumen</h2><p>Qué están contestando las personas que llegan a la encuesta. Las gráficas usan el periodo seleccionado.</p></div>
        <div class="view__tools">
          <div class="seg" role="group" aria-label="Periodo">
            ${[['all', 'Todo'], ['today', 'Hoy'], ['7d', '7 días'], ['30d', '30 días']].map(([v, l]) => `<button type="button" class="${state.period === v ? 'is-active' : ''}" data-action="period" data-value="${v}">${l}</button>`).join('')}
          </div>
          <button class="btn btn--line btn--sm" type="button" data-action="reload">Actualizar</button>
        </div>
      </div>
      <div class="grid-kpi">
        <div class="card kpi"><span class="kpi__label">Respuestas ${esc(periodLabel)}</span><span class="kpi__value">${num(rows.length)}</span><span class="kpi__delta">${num(all.length)} desde el inicio</span></div>
        <div class="card kpi"><span class="kpi__label">Hoy</span><span class="kpi__value">${num(all.filter((r) => r.createdAt && r.createdAt >= today).length)}</span><span class="kpi__delta">${num(all.filter((r) => r.createdAt && r.createdAt >= week).length)} en los últimos 7 días</span></div>
        <div class="card kpi"><span class="kpi__label">Desde celular</span><span class="kpi__value">${rows.length ? `${pct(mobile, rows.length)}%` : '—'}</span><span class="kpi__delta">${num(mobile)} de ${num(rows.length)} respuestas</span></div>
        <div class="card kpi"><span class="kpi__label">Tiempo promedio</span><span class="kpi__value">${avgSec != null ? (avgSec >= 60 ? `${Math.floor(avgSec / 60)}:${pad2(avgSec % 60)}` : `${avgSec}s`) : '—'}</span><span class="kpi__delta">${avgSec != null && avgSec >= 60 ? 'minutos por encuesta' : 'segundos por encuesta'}</span></div>
      </div>
      ${all.length ? '' : `<div class="empty" style="margin-bottom:12px"><strong>Aún no hay respuestas</strong>Comparte la encuesta para empezar a ver datos aquí.<br><code>https://agrotecamerican.com/encuesta/</code></div>`}
      <div class="grid-charts">
        ${chartCard('Actividad', 'Respuestas por día (últimos 14 días)', columnsMarkup(days), true)}
        ${state.config.preguntas.map((q, i) => {
          const stats = countQuestion(q, rows);
          const body = q.type === 'multi'
            ? barsMarkup(stats.data.slice().sort((a, b) => b.count - a.count), stats.respondents)
            : donutMarkup(stats);
          return chartCard(`${pad2(i + 1)} · ${q.kicker || q.id}`, q.title, body);
        }).join('')}
        ${chartCard('Recomendaciones', 'Cursos más recomendados al final', topCourses.length ? barsMarkup(topCourses, rows.length, 'de las respuestas del periodo') : '<p class="muted small">Todavía no hay recomendaciones registradas.</p>', true)}
      </div>`;
  };

  /* ---------- Vista: Preguntas ---------- */
  const typeLabel = (t) => (t === 'multi' ? 'Múltiple' : 'Única');
  const layoutLabel = (l) => ({ tiles: 'Mosaico', chips: 'Chips', list: 'Lista' }[l] || 'Lista');

  const questionItem = (q, i, total) => {
    const open = state.open.preguntas.has(i);
    const base = `preguntas.${i}`;
    return `
      <article class="card item ${open ? 'is-open' : ''}">
        <div class="item__head" data-action="toggle-item" data-col="preguntas" data-i="${i}">
          <span class="item__num">${pad2(i + 1)}</span>
          <div class="item__title">
            <strong>${esc(q.title || '(sin título)')}</strong>
            <span><span class="pill">${typeLabel(q.type)}</span><span class="pill">${layoutLabel(q.layout)}</span><span class="pill">${q.options.length} opciones</span>${q.id === 'areas' ? '<span class="pill pill--green">Enlaza cursos</span>' : ''}</span>
          </div>
          <div class="item__tools">
            <button class="icon-btn" type="button" data-action="q-up" data-i="${i}" title="Subir" ${i === 0 ? 'disabled' : ''}>${ICON.up}</button>
            <button class="icon-btn" type="button" data-action="q-down" data-i="${i}" title="Bajar" ${i === total - 1 ? 'disabled' : ''}>${ICON.down}</button>
            <button class="icon-btn icon-btn--danger" type="button" data-action="q-remove" data-i="${i}" title="Eliminar pregunta">${ICON.trash}</button>
            <span class="icon-btn" aria-hidden="true">${ICON.caret}</span>
          </div>
        </div>
        <div class="item__body" ${open ? '' : 'hidden'}>
          <div class="form-grid" style="margin-top:14px">
            <div class="field"><label>Etiqueta corta</label><input class="input" data-path="${base}.kicker" value="${esc(q.kicker)}" placeholder="Tu etapa"></div>
            <div class="field"><label>ID interno</label><input class="input input--mono" data-path="${base}.id" value="${esc(q.id)}"><small>No lo cambies si ya hay respuestas: enlaza la pregunta con sus datos.</small></div>
            <div class="field span-2"><label>Pregunta</label><input class="input" data-path="${base}.title" value="${esc(q.title)}"></div>
            <div class="field span-2"><label>Texto de ayuda</label><input class="input" data-path="${base}.hint" value="${esc(q.hint)}" placeholder="Opcional"></div>
            <div class="field"><label>Tipo de respuesta</label>
              <select class="input" data-path="${base}.type" data-rerender="preguntas">
                <option value="single" ${q.type !== 'multi' ? 'selected' : ''}>Una sola opción</option>
                <option value="multi" ${q.type === 'multi' ? 'selected' : ''}>Varias opciones</option>
              </select></div>
            <div class="field"><label>Diseño</label>
              <select class="input" data-path="${base}.layout">
                <option value="list" ${q.layout === 'list' ? 'selected' : ''}>Lista (dos columnas)</option>
                <option value="tiles" ${q.layout === 'tiles' ? 'selected' : ''}>Mosaico (íconos grandes)</option>
                <option value="chips" ${q.layout === 'chips' ? 'selected' : ''}>Chips (pastillas)</option>
              </select></div>
            ${q.type === 'multi' ? `<div class="field"><label>Máximo de opciones</label><input class="input" type="number" min="1" max="12" data-path="${base}.max" data-type="number" value="${esc(q.max || 3)}"></div>` : ''}
          </div>
          <div class="editor-sub"><h3>Opciones</h3><span class="small muted">Ícono: un emoji o ${BRAND_ICONS.map((b) => `<code>${b}</code>`).join(', ')}</span></div>
          <div class="options-editor">
            <div class="options-editor__head"><span>Ícono</span><span>Texto</span><span>Detalle (opcional)</span><span>Valor interno</span><span></span></div>
            ${q.options.map((o, j) => `
              <div class="option-row">
                <input class="input input--sm input--icon" data-path="${base}.options.${j}.icon" value="${esc(o.icon)}" title="Ícono">
                <input class="input input--sm" data-path="${base}.options.${j}.title" value="${esc(o.title)}" placeholder="Texto de la opción">
                <input class="input input--sm" data-path="${base}.options.${j}.detail" data-detail value="${esc(o.detail)}" placeholder="Detalle">
                <input class="input input--sm input--mono" data-path="${base}.options.${j}.value" value="${esc(o.value)}" title="Valor interno (se guarda en las respuestas)">
                <div class="option-row__tools">
                  <button class="icon-btn" type="button" data-action="opt-up" data-q="${i}" data-i="${j}" ${j === 0 ? 'disabled' : ''}>${ICON.up}</button>
                  <button class="icon-btn" type="button" data-action="opt-down" data-q="${i}" data-i="${j}" ${j === q.options.length - 1 ? 'disabled' : ''}>${ICON.down}</button>
                  <button class="icon-btn icon-btn--danger" type="button" data-action="opt-remove" data-q="${i}" data-i="${j}" ${q.options.length <= 2 ? 'disabled' : ''}>${ICON.trash}</button>
                </div>
              </div>`).join('')}
          </div>
          <div class="add-row"><button class="btn btn--line btn--sm" type="button" data-action="opt-add" data-q="${i}">${ICON.plus} Agregar opción</button></div>
        </div>
      </article>`;
  };

  const renderPreguntas = () => {
    const qs = state.draft.preguntas;
    view('preguntas').innerHTML = `
      <div class="view__head">
        <div><h2>Preguntas</h2><p>Edita el texto, las opciones y el orden. Los cambios se publican al guardar y la encuesta los toma al instante.</p></div>
        <div class="view__tools">
          <button class="btn btn--ghost btn--sm" type="button" data-action="restore" data-section="preguntas">Restaurar predeterminadas</button>
          <button class="btn btn--sm" type="button" data-action="q-add">${ICON.plus} Nueva pregunta</button>
        </div>
      </div>
      ${state.configExists ? '' : '<div class="help help--warn" style="margin-bottom:14px">La encuesta todavía usa la configuración predeterminada del código. Al guardar por primera vez se publica en Firestore y desde entonces se edita solo desde aquí.</div>'}
      <div class="stack">${qs.map((q, i) => questionItem(q, i, qs.length)).join('')}</div>
      <div class="help" style="margin-top:16px">La pregunta con ID <code>areas</code> es la que enlaza intereses con cursos: sus opciones aparecen como áreas en la pestaña Cursos.</div>`;
  };

  /* ---------- Vista: Cursos ---------- */
  const areasOptions = () => (state.draft.preguntas.find((q) => q.id === 'areas') || state.draft.preguntas.find((q) => q.type === 'multi'))?.options || [];

  const courseItem = (c, i, total, areas) => {
    const open = state.open.cursos.has(i);
    const base = `cursos.${i}`;
    const areaTitles = (c.areas || []).map((a) => areas.find((o) => o.value === a)?.title || a);
    return `
      <article class="card item ${open ? 'is-open' : ''} ${c.available === false ? 'is-off' : ''}">
        <div class="item__head" data-action="toggle-item" data-col="cursos" data-i="${i}">
          <span class="item__thumb">${c.image ? `<img src="${esc(assetUrl(c.image))}" alt="" loading="lazy">` : 'Sin foto'}</span>
          <div class="item__title">
            <strong>${esc(c.title || '(sin nombre)')}</strong>
            <span>${c.category ? `<span class="pill">${esc(c.category)}</span>` : ''}${c.level ? `<span class="pill">${esc(c.level)}</span>` : ''}${areaTitles.length ? `<span class="pill pill--green">${esc(areaTitles.join(' · '))}</span>` : '<span class="pill pill--orange">Sin áreas: no se recomienda</span>'}</span>
          </div>
          <div class="item__tools">
            <label class="switch" data-stop><input type="checkbox" data-path="${base}.available" ${c.available !== false ? 'checked' : ''}><i></i><span>${c.available !== false ? 'Disponible' : 'Oculto'}</span></label>
            <button class="icon-btn" type="button" data-action="c-up" data-i="${i}" title="Subir" ${i === 0 ? 'disabled' : ''}>${ICON.up}</button>
            <button class="icon-btn" type="button" data-action="c-down" data-i="${i}" title="Bajar" ${i === total - 1 ? 'disabled' : ''}>${ICON.down}</button>
            <button class="icon-btn icon-btn--danger" type="button" data-action="c-remove" data-i="${i}" title="Eliminar curso">${ICON.trash}</button>
            <span class="icon-btn" aria-hidden="true">${ICON.caret}</span>
          </div>
        </div>
        <div class="item__body" ${open ? '' : 'hidden'}>
          <div class="form-grid form-grid--3" style="margin-top:14px">
            <div class="field span-2"><label>Nombre del curso</label><input class="input" data-path="${base}.title" value="${esc(c.title)}"></div>
            <div class="field"><label>ID interno</label><input class="input input--mono" data-path="${base}.id" value="${esc(c.id)}"></div>
            <div class="field"><label>Categoría</label><input class="input" data-path="${base}.category" value="${esc(c.category)}" placeholder="Cultivos"></div>
            <div class="field"><label>Nivel</label><input class="input" data-path="${base}.level" value="${esc(c.level)}" placeholder="Intermedio"></div>
            <div class="field"><label>Imagen</label><input class="input input--mono" data-path="${base}.image" value="${esc(c.image)}" placeholder="img/cursos-real/… o URL"></div>
            <div class="field span-2"><label>Enlace del curso</label><input class="input input--mono" data-path="${base}.url" value="${esc(c.url)}" placeholder="https://club.agrotecamerican.com/#/curso/…"></div>
            <div class="field"><label>&nbsp;</label><small>Se abre al tocar el curso en la pantalla final.</small></div>
            <div class="field span-2" style="grid-column:1/-1"><label>Áreas de interés que lo recomiendan</label>
              <div class="chipset">${areas.map((o) => `<button type="button" class="chip ${(c.areas || []).includes(o.value) ? 'is-on' : ''}" data-action="c-area" data-i="${i}" data-area="${esc(o.value)}">${esc(o.title)}</button>`).join('') || '<span class="small muted">Agrega opciones a la pregunta "areas" para enlazar cursos.</span>'}</div>
              <small>Se recomiendan hasta 3 cursos disponibles que compartan áreas con lo que eligió la persona.</small>
            </div>
          </div>
        </div>
      </article>`;
  };

  const renderCursos = () => {
    const areas = areasOptions();
    const all = state.draft.cursos;
    const term = state.search.cursos.trim().toLowerCase();
    const visible = all.map((c, i) => ({ c, i })).filter(({ c }) => {
      if (state.cursosFilter === 'on' && c.available === false) return false;
      if (state.cursosFilter === 'off' && c.available !== false) return false;
      if (term && !`${c.title} ${c.category} ${c.level}`.toLowerCase().includes(term)) return false;
      return true;
    });
    const available = all.filter((c) => c.available !== false).length;
    view('cursos').innerHTML = `
      <div class="view__head">
        <div><h2>Cursos</h2><p>Decide qué cursos se pueden recomendar al final de la encuesta y con qué áreas de interés se relacionan. ${num(all.length)} cursos · ${num(available)} disponibles.</p></div>
        <div class="view__tools">
          <input class="input input--sm" type="search" data-search="cursos" value="${esc(state.search.cursos)}" placeholder="Buscar curso…" style="width:200px">
          <div class="seg" role="group" aria-label="Filtro">
            ${[['all', 'Todos'], ['on', 'Disponibles'], ['off', 'Ocultos']].map(([v, l]) => `<button type="button" class="${state.cursosFilter === v ? 'is-active' : ''}" data-action="cursos-filter" data-value="${v}">${l}</button>`).join('')}
          </div>
          <button class="btn btn--ghost btn--sm" type="button" data-action="restore" data-section="cursos">Restaurar predeterminados</button>
          <button class="btn btn--sm" type="button" data-action="c-add">${ICON.plus} Nuevo curso</button>
        </div>
      </div>
      ${visible.length ? `<div class="stack">${visible.map(({ c, i }) => courseItem(c, i, all.length, areas)).join('')}</div>` : '<div class="empty"><strong>Sin resultados</strong>Prueba con otro filtro o agrega un curso nuevo.</div>'}`;
  };

  /* ---------- Vista: Respuestas ---------- */
  const rowMatches = (row, term) => {
    if (!term) return true;
    const text = [
      ...state.config.preguntas.map((q) => labelsFor(row, q).join(' ')),
      ...row.recommended.map((id) => state.config.cursos.find((c) => c.id === id)?.title || id),
      row.device, row.id
    ].join(' ').toLowerCase();
    return text.includes(term);
  };

  const renderRespuestas = () => {
    const qs = state.config.preguntas;
    const term = state.search.respuestas.trim().toLowerCase();
    const rows = state.responses.filter((r) => rowMatches(r, term));
    const shown = rows.slice(0, state.page * PAGE_SIZE);
    view('respuestas').innerHTML = `
      <div class="view__head">
        <div><h2>Respuestas</h2><p>Cada fila es una encuesta completada, sin datos personales. Puedes buscar por cualquier respuesta y exportar todo a Excel.</p></div>
        <div class="view__tools">
          <input class="input input--sm" type="search" data-search="respuestas" value="${esc(state.search.respuestas)}" placeholder="Buscar en respuestas…" style="width:220px">
          <button class="btn btn--line btn--sm" type="button" data-action="reload">Actualizar</button>
          <button class="btn btn--sm" type="button" data-action="export-csv" ${rows.length ? '' : 'disabled'}>Exportar CSV</button>
        </div>
      </div>
      ${rows.length ? `
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>Fecha</th>
            ${qs.map((q) => `<th title="${esc(q.title)}">${esc(q.kicker || q.id)}</th>`).join('')}
            <th>Cursos sugeridos</th><th>Dispositivo</th><th>Tiempo</th><th></th>
          </tr></thead>
          <tbody>
            ${shown.map((r) => `
              <tr>
                <td class="nowrap">${esc(fmtDate(r.createdAt))}</td>
                ${qs.map((q) => `<td>${labelsFor(r, q).map((l) => esc(l)).join(q.type === 'multi' ? '<br>' : ', ') || '<span class="muted">—</span>'}</td>`).join('')}
                <td>${r.recommended.map((id) => `<span class="pill">${esc(state.config.cursos.find((c) => c.id === id)?.title || id)}</span>`).join('') || '<span class="muted">—</span>'}</td>
                <td class="nowrap">${r.device === 'mobile' ? 'Celular' : r.device === 'desktop' ? 'Computadora' : '—'}</td>
                <td class="nowrap">${Number.isFinite(r.durationSec) ? `${r.durationSec}s` : '—'}</td>
                <td><button class="icon-btn icon-btn--danger" type="button" data-action="r-delete" data-id="${esc(r.id)}" title="Eliminar respuesta">${ICON.trash}</button></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div class="table-foot">
        <span>Mostrando ${num(shown.length)} de ${num(rows.length)}${term ? ' que coinciden' : ''}${state.responses.length >= MAX_RESPONSES ? ` (máximo ${num(MAX_RESPONSES)} cargadas)` : ''}</span>
        ${shown.length < rows.length ? '<button class="btn btn--line btn--sm" type="button" data-action="page-more">Mostrar más</button>' : ''}
      </div>` : `<div class="empty"><strong>${term ? 'Nada coincide con tu búsqueda' : 'Aún no hay respuestas'}</strong>${term ? 'Prueba con otra palabra.' : 'Comparte la encuesta para empezar a recopilar datos.'}</div>`}`;
  };

  const exportCsv = () => {
    const qs = state.config.preguntas;
    const term = state.search.respuestas.trim().toLowerCase();
    const rows = state.responses.filter((r) => rowMatches(r, term));
    const quote = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const header = ['fecha', 'dispositivo', 'segundos', ...qs.map((q) => q.kicker || q.id), 'cursos_sugeridos', 'version_config', 'id'];
    const lines = rows.map((r) => [
      r.createdAt ? r.createdAt.toISOString() : '', r.device, r.durationSec ?? '',
      ...qs.map((q) => labelsFor(r, q).join(' | ')),
      r.recommended.map((id) => state.config.cursos.find((c) => c.id === id)?.title || id).join(' | '),
      r.configVersion, r.id
    ].map(quote).join(','));
    const csv = '﻿' + [header.map(quote).join(','), ...lines].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `encuesta-agrotec-${dayKey(new Date())}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 2000);
  };

  const deleteResponse = async (id) => {
    if (!window.confirm('¿Eliminar esta respuesta? No se puede deshacer.')) return;
    try {
      const { db, doc, deleteDoc } = await FB.getDb();
      await deleteDoc(doc(db, FB.COLLECTIONS.responses, id));
      state.responses = state.responses.filter((r) => r.id !== id);
      updateTabBadges();
      toast('Respuesta eliminada.', 'ok');
      renderTab();
    } catch (error) {
      console.error('[panel] Error al eliminar', error);
      toast('No se pudo eliminar la respuesta.', 'error');
    }
  };

  /* ---------- Vista: Textos ---------- */
  const textField = (label, path, value, opts = {}) => `
    <div class="field ${opts.span ? 'span-2' : ''}">
      <label>${esc(label)}</label>
      ${opts.textarea ? `<textarea class="input" data-path="${path}">${esc(value)}</textarea>` : `<input class="input ${opts.mono ? 'input--mono' : ''}" data-path="${path}" value="${esc(value)}" placeholder="${esc(opts.placeholder || '')}">`}
      ${opts.help ? `<small>${esc(opts.help)}</small>` : ''}
    </div>`;

  const renderTextos = () => {
    const t = state.draft.textos;
    view('textos').innerHTML = `
      <div class="view__head">
        <div><h2>Textos</h2><p>Lo que dice la encuesta antes y después de las preguntas. Usa <code>{n}</code> donde quieras mostrar el número de preguntas.</p></div>
        <div class="view__tools"><button class="btn btn--ghost btn--sm" type="button" data-action="restore" data-section="textos">Restaurar predeterminados</button></div>
      </div>
      <div class="stack">
        <article class="card">
          <div class="card__head"><div><p class="eyebrow">Pantalla 1</p><h3>Bienvenida</h3></div></div>
          <div class="card__body form-grid">
            ${textField('Etiqueta superior', 'textos.intro.eyebrow', t.intro.eyebrow)}
            ${textField('Botón', 'textos.intro.button', t.intro.button)}
            ${textField('Título (línea verde oscuro)', 'textos.intro.title', t.intro.title)}
            ${textField('Título (línea verde claro)', 'textos.intro.titleAccent', t.intro.titleAccent)}
            ${textField('Descripción', 'textos.intro.subtitle', t.intro.subtitle, { span: true, textarea: true })}
            ${textField('Aviso legal', 'textos.intro.legal', t.intro.legal, { span: true })}
            ${(t.intro.stats || []).slice(0, 3).map((s, i) => `
              <div class="field"><label>Dato ${i + 1} · ícono</label>
                <select class="input" data-path="textos.intro.stats.${i}.icon">${STAT_ICONS.map((ic) => `<option value="${ic}" ${s.icon === ic ? 'selected' : ''}>${({ list: 'Lista', clock: 'Reloj', lock: 'Candado' })[ic]}</option>`).join('')}</select>
              </div>
              <div class="field"><label>Dato ${i + 1} · texto</label>
                <div style="display:grid;gap:6px"><input class="input input--sm" data-path="textos.intro.stats.${i}.title" value="${esc(s.title)}" placeholder="Título"><input class="input input--sm" data-path="textos.intro.stats.${i}.detail" value="${esc(s.detail)}" placeholder="Detalle"></div>
              </div>`).join('')}
          </div>
        </article>
        <article class="card">
          <div class="card__head"><div><p class="eyebrow">Pantalla final</p><h3>Ruta recomendada</h3></div></div>
          <div class="card__body form-grid">
            ${textField('Etiqueta superior', 'textos.final.eyebrow', t.final.eyebrow)}
            ${textField('Etiqueta de cursos', 'textos.final.coursesEyebrow', t.final.coursesEyebrow)}
            ${textField('Título (verde oscuro)', 'textos.final.title', t.final.title)}
            ${textField('Título (verde claro)', 'textos.final.titleAccent', t.final.titleAccent)}
            ${textField('Descripción', 'textos.final.subtitle', t.final.subtitle, { span: true, textarea: true })}
            ${textField('Mensaje si no hay cursos', 'textos.final.emptyCourses', t.final.emptyCourses, { span: true })}
            ${textField('Botón principal', 'textos.final.button', t.final.button)}
            ${textField('Enlace del botón', 'textos.final.buttonUrl', t.final.buttonUrl, { mono: true, placeholder: 'https://club.agrotecamerican.com/' })}
            ${textField('Texto "responder de nuevo"', 'textos.final.again', t.final.again)}
          </div>
        </article>
        <article class="card">
          <div class="card__head"><div><p class="eyebrow">Navegación</p><h3>Botones y enlaces</h3></div></div>
          <div class="card__body form-grid">
            ${textField('"Responder después"', 'textos.nav.later', t.nav.later)}
            ${textField('Enlace de "Responder después"', 'textos.nav.laterUrl', t.nav.laterUrl, { mono: true, help: '../ lleva al inicio del sitio.' })}
            ${textField('Botón atrás', 'textos.nav.back', t.nav.back)}
            ${textField('Botón continuar', 'textos.nav.next', t.nav.next)}
            ${textField('Botón en la última pregunta', 'textos.nav.finish', t.nav.finish)}
            ${textField('Pista de teclado', 'textos.nav.hint', t.nav.hint)}
          </div>
        </article>
      </div>`;
  };

  /* ---------- Render general ---------- */
  const renderTab = () => {
    if (!state.config || !state.draft) return;
    ({ resumen: renderResumen, preguntas: renderPreguntas, cursos: renderCursos, respuestas: renderRespuestas, textos: renderTextos })[state.tab]?.();
  };
  const render = () => {
    $$('.view').forEach((v) => { v.hidden = v.dataset.view !== state.tab; });
    $$('.tab').forEach((t) => t.classList.toggle('is-active', t.dataset.tab === state.tab));
    renderTab();
  };
  const updateTabBadges = () => {
    const tab = $('.tab[data-tab="respuestas"]');
    if (tab) tab.innerHTML = `Respuestas <span class="badge">${num(state.responses.length)}</span>`;
  };
  const switchTab = (name) => {
    if (!name || state.tab === name) return;
    state.tab = name;
    if (location.hash !== `#${name}`) history.replaceState(null, '', `#${name}`);
    render();
    window.scrollTo({ top: 0 });
  };

  /* ---------- Acciones ---------- */
  const actions = {
    period: ({ value }) => { state.period = value; renderTab(); },
    reload: () => loadAll(),
    'export-csv': () => exportCsv(),
    'page-more': () => { state.page += 1; renderTab(); },
    'cursos-filter': ({ value }) => { state.cursosFilter = value; renderTab(); },
    'toggle-item': ({ col, i }) => {
      const set = state.open[col];
      const index = Number(i);
      set.has(index) ? set.delete(index) : set.add(index);
      renderTab();
    },
    'q-add': () => {
      const id = `pregunta-${uid()}`;
      state.draft.preguntas.push({ id, kicker: 'Nueva', title: 'Nueva pregunta', hint: '', type: 'single', max: 3, layout: 'list', options: [
        { value: 'opcion-1', icon: '✨', title: 'Opción 1', detail: '' }, { value: 'opcion-2', icon: '✨', title: 'Opción 2', detail: '' }
      ] });
      state.open.preguntas = new Set([state.draft.preguntas.length - 1]);
      markDirty(); renderTab();
      view('preguntas').querySelector('.item.is-open')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    'q-remove': ({ i }) => {
      const q = state.draft.preguntas[Number(i)];
      if (state.draft.preguntas.length <= 1) return toast('Debe quedar al menos una pregunta.', 'error');
      if (!window.confirm(`¿Eliminar la pregunta "${q.title}"? Las respuestas anteriores se conservan pero dejarán de mostrarse.`)) return;
      state.draft.preguntas.splice(Number(i), 1);
      state.open.preguntas = new Set();
      markDirty(); renderTab();
    },
    'q-up': ({ i }) => { move(state.draft.preguntas, Number(i), Number(i) - 1); state.open.preguntas = new Set([Number(i) - 1]); markDirty(); renderTab(); },
    'q-down': ({ i }) => { move(state.draft.preguntas, Number(i), Number(i) + 1); state.open.preguntas = new Set([Number(i) + 1]); markDirty(); renderTab(); },
    'opt-add': ({ q }) => {
      const question = state.draft.preguntas[Number(q)];
      question.options.push({ value: `opcion-${question.options.length + 1}-${uid()}`, icon: '✨', title: '', detail: '' });
      markDirty(); renderTab();
      const inputs = $$(`[data-path="preguntas.${q}.options.${question.options.length - 1}.title"]`);
      inputs[0]?.focus();
    },
    'opt-remove': ({ q, i }) => { state.draft.preguntas[Number(q)].options.splice(Number(i), 1); markDirty(); renderTab(); },
    'opt-up': ({ q, i }) => { move(state.draft.preguntas[Number(q)].options, Number(i), Number(i) - 1); markDirty(); renderTab(); },
    'opt-down': ({ q, i }) => { move(state.draft.preguntas[Number(q)].options, Number(i), Number(i) + 1); markDirty(); renderTab(); },
    'c-add': () => {
      state.draft.cursos.unshift({ id: `curso-${uid()}`, title: 'Nuevo curso', category: '', level: '', image: '', url: '', areas: [], available: true });
      state.open.cursos = new Set([0]);
      state.cursosFilter = 'all'; state.search.cursos = '';
      markDirty(); renderTab();
      $$('[data-path="cursos.0.title"]')[0]?.focus();
    },
    'c-remove': ({ i }) => {
      const c = state.draft.cursos[Number(i)];
      if (!window.confirm(`¿Eliminar el curso "${c.title}" de la encuesta?`)) return;
      state.draft.cursos.splice(Number(i), 1);
      state.open.cursos = new Set();
      markDirty(); renderTab();
    },
    'c-up': ({ i }) => { move(state.draft.cursos, Number(i), Number(i) - 1); state.open.cursos = new Set(); markDirty(); renderTab(); },
    'c-down': ({ i }) => { move(state.draft.cursos, Number(i), Number(i) + 1); state.open.cursos = new Set(); markDirty(); renderTab(); },
    'c-area': ({ i, area }, button) => {
      const c = state.draft.cursos[Number(i)];
      c.areas = Array.isArray(c.areas) ? c.areas : [];
      const index = c.areas.indexOf(area);
      index >= 0 ? c.areas.splice(index, 1) : c.areas.push(area);
      button.classList.toggle('is-on', index < 0);
      markDirty();
    },
    restore: ({ section }) => {
      if (!window.confirm(`¿Restaurar ${section} a los valores predeterminados? Se aplicará al guardar.`)) return;
      state.draft[section] = clone(DEFAULTS[section]);
      if (section === 'preguntas') state.open.preguntas = new Set([0]);
      if (section === 'cursos') state.open.cursos = new Set();
      markDirty(); renderTab();
    },
    'r-delete': ({ id }) => deleteResponse(id)
  };

  els.content.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (!target || !els.content.contains(target)) return;
    if (event.target.closest('[data-stop]')) return;
    event.preventDefault();
    actions[target.dataset.action]?.(target.dataset, target);
  });

  let searchTimer = 0;
  els.content.addEventListener('input', (event) => {
    const el = event.target;
    if (el.dataset.search) {
      clearTimeout(searchTimer);
      const key = el.dataset.search;
      const value = el.value;
      searchTimer = setTimeout(() => {
        state.search[key] = value;
        state.page = 1;
        renderTab();
        const again = $(`[data-search="${key}"]`);
        if (again) { again.focus(); again.setSelectionRange(again.value.length, again.value.length); }
      }, 220);
      return;
    }
    const path = el.dataset.path;
    if (!path || !state.draft) return;
    let value = el.type === 'checkbox' ? el.checked : el.value;
    if (el.dataset.type === 'number') value = Number(value);
    setPath(state.draft, path, value);
    markDirty();
    if (el.type === 'checkbox') {
      const label = el.closest('.switch')?.querySelector('span');
      if (label) label.textContent = el.checked ? 'Disponible' : 'Oculto';
      el.closest('.item')?.classList.toggle('is-off', !el.checked);
    }
    if (el.dataset.rerender) renderTab();
  });

  /* Tooltips de gráficas */
  const showTooltip = (html, x, y) => {
    els.tooltip.innerHTML = html;
    els.tooltip.hidden = false;
    const rect = els.tooltip.getBoundingClientRect();
    const left = Math.min(window.innerWidth - rect.width - 12, x + 14);
    const top = y - rect.height - 12 < 8 ? y + 18 : y - rect.height - 12;
    els.tooltip.style.left = `${Math.max(8, left)}px`;
    els.tooltip.style.top = `${top}px`;
  };
  const hideTooltip = () => { els.tooltip.hidden = true; };

  els.content.addEventListener('mousemove', (event) => {
    const seg = event.target.closest('.donut__seg, .legend li');
    if (seg) {
      const donut = seg.closest('.donut');
      const i = seg.dataset.i;
      donut.classList.add('has-hover');
      $$('[data-i]', donut).forEach((n) => n.classList.toggle('is-hot', n.dataset.i === i));
      const li = $(`.legend li[data-i="${i}"]`, donut);
      if (li) showTooltip(`<b>${esc(li.dataset.label)}</b><span>${num(li.dataset.count)} ${Number(li.dataset.count) === 1 ? 'respuesta' : 'respuestas'} · ${li.dataset.pct}%</span>`, event.clientX, event.clientY);
      return;
    }
    const bar = event.target.closest('.bar, .col');
    if (bar) {
      showTooltip(`<b>${esc(bar.dataset.label)}</b><span>${num(bar.dataset.count)} ${Number(bar.dataset.count) === 1 ? 'respuesta' : 'respuestas'}${bar.dataset.pct != null ? ` · ${bar.dataset.pct}%` : ''}</span>`, event.clientX, event.clientY);
      return;
    }
    hideTooltip();
    const donut = event.target.closest('.donut');
    $$('.donut.has-hover').forEach((d) => { if (d !== donut) { d.classList.remove('has-hover'); $$('.is-hot', d).forEach((n) => n.classList.remove('is-hot')); } });
  });
  els.content.addEventListener('mouseleave', () => {
    hideTooltip();
    $$('.donut.has-hover').forEach((d) => { d.classList.remove('has-hover'); $$('.is-hot', d).forEach((n) => n.classList.remove('is-hot')); });
  });

  /* Pestañas y barra de guardado */
  els.tabs.addEventListener('click', (event) => {
    const tab = event.target.closest('.tab');
    if (tab) switchTab(tab.dataset.tab);
  });
  els.btnSave.addEventListener('click', save);
  els.btnDiscard.addEventListener('click', () => { if (window.confirm('¿Descartar los cambios sin guardar?')) discard(); });
  els.btnLogin.addEventListener('click', login);
  els.btnLogout.addEventListener('click', logout);
  els.btnLogoutGate.addEventListener('click', logout);
  window.addEventListener('beforeunload', (event) => { if (state.dirty) { event.preventDefault(); event.returnValue = ''; } });
  window.addEventListener('hashchange', () => { const name = location.hash.slice(1); if (actionsTabs.includes(name)) switchTab(name); });
  const actionsTabs = ['resumen', 'preguntas', 'cursos', 'respuestas', 'textos'];

  /* ---------- Arranque ---------- */
  const boot = async () => {
    const initial = location.hash.slice(1);
    if (actionsTabs.includes(initial)) state.tab = initial;
    try {
      state.authKit = await FB.getAuthKit();
    } catch (error) {
      console.error('[panel] No se pudo cargar Firebase', error);
      showGate('login', 'No se pudo conectar con Firebase. Revisa tu conexión y recarga.');
      return;
    }
    state.authKit.onAuthStateChanged(state.authKit.auth, async (user) => {
      state.user = user;
      if (!user) { showGate('login'); return; }
      els.gateText.textContent = 'Verificando acceso…';
      const ok = await isAdmin(user);
      if (!ok) { showGate('denied'); return; }
      showPanel();
      await loadAll();
    });
  };

  boot();
})();
