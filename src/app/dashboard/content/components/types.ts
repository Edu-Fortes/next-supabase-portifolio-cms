import { z } from 'zod';
import { contentSchema } from '@/lib/schemas';

export type ContentFormValues = z.infer<typeof contentSchema>;
