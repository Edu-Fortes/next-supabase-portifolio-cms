'use client';

import { useState, useTransition } from 'react';

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { updatePasswordSchema } from '@/lib/schemas';
import { changeUserPassword } from './actions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;

export function ChangePasswordForm() {
  const [message, setMessage] = useState<
    { text: string; type: 'success' | 'error' } | undefined
  >();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset, // Get the reset function from RHF
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
      const result = await changeUserPassword(data);
      setMessage({ text: result.message, type: result.type });

      // If successful, clear the form fields
      if (result.type === 'success') {
        reset();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4 max-w-lg'>
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
  );
}
