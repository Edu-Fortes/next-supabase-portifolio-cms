// src/app/login/login-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useTransition } from 'react';

import { loginSchema } from '@/lib/schemas';
import { signInAction } from './actions'; // Our Server Action

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Define the form's data type from the Zod schema
type LoginFormValues = z.infer<typeof loginSchema>;

export function SignInForm() {
  // 1. Server-side error state
  const [error, setError] = useState<string | undefined>('');

  // 2. Pending state for the form submission
  const [isPending, startTransition] = useTransition();

  // 3. React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 4. The 'onSubmit' function, now client-side
  const onSubmit = (data: LoginFormValues) => {
    setError(undefined); // Clear previous server errors

    startTransition(async () => {
      const result = await signInAction(data);

      if (result?.message) {
        setError(result.message);
      }
      // No need for a success case, the action redirects
    });
  };

  return (
    <Card className='w-full max-w-sm'>
      <CardHeader>
        <CardTitle className='text-2xl'>Admin Login</CardTitle>
        <CardDescription>
          Enter your email below to log in to your dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* 5. Use RHF's handleSubmit */}
        <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4'>
          <div className='grid gap-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              placeholder='m@example.com'
              {...register('email')} // 6. Register the input
            />
            {/* 7. Instant client-side error */}
            {errors.email && (
              <p className='text-sm font-medium text-red-500'>
                {errors.email.message}
              </p>
            )}
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='password'>Password</Label>
            <Input id='password' type='password' {...register('password')} />
            {errors.password && (
              <p className='text-sm font-medium text-red-500'>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* 8. Display server-side error */}
          {error && <p className='text-sm font-medium text-red-500'>{error}</p>}

          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
