const registerTab = document.getElementById("register-tab");
const loginTab = document.getElementById("login-tab");
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");

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