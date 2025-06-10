import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicle extends Document {
  plate: string;
  brand: string;
  modelVehicle: string;
  year: number;
  soatExpiry: Date;
  inspectionExpiry: Date;
  maintenanceLogs: { date: Date; description: string; }[];
  km: number;
}

const VehicleSchema: Schema = new Schema({
  plate: { type: String, required: true, unique: true },
  brand: String,
  modelVehicle: String,
  year: Number,
  soatExpiry: Date,
  inspectionExpiry: Date,
  maintenanceLogs: [{ date: Date, description: String }],
  km: { type: Number, default: 0 }
});

export default mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', VehicleSchema);
