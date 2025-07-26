const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Récupérer le token du header
  const token = req.header('x-auth-token');

  // Vérifier si un token existe
  if (!token) {
    return res.status(401).json({ msg: 'Pas de token, autorisation refusée' });
  }

  // Vérifier le token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token non valide' });
  }
};