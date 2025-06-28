// models/Media.ts
import { z } from 'zod';
import mongoose, { Document, Schema } from 'mongoose';

export type MediaType =
  'ROUTE_TRACKING' |
  'TRIP_EXPENSE' |
  'TRIP_WAYBILL' |
  'TRIP_INVOICE' |
  'ORDER_PAYMENT' |  
  'DISPATCH_PICTURES' |
  'EMPLOYEE_AVATAR'

export type MediaStatus = 'ACTIVE'| 'DELETE_REQUESTED' | 'DELETED'

// Schema validation
export const mediaValidationSchema = z.object({
  _id: z.string().optional(),
  resourceId: z.string(),
  type: z.string(),
  name: z.string(),
  mimeTye: z.string(),
  url: z.string(),
  thumbnailUrl: z.string(),
  date: z.string(),
  metadata: z.any().optional(),
  isClientVisible: z.boolean().default(false),
  status: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type IMediaValidationSchema = z.infer<typeof mediaValidationSchema>

export interface IMedia extends Document {
  resourceId: string
  type: string
  name: string;
  mimeTye: string;
  url: string;
  thumbnailUrl: string;
  date: Date;
  metadata?: Object;
  isClientVisible?: boolean;
  status?: string;
}

const MediaSchema = new Schema({
  resourceId: { type: String, required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  mimeTye: { type: String, required: true },
  date: { type: Date, required: true },
  url: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  metadata: { type: Object, required: false },
  isClientVisible: { type: Boolean, required: false, default: false },
  status: { type: String, required: false, default: 'ACTIVE' },
}, {
  timestamps: true, // this will add both createdAt y updatedAt automatically
});

MediaSchema.index({ resourceId: 1, type: 1})

export default mongoose.models?.Media || mongoose.model<IMedia>('Media', MediaSchema)
