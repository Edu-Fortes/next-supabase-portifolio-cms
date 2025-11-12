'use client';

import { useForm, Controller, useWatch } from 'react-hook-form'; // Import Controller
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Tables } from '@/types/supabase';

import { contentSchema } from '@/lib/schemas'; // Use new schema
import { createContent as createContentAction } from './actions'; // Use new action

// Define FormState type locally
type FormState = {
  message: string;
  type: 'success' | 'error';
};

// Import the new MDX Editor and its plugins/styles
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

// Import shadcn/ui components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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

  const {
    register,
    handleSubmit,
    control, // Get control for MDXEditor and RadioGroup
    formState: { errors },
  } = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: content?.title || '',
      slug: content?.slug || '',
      content_type:
        (content?.content_type as 'PROJECT' | 'ARTICLE') || 'PROJECT', // Default to PROJECT
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
    <Card className='max-w-4xl'>
      {' '}
      {/* Made it wider */}
      <CardHeader>
        <CardTitle>
          {action === 'create' ? 'Create New Content' : 'Edit Content'}
        </CardTitle>
        <CardDescription>
          Fill out the details for your new project or article.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='grid gap-6'>
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
            <Input
              id='title'
              placeholder='My Awesome Project'
              {...register('title')}
            />
            {errors.title && (
              <p className='text-sm text-red-500'>{errors.title.message}</p>
            )}
          </div>

          {/* Slug */}
          <div className='grid gap-2'>
            <Label htmlFor='slug'>URL Slug</Label>
            <Input
              id='slug'
              placeholder='my-awesome-project'
              {...register('slug')}
            />
            {errors.slug && (
              <p className='text-sm text-red-500'>{errors.slug.message}</p>
            )}
          </div>

          {/* Short Description */}
          <div className='grid gap-2'>
            <Label htmlFor='description'>Short Description</Label>
            <Textarea
              id='description'
              placeholder='A short, one-line summary...'
              {...register('description')}
              className='h-24'
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
                <Input
                  id='github_url'
                  placeholder='https://github.com/...'
                  {...register('github_url')}
                />
                {errors.github_url && (
                  <p className='text-sm text-red-500'>
                    {errors.github_url.message}
                  </p>
                )}
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='live_url'>Live URL</Label>
                <Input
                  id='live_url'
                  placeholder='https://myproject.com'
                  {...register('live_url')}
                />
                {errors.live_url && (
                  <p className='text-sm text-red-500'>
                    {errors.live_url.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Body (MDX Editor) */}
          <div className='grid gap-2'>
            <Label>Main Content (Body)</Label>
            <Controller
              name='body'
              control={control}
              render={({ field }) => (
                <MDXEditor
                  markdown={field.value || ''}
                  onChange={field.onChange}
                  plugins={[
                    headingsPlugin(),
                    listsPlugin(),
                    quotePlugin(),
                    thematicBreakPlugin(),
                  ]}
                  className='min-h-96 border rounded-md'
                />
              )}
            />
            {errors.body && (
              <p className='text-sm text-red-500'>{errors.body.message}</p>
            )}
          </div>

          {/* Cover Image URL */}
          <div className='grid gap-2'>
            <Label htmlFor='image_url'>Cover Image URL</Label>
            <Input
              id='image_url'
              placeholder='https://.../image.png'
              {...register('image_url')}
            />
            {errors.image_url && (
              <p className='text-sm text-red-500'>{errors.image_url.message}</p>
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
        </form>
      </CardContent>
    </Card>
  );
}
