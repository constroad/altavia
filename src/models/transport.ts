import { z } from 'zod';
import mongoose, { Document, Schema, Model } from 'mongoose';

// Schema validation
export const transportValidationSchema = z.object({
  _id: z.string().optional(),
  company: z.string().min(1),
  plate: z.string().min(1),
  driverName: z.string().optional(),
  driverCard: z.string().optional(),
  phone: z.string().optional(),
  m3: z.number().optional(),
  notes: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
export type ITransportValidationSchema = z.infer<typeof transportValidationSchema>


// DB model + schema
export interface TransportModel extends Document {
  company: string;
  plate: string;
  driverName?: string;
  driverCard?: string;
  phone?: string;
}

let Transport: Model<TransportModel>;

try {
  Transport = mongoose.model('Transport') as Model<TransportModel>;
} catch (e) {
  const transportDBSchema = new Schema({
    company: { type: String, optional: false },
    plate: { type: String, optional: false },
    driverName: { type: String, optional: true },
    driverCard: { type: String, optional: true },
    phone: { type: String, optional: true },
    m3: { type: Number, optional: true },
    notes: { type: String, optional: true },
  }, {
    timestamps: true, // this will add both createdAt y updatedAt automatically
  });
  Transport = mongoose.model<TransportModel>('Transport', transportDBSchema);
}

export default Transport;