const hamburger = document.getElementById("menuToggle");
const nav = document.querySelector(".link-div");
const navLinks = document.querySelectorAll(".nav-link");


const registerTab = document.getElementById("register-tab");
const loginTab = document.getElementById("login-tab");
const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");


const cards = document.querySelectorAll('.card');

// URL DEL SERVIDOR EN RAILWAY
const API_URL = 'https://el-ultimo-miembro-website.railway.app/api';

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

// REGISTRO 
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const contraseña = document.getElementById("contraseña").value;
    
    console.log("ENVIADO REGISTRO:", { nombre, email });

    try {
        // ENVIAR DATOS AL SERVIDOR
        console.log("ENVIANDO A:", `${API_URL}/register`);
        
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, email, contraseña })
        });

        console.log("RESPUESTA:", response.status);
        
        // LEER RESPUESTA DEL SERVIDOR
        const data = await response.json();
        
        console.log("✓ Datos recibidos:", data);

        if (data.success) {
            alert(data.message);
            registerForm.reset();
            // CAMBIAR A LOGIN DESPUES DE REGISTRO EXITOSO
            setTimeout(() => showForm("login"), 1500);
        } else {
            alert("ERROR: " + data.message);
        }
    } catch (error) {
        console.error('ERROR:', error);
        alert("ERROR AL CONECTAR CON EL SERVIDOR, SI ESTA CORRIENDO?");
    }
});

// LOGIN
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // OBTENER DATOS DEL LOGIN
    const email = document.getElementById("login-email").value;
    const contraseña = document.getElementById("login-contraseña").value;
    
    console.log("Enviando login:", { email });

    try {
        // ENVIAR DATOS AL SERVIDOR
        console.log("ENVIANDO LOGIN A:", `${API_URL}/login`);
        
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, contraseña })
        });

        console.log("RESPUESTA:", response.status);
        
        // LEER RESPUESTA DEL SERVIDOR
        const data = await response.json();
        
        console.log("DATOS RECIBIDOS:", data);

        if (data.success) {
            alert(data.message);
            // GUARDAR INFO DEL USUARIO EN EL ALMACENAMIENTO LOCAL
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            loginForm.reset();
            console.log("Usuario autenticado:", data.usuario);
        } else {
            alert("ERROR: " + data.message);
        }
    } catch (error) {
        console.error('ERROR:', error);
        alert("ERROR AL CONECTAR CON EL SERVIDOR, SI ESTA CORRIENDO?");
    }
});

window.addEventListener("DOMContentLoaded", () => showForm("register"));






cards.forEach(card => {
    card.addEventListener('click', () => {
        const content = card.querySelector('.card__content');
        content.classList.toggle('active'); 
    });
});





