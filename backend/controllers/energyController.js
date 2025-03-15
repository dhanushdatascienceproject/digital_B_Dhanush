const fs = require('fs');
const path = require('path');
const Device = require('../models/deviceModel');
const EnergyData = require('../models/energyDataModel');

// Get all devices
const getDevices = async (req, res) => {
  try {
    const devices = await Device.find({});
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add a new device
const addDevice = async (req, res) => {
  try {
    const { name, type, location, maxWattage } = req.body;
    
    const device = new Device({
      name,
      type,
      location,
      maxWattage,
    });
    
    const createdDevice = await device.save();
    res.status(201).json(createdDevice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Post energy data
const postEnergyData = async (req, res) => {
  try {
    const { deviceId, wattage, duration } = req.body;
    
    const device = await Device.findById(deviceId);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    
    const totalEnergy = (wattage * duration) / (1000 * 60);
    const cost = totalEnergy * 0.15;
    
    const energyData = new EnergyData({
      device: deviceId,
      wattage,
      duration,
      totalEnergy,
      cost,
    });
    
    const savedData = await energyData.save();
    res.status(201).json(savedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get energy data for a specific device
const getDeviceEnergyData = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { period } = req.query;
    
    let startDate;
    const endDate = new Date();
    
    switch (period) {
      case 'day':
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 1);
        break;
      case 'week':
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      default:
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 1);
    }
    
    const energyData = await EnergyData.find({
      device: deviceId,
      timestamp: { $gte: startDate, $lte: endDate },
    }).sort({ timestamp: 1 });
    
    res.json(energyData);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get total energy usage
const getTotalEnergy = async (req, res) => {
  try {
    const { period } = req.query;
    let startDate;
    const endDate = new Date();
    
    switch (period) {
      case 'day':
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 1);
        break;
      case 'week':
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      default:
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 1);
    }
    
    const result = await EnergyData.aggregate([
      { $match: { timestamp: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: null, totalEnergy: { $sum: '$totalEnergy' }, totalCost: { $sum: '$cost' } } },
    ]);
    
    res.json(result.length ? result[0] : { totalEnergy: 0, totalCost: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get energy usage by device type
const getEnergyByDeviceType = async (req, res) => {
  try {
    const { period } = req.query;
    let startDate;
    const endDate = new Date();
    
    switch (period) {
      case 'day':
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 1);
        break;
      case 'week':
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(endDate);
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      default:
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 1);
    }
    
    const result = await EnergyData.aggregate([
      { $match: { timestamp: { $gte: startDate, $lte: endDate } } },
      { $lookup: { from: 'devices', localField: 'device', foreignField: '_id', as: 'deviceInfo' } },
      { $unwind: '$deviceInfo' },
      { $group: { _id: '$deviceInfo.type', totalEnergy: { $sum: '$totalEnergy' }, totalCost: { $sum: '$cost' } } },
      { $project: { type: '$_id', totalEnergy: 1, totalCost: 1, _id: 0 } },
    ]);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get historical energy data from a file
const getHistoricalEnergy = (req, res) => {
  const filePath = path.join(__dirname, '../ml/historical_data.csv');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading historical data' });
    res.json({ historicalData: data });
  });
};

// Get predicted energy usage
const getPredictedEnergy = (req, res) => {
  const predictedData = [
    { type: 'light', totalEnergy: 12.3, totalCost: 3.1 },
    { type: 'hvac', totalEnergy: 22.5, totalCost: 6.2 },
    { type: 'appliance', totalEnergy: 16.8, totalCost: 4.8 }
  ];
  res.json(predictedData);
};

module.exports = {
  getDevices,
  addDevice,
  postEnergyData,
  getDeviceEnergyData,
  getTotalEnergy,
  getEnergyByDeviceType,
  getHistoricalEnergy,
  getPredictedEnergy,
};
