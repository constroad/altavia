import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicle extends Document {
  plate: string;
  brand?: string;
  modelVehicle?: string;
  year: number;
  soatExpiry?: Date;
  inspectionExpiry?: Date;
  maintenanceLogs?: { date: Date; description: string; }[];
  km?: number;
}

const VehicleSchema: Schema = new Schema({
  plate: { type: String, required: true, unique: true },
  brand: { type: String, required: false },
  modelVehicle: { type: String, required: false },
  year: { type: Number, required: false },
  soatExpiry: { type: Date, required: false },
  inspectionExpiry: { type: Date, required: false },
  maintenanceLogs: [
    {
      date: { type: Date, required: false },
      description: { type: String, required: false }
    }
  ],
  km: { type: Number, default: 0 }
}, {
  timestamps: true
});

VehicleSchema.index({ plate: 1, brand: 1 });

export default mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', VehicleSchema);
