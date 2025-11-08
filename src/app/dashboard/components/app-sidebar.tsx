import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import NavMain from './nav-main';
import { NavUser } from './nav-user';
import { Tables } from '@/types/supabase';
import { User } from '@supabase/supabase-js';

export function AppSidebar({
  user,
  profile,
}: {
  user: User;
  profile: Tables<'profiles'> | null;
}) {
  return (
    <Sidebar collapsible='icon'>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} profile={profile} />
      </SidebarFooter>
    </Sidebar>
  );
}
