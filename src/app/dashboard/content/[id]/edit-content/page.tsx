import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ContentForm } from '../../content-form'; // Existing form
import { Tables } from '@/types/supabase';

// Define the props, which include the 'id' from the URL
// In Next.js 15+, params is a Promise in async Server Components
interface EditContentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditContentPage({
  params,
}: EditContentPageProps) {
  const { id } = await params;

  // If `id` is missing for any reason, redirect back to the content list.
  if (!id) {
    redirect('/dashboard/content');
  }
  const supabase = await createClient();

  // 1. Fetch the specific content item to edit
  const { data: content, error } = await supabase
    .from('content')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !content) {
    console.error('Error fetching content:', error);
    redirect('/dashboard/content'); // If not found, go back to the list
  }

  // 2. Render our existing form, passing the data into it
  return <ContentForm action='update' content={content as Tables<'content'>} />;
}
