import { z } from 'zod';
import mongoose, { Document, Schema, Model } from 'mongoose';

// Schema validation
export const providerValidationSchema = z.object({
  _id: z.string(),
  name: z.string().min(1),
  ruc: z.string().min(1),
  alias: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  web: z.string().optional(),
  bankAccounts: z.array(z.object({
    type: z.string().optional(),
    name: z.string(),
    accountNumber: z.string(),
    cci: z.string(),
  })).optional(),
  tags: z.array(z.string()).optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
export type IProviderValidationSchema = z.infer<typeof providerValidationSchema>


// DB model + schema
export interface ProviderModel extends Document {
  name: string;
  ruc: string;
  alias: string;
  address: string;
  phone: string;
  email: string;
  web: string;
  bankAccounts: {
    type: string,
    name: string, //bank name
    accountNumber: string,
    cci: string
  }[];
  tags: string[]
  description: string;
  notes: string;
}

let Provider: Model<ProviderModel>;

try {
  Provider = mongoose.model('Provider') as Model<ProviderModel>;
} catch (e) {
  const providerDBSchema = new Schema({
    name: String,
    ruc: String,
    alias: { type: String, optional: true },
    address: { type: String, optional: true },
    email: { type: String, optional: true },
    web: { type: String, optional: true },
    bankAccounts: [
      {
        type: { type: String, optional: true },
        name: String,
        accountNumber: String,
        cci: String
      }
    ],
    tags: { type: [String], optional: true },
    description: { type: String, optional: true },
    notes: { type: String, optional: true },
  }, {
    timestamps: true, // this will add both createdAt y updatedAt automatically
  });
  Provider = mongoose.model<ProviderModel>('Provider', providerDBSchema);
}

export default Provider;