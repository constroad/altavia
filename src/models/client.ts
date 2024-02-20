import { z } from 'zod';
import mongoose, { Document, Schema, Model } from 'mongoose';

// Schema validation
export const clientValidationSchema = z.object({
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
    name: z.string(), //bank name
    accountNumber: z.string(),
    cci: z.string(),
  })).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
export type IClientValidationSchema = z.infer<typeof clientValidationSchema>


// DB model + schema
export interface ClientModel extends Document {
  name: string;
  ruc: string;
  alias: string;
  address: string;
  phone: string;
  email: string;
  web: string;
  bankAccounts: {
    type: string,
    name: string,
    accountNumber: string,
    cci: string
  }[];
}

let Client: Model<ClientModel>;

try {
  Client = mongoose.model('Client') as Model<ClientModel>;
} catch (e) {
  const clientDBSchema = new Schema({
    name: String,
    ruc: String,
    alias: { type: String, optional: true },
    address: { type: String, optional: true },
    phone: { type: String, optional: true },
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
  }, {
    timestamps: true, // this will add both createdAt y updatedAt automatically
  });
  Client = mongoose.model<ClientModel>('Client', clientDBSchema);
}

export default Client;