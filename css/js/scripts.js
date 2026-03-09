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

// Reveal on scroll
const revealEls = document.querySelectorAll(".reveal");
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

revealEls.forEach((el) => revealObserver.observe(el));

// Modal
const modal = document.getElementById("courseModal");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");
const modalSummary = document.getElementById("modalSummary");
const modalTopics = document.getElementById("modalTopics");
const modalWhatsapp = document.getElementById("modalWhatsapp");
const modalButtons = document.querySelectorAll(".open-modal");

function openModal(course, summary, topics) {
  modalTitle.textContent = course;
  modalSummary.textContent = summary;
  modalTopics.innerHTML = "";

  topics.forEach((topic) => {
    const li = document.createElement("li");
    li.textContent = topic;
    modalTopics.appendChild(li);
  });

  const msg = `Hola, quiero más información del curso de ${course} de AGROTEC AMERICAN`;
  modalWhatsapp.href = `https://wa.me/5212361066811?text=${encodeURIComponent(msg)}`;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

modalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const course = button.dataset.course || "Curso";
    const summary = button.dataset.summary || "";
    const topics = (button.dataset.topics || "").split("|").filter(Boolean);
    openModal(course, summary, topics);
  });
});

if (modalOverlay) modalOverlay.addEventListener("click", closeModal);
if (modalClose) modalClose.addEventListener("click", closeModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("active")) {
    closeModal();
  }
});
