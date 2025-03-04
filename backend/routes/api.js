const express = require('express');
const router = express.Router();
const {
  getDevices,
  addDevice,
  postEnergyData,
  getDeviceEnergyData,
  getTotalEnergy,
  getEnergyByDeviceType,
} = require('../controllers/energyController');

// Device routes
router.get('/devices', getDevices);
router.post('/devices', addDevice);

// Energy data routes
router.post('/energy', postEnergyData);
router.get('/energy/device/:deviceId', getDeviceEnergyData);
router.get('/energy/total', getTotalEnergy);
router.get('/energy/by-type', getEnergyByDeviceType);

module.exports = router;