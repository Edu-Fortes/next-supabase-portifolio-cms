'use client';

import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRef, useState, useTransition, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Tables } from '@/types/supabase';

import { contentSchema } from '@/lib/schemas'; // Use new schema
import { createContent as createContentAction } from './actions'; // Use new action

// Import shadcn/ui components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ForwardRefEditor } from './components/forward-ref-editor';
import { MDXEditorMethods } from '@mdxeditor/editor';

type FormState = {
  message: string;
  type: 'success' | 'error';
};

// Define the form's data type
type ContentFormValues = z.infer<typeof contentSchema>;

interface ContentFormProps {
  content?: Tables<'content'>;
  action: 'create' | 'update';
}

export function ContentForm({ content, action }: ContentFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState<
    { text: string; type: 'success' | 'error' } | undefined
  >();
  const [isPending, startTransition] = useTransition();
  const editorRef = useRef<MDXEditorMethods>(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: content?.title || '',
      slug: content?.slug || '',
      content_type:
        (content?.content_type as 'PROJECT' | 'ARTICLE') || 'PROJECT',
      description: content?.description || '',
      body: content?.body || '',
      github_url: content?.github_url || '',
      live_url: content?.live_url || '',
      image_url: content?.image_url || '',
    },
  });

  // Watch the content_type field to conditionally show fields
  const contentType = useWatch({
    control,
    name: 'content_type',
  });

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

  const onSubmit = (data: ContentFormValues) => {
    setMessage(undefined);
    startTransition(async () => {
      let result: FormState | undefined;
      if (action === 'create') {
        result = await createContentAction(data);
      } else {
        // We will build this later
        // result = await updateContentAction(content!.id, data)
      }
      if (result?.message) {
        setMessage({ text: result.message, type: result.type });
      }
    });
  };

  return (
    <Card className='w-full mt-6'>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='grid gap-6 grid-cols-7 items-start'
        >
          {/* Body (MDX Editor) */}
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
              <p className='text-sm text-red-500'>{errors.body.message}</p>
            )}
          </div>

          <div className='col-span-2 grid gap-8 sticky top-6'>
            {/* Content Type */}
            <div className='grid gap-2'>
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

            {/* Title */}
            <div className='grid gap-2'>
              <Label htmlFor='title'>Title</Label>
              <Controller
                name='title'
                control={control}
                render={({ field }) => (
                  <Input
                    id='title'
                    placeholder='My Awesome Project'
                    {...field}
                  />
                )}
              />
              {errors.title && (
                <p className='text-sm text-red-500'>{errors.title.message}</p>
              )}
            </div>

            {/* Slug */}
            <div className='grid gap-2'>
              <Label htmlFor='slug'>URL Slug</Label>
              <Controller
                name='slug'
                control={control}
                render={({ field }) => (
                  <Input
                    id='slug'
                    placeholder='my-awesome-project'
                    {...field}
                  />
                )}
              />
              {errors.slug && (
                <p className='text-sm text-red-500'>{errors.slug.message}</p>
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
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Conditional Project Fields */}
            {contentType === 'PROJECT' && (
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
                      {errors.github_url.message}
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
                      {errors.live_url.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Cover Image URL */}
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
                  {errors.image_url.message}
                </p>
              )}
            </div>

            {/* Server Message */}
            {message && (
              <p
                className={`text-sm ${
                  message.type === 'error' ? 'text-red-500' : 'text-green-500'
                }`}
              >
                {message.text}
              </p>
            )}

            {/* Actions */}
            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Content'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
