'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { loginSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { signInAction } from './actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Form's data type from the Zod schema
type LoginFormValues = z.infer<typeof loginSchema>;

export function SignInForm() {
  // Server-side error state
  const [error, setError] = useState<string | undefined>('');

  // Pending state for the form submission
  const [isPending, startTransition] = useTransition();

  // React Hook Form setup
  const { handleSubmit, control } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: LoginFormValues) {
    setError(undefined); // Clear previous server errors

    startTransition(async () => {
      const result = await signInAction(data);

      if (result?.message) {
        setError(result.message);
      }
    });
  }
  return (
    <Card className='w-full max-w-sm'>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Please enter your email and password to sign in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id='signin-form' onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name='email'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='signin-form-email'>Email</FieldLabel>
                  <Input
                    {...field}
                    id='signin-form-email'
                    aria-invalid={fieldState.invalid}
                    placeholder='exemplo@email.com'
                    autoComplete='off'
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name='password'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='signin-form-password'>
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id='signin-form-password'
                    aria-invalid={fieldState.invalid}
                    placeholder='********'
                    type='password'
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className='flex flex-col gap-2'>
        {error && (
          <p className='mb-4 text-sm font-medium text-red-500'>{error}</p>
        )}
        <Button type='submit' form='signin-form'>
          {isPending ? 'Signing in...' : 'Sign In'}
        </Button>
      </CardFooter>
    </Card>
  );
}
