import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

export const vehicleSchemaValidation = z.object({
  _id: z.string().optional(),
  plate: z.string().min(1),
  brand: z.string().optional(),
  modelVehicle: z.string().optional(),
  tuce: z.string().optional(),
  year: z.number().min(1900).max(new Date().getFullYear()),
  soatExpiry: z.coerce.date().optional(),
  inspectionExpiry: z.coerce.date().optional(),
  maintenanceLogs: z.array(
    z.object({
      date: z.coerce.date(),
      description: z.string().optional(),
    })
  ).optional(),
  km: z.number().min(0).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type IVehicleSchemaValidation = z.infer<typeof vehicleSchemaValidation>;

export interface IVehicle extends Document {
  plate: string;
  brand?: string;
  modelVehicle?: string;
  tuce?: string;
  year: number;
  soatExpiry?: Date;
  inspectionExpiry?: Date;
  maintenanceLogs?: { date: Date; description?: string }[];
  km?: number;
}

const VehicleSchema: Schema = new Schema({
  plate: { type: String, required: true, unique: true },
  brand: { type: String, required: false },
  modelVehicle: { type: String, required: false },
  tuce: { type: String, required: false },
  year: { type: Number, required: true },
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

export default (mongoose.models?.Vehicle as mongoose.Model<IVehicle>) || mongoose.model<IVehicle>('Vehicle', VehicleSchema);

