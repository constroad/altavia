import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

export interface IExpense {
  description: string;
  amount: number;
  fileUrl?: string;
}

export interface ILocationLog {
  timestamp: Date;
  latitude: number;
  longitude: number;
  km: number;
}

export const TripSchemaValidation = z.object({
  origin: z.string(),
  destination: z.string(),
  vehicle: z.string(),
  driver: z.string(),
  client: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  expenses: z.array(z.object({
    description: z.string(),
    amount: z.number(),
    fileUrl: z.string(),
  })),
  waybills: z.array(z.string()),
  invoices: z.array(z.string()),
  revenue: z.number(),
  locationLogs: z.array(z.object({
    timestamp: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    km: z.number(),
  })),
  kmTravelled: z.number(),
  status: z.string()
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
  status: 'open' | 'closed';
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
    fileUrl: String,
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
  status: { type: String, enum: [ 'open', 'closed' ], default: 'open' }
}, {
  timestamps: true, // this will add both createdAt y updatedAt automatically
});

export default mongoose.models?.Trip || mongoose.model<ITrip>('Trip', TripSchema);
