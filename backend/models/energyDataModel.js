const mongoose = require('mongoose');

const energyDataSchema = mongoose.Schema(
  {
    device: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Device',
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    wattage: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      default: 15,
    },
    totalEnergy: {
      type: Number, // in kWh
      required: true,
    },
    cost: {
      type: Number, // approximated cost
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for efficient queries
energyDataSchema.index({ device: 1, timestamp: -1 });

const EnergyData = mongoose.model('EnergyData', energyDataSchema);

module.exports = EnergyData;