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
// @desc  Get all listings (with smart filters)
router.get('/', async (req, res) => {
  try {
    const filters = {};

    // Location search
    if (req.query.location) {
      filters.location = { $regex: req.query.location, $options: 'i' };
    }

    // Price range
    if (req.query.minPrice) {
      filters.price = { ...filters.price, $gte: parseInt(req.query.minPrice) };
    }
    if (req.query.maxPrice) {
      filters.price = { ...filters.price, $lte: parseInt(req.query.maxPrice) };
    }

    // Distance filter
    if (req.query.distanceFromCampus) {
      filters.distanceFromCampus = req.query.distanceFromCampus;
    }

    // Amenities filter (e.g., WiFi,Laundry)
    if (req.query.amenities) {
      const amenitiesArray = req.query.amenities.split(',');
      filters.amenities = { $all: amenitiesArray };
    }

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

// @route PUT /api/listings/:id
// @desc  Update a listing (only by the owner)
router.put('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(listing, req.body);
    const updated = await listing.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route DELETE /api/listings/:id
// @desc  Delete a listing (owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await listing.deleteOne(); // ✅ Corrected delete
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Export router so it works in server.js
module.exports = router;
