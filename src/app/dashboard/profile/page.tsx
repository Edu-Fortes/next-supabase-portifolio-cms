import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileForm } from './profile-form';
import { Tables } from '@/types/supabase';

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
    <div className='flex flex-col gap-8'>
      <h2 className='text-2xl font-semibold'>Update Your Profile</h2>
      <ProfileForm profile={typedProfile} />
    </div>
  );
}
