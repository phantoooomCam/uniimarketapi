const express = require('express');
const router = express.Router();
const verificarAutenticacion = require('../middlewares/authMiddleware');
const { crearProducto, obtenerProductos } = require('../controllers/productosController');

router.post('/', verificarAutenticacion, crearProducto);
router.get('/', obtenerProductos);

module.exports = router;
