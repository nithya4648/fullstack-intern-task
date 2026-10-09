require('dotenv').config();
if (!process.env.JWT_SECRET) process.env.JWT_SECRET = 'dev_secret_change_me';

const express = require('express');
const cors = require('cors');
const { init } = require('./db');
const seed = require('./seed');

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',') : true }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/templates', require('./routes/templates'));
app.use('/api/favorites', require('./routes/favorites'));

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
init()
  .then(seed)
  .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
  .catch((e) => { console.error(e); process.exit(1); });
