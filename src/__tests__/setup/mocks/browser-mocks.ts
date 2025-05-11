import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';

// Window mock
export const windowMock = {
  location: {
    href: '',
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
    pathname: '/',
    search: '',
    hash: '',
  },
  localStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
  sessionStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
  scrollTo: vi.fn(),
  dispatchEvent: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

// Navigator mock
export const navigatorMock = {
  userAgent: 'node.js',
  clipboard: {
    writeText: vi.fn(),
    readText: vi.fn(),
  },
  language: 'en-US',
  languages: ['en-US', 'en'],
};

// User-event setup with disabled clipboard and pointer events checks
export function setupUserEvent() {
  // Store the original setup function
  const originalSetup = userEvent.setup;

  // Override the setup function
  userEvent.setup = function setupMock(options = {}) {
    return originalSetup({
      ...options,
      pointerEventsCheck: 0, // Disable pointer events checks
      skipHover: true, // Skip hover events
      skipPointerEventsCheck: true, // Skip pointer events checks
    });
  };

  return userEvent;
}

// Setup browser environment for tests
export function setupBrowserEnvironment() {
  // Define window globally if not already defined
  if (typeof window === 'undefined' || !window) {
    global.window = { ...windowMock } as any;
  } else {
    // Update existing window with mock properties
    Object.assign(window, windowMock);
  }

  // Define navigator for user-event if not already defined
  if (typeof navigator === 'undefined' || !navigator) {
    global.navigator = { ...navigatorMock } as any;
  } else {
    // Update existing navigator with mock properties
    Object.assign(navigator, navigatorMock);
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

  // Setup user-event with appropriate options
  setupUserEvent();

  // Reset all mocks
  vi.resetAllMocks();

  return { window, navigator, userEvent };
}

// Cleanup function to reset all mocks
export function cleanupBrowserMocks() {
  vi.resetAllMocks();
}
