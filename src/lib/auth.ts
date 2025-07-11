import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { UserRepository } from "src/repositories/userRepository";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (credentials?.username && credentials?.password) {
            const user = await UserRepository.authenticateUser(credentials.username, credentials.password);

            if (user && user._id && user.userName) {
              return {
                id: user._id.toString(),
                name: user.userName,
                role: user.role,
                isActive: user.isActive
              };
            }
          }
          return null;
          
        } catch (error: any) {
          console.error("❌ Error en authorize:", error.message);
          throw new Error(error.message ?? "Error al iniciar sesión");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 28800, // (28,800 son 8h) - (3,600 son 1h)
  },
  jwt: {
    maxAge: 28800, // (28,800 son 8h) - (3,600 son 1h)
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
        token.isActive = user.isActive;
      }
      return token;
    },
    async session({ session, token }) {
      if (!session.user) {
        session.user = {
          id: token.id as string,
          name: token.name as string,
          role: token.role as string,
          isActive: token.isActive as boolean
        };
      } else {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
        session.user.isActive = token.isActive as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Puedes personalizar esto si tienes una ruta de login
  },
};