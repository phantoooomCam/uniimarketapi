const express = require('express');
const router = express.Router();

// Asegúrate de que este archivo y los controladores existen
const {
  registrarUsuario,
  loginUsuario,
  obtenerUsuarioAutenticado,
  logoutUsuario
} = require('../controllers/authController');

const verificarAutenticacion = require('../middlewares/authMiddleware');

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);
router.get('/me', verificarAutenticacion, obtenerUsuarioAutenticado);
router.get('/logout', logoutUsuario);
// 👇 ESTO ES LO CRUCIAL
module.exports = router;
