const hamburger = document.getElementById("menuToggle");
const nav = document.querySelector(".link-div");
const navLinks = document.querySelectorAll(".nav-link");


const registerTab = document.getElementById("register-tab");
const loginTab = document.getElementById("login-tab");
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");


const cards = document.querySelectorAll('.card');



hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  nav.classList.toggle("active");
});


navLinks.forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    nav.classList.remove("active");
  });
});






function showForm(formToShow) {
    if(formToShow === "register") {
        registerTab.classList.add("active");
        loginTab.classList.remove("active");

        registerForm.style.opacity = 1;
        registerForm.style.visibility = "visible";
        loginForm.style.opacity = 0;
        loginForm.style.visibility = "hidden";
    } else {
        loginTab.classList.add("active");
        registerTab.classList.remove("active");

        loginForm.style.opacity = 1;
        loginForm.style.visibility = "visible";
        registerForm.style.opacity = 0;
        registerForm.style.visibility = "hidden";
    }
}

registerTab.addEventListener("click", () => showForm("register"));
loginTab.addEventListener("click", () => showForm("login"));

registerForm.addEventListener("submit", e => {
    e.preventDefault();
    alert("Registro enviado!");
});

loginForm.addEventListener("submit", e => {
    e.preventDefault();
    alert("Login enviado!");
});

window.addEventListener("DOMContentLoaded", () => showForm("register"));






cards.forEach(card => {
    card.addEventListener('click', () => {
        const content = card.querySelector('.card__content');
        content.classList.toggle('active'); 
    });
});





