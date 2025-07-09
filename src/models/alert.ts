import mongoose, { Document, Schema } from 'mongoose';
import { z } from 'zod';

export const alertTypes = ["vehicle", "driver", "company", "employee"] as const;
export type AlertType = (typeof alertTypes)[number];

export const alertStatus = ["Pending", "Expired", "Completed"] as const;
export type AlertStatus = (typeof alertStatus)[number];

export const alertSchemaValidation = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  dueDate: z.string(),
  type: z.enum(alertTypes),
  status: z.enum(alertStatus),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type IAlertSchemaValidation = z.infer<typeof alertSchemaValidation>;

export interface IAlert extends Document {
  name: string;
  dueDate: Date;
  type: AlertType;
  status: AlertStatus;
  description?: string;
}

const AlertSchema = new Schema<IAlert>({
  name: { type: String, required: true },
  dueDate: { type: Date, required: true },
  type: { type: String, enum: alertTypes, required: true },
  status: { type: String, enum: alertStatus, default: "Pending" },
  description: { type: String },
}, {
  timestamps: true,
});

AlertSchema.index({ name: 1, type: 1 });

export default mongoose.models?.Alert || mongoose.model<IAlert>('Alert', AlertSchema);
