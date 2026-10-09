const express = require('express');
const { db } = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    const rows = await db('favorites')
      .join('templates', 'templates.id', 'favorites.template_id')
      .where('favorites.user_id', req.user.id)
      .select('templates.*')
      .orderBy('favorites.id', 'desc');
    res.json(rows);
  } catch (e) { next(e); }
});

router.post('/:templateId', async (req, res, next) => {
  try {
    const templateId = Number(req.params.templateId);
    if (!Number.isInteger(templateId)) return res.status(400).json({ message: 'Invalid template id' });
    const t = await db('templates').where({ id: templateId }).first();
    if (!t) return res.status(404).json({ message: 'Template not found' });

    const exists = await db('favorites').where({ user_id: req.user.id, template_id: templateId }).first();
    if (exists) return res.status(200).json({ message: 'Already in favorites', template: t });

    await db('favorites').insert({ user_id: req.user.id, template_id: templateId });
    res.status(201).json({ message: 'Added to favorites', template: t });
  } catch (e) { next(e); }
});

// Extra: allow un-favoriting (toggle in the UI)
router.delete('/:templateId', async (req, res, next) => {
  try {
    const templateId = Number(req.params.templateId);
    if (!Number.isInteger(templateId)) return res.status(400).json({ message: 'Invalid template id' });
    await db('favorites').where({ user_id: req.user.id, template_id: templateId }).del();
    res.json({ message: 'Removed from favorites' });
  } catch (e) { next(e); }
});

module.exports = router;
