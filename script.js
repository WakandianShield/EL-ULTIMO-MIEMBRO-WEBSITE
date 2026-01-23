// API PARA EL SERVIDOR DE RAILWAY
const API = 'https://el-ultimo-miembro-website-backend-production.up.railway.app';


// REGISTRO DE USUARIO
const registerFormEl = document.getElementById('register-form');

if (registerFormEl) {
  registerFormEl.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(
      new FormData(registerFormEl)
    );

    try {
      const res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        
        window.location.href = 'messages.html'; 
        alert('Registro enviado correctamente');
      } 
      else {
        alert('Error al enviar el registro');
      }
    } catch (err) {
      alert('No se pudo conectar con el servidor');
      console.error(err);
    }
  });
}

// INICIO DE SESIÓN DE USUARIO
const loginFormEl = document.getElementById('login-form');
if (loginFormEl) {
  loginFormEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(
      new FormData(loginFormEl)
    );
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

    if (res.ok) {
        const result = await res.json();
        const nombreUsuario = result.user.usuario;

        sessionStorage.setItem('nombreUsuario', nombreUsuario);

        window.location.href = 'messages.html'; 
    } 
    
    else {
        const errorData = await res.json();
        alert(errorData.error || 'Error en el inicio de sesión');
    }



    } catch (err) {
      alert('No se pudo conectar con el servidor');
      console.error(err);
    }
  });
}