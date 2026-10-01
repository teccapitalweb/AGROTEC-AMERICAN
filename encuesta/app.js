(() => {
  'use strict';

  const profileQuestion = {
    id: 'profile',
    kicker: 'Empecemos por conocerte',
    title: '¿Cuál de estas frases se parece más a ti?',
    hint: 'Elige la que mejor describa tu momento actual.',
    label: 'Tu relación con el campo',
    type: 'single',
    options: [
      { value: 'producer', icon: '🌱', title: 'Produzco en el campo', detail: 'Quiero tomar mejores decisiones en mi cultivo.' },
      { value: 'advisor', icon: '🧭', title: 'Asesoro a productores', detail: 'Busco herramientas para acompañar mejor.' },
      { value: 'student', icon: '🎓', title: 'Estoy estudiando', detail: 'Quiero convertir lo que aprendo en experiencia.' },
      { value: 'business', icon: '📦', title: 'Tengo un negocio agro', detail: 'Busco hacerlo crecer o profesionalizarlo.' },
      { value: 'explorer', icon: '✨', title: 'Apenas estoy explorando', detail: 'Me interesa el campo y quiero encontrar mi camino.' }
    ],
    guide: ['TU PUNTO DE PARTIDA', 'Empezamos contigo, no con un curso.', 'Tu respuesta cambia las siguientes preguntas.']
  };

  const branchQuestions = {
    producer: {
      id: 'producer_focus', kicker: 'Lo que importa hoy',
      title: '¿Qué parte de tu trabajo te quita más tranquilidad?',
      hint: 'Piensa en el reto que más se repite durante la temporada.', label: 'Reto principal', type: 'single',
      options: [
        { value: 'health', icon: '🪲', title: 'Plagas y enfermedades', detail: 'Detectar a tiempo y actuar con criterio.' },
        { value: 'nutrition', icon: '🧪', title: 'Nutrición y suelo', detail: 'Entender qué necesita realmente el cultivo.' },
        { value: 'water', icon: '💧', title: 'Riego y uso del agua', detail: 'Aprovechar mejor cada recurso.' },
        { value: 'planning', icon: '📋', title: 'Planeación y costos', detail: 'Ordenar labores, registros e inversión.' },
        { value: 'market', icon: '🧺', title: 'Venta y comercialización', detail: 'Encontrar mejores oportunidades para lo que produzco.' }
      ],
      guide: ['VAMOS A LO CONCRETO', 'Un buen aprendizaje empieza con un reto real.', 'Elegir uno nos ayuda a priorizar tu ruta.']
    },
    advisor: {
      id: 'advisor_focus', kicker: 'Tu valor como asesor',
      title: '¿Qué te ayudaría a generar más valor en tus asesorías?',
      hint: 'Elige el cambio que más notarían tus productores.', label: 'Área de mejora', type: 'single',
      options: [
        { value: 'diagnosis', icon: '🔎', title: 'Diagnosticar con más precisión', detail: 'Leer señales y llegar mejor preparado.' },
        { value: 'recommendations', icon: '🗂️', title: 'Crear recomendaciones prácticas', detail: 'Traducir conocimiento en acciones claras.' },
        { value: 'updates', icon: '📚', title: 'Mantenerme actualizado', detail: 'Conocer nuevas prácticas y tecnologías.' },
        { value: 'reports', icon: '📊', title: 'Mejorar seguimiento y reportes', detail: 'Documentar avances y decisiones.' },
        { value: 'trust', icon: '🤝', title: 'Fortalecer la confianza', detail: 'Comunicar mejor el valor de mi trabajo.' }
      ],
      guide: ['TU EXPERIENCIA CUENTA', 'Queremos potenciar lo que ya sabes hacer.', 'La ruta se ajustará a tu práctica profesional.']
    },
    student: {
      id: 'student_stage', kicker: 'Tu momento de formación',
      title: '¿En qué etapa estás ahora?',
      hint: 'No importa la escuela ni la edad: solo tu punto de avance.', label: 'Etapa de formación', type: 'single',
      options: [
        { value: 'early', icon: '🌿', title: 'Primera mitad de la carrera', detail: 'Estoy construyendo mis bases.' },
        { value: 'late', icon: '🧠', title: 'Últimos semestres', detail: 'Quiero acercarme al trabajo real.' },
        { value: 'graduate', icon: '🚀', title: 'Recién egresé', detail: 'Busco experiencia y mejores oportunidades.' },
        { value: 'technical', icon: '🛠️', title: 'Formación técnica o autodidacta', detail: 'Aprendo fuera de una carrera tradicional.' }
      ],
      guide: ['APRENDER HACIENDO', 'La teoría se vuelve valiosa cuando puedes aplicarla.', 'Vamos a descubrir qué práctica te conviene más.']
    },
    business: {
      id: 'business_focus', kicker: 'Tu siguiente avance',
      title: '¿Dónde quieres notar una mejora primero?',
      hint: 'Elige el área que movería más a tu negocio.', label: 'Prioridad del negocio', type: 'single',
      options: [
        { value: 'sales', icon: '📈', title: 'Ventas y nuevos clientes', detail: 'Comercializar mejor lo que ofrecemos.' },
        { value: 'process', icon: '⚙️', title: 'Procesos y costos', detail: 'Trabajar con más orden y rentabilidad.' },
        { value: 'quality', icon: '🏅', title: 'Calidad del producto', detail: 'Elevar consistencia y valor.' },
        { value: 'digital', icon: '📱', title: 'Herramientas digitales', detail: 'Modernizar cómo operamos y decidimos.' },
        { value: 'team', icon: '👥', title: 'Capacitar al equipo', detail: 'Alinear conocimientos y buenas prácticas.' }
      ],
      guide: ['CRECER CON INTENCIÓN', 'Primero ubicamos la palanca con mayor impacto.', 'Después podremos recomendar capacitación útil.']
    },
    explorer: {
      id: 'explorer_motivation', kicker: 'Tu curiosidad tiene una razón',
      title: '¿Qué te acercó al mundo del campo?',
      hint: 'No necesitas experiencia previa para responder.', label: 'Motivación principal', type: 'single',
      options: [
        { value: 'family', icon: '🏡', title: 'Un proyecto familiar', detail: 'Quiero participar y aportar mejor.' },
        { value: 'idea', icon: '💡', title: 'Una idea de negocio', detail: 'Estoy evaluando una oportunidad.' },
        { value: 'career', icon: '🧭', title: 'Un cambio profesional', detail: 'Busco una nueva dirección para mi trabajo.' },
        { value: 'self', icon: '🥬', title: 'Producir para mí', detail: 'Quiero empezar algo propio y tangible.' },
        { value: 'curiosity', icon: '✨', title: 'Curiosidad por aprender', detail: 'Todavía estoy descubriendo qué me interesa.' }
      ],
      guide: ['TODO EMPIEZA CON CURIOSIDAD', 'No hace falta tener todas las respuestas.', 'Esta ruta también sirve para encontrar tu dirección.']
    }
  };

  const sharedQuestions = [
    {
      id: 'outcome', kicker: 'Hazlo significativo',
      title: '¿Qué resultado te haría decir “valió la pena”?',
      hint: 'Elige lo que más te gustaría conseguir con lo aprendido.', label: 'Resultado deseado', type: 'single',
      options: [
        { value: 'solve', icon: '🧩', title: 'Resolver un reto actual', detail: 'Aplicar una respuesta concreta pronto.' },
        { value: 'decide', icon: '🎯', title: 'Tomar mejores decisiones', detail: 'Entender el porqué antes de actuar.' },
        { value: 'start', icon: '🌱', title: 'Poner en marcha un proyecto', detail: 'Pasar de la idea al primer paso.' },
        { value: 'career', icon: '🚀', title: 'Mejorar mis oportunidades', detail: 'Fortalecer mi perfil profesional.' },
        { value: 'grow', icon: '📈', title: 'Crecer con más rentabilidad', detail: 'Usar el conocimiento para mejorar resultados.' }
      ],
      guide: ['TU META ES LA BRÚJULA', 'No queremos acumular clases.', 'Queremos acercarte a un resultado que puedas notar.']
    },
    {
      id: 'topics', kicker: 'Elige hasta tres',
      title: '¿Qué temas despiertan más tu curiosidad?',
      hint: 'Puedes combinar hasta tres intereses.', label: 'Temas de interés', type: 'multi', max: 3,
      options: [
        { value: 'crops', icon: '🌾', title: 'Cultivos y producción', detail: 'Manejo práctico y especialización.' },
        { value: 'soil', icon: '🧪', title: 'Suelo y nutrición', detail: 'Bases para cultivos más fuertes.' },
        { value: 'health', icon: '🪲', title: 'Sanidad vegetal', detail: 'Prevención, diagnóstico y manejo.' },
        { value: 'water', icon: '💧', title: 'Riego y agricultura protegida', detail: 'Eficiencia y ambientes controlados.' },
        { value: 'business', icon: '📊', title: 'Negocio y comercialización', detail: 'Costos, ventas y crecimiento.' },
        { value: 'technology', icon: '📱', title: 'Tecnología aplicada', detail: 'Datos y herramientas digitales.' }
      ],
      guide: ['MEZCLA TUS INTERESES', 'El campo conecta técnica, negocio y tecnología.', 'Escoge lo que de verdad te daría ganas de aprender.']
    },
    {
      id: 'experience', kicker: 'Sin exámenes',
      title: 'Cuando aparece un reto técnico, ¿cómo te sientes?',
      hint: 'Esto solo ajusta la profundidad de tu futura recomendación.', label: 'Nivel de experiencia', type: 'single',
      options: [
        { value: 'new', icon: '🌱', title: 'Voy empezando', detail: 'Necesito explicaciones claras y sin saltos.' },
        { value: 'basic', icon: '🧱', title: 'Entiendo lo esencial', detail: 'Ya tengo bases, pero quiero conectarlas mejor.' },
        { value: 'practical', icon: '🛠️', title: 'Tengo experiencia práctica', detail: 'Quiero comparar y perfeccionar lo que hago.' },
        { value: 'advanced', icon: '🔬', title: 'Busco especializarme', detail: 'Quiero profundidad, criterio y casos complejos.' }
      ],
      guide: ['A TU NIVEL', 'Ni demasiado básico ni innecesariamente complejo.', 'El punto ideal es donde aprendes sin perderte.']
    },
    {
      id: 'format', kicker: 'Tu forma de aprender',
      title: '¿Cómo disfrutas aprender más?',
      hint: 'Elige el formato que realmente mantendría tu atención.', label: 'Formato preferido', type: 'single',
      options: [
        { value: 'short', icon: '▶️', title: 'Lecciones breves y prácticas', detail: 'Ir directo a una idea que pueda aplicar.' },
        { value: 'guides', icon: '🗒️', title: 'Guías y listas de verificación', detail: 'Tener un material para consultar después.' },
        { value: 'live', icon: '💬', title: 'Sesiones para preguntar', detail: 'Resolver dudas con una persona experta.' },
        { value: 'cases', icon: '👥', title: 'Casos y experiencias reales', detail: 'Aprender viendo cómo otros lo resolvieron.' }
      ],
      guide: ['APRENDER A TU MANERA', 'El mejor formato es el que sí vuelves a abrir.', 'Tu preferencia nos ayuda a ordenar la experiencia.']
    },
    {
      id: 'pace', kicker: 'Una rutina posible',
      title: '¿Qué ritmo sí podrías sostener cada semana?',
      hint: 'No el ideal: el que cabe de verdad en tu agenda.', label: 'Tiempo disponible', type: 'single',
      options: [
        { value: '15', icon: '☕', title: '15 minutos', detail: 'Una idea puntual entre actividades.' },
        { value: '30', icon: '🕒', title: '30 minutos', detail: 'Una sesión breve y enfocada.' },
        { value: '60', icon: '📘', title: '1 hora', detail: 'Tiempo para aprender y tomar notas.' },
        { value: '120', icon: '🌤️', title: '2 horas o más', detail: 'Puedo profundizar y practicar con calma.' }
      ],
      guide: ['CASI TERMINAMOS', 'Un ritmo realista vale más que uno perfecto.', 'Así podremos recomendarte una ruta sostenible.']
    }
  ];

  const card = document.querySelector('.question-card');
  const guide = document.querySelector('.guide');
  const totalSteps = sharedQuestions.length + 2;
  const state = { step: 0, answers: {}, finished: false, locked: false };

  const getFlow = () => {
    const branch = branchQuestions[state.answers.profile] || null;
    return [profileQuestion, ...(branch ? [branch] : []), ...sharedQuestions];
  };

  const getAnswerValues = (id) => {
    const value = state.answers[id];
    return Array.isArray(value) ? value : value ? [value] : [];
  };

  const optionTitle = (question, value) => question.options.find((option) => option.value === value)?.title || '';

  const updateGuide = (copy) => {
    if (!guide || !copy) return;
    const [label, title, body] = copy;
    guide.querySelector('.guide__bubble').innerHTML = `<span>${label}</span><strong>${title}</strong><p>${body}</p>`;
  };

  const answerMarkup = (question, option, index, selected) => `
    <button class="answer" type="button" role="${question.type === 'multi' ? 'checkbox' : 'radio'}"
      aria-checked="${selected}" data-answer="${option.value}">
      <span class="answer__icon" aria-hidden="true">${option.icon}</span>
      <span><strong>${option.title}</strong><small>${option.detail}</small></span>
      <span class="answer__key" aria-hidden="true">${selected && question.type === 'multi' ? '✓' : index + 1}</span>
    </button>`;

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
        <div class="answers ${isMulti ? 'answers--topics' : 'answers--compact'}" role="${isMulti ? 'group' : 'radiogroup'}" aria-label="${question.label}">
          ${question.options.map((option, index) => answerMarkup(question, option, index, selected.includes(option.value))).join('')}
        </div>
      </div>
      <footer class="question-card__footer">
        <button class="back-button" type="button" data-back ${state.step === 0 ? 'disabled' : ''}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg>Atrás
        </button>
        <div class="question-card__footer-actions">
          <span>${selectedLabel}</span>
          ${isMulti ? `<button class="next-button" type="button" data-next ${selected.length ? '' : 'disabled'}>${state.step === flow.length - 1 ? 'Ver mi perfil' : 'Continuar'}</button>` : ''}
        </div>
      </footer>`;

    updateGuide(question.guide);
    bindQuestion(question);
  };

  const finish = () => {
    state.finished = true;
    const flow = getFlow();
    const profile = optionTitle(profileQuestion, state.answers.profile);
    const branch = flow[1];
    const priority = optionTitle(branch, state.answers[branch.id]);
    const interestsQuestion = sharedQuestions.find((question) => question.id === 'topics');
    const interests = getAnswerValues('topics').map((value) => optionTitle(interestsQuestion, value));
    const formatQuestion = sharedQuestions.find((question) => question.id === 'format');
    const paceQuestion = sharedQuestions.find((question) => question.id === 'pace');
    const route = chooseRoute();

    card.classList.add('question-card--result');
    card.innerHTML = `
      <div class="progress" role="progressbar" aria-label="Encuesta completada" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100">
        <div class="progress__meta"><span>Perfil listo</span><span>100% completado</span></div>
        <div class="progress__track"><span style="width:100%"></span></div>
      </div>
      <div class="result question-card__content--enter">
        <div class="result__mark" aria-hidden="true">✓</div>
        <p class="eyebrow">Ya entendemos mejor lo que buscas</p>
        <h1 id="survey-title" tabindex="-1">Tu aprendizaje necesita una ruta, no más ruido.</h1>
        <p class="result__intro">Con tus respuestas podemos empezar a mostrarte contenido más útil para tu momento y tu forma de aprender.</p>
        <div class="result__route">
          <small>Tu ruta preliminar</small>
          <strong>${route.title}</strong>
          <p>${route.description}</p>
        </div>
        <div class="result__tags">
          <span>${profile}</span><span>${priority}</span>
          ${interests.map((interest) => `<span>${interest}</span>`).join('')}
          <span>${optionTitle(formatQuestion, state.answers.format)}</span>
          <span>${optionTitle(paceQuestion, state.answers.pace)} por semana</span>
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

  const chooseRoute = () => {
    const profile = state.answers.profile;
    const outcome = state.answers.outcome;
    if (profile === 'student') return { title: 'Experiencia profesional aplicada', description: 'Fundamentos claros, casos reales y práctica para convertir tus estudios en decisiones de campo.' };
    if (profile === 'business') return { title: 'Gestión y crecimiento agro', description: 'Aprendizaje práctico para ordenar procesos, fortalecer al equipo y mejorar resultados del negocio.' };
    if (profile === 'explorer' || state.answers.experience === 'new') return { title: 'Fundamentos para empezar con confianza', description: 'Una ruta progresiva, sin tecnicismos innecesarios, para descubrir oportunidades y dar el primer paso.' };
    if (profile === 'advisor') return { title: 'Especialización para asesoría técnica', description: 'Herramientas, actualización y casos aplicados para aumentar el valor de cada recomendación.' };
    if (outcome === 'solve' || outcome === 'decide') return { title: 'Decisiones prácticas para el campo', description: 'Contenido enfocado en diagnosticar, elegir acciones y aplicarlas con mayor criterio en cada ciclo.' };
    return { title: 'Producción con visión de crecimiento', description: 'Una mezcla de conocimientos técnicos y de negocio para avanzar con decisiones mejor informadas.' };
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
    const previousProfile = state.answers.profile;
    state.answers[question.id] = value;
    if (question.id === 'profile' && previousProfile && previousProfile !== value) {
      Object.values(branchQuestions).forEach((branch) => delete state.answers[branch.id]);
    }
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
