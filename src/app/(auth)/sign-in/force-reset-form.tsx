'use client';

import { useState, useTransition } from 'react';
import { forceResetPassword } from './actions';
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardDescription,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CopyButton } from '@/components/ui/shadcn-io/copy-button';

export function ForceResetPassword({ className }: { className?: string }) {
  // Reset button state
  const [resetMessage, setResetMessage] = useState('');

  // Pending state for the form submission
  const [isPending, startTransition] = useTransition();

  function onResetClick() {
    startTransition(async () => {
      const result = await forceResetPassword();
      setResetMessage(result.message);
    });
  }

  return (
    <Card className={cn('bg-background text-muted-foreground', className)}>
      <CardHeader>
        <CardTitle>Test Account</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-sm mb-8'>
          <CardDescription className='mb-4'>
            Use the credentials below to access dashboard
          </CardDescription>
          <Label>Email</Label>
          <div className='flex justify-center items-center'>
            <Input value='magic@user.com' readOnly />
            <CopyButton content='magic@user.com' variant='ghost' size='md' />
          </div>
          <Label className='mt-2'>Password</Label>
          <div className='flex justify-center items-center'>
            <Input value='magic123' readOnly />
            <CopyButton content='magic123' variant='ghost' size='md' />
          </div>
        </div>
        <CardDescription className='mb-4'>
          Use the button below to force password reset
        </CardDescription>
        {/* 4. The new form and button */}
        <form action={onResetClick}>
          <Button
            type='submit'
            variant='outline'
            className='w-full'
            disabled={isPending}
          >
            {isPending ? 'Resetting...' : 'Reset Test Password to "magic123"'}
          </Button>
          {resetMessage && (
            <p className='mt-2 text-sm text-green-600'>{resetMessage}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
