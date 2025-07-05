// models/RouteCost.ts
import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

export type RouteCostType = 'toll' | 'scale' | 'fuel' | 'other';

export const routeCostSchemaValidation = z.object({
  _id: z.string().optional(),
  origin: z.string(),
  destination: z.string(),
  route: z.string(),
  type: z.string(),
  description: z.string(),
  amount: z.number(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})


export type IRouteCostSchemaValidation = z.infer<typeof routeCostSchemaValidation>;

export interface IRouteCost extends Document {
  origin: string;
  destination: string;
  route: string;
  type: RouteCostType;
  description?: string;
  amount: number;
}

const RouteCostSchema = new Schema<IRouteCost>({
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  route: { type: String, required: true },
  type: { type: String, enum: ['toll', 'scale', 'fuel', 'other'], required: true },
  description: { type: String },
  amount: { type: Number, required: true },
}, {
  timestamps: true,
});

RouteCostSchema.index({ origin: 1, destination: 1, type: 1 });

export default mongoose.models?.RouteCost || mongoose.model<IRouteCost>('RouteCost', RouteCostSchema);
