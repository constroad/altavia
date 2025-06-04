import { MongoClient } from 'mongodb'

const uri = process.env.MONGO_URI!
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!process.env.MONGO_URI) {
  throw new Error('Please add your MONGO_URI to .env')
}

if (process.env.NODE_ENV === 'development') {
  // Usa una variable global para no crear múltiples conexiones en dev
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options)
    ;(global as any)._mongoClientPromise = client.connect()
  }
  clientPromise = (global as any)._mongoClientPromise
} else {
  // En producción, simplemente conecta una vez
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise
