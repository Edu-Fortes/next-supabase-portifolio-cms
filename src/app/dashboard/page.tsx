// src/app/admin/page.tsx
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { signOut } from './actions';

export default async function DashboardPage() {
  const supabase = await createClient();

  // We can use this to get the user's session
  // Our middleware already did the heavy lifting,
  // but this is a good final check.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // This should be redundant thanks to middleware,
    // but it's good, secure practice.
    redirect('/sign-in');
  }

  return (
    <main className='flex min-h-screen flex-col items-center p-24'>
      <h1 className='text-4xl font-bold mb-8'>Admin Dashboard</h1>
      <p className='text-lg'>Welcome, {user.email}!</p>
      <p>This page is protected.</p>
      <Button onClick={signOut}>Sign Out</Button>
    </main>
  );
}
