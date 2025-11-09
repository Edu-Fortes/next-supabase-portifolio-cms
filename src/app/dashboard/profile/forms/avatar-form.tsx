'use client';

import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client'; // CLIENT client
import { Tables } from '@/types/supabase';
import { updateAvatarUrl } from '../actions';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import Image from 'next/image';

export function AvatarForm({ profile }: { profile: Tables<'profiles'> }) {
  const supabase = createClient();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<
    { text: string; type: 'success' | 'error' } | undefined
  >();
  const [isPending, startTransition] = useTransition();

  // Compute avatar URL directly from profile
  const profileAvatarUrl = profile.avatar_url
    ? supabase.storage.from('avatars').getPublicUrl(profile.avatar_url).data
        .publicUrl
    : null;

  // Display the uploaded avatar or the profile avatar
  const displayUrl = avatarUrl || profileAvatarUrl;

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(undefined);
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a unique file path for the upload
    // Must match the RLS policy: {user_id}/filename
    const filePath = `${profile.id}/${Date.now()}_${file.name}`;

    startTransition(async () => {
      // 1. Upload the file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true, // Overwrite existing file with same name
        });

      if (uploadError) {
        setMessage({ text: uploadError.message, type: 'error' });
        return;
      }

      // 2. Call the Server Action to update the 'profiles' table
      const result = await updateAvatarUrl(uploadData.path);
      setMessage({ text: result.message, type: result.type });

      // 3. Update the local preview and refresh the page data
      if (result.type === 'success') {
        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(uploadData.path);
        setAvatarUrl(data.publicUrl);

        // Force router to refresh server components
        router.refresh();
      }
    });
  };

  return (
    <div className='grid gap-4 max-w-lg'>
      <h3 className='font-semibold'>Avatar</h3>
      <div className='flex items-center gap-4'>
        {/* Avatar Preview */}
        <div className='w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden'>
          {displayUrl ? (
            <Image
              src={displayUrl}
              alt='Avatar'
              className='w-full h-full object-cover'
              width={80}
              height={80}
              unoptimized
            />
          ) : (
            <span className='text-sm text-muted-foreground'>None</span>
          )}
        </div>

        {/* File Input */}
        <Input
          ref={fileInputRef}
          id='avatar-upload'
          type='file'
          accept='image/*'
          className='hidden' // Hide the default input
          onChange={handleUpload}
          disabled={isPending}
        />

        {/* Upload Button */}
        <Button
          type='button'
          variant='outline'
          onClick={() => fileInputRef.current?.click()}
          disabled={isPending}
          className='ml-6'
        >
          {isPending ? (
            <>
              <Spinner className='mr-2' />
              Uploading...
            </>
          ) : (
            'Choose Avatar'
          )}
        </Button>
      </div>

      {/* Message Area */}
      {message && (
        <p
          className={`text-sm font-medium ${
            message.type === 'error' ? 'text-red-500' : 'text-green-500'
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
