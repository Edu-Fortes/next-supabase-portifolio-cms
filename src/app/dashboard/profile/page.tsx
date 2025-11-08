import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileForm } from './forms/profile-form';
import { Tables } from '@/types/supabase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChangePasswordForm } from './forms/change-password-form';
import { AvatarForm } from './forms/avatar-form';

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
    <div className='grid gap-6'>
      <Card>
        <CardHeader>
          <CardTitle>Public Profile</CardTitle>
          <CardDescription>
            This information will be displayed publicly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={typedProfile} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Manage your password and account security.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>

      <AvatarForm profile={typedProfile} />
    </div>
  );
}
