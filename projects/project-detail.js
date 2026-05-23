// Project Detail Page - Shared JavaScript

// Scroll reveal for sections
const sections = document.querySelectorAll('.detail-section');
const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
sections.forEach(s => sectionObs.observe(s));
