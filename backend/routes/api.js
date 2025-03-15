// File: backend/routes/api.js
const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Your existing routes...

// New route for prediction
router.post('/predict', async (req, res) => {
  try {
    // Get input data from request body
    const inputData = req.body;
    
    // Create a temporary JSON file to pass data to Python script
    const tempFilePath = path.join(__dirname, '../temp_input.json');
    fs.writeFileSync(tempFilePath, JSON.stringify(inputData));
    
    // Path to the Python script
    const pythonScriptPath = path.join(__dirname, '../../ml/predict.py');
    
    // Execute the Python script with the input file
    exec(`python "${pythonScriptPath}" "${tempFilePath}"`, (error, stdout, stderr) => {
      // Delete temporary file
      fs.unlinkSync(tempFilePath);
      
      if (error) {
        console.error(`Exec error: ${error}`);
        return res.status(500).json({ success: false, error: error.message });
      }
      
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      
      console.log(`Python script output: ${stdout}`);
      
      // Try to parse the output as JSON
      try {
        // Look for JSON in the output
        const jsonMatch = stdout.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]);
          res.json(result);
        } else {
          res.status(500).json({ 
            success: false, 
            error: 'Could not parse prediction result' 
          });
        }
      } catch (parseError) {
        console.error('Error parsing Python output:', parseError);
        res.status(500).json({ 
          success: false, 
          error: 'Failed to parse prediction output', 
          stdout: stdout 
        });
      }
    });
  } catch (err) {
    console.error('Prediction API error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;