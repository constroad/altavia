import { z } from 'zod';
import mongoose, { Document, Schema, Model } from 'mongoose';

// Schema validation
export const serviceValidationSchema = z.object({
  _id: z.string().optional(),
  description: z.string().min(1),
  alias: z.string().optional(),
  phase: z.string().optional(),
  inches: z.number().optional(),
  flete: z.number().optional(),
  unit: z.string(),
  unitPrice: z.number(),
  quantity: z.number(),
  total: z.number(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
export type IServiceValidationSchema = z.infer<typeof serviceValidationSchema>


// DB model + schema
export interface ServiceModel extends Document {
  description: string;
  alias: string;
  phase: string;
  inches: number;
  flete: number;
  unit: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

let Service: Model<ServiceModel>;

try {
  Service = mongoose.model('Service') as Model<ServiceModel>;
} catch (e) {
  const serviceDBSchema = new Schema({
    description: { type: String, required: true },
    alias: { type: String, optional: true },
    phase: { type: String, optional: true },
    inches: { type: Number, optional: true },
    flete: { type: Number, optional: true },
    unit: { type: String, optional: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
  }, {
    timestamps: true, // this will add both createdAt y updatedAt automatically
  });
  Service = mongoose.model<ServiceModel>('Service', serviceDBSchema);
}

export default Service;