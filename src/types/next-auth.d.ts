import { DefaultSession, DefaultUser } from 'next-auth'
import { AdapterUser } from 'next-auth/adapters'

declare module 'next-auth' {
  // Extiende la interfaz del usuario en la sesión
  interface Session {
    user?: {
      id: string;
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string | null // Agrega el campo `role`
      isActive?: boolean | null // Agrega el campo `role`
      token?: string;
    }
  }

  interface JWT {
    id: string;
    name: string;
    role: string;
    isActive: boolean;
  }

  // Extiende el tipo de usuario que maneja el adaptador para incluir el role
  interface User extends AdapterUser {
    role?: string | null; // Agrega el campo `role` aquí también
    isActive?: boolean | null; // Agrega el campo `role` aquí también
  }
}