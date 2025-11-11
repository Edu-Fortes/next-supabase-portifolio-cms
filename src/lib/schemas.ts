import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export const profileSchema = z.object({
  full_name: z.string().nullable().optional(),
  display_name: z
    .string()
    .min(3, { message: 'Display name must be at least 3 characters long' })
    .nullable()
    .optional(),
});

export const resetPasswordSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
});

export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // Set the error on the confirmPassword field
  });

export const portfolioProjectSchema = z.object({
  title: z
    .string()
    .min(3, { error: 'Title must be at least 3 characters long' }),
  description: z.string().optional(),
  body: z.string().optional(),
  github_url: z
    .url({ error: 'Must be a valid GitHub URL' })
    .optional()
    .or(z.literal('')),
  live_url: z
    .url({ error: 'Must be a valid Live URL' })
    .optional()
    .or(z.literal('')),
  image_url: z
    .url({ error: 'Must be a valid Image URL' })
    .optional()
    .or(z.literal('')),
});
