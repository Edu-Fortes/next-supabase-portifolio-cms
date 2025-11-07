import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import DynamicBreadcrumb from './dynamic-breadcrumb';

export default function AppHeader() {
  return (
    <header className='flex h-16 shrink-0 items-center gap-2 border-b'>
      <div className='flex items-center gap-2 px-3'>
        <SidebarTrigger />
        <Separator
          orientation='vertical'
          className='mr-2 data-[orientation=vertical]:h-4'
        />
        <DynamicBreadcrumb />
      </div>
    </header>
  );
}
