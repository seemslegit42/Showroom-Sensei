import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login', // Error code passed in query string as ?error=
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/');
      const isOnLoginPage = nextUrl.pathname.startsWith('/login');
      const isOnVisitorIntake = nextUrl.pathname.startsWith('/visitor-intake');
      
      if (isOnVisitorIntake) {
        return true; // Allow unauthenticated access to visitor intake
      }

      if (isOnDashboard && !isOnLoginPage) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn && isOnLoginPage) {
        return Response.redirect(new URL('/', nextUrl));
      }
      return true;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
       if (token?.role) {
        // @ts-expect-error - role is not on the default type
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-expect-error - role is not on the default type
        token.role = user.role;
      }
      return token;
    }
  },
  providers: [], // Add providers in auth.ts
} satisfies NextAuthConfig;
