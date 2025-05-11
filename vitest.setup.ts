/// <reference types="node" />
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

// Import centralized mocks
import { setupBrowserEnvironment } from './src/__tests__/setup/mocks/browser-mocks';
import { setupFetchMock } from './src/__tests__/setup/mocks/api-mocks';
import { setupEnvMocks } from './src/__tests__/setup/mocks/env-mocks';

/**
 * Test setup file for Vitest
 *
 * This file handles necessary polyfills and global setup for tests.
 * It integrates the centralized mock system for consistent test behavior.
 *
 * The main issues addressed here:
 * 1. TextEncoder/Decoder - esbuild checks require proper implementations
 * 2. Browser API mocks - window, navigator, clipboard, etc.
 * 3. Fetch API mocks - for consistent API testing
 * 4. Environment variable mocks - for consistent environment
 * 5. Astro Container - needed for testing Astro components
 */

// Setup the browser environment with all mocks
setupBrowserEnvironment();

// Setup fetch API mock
setupFetchMock();

// Setup environment variables
const envMock = setupEnvMocks();

// Setup for Astro Container testing
let container: Awaited<ReturnType<typeof AstroContainer.create>> | null = null;

beforeEach(async () => {
  // Reset all mocks before each test
  vi.resetAllMocks();

  // Create a fresh Astro container
  container = await AstroContainer.create();
});

afterEach(() => {
  // Clean up Astro container
  container = null;

  // Clean up React testing library
  cleanup();

  // Reset all mocks
  vi.resetAllMocks();
});

// Export the container for tests that need direct access
export { container };
