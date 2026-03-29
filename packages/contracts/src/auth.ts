import { z } from 'zod';

/**
 * Authentication and authorization contracts
 */

// User schema
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(['admin', 'user', 'viewer']),
  organizationId: z.string().uuid(),
  isActive: z.boolean(),
  lastLoginAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Organization schema
export const OrganizationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  domain: z.string().url().optional(),
  plan: z.enum(['free', 'pro', 'enterprise']),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Session schema
export const SessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  token: z.string(),
  expiresAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  lastAccessAt: z.string().datetime(),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;
export type Organization = z.infer<typeof OrganizationSchema>;
export type Session = z.infer<typeof SessionSchema>;
