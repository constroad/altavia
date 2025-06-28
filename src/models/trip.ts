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
  InProgress = 'InProgress',
  Completed = 'Completed',
  Deleted = 'Deleted',
}

export const TripSchemaValidation = z.object({
  _id: z.string().optional(),
  origin: z.string(),
  destination: z.string(),
  vehicle: z.array(z.string()),
  driver: z.array(z.string()), 
  client: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  paymentDueDate: z.string().optional(),
  waybills: z.array(z.string()).optional(),
  invoices: z.array(z.string()).optional(),
  revenue: z.number().optional(),
  locationLogs: z.array(z.object({
    timestamp: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    km: z.number(),
  })).optional(),
  kmTravelled: z.number().optional(),
  status: z.nativeEnum(TripStatus).optional(),
  notes: z.string().optional(),
});

export type ITripSchemaValidation = z.infer<typeof TripSchemaValidation>;

export interface ITrip extends Document {
  origin: string;
  destination: string;
  vehicle: mongoose.Types.ObjectId[];
  driver: mongoose.Types.ObjectId[];
  client: mongoose.Types.ObjectId;
  startDate: Date;
  endDate?: Date;
  waybills?: string[];
  invoices?: string[];
  revenue?: number;
  locationLogs?: ILocationLog[];
  kmTravelled?: number;
  status?: TripStatus;
  notes?: string;
}

const TripSchema: Schema = new Schema({
  origin: String,
  destination: String,
  vehicle: [{ type: Schema.Types.ObjectId, ref: 'Vehicle', required: true }],
  driver: [{ type: Schema.Types.ObjectId, ref: 'Driver', required: true }],  
  client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: false },
  waybills: [String],
  invoices: [String],
  revenue: { type: Number, default: 0 },
  locationLogs: [{
    timestamp: Date,
    latitude: Number,
    longitude: Number,
    km: Number
  }],
  kmTravelled: { type: Number, default: 0 },
  status: {
    type: String,
    enum: Object.values(TripStatus),
    default: TripStatus.Pending
  },
  notes: { type: String, required: false },
}, {
  timestamps: true,
});

TripSchema.index({ origin: 1, destination: 1, driver: 1, startDate: 1, endDate: 1 });

export default mongoose.models?.Trip || mongoose.model<ITrip>('Trip', TripSchema);
