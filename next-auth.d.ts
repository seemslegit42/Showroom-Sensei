import type { DefaultSession, User } from 'next-auth';
import type { JWT as NextAuthJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's role. */
      role?: 'HOST' | 'MANAGER' | 'ADMIN';
      id: string;
    } & DefaultSession['user'];
  }

  interface User {
    role?: 'HOST' | 'MANAGER' | 'ADMIN';
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT extends NextAuthJWT {
    /** The user's role. */
    role?: 'HOST' | 'MANAGER' | 'ADMIN';
    id: string;
  }
}
