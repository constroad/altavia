// src/lib/db.ts
import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI) {
  throw new Error('❌ Falta definir MONGO_URI en las variables de entorno')
}

let isConnected = false

export const connectToDatabase = async (): Promise<void> => {
  if (isConnected) {
    return
  }

  try {
    const db = await mongoose.connect(MONGO_URI, {
      dbName: process.env.NODE_ENV === 'production' ? 'altavia' : 'local',
    })
    isConnected = true
    console.log('✅ MongoDB conectado a', db.connection.name)
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error)
    throw new Error('No se pudo conectar a la base de datos')
  }
}
