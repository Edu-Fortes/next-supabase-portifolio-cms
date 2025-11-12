'use client';

import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ContentFormValues } from './types';

interface ContentImageFieldProps {
  control: Control<ContentFormValues>;
  errors: FieldErrors<ContentFormValues>;
}

export function ContentImageField({ control, errors }: ContentImageFieldProps) {
  return (
    <div className='grid gap-2'>
      <Label htmlFor='image_url'>Cover Image URL</Label>
      <Controller
        name='image_url'
        control={control}
        render={({ field }) => (
          <Input
            id='image_url'
            placeholder='https://.../image.png'
            {...field}
            value={field.value || ''}
          />
        )}
      />
      {errors.image_url && (
        <p className='text-sm text-red-500'>
          {errors.image_url.message as string}
        </p>
      )}
    </div>
  );
}
