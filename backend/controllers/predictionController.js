// backend/controllers/predictionController.js
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Path to Python script
const ML_DIR = path.join(__dirname, '..', '..', 'ml');
const PREDICT_SCRIPT = path.join(ML_DIR, 'predict.py');

// Check if Python script exists
if (!fs.existsSync(PREDICT_SCRIPT)) {
  console.error(`Warning: ML prediction script not found at ${PREDICT_SCRIPT}`);
}

/**
 * Get energy consumption predictions for the next 24 hours
 */
const getPredictions = async (req, res) => {
  try {
    const deviceData = req.body;

    // Make sure ML directory exists
    if (!fs.existsSync(ML_DIR)) {
      return res.status(500).json({ 
        message: 'ML system not properly configured. Directory not found.',
        success: false
      });
    }

    // Create a Python process to run the prediction
    const pythonProcess = spawn('python', [
      path.join(ML_DIR, 'predict_api.py'),
      JSON.stringify(deviceData)
    ]);

    let predictionData = '';
    let errorData = '';

    // Collect data from script
    pythonProcess.stdout.on('data', (data) => {
      predictionData += data.toString();
    });

    // Collect any error output
    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
      console.error(`ML prediction error: ${data}`);
    });

    // Handle completion
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`ML prediction process exited with code ${code}`);
        console.error(`Error output: ${errorData}`);
        return res.status(500).json({ 
          message: 'Error processing prediction request',
          error: errorData,
          success: false
        });
      }

      try {
        // Parse the JSON output from the Python script
        const predictions = JSON.parse(predictionData);
        return res.json({
          success: true,
          predictions
        });
      } catch (parseError) {
        console.error(`Error parsing prediction output: ${parseError.message}`);
        return res.status(500).json({
          message: 'Error parsing prediction results',
          error: parseError.message,
          success: false
        });
      }
    });

  } catch (error) {
    console.error(`Prediction controller error: ${error.message}`);
    res.status(500).json({ 
      message: 'Server error while processing prediction request',
      error: error.message,
      success: false
    });
  }
};

/**
 * Get optimization recommendations based on current energy usage
 */
const getOptimizationRecommendations = async (req, res) => {
  try {
    const { deviceId } = req.params;
    
    // Create mock optimization recommendations for now
    // In a real implementation, this would use the ML model's outputs
    const recommendations = [
      {
        id: 1,
        title: 'Reduce HVAC during off-peak hours',
        description: 'Lower HVAC usage between 10 PM and 6 AM to reduce energy consumption.',
        potentialSavings: '15%',
        category: 'hvac',
        difficulty: 'easy'
      },
      {
        id: 2,
        title: 'Optimize lighting schedule',
        description: 'Use natural light during daytime hours and reduce artificial lighting.',
        potentialSavings: '10%',
        category: 'lighting',
        difficulty: 'easy'
      },
      {
        id: 3,
        title: 'Smart thermostat adjustment',
        description: 'Adjust your thermostat by 2 degrees to save energy without sacrificing comfort.',
        potentialSavings: '8%',
        category: 'hvac',
        difficulty: 'medium'
      }
    ];
    
    res.json({ success: true, recommendations });
  } catch (error) {
    console.error(`Optimization recommendation error: ${error.message}`);
    res.status(500).json({ 
      message: 'Server error while processing optimization recommendations',
      error: error.message,
      success: false
    });
  }
};

module.exports = {
  getPredictions,
  getOptimizationRecommendations
};