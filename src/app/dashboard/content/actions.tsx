'use server';

import { portfolioProjectSchema } from '@/lib/schemas';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

type FormState = {
  message: string;
  type: 'success' | 'error';
};

export async function createPortfolioProject(
  data: z.infer<typeof portfolioProjectSchema>
): Promise<FormState> {
  const supabase = await createClient();

  // Get user to make sure they are authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      message: 'User not authenticated',
      type: 'error',
    };
  }

  // Validate data on the server
  const validation = portfolioProjectSchema.safeParse(data);

  if (!validation.success) {
    return {
      message: 'Invalid data provided',
      type: 'error',
    };
  }

  // Insert the new project into the database
  const { error } = await supabase.from('portfolio_projects').insert({
    ...validation.data,
  });

  if (error) {
    return {
      message: error.message,
      type: 'error',
    };
  }

  // Revalidate the path to show new data on the list page
  revalidatePath('/dashboard/portfolio');

  // Redirect back to the list page on success
  redirect('/dashboard/portfolio');
}
