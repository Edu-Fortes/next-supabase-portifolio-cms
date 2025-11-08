'use server';

import { createClient } from '@/lib/supabase/server';
import { profileSchema, updatePasswordSchema } from '@/lib/schemas';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// Define a type for our function's return value
type FormState = {
  message: string;
  type: 'success' | 'error';
};

type ResetPasswordState = {
  message: string;
  type: 'success' | 'error';
};

const supabase = await createClient();

export async function updateProfile(
  data: z.infer<typeof profileSchema>
): Promise<FormState> {
  // 1. Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: 'Not authenticated', type: 'error' };
  }

  // 2. Validate data on the server
  const validation = profileSchema.safeParse(data);
  if (!validation.success) {
    return { message: 'Invalid data', type: 'error' };
  }

  // 3. Update the profile in the database
  const { error } = await supabase
    .from('profiles')
    .update(validation.data)
    .eq('id', user.id); // IMPORTANT: Only update the current user's row

  if (error) {
    return { message: error.message, type: 'error' };
  }

  // 4. Revalidate the path to show new data
  revalidatePath('/dashboard/profile');

  return { message: 'Profile updated successfully!', type: 'success' };
}

export async function requestPasswordReset(
  email: string
): Promise<ResetPasswordState> {
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

export async function changeUserPassword(
  data: z.infer<typeof updatePasswordSchema>
): Promise<FormState> {
  // Validate data on the server
  const validation = updatePasswordSchema.safeParse(data);
  if (!validation.success) {
    return { message: 'Invalid data', type: 'error' };
  }

  // Update the user's password
  const { error } = await supabase.auth.updateUser({
    password: validation.data.password,
  });

  if (error) {
    return { message: error.message, type: 'error' };
  }

  return { message: 'Password updated successfully!', type: 'success' };
}
