import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  name: string;
  ruc: string;
  address: string;
  phone: string;
  email?: string;
}

const ClientSchema: Schema = new Schema({
  name: { type: String, required: true },
  ruc: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
});

export default mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);
