const mongoose = require('mongoose');

const deviceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['light', 'hvac', 'appliance', 'electronics', 'other'],
    },
    location: {
      type: String,
      required: true,
    },
    maxWattage: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;