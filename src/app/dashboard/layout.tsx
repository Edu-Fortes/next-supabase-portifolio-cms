import { cookies } from 'next/headers';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './components/app-sidebar';
import AppHeader from './components/app-header';
import NavMain from './components/nav-main';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user, redirect to sign-in page
  if (!user) {
    redirect('/sign-in');
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar>
        <NavMain />
      </AppSidebar>
      <SidebarInset>
        <AppHeader />
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

//   return (
//     <div className='flex flex-col min-h-screen'>
//       {/* Header */}
//       <header className='flex items-center justify-between p-4 border-b bg-background'>
//         <h1 className='text-xl font-bold'>Admin Dashboard</h1>
//         <div className='flex items-center gap-4'>
//           <span className='text-sm text-muted-foreground'>{user.email}</span>
//           {/* This form is our Logout Button.
//             It's the simplest way to call a Server Action.
//           */}
//           <form action={signOut}>
//             <Button variant='outline' type='submit'>
//               Logout
//             </Button>
//           </form>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className='flex-1 p-6'>{children}</main>
//     </div>
//   );
// }
