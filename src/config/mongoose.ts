import mongoose from 'mongoose';

const uri = process.env.MONGO_URI ?? '';

if (!uri) {
  throw new Error('❌ Falta definir MONGO_URI en las variables de entorno');
}

// ⚠️ En entornos serverless (ej. Vercel), mongoose mantiene el estado de conexión en múltiples ejecuciones
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToMongoDB(): Promise<void> {
  if (cached.conn) {
    return;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      dbName: process.env.NODE_ENV === 'production' ? 'altavia' : 'test',
      // dbName: 'altavia',
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ MongoDB conectado a', cached.conn.connection.name);
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error);
    throw new Error('No se pudo conectar a la base de datos');
  }
}
