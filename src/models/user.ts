import { z } from 'zod';
import mongoose, { Document, Schema, Model, models } from 'mongoose';

export const roles = ["admin", "laboratory", "supervisor", "guest"] as const;
export type Role = (typeof roles)[number];

export const userValidationSchema = z.object({
  _id: z.string().optional(),
  userName: z.string().min(5, "El nombre de usuario debe tener al menos 5 caracteres"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .regex(/\d/, "La contraseña debe contener al menos un número"),
  name: z.string().min(1),
  lastName: z.string().min(1),
  doi: z.string().optional(),
  isActive: z.boolean(),
  role: z.enum(roles, { errorMap: () => ({ message: "El rol es requerido" }) }),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type IUserValidationSchema = z.infer<typeof userValidationSchema>;

// Interfaz para Mongoose
export interface UserModel extends Document {
  userName: string;
  password: string;
  name: string;
  lastName: string;
  doi?: string;
  isActive: boolean;
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;
}

// Esquema de Mongoose
const userDBSchema = new Schema<UserModel>(
  {
    userName: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    doi: { type: String },
    isActive: { type: Boolean, required: true },
    role: {
      type: String,
      enum: roles,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Si ya existe, usa ese modelo; si no, crea uno nuevo
const User: Model<UserModel> = models.User || mongoose.model<UserModel>('User', userDBSchema);

export default User;
