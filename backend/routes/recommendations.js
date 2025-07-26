// Dans backend/routes/recommendations.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Garden = require('../models/Garden');
const OpenAI = require('openai');

// @route   GET api/recommendations
// @desc    Obtenir des recommandations pour le potager
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // 1. Récupérer les informations du potager de l'utilisateur
    const garden = await Garden.findOne({ userId: req.user.id });
    
    if (!garden) {
      return res.status(404).json({ msg: 'Aucun potager trouvé' });
    }

    // 2. Extraire les plantes existantes
    const existingPlants = garden.plantes && garden.plantes.length > 0 
      ? garden.plantes.map(p => p.nom)
      : [];
      
    console.log("Plantes existantes:", existingPlants);

    // 3. Générer des recommandations basées sur le potager et les plantes existantes
    try {
      const recommendations = await generateAIRecommendations(garden, existingPlants);
      res.json({ recommendations });
    } catch (aiError) {
      console.error('Erreur lors de l\'appel à l\'API OpenAI:', aiError);
      // En cas d'échec, utiliser la méthode de secours
      const fallbackRecommendations = generateFallbackRecommendations(garden, existingPlants);
      res.json({ 
        recommendations: fallbackRecommendations,
        fallback: true
      });
    }
  } catch (err) {
    console.error('Erreur lors de la génération des recommandations:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Fonction pour générer des recommandations via OpenAI
async function generateAIRecommendations(garden, existingPlants) {
  // Initialiser le client OpenAI
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  // Obtenir la saison actuelle
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  
  let season = "";
  if (currentMonth >= 2 && currentMonth <= 4) {
    season = "printemps";
  } else if (currentMonth >= 5 && currentMonth <= 7) {
    season = "été";
  } else if (currentMonth >= 8 && currentMonth <= 10) {
    season = "automne";
  } else {
    season = "hiver";
  }

  // Construire la liste des plantes existantes
  const plantsList = existingPlants.length > 0 
    ? existingPlants.join(", ")
    : "aucune plante pour le moment";

  // Construire le prompt pour l'IA
  let prompt = `Tu es un expert en jardinage et en potager. Je souhaite des recommandations détaillées pour mon potager avec les caractéristiques suivantes :
- Région: ${garden.region}
- Surface: ${garden.surface_m2} m²
- Type de culture: ${garden.type_culture}
- Système d'arrosage: ${garden.arrosage}
- Niveau d'expérience: ${garden.niveau}
- Saison actuelle: ${season}
- Plantes déjà présentes dans mon potager: ${plantsList}

En tenant compte des plantes que je cultive déjà, fournir des recommandations dans le format JSON suivant (respecte strictement cette structure sans commentaire additionnel):
{
  "recommendedPlants": ["liste de 5-8 plantes recommandées pour compléter mon potager, adaptées à la saison et à mon niveau, différentes de celles que j'ai déjà"],
  "companionPlants": ["plantes compagnes qui se marient bien avec mes plantes existantes"],
  "plantCareAdvice": "conseils spécifiques pour l'entretien de mes plantes actuelles",
  "seasonalTips": "conseil saisonnier spécifique",
  "wateringAdvice": "conseil d'arrosage tenant compte de mon système d'arrosage et de mes plantes",
  "spaceAdvice": "conseil pour optimiser l'utilisation de mon espace avec mes plantes actuelles",
  "cultureAdvice": "conseil spécifique à mon type de culture",
  "experienceAdvice": "conseil adapté à mon niveau d'expérience",
  "generalAdvice": "conseil général pour améliorer mon potager"
}

N'inclure strictement que la structure JSON dans ta réponse, sans texte supplémentaire ni préambule.`;

  console.log("Envoi du prompt à OpenAI avec les plantes:", plantsList);

  // Appeler l'API OpenAI
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", // Utiliser le modèle moins cher
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 1000
  });

  // Extraire et parser la réponse JSON
  const content = response.choices[0].message.content.trim();
  console.log("Réponse brute d'OpenAI reçue");
  
  try {
    // Essayer de parser la réponse comme JSON
    const jsonResponse = JSON.parse(content);
    return {
      season,
      ...jsonResponse,
      source: 'openai'
    };
  } catch (jsonErr) {
    console.error("Erreur lors du parsing de la réponse JSON:", jsonErr);
    throw new Error("Format de réponse invalide");
  }
}

// Fonction de secours pour générer des recommandations sans API externe
function generateFallbackRecommendations(garden, existingPlants) {
  const { region, surface_m2, type_culture, arrosage, niveau } = garden;
  
  // Obtenir la saison actuelle
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  
  let season = "";
  if (currentMonth >= 2 && currentMonth <= 4) {
    season = "printemps";
  } else if (currentMonth >= 5 && currentMonth <= 7) {
    season = "été";
  } else if (currentMonth >= 8 && currentMonth <= 10) {
    season = "automne";
  } else {
    season = "hiver";
  }
  
  // Recommandations de plantes par saison et niveau d'expérience
  const plantsBySeasonAndLevel = {
    printemps: {
      debutant: ["Radis", "Laitue", "Épinards", "Petits pois", "Oignons verts"],
      intermediaire: ["Carottes", "Betteraves", "Oignons", "Pommes de terre précoces", "Chou-fleur"],
      expert: ["Artichauts", "Asperges", "Aubergines (sous abri)", "Poivrons (sous abri)", "Tomates (sous abri)"]
    },
    été: {
      debutant: ["Tomates cerises", "Concombres", "Courgettes", "Basilic", "Ciboulette"],
      intermediaire: ["Aubergines", "Poivrons", "Haricots verts", "Maïs doux", "Tomates"],
      expert: ["Melons", "Pastèques", "Patates douces", "Okra", "Piments forts"]
    },
    automne: {
      debutant: ["Mâche", "Épinards", "Roquette", "Radis", "Laitue d'hiver"],
      intermediaire: ["Chou frisé", "Poireaux", "Fenouil", "Carottes d'hiver", "Navets"],
      expert: ["Brocoli", "Choux de Bruxelles", "Céleri-rave", "Artichauts d'hiver", "Crosnes"]
    },
    hiver: {
      debutant: ["Ail", "Oignons verts", "Mâche", "Épinards d'hiver", "Ciboulette"],
      intermediaire: ["Chou-fleur", "Chou", "Poireaux", "Navets d'hiver", "Carottes d'hiver"],
      expert: ["Endives", "Rhubarbe", "Choux frisés", "Panais", "Scorsonère"]
    }
  };

  // Filtrer les plantes recommandées pour éviter les doublons avec les plantes existantes
  const allRecommendedPlants = plantsBySeasonAndLevel[season][niveau];
  const filteredRecommendedPlants = allRecommendedPlants.filter(
    plant => !existingPlants.some(existingPlant => 
      existingPlant.toLowerCase().includes(plant.toLowerCase()) || 
      plant.toLowerCase().includes(existingPlant.toLowerCase())
    )
  );

  // Générer des associations de plantes basiques
  const companionPlantMappings = {
    "Tomate": ["Basilic", "Œillets d'Inde", "Oignons", "Carottes"],
    "Carotte": ["Oignons", "Poireaux", "Romarin", "Sauge"],
    "Concombre": ["Tournesol", "Haricots", "Laitue", "Radis"],
    "Courgette": ["Capucine", "Haricots", "Maïs", "Menthe"],
    "Haricot": ["Carottes", "Concombres", "Fraises", "Maïs"],
    "Laitue": ["Carottes", "Fraises", "Oignons", "Radis"],
    "Oignon": ["Carottes", "Betteraves", "Tomates", "Laitue"],
    "Poivron": ["Basilic", "Oignons", "Carottes", "Tomates"],
    "Aubergine": ["Haricots", "Thym", "Capucine"],
    "Radis": ["Carottes", "Épinards", "Concombres", "Laitue"]
  };

  const companionPlants = [];
  existingPlants.forEach(plant => {
    const plantKey = Object.keys(companionPlantMappings).find(
      key => plant.toLowerCase().includes(key.toLowerCase())
    );
    
    if (plantKey && companionPlantMappings[plantKey]) {
      const companions = companionPlantMappings[plantKey].filter(
        companion => !existingPlants.some(ep => 
          ep.toLowerCase().includes(companion.toLowerCase())
        )
      );
      
      companions.forEach(companion => {
        if (!companionPlants.includes(companion)) {
          companionPlants.push(companion);
        }
      });
    }
  });

  // Conseils pour l'entretien des plantes existantes
  let plantCareAdvice = "Conseils généraux pour vos plantes:";
  
  if (existingPlants.length > 0) {
    const plantCareMap = {
      "Tomate": "Arrosez régulièrement au pied sans mouiller le feuillage. Pincez les gourmands et tuteurez les tiges.",
      "Carotte": "Maintenez le sol légèrement humide pour une bonne germination et un bon développement. Éclaircissez pour permettre un bon développement racinaire.",
      "Concombre": "Arrosez abondamment par temps chaud et tuteurez pour gagner de l'espace. Récoltez régulièrement pour stimuler la production.",
      "Courgette": "Arrosez au pied sans mouiller les feuilles pour éviter l'oïdium. Récoltez régulièrement pour prolonger la production.",
      "Haricot": "Tuteurez les variétés grimpantes et arrosez en période de floraison. Récoltez régulièrement pour stimuler la production.",
      "Laitue": "Arrosez régulièrement mais sans excès. Protégez des fortes chaleurs en été.",
      "Radis": "Maintenez le sol frais et humide. Récoltez dès qu'ils atteignent leur taille normale pour éviter qu'ils deviennent creux ou piquants."
    };

    plantCareAdvice = existingPlants.map(plant => {
      const matchedPlant = Object.keys(plantCareMap).find(
        key => plant.toLowerCase().includes(key.toLowerCase())
      );
      
      if (matchedPlant) {
        return `${plant}: ${plantCareMap[matchedPlant]}`;
      }
      return `${plant}: Surveillez l'arrosage et l'apparition de maladies ou ravageurs régulièrement.`;
    }).join(" ");
  } else {
    plantCareAdvice = "Lorsque vous ajouterez des plantes à votre potager, vous recevrez des conseils spécifiques pour leur entretien.";
  }

  // Conseils d'arrosage adaptés aux plantes
  let wateringAdvice = "";
  switch (arrosage) {
    case 'manuel':
      wateringAdvice = "Pour votre arrosage manuel, privilégiez l'arrosage tôt le matin ou en soirée pour limiter l'évaporation. Arrosez au pied des plantes plutôt que sur les feuilles pour éviter les maladies fongiques.";
      break;
    case 'automatique':
      wateringAdvice = "Votre système d'arrosage automatique est pratique, mais vérifiez régulièrement qu'il fonctionne correctement. Ajustez les horaires selon la saison : plus fréquent en été, moins en hiver.";
      break;
    case 'goutte_a_goutte':
      wateringAdvice = "Votre système de goutte à goutte est idéal pour économiser l'eau. Vérifiez régulièrement que chaque plante reçoit bien l'eau nécessaire et que les goutteurs ne sont pas bouchés.";
      break;
    default:
      wateringAdvice = "Adaptez votre arrosage en fonction de la saison et du type de plante. Testez l'humidité du sol en enfonçant votre doigt sur quelques centimètres : si c'est sec, arrosez.";
  }

  // Ajuster le conseil d'arrosage en fonction des plantes
  if (existingPlants.length > 0) {
    const needsMoreWater = ["Tomate", "Concombre", "Courgette", "Aubergine", "Poivron"];
    const needsLessWater = ["Romarin", "Thym", "Sauge", "Lavande"];
    
    const hasThirstyPlants = existingPlants.some(plant => 
      needsMoreWater.some(thirsty => plant.toLowerCase().includes(thirsty.toLowerCase()))
    );
    
    const hasWaterSensitivePlants = existingPlants.some(plant => 
      needsLessWater.some(sensitive => plant.toLowerCase().includes(sensitive.toLowerCase()))
    );
    
    if (hasThirstyPlants) {
      wateringAdvice += " Certaines de vos plantes comme les tomates, concombres ou courgettes ont besoin d'un arrosage plus fréquent, surtout en période chaude.";
    }
    
    if (hasWaterSensitivePlants) {
      wateringAdvice += " Attention à ne pas trop arroser vos plantes aromatiques méditerranéennes qui préfèrent un sol sec.";
    }
  }

  // Conseils pour l'espace
  let spaceAdvice = "";
  if (surface_m2 < 5) {
    spaceAdvice = `Pour votre petit espace de ${surface_m2} m², privilégiez les plantes à croissance verticale comme les haricots grimpants ou les tomates à tuteurs. Utilisez des pots suspendus pour les herbes aromatiques.`;
  } else if (surface_m2 < 20) {
    spaceAdvice = `Avec une surface de ${surface_m2} m², vous pouvez planter une bonne variété de légumes. Pensez à la rotation des cultures pour maintenir la fertilité du sol et éviter les maladies.`;
  } else {
    spaceAdvice = `Votre grande surface de ${surface_m2} m² vous permet de diviser votre potager en zones thématiques ou en planches de culture. Intégrez des fleurs pour attirer les pollinisateurs et des plantes compagnes pour repousser certains nuisibles.`;
  }

  // Adapter les conseils d'espace aux plantes existantes
  if (existingPlants.length > 0) {
    const tallPlants = ["Tomate", "Maïs", "Tournesol", "Haricot grimpant"];
    const groundCoveringPlants = ["Courgette", "Potiron", "Courge"];
    
    const hasTallPlants = existingPlants.some(plant => 
      tallPlants.some(tall => plant.toLowerCase().includes(tall.toLowerCase()))
    );
    
    const hasSpreadingPlants = existingPlants.some(plant => 
      groundCoveringPlants.some(spreading => plant.toLowerCase().includes(spreading.toLowerCase()))
    );
    
    if (hasTallPlants) {
      spaceAdvice += " Placez vos plantes hautes (comme les tomates ou haricots grimpants) au nord de votre potager pour éviter qu'elles ne fassent de l'ombre aux autres cultures.";
    }
    
    if (hasSpreadingPlants) {
      spaceAdvice += " Prévoyez suffisamment d'espace pour vos plantes coureuses comme les courgettes ou courges qui ont tendance à s'étaler.";
    }
  }

  // Conseils pour le type de culture
  let cultureAdvice = "";
  switch (type_culture) {
    case 'pleine_terre':
      cultureAdvice = "Pour votre culture en pleine terre, améliorez votre sol avant chaque plantation avec du compost. Un bon paillage limitera la pousse des mauvaises herbes et conservera l'humidité du sol.";
      break;
    case 'bac':
      cultureAdvice = "Pour votre culture en bac, assurez-vous d'avoir un bon drainage et utilisez un terreau de qualité adapté aux légumes. Renouvelez partiellement le terreau chaque année pour maintenir sa fertilité.";
      break;
    case 'serre':
      cultureAdvice = "Pour votre culture sous serre, surveillez attentivement l'humidité et la température. Une aération régulière est essentielle pour éviter les maladies, et pensez à ombrager votre serre en été pour éviter la surchauffe.";
      break;
  }

  // Conseils selon le niveau d'expérience
  let experienceAdvice = "";
  switch (niveau) {
    case 'debutant':
      experienceAdvice = "En tant que débutant, commencez par des légumes faciles comme les radis, la laitue ou les courgettes. Prenez des notes sur vos succès et échecs pour apprendre de vos expériences.";
      break;
    case 'intermediaire':
      experienceAdvice = "Avec votre niveau intermédiaire, vous pouvez tenter des cultures un peu plus exigeantes comme les tomates ou les aubergines. Essayez quelques techniques avancées comme les associations de plantes bénéfiques.";
      break;
    case 'expert':
      experienceAdvice = "Avec votre expertise, vous pouvez vous lancer dans des cultures plus délicates et techniques. Pensez à faire vos propres semis et peut-être même à récolter et conserver vos graines.";
      break;
  }

  // Construction du résultat
  return {
    season,
    recommendedPlants: filteredRecommendedPlants.length > 0 ? filteredRecommendedPlants : allRecommendedPlants,
    companionPlants: companionPlants.length > 0 ? companionPlants : ["Basilic", "Œillets d'Inde", "Souci", "Capucine", "Bourrache"],
    plantCareAdvice,
    seasonalTips: `Nous sommes actuellement en ${season}, c'est le moment idéal pour planter : ${filteredRecommendedPlants.length > 0 ? filteredRecommendedPlants.join(", ") : allRecommendedPlants.join(", ")}.`,
    wateringAdvice,
    spaceAdvice,
    cultureAdvice,
    experienceAdvice,
    generalAdvice: `Pour votre potager en ${region}, observez régulièrement vos plantes pour détecter les problèmes dès leur apparition. Tenez un journal de jardin pour suivre ce qui fonctionne bien dans vos conditions spécifiques.`,
    source: 'fallback'
  };
}

module.exports = router;