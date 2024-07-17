// models/Attendance.ts
import { z } from 'zod';
import mongoose, { Document, Model, Schema } from 'mongoose';


// Schema validation
export const attendanceValidationSchema = z.object({
  _id: z.string().optional(),
  employeeId: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  name: z.string(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
})

export type IAttendanceValidationSchema = z.infer<typeof attendanceValidationSchema>

export interface AttendanceModel extends Document {
  employeeId: string
  date: Date;
  startTime: string;
  endTime: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

const AttendanceSchema = new Schema({
  employeeId: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String },
  name: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
}, {
  timestamps: true, // this will add both createdAt y updatedAt automatically
});

let Attendance = Model<AttendanceModel>

try {
  Attendance = mongoose.model('Attendance') as Model<AttendanceModel>;
} catch (error) {
  Attendance = mongoose.model<AttendanceModel>('Attendance', AttendanceSchema)
}

export default Attendance
