import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's role. */
      role?: 'HOST' | 'MANAGER' | 'ADMIN';
    } & DefaultSession['user'];
  }
}
