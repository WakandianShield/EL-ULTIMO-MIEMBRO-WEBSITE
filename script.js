const hamburger = document.getElementById("menuToggle");
const nav = document.querySelector(".link-div");
const navLinks = document.querySelectorAll(".nav-link");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  nav.classList.toggle("active");
});

// Cerrar menú al clickear en un link
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    nav.classList.remove("active");
  });
});

// Parallax effect para about-hero
const aboutHero = document.querySelector('.about-hero');

if (aboutHero) {
  window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;
    const element = aboutHero.getBoundingClientRect().top;
    
    // Solo aplicar parallax cuando el elemento está visible
    if (element < window.innerHeight && element > -window.innerHeight) {
      const parallaxOffset = scrollPosition * 0.5;
      aboutHero.style.backgroundPosition = `center ${parallaxOffset * -0.3}px`;
    }
  });
}
