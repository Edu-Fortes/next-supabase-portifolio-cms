'use client';

import { useRef, useCallback } from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { ForwardRefEditor } from './forward-ref-editor';
import { MDXEditorMethods } from '@mdxeditor/editor';
import { ContentFormValues } from './types';

interface ContentBodyEditorProps {
  control: Control<ContentFormValues>;
  errors: FieldErrors<ContentFormValues>;
}

export function ContentBodyEditor({ control, errors }: ContentBodyEditorProps) {
  const editorRef = useRef<MDXEditorMethods>(null);

  // Debounced onChange for MDX Editor to prevent lag
  const debouncedOnChange = useCallback((onChange: (value: string) => void) => {
    let timeoutId: NodeJS.Timeout;
    return (value: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        onChange(value);
      }, 300); // 300ms debounce
    };
  }, []);

  return (
    <div className='grid gap-2 col-span-5'>
      <Label>Main Content (Body)</Label>
      <Controller
        name='body'
        control={control}
        render={({ field }) => {
          const debouncedUpdate = debouncedOnChange(field.onChange);
          return (
            <div className='border rounded-md min-h-[400px]'>
              <ForwardRefEditor
                markdown={field.value ?? ''}
                onChange={debouncedUpdate}
                ref={editorRef}
              />
            </div>
          );
        }}
      />
      {errors.body && (
        <p className='text-sm text-red-500'>{errors.body.message as string}</p>
      )}
    </div>
  );
}
