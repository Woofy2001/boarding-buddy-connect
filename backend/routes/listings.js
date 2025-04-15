const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const { protect } = require('../middleware/authMiddleware');

// @route POST /api/listings
// @desc  Create new listing (Landlord only)
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.userType !== 'landlord') {
      return res.status(403).json({ message: 'Only landlords can post listings' });
    }

    const listing = new Listing({
      ...req.body,
      owner: req.user._id
    });

    const saved = await listing.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/listings
// @desc  Get all listings (with optional filters)
router.get('/', async (req, res) => {
  try {
    const filters = {};
    if (req.query.location) filters.location = { $regex: req.query.location, $options: 'i' };
    if (req.query.maxPrice) filters.price = { $lte: parseInt(req.query.maxPrice) };

    const listings = await Listing.find(filters).populate('owner', 'name userType');
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/listings/my
// @desc  Get listings by logged-in landlord
router.get('/my', protect, async (req, res) => {
  try {
    if (req.user.userType !== 'landlord') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const listings = await Listing.find({ owner: req.user._id });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Export router so it works in server.js
module.exports = router;
