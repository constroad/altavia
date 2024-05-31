import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { NextAuthOptions } from 'next-auth'

// Helper function to load and parse environment variables
const parseEnvList = (envVar: string): string[] => {
  return (process.env[envVar] || '').split(',').map(item => item.trim());
}

// Load usernames and passwords from environment variables
const usernames = parseEnvList('USERNAMES');
const passwords = parseEnvList('PASSWORDS');

const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        if (credentials) {
          const userIndex = usernames.indexOf(credentials.username);
          if (userIndex !== -1 && credentials.password === passwords[userIndex]) {
            return { id: String(userIndex + 1), name: credentials.username };
          }
        }
        return null;
      },
    })
  ],
  session: {
    maxAge: 14400, // 8 hours
  },
}

export default NextAuth(options)
