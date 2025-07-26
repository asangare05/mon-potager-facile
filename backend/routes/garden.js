const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Garden = require('../models/Garden');

// @route   POST api/garden
// @desc    Créer un nouveau potager
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { region, surface_m2, type_culture, arrosage, niveau } = req.body;
    
    // Vérifier si l'utilisateur a déjà un potager
    let garden = await Garden.findOne({ userId: req.user.id });
    
    if (garden) {
      return res.status(400).json({ msg: 'Vous avez déjà un potager' });
    }
    
    // Créer un nouveau potager
    garden = new Garden({
      userId: req.user.id,
      region,
      surface_m2,
      type_culture,
      arrosage,
      niveau,
      plantes: []
    });

    await garden.save();
    res.json(garden);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/garden
// @desc    Récupérer le potager de l'utilisateur
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const garden = await Garden.findOne({ userId: req.user.id });
    
    if (!garden) {
      return res.status(404).json({ msg: 'Aucun potager trouvé' });
    }

    res.json(garden);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   PUT api/garden
// @desc    Mettre à jour le potager
// @access  Private
router.put('/', auth, async (req, res) => {
  try {
    const { region, surface_m2, type_culture, arrosage, niveau } = req.body;
    
    let garden = await Garden.findOne({ userId: req.user.id });
    
    if (!garden) {
      return res.status(404).json({ msg: 'Aucun potager trouvé' });
    }

    // Mettre à jour les champs
    if (region) garden.region = region;
    if (surface_m2) garden.surface_m2 = surface_m2;
    if (type_culture) garden.type_culture = type_culture;
    if (arrosage) garden.arrosage = arrosage;
    if (niveau) garden.niveau = niveau;
    garden.updatedAt = Date.now();

    await garden.save();
    res.json(garden);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   DELETE api/garden
// @desc    Supprimer le potager
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    await Garden.findOneAndRemove({ userId: req.user.id });
    res.json({ msg: 'Potager supprimé' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   POST api/garden/plante
// @desc    Ajouter une plante au potager
// @access  Private
router.post('/plante', auth, async (req, res) => {
  try {
    const { nom, date_plantation, arrosage_prochain, recolte_estimee, notes } = req.body;
    
    const garden = await Garden.findOne({ userId: req.user.id });
    
    if (!garden) {
      return res.status(404).json({ msg: 'Aucun potager trouvé' });
    }
    
    const nouvellePlante = {
      nom,
      date_plantation: date_plantation || new Date(),
      arrosage_prochain,
      recolte_estimee,
      notes,
      photos: []
    };
    
    garden.plantes.push(nouvellePlante);
    await garden.save();
    
    res.json(garden.plantes[garden.plantes.length - 1]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   PUT api/garden/plante/:id
// @desc    Mettre à jour une plante
// @access  Private
router.put('/plante/:id', auth, async (req, res) => {
  try {
    const { nom, date_plantation, arrosage_prochain, recolte_estimee, notes } = req.body;
    
    const garden = await Garden.findOne({ userId: req.user.id });
    
    if (!garden) {
      return res.status(404).json({ msg: 'Aucun potager trouvé' });
    }
    
    // Trouver l'index de la plante
    const planteIndex = garden.plantes.findIndex(
      plante => plante._id.toString() === req.params.id
    );
    
    if (planteIndex === -1) {
      return res.status(404).json({ msg: 'Plante non trouvée' });
    }
    
    // Mettre à jour les champs
    if (nom) garden.plantes[planteIndex].nom = nom;
    if (date_plantation) garden.plantes[planteIndex].date_plantation = date_plantation;
    if (arrosage_prochain !== undefined) garden.plantes[planteIndex].arrosage_prochain = arrosage_prochain;
    if (recolte_estimee !== undefined) garden.plantes[planteIndex].recolte_estimee = recolte_estimee;
    if (notes !== undefined) garden.plantes[planteIndex].notes = notes;
    
    await garden.save();
    
    res.json(garden.plantes[planteIndex]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   DELETE api/garden/plante/:id
// @desc    Supprimer une plante
// @access  Private
router.delete('/plante/:id', auth, async (req, res) => {
  try {
    const garden = await Garden.findOne({ userId: req.user.id });
    
    if (!garden) {
      return res.status(404).json({ msg: 'Aucun potager trouvé' });
    }
    
    // Filtrer pour supprimer la plante
    garden.plantes = garden.plantes.filter(
      plante => plante._id.toString() !== req.params.id
    );
    
    await garden.save();
    
    res.json({ msg: 'Plante supprimée' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;