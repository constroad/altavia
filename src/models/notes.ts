import { z } from 'zod';
import mongoose, { Document, Schema, Model } from 'mongoose';

// Schema validation
export const noteValidationSchema = z.object({
  _id: z.string().optional(),
  date: z.date(),
  reporter: z.string().optional(),
  title: z.string().min(1),
  text: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
export type INoteValidationSchema = z.infer<typeof noteValidationSchema>


// DB model + schema
export interface NoteModel extends Document {
  date: Date;
  reporter: string;
  title: string;
  text: string;
}

let Note: Model<NoteModel>;

try {
  Note = mongoose.model('Note') as Model<NoteModel>;
} catch (e) {
  const noteDBSchema = new Schema({
    date: { type: Date, required: true },
    reporter: { type: String, optional: true },
    title: { type: String, required: true },
    text: { type: String, optional: true },
  }, {
    timestamps: true, // this will add both createdAt y updatedAt automatically
  });
  Note = mongoose.model<NoteModel>('Note', noteDBSchema);
}

export default Note;