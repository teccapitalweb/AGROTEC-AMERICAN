(() => {
'use strict';

const questions = [
{
id: 'stage', kicker: 'Tu etapa',
title: '¿Qué te describe mejor hoy en el campo?',
hint: 'Así ajustamos el nivel de lo que te recomendamos.', label: 'Etapa', type: 'single',
options: [
{ value: 'producer', icon: '🌱', title: 'Productor o productora', detail: 'Trabajo mi propia parcela o rancho.' },
{ value: 'advisor', icon: '🧭', title: 'Asesor técnico o agrónomo', detail: 'Acompaño a productores en campo.' },
{ value: 'student', icon: '🎓', title: 'Estudiante del área agro', detail: 'Estoy formándome en la escuela.' },
{ value: 'business', icon: '📦', title: 'Empresa o negocio agro', detail: 'Vendo, distribuyo o transformo producto.' },
{ value: 'teacher', icon: '🔬', title: 'Docente o investigador', detail: 'Enseño o investigo en el sector.' },
{ value: 'other', icon: '✨', title: 'Otra etapa', detail: 'Me interesa el campo y estoy empezando.' }
],
guide: ['TU PUNTO DE PARTIDA', 'Empezamos contigo, no con un curso.', 'Son 7 preguntas rápidas y solo se hace una vez.']
},
{
id: 'experience', kicker: 'Tu experiencia',
title: '¿Cuánta experiencia tienes en el campo?',
hint: 'Cuenta el tiempo trabajando cultivos, dentro o fuera de la escuela.', label: 'Experiencia', type: 'single',
options: [
{ value: 'studying', icon: '📖', title: 'Aún estoy estudiando', detail: 'Todavía no trabajo en campo.' },
{ value: 'lt1', icon: '🌿', title: 'Menos de 1 año', detail: 'Voy dando mis primeros pasos.' },
{ value: '1-3', icon: '🌾', title: 'De 1 a 3 años', detail: 'Ya viví algunos ciclos completos.' },
{ value: '4-7', icon: '🚜', title: 'De 4 a 7 años', detail: 'Tengo experiencia práctica sólida.' },
{ value: '8plus', icon: '🏆', title: '8 años o más', detail: 'Busco especializarme y profundizar.' }
],
guide: ['A TU NIVEL', 'Ni demasiado básico ni innecesariamente complejo.', 'Tu experiencia define la profundidad de tu ruta.']
},
{
id: 'source', kicker: 'Cómo llegaste',
title: '¿Cómo conociste AgroTec América?',
hint: 'Elige el lugar donde nos viste por primera vez.', label: 'Medio por el que nos conociste', type: 'single', layout: 'tiles',
options: [
{ value: 'instagram', icon: '📸', title: 'Instagram' },
{ value: 'facebook', icon: '📘', title: 'Facebook' },
{ value: 'tiktok', icon: '🎵', title: 'TikTok' },
{ value: 'google', icon: '🔎', title: 'Google' },
{ value: 'whatsapp', icon: '💬', title: 'WhatsApp' },
{ value: 'referral', icon: '🤝', title: 'Colega o productor' },
{ value: 'event', icon: '📅', title: 'Curso o evento' },
{ value: 'other', icon: '✨', title: 'Otro medio' }
],
guide: ['NOS DA GUSTO VERTE', 'Saber cómo llegaste nos ayuda a encontrar a más gente como tú.', 'Solo toma un toque.']
},
{
id: 'goal', kicker: 'Tu objetivo',
title: '¿Qué quieres lograr principalmente?',
hint: 'Elige el que más pese hoy; después puedes explorar todo lo demás.', label: 'Objetivo principal', type: 'single',
options: [
{ value: 'yield', icon: '📈', title: 'Mejorar el rendimiento', detail: 'Sacar más y mejor cosecha de mi cultivo.' },
{ value: 'update', icon: '🔄', title: 'Mantenerme actualizado', detail: 'Conocer nuevas prácticas y tecnologías.' },
{ value: 'certify', icon: '🏅', title: 'Obtener una certificación', detail: 'Respaldar lo que sé con una constancia.' },
{ value: 'costs', icon: '💰', title: 'Bajar costos de producción', detail: 'Invertir mejor en insumos y labores.' },
{ value: 'grow', icon: '🚀', title: 'Emprender o crecer', detail: 'Arrancar o hacer crecer un negocio agro.' },
{ value: 'tools', icon: '🧰', title: 'Conseguir herramientas', detail: 'Formatos, calculadoras y registros de campo.' }
],
guide: ['TU META ES LA BRÚJULA', 'No queremos acumular clases.', 'Queremos acercarte a un resultado que puedas notar.']
},
{
id: 'areas', kicker: 'Tus intereses',
title: '¿Qué áreas te interesan más?',
hint: 'Elige hasta tres. Con esto ordenamos los cursos que verás primero.', label: 'Áreas de interés', type: 'multi', max: 3,
options: [
{ value: 'health', icon: '🪲', title: 'Plagas y enfermedades', detail: 'Prevención, diagnóstico y manejo.' },
{ value: 'soil', icon: '🧪', title: 'Suelo y nutrición', detail: 'Análisis, fertilización y enmiendas.' },
{ value: 'water', icon: '💧', title: 'Riego y fertirrigación', detail: 'Aprovechar cada gota y cada gramo.' },
{ value: 'protected', icon: '🏠', title: 'Invernadero e hidroponía', detail: 'Producción en ambiente controlado.' },
{ value: 'crops', icon: '🍅', title: 'Frutales y hortalizas', detail: 'Manejo por cultivo y especialización.' },
{ value: 'organic', icon: '🍃', title: 'Orgánico y bioinsumos', detail: 'Producción sustentable y certificable.' },
{ value: 'business', icon: '📊', title: 'Costos y comercialización', detail: 'Registros, precios y venta.' },
{ value: 'tech', icon: '🛰️', title: 'Agricultura de precisión', detail: 'Drones, sensores y datos.' }
],
guide: ['MEZCLA TUS INTERESES', 'El campo conecta técnica, negocio y tecnología.', 'Escoge lo que de verdad te daría ganas de aprender.']
},
{
id: 'format', kicker: 'Cómo aprendes',
title: '¿Cómo prefieres aprender?',
hint: 'Nos ayuda a decidir qué producir primero.', label: 'Formato preferido', type: 'single',
options: [
{ value: 'video', icon: '▶️', title: 'Clases cortas en video', detail: 'Ir directo a una idea que pueda aplicar.' },
{ value: 'cases', icon: '🔍', title: 'Casos de campo paso a paso', detail: 'Ver cómo se resolvió un problema real.' },
{ value: 'live', icon: '📡', title: 'Sesiones en vivo', detail: 'Resolver dudas con una persona experta.' },
{ value: 'guides', icon: '🗒️', title: 'Guías y formatos', detail: 'Material para consultar y usar en campo.' },
{ value: 'quiz', icon: '🎯', title: 'Quizzes y retos', detail: 'Practicar y medir lo que aprendí.' }
],
guide: ['APRENDER A TU MANERA', 'El mejor formato es el que sí vuelves a abrir.', 'Tu preferencia nos ayuda a ordenar el contenido.']
},
{
id: 'barrier', kicker: 'Tu reto',
title: '¿Qué es lo que más te dificulta seguir capacitándote?',
hint: 'Queremos quitar ese obstáculo, no sumar otro.', label: 'Principal obstáculo', type: 'single',
options: [
{ value: 'time', icon: '🕒', title: 'Falta de tiempo', detail: 'La temporada no me deja respirar.' },
{ value: 'cost', icon: '💳', title: 'El costo de los cursos', detail: 'Necesito que la inversión valga la pena.' },
{ value: 'trust', icon: '🔎', title: 'Encontrar contenido confiable', detail: 'Hay mucha información sin respaldo.' },
{ value: 'practice', icon: '🌾', title: 'Llevar la teoría a la parcela', detail: 'Me cuesta aplicarlo en mi cultivo.' },
{ value: 'signal', icon: '📶', title: 'Poca señal en el campo', detail: 'El internet no siempre me alcanza.' },
{ value: 'other', icon: '💭', title: 'Otro motivo', detail: 'Algo distinto me lo complica.' }
],
guide: ['CASI TERMINAMOS', 'Tu respuesta nos ayuda a quitar barreras.', 'Así tu ruta se adapta a tu realidad.']
}
];

const card = document.querySelector('.question-card');
const guide = document.querySelector('.guide');
const totalSteps = questions.length;
const state = { step: 0, answers: {}, finished: false, locked: false };

const getFlow = () => questions;

const getAnswerValues = (id) => {
const value = state.answers[id];
return Array.isArray(value) ? value : value ? [value] : [];
};

const findQuestion = (id) => questions.find((question) => question.id === id);
const optionTitle = (id, value) => findQuestion(id)?.options.find((option) => option.value === value)?.title || '';

const updateGuide = (copy) => {
if (!guide || !copy) return;
const [label, title, body] = copy;
guide.querySelector('.guide__bubble').innerHTML = `<span>${label}</span><strong>${title}</strong><p>${body}</p>`;
};

const answerMarkup = (question, option, index, selected) => `
<button class="answer" type="button" role="${question.type === 'multi' ? 'checkbox' : 'radio'}"
aria-checked="${selected}" data-answer="${option.value}">
<span class="answer__icon" aria-hidden="true">${option.icon}</span>
<span><strong>${option.title}</strong>${option.detail ? `<small>${option.detail}</small>` : ''}</span>
<span class="answer__key" aria-hidden="true">${selected && question.type === 'multi' ? '✓' : index + 1}</span>
</button>`;

const answersClass = (question) => {
if (question.layout === 'tiles') return 'answers--tiles';
return question.type === 'multi' ? 'answers--topics' : 'answers--compact';
};

const renderQuestion = () => {
const flow = getFlow();
const question = flow[state.step];
const selected = getAnswerValues(question.id);
const progress = Math.round(((state.step + 1) / totalSteps) * 100);
const isMulti = question.type === 'multi';
const selectedLabel = isMulti ? `<span class="selection-count">${selected.length} de ${question.max}</span>` : 'Selecciona una respuesta y avanzamos';

card.classList.remove('question-card--result');
card.innerHTML = `
<div class="progress" role="progressbar" aria-label="Avance de la encuesta" aria-valuemin="1" aria-valuemax="${totalSteps}" aria-valuenow="${state.step + 1}">
<div class="progress__meta"><span>Paso <strong>${String(state.step + 1).padStart(2, '0')}</strong> de ${String(totalSteps).padStart(2, '0')}</span><span>${progress}% completado</span></div>
<div class="progress__track"><span style="width:${progress}%"></span></div>
</div>
<div class="question-card__content question-card__content--enter">
<p class="eyebrow">${question.kicker}</p>
<h1 id="survey-title" tabindex="-1">${question.title}</h1>
<p class="question-card__hint">${question.hint}</p>
<div class="answers ${answersClass(question)}" role="${isMulti ? 'group' : 'radiogroup'}" aria-label="${question.label}">
${question.options.map((option, index) => answerMarkup(question, option, index, selected.includes(option.value))).join('')}
</div>
</div>
<footer class="question-card__footer">
<button class="back-button" type="button" data-back ${state.step === 0 ? 'disabled' : ''}>
<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg>Atrás
</button>
<div class="question-card__footer-actions">
<span>${selectedLabel}</span>
${isMulti ? `<button class="next-button" type="button" data-next ${selected.length ? '' : 'disabled'}>${state.step === flow.length - 1 ? 'Ver mi ruta' : 'Continuar'}</button>` : ''}
</div>
</footer>`;

updateGuide(question.guide);
bindQuestion(question);
};

const routes = {
health: { title: 'Sanidad vegetal aplicada', description: 'Detecta a tiempo, diagnostica con criterio y decide el manejo correcto para cada plaga o enfermedad.' },
soil: { title: 'Suelo y nutrición de cultivos', description: 'Entiende tu análisis de suelo y arma programas de fertilización que sí respondan a tu cultivo.' },
water: { title: 'Riego y fertirrigación eficiente', description: 'Aprovecha mejor el agua y los fertilizantes con cálculos y manejo práctico de tu sistema.' },
protected: { title: 'Agricultura protegida e hidroponía', description: 'Producción en invernadero, soluciones nutritivas y control del ambiente paso a paso.' },
crops: { title: 'Especialización por cultivo', description: 'Manejo técnico de frutales y hortalizas de la siembra a la cosecha.' },
organic: { title: 'Producción orgánica y bioinsumos', description: 'Prácticas sustentables, bioinsumos y lo que necesitas para certificar.' },
business: { title: 'Gestión y comercialización agro', description: 'Costos, registros y estrategias de venta para que tu producción sea rentable.' },
tech: { title: 'Agricultura de precisión', description: 'Datos, sensores y herramientas digitales para decidir mejor en cada ciclo.' }
};

const chooseRoute = () => {
const [firstArea] = getAnswerValues('areas');
if (firstArea && routes[firstArea]) return routes[firstArea];
return { title: 'Fundamentos para producir con confianza', description: 'Una ruta progresiva y práctica para dar el primer paso con buenas bases.' };
};

const finish = () => {
state.finished = true;
const route = chooseRoute();
const tags = [
optionTitle('stage', state.answers.stage),
optionTitle('experience', state.answers.experience),
optionTitle('goal', state.answers.goal),
...getAnswerValues('areas').map((value) => optionTitle('areas', value)),
optionTitle('format', state.answers.format)
].filter(Boolean);

card.classList.add('question-card--result');
card.innerHTML = `
<div class="progress" role="progressbar" aria-label="Encuesta completada" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100">
<div class="progress__meta"><span>Perfil listo</span><span>100% completado</span></div>
<div class="progress__track"><span style="width:100%"></span></div>
</div>
<div class="result question-card__content--enter">
<div class="result__mark" aria-hidden="true">✓</div>
<p class="eyebrow">Gracias por tomarte el minuto</p>
<h1 id="survey-title" tabindex="-1">Listo. Tu ruta ya te conoce.</h1>
<p class="result__intro">Con tus respuestas ordenaremos lo que ves primero y decidiremos qué contenido producir.</p>
<div class="result__route">
<small>Para empezar, según tus intereses</small>
<strong>${route.title}</strong>
<p>${route.description}</p>
</div>
<div class="result__tags">
${tags.map((tag) => `<span>${tag}</span>`).join('')}
</div>
<div class="result__actions">
<button class="result-button" type="button" data-restart>Responder de nuevo</button>
<button class="back-button" type="button" data-review>Revisar la última respuesta</button>
</div>
<small class="result__privacy">Esta versión no guarda ni envía tus respuestas.</small>
</div>`;

updateGuide(['PERFIL COMPLETO', 'Ya tenemos una dirección clara.', 'El siguiente paso será conectar cursos y recomendaciones reales.']);
card.querySelector('[data-restart]').addEventListener('click', restart);
card.querySelector('[data-review]').addEventListener('click', () => { state.finished = false; state.step = getFlow().length - 1; renderQuestion(); });
focusHeading();
};

const focusHeading = () => requestAnimationFrame(() => {
const heading = card.querySelector('h1');
if (heading && window.matchMedia('(max-width: 760px)').matches) heading.focus({ preventScroll: true });
});

const advance = () => {
const flow = getFlow();
if (state.step >= flow.length - 1) return finish();
state.step += 1;
renderQuestion();
focusHeading();
};

const bindQuestion = (question) => {
card.querySelectorAll('[data-answer]').forEach((button) => {
button.addEventListener('click', () => selectAnswer(question, button.dataset.answer));
});
card.querySelector('[data-back]')?.addEventListener('click', () => {
if (state.step === 0) return;
state.step -= 1;
renderQuestion();
focusHeading();
});
card.querySelector('[data-next]')?.addEventListener('click', advance);
};

const selectAnswer = (question, value) => {
if (question.type === 'multi') {
const current = getAnswerValues(question.id);
const index = current.indexOf(value);
if (index >= 0) current.splice(index, 1);
else if (current.length < question.max) current.push(value);
state.answers[question.id] = current;
renderQuestion();
return;
}

if (state.locked) return;
state.locked = true;
state.answers[question.id] = value;
card.querySelectorAll('[data-answer]').forEach((button) => button.setAttribute('aria-checked', String(button.dataset.answer === value)));
window.setTimeout(() => { state.locked = false; advance(); }, 220);
};

const restart = () => {
state.step = 0;
state.answers = {};
state.finished = false;
state.locked = false;
renderQuestion();
focusHeading();
};

document.addEventListener('keydown', (event) => {
if (state.finished || event.altKey || event.ctrlKey || event.metaKey) return;
const number = Number(event.key);
if (!Number.isInteger(number) || number < 1 || number > 9) return;
const target = card.querySelectorAll('[data-answer]')[number - 1];
if (target) target.click();
});

renderQuestion();
})();
