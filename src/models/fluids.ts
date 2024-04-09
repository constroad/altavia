import { z } from 'zod';
import mongoose, { Document, Schema, Model } from 'mongoose';

// Schema validation
export const fluidValidationSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  unit: z.string().optional(),//gallons/liters
  volume: z.number(),
  volumeInStock: z.number(),
  levelCentimeter: z.number(),
  tableReference: z.string(),
  bgColor: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
export type IFluidValidationSchema = z.infer<typeof fluidValidationSchema>


// DB model + schema
export interface FluidModel extends Document {
  name: string;
  description: string;
  tableReference: string;
  unit?: string;
  volume: number;
  volumeInStock: number;
  levelCentimeter: number;
  bgColor?: number;
}

let Fluid: Model<FluidModel>;

try {
  Fluid = mongoose.model('Fluid') as Model<FluidModel>;
} catch (e) {
  const fluidDBSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, optional: true },
    tableReference: { type: String, required: true },
    unit: { type: String, optional: true },
    volume: { type: Number, required: true },
    volumeInStock: { type: Number, required: true },
    levelCentimeter: { type: Number, required: true },
    bgColor: { type: String, optional: true },
  }, {
    timestamps: true, // this will add both createdAt y updatedAt automatically
  });
  Fluid = mongoose.model<FluidModel>('Fluid', fluidDBSchema);
}

export default Fluid;