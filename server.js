
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS - SIMPLE Y FUNCIONAL
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

// CONEXION A BASE DE DATOS
const pool = mysql.createPool({
  host: 'caboose.proxy.rlwy.net',
  user: 'root',
  password: 'qIIABAoYMqMlskVIvweTndtcJsGrNufE',
  database: 'railway',
  port: 28548,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// VERIFICAR CONEXION
pool.getConnection()
  .then(conn => {
    console.log('CONECTADO A LA BASE DE DATOS');
    conn.release();
  })
  .catch(err => console.error('ERROR DE CONEXION:', err.message));

// CREAR TABLA DE USUARIOS
async function crearTabla() {
  try {
    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        contraseña VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('TABLA DE USUARIOS LISTA');
    conn.release();
  } catch (err) {
    console.error('ERROR AL CREAR TABLA:', err.message);
  }
}

// SERVIR ARCHIVOS ESTATICOS
app.use(express.static(path.join(__dirname)));

// RUTA DE REGISTRO
app.post('/api/register', async (req, res) => {
  try {
    const { nombre, email, contraseña } = req.body;

    if (!nombre || !email || !contraseña) {
      return res.status(400).json({ success: false, message: 'COMPLETA TODOS LOS CAMPOS' });
    }

    if (contraseña.length < 6) {
      return res.status(400).json({ success: false, message: 'MINIMO 6 CARACTERES' });
    }

    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT * FROM usuarios WHERE usuario = ? OR email = ?', [nombre, email]);

    if (rows.length > 0) {
      conn.release();
      return res.status(409).json({ success: false, message: 'EL USUARIO O EMAIL YA EXISTE' });
    }

    const hash = await bcrypt.hash(contraseña, 10);
    await conn.query('INSERT INTO usuarios (usuario, email, contraseña) VALUES (?, ?, ?)', [nombre, email, hash]);
    conn.release();

    res.status(201).json({ success: true, message: 'REGISTRO EXITOSO' });
  } catch (err) {
    console.error('ERROR EN REGISTRO:', err);
    res.status(500).json({ success: false, message: 'ERROR AL REGISTRARSE' });
  }
});

// RUTA DE LOGIN
app.post('/api/login', async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    if (!email || !contraseña) {
      return res.status(400).json({ success: false, message: 'COMPLETA TODOS LOS CAMPOS' });
    }

    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (rows.length === 0) {
      conn.release();
      return res.status(401).json({ success: false, message: 'EMAIL O CONTRASEÑA INCORRECTOS' });
    }

    const valido = await bcrypt.compare(contraseña, rows[0].contraseña);
    conn.release();

    if (!valido) {
      return res.status(401).json({ success: false, message: 'EMAIL O CONTRASEÑA INCORRECTOS' });
    }

    res.json({
      success: true,
      message: 'LOGIN EXITOSO',
      usuario: { id: rows[0].id, nombre: rows[0].usuario, email: rows[0].email }
    });
  } catch (err) {
    console.error('ERROR EN LOGIN:', err);
    res.status(500).json({ success: false, message: 'ERROR AL INICIAR SESION' });
  }
});

// INICIAR SERVIDOR
app.listen(PORT, '0.0.0.0', () => {
  console.log('\nSERVIDOR EJECUTANDOSE EN PUERTO ' + PORT);
  console.log('Presiona Ctrl+C para detener el servidor\n');
  crearTabla();
});
