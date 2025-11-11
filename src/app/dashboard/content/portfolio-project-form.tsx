'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Tables } from '@/types/supabase';

import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

import { portfolioProjectSchema } from '@/lib/schemas';
import { createPortfolioProject as createProjectAction } from './actions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // We'll need this
import { Card, CardContent } from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { cn } from '@/lib/utils';

// Define the form's data type
type ProjectFormValues = z.infer<typeof portfolioProjectSchema>;

// Define the props
interface ProjectFormProps {
  // We'll pass in existing project data when we build the 'Edit' page
  project?: Tables<'portfolio_projects'>;
  action: 'create' | 'update';
}

export function PortfolioProjectForm({
  project,
  action,
  className,
}: ProjectFormProps & { className?: string }) {
  const router = useRouter();
  const [message, setMessage] = useState<
    { text: string; type: 'success' | 'error' } | undefined
  >();
  const [isPending, startTransition] = useTransition();

  const { control, handleSubmit } = useForm<ProjectFormValues>({
    resolver: zodResolver(portfolioProjectSchema),
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      body: project?.body || '',
      github_url: project?.github_url || '',
      live_url: project?.live_url || '',
      image_url: project?.image_url || '',
    },
  });

  // The 'onSubmit' function, client-side
  const onSubmit = (data: ProjectFormValues) => {
    setMessage(undefined); // Clear previous messages

    startTransition(async () => {
      let result: { message: string; type: 'success' | 'error' } | undefined;

      if (action === 'create') {
        result = await createProjectAction(data);
      } else {
        // We'll build this 'update' action next
        // result = await updateProjectAction(project!.id, data)
      }

      if (result?.message) {
        setMessage({ text: result.message, type: result.type });
      }
    });
  };

  return (
    <div className={cn('w-full m-auto', className)}>
      <form
        id='portfolio-project-form'
        onSubmit={handleSubmit(onSubmit)}
        className='grid gap-6 grid-cols-3 grid-rows-2'
      >
        <Field className='col-span-2 row-span-2'>
          <Controller
            name='body'
            control={control}
            render={({ field }) => (
              <SimpleMDE
                {...field}
                id='portfolio-project-form-body'
                placeholder='Write you full case study here... (Supports Markdown)'
              />
            )}
          />
        </Field>
        <Card className='w-full m-auto col-span-1 row-span-1'>
          <CardContent>
            <div>
              <FieldGroup>
                {/* Title */}
                <Controller
                  name='title'
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='portfolio-project-form-title'>
                        Title
                      </FieldLabel>
                      <Input
                        {...field}
                        id='portfolio-project-form-title'
                        aria-invalid={fieldState.invalid}
                        placeholder='Project title'
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                {/* Description */}
                <Controller
                  name='description'
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='portfolio-project-form-description'>
                        Description
                      </FieldLabel>
                      <Textarea
                        {...field}
                        id='portfolio-project-form-description'
                        aria-invalid={fieldState.invalid}
                        placeholder='A short description of your project...'
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                {/* GitHub URL */}
                <Controller
                  name='github_url'
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='portfolio-project-form-github-url'>
                        GitHub URL
                      </FieldLabel>
                      <Input
                        {...field}
                        id='portfolio-project-form-github-url'
                        aria-invalid={fieldState.invalid}
                        placeholder='https://github.com/...'
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Live URL */}
                <Controller
                  name='live_url'
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='portfolio-project-form-live-url'>
                        Live URL
                      </FieldLabel>
                      <Input
                        {...field}
                        id='portfolio-project-form-live-url'
                        aria-invalid={fieldState.invalid}
                        placeholder='https://myproject.com'
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Image URL */}
                <Controller
                  name='image_url'
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='portfolio-project-form-image-url'>
                        Image URL
                      </FieldLabel>
                      <Input
                        {...field}
                        id='portfolio-project-form-image-url'
                        aria-invalid={fieldState.invalid}
                        placeholder='https://.../image.png'
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              {/* Server Message */}
              {message && (
                <p
                  className={`text-sm font-medium ${
                    message.type === 'error' ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  {message.text}
                </p>
              )}

              {/* Actions */}
              <div className='flex justify-end gap-2 mt-8'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={isPending}>
                  {isPending ? 'Saving...' : 'Save Project'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
