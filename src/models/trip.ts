import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

export interface IExpense {
  description: string;
  amount: number;
  expenseId?: string;
}

export interface ILocationLog {
  timestamp: Date;
  latitude: number;
  longitude: number;
  km: number;
}

export enum TripStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Deleted = 'Deleted',
}

export const TripSchemaValidation = z.object({
  origin: z.string(),  //ok
  destination: z.string(), //ok
  vehicle: z.string(), //ok
  driver: z.string(), //ok
  client: z.string(), //ok
  startDate: z.string(), //ok
  endDate: z.string().optional(), //ok
  paymentDueDate: z.string().optional(), //ok
  expenses: z.array(z.object({
    expenseId: z.string(), // UUID único por cada gasto
    description: z.string(),
    amount: z.number(),
  })),
  waybills: z.array(z.string()),
  invoices: z.array(z.string()),
  revenue: z.number(), //ok
  locationLogs: z.array(z.object({
    timestamp: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    km: z.number(),
  })),
  kmTravelled: z.number(), //ok
  status: z.nativeEnum(TripStatus), //ok
  notes: z.string(), //ok
})

export type ITripSchemaValidation = z.infer<typeof TripSchemaValidation>


export interface ITrip extends Document {
  origin: string; // E.g., "Lima/Lima"
  destination: string; // E.g., "Arequipa/Arequipa"
  vehicle: mongoose.Types.ObjectId;
  driver: mongoose.Types.ObjectId;
  client: mongoose.Types.ObjectId;
  startDate: Date;
  endDate?: Date;
  expenses: IExpense[];
  waybills: string[]; // file URLs
  invoices: string[]; // file URLs
  revenue: number;
  locationLogs: ILocationLog[];
  kmTravelled: number;
  status: TripStatus;
  notes: string;
}

const TripSchema: Schema = new Schema({
  origin: String,
  destination: String,
  vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  driver: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
  client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: false },
  expenses: [ {
    description: String,
    amount: Number,
    expenseId: String,
  } ],
  waybills: [ String ],
  invoices: [ String ],
  revenue: { type: Number, default: 0 },
  locationLogs: [ {
    timestamp: Date,
    latitude: Number,
    longitude: Number,
    km: Number
  } ],
  kmTravelled: { type: Number, default: 0 },
  status: {
    type: String,
    enum: Object.values(TripStatus),
    default: TripStatus.Pending
  },
  notes: String,
}, {
  timestamps: true, // this will add both createdAt y updatedAt automatically
});

export default mongoose.models?.Trip || mongoose.model<ITrip>('Trip', TripSchema);
