import { z } from 'zod';
import mongoose, { Document, Schema, Model } from 'mongoose';

// Schema validation
export const productValidationSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  alias: z.string().optional(),
  price: z.number(),
  quantity: z.number(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
export type IProductValidationSchema = z.infer<typeof productValidationSchema>


// DB model + schema
export interface ProductModel extends Document {
  name: string;
  description: string;
  alias: string;
  price: number;
  quantity: number;
}

let Product: Model<ProductModel>;

try {
  Product = mongoose.model('Product') as Model<ProductModel>;
} catch (e) {
  const productDBSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, optional: true },
    alias: { type: String, optional: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  }, {
    timestamps: true, // this will add both createdAt y updatedAt automatically
  });
  Product = mongoose.model<ProductModel>('Product', productDBSchema);
}

export default Product;