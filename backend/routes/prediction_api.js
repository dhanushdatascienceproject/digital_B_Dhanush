const express = require('express');
const router = express.Router();
const { 
  predictEnergy, 
  getOptimizationSuggestions 
} = require('../controllers/predictionController');

// Route for energy prediction
router.post('/predict', predictEnergy);

// Route for optimization suggestions
router.post('/optimize', getOptimizationSuggestions);

module.exports = router;