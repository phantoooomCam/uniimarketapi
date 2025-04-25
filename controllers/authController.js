const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registrarUsuario = async (req, res) => {
  const { nombre, apellidos, correo, contraseña, rol, telefono, escuela } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const result = await pool.query(`
      INSERT INTO usuarios (nombre, apellidos, correo, contraseña, rol, telefono, escuela)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, nombre, apellidos, correo, rol;
    `, [nombre, apellidos, correo, hashedPassword, rol, telefono, escuela]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

const loginUsuario = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const result = await pool.query(`SELECT * FROM usuarios WHERE correo = $1`, [correo]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const usuario = result.rows[0];
    const coincide = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!coincide) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.cookie('jwt_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 86400000 // 1 día
    });

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.rol
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

const obtenerUsuarioAutenticado = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre, apellidos, correo, rol, escuela FROM usuarios WHERE id = $1', [req.usuario.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuario autenticado' });
  }
};

const logoutUsuario = (req, res) => {

  res.clearCookie('jwt_token', {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax'
  });

  res.json({ mensaje: 'Sesión cerrada correctamente' });
};




module.exports = {
  registrarUsuario,
  loginUsuario,
  obtenerUsuarioAutenticado,
  logoutUsuario
};
