import mongoose from 'mongoose';

let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}


export async function connectToMongoDB() {
  if (cached.conn) {
    return
  }

  try {    
    const dbName = process.env.NODE_ENV === 'production' ? 'altavia' : 'test'    
    // const dbName = 'altavia'
    // console.log('dbName::', dbName)
    if (!cached.promise) {
      const uri = process.env.MONGO_URI ?? '';
      cached.promise = mongoose.connect(uri, {
        dbName
      });
      cached.conn = await cached.promise
      console.log('✅ MongoDB connected:', dbName);
    }
  } catch (error) {
    console.error('Error connecting MongoDB:', error);
  }
}
