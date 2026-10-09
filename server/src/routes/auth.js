const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sign = (user) =>
  jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    const errors = [];

    if (typeof name !== 'string' || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    } else if (name.trim().length > 100) {
      errors.push('Name must be 100 characters or less');
    }

    if (typeof email !== 'string' || !emailRe.test(email.trim())) {
      errors.push('A valid email is required');
    }

    if (typeof password !== 'string' || password.length < 6) {
      errors.push('Password must be at least 6 characters');
    } else if (password.length > 128) {
      errors.push('Password must be 128 characters or less');
    }

    if (errors.length) return res.status(400).json({ message: errors[0], errors });

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const password_hash = await bcrypt.hash(password, 10);
    const userDoc = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password_hash
    });

    const user = userDoc.toJSON();
    res.status(201).json({ token: sign(user), user });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    next(e);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (typeof email !== 'string' || !emailRe.test(email.trim())) {
      return res.status(400).json({ message: 'A valid email is required' });
    }
    if (typeof password !== 'string' || !password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const row = await User.findOne({ email: normalizedEmail });
    if (!row || !(await bcrypt.compare(password, row.password_hash))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = row.toJSON();
    res.json({ token: sign(user), user });
  } catch (e) { next(e); }
});

module.exports = router;
