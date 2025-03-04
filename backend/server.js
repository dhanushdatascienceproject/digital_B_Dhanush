const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', require('./routes/api'));

// Server status route
app.get('/', (req, res) => {
  res.json({ message: 'Smart Home Energy Monitoring API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Add this to your backend/server.js before the app.listen line to create sample data
const Device = require('./models/deviceModel');
const EnergyData = require('./models/energyDataModel');

// Function to generate sample data
const generateSampleData = async () => {
  try {
    // Check if we already have devices
    const deviceCount = await Device.countDocuments();
    if (deviceCount > 0) {
      console.log('Sample data already exists');
      return;
    }
    
    console.log('Generating sample data...');
    
    // Create sample devices
    const devices = await Device.insertMany([
      {
        name: 'Living Room Lights',
        type: 'light',
        location: 'Living Room',
        maxWattage: 60,
      },
      {
        name: 'Kitchen Refrigerator',
        type: 'appliance',
        location: 'Kitchen',
        maxWattage: 150,
      },
      {
        name: 'Bedroom AC',
        type: 'hvac',
        location: 'Bedroom',
        maxWattage: 1000,
      },
      {
        name: 'Home Office Computer',
        type: 'electronics',
        location: 'Office',
        maxWattage: 300,
      },
    ]);
    
    // Generate energy data for the past 30 days
    const now = new Date();
    const energyData = [];
    
    for (const device of devices) {
      for (let i = 0; i < 30; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Random values for realistic data
        const wattage = Math.floor(device.maxWattage * (0.5 + Math.random() * 0.5));
        const duration = 15 + Math.floor(Math.random() * 45); // 15-60 minutes
        const totalEnergy = (wattage * duration) / (1000 * 60); // Convert to kWh
        const cost = totalEnergy * 0.15; // Assuming $0.15 per kWh
        
        energyData.push({
          device: device._id,
          timestamp: date,
          wattage,
          duration,
          totalEnergy,
          cost,
        });
      }
    }
    
    await EnergyData.insertMany(energyData);
    console.log('Sample data generated successfully');
  } catch (error) {
    console.error('Error generating sample data:', error);
  }
};

// Connect to MongoDB and generate sample data
connectDB().then(() => {
  generateSampleData();
});