import { z } from 'zod';
import mongoose, { Schema, Document, Model } from 'mongoose';

// Schema validation
export const materialValidationSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  quantity: z.number(),
  unit: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
})


export type IMaterialSchema = z.infer<typeof materialValidationSchema>


export interface MaterialModel extends Document {
  name: string;
  quantity: number;
  unit: string;
}
const MaterialSchema: Schema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
}, {
  timestamps: true, // this will add both createdAt y updatedAt automatically
});

let Material = Model<MaterialModel>;

try {
  Material = mongoose.model('Material') as Model<MaterialModel>;
} catch (error) {
  Material = mongoose.model<MaterialModel>('Material', MaterialSchema)
}

export default Material