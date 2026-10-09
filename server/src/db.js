const mongoose = require('mongoose');

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is required');
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
}

module.exports = { connectDB };
