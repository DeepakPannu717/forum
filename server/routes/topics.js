const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');

// Get all topics
router.get('/topics', async (req, res) => {
  try {
    const topics = await Topic.find().populate('categoryId');
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new topic
router.post('/topic', async (req, res) => {
  try {
    const { name, categoryId, language, codebase, output } = req.body;
    const topic = new Topic({
      name,
      categoryId,
      language,
      codebase,
      output,
      status: 'active'
    });
    const savedTopic = await topic.save();
    res.status(201).json(savedTopic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update topic
router.put('/topic/:id', async (req, res) => {
  try {
    const { name, categoryId, language, codebase, output, status } = req.body;
    const updatedTopic = await Topic.findByIdAndUpdate(
      req.params.id,
      {
        name,
        categoryId,
        language,
        codebase,
        output,
        status
      },
      { new: true }
    );
    if (!updatedTopic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.json(updatedTopic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;