document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('[data-ag3-menu]');
  const menu = document.querySelector('[data-ag3-mobile]');

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
});
