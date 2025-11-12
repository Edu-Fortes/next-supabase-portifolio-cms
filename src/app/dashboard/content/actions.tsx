'use server';

import { createClient } from '@/lib/supabase/server';
import { contentSchema } from '@/lib/schemas'; // Use our new schema
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

type FormState = {
  message: string;
  type: 'success' | 'error';
};

export async function createContent(
  data: z.infer<typeof contentSchema>
): Promise<FormState> {
  const supabase = await createClient();

  // 1. Get user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { message: 'Not authenticated', type: 'error' };
  }

  // 2. Validate data
  const validation = contentSchema.safeParse(data);
  if (!validation.success) {
    return {
      message: `Invalid data: ${validation.error.message}`,
      type: 'error',
    };
  }

  // 3. Insert into the 'content' table
  const { error } = await supabase.from('content').insert({
    ...validation.data,
    author_id: user.id, // Set the author
  });

  if (error) {
    // Handle unique slug constraint error
    if (error.code === '23505') {
      return {
        message: 'This slug is already taken. Please choose a unique one.',
        type: 'error',
      };
    }
    return { message: error.message, type: 'error' };
  }

  // 4. Revalidate and redirect
  revalidatePath('/dasboard/content');
  redirect('/dashboard/content');
}

export async function updateContent(
  id: number, // Need the ID of the content to update
  data: z.infer<typeof contentSchema>
): Promise<FormState> {
  const supabase = await createClient();

  // 1. Get user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { message: 'Not authenticated', type: 'error' };
  }

  // 2. Validate data
  const validation = contentSchema.safeParse(data);
  if (!validation.success) {
    return {
      message: `Invalid data: ${validation.error.message}`,
      type: 'error',
    };
  }

  // 3. Update the content in the database
  const { error } = await supabase
    .from('content')
    .update(validation.data)
    .eq('id', id) // Specify which row to update
    .eq('author_id', user.id); // Ensure user can only update their own content

  if (error) {
    if (error.code === '23505') {
      // Unique slug constraint
      return { message: 'This slug is already taken.', type: 'error' };
    }
    return { message: error.message, type: 'error' };
  }

  // 4. Revalidate and redirect
  revalidatePath('/dashboard/content');
  revalidatePath(`/dashboard/content/${id}/edit`); // Revalidate the edit page
  redirect('/dashboard/content');
}
