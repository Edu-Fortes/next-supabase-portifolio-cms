'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useTransition } from 'react';

import { resetPasswordSchema } from '@/lib/schemas';
import { requestPasswordReset } from './actions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface PasswordResetFormProps {
  email: string; // Pass in the user's current email
}

export function PasswordResetForm({ email }: PasswordResetFormProps) {
  const [message, setMessage] = useState<
    { text: string; type: 'success' | 'error' } | undefined
  >();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email || '',
    },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    setMessage(undefined);

    startTransition(async () => {
      const result = await requestPasswordReset(data.email);
      setMessage({ text: result.message, type: result.type });
    });
  };

  return (
    <form
      id='password-reset-form'
      onSubmit={handleSubmit(onSubmit)}
      className='grid gap-4 max-w-lg'
    >
      <div className='grid gap-2'>
        <Label htmlFor='password-reset-email'>Email</Label>
        <Input
          id='password-reset-email'
          readOnly // Read-only, do not allow changes here
          className='bg-muted'
          {...register('email')}
        />
        {errors.email && (
          <p className='text-sm font-medium text-red-500'>
            {errors.email.message}
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
        {isPending ? 'Sending...' : 'Send Password Reset Link'}
      </Button>
    </form>
  );
}
