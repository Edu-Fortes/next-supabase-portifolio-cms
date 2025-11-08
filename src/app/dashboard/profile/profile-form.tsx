'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useTransition } from 'react';

import { profileSchema } from '@/lib/schemas';
import { updateProfile } from './actions';
import type { Tables } from '@/types/supabase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';

// Define the form's data type
type ProfileFormValues = z.infer<typeof profileSchema>;

// Define the props, which will be the user's current profile
interface ProfileFormProps {
  profile: Tables<'profiles'>;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  // Server-side message state (for success or error)
  const [message, setMessage] = useState<
    { text: string; type: 'success' | 'error' } | undefined
  >();

  // Pending state for the form submission
  const [isPending, startTransition] = useTransition();

  // React Hook Form setup
  const { control, handleSubmit } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile.full_name ?? '',
      display_name: profile.display_name ?? '',
    },
  });

  // The 'onSubmit' function, client-side
  const onSubmit = (data: ProfileFormValues) => {
    setMessage(undefined); // Clear previous messages

    startTransition(async () => {
      const result = await updateProfile(data);

      if (result) {
        setMessage({ text: result.message, type: result.type });
      }
    });
  };

  return (
    <form
      id='profile-form'
      onSubmit={handleSubmit(onSubmit)}
      className='grid gap-4 max-w-lg'
    >
      <FieldGroup>
        <Controller
          name='full_name'
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='profile-form-full_name'>
                Full Name
              </FieldLabel>
              <Input
                id='profile-form-full_name'
                placeholder='Your full name'
                aria-invalid={fieldState.invalid}
                {...field}
                value={field.value ?? ''}
              />
              {fieldState.error && (
                <p className='text-sm font-medium text-red-500'>
                  {fieldState.error.message}
                </p>
              )}
            </Field>
          )}
        />
        <Controller
          name='display_name'
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='profile-form-display_name'>
                Display Name
              </FieldLabel>
              <Input
                id='profile-form-display_name'
                placeholder='Your display name'
                aria-invalid={fieldState.invalid}
                {...field}
                value={field.value ?? ''}
              />
              {fieldState.error && (
                <p className='text-sm font-medium text-red-500'>
                  {fieldState.error.message}
                </p>
              )}
            </Field>
          )}
        />
      </FieldGroup>

      {/* Display server message */}
      {message && (
        <p
          className={`text-sm font-medium ${
            message.type === 'error' ? 'text-red-500' : 'text-green-500'
          }`}
        >
          {message.text}
        </p>
      )}

      <Button type='submit' className='w-full' disabled={isPending}>
        {isPending ? 'Updating...' : 'Update Profile'}
      </Button>
    </form>
  );
}
