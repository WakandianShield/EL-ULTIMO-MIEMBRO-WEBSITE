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


const logIn = document.querySelector(".form-div");
const btn = document.querySelector(".logIn");

btn.addEventListener("click", () => {
  // aquí ES verdad que hubo un click
  logIn.classList.toggle("active");
});

