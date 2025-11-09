'use client';

import { Button } from '@/components/ui/button';
import { resetPasswordSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { requestPasswordReset } from './actions';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { z } from 'zod';

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ForgotPasswordForm() {
  const [message, setMessage] = useState<
    { text: string; type: 'success' | 'error' } | undefined
  >();
  const [isPending, startTransition] = useTransition();

  const { control, handleSubmit } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '' },
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
      id='forgot-password-form'
      onSubmit={handleSubmit(onSubmit)}
      className='grid gap-4'
    >
      <Controller
        name='email'
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor='forgot-password-form-email'>Email</FieldLabel>
            <Input
              id='forgot-password-form-email'
              aria-invalid={fieldState.invalid}
              placeholder='email@example.com'
              autoComplete='off'
              {...field}
            />
          </Field>
        )}
      />

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
        {isPending ? 'Sending...' : 'Send Reset Link'}
      </Button>
    </form>
  );
}
