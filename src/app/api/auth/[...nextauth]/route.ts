import NextAuth from "next-auth";
import { authOptions } from "src/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


// ------>>>>>> ESTO SOLO SE USA CUANDO NO HAY USUARIOS CREADOS AUN (USER HARCODED) <<<<<<------

// const parseEnvList = (envVar: string): string[] => {
//   return (process.env[envVar] || '').split(',').map(item => item.trim());
// };

// const usernames = parseEnvList('AUTH_USER');
// const passwords = parseEnvList('AUTH_PASSWORD');

// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         username: { label: 'Username', type: 'text' },
//         password: { label: 'Password', type: 'password' },
//       },
//       authorize: async (credentials) => {
//         if (credentials) {
//           const userIndex = usernames.indexOf(credentials.username);
//           if (userIndex !== -1 && credentials.password === passwords[userIndex]) {
//             return { id: String(userIndex + 1), name: credentials.username };
//           }
//         }
//         return null;
//       },
//     }),
//   ],
//   session: {
//     strategy: 'jwt',
//     maxAge: 1800,
//   },
// });

// export { handler as GET, handler as POST };

