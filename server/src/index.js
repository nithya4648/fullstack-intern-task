require('dotenv').config();
if (!process.env.JWT_SECRET) process.env.JWT_SECRET = 'dev_secret_change_me';

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');
const seed = require('./seed');

const app = express();

const defaultOrigins = [
  'https://client-mu-khaki-63.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

const parseOrigins = (val) =>
  val ? val.split(',').map((o) => o.trim()).filter(Boolean) : [];

const clientUrlOrigins = parseOrigins(process.env.CLIENT_URL);
const clientOriginOrigins = parseOrigins(process.env.CLIENT_ORIGIN);

const allowedOrigins = Array.from(
  new Set([...clientUrlOrigins, ...clientOriginOrigins, ...defaultOrigins])
);

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'ok' }));
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

connectDB()
  .then(seed)
  .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
  .catch((e) => { console.error(e); process.exit(1); });
