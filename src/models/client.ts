import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

export const clientSchemaValidation = z.object({
  _id: z.string().optional(),
  name: z.string().min(1),
  ruc: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Correo inválido').optional(),
  notifications: z.object({
    whatsAppAlerts: z.array(z.string()).optional(), //tracking
    whatsAppManagement: z.array(z.string()).optional(), // pagos, facturas, guias
  }).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type IClientSchemaValidation = z.infer<typeof clientSchemaValidation>;

export interface IClient extends Document {
  name: string;
  ruc?: string;
  address?: string;
  phone?: string;
  email?: string;
  notifications?: {
    whatsAppAlerts?: string[],
    whatsAppManagement?: string[],
  }
}

//Esquema de mongoose
const ClientSchema: Schema = new Schema({
  name: { type: String, required: true },
  ruc: { type: String, required: false },
  address: { type: String, required: false },
  phone: { type: String, required: false },
  email: {
    type: String,
    validate: {
      validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: (props: { value: string }) => `${props.value} no es un email válido.`,
    },
    required: false,
  },
  notifications: {
    whatsAppAlerts: { type: [String], required: false }, // whatsAppAlerts
    whatsAppManagement: { type: [String], required: false }, //payments, invoices
  },
}, {
  timestamps: true
});

ClientSchema.index({ ruc: 1, name: 1 })

export default (mongoose.models?.Client as mongoose.Model<IClient>) || mongoose.model<IClient>('Client', ClientSchema);

