import { z } from 'zod';
import mongoose, { Document, Schema, Model } from 'mongoose';

// Schema validation
export const quoteValidationSchema = z.object({
  _id: z.string().optional(),
  client: z.string().min(1),
  description: z.string().min(1),
  quantity: z.number(),
  price: z.number(),
  total: z.number(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
export type IQuoteValidationSchema = z.infer<typeof quoteValidationSchema>


// DB model + schema
export interface QuoteModel extends Document {
  client: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

let Quote: Model<QuoteModel>;

try {
  Quote = mongoose.model('Quote') as Model<QuoteModel>;
} catch (e) {
  const quoteDBSchema = new Schema({
    client: { type: String, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
  }, {
    timestamps: true, // Esto agregará automáticamente campos createdAt y updatedAt
  });
  Quote = mongoose.model<QuoteModel>('Quote', quoteDBSchema);
}

export default Quote;