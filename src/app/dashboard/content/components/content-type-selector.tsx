'use client';

import { Control, Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ContentFormValues } from './types';

interface ContentTypeSelectorProps {
  control: Control<ContentFormValues>;
}

export function ContentTypeSelector({ control }: ContentTypeSelectorProps) {
  return (
    <div className='grid gap-4'>
      <Label>Content Type</Label>
      <Controller
        name='content_type'
        control={control}
        render={({ field }) => (
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className='flex gap-4'
          >
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='PROJECT' id='r-project' />
              <Label htmlFor='r-project'>Project Case Study</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='ARTICLE' id='r-article' />
              <Label htmlFor='r-article'>Blog Article</Label>
            </div>
          </RadioGroup>
        )}
      />
    </div>
  );
}
