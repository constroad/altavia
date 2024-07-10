import { z } from 'zod';
import mongoose, { Document, Schema, Model } from 'mongoose';

// Schema validation
export const dispatchValidationSchema = z.object({
  _id: z.string().optional(),
  orderId: z.string().optional(),
  date: z.date(),
  hour: z.string().optional(),
  transportId: z.string(),
  clientId: z.string(),
  description: z.string().min(1),
  guia: z.string().optional(),
  obra: z.string().optional(),
  driverName: z.string().optional(),
  driverCard: z.string().optional(),
  quantity: z.number(),
  planedQuantity: z.number().optional(),
  note: z.string().optional(),
  nroVale: z.string().optional(),
  phoneNumber: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),  
});
export type IDispatchValidationSchema = z.infer<typeof dispatchValidationSchema>
export interface IDispatchList extends IDispatchValidationSchema {
  order: string;
  client: string;
  clientRuc: string;
  company: string;
  driverName: string;
  plate: string;
  status?: "New" | "Edit" | "Delete" | undefined;
  key: string; // this is only for re-render row in table
}

// DB model + schema
export interface DispatchModel extends Document {
  orderId?: string;
  date: Date;
  hour?: string;
  transportId: string;
  clientId: string;
  description: string;
  guia: string;
  obra: string;
  driverName: string;
  driverCard: string;
  quantity: number;
  planedQuantity?: number;
  note?: string;
  nroVale?: string;
  phoneNumber?: string;
}

export interface IGetAll {
  dispatchs: IDispatchList[],
  summary: {
    nroRecords: number,
    m3: number,
    total: number
  },
  pagination: {
    page: number,
    limit: number,
    totalPages: number
  }
}

let Dispatch: Model<DispatchModel>;

try {
  Dispatch = mongoose.model('Dispatch') as Model<DispatchModel>;
} catch (e) {
  const dispatchDBSchema = new Schema({
    orderId: { type: String, optional: true },
    date: { type: Date, required: true },
    hour: { type: String, optional: true },
    transportId: { type: String, optional: false },
    clientId: { type: String, optional: false },
    description: { type: String, optional: false },
    guia: { type: String, optional: false },
    obra: { type: String, optional: false },
    driverName: { type: String, optional: false },
    driverCard: { type: String, optional: false },
    quantity: { type: Number, optional: false },
    planedQuantity: { type: Number, optional: true },
    note: { type: String, optional: true },
    nroVale: { type: String, optional: true },
    phoneNumber: { type: String, optional: true },
  }, {
    timestamps: true, // this will add both createdAt y updatedAt automatically
  });
  Dispatch = mongoose.model<DispatchModel>('Dispatch', dispatchDBSchema);
}

export default Dispatch;
