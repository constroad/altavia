import mongoose, { Schema, Document } from 'mongoose';

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
  endDate: Date,
  expenses: [{
    description: String,
    amount: Number,
    fileUrl: String,
  }],
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
  status: { type: String, enum: ['open', 'closed'], default: 'open' }
});

export default mongoose.models.Trip || mongoose.model<ITrip>('Trip', TripSchema);
