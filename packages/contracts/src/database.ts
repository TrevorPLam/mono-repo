import { z } from 'zod';

/**
 * Database schema contracts
 */

// Integration credential schema
export const IntegrationCredentialSchema = z.object({
  id: z.string().uuid(),
  organizationId: z.string().uuid(),
  platform: z.string(),
  encryptedPayload: z.string(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type IntegrationCredential = z.infer<typeof IntegrationCredentialSchema>;
