import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { signOut } from './actions'; // Import our new action
import { Button } from '@/components/ui/button';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user, redirect to login
  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className='flex flex-col min-h-screen'>
      {/* Header */}
      <header className='flex items-center justify-between p-4 border-b bg-background'>
        <h1 className='text-xl font-bold'>Admin Dashboard</h1>
        <div className='flex items-center gap-4'>
          <span className='text-sm text-muted-foreground'>{user.email}</span>
          {/* This form is our Logout Button. 
            It's the simplest way to call a Server Action.
          */}
          <form action={signOut}>
            <Button variant='outline' type='submit'>
              Logout
            </Button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1 p-6'>{children}</main>
    </div>
  );
}
