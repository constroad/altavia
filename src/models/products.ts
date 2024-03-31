import { z } from 'zod';
import mongoose, { Document, Schema, Model } from 'mongoose';

// Schema validation
export const productValidationSchema = z.object({
  _id: z.string().optional(),
  description: z.string().min(1),
  alias: z.string().optional(),
  unit: z.string(),
  unitPrice: z.number(),
  quantity: z.number(),
  total: z.number(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
export type IProductValidationSchema = z.infer<typeof productValidationSchema>


// DB model + schema
export interface ProductModel extends Document {
  description: string;
  alias: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

let Product: Model<ProductModel>;

try {
  Product = mongoose.model('Product') as Model<ProductModel>;
} catch (e) {
  const productDBSchema = new Schema({
    description: { type: String, required: true },
    alias: { type: String, optional: true },
    unit: { type: String, optional: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
  }, {
    timestamps: true, // this will add both createdAt y updatedAt automatically
  });
  Product = mongoose.model<ProductModel>('Product', productDBSchema);
}

export default Product;