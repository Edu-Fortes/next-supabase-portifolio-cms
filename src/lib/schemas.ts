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
