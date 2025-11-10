'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Tables } from '@/types/supabase';

import { portfolioProjectSchema } from '@/lib/schemas';
// We'll rename the action on import to avoid a name clash
import { createPortfolioProject as createProjectAction } from './actions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // We'll need this
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Define the form's data type
type ProjectFormValues = z.infer<typeof portfolioProjectSchema>;

// Define the props
interface ProjectFormProps {
  // We'll pass in existing project data when we build the 'Edit' page
  project?: Tables<'portfolio_projects'>;
  action: 'create' | 'update';
}

export function PortfolioProjectForm({ project, action }: ProjectFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState<
    { text: string; type: 'success' | 'error' } | undefined
  >();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(portfolioProjectSchema),
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
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
    <Card className='max-w-3xl'>
      <CardHeader>
        <CardTitle>
          {action === 'create' ? 'Create New Project' : 'Edit Project'}
        </CardTitle>
        <CardDescription>
          Fill out the details for your portfolio project.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='grid gap-6'>
          {/* Title */}
          <div className='grid gap-2'>
            <Label htmlFor='title'>Title</Label>
            <Input
              id='title'
              placeholder='Project title'
              {...register('title')}
            />
            {errors.title && (
              <p className='text-sm font-medium text-red-500'>
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className='grid gap-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              placeholder='A short description of your project...'
              {...register('description')}
            />
            {errors.description && (
              <p className='text-sm font-medium text-red-500'>
                {errors.description.message}
              </p>
            )}
          </div>

          {/* GitHub URL */}
          <div className='grid gap-2'>
            <Label htmlFor='github_url'>GitHub URL</Label>
            <Input
              id='github_url'
              placeholder='https://github.com/...'
              {...register('github_url')}
            />
            {errors.github_url && (
              <p className='text-sm font-medium text-red-500'>
                {errors.github_url.message}
              </p>
            )}
          </div>

          {/* Live URL */}
          <div className='grid gap-2'>
            <Label htmlFor='live_url'>Live URL</Label>
            <Input
              id='live_url'
              placeholder='https://myproject.com'
              {...register('live_url')}
            />
            {errors.live_url && (
              <p className='text-sm font-medium text-red-500'>
                {errors.live_url.message}
              </p>
            )}
          </div>

          {/* Image URL */}
          <div className='grid gap-2'>
            <Label htmlFor='image_url'>Image URL</Label>
            <Input
              id='image_url'
              placeholder='https://.../image.png'
              {...register('image_url')}
            />
            {errors.image_url && (
              <p className='text-sm font-medium text-red-500'>
                {errors.image_url.message}
              </p>
            )}
          </div>

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
          <div className='flex justify-end gap-2'>
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
        </form>
      </CardContent>
    </Card>
  );
}
