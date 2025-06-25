// models/GeneralExpense.ts
import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

export const EXPENSE_TYPES = ['service', 'spare_part', 'driver_payment'] as const;
export type EXPENSE_TYPE = typeof EXPENSE_TYPES[number]; 

export const expenseValidationSchema = z.object({
  _id: z.string().optional(),
  description: z.string(),
  amount: z.number(),
  type: z.enum(EXPENSE_TYPES),
  date: z.coerce.date(),
  note: z.string().optional(),
  // date: z.string(),
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
  date: Date;
}

const GeneralExpenseSchema: Schema = new Schema({
  description: { type: String, required: true },
  note: { type: String, required: false },
  amount: { type: Number, required: true },
  type: { type: String, enum: EXPENSE_TYPES, required: true },
  date: { type: Date, required: true }
}, {
  timestamps: true
});

export default mongoose.models?.GeneralExpense || mongoose.model<IGeneralExpense>('GeneralExpense', GeneralExpenseSchema);
