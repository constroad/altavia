import mongoose, { Schema, Document } from 'mongoose';

export interface IDriver extends Document {
  name: string;
  dni: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: Date;
}

const DriverSchema: Schema = new Schema({
  name: { type: String, required: true },
  dni: { type: String, required: true },
  phone: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  licenseExpiry: { type: Date, required: true },
}, {
  timestamps: true
});

DriverSchema.index({ dni: 1, name: 1})

export default mongoose.models.Driver || mongoose.model<IDriver>('Driver', DriverSchema);
