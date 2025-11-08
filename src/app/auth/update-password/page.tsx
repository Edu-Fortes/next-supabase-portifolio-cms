'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { updatePasswordSchema } from '@/lib/schemas';
import { createClient } from '@/lib/supabase/client'; // Use the CLIENT client

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;

export default function UpdatePasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();

  const [message, setMessage] = useState<
    { text: string; type: 'success' | 'error' } | undefined
  >();
  const [isPending, startTransition] = useTransition();

  // Check for error from server redirect
  const error = searchParams.get('error');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: UpdatePasswordFormValues) => {
    setMessage(undefined);

    startTransition(async () => {
      // This is a client-side auth call
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        setMessage({ text: error.message, type: 'error' });
      } else {
        setMessage({
          text: 'Password updated successfully! Redirecting to login...',
          type: 'success',
        });
        setTimeout(() => {
          router.push('/sign-in');
        }, 2000);
      }
    });
  };

  // If the user lands here with an error (e.g., expired token), show that.
  if (error) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center p-24'>
        <Card className='w-full max-w-sm'>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-red-500'>
              {error ||
                'There was an error. Please try the reset process again.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Otherwise, show the form
  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-24'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle>Update Your Password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='password'>New Password</Label>
              <Input id='password' type='password' {...register('password')} />
              {errors.password && (
                <p className='text-sm font-medium text-red-500'>
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='confirmPassword'>Confirm New Password</Label>
              <Input
                id='confirmPassword'
                type='password'
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className='text-sm font-medium text-red-500'>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

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
              {isPending ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
