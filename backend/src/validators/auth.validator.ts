import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please provide a valid work email address'),
  password: z.string().min(4, 'Password must be at least 4 characters long'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  email: z.string().email('Please provide a valid work email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  name: z.string().min(2, 'Full practitioner name is required'),
  role: z.enum(['admin', 'director', 'physician']).optional(),
  title: z.string().optional(),
  hospital: z.string().optional(),
});
