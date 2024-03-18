import { z } from 'zod';
import mongoose, { Document, Schema, Model } from 'mongoose';
import { Status } from 'src/components';

// Schema validation
export const taskValidationSchema = z.object({
  _id: z.string().optional(),
  date: z.date(),
  reporter: z.string().optional(),
  assignee: z.string().optional(),
  notes: z.array(z.object({
    title: z.string().optional(),
    text: z.string().optional()
  })),
  tasks: z.array(z.object({
    title: z.string().optional(),
    content: z.string().min(1),
    status: z.nativeEnum(Status),
  })),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
export type ITaskValidationSchema = z.infer<typeof taskValidationSchema>


// DB model + schema
export interface TaskModel extends Document {
  date: Date;
  reporter: string;
  assignee: string;
  notes: {
    title: string;
    text: string;
  }[];
  tasks: {
    title: string;
    content: string;
    status: string
  }[];
}

let Task: Model<TaskModel>;

try {
  Task = mongoose.model('Task') as Model<TaskModel>;
} catch (e) {
  const taskDBSchema = new Schema({
    date: { type: Date, required: true },
    reporter: { type: String, optional: true },
    assignee: { type: String, optional: true },
    notes: [{
      title: { type: String, optional: true },
      text: { type: String, optional: true },
    }],
    tasks: [{
      title: { type: String, optional: true },
      content: { type: String, required: true },
      status: { type: String, required: true, enum: Object.values(Status) }, // Uso del enum Status
    }]
  }, {
    timestamps: true, // this will add both createdAt y updatedAt automatically
  });
  Task = mongoose.model<TaskModel>('Task', taskDBSchema);
}

export default Task;