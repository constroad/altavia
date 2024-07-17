// models/Kardex.ts
import { z } from 'zod';
import mongoose, { Schema, Document, Model } from 'mongoose';

export type KardexType = 'Ingreso' | 'Salida';
// Schema validation
export const kardexValidationSchema = z.object({
  _id: z.string().optional(),
  materialId: z.string(),
  type: z.string(),
  quantity: z.number(),
  value: z.number(),
  date: z.string(),
  description: z.string().optional(),
  unitCost: z.number(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
})

export type IKardexSchema = z.infer<typeof kardexValidationSchema>

export type GETAllKardex = {
  kardex: IKardexSchema[],
  initialValues: {
    quantity: number,
    value: number
  }
}

export interface KardexModel extends Document {
  materialId: string;
  description?: string;
  type: KardexType;
  quantity: number;
  value: number;
  unitCost: number;
  date: Date;
}

const KardexSchema: Schema = new Schema({
  materialId: { type: String, required: true },
  type: { type: String, enum: ['Ingreso', 'Salida'], required: true },
  quantity: { type: Number, required: true },
  value: { type: Number, required: true },
  unitCost: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now }
},
  {
    timestamps: true, // this will add both createdAt y updatedAt automatically
  });


let Kardex = Model<KardexModel>;

try {
  Kardex = mongoose.model('Kardex') as Model<KardexModel>;
} catch (error) {
  Kardex = mongoose.model<KardexModel>('Kardex', KardexSchema)
}

export default Kardex
