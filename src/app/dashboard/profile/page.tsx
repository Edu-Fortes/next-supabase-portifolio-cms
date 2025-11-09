import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileForm } from './forms/profile-form';
import { Tables } from '@/types/supabase';
import { ChangePasswordForm } from './forms/change-password-form';
import { AvatarForm } from './forms/avatar-form';
import { Separator } from '@/components/ui/separator';

export default async function ProfilePage() {
  const supabase = await createClient();

  // Get the user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get the user's profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single(); // We expect only one row

  if (error || !profile) {
    console.error('Error fetching profile:', error);
    // Handle the case where the profile might not exist yet
    // or there was a fetch error
  }

  // Cast to our generated type
  const typedProfile = profile as Tables<'profiles'>;

  return (
    <div className='grid grid-cols-3 pl-20 py-20'>
      <div className='col-span-1'>
        <h2 className='text-base/7 font-semibold'>Profile</h2>
        <p className='mt-1 text-sm/6 text-muted-foreground'>
          This information will be displayed publicly.
        </p>
      </div>
      <div className='col-span-2 space-y-12'>
        <AvatarForm profile={typedProfile} />
        <Separator />
        <ProfileForm profile={typedProfile} />
      </div>
      <Separator className='col-span-3 my-24' />
      <div className='col-span-1'>
        <h2 className='text-base/7 font-semibold'>Security</h2>
        <p className='mt-1 text-sm/6 text-muted-foreground'>
          Change your password..
        </p>
      </div>
      <div className='grid-span-2 mt-8'>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
