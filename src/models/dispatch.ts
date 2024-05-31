import { z } from 'zod';
import mongoose, { Document, Schema, Model } from 'mongoose';

// Schema validation
export const dispatchValidationSchema = z.object({
  _id: z.string().optional(),
  orderId: z.string().optional(),
  date: z.string().min(1),
  transportId: z.string().min(1),
  clientId: z.string().min(1),
  invoice: z.string().optional(),
  description: z.string().min(1),
  guia: z.string().optional(),
  obra: z.string().optional(),
  quantity: z.number(),
  price: z.number(),
  igv: z.number().optional(),
  subTotal: z.number(),
  total: z.number(),
  note: z.string().optional(),
  nroVale: z.string().optional(),
  phoneNumberToSend: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),  
});
export type IDispatchValidationSchema = z.infer<typeof dispatchValidationSchema>

// DB model + schema
export interface DispatchModel extends Document {
  orderId?: string;
  date: string;
  transportId: string;
  clientId: string;
  invoice?: string;
  description: string;
  guia: string;
  obra: string;
  quantity: number;
  price: number;
  igv?: number;
  subTotal: number;
  total: number;
  note?: string;
  nroVale?: string;
  phoneNumberToSend?: string;
}

let Dispatch: Model<DispatchModel>;

try {
  Dispatch = mongoose.model('Dispatch') as Model<DispatchModel>;
} catch (e) {
  const dispatchDBSchema = new Schema({
    orderId: { type: String, optional: true },
    date: { type: String, optional: false },
    transportId: { type: String, optional: false },
    clientId: { type: String, optional: false },
    invoice: { type: String, optional: true },
    description: { type: String, optional: false },
    guia: { type: String, optional: false },
    obra: { type: String, optional: false },
    quantity: { type: Number, optional: false },
    price: { type: Number, optional: false },
    igv: { type: Number, optional: true },
    subTotal: { type: Number, optional: false },
    total: { type: Number, optional: false },
    note: { type: String, optional: true },
    nroVale: { type: String, optional: true },
    phoneNumberToSend: { type: String, optional: true },
  }, {
    timestamps: true, // this will add both createdAt y updatedAt automatically
  });
  Dispatch = mongoose.model<DispatchModel>('Dispatch', dispatchDBSchema);
}

export default Dispatch;