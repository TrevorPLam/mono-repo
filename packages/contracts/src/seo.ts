import { z } from 'zod';

/**
 * SEO and metadata contracts
 */

// SEO metadata schema
export const SeoMetadataSchema = z.object({
  title: z.string().min(1).max(60),
  description: z.string().min(1).max(160),
  keywords: z.array(z.string()).optional(),
  canonical: z.string().url().optional(),
  noIndex: z.boolean().default(false),
  noFollow: z.boolean().default(false),
  openGraph: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().url().optional(),
    type: z.string().optional(),
    url: z.string().url().optional(),
  }).optional(),
  twitter: z.object({
    card: z.enum(['summary', 'summary_large_image']).optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().url().optional(),
  }).optional(),
  jsonLd: z.record(z.unknown()).optional(),
});

export type SeoMetadata = z.infer<typeof SeoMetadataSchema>;
