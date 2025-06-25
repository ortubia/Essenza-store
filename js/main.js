document.addEventListener("DOMContentLoaded", () => {
  // Efecto de scroll en el header
  const header = document.querySelector('.main-header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    } else {
      header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    }
  });
});
