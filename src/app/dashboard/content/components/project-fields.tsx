'use client';

import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ContentFormValues } from './types';

interface ProjectFieldsProps {
  control: Control<ContentFormValues>;
  errors: FieldErrors<ContentFormValues>;
}

export function ProjectFields({ control, errors }: ProjectFieldsProps) {
  return (
    <div className='grid grid-cols-2 gap-4'>
      <div className='grid gap-2'>
        <Label htmlFor='github_url'>GitHub URL</Label>
        <Controller
          name='github_url'
          control={control}
          render={({ field }) => (
            <Input
              id='github_url'
              placeholder='https://github.com/...'
              {...field}
              value={field.value || ''}
            />
          )}
        />
        {errors.github_url && (
          <p className='text-sm text-red-500'>
            {errors.github_url.message as string}
          </p>
        )}
      </div>
      <div className='grid gap-2'>
        <Label htmlFor='live_url'>Live URL</Label>
        <Controller
          name='live_url'
          control={control}
          render={({ field }) => (
            <Input
              id='live_url'
              placeholder='https://myproject.com'
              {...field}
              value={field.value || ''}
            />
          )}
        />
        {errors.live_url && (
          <p className='text-sm text-red-500'>
            {errors.live_url.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
