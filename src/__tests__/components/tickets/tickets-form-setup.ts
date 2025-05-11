/**
 * Setup for TicketsForm test
 */
import { vi } from 'vitest';

// Set up environment
export function setupEnvironment() {
  // Define window globally if not already defined
  if (typeof window === 'undefined' || !window) {
    global.window = {
      location: {
        href: '',
      },
    } as any;
  } else if (!window.location) {
    window.location = { href: '' } as any;
  }

  // Define navigator for user-event if not already defined
  if (typeof navigator === 'undefined' || !navigator) {
    global.navigator = {
      userAgent: 'node.js',
    } as any;
  }

  // Add clipboard mock
  if (!navigator.clipboard) {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn(),
        readText: vi.fn(),
      },
      configurable: true,
    });
  }

  // Mock fetch API if not already mocked
  if (!global.fetch) {
    global.fetch = vi.fn();
  }

  return { window, navigator, fetch: global.fetch };
}
