const pool = require('../db');

const crearProducto = async (req, res) => {
  const { nombre, descripcion, precio, categoria, imagen_url } = req.body;
  const vendedor_id = req.usuario.id; // viene del JWT

  try {
    const result = await pool.query(`
      INSERT INTO productos (nombre, descripcion, precio, categoria, imagen_url, vendedor_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `, [nombre, descripcion, precio, categoria, imagen_url, vendedor_id]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

const obtenerProductos = async (req, res) => {
  const { escuela } = req.query;

  try {
    let result;
    if (escuela) {
      result = await pool.query(`
        SELECT p.*, u.escuela
        FROM productos p
        JOIN usuarios u ON u.id = p.vendedor_id
        WHERE u.escuela = $1
      `, [escuela]);
    } else {
      result = await pool.query(`
        SELECT p.*, u.escuela
        FROM productos p
        JOIN usuarios u ON u.id = p.vendedor_id
      `);
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

module.exports = { crearProducto, obtenerProductos };
