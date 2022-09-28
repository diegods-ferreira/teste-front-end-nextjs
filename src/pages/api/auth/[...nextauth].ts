import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { EMAIL_REGEX } from '../../../data/contants/email-regex';

interface Credentials {
  username: string;
  email: string;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 // 24 horas
  },
  secret: process.env.JWT_SECRET,
  providers: [
    CredentialsProvider({
      type: 'credentials',
      name: 'Credentials',
      credentials: {},
      authorize: async (credentials, req) => {
        const { username, email } = credentials as Credentials;

        if (!EMAIL_REGEX.test(email)) {
          throw new Error('Formato de e-mail inválido.');
        }

        const user = { username, email };
        return user;
      }
    })
  ],
  pages: {
    signIn: '/auth/signin'
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      console.log('jwt callback', user);
      
      if (user) {
        token.user = user;
      }

      return token;
    },
    session: async ({ session, token }) => {
      console.log('session callback', token);

      if (token) {
        session.user = token.user;
      }

      return session;
    }
  }
};

export default NextAuth(authOptions);