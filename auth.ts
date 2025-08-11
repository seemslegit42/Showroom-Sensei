import NextAuth from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import Resend from 'next-auth/providers/resend';
import { db } from '@/lib/db';
import { users, accounts, sessions, verificationTokens } from '@/lib/db/schema';
import { authConfig } from './auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: 'jwt' },
  ...authConfig,
  providers: [
    Resend({
      from: process.env.EMAIL_FROM,
      // You can omit the `sendVerificationRequest` function if you're using the default email templates.
      // Otherwise, you can provide your own function to send the verification email.
    }),
  ],
});
