import mongoose from 'mongoose';

export async function connectToMongoDB() {
  try {
    const uri = process.env.MONGO_URI ?? '';
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting MongoDB:', error);
  }
}
