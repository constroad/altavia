import { z } from 'zod';
import mongoose, { Document, Schema, Model } from 'mongoose';
import { Status } from 'src/components';

// Schema validation
export const taskValidationSchema = z.object({
  _id: z.string().optional(),
  date: z.date(),
  reporter: z.string().optional(),
  assignee: z.string().optional(),
  title: z.string().min(1),
  content: z.string().optional(),
  status: z.nativeEnum(Status),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
export type ITaskValidationSchema = z.infer<typeof taskValidationSchema>


// DB model + schema
export interface TaskModel extends Document {
  date: Date;
  reporter?: string;
  assignee?: string;
  title: string;
  content?: string;
  status: Status
}

let Task: Model<TaskModel>;

try {
  Task = mongoose.model('Task') as Model<TaskModel>;
} catch (e) {
  const taskDBSchema = new Schema({
    date: { type: Date, required: true },
    reporter: { type: String, optional: true },
    assignee: { type: String, optional: true },
    title: { type: String, required: true },
    content: { type: String, optional: true },
    status: { type: String, required: true, enum: Object.values(Status) }, // Uso del enum Status
  }, {
    timestamps: true, // this will add both createdAt y updatedAt automatically
  });
  Task = mongoose.model<TaskModel>('Task', taskDBSchema);
}

export default Task;