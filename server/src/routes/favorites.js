const express = require('express');
const mongoose = require('mongoose');
const Favorite = require('../models/Favorite');
const Template = require('../models/Template');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id })
      .sort({ _id: -1 })
      .populate('template');

    const templates = favorites
      .filter((f) => f.template)
      .map((f) => (f.template.toJSON ? f.template.toJSON() : f.template));

    res.json(templates);
  } catch (e) { next(e); }
});

router.post('/:templateId', async (req, res, next) => {
  try {
    const { templateId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      return res.status(400).json({ message: 'Invalid template id' });
    }

    const template = await Template.findById(templateId);
    if (!template) return res.status(404).json({ message: 'Template not found' });

    const existing = await Favorite.findOne({ user: req.user.id, template: templateId });
    if (existing) {
      return res.status(200).json({ message: 'Already in favorites', template });
    }

    try {
      await Favorite.create({ user: req.user.id, template: templateId });
    } catch (e) {
      if (e.code === 11000) {
        return res.status(200).json({ message: 'Already in favorites', template });
      }
      throw e;
    }

    res.status(201).json({ message: 'Added to favorites', template });
  } catch (e) { next(e); }
});

router.delete('/:templateId', async (req, res, next) => {
  try {
    const { templateId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      return res.status(400).json({ message: 'Invalid template id' });
    }

    await Favorite.deleteOne({ user: req.user.id, template: templateId });
    res.json({ message: 'Removed from favorites' });
  } catch (e) { next(e); }
});

module.exports = router;
