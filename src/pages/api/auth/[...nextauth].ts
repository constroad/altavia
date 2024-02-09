import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: {  label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        if (
          credentials &&
          credentials.username === process.env.USERNAME &&
          credentials.password === process.env.PASSWORD
        ) {
          return { id: '1', name: 'Admin' };
        } else {
          return null;
        }
      },
    })
  ],
  session: {
    maxAge: 1800, // 1 hour
  },
})