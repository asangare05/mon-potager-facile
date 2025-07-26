// models/Garden.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlantSchema = new Schema({
  nom: {
    type: String,
    required: true
  },
  date_plantation: {
    type: Date,
    default: Date.now
  },
  arrosage_prochain: {
    type: Date
  },
  recolte_estimee: {
    type: Date
  },
  notes: String,
  photos: [String]
});

const GardenSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  region: {
    type: String,
    required: true
  },
  surface_m2: {
    type: Number,
    required: true
  },
  type_culture: {
    type: String,
    enum: ['pleine_terre', 'bac', 'serre'],
    required: true
  },
  arrosage: {
    type: String,
    enum: ['manuel', 'automatique', 'goutte_a_goutte'],
    required: true
  },
  niveau: {
    type: String,
    enum: ['debutant', 'intermediaire', 'expert'],
    default: 'debutant'
  },
  plantes: [PlantSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Garden', GardenSchema);