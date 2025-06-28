// models/GeneralExpense.ts
import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

export const EXPENSE_TYPES_MAP = {
  '': 'Todos',
  service: 'Service',
  spare_part: 'Repuesto',
  driver_payment: 'Pago a Chofer',
  trip: 'Viajes',
  
}
export const EXPENSE_STATUS_MAP = {
  '': 'Todos',
  active: 'Activo',
  to_pay: 'Por Pagar',
  deleted: 'Eliminado',
}

export const EXPENSE_TYPES = ['service', 'spare_part', 'driver_payment', 'trip'] as const;
export type EXPENSE_TYPE = typeof EXPENSE_TYPES[number]; 

export const EXPENSE_STATUS = ['active', 'to_pay', 'deleted'] as const;
export type EXPENSE_STATUS_TYPE = typeof EXPENSE_STATUS[number];

export const expenseValidationSchema = z.object({
  _id: z.string().optional(),
  description: z.string(),
  amount: z.number(),
  type: z.enum(EXPENSE_TYPES),
  status: z.enum(EXPENSE_STATUS).default('active'),
  date: z.coerce.date(),
  note: z.string().optional(),
  tripId: z.string().optional(),
   //auditoria
   createdAt: z.string().optional(),
   updatedAt: z.string().optional()
})

export type IExpenseSchema = z.infer<typeof expenseValidationSchema>

export interface IGeneralExpense extends Document {
  description: string;
  note?: string;
  amount: number;
  type: EXPENSE_TYPE;
  status: EXPENSE_STATUS_TYPE;
  date: Date;
  tripId?: mongoose.Types.ObjectId;
}

const GeneralExpenseSchema: Schema = new Schema({
  description: { type: String, required: true },
  note: { type: String, required: false },
  amount: { type: Number, required: true },
  type: { type: String, enum: EXPENSE_TYPES, required: true },
  status: { type: String, enum: EXPENSE_STATUS, default: 'pending' },
  date: { type: Date, required: true },
  tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: false }, 
}, {
  timestamps: true
});

// Add index for efficient querying
GeneralExpenseSchema.index({ date: 1, status: 1, type: 1 });
GeneralExpenseSchema.index({ tripId: 1 });

export default mongoose.models?.GeneralExpense || mongoose.model<IGeneralExpense>('GeneralExpense', GeneralExpenseSchema);
