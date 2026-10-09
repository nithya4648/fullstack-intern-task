const express = require('express');
const { db } = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const q = db('templates').select('*').orderBy('id');
    if (category) q.where({ category });
    if (search) q.andWhere((b) => b.where('name', 'like', `%${search}%`).orWhere('description', 'like', `%${search}%`));
    res.json(await q);
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid template id' });
    const t = await db('templates').where({ id }).first();
    if (!t) return res.status(404).json({ message: 'Template not found' });
    res.json(t);
  } catch (e) { next(e); }
});

module.exports = router;
