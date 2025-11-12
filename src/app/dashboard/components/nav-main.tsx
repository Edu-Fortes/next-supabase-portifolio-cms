import Link from 'next/link';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { LayoutDashboard, LucideIcon, TableOfContents } from 'lucide-react';

type SidebarMenuItens = {
  label: string;
  href: string;
  icon: LucideIcon;
  items?: { title: string; url: string }[];
};

const sidebarMenuItens: SidebarMenuItens[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Content',
    icon: TableOfContents,
    href: '/dashboard/content',
    items: [
      { title: 'All Contents', url: '/dashboard/content' },
      { title: 'Create new', url: '/dashboard/content/new-content' },
    ],
  },
];

export default function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Application</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {sidebarMenuItens.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton asChild tooltip={item.label}>
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
              {item.items?.length ? (
                <SidebarMenuSub>
                  {item.items.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuButton asChild>
                        <Link href={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              ) : null}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
