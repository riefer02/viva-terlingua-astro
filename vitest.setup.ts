/// <reference types="node" />
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

/**
 * Test setup file for Vitest
 *
 * This file handles necessary polyfills and global setup for tests.
 *
 * The main issues addressed here:
 * 1. TextEncoder/Decoder - esbuild checks require proper implementations
 * 2. Clipboard API - needed for user-event in happy-dom environment
 * 3. Astro Container - needed for testing Astro components
 */

// Mock clipboard API for happy-dom
// This prevents errors with @testing-library/user-event which tries to use clipboard API
if (typeof navigator !== 'undefined' && !navigator.clipboard) {
  try {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn(),
        readText: vi.fn(),
      },
      configurable: true,
    });
  } catch (e) {
    console.warn('Failed to mock clipboard API:', e);
  }
}

// Setup for Astro Container testing
let container: Awaited<ReturnType<typeof AstroContainer.create>> | null = null;

beforeEach(async () => {
  container = await AstroContainer.create();
});

afterEach(() => {
  container = null;
  cleanup();
});
