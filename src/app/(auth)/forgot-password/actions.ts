'use server';

import { createClient } from '@/lib/supabase/server';

type ResetPasswordState = {
  message: string;
  type: 'success' | 'error';
};

export async function requestPasswordReset(
  email: string
): Promise<ResetPasswordState> {
  const supabase = await createClient();

  // The callback route will exchange the code for a session, then redirect to update-password
  const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback?next=/auth/update-password`;

  // Call Supabase password reset function
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });

  if (error) {
    return { message: error.message, type: 'error' };
  }

  return {
    message: 'Password reset link has been sent to your email.',
    type: 'success',
  };
}
