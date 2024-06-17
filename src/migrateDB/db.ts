const mongoose = require('mongoose');

async function connectToDB() {
  try {
    const uri = process.env.MONGO_URI ?? 'mongodb://localhost:27017/constroad?replicaSet=rs0&retryWrites=false';
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting MongoDB:', error);
  }
}

module.exports = connectToDB

