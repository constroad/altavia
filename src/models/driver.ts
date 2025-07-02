import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

export const driverSchemaValidation = z.object({
  _id: z.string().optional(),
  name: z.string().min(1),
  dni: z.string().min(8, "El DNI debe tener exactamente 8 dígitos"),
  phone: z.string().min(9, "El teléfono debe tener exactamente 9 dígitos"),
  licenseNumber: z.string().min(1),
  licenseExpiry: z.coerce.date(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type IDriverSchemaValidation = z.infer<typeof driverSchemaValidation>;

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

const DriverModel = mongoose.models?.Driver as mongoose.Model<IDriver> || mongoose.model<IDriver>('Driver', DriverSchema);
export default DriverModel;
