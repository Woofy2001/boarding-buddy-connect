const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/authMiddleware');

// @route POST /api/messages
// @desc  Send a message
router.post('/', protect, async (req, res) => {
  try {
    const { receiverId, content, listingId } = req.body;

    const message = await Message.create({
      senderId: req.user._id,
      receiverId,
      listingId,
      content
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/messages
// @desc  Get all conversations (grouped by users)
router.get('/', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ senderId: req.user._id }, { receiverId: req.user._id }]
    }).populate('senderId receiverId listingId');

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/messages/:userId
// @desc  Get messages between current user and another user
router.get('/:userId', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user._id }
      ]
    }).populate('senderId receiverId listingId');

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
