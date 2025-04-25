const jwt = require('jsonwebtoken');

const verificarAutenticacion = (req, res, next) => {
  const token = req.cookies.jwt_token;

  if (!token) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = usuario;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = verificarAutenticacion;
