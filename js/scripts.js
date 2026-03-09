const coursesData = [
  {
    title: "Agronomía para no agrónomos",
    image: "assets/cursos/curso-agronomia-para-no-agronomos.jpeg",
    category: "innovacion",
    tag: "Bases agrícolas",
    description:
      "Programa introductorio para comprender procesos clave de producción, manejo y toma de decisiones agrícolas.",
    summary:
      "Curso diseñado para quienes desean comprender los fundamentos de la agronomía sin necesidad de formación previa especializada.",
    topics: [
      "Fundamentos de agronomía aplicada",
      "Suelo, agua y nutrición vegetal",
      "Manejo general del cultivo",
      "Sanidad e identificación de problemas",
      "Buenas prácticas agrícolas",
      "Toma de decisiones en campo"
    ]
  },
  {
    title: "Alimentos",
    image: "assets/cursos/curso-alimentos.jpeg",
    category: "innovacion",
    tag: "Agroindustria",
    description:
      "Capacitación enfocada en procesos, calidad y aprovechamiento técnico de productos alimentarios.",
    summary:
      "Curso orientado a fortalecer conocimientos sobre manejo, calidad y valor agregado en productos alimentarios.",
    topics: [
      "Conceptos clave de alimentos",
      "Calidad y conservación",
      "Procesos básicos de transformación",
      "Buenas prácticas en manejo",
      "Inocuidad y control",
      "Aplicaciones agroindustriales"
    ]
  },
  {
    title: "Árboles",
    image: "assets/cursos/curso-arboles.jpeg",
    category: "cultivos",
    tag: "Cultivos perennes",
    description:
      "Formación sobre establecimiento, manejo y cuidado técnico de árboles productivos y de interés agrícola.",
    summary:
      "Curso para conocer criterios de selección, establecimiento y manejo técnico de árboles en sistemas productivos.",
    topics: [
      "Selección y establecimiento",
      "Manejo de vivero y trasplante",
      "Poda y formación",
      "Nutrición y riego",
      "Sanidad vegetal",
      "Seguimiento del desarrollo"
    ]
  },
  {
    title: "Biofábricas",
    image: "assets/cursos/curso-biofabricas.jpeg",
    category: "innovacion",
    tag: "Biotecnología",
    description:
      "Conoce el diseño y operación de biofábricas para generar soluciones útiles en producción agrícola.",
    summary:
      "Aprende bases técnicas para implementar biofábricas orientadas a la elaboración y manejo de insumos biológicos.",
    topics: [
      "Concepto de biofábricas",
      "Infraestructura y operación",
      "Procesos básicos de elaboración",
      "Control de higiene y manejo",
      "Aplicaciones agrícolas",
      "Organización y seguimiento"
    ]
  },
  {
    title: "Bioinsumos",
    image: "assets/cursos/curso-bioinsumos.jpeg",
    category: "nutricion",
    tag: "Biotecnología agrícola",
    description:
      "Uso estratégico de bioinsumos para fortalecer nutrición, sanidad y sostenibilidad en el cultivo.",
    summary:
      "Curso para comprender la aplicación técnica de bioinsumos en programas agrícolas modernos.",
    topics: [
      "Conceptos y clasificación",
      "Microorganismos benéficos",
      "Elaboración y manejo",
      "Compatibilidad en campo",
      "Aplicación práctica",
      "Evaluación de resultados"
    ]
  },
  {
    title: "Cacao",
    image: "assets/cursos/curso-cacao.jpeg",
    category: "cultivos",
    tag: "Cultivo específico",
    description:
      "Manejo técnico del cultivo de cacao con enfoque en establecimiento, nutrición y productividad.",
    summary:
      "Capacitación para mejorar criterios técnicos en producción, manejo y seguimiento del cultivo de cacao.",
    topics: [
      "Bases del cultivo de cacao",
      "Establecimiento y manejo inicial",
      "Nutrición y riego",
      "Poda y formación",
      "Sanidad y prevención",
      "Buenas prácticas productivas"
    ]
  },
  {
    title: "Caña",
    image: "assets/cursos/curso-cana.jpg",
    category: "cultivos",
    tag: "Cultivo específico",
    description:
      "Programa orientado al manejo técnico y productivo del cultivo de caña.",
    summary:
      "Curso para fortalecer conocimientos de producción, nutrición y manejo operativo en caña.",
    topics: [
      "Características del cultivo",
      "Preparación y establecimiento",
      "Manejo agronómico",
      "Nutrición y fertilización",
      "Sanidad del cultivo",
      "Monitoreo y productividad"
    ]
  },
  {
    title: "Contabilidad",
    image: "assets/cursos/curso-contabilidad.jpeg",
    category: "innovacion",
    tag: "Gestión",
    description:
      "Herramientas básicas de contabilidad orientadas a la administración de actividades productivas.",
    summary:
      "Curso pensado para fortalecer el control económico y administrativo de proyectos agrícolas y agroindustriales.",
    topics: [
      "Conceptos básicos contables",
      "Registro de ingresos y egresos",
      "Control de costos",
      "Planeación financiera",
      "Indicadores básicos",
      "Aplicación en proyectos agrícolas"
    ]
  },
  {
    title: "Exportación de productos agrícolas frescos",
    image: "assets/cursos/curso-exportacion-productos-agricolas-frescos.jpeg",
    category: "innovacion",
    tag: "Comercio agrícola",
    description:
      "Capacitación sobre requisitos, logística y aspectos técnicos para exportación de productos frescos.",
    summary:
      "Curso orientado a comprender procesos clave de exportación, calidad y cumplimiento comercial.",
    topics: [
      "Panorama de exportación agrícola",
      "Requisitos y normativas",
      "Calidad y acondicionamiento",
      "Logística y empaque",
      "Trazabilidad y documentación",
      "Buenas prácticas de comercialización"
    ]
  },
  {
    title: "Fertirrigación",
    image: "assets/cursos/curso-fertirrigacion.jpeg",
    category: "nutricion",
    tag: "Nutrición y riego",
    description:
      "Estrategias de nutrición y aplicación eficiente de fertilizantes para mejorar el desempeño del cultivo.",
    summary:
      "Aprende a planificar, preparar y optimizar programas de fertirriego con enfoque técnico y práctico.",
    topics: [
      "Fundamentos de fertirrigación",
      "Calidad del agua",
      "Preparación de soluciones nutritivas",
      "Monitoreo y corrección",
      "Manejo operativo en campo",
      "Buenas prácticas y errores frecuentes"
    ]
  },
  {
    title: "Girasol I",
    image: "assets/cursos/curso-girasol-1.jpeg",
    category: "cultivos",
    tag: "Cultivo específico",
    description:
      "Introducción al manejo técnico del cultivo de girasol desde su establecimiento hasta su seguimiento agronómico.",
    summary:
      "Curso enfocado en fundamentos y manejo general del girasol en esquemas productivos.",
    topics: [
      "Importancia del girasol",
      "Establecimiento del cultivo",
      "Nutrición inicial",
      "Manejo agronómico",
      "Sanidad y monitoreo",
      "Buenas prácticas"
    ]
  },
  {
    title: "Girasol II",
    image: "assets/cursos/curso-girasol-2.jpg",
    category: "cultivos",
    tag: "Cultivo específico",
    description:
      "Profundización en manejo técnico y optimización productiva del cultivo de girasol.",
    summary:
      "Programa de continuación para fortalecer estrategias de seguimiento, sanidad y productividad en girasol.",
    topics: [
      "Manejo avanzado del cultivo",
      "Seguimiento fenológico",
      "Nutrición y ajustes",
      "Prevención de problemas",
      "Indicadores de desempeño",
      "Mejora de resultados"
    ]
  },
  {
    title: "Hidroponía para todos",
    image: "assets/cursos/curso-hidroponia-para-todos.jpeg",
    category: "produccion",
    tag: "Producción intensiva",
    description:
      "Bases técnicas, operación y manejo de sistemas hidropónicos con enfoque accesible y profesional.",
    summary:
      "Domina los fundamentos de los sistemas hidropónicos y su implementación para producción eficiente.",
    topics: [
      "Introducción a hidroponía",
      "Sistemas y componentes",
      "Soluciones nutritivas",
      "Manejo del cultivo",
      "Monitoreo y correcciones",
      "Buenas prácticas"
    ]
  },
  {
    title: "Hierbas",
    image: "assets/cursos/curso-hierbas.jpeg",
    category: "cultivos",
    tag: "Cultivos especializados",
    description:
      "Formación orientada al manejo productivo y técnico de hierbas aromáticas y de uso comercial.",
    summary:
      "Curso para conocer procesos de producción, cuidado y aprovechamiento de hierbas en sistemas agrícolas.",
    topics: [
      "Selección de especies",
      "Propagación y establecimiento",
      "Nutrición y riego",
      "Cosecha y manejo",
      "Sanidad y calidad",
      "Aplicaciones productivas"
    ]
  },
  {
    title: "Hongos",
    image: "assets/cursos/curso-hongos.jpeg",
    category: "produccion",
    tag: "Producción especializada",
    description:
      "Capacitación para comprender bases de producción, manejo y aprovechamiento de hongos.",
    summary:
      "Curso orientado a introducir procesos técnicos de producción y control en sistemas relacionados con hongos.",
    topics: [
      "Introducción a hongos de interés",
      "Condiciones de producción",
      "Manejo del ambiente",
      "Control y seguimiento",
      "Cosecha y calidad",
      "Buenas prácticas"
    ]
  },
  {
    title: "Inteligencia artificial agrícola",
    image: "assets/cursos/curso-inteligencia-artificial-agricola.jpeg",
    category: "innovacion",
    tag: "Tecnología",
    description:
      "Aplicaciones prácticas de inteligencia artificial para análisis, eficiencia y modernización agrícola.",
    summary:
      "Programa para conocer herramientas y usos de IA aplicados a producción, análisis y gestión agrícola.",
    topics: [
      "Fundamentos de IA",
      "Aplicaciones en agricultura",
      "Análisis y toma de decisiones",
      "Automatización y monitoreo",
      "Herramientas digitales",
      "Tendencias del sector"
    ]
  },
  {
    title: "Inocuidad alimentaria y buenas prácticas agroalimentarias",
    image: "assets/cursos/curso-inocuidad-alimentaria.jpeg",
    category: "innovacion",
    tag: "Calidad e inocuidad",
    description:
      "Fortalece procesos de producción con criterios técnicos de inocuidad, seguridad y cumplimiento.",
    summary:
      "Curso orientado a fortalecer la seguridad alimentaria y el cumplimiento de buenas prácticas agroalimentarias.",
    topics: [
      "Fundamentos de inocuidad",
      "Riesgos biológicos y químicos",
      "Buenas prácticas agroalimentarias",
      "Control y prevención",
      "Trazabilidad",
      "Cultura de inocuidad"
    ]
  },
  {
    title: "Lombricomposta",
    image: "assets/cursos/curso-lombricomposta.jpeg",
    category: "nutricion",
    tag: "Suelo y abonos",
    description:
      "Conoce el proceso de elaboración, manejo y aprovechamiento técnico de la lombricomposta.",
    summary:
      "Curso para desarrollar criterios técnicos en la producción y uso de lombricomposta en agricultura.",
    topics: [
      "Fundamentos de lombricomposta",
      "Materiales y preparación",
      "Manejo del sistema",
      "Control de condiciones",
      "Cosecha y uso",
      "Aplicaciones en cultivo"
    ]
  },
  {
    title: "Maíz",
    image: "assets/cursos/curso-maiz.jpeg",
    category: "cultivos",
    tag: "Cultivo específico",
    description:
      "Capacitación técnica para el manejo del cultivo de maíz con enfoque en productividad y seguimiento agronómico.",
    summary:
      "Programa orientado al manejo del maíz desde establecimiento hasta monitoreo y optimización del cultivo.",
    topics: [
      "Bases del cultivo de maíz",
      "Siembra y establecimiento",
      "Nutrición y fertilización",
      "Riego y manejo",
      "Sanidad del cultivo",
      "Buenas prácticas productivas"
    ]
  },
  {
    title: "Manejo de pitahaya",
    image: "assets/cursos/curso-manejo-de-pitahaya.jpeg",
    category: "cultivos",
    tag: "Frutales",
    description:
      "Curso especializado en establecimiento, manejo y cuidados técnicos del cultivo de pitahaya.",
    summary:
      "Capacitación para conocer estrategias de producción, conducción y seguimiento del cultivo de pitahaya.",
    topics: [
      "Introducción al cultivo",
      "Establecimiento y soporte",
      "Nutrición y manejo",
      "Poda y formación",
      "Sanidad y prevención",
      "Buenas prácticas de producción"
    ]
  },
  {
    title: "Manejo de viveros",
    image: "assets/cursos/curso-manejo-de-viveros.jpeg",
    category: "produccion",
    tag: "Propagación",
    description:
      "Formación para mejorar procesos de propagación, control y desarrollo de plantas en vivero.",
    summary:
      "Curso práctico para fortalecer conocimientos sobre organización, manejo y calidad en viveros.",
    topics: [
      "Diseño y organización del vivero",
      "Sustratos y contenedores",
      "Propagación y cuidados",
      "Riego y nutrición",
      "Control sanitario",
      "Calidad y seguimiento"
    ]
  },
  {
    title: "Melón",
    image: "assets/cursos/curso-melon.jpeg",
    category: "cultivos",
    tag: "Hortalizas",
    description:
      "Manejo técnico del cultivo de melón con enfoque en productividad, calidad y seguimiento agronómico.",
    summary:
      "Curso para comprender procesos clave en producción, nutrición y manejo del cultivo de melón.",
    topics: [
      "Bases del cultivo de melón",
      "Siembra y establecimiento",
      "Nutrición y fertirriego",
      "Sanidad vegetal",
      "Manejo del desarrollo",
      "Buenas prácticas"
    ]
  },
  {
    title: "Orquídeas",
    image: "assets/cursos/curso-orquideas.jpeg",
    category: "cultivos",
    tag: "Producción ornamental",
    description:
      "Capacitación sobre propagación, manejo y cuidado técnico de orquídeas.",
    summary:
      "Curso enfocado en criterios de producción y mantenimiento de orquídeas con visión técnica.",
    topics: [
      "Introducción a orquídeas",
      "Condiciones de cultivo",
      "Propagación y trasplante",
      "Riego y nutrición",
      "Manejo sanitario",
      "Conservación y calidad"
    ]
  },
  {
    title: "Papaya",
    image: "assets/cursos/curso-papaya.jpeg",
    category: "cultivos",
    tag: "Frutales",
    description:
      "Manejo agronómico del cultivo de papaya con enfoque en producción y seguimiento técnico.",
    summary:
      "Curso para fortalecer conocimientos sobre establecimiento, nutrición y sanidad del cultivo de papaya.",
    topics: [
      "Bases del cultivo de papaya",
      "Establecimiento y densidad",
      "Nutrición y riego",
      "Poda y manejo",
      "Sanidad y monitoreo",
      "Buenas prácticas productivas"
    ]
  },
  {
    title: "Polinizadores",
    image: "assets/cursos/curso-polinizadores.jpeg",
    category: "produccion",
    tag: "Sustentabilidad",
    description:
      "Importancia, manejo y protección de polinizadores en sistemas productivos agrícolas.",
    summary:
      "Capacitación orientada a comprender el valor de los polinizadores y su impacto en productividad agrícola.",
    topics: [
      "Tipos de polinizadores",
      "Importancia en producción",
      "Factores que los afectan",
      "Manejo amigable en campo",
      "Conservación y biodiversidad",
      "Buenas prácticas"
    ]
  },
  {
    title: "Producción de plántulas",
    image: "assets/cursos/curso-produccion-de-plantulas.jpeg",
    category: "produccion",
    tag: "Propagación",
    description:
      "Capacitación técnica en propagación, germinación y calidad de plántulas para sistemas productivos.",
    summary:
      "Curso para mejorar criterios de producción, manejo y evaluación de plántulas de calidad.",
    topics: [
      "Fundamentos de propagación",
      "Selección de semillas",
      "Sustratos y bandejas",
      "Riego y nutrición inicial",
      "Control sanitario",
      "Criterios de calidad"
    ]
  },
  {
    title: "Producción y aprovechamiento del nopal",
    image: "assets/cursos/curso-produccion-y-aprovechamiento-del-nopal.jpeg",
    category: "cultivos",
    tag: "Cultivo específico",
    description:
      "Conoce estrategias de producción, manejo y aprovechamiento técnico del nopal.",
    summary:
      "Capacitación para fortalecer conocimientos productivos y comerciales relacionados con el nopal.",
    topics: [
      "Bases del cultivo de nopal",
      "Establecimiento y manejo",
      "Nutrición y riego",
      "Sanidad vegetal",
      "Aprovechamiento productivo",
      "Buenas prácticas"
    ]
  },
  {
    title: "Producción y manejo de chiles verdes",
    image: "assets/cursos/curso-produccion-y-manejo-de-chiles-verdes.jpeg",
    category: "cultivos",
    tag: "Hortalizas",
    description:
      "Curso técnico sobre establecimiento, manejo y seguimiento del cultivo de chiles verdes.",
    summary:
      "Programa diseñado para fortalecer decisiones agronómicas en producción y manejo de chiles verdes.",
    topics: [
      "Bases del cultivo",
      "Establecimiento y trasplante",
      "Nutrición y riego",
      "Manejo del desarrollo",
      "Sanidad y prevención",
      "Buenas prácticas de producción"
    ]
  },
  {
    title: "Tomatillo",
    image: "assets/cursos/curso-tomatillo.jpeg",
    category: "cultivos",
    tag: "Hortalizas",
    description:
      "Capacitación sobre manejo productivo y técnico del cultivo de tomatillo.",
    summary:
      "Curso orientado al establecimiento, nutrición, sanidad y seguimiento del cultivo de tomatillo.",
    topics: [
      "Introducción al cultivo",
      "Propagación y establecimiento",
      "Nutrición y fertirriego",
      "Manejo agronómico",
      "Sanidad y monitoreo",
      "Buenas prácticas"
    ]
  }
];

// Menú móvil
const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    mobileNav.classList.toggle("active");
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("active");
    });
  });
}

// Render cursos
const coursesGrid = document.getElementById("coursesGrid");
const filterButtons = document.querySelectorAll(".filter-btn");

function buildWhatsAppLink(courseTitle) {
  const msg = `Hola, quiero más información del curso de ${courseTitle} de AGROTEC AMERICAN`;
  return `https://wa.me/5212361066811?text=${encodeURIComponent(msg)}`;
}

function renderCourses(filter = "all") {
  if (!coursesGrid) return;

  const filteredCourses =
    filter === "all"
      ? coursesData
      : coursesData.filter((course) => course.category === filter);

  coursesGrid.innerHTML = filteredCourses
    .map(
      (course) => `
      <article class="course-card reveal visible">
        <div class="course-image-wrap">
          <img src="${course.image}" alt="${course.title}" />
          <span class="course-tag">${course.tag}</span>
        </div>

        <div class="course-body">
          <h3>${course.title}</h3>
          <p>${course.description}</p>

          <div class="course-meta">
            <span>En vivo</span>
            <span>Grabaciones</span>
            <span>Certificado</span>
          </div>

          <div class="course-actions">
            <button
              class="btn btn-secondary open-modal"
              data-course="${course.title}"
              data-summary="${course.summary}"
              data-topics="${course.topics.join("|")}"
            >
              Incluye
            </button>

            <a
              class="btn btn-ghost"
              href="${buildWhatsAppLink(course.title)}"
              target="_blank"
              rel="noopener noreferrer"
            >
              Solicitar información
            </a>
          </div>
        </div>
      </article>
    `
    )
    .join("");

  bindModalButtons();
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    renderCourses(button.dataset.filter);
  });
});

// Reveal on scroll
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => {
  revealObserver.observe(el);
});

// Modal
const modal = document.getElementById("courseModal");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");
const modalSummary = document.getElementById("modalSummary");
const modalTopics = document.getElementById("modalTopics");
const modalWhatsapp = document.getElementById("modalWhatsapp");

function openModal(course, summary, topics) {
  modalTitle.textContent = course;
  modalSummary.textContent = summary;
  modalTopics.innerHTML = "";

  topics.forEach((topic) => {
    const li = document.createElement("li");
    li.textContent = topic;
    modalTopics.appendChild(li);
  });

  modalWhatsapp.href = buildWhatsAppLink(course);
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

function bindModalButtons() {
  document.querySelectorAll(".open-modal").forEach((button) => {
    button.addEventListener("click", () => {
      const course = button.dataset.course || "Curso";
      const summary = button.dataset.summary || "";
      const topics = (button.dataset.topics || "").split("|").filter(Boolean);
      openModal(course, summary, topics);
    });
  });
}

if (modalOverlay) modalOverlay.addEventListener("click", closeModal);
if (modalClose) modalClose.addEventListener("click", closeModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("active")) {
    closeModal();
  }
});

// Inicial
renderCourses("all");
