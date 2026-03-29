/**
 * @repo/contracts
 * 
 * Shared schemas, types, and validation contracts for the monorepo.
 * 
 * This package provides:
 * - Type-safe data validation schemas
 * - Shared TypeScript interfaces
 * - API contract definitions
 * - Database schema types
 * - Analytics event contracts
 */

// Re-export all modules
export * from './analytics';
export * from './auth';
export * from './database';
export * from './seo';

/**
 * Common utility types used across the monorepo
 */

// Database ID types
export type DatabaseId = string & { readonly __brand: unique symbol };
export type UserId = DatabaseId;
export type OrganizationId = DatabaseId;
export type SessionId = DatabaseId;
export type ProjectId = DatabaseId;

// Helper to create database IDs
export function createDatabaseId(id: string): DatabaseId {
  return id as DatabaseId;
}

// Common response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Common entity types
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface TimestampedEntity {
  createdAt: string;
  updatedAt: string;
}

// Environment types
export type Environment = 'development' | 'staging' | 'production';

// Feature flag types
export interface FeatureFlag {
  key: string;
  enabled: boolean;
  conditions?: Record<string, unknown>;
}

// Common validation errors
export interface ValidationError {
  field: string;
  code: string;
  message: string;
  value?: unknown;
}

export interface ValidationResult<T = unknown> {
  valid: boolean;
  data?: T;
  errors?: ValidationError[];
}
