// Fichier: backend/routes/tips.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Garden = require('../models/Garden');

// @route   GET api/tips/daily
// @desc    Obtenir un conseil du jour aléatoire
// @access  Private
router.get('/daily', auth, async (req, res) => {
  try {
    // Récupérer le potager de l'utilisateur pour personnaliser les conseils
    const garden = await Garden.findOne({ userId: req.user.id });
    
    if (!garden) {
      return res.status(404).json({ msg: 'Aucun potager trouvé' });
    }

    // Liste de conseils généraux
    const generalTips = [
      "Pour économiser de l'espace, utilisez des tuteurs pour faire grimper vos plantes comme les haricots, concombres et tomates.",
      "Le paillage aide à réduire l'évaporation, limite les mauvaises herbes et enrichit progressivement le sol.",
      "Associez les tomates et le basilic : le basilic repousse certains insectes nuisibles et améliore le goût des tomates.",
      "Arrosez le matin tôt pour limiter l'évaporation et éviter les maladies fongiques.",
      "La rotation des cultures aide à prévenir les maladies et l'épuisement du sol.",
      "Les œillets d'Inde plantés dans le potager repoussent les nématodes et plusieurs insectes nuisibles.",
      "Récoltez vos légumes régulièrement pour encourager la production de nouveaux fruits.",
      "Les orties en purin font un excellent fertilisant naturel riche en azote.",
      "Les coccinelles sont des alliées précieuses contre les pucerons - attirez-les avec des fleurs comme les cosmos ou les soucis."
    ];

    // Conseils spécifiques au type de culture
    const cultureTips = {
      'pleine_terre': [
        "Travaillez votre sol à l'automne pour qu'il se décompacte naturellement pendant l'hiver.",
        "Un bon compost maison améliore considérablement la qualité de votre terre.",
        "Pensez à utiliser des engrais verts comme la moutarde ou la phacélie pour enrichir votre sol entre deux cultures."
      ],
      'bac': [
        "Vos bacs doivent avoir des trous de drainage pour éviter l'accumulation d'eau.",
        "Renouvelez partiellement le terreau de vos bacs chaque année pour maintenir sa fertilité.",
        "Dans des bacs, les plantes ont besoin d'être arrosées plus fréquemment qu'en pleine terre."
      ],
      'serre': [
        "N'oubliez pas d'aérer votre serre chaque jour, même en hiver, pour éviter l'humidité excessive.",
        "En été, un ombrage partiel de votre serre évitera la surchauffe de vos plantes.",
        "Dans une serre, surveillez particulièrement les invasions d'insectes qui peuvent se propager rapidement."
      ]
    };

    // Conseils spécifiques au niveau de l'utilisateur
    const levelTips = {
      'debutant': [
        "Commencez par des légumes faciles comme les radis, la laitue et les courgettes.",
        "Tenez un journal de jardin pour noter vos observations et apprendre de vos expériences.",
        "N'hésitez pas à demander conseil à des jardiniers plus expérimentés ou à rejoindre un forum de jardinage."
      ],
      'intermediaire': [
        "Essayez de faire vos propres semis pour avoir plus de diversité et économiser.",
        "Expérimentez avec les cultures étagées pour optimiser votre espace.",
        "Les purins de plantes comme la consoude ou l'ortie font d'excellents engrais naturels."
      ],
      'expert': [
        "Pensez à récolter et conserver vos propres graines pour les cultures de l'année suivante.",
        "Expérimentez avec la greffe pour certains légumes comme les tomates ou les aubergines.",
        "Créez votre propre calendrier de cultures adapté spécifiquement à votre microclimat."
      ]
    };

    // Combiner les conseils en fonction du profil de l'utilisateur
    const allTips = [
      ...generalTips,
      ...(cultureTips[garden.type_culture] || []),
      ...(levelTips[garden.niveau] || [])
    ];

    // Sélectionner un conseil aléatoire
    const dailyTip = allTips[Math.floor(Math.random() * allTips.length)];

    res.json({ dailyTip });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;