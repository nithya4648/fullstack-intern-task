const express = require('express');
const mongoose = require('mongoose');
const Template = require('../models/Template');

const router = express.Router();

const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

router.get('/', async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (search) {
      const regex = new RegExp(escapeRegex(search), 'i');
      filter.$or = [{ name: regex }, { description: regex }];
    }

    const templates = await Template.find(filter).sort({ _id: 1 });
    res.json(templates);
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid template id' });
    }
    const t = await Template.findById(id);
    if (!t) return res.status(404).json({ message: 'Template not found' });
    res.json(t);
  } catch (e) { next(e); }
});

module.exports = router;
