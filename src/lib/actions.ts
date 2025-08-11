'use server';

import { signIn } from '@/../auth';

export async function signInWithEmail(email: string) {
  try {
    await signIn('resend', { email, redirect: false });
    return { success: true, message: 'Check your email for a magic link to sign in.' };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, message: 'An error occurred during sign-in. Please try again.' };
  }
}
