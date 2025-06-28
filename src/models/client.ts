import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  name: string;
  ruc?: string;
  address?: string;
  phone?: string;
  email?: string;
}

const ClientSchema: Schema = new Schema({
  name: { type: String, required: true },
  ruc: { type: String, required: false },
  address: { type: String, required: false },
  phone: { type: String, required: false },
  email: { type: String, required: false },
});

ClientSchema.index({ ruc: 1, name: 1 })

export default mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);
