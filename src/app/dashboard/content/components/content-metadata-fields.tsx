'use client';

import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ContentFormValues } from './types';

interface ContentMetadataFieldsProps {
  control: Control<ContentFormValues>;
  errors: FieldErrors<ContentFormValues>;
}

export function ContentMetadataFields({
  control,
  errors,
}: ContentMetadataFieldsProps) {
  return (
    <>
      {/* Title */}
      <div className='grid gap-2'>
        <Label htmlFor='title'>Title</Label>
        <Controller
          name='title'
          control={control}
          render={({ field }) => (
            <Input id='title' placeholder='My Awesome Project' {...field} />
          )}
        />
        {errors.title && (
          <p className='text-sm text-red-500'>
            {errors.title.message as string}
          </p>
        )}
      </div>

      {/* Slug */}
      <div className='grid gap-2'>
        <Label htmlFor='slug'>URL Slug</Label>
        <Controller
          name='slug'
          control={control}
          render={({ field }) => (
            <Input id='slug' placeholder='my-awesome-project' {...field} />
          )}
        />
        {errors.slug && (
          <p className='text-sm text-red-500'>
            {errors.slug.message as string}
          </p>
        )}
      </div>

      {/* Short Description */}
      <div className='grid gap-2'>
        <Label htmlFor='description'>Short Description</Label>
        <Controller
          name='description'
          control={control}
          render={({ field }) => (
            <Textarea
              id='description'
              placeholder='A short, one-line summary...'
              className='h-24'
              {...field}
            />
          )}
        />
        {errors.description && (
          <p className='text-sm text-red-500'>
            {errors.description.message as string}
          </p>
        )}
      </div>
    </>
  );
}
