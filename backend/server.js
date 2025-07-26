const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
// Chargement des variables d'environnement - assurez-vous que cette ligne est AVANT toute utilisation de process.env
dotenv.config();
const app = express();
// Middleware
app.use(cors());
app.use(express.json());

// Dans votre backend/server.js
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Vérifiez si MONGO_URI existe
console.log("MONGO_URI est défini:", !!process.env.MONGO_URI);
// Connexion à MongoDB avec gestion d'erreur améliorée
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error('Erreur MongoDB:', err));
// Routes de base
app.get('/', (req, res) => {
  res.send('API Mon Potager Facile fonctionnelle');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/garden', require('./routes/garden'));
console.log('Routes configurées : /api/garden');
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/tips', require('./routes/tips'));
// Port d'écoute
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));