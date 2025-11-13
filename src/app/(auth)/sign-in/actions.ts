'use server';

import { loginSchema } from '@/lib/schemas';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';

type FormState = {
  message: string;
};

export async function signInAction(
  data: z.infer<typeof loginSchema>
): Promise<FormState> {
  // Revalidate on server as a security measure
  const validation = loginSchema.safeParse(data);

  if (!validation.success) {
    return { message: 'Invalid form data' };
  }

  const { email, password } = validation.data;
  const supabase = await createClient();

  // Attempt to sign in the user
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  // If returns an error, pass it back to client
  if (error) {
    return {
      message:
        error.message || 'Could not authenticate user. Please try again.',
    };
  }

  // On success, return empty message and redirect
  redirect('/dashboard');
}
