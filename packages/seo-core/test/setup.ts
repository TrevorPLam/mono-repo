import { vi } from 'vitest'

// Mock any external dependencies if needed
// This setup file runs before each test file

// Global test utilities can be added here
declare global {
  namespace Vi {
    interface JestAssertion<T = any> extends jest.Matchers<T, any> {}
  }
}
