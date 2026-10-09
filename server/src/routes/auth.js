const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../db');

const router = express.Router();
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sign = (user) =>
  jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    const errors = [];
    if (!name || name.trim().length < 2) errors.push('Name must be at least 2 characters');
    if (!email || !emailRe.test(email)) errors.push('A valid email is required');
    if (!password || password.length < 6) errors.push('Password must be at least 6 characters');
    if (errors.length) return res.status(400).json({ message: errors[0], errors });

    const normalized = email.trim().toLowerCase();
    const existing = await db('users').where({ email: normalized }).first();
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const password_hash = await bcrypt.hash(password, 10);
    const [id] = await db('users').insert({ name: name.trim(), email: normalized, password_hash });
    const user = { id: typeof id === 'object' ? id.id : id, name: name.trim(), email: normalized };
    res.status(201).json({ token: sign(user), user });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !emailRe.test(email)) return res.status(400).json({ message: 'A valid email is required' });
    if (!password) return res.status(400).json({ message: 'Password is required' });

    const row = await db('users').where({ email: email.trim().toLowerCase() }).first();
    if (!row || !(await bcrypt.compare(password, row.password_hash)))
      return res.status(401).json({ message: 'Invalid email or password' });

    const user = { id: row.id, name: row.name, email: row.email };
    res.json({ token: sign(user), user });
  } catch (e) { next(e); }
});

module.exports = router;
