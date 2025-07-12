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

export interface IPayment {
  date: string;
  amount: number;
  note?: string;
}

export interface IItems {
  code: string;
  product: string;
  unit: string;
  amount: string;
  weight: string;
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
  Income: z.number(),
  amountDue: z.number().optional(),//monto debe
  revenue: z.number().optional(),
  locationLogs: z.array(z.object({
    timestamp: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    km: z.number(),
  })).optional(),
  notifications: z.object({
    notifyDestination: z.array(z.string()).optional(), //tracking    
  }).optional(),
  kmTravelled: z.number().optional(),
  status: z.nativeEnum(TripStatus).optional(),
  notes: z.string().optional(),
  destinationContact: z.object({
    name: z.string(),
    phone: z.string(),
  }).optional(),
  mapsUrl: z.string().optional(),
  payments: z.array(z.object({
    date: z.string(),
    amount: z.number(),
    note: z.string().optional(),
  })).optional(),
  items: z.array(z.object({
    _id: z.string().optional(),
    code: z.string(),
    product: z.string(),
    unit: z.string(),
    amount: z.string(),
    weight: z.string(),
  })).optional(),
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
  paymentDueDate?: Date;
  waybills?: string[];
  invoices?: string[];
  Income?: number; //ingreso
  amountDue?: number;
  revenue?: number; //ganancia
  locationLogs?: ILocationLog[];
  kmTravelled?: number;
  status?: TripStatus;
  notes?: string;
  notifications?: {
    notifyDestination?: string[],
  };
  destinationContact?: {
    name: string;
    phone: string;
  };
  mapsUrl?: string;
  payments?: IPayment[];
  items?: IItems[];
}

const TripSchema: Schema = new Schema({
  origin: String,
  destination: String,
  vehicle: [{ type: Schema.Types.ObjectId, ref: 'Vehicle', required: true }],
  driver: [{ type: Schema.Types.ObjectId, ref: 'Driver', required: true }],  
  client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: false },
  paymentDueDate: { type: Date, required: false },
  waybills: [String],
  invoices: [String],
  Income: { type: Number, default: 0 },
  amountDue: { type: Number, default: 0 },
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
  notifications: {
    notifyDestination: { type: [String], required: false },    
  },
  destinationContact: {
    name: { type: String },
    phone: { type: String },
  },
  mapsUrl: { type: String },
  payments: [{
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    note: { type: String }
  }],
  items: [{
    code: { type: String, required: false },
    product: { type: String, required: false },
    unit: { type: String, required: false },
    amount: { type: String, required: false },
    weight: { type: String, required: false },
  }],
}, {
  timestamps: true,
});

TripSchema.index({ origin: 1, destination: 1, driver: 1, startDate: 1, endDate: 1 });

export default mongoose.models?.Trip || mongoose.model<ITrip>('Trip', TripSchema);
