'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Tables } from '@/types/supabase';

import { contentSchema } from '@/lib/schemas';
import { createContent as createContentAction } from './actions';

// Import shadcn/ui components
import { Card, CardContent } from '@/components/ui/card';

// Import sub-components
import { ContentBodyEditor } from './components/content-body-editor';
import { ContentTypeSelector } from './components/content-type-selector';
import { ContentMetadataFields } from './components/content-metadata-fields';
import { ProjectFields } from './components/project-fields';
import { ContentImageField } from './components/content-image-field';
import { FormActions } from './components/form-actions';

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
          <ContentBodyEditor control={control} errors={errors} />

          {/* Sidebar with metadata and settings */}
          <div className='col-span-2 grid gap-8 sticky top-6'>
            {/* Content Type */}
            <ContentTypeSelector control={control} />

            {/* Title, Slug, Description */}
            <ContentMetadataFields control={control} errors={errors} />

            {/* Conditional Project Fields */}
            {contentType === 'PROJECT' && (
              <ProjectFields control={control} errors={errors} />
            )}

            {/* Cover Image URL */}
            <ContentImageField control={control} errors={errors} />

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
            <FormActions isPending={isPending} onCancel={() => router.back()} />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
