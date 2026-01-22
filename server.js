
// IMPORTAR LAS LIBRERIAS

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const path = require('path');


// CONFIGURAR EXPRESS

const app = express();
const PORT = process.env.PORT || 3000;

// PROCESADORES DE DATOS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS - Permitir TODOS los orígenes
app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    
    // Responder inmediatamente a OPTIONS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    next();
});

// MIDDLEWARE DE LOGGING
app.use((req, res, next) => {
    console.log(`\n📌 ${req.method} ${req.path}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', req.body);
    }
    next();
});

// CONEXION BASE DE DATOS

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
    .then(connection => {
        console.log('CONECTADO A LA BASE DE DATOS');
        connection.release();
    })
    .catch(error => {
        console.error('ERROR DE CONEXION A LA BASE DE DATOS:', error.message);
    });

// CREAR LA TABLA DE USUARIOS SI NO EXISTE

async function crearTablaUsuarios() {
    try {
        const connection = await pool.getConnection();
        
        const query = `
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                contraseña VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        await connection.query(query);
        console.log('TABLA DE USUARIOS LISTA');
        connection.release();
    } catch (error) {
        console.error('ERROR AL CREAR TABLA:', error);
    }
}

// RUTA DE PRUEBA 
app.get('/api/health', (req, res) => {
    console.log('📍 GET /api/health - Recibido');
    res.status(200).json({ 
        success: true, 
        message: 'SERVIDOR FUNCIONANDO CORRECTAMENTE',
        timestamp: new Date()
    });
});

// RUTA DE REGISTRO

app.post('/api/register', async (req, res) => {
    console.log('📍 POST /api/register - Recibido:', req.body);
    try {
        // OBTENER DATOS DEL FORMULARIO DE REGISTRO
        const { nombre, email, contraseña } = req.body;

        // VALIDAR QUE NO ESTEN VACIOS
        if (!nombre || !email || !contraseña) {
            return res.status(400).json({ 
                success: false, 
                message: 'Por favor completa todos los campos' 
            });
        }

        // VALIDAR LONGITUD DE CONTRASEÑA
        if (contraseña.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'La contraseña debe tener al menos 6 caracteres' 
            });
        }

        // CONECTAR A LA BD
        const connection = await pool.getConnection();

        // VERIFICAR SI EL USUARIO O EMAIL YA EXISTE
        const [usuariosExistentes] = await connection.query(
            'SELECT * FROM usuarios WHERE usuario = ? OR email = ?',
            [nombre, email]
        );

        if (usuariosExistentes.length > 0) {
            connection.release();
            return res.status(409).json({ 
                success: false, 
                message: 'El usuario o email ya está registrado' 
            });
        }

        // ENCRIPTAR LA CONTRASEÑA
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        // INSERTR EN BD
        await connection.query(
            'INSERT INTO usuarios (usuario, email, contraseña) VALUES (?, ?, ?)',
            [nombre, email, hashedPassword]
        );

        connection.release();

        // RESPONDER QUE EL REGISTRO FUE EXITOSO
        res.status(201).json({ 
            success: true, 
            message: 'REGISTRO EXITOSO!' 
        });

    } catch (error) {
        console.error('ERROR EN REGISTRO:', error);
        res.status(500).json({ 
            success: false, 
            message: 'ERROR AL REGISTRARSE. INTENTA DE NUEVO.' 
        });
    }
});
// RUTA DE LOGIN

app.post('/api/login', async (req, res) => {
    console.log('📍 POST /api/login - Recibido:', req.body);
    try {
        // OBTENER DATOS DEL FORMULARIO DE LOGIN
        const { email, contraseña } = req.body;

        // VALIDAR QUE NO ESTEN VACIOS
        if (!email || !contraseña) {
            return res.status(400).json({ 
                success: false, 
                message: 'Por favor completa todos los campos' 
            });
        }

        // CONECTAR A LA BD
        const connection = await pool.getConnection();

        // BUSCAR USUARIO POR EMAIL
        const [usuarios] = await connection.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        // SI NO EXISTE, RESPONDER ERROR
        if (usuarios.length === 0) {
            connection.release();
            return res.status(401).json({ 
                success: false, 
                message: 'Email o contraseña incorrectos' 
            });
        }

        const usuario = usuarios[0];

        // VERIFICAR CONTRASEÑA
        const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);

        if (!contraseñaValida) {
            connection.release();
            return res.status(401).json({ 
                success: false, 
                message: 'Email o contraseña incorrectos' 
            });
        }

        connection.release();

        // RESPONDER QUE EL LOGIN FUE EXITOSO
        res.status(200).json({ 
            success: true, 
            message: 'LOGIN EXITOSO!',
            usuario: {
                id: usuario.id,
                nombre: usuario.usuario,
                email: usuario.email
            }
        });

    } catch (error) {
        console.error('ERROR EN LOGIN:', error);
        res.status(500).json({ 
            success: false, 
            message: 'ERROR AL INICIAR SESION. INTENTA DE NUEVO.' 
        });
    }
});

// SERVIR ARCHIVOS ESTÁTICOS (DESPUÉS de las rutas de API)
app.use(express.static(path.join(__dirname)));

// INICIAR EL SERVIDOR

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\nServidor ejecutándose en puerto ${PORT}`);
    console.log('Presiona Ctrl+C para detener el servidor\n');
    crearTablaUsuarios();
});

