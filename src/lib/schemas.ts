import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email({ error: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { error: 'Password must be at least 6 characters long' }),
});

export const profileSchema = z.object({
  full_name: z.string().nullable().optional(),
  display_name: z
    .string()
    .min(3, { error: 'Display name must be at least 3 characters long' })
    .nullable()
    .optional(),
});

export const resetPasswordSchema = z.object({
  email: z.email({ error: 'Invalid email address' }),
});

export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { error: 'Password must be at least 6 characters long' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'], // Set the error on the confirmPassword field
  });

export const contentSchema = z.object({
  title: z.string().min(3, {
    error: 'Title must be at least 3 characters.',
  }),
  slug: z
    .string()
    .min(3, {
      error: 'Slug must be at least 3 characters.',
    })
    .regex(/^[a-z0-9-]+$/, {
      error: 'Slug must be lowercase with no spaces (e.g., "my-new-post").',
    }),
  content_type: z.enum(['PROJECT', 'ARTICLE']), // Enforce our two types
  description: z.string().optional(),
  body: z.string().optional(), // The MDX content
  image_url: z
    .url({ error: 'Must be a valid URL.' })
    .optional()
    .or(z.literal('')),

  // Project-specific fields
  github_url: z
    .url({ error: 'Must be a valid URL.' })
    .optional()
    .or(z.literal('')),
  live_url: z
    .url({ error: 'Must be a valid URL.' })
    .optional()
    .or(z.literal('')),
});
