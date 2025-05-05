const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');
const { protect } = require('../middleware/authMiddleware');

// @route POST /api/bookmarks
// @desc  Save a listing
router.post('/', protect, async (req, res) => {
  try {
    const { listingId } = req.body;

    // Prevent duplicates
    const exists = await Bookmark.findOne({ userId: req.user._id, listingId });
    if (exists) return res.status(409).json({ message: 'Already saved' });

    const bookmark = await Bookmark.create({ userId: req.user._id, listingId });
    res.status(201).json(bookmark);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/bookmarks
// @desc  Get all saved listings by user
router.get('/', protect, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id }).populate('listingId');
    res.json(bookmarks.map(b => b.listingId)); // return only listings
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route DELETE /api/bookmarks/:id
// @desc  Unsave a listing
router.delete('/:id', protect, async (req, res) => {
  try {
    await Bookmark.findOneAndDelete({ userId: req.user._id, listingId: req.params.id });
    res.json({ message: 'Bookmark removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
