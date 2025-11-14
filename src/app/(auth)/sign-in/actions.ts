'use server';

import { loginSchema } from '@/lib/schemas';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
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

export async function forceResetPassword() {
  const LIVE_EMAIL = 'magic@user.com';
  const LIVE_PASSWORD = 'magic123';

  // 1. Create a Supabase admin client
  // This client has full admin rights and bypasses RLS
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Use the service key
  );

  try {
    // 2. Find the user by their email
    const { data: users, error: listError } =
      await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;

    const testUser = users.users.find((u) => u.email === LIVE_EMAIL);
    if (!testUser) {
      return { message: 'Test user not found.' };
    }

    // 3. Update that user's password
    await supabaseAdmin.auth.admin.updateUserById(testUser.id, {
      password: LIVE_PASSWORD,
    });

    // 4. Revalidate the page and return success
    revalidatePath('/sign-in');
    return { message: 'Password reset to "magic123"!' };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return { message: `Error: ${errorMessage}` };
  }
}
