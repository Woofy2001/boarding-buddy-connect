const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  distanceFromCampus: { type: String },
  amenities: [{ type: String }], // e.g. ['WiFi', 'AC']
  images: [{ type: String }],    // URLs
  verified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);
