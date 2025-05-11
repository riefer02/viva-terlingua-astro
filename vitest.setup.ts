/// <reference types="node" />
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

// Import centralized mocks
import { setupBrowserEnvironment } from '@tests/setup/mocks/browser-mocks';
import { setupFetchMock } from '@tests/setup/mocks/api-mocks';
import { setupEnvMocks } from '@tests/setup/mocks/env-mocks';

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

// Clear React testing library's render
afterEach(() => {
  cleanup();
});

// Initialize browser environment before each test
beforeEach(() => {
  // Setup centralized mocks
  setupBrowserEnvironment();
  setupFetchMock();
  setupEnvMocks();

  // Reset all mocks before each test
  vi.resetAllMocks();
});

// Polyfill TextEncoder/Decoder for esbuild checks
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
  global.ArrayBuffer = ArrayBuffer;
}

// Make AstroContainer available to tests - avoid directly manipulating global
try {
  (global as any).AstroContainer = AstroContainer;
} catch (e) {
  console.warn('Could not set AstroContainer:', e);
}
