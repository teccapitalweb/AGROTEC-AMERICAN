/* ==========================================================================
   AgroTec América · Panel administrativo de la encuesta
   Pestañas: Resumen (dashboard) · Preguntas · Cursos · Respuestas · Textos
   Acceso: Google (Firebase Auth) + lista ADMIN_EMAILS o documento en
   `encuesta_admins/{correo}`.
   ========================================================================== */
(() => {
  'use strict';

  const DEFAULTS = window.AGROTEC_ENCUESTA_DEFAULTS;
  const { clone, normalizeConfig, DIMENSIONS, LAYOUTS, MOODS, LEVELS } = window.AGROTEC_ENCUESTA_UTILS;
  const FB = window.AGROTEC_FIREBASE;
  const ICONS = window.AGROTEC_ICONS || {};
  const SITE_BASE = '../../';
  const PAGE_SIZE = 50;
  const MAX_RESPONSES = 3000;
  /* Serie categórica validada (orden fijo). El color sigue a la opción, no al ranking. */
  const PALETTE = ['#5c8c3a', '#2a78d6', '#eb6834', '#4a3aa7', '#eda100', '#e87ba4', '#1baf7a', '#e34948'];
  const OTHER_COLOR = '#b9c0b8';
  const STAT_ICONS = ['list-checks', 'timer', 'shield-check', 'clock', 'lock', 'sparkles', 'award', 'play-circle'];
  const LAYOUT_LABELS = { cards: 'Tarjetas con ícono', scale: 'Escala visual', tiles: 'Mosaico (logotipos)', big: 'Botones grandes', images: 'Tarjetas con imagen', list: 'Lista compacta', chips: 'Chips (pastillas)' };
  const DIMENSION_LABELS = { profile: 'Perfil', level: 'Nivel', source: 'Cómo nos conoció', goal: 'Objetivo', interests: 'Intereses', format: 'Formato', problem: 'Necesidad', time: 'Tiempo', none: 'Solo estadística' };
  const DIMENSION_HELP = { profile: 'Perfil (quién es)', level: 'Nivel de experiencia', source: 'Cómo nos conoció (solo estadística)', goal: 'Objetivo', interests: 'Áreas de interés (enlaza cursos)', format: 'Formato de aprendizaje', problem: 'Necesidad principal', time: 'Tiempo disponible', none: 'Ninguna (solo estadística)' };
  const MOOD_LABELS = { greet: 'Saluda', point: 'Señala la pregunta', think: 'Piensa', tablet: 'Usa una tablet', calculator: 'Usa una calculadora', approve: 'Aprueba', surprise: 'Se sorprende', celebrate: 'Celebra' };
  const LEVEL_LABELS = { basico: 'Básico', intermedio: 'Intermedio', avanzado: 'Avanzado' };
  const TAG_GROUPS = [
    { key: 'interests', label: 'Áreas de interés', dimension: 'interests', help: 'La primera marcada cuenta como principal.' },
    { key: 'goals', label: 'Objetivos', dimension: 'goal' },
    { key: 'profiles', label: 'Perfiles', dimension: 'profile' },
    { key: 'problems', label: 'Necesidades que resuelve', dimension: 'problem' },
    { key: 'levels', label: 'Niveles', fixed: LEVELS.map((l) => ({ value: l, title: LEVEL_LABELS[l] })) }
  ];

  /* ---------- Utilidades ---------- */
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad2 = (n) => String(n).padStart(2, '0');
  const num = (n) => Number(n || 0).toLocaleString('es-MX');
  const pct = (part, total) => (total ? Math.round((part / total) * 100) : 0);
  const pct1 = (part, total) => (total ? (Math.round((part / total) * 1000) / 10).toLocaleString('es-MX') : '0');
  const uid = () => Math.random().toString(36).slice(2, 7);
  const assetUrl = (path) => (!path ? '' : /^(https?:)?\/\//i.test(path) || path.startsWith('/') ? path : SITE_BASE + path);
  const startOfDay = (date) => { const d = new Date(date); d.setHours(0, 0, 0, 0); return d; };
  const dayKey = (date) => `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
  const fmtDate = (date) => (date ? date.toLocaleString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—');
  const fmtDateShort = (date) => (date ? date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');
  const fmtTime = (date) => (date ? date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : '');
  const fmtDay = (date) => date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
  const fmtMin = (min) => (!min ? '—' : min >= 60 ? `${Math.floor(min / 60)} h ${pad2(min % 60)}` : `${min} min`);
  const fmtSec = (sec) => (sec == null ? '—' : sec >= 60 ? `${Math.floor(sec / 60)} min ${pad2(sec % 60)} s` : `${sec} s`);
  const relTime = (date) => {
    if (!date) return '—';
    const diff = Math.round((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return 'hace un momento';
    if (diff < 3600) return `hace ${Math.round(diff / 60)} min`;
    if (diff < 86400) return `hace ${Math.round(diff / 3600)} h`;
    return `hace ${Math.round(diff / 86400)} días`;
  };
  const setPath = (obj, path, value) => {
    const keys = path.split('.');
    const last = keys.pop();
    const target = keys.reduce((acc, key) => (acc[key] == null ? (acc[key] = {}) : acc[key]), obj);
    target[last] = value;
  };
  const move = (array, from, to) => { if (to < 0 || to >= array.length) return; const [item] = array.splice(from, 1); array.splice(to, 0, item); };
  const toDate = (value) => (value && typeof value.toDate === 'function' ? value.toDate() : typeof value === 'string' && value ? new Date(value) : null);

  const svg = (name, cls = 'ico') => (ICONS[name] ? `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>` : '');
  const BRAND = {
    instagram: '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="6" fill="#e1306c"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="17.3" cy="6.7" r="1.2" fill="#fff"/></svg>',
    facebook: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#1877f2"/><path d="M13.4 20v-6.2h2.1l.3-2.5h-2.4V9.7c0-.7.2-1.2 1.2-1.2h1.3V6.3c-.2 0-1-.1-1.9-.1-1.9 0-3.1 1.1-3.1 3.2v1.9H8.8v2.5h2.1V20z" fill="#fff"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#111"/><path d="M13.6 6h2c.1 1.5 1.1 2.6 2.6 2.8v2c-1 0-1.9-.3-2.6-.8v4.3a3.8 3.8 0 1 1-3.8-3.8c.2 0 .5 0 .7.1v2.1a1.7 1.7 0 1 0 1.1 1.6z" fill="#fff"/></svg>',
    google: '<svg viewBox="0 0 24 24"><path d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.7h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z" fill="#4285f4"/><path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z" fill="#34a853"/><path d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9z" fill="#fbbc04"/><path d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.8 9.4 6 12 6z" fill="#ea4335"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#25d366"/><path d="M12 5.5a6.5 6.5 0 0 0-5.6 9.8L5.5 18.5l3.3-.9A6.5 6.5 0 1 0 12 5.5z" fill="none" stroke="#fff" stroke-width="1.6"/></svg>'
  };
  const iconMarkup = (icon) => {
    if (!icon) return '';
    if (icon.startsWith('i:') && ICONS[icon.slice(2)]) return svg(icon.slice(2));
    if (icon.startsWith('brand:')) return BRAND[icon.slice(6)] || '';
    if (icon.startsWith('i:')) return '<span class="icon-missing" title="Ícono no encontrado">?</span>';
    return esc(icon);
  };
  const I = { up: svg('arrow-up'), down: svg('arrow-down'), trash: svg('trash-2'), plus: svg('plus') || '<svg class="ico" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>', more: svg('more-horizontal'), pencil: svg('pencil'), copy: svg('copy'), chevron: svg('chevron-down'), x: svg('x'), external: svg('external-link'), download: svg('download') };

  /* ---------- Estado ---------- */
  const state = {
    user: null, authKit: null,
    config: null, configExists: false, draft: null, dirty: false,
    responses: [], loadedAt: null,
    tab: 'resumen', period: 'all', showAllInterests: false,
    open: { preguntas: new Set(), cursos: new Set() },
    search: { respuestas: '', cursos: '' }, cursosFilter: 'all', page: 1,
    respFilter: { period: 'all', course: '' }, drawerId: null
  };

  const els = {
    gate: $('#gate'), gateText: $('#gate-text'), gateNote: $('#gate-note'), btnLogin: $('#btn-login'), btnLogoutGate: $('#btn-logout-gate'),
    panel: $('#panel'), status: $('#topbar-status'), userChip: $('#user-chip'), btnLogout: $('#btn-logout'),
    tabs: $('.tabs'), content: $('.content'), banner: $('#banner'), savebar: $('#savebar'), btnSave: $('#btn-save'), btnDiscard: $('#btn-discard'),
    tooltip: $('#tooltip'), toast: $('#toast'), drawer: $('#drawer-root')
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
  const showBanner = (html) => { els.banner.innerHTML = html; els.banner.hidden = !html; };

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
      showGate('login', code === 'auth/popup-closed-by-user' ? 'Cerraste la ventana de Google antes de terminar.' : code === 'auth/unauthorized-domain' ? 'Este dominio no está autorizado en Firebase Auth.' : 'No se pudo iniciar sesión. Intenta de nuevo.');
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
      const rec = data.recommendation && typeof data.recommendation === 'object' ? data.recommendation : null;
      return {
        id: d.id, createdAt: toDate(data.createdAt), answers: data.answers || {}, labels: data.labels || {},
        profileLabels: data.profileLabels && typeof data.profileLabels === 'object' ? data.profileLabels : {},
        courseId: rec?.courseId || (Array.isArray(data.recommended) ? data.recommended[0] : '') || '', classN: rec?.classN || null, matches: Array.isArray(rec?.matches) ? rec.matches : [],
        clickedClass: data.clickedClass === true, clickedAt: toDate(data.clickedAt), enteredCourse: data.enteredCourse === true, enteredAt: toDate(data.enteredAt),
        uid: data.uid || '', email: data.email || '', device: data.device || '', durationSec: Number.isFinite(data.durationSec) ? data.durationSec : null,
        configVersion: data.configVersion ?? '', ref: data.ref || ''
      };
    });
    state.loadedAt = new Date();
  };

  const loadAll = async () => {
    setStatus('Cargando datos…');
    const results = await Promise.allSettled([loadConfig(), loadResponses()]);
    const failed = results.filter((r) => r.status === 'rejected').map((r) => r.reason);
    if (results[0].status === 'rejected') {
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
      if (!Array.isArray(c.classes) || !c.classes.length) errors.push(`${n}: necesita al menos una clase para poder recomendarse.`);
    });
    return errors;
  };

  const cleanDraft = (draft) => normalizeConfig(clone(draft));

  const save = async () => {
    const errors = validateDraft(state.draft);
    if (errors.length) { toast(errors[0] + (errors.length > 1 ? ` (+${errors.length - 1} más)` : ''), 'error'); return; }
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
      toast(error?.code === 'permission-denied' ? 'Firestore rechazó el guardado. Revisa las reglas y que tu correo sea administrador.' : 'No se pudo guardar. Intenta de nuevo.', 'error');
    } finally {
      els.btnSave.classList.remove('is-busy');
      els.btnSave.textContent = 'Guardar cambios';
    }
  };
  const discard = () => { state.draft = clone(state.config); state.dirty = false; els.savebar.hidden = true; render(); };
  const markDirty = () => { state.dirty = true; els.savebar.hidden = false; };

  /* ---------- Análisis ---------- */
  const sinceFor = (period) => {
    const now = new Date();
    if (period === 'today') return startOfDay(now);
    if (period === '7d') return new Date(now.getTime() - 7 * 86400000);
    if (period === '30d') return new Date(now.getTime() - 30 * 86400000);
    return null;
  };
  const byPeriod = (rows, period) => { const since = sinceFor(period); return since ? rows.filter((r) => r.createdAt && r.createdAt >= since) : rows; };
  const filteredResponses = () => byPeriod(state.responses, state.period);
  const valuesFor = (response, question) => { const raw = response.answers?.[question.id]; return Array.isArray(raw) ? raw : raw != null && raw !== '' ? [raw] : []; };
  const labelsFor = (response, question) => {
    const stored = response.labels?.[question.id];
    if (Array.isArray(stored) && stored.length) return stored;
    return valuesFor(response, question).map((v) => question.options.find((o) => o.value === v)?.title || String(v));
  };
  const questionBy = (dimension) => state.config.preguntas.find((q) => q.dimension === dimension && q.enabled !== false) || state.config.preguntas.find((q) => q.dimension === dimension);
  const courseOf = (id) => state.config.cursos.find((c) => c.id === id);
  const courseTitle = (id) => courseOf(id)?.title || id || '—';
  const perfilDe = (r) => {
    const parts = [];
    const qp = questionBy('profile'); const ql = questionBy('level');
    const p = r.profileLabels.profile || (qp ? labelsFor(r, qp)[0] : '');
    const l = r.profileLabels.level || (ql ? labelsFor(r, ql)[0] : '');
    if (p) parts.push(p);
    if (l) parts.push(l);
    return parts;
  };
  const statusOf = (r) => (r.enteredCourse ? { cls: 'status--in', label: 'Entró al curso' } : r.clickedClass ? { cls: 'status--click', label: 'Clic en clase' } : { cls: '', label: 'Completó encuesta' });

  const countQuestion = (question, rows, fold = true) => {
    const counts = new Map(question.options.map((o) => [o.value, 0]));
    let legacy = 0; let respondents = 0;
    rows.forEach((row) => {
      const values = valuesFor(row, question);
      if (!values.length) return;
      respondents += 1;
      values.forEach((v) => { if (counts.has(v)) counts.set(v, counts.get(v) + 1); else legacy += 1; });
    });
    const data = question.options.map((o, i) => ({ key: o.value, label: o.title, count: counts.get(o.value) || 0, color: i < PALETTE.length ? PALETTE[i] : OTHER_COLOR }));
    if (fold && question.options.length > PALETTE.length) {
      const head = data.slice(0, PALETTE.length - 1);
      const tail = data.slice(PALETTE.length - 1);
      head.push({ key: '__fold', label: 'Otras opciones', count: tail.reduce((s, d) => s + d.count, 0), color: OTHER_COLOR });
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
        <i style="background:${d.color}"></i><span title="${esc(d.label)}">${esc(d.label)}</span><b>${num(d.count)}<em>${pct(d.count, stats.total)}%</em></b>
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

  const barsMarkup = (items, denominator) => {
    const max = Math.max(1, ...items.map((d) => d.count));
    return `
      <div class="bars" data-chart="bars">
        ${items.map((d, i) => `
          <div class="bar" data-i="${i}" data-label="${esc(d.label)}" data-count="${d.count}" data-pct="${pct(d.count, denominator)}">
            <span class="bar__label" title="${esc(d.label)}">${esc(d.label)}</span>
            <span class="bar__track"><i class="bar__fill" style="width:${(d.count / max) * 100}%"></i><span class="bar__value">${num(d.count)}<em>${pct(d.count, denominator)}%</em></span></span>
          </div>`).join('')}
      </div>`;
  };

  const columnsMarkup = (days) => {
    const max = Math.max(1, ...days.map((d) => d.count));
    return `
      <div class="columns" data-chart="columns">
        ${days.map((d) => `<div class="col" data-label="${esc(d.label)}" data-count="${d.count}"><i style="height:${Math.max(2, (d.count / max) * 100)}%"></i></div>`).join('')}
      </div>
      <div class="columns__axis"><span>${esc(days[0].label)}</span><span>${esc(days[days.length - 1].label)}</span></div>`;
  };

  const chartCard = (title, body, { meta = '', foot = '', wide = false } = {}) => `
    <article class="card card--chart ${wide ? 'span-2' : ''}">
      <div class="card__head"><h3>${esc(title)}</h3>${meta ? `<span class="card__meta">${esc(meta)}</span>` : ''}</div>
      <div class="card__body">${body}</div>
      ${foot ? `<div class="card__foot">${foot}</div>` : ''}
    </article>`;

  const questionChart = (q, rows) => {
    const stats = countQuestion(q, rows, q.type !== 'multi');
    const body = q.type === 'multi' ? barsMarkup(stats.data.slice().sort((a, b) => b.count - a.count), stats.respondents) : donutMarkup(stats);
    return chartCard(q.kicker ? `${q.kicker}: ${q.title}` : q.title, body, { meta: `${num(stats.respondents)} resp.` });
  };

  /* ---------- Vista: Resumen ---------- */
  const emptyState = (title, text, action = '') => `
    <div class="empty">
      <img src="../img/agro-mascot-orange-clean-v5.webp" alt="" width="84">
      <strong>${esc(title)}</strong>
      <p>${esc(text)}</p>
      ${action}
    </div>`;

  const renderResumen = () => {
    const rows = filteredResponses();
    const all = state.responses;
    const now = new Date();
    const today = startOfDay(now);
    const clicks = rows.filter((r) => r.clickedClass).length;
    const entered = rows.filter((r) => r.enteredCourse).length;
    const durations = rows.map((r) => r.durationSec).filter((s) => Number.isFinite(s) && s > 0 && s < 3600);
    const avgSec = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : null;
    const periodLabel = { all: 'en total', today: 'hoy', '7d': 'últimos 7 días', '30d': 'últimos 30 días' }[state.period];

    const head = `
      <div class="page-head">
        <div><h2>Resumen de la encuesta</h2><p>Consulta el rendimiento de la encuesta y descubre qué perfiles, intereses y cursos predominan.</p></div>
        <div class="page-tools">
          <div class="seg" role="group" aria-label="Periodo">
            ${[['all', 'Todo'], ['today', 'Hoy'], ['7d', '7 días'], ['30d', '30 días']].map(([v, l]) => `<button type="button" class="${state.period === v ? 'is-active' : ''}" data-action="period" data-value="${v}">${l}</button>`).join('')}
          </div>
          <button class="btn btn--line btn--sm" type="button" data-action="reload">${svg('refresh-cw')} Actualizar</button>
        </div>
      </div>`;

    if (!all.length) {
      view('resumen').innerHTML = head + emptyState('Todavía no hay respuestas', 'Cuando las personas comiencen a completar la encuesta, aquí podrás analizar sus intereses y recomendaciones.', `<a class="btn btn--sm" href="../" target="_blank" rel="noopener">Ver encuesta ${I.external}</a>`);
      return;
    }

    const kpi = (icon, label, value, sub) => `<div class="card kpi"><span class="kpi__label">${svg(icon)}${esc(label)}</span><span class="kpi__value">${value}</span><span class="kpi__sub">${esc(sub)}</span></div>`;
    const kpis = `
      <div class="kpis">
        ${kpi('users', 'Respuestas totales', num(rows.length), periodLabel)}
        ${kpi('calendar-days', 'Hoy', num(all.filter((r) => r.createdAt && r.createdAt >= today).length), `${num(byPeriod(all, '7d').length)} en 7 días`)}
        ${kpi('mouse-pointer-click', 'Clics en clases', num(clicks), rows.length ? `${pct(clicks, rows.length)}% de las respuestas` : '—')}
        ${kpi('log-in', 'Iniciaron curso', num(entered), 'llegaron al club con sesión')}
        ${kpi('percent', 'Tasa de conversión', rows.length ? `${pct1(entered, rows.length)} %` : '—', 'respuestas que iniciaron curso')}
        ${kpi('timer', 'Tiempo promedio', avgSec != null ? esc(fmtSec(avgSec)) : '—', 'por encuesta completada')}
      </div>`;

    const courseCounts = new Map();
    rows.forEach((r) => { if (r.courseId) courseCounts.set(r.courseId, (courseCounts.get(r.courseId) || 0) + 1); });
    const ranking = Array.from(courseCounts.entries()).map(([id, count]) => ({ id, count })).sort((a, b) => b.count - a.count).slice(0, 5);
    const maxCount = Math.max(1, ...ranking.map((r) => r.count));
    const cursos = `
      <article class="card">
        <div class="card__head"><h3>Cursos más recomendados</h3><span class="card__meta">${num(courseCounts.size)} cursos distintos</span></div>
        <div class="card__body">
          ${ranking.length ? `<ol class="ranking">${ranking.map(({ id, count }) => { const c = courseOf(id); return `
            <li>
              <span class="ranking__thumb">${c?.image ? `<img src="${esc(assetUrl(c.image))}" alt="" loading="lazy">` : ''}</span>
              <span><span class="ranking__name">${esc(courseTitle(id))}</span><span class="ranking__meta">${num(count)} ${count === 1 ? 'recomendación' : 'recomendaciones'} · ${pct(count, rows.length)} %</span></span>
              <span class="ranking__bar"><i style="width:${(count / maxCount) * 100}%"></i></span>
            </li>`; }).join('')}</ol>` : '<p class="muted small">Todavía no hay recomendaciones registradas.</p>'}
        </div>
      </article>`;

    const qInterests = questionBy('interests');
    const qGoal = questionBy('goal');
    const qProblem = questionBy('problem');
    const qTime = questionBy('time');
    const featured = new Set([qInterests, qGoal, qProblem, qTime].filter(Boolean).map((q) => q.id));
    const cards = [];
    if (qInterests) {
      const stats = countQuestion(qInterests, rows, false);
      const sorted = stats.data.slice().sort((a, b) => b.count - a.count);
      const shown = state.showAllInterests ? sorted : sorted.slice(0, 5);
      cards.push(chartCard('Temas que más interesan', barsMarkup(shown, stats.respondents), {
        meta: `${num(stats.respondents)} resp.`,
        foot: sorted.length > 5 ? `<button class="btn btn--ghost btn--sm" type="button" data-action="toggle-interests">${state.showAllInterests ? 'Ver solo los principales' : 'Ver todos los temas'}</button>` : ''
      }));
    }
    if (qGoal) cards.push(chartCard('Qué quieren lograr', donutMarkup(countQuestion(qGoal, rows))));
    if (qProblem) cards.push(chartCard('Qué necesitan resolver', donutMarkup(countQuestion(qProblem, rows))));
    if (qTime) cards.push(chartCard('Tiempo que quieren dedicar por semana', donutMarkup(countQuestion(qTime, rows))));

    const days = [];
    for (let i = 13; i >= 0; i -= 1) { const d = new Date(today.getTime() - i * 86400000); days.push({ key: dayKey(d), label: fmtDay(d), count: 0 }); }
    all.forEach((r) => { if (!r.createdAt) return; const hit = days.find((d) => d.key === dayKey(r.createdAt)); if (hit) hit.count += 1; });
    const funnel = [{ label: 'Terminaron la encuesta', count: rows.length }, { label: 'Hicieron clic en la clase', count: clicks }, { label: 'Entraron al curso', count: entered }];
    const rest = state.config.preguntas.filter((q) => !featured.has(q.id) && (q.enabled !== false || rows.some((r) => r.answers && r.answers[q.id] != null)));
    const more = `
      <details class="more">
        <summary><span style="color:var(--ink);font-weight:600;font-size:.92rem">Más resultados</span><span>Actividad por día, embudo y ${num(rest.length)} preguntas más</span>${I.chevron}</summary>
        <div class="more__body">
          <div class="grid-2">
            ${chartCard('Respuestas por día (últimos 14 días)', columnsMarkup(days))}
            ${chartCard('De la encuesta a la clase', barsMarkup(funnel, rows.length), { meta: 'porcentaje de quienes terminaron' })}
            ${rest.map((q) => questionChart(q, rows)).join('')}
          </div>
        </div>
      </details>`;

    view('resumen').innerHTML = `${head}${kpis}${cursos}<div class="grid-2 section-gap" style="margin-top:12px">${cards.join('')}</div>${more}`;
  };

  /* ---------- Vista: Preguntas ---------- */
  const typeLabel = (t) => (t === 'multi' ? 'Opción múltiple' : 'Opción única');
  const selectMarkup = (path, value, entries, extra = '') => `<select class="input" data-path="${path}" ${extra}>${entries.map(([v, l]) => `<option value="${esc(v)}" ${value === v ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
  const menuMarkup = (items) => `
    <span class="menu-wrap">
      <button class="icon-btn" type="button" data-action="menu" title="Más acciones" aria-haspopup="true">${I.more}</button>
      <div class="menu" hidden>${items.map((it) => (it === 'hr' ? '<hr>' : `<button type="button" class="${it.danger ? 'is-danger' : ''}" ${it.disabled ? 'disabled' : ''} ${Object.entries(it.data).map(([k, v]) => `data-${k}="${esc(v)}"`).join(' ')}>${it.icon}${esc(it.label)}</button>`)).join('')}</div>
    </span>`;

  const questionEditor = (q, i) => {
    const base = `preguntas.${i}`;
    const showImage = q.layout === 'images';
    const showLevel = q.dimension === 'level';
    return `
      <div class="row-item__editor">
        <div class="form-grid" style="margin-top:14px">
          <div class="field"><label>Etiqueta corta</label><input class="input" data-path="${base}.kicker" value="${esc(q.kicker)}" placeholder="Tu etapa"></div>
          <div class="field"><label>ID interno</label><input class="input input--mono" data-path="${base}.id" value="${esc(q.id)}"><small>No lo cambies si ya hay respuestas: enlaza la pregunta con sus datos.</small></div>
          <div class="field span-2"><label>Pregunta</label><input class="input" data-path="${base}.title" value="${esc(q.title)}"></div>
          <div class="field span-2"><label>Texto de ayuda</label><input class="input" data-path="${base}.hint" value="${esc(q.hint)}" placeholder="Opcional"></div>
          <div class="field"><label>Tipo de respuesta</label>${selectMarkup(`${base}.type`, q.type === 'multi' ? 'multi' : 'single', [['single', 'Una sola opción'], ['multi', 'Varias opciones']], 'data-rerender="preguntas"')}</div>
          <div class="field"><label>Diseño de las opciones</label>${selectMarkup(`${base}.layout`, q.layout, LAYOUTS.map((l) => [l, LAYOUT_LABELS[l]]), 'data-rerender="preguntas"')}</div>
          <div class="field"><label>Qué aporta al perfil</label>${selectMarkup(`${base}.dimension`, q.dimension || 'none', DIMENSIONS.map((d) => [d, DIMENSION_HELP[d]]), 'data-rerender="preguntas"')}<small>El motor compara cada dimensión con las etiquetas de los cursos.</small></div>
          <div class="field"><label>Personaje</label>${selectMarkup(`${base}.mood`, q.mood || 'point', MOODS.map((m) => [m, MOOD_LABELS[m]]))}</div>
          <div class="field span-2"><label>Globo del personaje</label><input class="input" data-path="${base}.bubble" value="${esc(q.bubble)}" placeholder="Si lo dejas vacío usa el mensaje general"></div>
          ${q.type === 'multi' ? `<div class="field"><label>Máximo de opciones</label><input class="input" type="number" min="1" max="12" data-path="${base}.max" data-type="number" value="${esc(q.max || 3)}"></div>` : ''}
        </div>
        <div class="editor-sub"><h3>Opciones</h3><span class="small muted">Ícono: <code>i:nombre</code>, <code>brand:instagram</code>… o un emoji</span></div>
        <div class="options-editor ${showImage ? 'has-image' : ''} ${showLevel ? 'has-level' : ''}">
          <div class="options-editor__head"><span>Ícono</span><span>Texto</span><span>Detalle</span>${showImage ? '<span>Imagen</span>' : ''}${showLevel ? '<span>Nivel</span>' : ''}<span>Valor interno</span><span></span></div>
          ${q.options.map((o, j) => `
            <div class="option-row">
              <span class="icon-field"><span class="icon-preview" aria-hidden="true">${iconMarkup(o.icon)}</span><input class="input input--sm input--icon" data-path="${base}.options.${j}.icon" data-icon-preview value="${esc(o.icon)}" title="Ícono"></span>
              <input class="input input--sm" data-path="${base}.options.${j}.title" value="${esc(o.title)}" placeholder="Texto de la opción">
              <input class="input input--sm" data-path="${base}.options.${j}.detail" data-detail value="${esc(o.detail)}" placeholder="Detalle (opcional)">
              ${showImage ? `<input class="input input--sm input--mono" data-path="${base}.options.${j}.image" value="${esc(o.image)}" placeholder="URL de imagen">` : ''}
              ${showLevel ? selectMarkup(`${base}.options.${j}.level`, o.level || '', [['', '—'], ...LEVELS.map((l) => [l, LEVEL_LABELS[l]])]).replace('class="input"', 'class="input input--sm"') : ''}
              <input class="input input--sm input--mono" data-path="${base}.options.${j}.value" value="${esc(o.value)}" title="Valor interno (se guarda en las respuestas)">
              <div class="option-row__tools">
                <button class="icon-btn" type="button" data-action="opt-up" data-q="${i}" data-i="${j}" ${j === 0 ? 'disabled' : ''}>${I.up}</button>
                <button class="icon-btn" type="button" data-action="opt-down" data-q="${i}" data-i="${j}" ${j === q.options.length - 1 ? 'disabled' : ''}>${I.down}</button>
                <button class="icon-btn icon-btn--danger" type="button" data-action="opt-remove" data-q="${i}" data-i="${j}" ${q.options.length <= 2 ? 'disabled' : ''}>${I.trash}</button>
              </div>
            </div>`).join('')}
        </div>
        <div class="add-row"><button class="btn btn--line btn--sm" type="button" data-action="opt-add" data-q="${i}">${I.plus} Agregar opción</button></div>
      </div>`;
  };

  const questionRow = (q, i, total, position) => {
    const open = state.open.preguntas.has(i);
    const on = q.enabled !== false;
    return `
      <article class="row-item ${open ? 'is-open' : ''} ${on ? '' : 'is-off'}">
        <div class="row-item__main">
          <span class="row-item__num">${on ? pad2(position) : '—'}</span>
          <div class="row-item__title">
            <strong>${esc(q.title || '(sin título)')}</strong>
            <span class="row-item__tags">${on ? '' : '<span class="tag tag--warn">No se muestra</span>'}<span class="tag">${esc(LAYOUT_LABELS[q.layout] || q.layout)}</span><span class="tag">${typeLabel(q.type)} · ${q.options.length} opciones</span>${q.dimension && q.dimension !== 'none' ? `<span class="tag tag--green">${esc(DIMENSION_LABELS[q.dimension] || q.dimension)}</span>` : ''}</span>
          </div>
          <div class="row-item__actions">
            <label class="switch" data-stop title="Si la apagas, se guarda pero no aparece en la encuesta"><input type="checkbox" data-path="preguntas.${i}.enabled" data-rerender="preguntas" data-on="Activa" data-off="Apagada" ${on ? 'checked' : ''}><i></i><span>${on ? 'Activa' : 'Apagada'}</span></label>
            <button class="btn btn--line btn--sm" type="button" data-action="toggle-item" data-col="preguntas" data-i="${i}">${open ? I.x : I.pencil} ${open ? 'Cerrar' : 'Editar'}</button>
            ${menuMarkup([
              { label: 'Duplicar', icon: I.copy, data: { action: 'q-duplicate', i } },
              { label: 'Subir', icon: I.up, data: { action: 'q-up', i }, disabled: i === 0 },
              { label: 'Bajar', icon: I.down, data: { action: 'q-down', i }, disabled: i === total - 1 },
              'hr',
              { label: 'Eliminar', icon: I.trash, data: { action: 'q-remove', i }, danger: true }
            ])}
          </div>
        </div>
        ${open ? questionEditor(q, i) : ''}
      </article>`;
  };

  const renderPreguntas = () => {
    const qs = state.draft.preguntas;
    const active = qs.filter((q) => q.enabled !== false).length;
    let position = 0;
    view('preguntas').innerHTML = `
      <div class="page-head">
        <div><h2>Preguntas</h2><p>Edita el texto, el diseño y las opciones de cada pregunta. ${num(active)} activas de ${num(qs.length)}; las apagadas se conservan con sus datos. Los cambios se publican al guardar.</p></div>
        <div class="page-tools">
          <button class="btn btn--ghost btn--sm" type="button" data-action="restore" data-section="preguntas">Restaurar predeterminadas</button>
          <button class="btn btn--sm" type="button" data-action="q-add">${I.plus} Nueva pregunta</button>
        </div>
      </div>
      ${state.configExists ? '' : '<div class="help help--warn" style="margin-bottom:14px">La encuesta todavía usa la configuración predeterminada del código. Al guardar por primera vez se publica en Firestore y desde entonces se edita solo desde aquí.</div>'}
      <div class="rows">${qs.map((q, i) => questionRow(q, i, qs.length, q.enabled !== false ? (position += 1) : 0)).join('')}</div>
      <p class="small muted" style="margin:14px 0 0">Las opciones de las preguntas de <b>intereses</b>, <b>objetivo</b>, <b>necesidad</b> y <b>perfil</b> aparecen como etiquetas en Cursos; así el motor sabe qué recomendar. Pesan en ese orden; la experiencia elige el nivel y el tiempo, por dónde empezar.</p>`;
  };

  /* ---------- Vista: Cursos ---------- */
  const tagOptions = (group) => {
    if (group.fixed) return group.fixed;
    const q = state.draft.preguntas.find((x) => x.dimension === group.dimension);
    return q ? q.options.map((o) => ({ value: o.value, title: o.title })) : [];
  };

  const courseEditor = (c, i) => {
    const base = `cursos.${i}`;
    const classes = Array.isArray(c.classes) ? c.classes : [];
    return `
      <div class="row-item__editor">
        <div class="form-grid form-grid--3" style="margin-top:14px">
          <div class="field span-2"><label>Nombre del curso</label><input class="input" data-path="${base}.title" value="${esc(c.title)}"></div>
          <div class="field"><label>ID (slug del club)</label><input class="input input--mono" data-path="${base}.id" value="${esc(c.id)}"><small>Debe coincidir con la URL del curso en el club.</small></div>
          <div class="field"><label>Categoría</label><input class="input" data-path="${base}.category" value="${esc(c.category)}" placeholder="Cultivos"></div>
          <div class="field"><label>Nivel (texto)</label><input class="input" data-path="${base}.level" value="${esc(c.level)}" placeholder="Intermedio"></div>
          <div class="field"><label>Clase destacada (gancho)</label>${selectMarkup(`${base}.featuredClass`, String(c.featuredClass || 1), classes.length ? classes.map((k) => [String(k.n), `Clase ${k.n}${k.free ? ' · gratis' : ''}${k.min ? ` · ${fmtMin(k.min)}` : ''}`]) : [['1', 'Clase 1']], 'data-type="number"')}</div>
          <div class="field span-2"><label>Portada (URL)</label><input class="input input--mono" data-path="${base}.image" value="${esc(c.image)}" placeholder="https://club.agrotecamerican.com/cursos/…"></div>
          <div class="field"><label>Enlace del curso</label><input class="input input--mono" data-path="${base}.url" value="${esc(c.url)}" placeholder="https://club.agrotecamerican.com/#/curso/…"></div>
          <div class="field" style="grid-column:1/-1"><label>Qué logra la persona (resumen)</label><input class="input" data-path="${base}.summary" value="${esc(c.summary)}" placeholder="Una línea que aparece en la tarjeta del resultado"></div>
        </div>
        <div class="editor-sub"><h3>Etiquetas para recomendar</h3><span class="small muted">Marca con qué respuestas encaja este curso.</span></div>
        <div class="tag-groups">
          ${TAG_GROUPS.map((group) => {
            const options = tagOptions(group);
            const selected = c.tags?.[group.key] || [];
            return `<div class="tag-group"><label>${esc(group.label)}${group.help ? ` <small>${esc(group.help)}</small>` : ''}</label>
              <div class="chipset">${options.length ? options.map((o) => `<button type="button" class="chip ${selected.includes(o.value) ? 'is-on' : ''}" data-action="c-tag" data-i="${i}" data-group="${group.key}" data-value="${esc(o.value)}">${esc(o.title)}</button>`).join('') : `<span class="small muted">No hay pregunta marcada como "${esc(DIMENSION_HELP[group.dimension] || group.key)}".</span>`}</div></div>`;
          }).join('')}
        </div>
        <div class="editor-sub"><h3>Clases</h3><span class="small muted">Vienen del catálogo del club. Duración en minutos.</span></div>
        <div class="classes-editor">
          <div class="classes-editor__head"><span>#</span><span>Título</span><span>Min</span><span>Gratis</span><span></span></div>
          ${classes.map((k, j) => `
            <div class="class-row">
              <input class="input input--sm input--mono" type="number" min="1" data-path="${base}.classes.${j}.n" data-type="number" value="${esc(k.n)}">
              <input class="input input--sm" data-path="${base}.classes.${j}.title" value="${esc(k.title)}" placeholder="Clase ${k.n}">
              <input class="input input--sm input--mono" type="number" min="0" data-path="${base}.classes.${j}.min" data-type="number" value="${k.min ?? ''}" placeholder="min">
              <label class="switch switch--sm"><input type="checkbox" data-path="${base}.classes.${j}.free" ${k.free ? 'checked' : ''}><i></i></label>
              <button class="icon-btn icon-btn--danger" type="button" data-action="k-remove" data-c="${i}" data-i="${j}" title="Quitar clase">${I.trash}</button>
            </div>`).join('')}
        </div>
        <div class="add-row"><button class="btn btn--line btn--sm" type="button" data-action="k-add" data-c="${i}">${I.plus} Agregar clase</button></div>
      </div>`;
  };

  const courseRow = (c, i, total) => {
    const open = state.open.cursos.has(i);
    const interests = tagOptions(TAG_GROUPS[0]);
    const interestTitles = (c.tags?.interests || []).map((a) => interests.find((o) => o.value === a)?.title || a);
    const classes = Array.isArray(c.classes) ? c.classes : [];
    const totalMin = classes.reduce((a, k) => a + (k.min || 0), 0);
    return `
      <article class="row-item ${open ? 'is-open' : ''} ${c.available === false ? 'is-off' : ''}">
        <div class="row-item__main">
          <span class="row-item__thumb">${c.image ? `<img src="${esc(assetUrl(c.image))}" alt="" loading="lazy">` : 'Sin foto'}</span>
          <div class="row-item__title">
            <strong>${esc(c.title || '(sin nombre)')}</strong>
            <span class="row-item__tags">${c.category ? `<span class="tag">${esc(c.category)}</span>` : ''}<span class="tag">${classes.length} clases${totalMin ? ` · ${fmtMin(totalMin)}` : ''}</span>${interestTitles.length ? `<span class="tag tag--green" title="${esc(interestTitles.join(' · '))}">${interestTitles.length === 1 ? esc(interestTitles[0]) : `${interestTitles.length} áreas`}</span>` : '<span class="tag tag--warn">Sin áreas: no se recomienda</span>'}</span>
          </div>
          <div class="row-item__actions">
            <label class="switch" data-stop><input type="checkbox" data-path="cursos.${i}.available" ${c.available !== false ? 'checked' : ''}><i></i><span>${c.available !== false ? 'Disponible' : 'Oculto'}</span></label>
            <button class="btn btn--line btn--sm" type="button" data-action="toggle-item" data-col="cursos" data-i="${i}">${open ? I.x : I.pencil} ${open ? 'Cerrar' : 'Editar'}</button>
            ${menuMarkup([
              { label: 'Duplicar', icon: I.copy, data: { action: 'c-duplicate', i } },
              { label: 'Subir', icon: I.up, data: { action: 'c-up', i }, disabled: i === 0 },
              { label: 'Bajar', icon: I.down, data: { action: 'c-down', i }, disabled: i === total - 1 },
              'hr',
              { label: 'Eliminar', icon: I.trash, data: { action: 'c-remove', i }, danger: true }
            ])}
          </div>
        </div>
        ${open ? courseEditor(c, i) : ''}
      </article>`;
  };

  const renderCursos = () => {
    const all = state.draft.cursos;
    const term = state.search.cursos.trim().toLowerCase();
    const visible = all.map((c, i) => ({ c, i })).filter(({ c }) => {
      if (state.cursosFilter === 'on' && c.available === false) return false;
      if (state.cursosFilter === 'off' && c.available !== false) return false;
      if (term && !`${c.title} ${c.category} ${c.level} ${c.id}`.toLowerCase().includes(term)) return false;
      return true;
    });
    const available = all.filter((c) => c.available !== false).length;
    view('cursos').innerHTML = `
      <div class="page-head">
        <div><h2>Cursos</h2><p>Los cursos reales del club con las etiquetas que usa el motor. ${num(all.length)} cursos · ${num(available)} disponibles.</p></div>
        <div class="page-tools">
          <input class="input input--sm input--search" type="search" data-search="cursos" value="${esc(state.search.cursos)}" placeholder="Buscar curso…" style="width:210px">
          <div class="seg" role="group" aria-label="Filtro">
            ${[['all', 'Todos'], ['on', 'Disponibles'], ['off', 'Ocultos']].map(([v, l]) => `<button type="button" class="${state.cursosFilter === v ? 'is-active' : ''}" data-action="cursos-filter" data-value="${v}">${l}</button>`).join('')}
          </div>
          <button class="btn btn--ghost btn--sm" type="button" data-action="restore" data-section="cursos">Restaurar catálogo</button>
          <button class="btn btn--sm" type="button" data-action="c-add">${I.plus} Nuevo curso</button>
        </div>
      </div>
      ${visible.length ? `<div class="rows">${visible.map(({ c, i }) => courseRow(c, i, all.length)).join('')}</div>` : emptyState('Sin resultados', 'Prueba con otro filtro o agrega un curso nuevo.')}`;
  };

  /* ---------- Vista: Respuestas ---------- */
  const rowMatches = (row, term) => {
    if (!term) return true;
    const text = [...state.config.preguntas.map((q) => labelsFor(row, q).join(' ')), courseTitle(row.courseId), row.email, row.device, row.id].join(' ').toLowerCase();
    return text.includes(term);
  };
  const visibleResponses = () => {
    const term = state.search.respuestas.trim().toLowerCase();
    return byPeriod(state.responses, state.respFilter.period).filter((r) => (!state.respFilter.course || r.courseId === state.respFilter.course) && rowMatches(r, term));
  };

  const renderRespuestas = () => {
    const rows = visibleResponses();
    const shown = rows.slice(0, state.page * PAGE_SIZE);
    const courseIds = Array.from(new Set(state.responses.map((r) => r.courseId).filter(Boolean)));
    view('respuestas').innerHTML = `
      <div class="page-head">
        <div><h2>Respuestas</h2><p>Consulta las respuestas individuales y analiza el perfil generado para cada participante.</p></div>
        <div class="page-tools">
          <input class="input input--sm input--search" type="search" data-search="respuestas" value="${esc(state.search.respuestas)}" placeholder="Buscar respuestas…" style="width:210px">
          <div class="seg" role="group" aria-label="Fecha">
            ${[['all', 'Todo'], ['today', 'Hoy'], ['7d', '7 días'], ['30d', '30 días']].map(([v, l]) => `<button type="button" class="${state.respFilter.period === v ? 'is-active' : ''}" data-action="resp-period" data-value="${v}">${l}</button>`).join('')}
          </div>
          <select class="input input--sm" data-filter="course" style="width:220px"><option value="">Todos los cursos</option>${courseIds.map((id) => `<option value="${esc(id)}" ${state.respFilter.course === id ? 'selected' : ''}>${esc(courseTitle(id))}</option>`).join('')}</select>
          <button class="btn btn--line btn--sm" type="button" data-action="export-csv" ${rows.length ? '' : 'disabled'}>${I.download} Exportar CSV</button>
        </div>
      </div>
      ${rows.length ? `
      <div class="table-wrap">
        <table>
          <thead><tr><th>Usuario</th><th>Fecha</th><th>Perfil</th><th>Curso recomendado</th><th>Estado</th></tr></thead>
          <tbody>
            ${shown.map((r) => { const st = statusOf(r); const perfil = perfilDe(r); return `
              <tr data-action="row-open" data-id="${esc(r.id)}" tabindex="0">
                <td data-label="Usuario">${esc(r.email || 'Anónimo')}<span class="sub">${r.device === 'mobile' ? 'Celular' : r.device === 'desktop' ? 'Computadora' : '—'}${Number.isFinite(r.durationSec) ? ` · ${esc(fmtSec(r.durationSec))}` : ''}</span></td>
                <td class="nowrap" data-label="Fecha">${esc(fmtDateShort(r.createdAt))}<span class="sub">${esc(fmtTime(r.createdAt))}</span></td>
                <td data-label="Perfil">${perfil.length ? `${esc(perfil[0])}${perfil[1] ? `<span class="sub">${esc(perfil[1])}</span>` : ''}` : '<span class="muted">—</span>'}</td>
                <td data-label="Curso recomendado">${r.courseId ? `${esc(courseTitle(r.courseId))}${r.classN ? `<span class="sub">Clase ${r.classN}</span>` : ''}` : '<span class="muted">—</span>'}</td>
                <td data-label="Estado"><span class="status ${st.cls}">${esc(st.label)}</span></td>
              </tr>`; }).join('')}
          </tbody>
        </table>
      </div>
      <div class="table-foot">
        <span>Mostrando ${num(shown.length)} de ${num(rows.length)}${state.responses.length >= MAX_RESPONSES ? ` (máximo ${num(MAX_RESPONSES)} cargadas)` : ''}</span>
        ${shown.length < rows.length ? '<button class="btn btn--line btn--sm" type="button" data-action="page-more">Mostrar más</button>' : ''}
      </div>` : emptyState(state.responses.length ? 'Nada coincide con los filtros' : 'Todavía no hay respuestas', state.responses.length ? 'Prueba con otra palabra, periodo o curso.' : 'Comparte la encuesta para empezar a recopilar datos.', state.responses.length ? '' : `<a class="btn btn--sm" href="../" target="_blank" rel="noopener">Ver encuesta ${I.external}</a>`)}`;
  };

  const openDrawer = (id) => {
    const r = state.responses.find((x) => x.id === id);
    if (!r) return;
    state.drawerId = id;
    const st = statusOf(r);
    const course = courseOf(r.courseId);
    els.drawer.innerHTML = `
      <div class="drawer-backdrop" data-action="drawer-close"></div>
      <aside class="drawer" role="dialog" aria-label="Detalle de la respuesta">
        <div class="drawer__head">
          <div><h3>${esc(r.email || 'Respuesta anónima')}</h3><p>${esc(fmtDate(r.createdAt))} · ${r.device === 'mobile' ? 'celular' : r.device === 'desktop' ? 'computadora' : 'dispositivo desconocido'}${Number.isFinite(r.durationSec) ? ` · ${esc(fmtSec(r.durationSec))}` : ''}</p></div>
          <button class="icon-btn" type="button" data-action="drawer-close" aria-label="Cerrar">${I.x}</button>
        </div>
        <div class="drawer__body">
          <div><span class="status ${st.cls}">${esc(st.label)}</span>${r.clickedAt ? `<span class="small muted">clic ${esc(relTime(r.clickedAt))}</span>` : ''}</div>
          <h4>Recomendación</h4>
          <dl class="kv">
            <div><dt>Curso</dt><dd>${esc(courseTitle(r.courseId))}${course?.category ? ` <span class="muted">· ${esc(course.category)}</span>` : ''}</dd></div>
            <div><dt>Clase</dt><dd>${r.classN ? `Clase ${r.classN}` : '—'}</dd></div>
            ${r.matches.length ? `<div><dt>Coincidencias</dt><dd>${r.matches.map((m) => `<span class="pill pill--green" style="margin:0 4px 4px 0">${esc(m)}</span>`).join('')}</dd></div>` : ''}
          </dl>
          <h4>Respuestas</h4>
          <dl class="kv">
            ${state.config.preguntas.map((q) => `<div><dt>${esc(q.kicker || q.id)}</dt><dd>${labelsFor(r, q).map((l) => esc(l)).join('<br>') || '<span class="muted">—</span>'}</dd></div>`).join('')}
          </dl>
          <h4>Detalles</h4>
          <dl class="kv">
            <div><dt>Cuenta</dt><dd>${r.uid ? `${esc(r.email || '')}<span class="sub muted small">${esc(r.uid)}</span>` : 'Sin sesión'}</dd></div>
            <div><dt>Entró al curso</dt><dd>${r.enteredCourse ? `Sí${r.enteredAt ? ` · ${esc(fmtDate(r.enteredAt))}` : ''}` : 'No'}</dd></div>
            <div><dt>Origen</dt><dd>${esc(r.ref || 'directo')}</dd></div>
            <div><dt>Versión</dt><dd>${esc(r.configVersion || '—')}</dd></div>
            <div><dt>ID</dt><dd class="small muted">${esc(r.id)}</dd></div>
          </dl>
        </div>
        <div class="drawer__foot">
          <button class="btn btn--danger btn--sm" type="button" data-action="r-delete" data-id="${esc(r.id)}">${I.trash} Eliminar respuesta</button>
          <button class="btn btn--line btn--sm" type="button" data-action="drawer-close">Cerrar</button>
        </div>
      </aside>`;
    document.body.style.overflow = 'hidden';
  };
  const closeDrawer = () => { state.drawerId = null; els.drawer.innerHTML = ''; document.body.style.overflow = ''; };

  const exportCsv = () => {
    const qs = state.config.preguntas;
    const rows = visibleResponses();
    const quote = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const header = ['fecha', 'usuario', 'dispositivo', 'segundos', ...qs.map((q) => q.kicker || q.id), 'curso_sugerido', 'clase', 'clic_clase', 'entro_curso', 'version_config', 'id'];
    const lines = rows.map((r) => [
      r.createdAt ? r.createdAt.toISOString() : '', r.email || '', r.device, r.durationSec ?? '',
      ...qs.map((q) => labelsFor(r, q).join(' | ')),
      courseTitle(r.courseId), r.classN ?? '', r.clickedClass ? 'si' : 'no', r.enteredCourse ? 'si' : 'no', r.configVersion, r.id
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
      closeDrawer();
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
      ${opts.textarea ? `<textarea class="input" data-path="${path}">${esc(value)}</textarea>` : `<input class="input ${opts.mono ? 'input--mono' : ''}" data-path="${path}" ${opts.type ? `type="${opts.type}" data-type="number"` : ''} value="${esc(value)}" placeholder="${esc(opts.placeholder || '')}">`}
      ${opts.help ? `<small>${esc(opts.help)}</small>` : ''}
    </div>`;
  const accordion = (title, desc, fields, open = false) => `
    <details class="acc" ${open ? 'open' : ''}>
      <summary><div><strong>${esc(title)}</strong><span>${esc(desc)}</span></div>${I.chevron}</summary>
      <div class="acc__body form-grid">${fields}</div>
    </details>`;

  const renderTextos = () => {
    const t = state.draft.textos;
    view('textos').innerHTML = `
      <div class="page-head">
        <div><h2>Textos</h2><p>Lo que dice la encuesta en cada pantalla. Usa <code>{n}</code> para el número de preguntas y <code>{c}</code> para los cursos disponibles.</p></div>
        <div class="page-tools"><button class="btn btn--ghost btn--sm" type="button" data-action="restore" data-section="textos">Restaurar predeterminados</button></div>
      </div>
      ${accordion('Pantalla de bienvenida', 'Título, subtítulo, texto introductorio y los tres datos de confianza', `
        ${textField('Etiqueta superior', 'textos.intro.eyebrow', t.intro.eyebrow)}
        ${textField('Aviso legal', 'textos.intro.legal', t.intro.legal)}
        ${textField('Título (verde oscuro)', 'textos.intro.title', t.intro.title)}
        ${textField('Título (verde claro)', 'textos.intro.titleAccent', t.intro.titleAccent)}
        ${textField('Texto introductorio', 'textos.intro.subtitle', t.intro.subtitle, { span: true, textarea: true })}
        ${(t.intro.stats || []).slice(0, 3).map((s, i) => `
          <div class="field"><label>Dato ${i + 1} · ícono</label>${selectMarkup(`textos.intro.stats.${i}.icon`, s.icon, STAT_ICONS.map((ic) => [ic, ic]))}</div>
          <div class="field"><label>Dato ${i + 1} · texto</label><div style="display:grid;gap:6px"><input class="input input--sm" data-path="textos.intro.stats.${i}.title" value="${esc(s.title)}" placeholder="Título"><input class="input input--sm" data-path="textos.intro.stats.${i}.detail" value="${esc(s.detail)}" placeholder="Detalle"></div></div>`).join('')}`, true)}
      ${accordion('Durante la encuesta', 'Mensajes de avance y globos del personaje', `
        ${textField('Nombre del personaje', 'textos.personaje.nombre', t.personaje.nombre)}
        ${textField('Personaje al iniciar', 'textos.personaje.intro', t.personaje.intro)}
        ${textField('Personaje durante las preguntas', 'textos.personaje.pregunta', t.personaje.pregunta)}
        ${textField('Personaje a la mitad', 'textos.personaje.mitad', t.personaje.mitad)}
        ${textField('Personaje casi al final', 'textos.personaje.casi', t.personaje.casi)}
        ${textField('Personaje en el resultado', 'textos.personaje.resultado', t.personaje.resultado)}
        ${textField('Avance · a la mitad', 'textos.avance.mitad', t.avance.mitad)}
        ${textField('Avance · casi al final', 'textos.avance.casi', t.avance.casi)}
        ${textField('Avance · última pregunta', 'textos.avance.ultima', t.avance.ultima)}`)}
      ${accordion('Pantalla de análisis', 'Lo que se ve mientras se calcula la recomendación', `
        ${textField('Título', 'textos.analizando.title', t.analizando.title)}
        ${textField('Personaje mientras analiza', 'textos.personaje.analizando', t.personaje.analizando)}
        ${(t.analizando.steps || []).slice(0, 3).map((s, i) => textField(`Paso ${i + 1}`, `textos.analizando.steps.${i}`, s)).join('')}
        ${textField('Duración (milisegundos)', 'textos.analizando.durationMs', t.analizando.durationMs, { type: 'number' })}`)}
      ${accordion('Pantalla de resultados', 'Etiqueta, título, descripción y texto de la recomendación', `
        ${textField('Etiqueta superior', 'textos.final.eyebrow', t.final.eyebrow)}
        ${textField('Etiqueta de la tarjeta del curso', 'textos.final.courseEyebrow', t.final.courseEyebrow)}
        ${textField('Título (verde oscuro)', 'textos.final.title', t.final.title)}
        ${textField('Título (verde claro)', 'textos.final.titleAccent', t.final.titleAccent)}
        ${textField('Descripción', 'textos.final.subtitle', t.final.subtitle, { span: true, textarea: true })}
        ${textField('Inicio de la explicación', 'textos.final.whyPrefix', t.final.whyPrefix, { help: 'Se completa con las coincidencias de la persona.' })}
        ${textField('Mensaje si no hay cursos', 'textos.final.emptyCourses', t.final.emptyCourses)}`)}
      ${accordion('Clase recomendada', 'Bloque "Empieza con esta clase"', `
        ${textField('Título del bloque', 'textos.final.classEyebrow', t.final.classEyebrow)}
        ${textField('Texto descriptivo', 'textos.final.classHint', t.final.classHint)}`)}
      ${accordion('Botones', 'Textos de los botones en todas las pantallas', `
        ${textField('Empezar (bienvenida)', 'textos.intro.button', t.intro.button)}
        ${textField('Continuar', 'textos.nav.next', t.nav.next)}
        ${textField('Última pregunta', 'textos.nav.finish', t.nav.finish)}
        ${textField('Atrás', 'textos.nav.back', t.nav.back)}
        ${textField('Botón principal del resultado', 'textos.final.button', t.final.button)}
        ${textField('Botón secundario del resultado', 'textos.final.secondary', t.final.secondary)}
        ${textField('Responder de nuevo', 'textos.final.again', t.final.again)}
        ${textField('Responder después', 'textos.nav.later', t.nav.later)}
        ${textField('Pista de teclado', 'textos.nav.hint', t.nav.hint)}`)}
      ${accordion('Enlaces', 'Club, catálogo y destino de "Responder después"', `
        ${textField('URL del club (destino de la clase)', 'clubUrl', state.draft.clubUrl, { mono: true, help: 'Las clases se abren en {club}/#/curso/{id}/clase/{n}.' })}
        ${textField('Catálogo (botón secundario)', 'textos.final.secondaryUrl', t.final.secondaryUrl, { mono: true })}
        ${textField('Destino de "Responder después"', 'textos.nav.laterUrl', t.nav.laterUrl, { mono: true, help: '../ lleva al inicio del sitio.' })}`)}`;
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
  const updateTabBadges = () => { const tab = $('.tab[data-tab="respuestas"]'); if (tab) tab.innerHTML = `Respuestas <span class="badge">${num(state.responses.length)}</span>`; };
  const TABS = ['resumen', 'preguntas', 'cursos', 'respuestas', 'textos'];
  const switchTab = (name) => {
    if (!name || state.tab === name) return;
    state.tab = name;
    if (location.hash !== `#${name}`) history.replaceState(null, '', `#${name}`);
    render();
    window.scrollTo({ top: 0 });
  };
  const closeMenus = () => $$('.menu').forEach((m) => { m.hidden = true; });

  /* ---------- Acciones ---------- */
  const actions = {
    period: ({ value }) => { state.period = value; renderTab(); },
    'resp-period': ({ value }) => { state.respFilter.period = value; state.page = 1; renderTab(); },
    'toggle-interests': () => { state.showAllInterests = !state.showAllInterests; renderTab(); },
    reload: () => loadAll(),
    'export-csv': () => exportCsv(),
    'page-more': () => { state.page += 1; renderTab(); },
    'cursos-filter': ({ value }) => { state.cursosFilter = value; renderTab(); },
    'toggle-item': ({ col, i }) => { const set = state.open[col]; const index = Number(i); set.has(index) ? set.delete(index) : set.add(index); renderTab(); },
    menu: (_, button) => { const menu = button.nextElementSibling; const wasHidden = menu.hidden; closeMenus(); menu.hidden = !wasHidden; },
    'row-open': ({ id }) => openDrawer(id),
    'drawer-close': () => closeDrawer(),
    'q-add': () => {
      state.draft.preguntas.push({ id: `pregunta-${uid()}`, dimension: 'none', enabled: true, kicker: 'Nueva', title: 'Nueva pregunta', hint: '', type: 'single', max: 3, layout: 'cards', mood: 'point', bubble: '', options: [
        { value: 'opcion-1', icon: 'i:sparkles', title: 'Opción 1', detail: '', image: '' }, { value: 'opcion-2', icon: 'i:sparkles', title: 'Opción 2', detail: '', image: '' }
      ] });
      state.open.preguntas = new Set([state.draft.preguntas.length - 1]);
      markDirty(); renderTab();
      view('preguntas').querySelector('.row-item.is-open')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    'q-duplicate': ({ i }) => {
      const copy = clone(state.draft.preguntas[Number(i)]);
      copy.id = `${copy.id}-copia`;
      copy.title = `${copy.title} (copia)`;
      state.draft.preguntas.splice(Number(i) + 1, 0, copy);
      state.open.preguntas = new Set([Number(i) + 1]);
      markDirty(); renderTab();
    },
    'q-remove': ({ i }) => {
      const q = state.draft.preguntas[Number(i)];
      if (state.draft.preguntas.length <= 1) return toast('Debe quedar al menos una pregunta.', 'error');
      if (!window.confirm(`¿Eliminar la pregunta "${q.title}"? Las respuestas anteriores se conservan pero dejarán de mostrarse.`)) return;
      state.draft.preguntas.splice(Number(i), 1);
      state.open.preguntas = new Set();
      markDirty(); renderTab();
    },
    'q-up': ({ i }) => { move(state.draft.preguntas, Number(i), Number(i) - 1); state.open.preguntas = new Set(); markDirty(); renderTab(); },
    'q-down': ({ i }) => { move(state.draft.preguntas, Number(i), Number(i) + 1); state.open.preguntas = new Set(); markDirty(); renderTab(); },
    'opt-add': ({ q }) => {
      const question = state.draft.preguntas[Number(q)];
      question.options.push({ value: `opcion-${question.options.length + 1}-${uid()}`, icon: 'i:sparkles', title: '', detail: '', image: '' });
      markDirty(); renderTab();
      $$(`[data-path="preguntas.${q}.options.${question.options.length - 1}.title"]`)[0]?.focus();
    },
    'opt-remove': ({ q, i }) => { state.draft.preguntas[Number(q)].options.splice(Number(i), 1); markDirty(); renderTab(); },
    'opt-up': ({ q, i }) => { move(state.draft.preguntas[Number(q)].options, Number(i), Number(i) - 1); markDirty(); renderTab(); },
    'opt-down': ({ q, i }) => { move(state.draft.preguntas[Number(q)].options, Number(i), Number(i) + 1); markDirty(); renderTab(); },
    'c-add': () => {
      state.draft.cursos.unshift({ id: `curso-${uid()}`, title: 'Nuevo curso', category: '', level: '', image: '', url: '', summary: '', tags: { interests: [], goals: [], profiles: [], problems: [], levels: [] }, featuredClass: 1, available: true, classes: [{ n: 1, title: 'Clase 1', min: null, free: false }] });
      state.open.cursos = new Set([0]);
      state.cursosFilter = 'all'; state.search.cursos = '';
      markDirty(); renderTab();
      $$('[data-path="cursos.0.title"]')[0]?.focus();
    },
    'c-duplicate': ({ i }) => {
      const copy = clone(state.draft.cursos[Number(i)]);
      copy.id = `${copy.id}-copia`;
      copy.title = `${copy.title} (copia)`;
      state.draft.cursos.splice(Number(i) + 1, 0, copy);
      state.open.cursos = new Set([Number(i) + 1]);
      markDirty(); renderTab();
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
    'c-tag': ({ i, group, value }, button) => {
      const c = state.draft.cursos[Number(i)];
      c.tags = c.tags || {};
      const list = Array.isArray(c.tags[group]) ? c.tags[group] : (c.tags[group] = []);
      const index = list.indexOf(value);
      index >= 0 ? list.splice(index, 1) : list.push(value);
      button.classList.toggle('is-on', index < 0);
      markDirty();
    },
    'k-add': ({ c }) => {
      const course = state.draft.cursos[Number(c)];
      course.classes = Array.isArray(course.classes) ? course.classes : [];
      const n = (course.classes.reduce((m, k) => Math.max(m, Number(k.n) || 0), 0) || 0) + 1;
      course.classes.push({ n, title: `Clase ${n}`, min: null, free: false });
      markDirty(); renderTab();
    },
    'k-remove': ({ c, i }) => { state.draft.cursos[Number(c)].classes.splice(Number(i), 1); markDirty(); renderTab(); },
    restore: ({ section }) => {
      if (!window.confirm(`¿Restaurar ${section} a los valores predeterminados? Se aplicará al guardar.`)) return;
      state.draft[section] = clone(DEFAULTS[section]);
      state.open.preguntas = new Set();
      state.open.cursos = new Set();
      markDirty(); renderTab();
    },
    'r-delete': ({ id }) => deleteResponse(id)
  };

  const handleAction = (event) => {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    if (event.target.closest('[data-stop]')) return;
    if (target.tagName === 'TR' && event.target.closest('a, button, input, select')) return;
    event.preventDefault();
    if (target.dataset.action !== 'menu') closeMenus();
    actions[target.dataset.action]?.(target.dataset, target);
  };
  els.content.addEventListener('click', handleAction);
  els.drawer.addEventListener('click', handleAction);
  els.content.addEventListener('keydown', (event) => { if (event.key === 'Enter' && event.target.matches('tr[data-action="row-open"]')) { event.preventDefault(); openDrawer(event.target.dataset.id); } });
  document.addEventListener('click', (event) => { if (!event.target.closest('.menu-wrap')) closeMenus(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeMenus(); if (state.drawerId) closeDrawer(); } });

  let searchTimer = 0;
  els.content.addEventListener('change', (event) => {
    const el = event.target;
    if (el.dataset.filter === 'course') { state.respFilter.course = el.value; state.page = 1; renderTab(); }
  });
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
    if (el.dataset.type === 'number') value = el.value === '' ? null : Number(value);
    setPath(state.draft, path, value);
    markDirty();
    if (el.type === 'checkbox' && el.closest('.row-item__actions')) {
      const label = el.closest('.switch')?.querySelector('span');
      if (label) label.textContent = el.checked ? (el.dataset.on || 'Disponible') : (el.dataset.off || 'Oculto');
      el.closest('.row-item')?.classList.toggle('is-off', !el.checked);
    }
    if (el.dataset.iconPreview !== undefined) { const preview = el.closest('.icon-field')?.querySelector('.icon-preview'); if (preview) preview.innerHTML = iconMarkup(el.value); }
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
    if (bar) { showTooltip(`<b>${esc(bar.dataset.label)}</b><span>${num(bar.dataset.count)} ${Number(bar.dataset.count) === 1 ? 'respuesta' : 'respuestas'}${bar.dataset.pct != null ? ` · ${bar.dataset.pct}%` : ''}</span>`, event.clientX, event.clientY); return; }
    hideTooltip();
    const donut = event.target.closest('.donut');
    $$('.donut.has-hover').forEach((d) => { if (d !== donut) { d.classList.remove('has-hover'); $$('.is-hot', d).forEach((n) => n.classList.remove('is-hot')); } });
  });
  els.content.addEventListener('mouseleave', () => { hideTooltip(); $$('.donut.has-hover').forEach((d) => { d.classList.remove('has-hover'); $$('.is-hot', d).forEach((n) => n.classList.remove('is-hot')); }); });

  /* Pestañas y barra de guardado */
  els.tabs.addEventListener('click', (event) => { const tab = event.target.closest('.tab'); if (tab) switchTab(tab.dataset.tab); });
  els.btnSave.addEventListener('click', save);
  els.btnDiscard.addEventListener('click', () => { if (window.confirm('¿Descartar los cambios sin guardar?')) discard(); });
  els.btnLogin.addEventListener('click', login);
  els.btnLogout.addEventListener('click', logout);
  els.btnLogoutGate.addEventListener('click', logout);
  window.addEventListener('beforeunload', (event) => { if (state.dirty) { event.preventDefault(); event.returnValue = ''; } });
  window.addEventListener('hashchange', () => { const name = location.hash.slice(1); if (TABS.includes(name)) switchTab(name); });

  /* ---------- Arranque ---------- */
  const boot = async () => {
    const initial = location.hash.slice(1);
    if (TABS.includes(initial)) state.tab = initial;
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
