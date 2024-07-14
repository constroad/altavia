// models/Attendance.ts
import { z } from 'zod';
import mongoose, { Document, Model, Schema } from 'mongoose';


// Schema validation
export const employeeValidationSchema = z.object({
  _id: z.string().optional(),
  // name: z.string(),
  // lastName: z.string(),
  // country: z.string(),
  // DOI: z.string(),
  // sex: z.string(),
  // birthday: z.string(),
  // coin: z.string(),
  // salary: z.number(),
  // civilStatus: z.string(),
  // place: z.string(),
  name: z.string().min(1, { message: "Name is required" }),
  lastName: z.string().min(1, { message: "Last Name is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  DOI: z.string().min(1, { message: "DOI is required" }),
  sex: z.string().min(1, { message: "Sex is required" }),
  birthday: z.string().min(1, { message: "Birthday is required" }),
  coin: z.string().min(1, { message: "Coin is required" }),
  salary: z.number().min(0, { message: "Salary must be a positive number" }),
  civilStatus: z.string().min(1, { message: "Civil Status is required" }),
  place: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
})

export type IEmployeeValidationSchema = z.infer<typeof employeeValidationSchema>

export interface EmployeeModel extends Document {
  name: string;
  lastName: string
  country: string
  DOI: string
  sex: string
  birthday: Date;
  coin: string;
  salary: number;
  civilStatus: string;
  place?: string;
}

const EmployeeSchema = new Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  country: { type: String, required: true },
  DOI: { type: String, required: true },
  sex: { type: String, required: true },
  birthday: { type: Date, required: true },
  coin: { type: String, required: true },
  salary: { type: Number, required: true },
  civilStatus: { type: String },
  place: { type: String, required: false },

}, {
  timestamps: true, // this will add both createdAt y updatedAt automatically
});

let Employee = Model<EmployeeModel>

try {
  Employee = mongoose.model('Employee') as Model<EmployeeModel>;
} catch (error) {
  Employee = mongoose.model<EmployeeModel>('Employee', EmployeeSchema)
}

export default Employee
