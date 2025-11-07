import { Sidebar, SidebarContent } from '@/components/ui/sidebar';

export function AppSidebar({ children }: { children: React.ReactNode }) {
  return (
    <Sidebar collapsible='icon'>
      <SidebarContent>{children}</SidebarContent>
    </Sidebar>
  );
}
