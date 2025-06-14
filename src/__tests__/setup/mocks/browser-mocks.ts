import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';

// Base URL for testing
const TEST_BASE_URL = 'http://localhost:3000';

// Window mock
export const windowMock = {
  location: {
    href: TEST_BASE_URL,
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
    pathname: '/',
    search: '',
    hash: '',
    origin: TEST_BASE_URL,
    protocol: 'http:',
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000',
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
  clipboard: {
    writeText: vi.fn(),
    readText: vi.fn(),
  },
  language: 'en-US',
  languages: ['en-US', 'en'],
};

// User-event setup with disabled pointer events checks
export function setupUserEvent() {
  // Create a pre-configured user event
  return userEvent.setup({
    pointerEventsCheck: 0, // Disable pointer events checks
    skipHover: true, // Skip hover events
  });
}

// Setup browser environment for tests
export function setupBrowserEnvironment() {
  // Define window globally if not already defined
  if (typeof window === 'undefined' || !window) {
    (global as any).window = { ...windowMock };
  } else {
    // For properties like window.location that might be read-only,
    // we need to use Object.defineProperty instead of direct assignment

    // Create our mock location with all necessary properties
    const mockLocation = {
      ...windowMock.location,
      // Add private properties to store values
      _href: TEST_BASE_URL,
    };

    // Define proper getters and setters for all location properties
    Object.defineProperty(window, 'location', {
      configurable: true,
      get: () => mockLocation,
      set: (newLocation) => {
        // When location is assigned directly (window.location = "https://example.com")
        if (typeof newLocation === 'string') {
          mockLocation._href = newLocation;
          mockLocation.href = newLocation;
        } else {
          Object.assign(mockLocation, newLocation);
        }
      },
    });

    // For href specifically, ensure we can modify it
    Object.defineProperty(mockLocation, 'href', {
      configurable: true,
      get: () => mockLocation._href || TEST_BASE_URL,
      set: (value) => {
        // Handle both absolute and relative URLs
        if (value.startsWith('http')) {
          mockLocation._href = value;
        } else if (value.startsWith('/')) {
          mockLocation._href = `${TEST_BASE_URL}${value}`;
        } else {
          mockLocation._href = `${TEST_BASE_URL}/${value}`;
        }
        // Trigger the mock functions to track calls
        mockLocation.assign.mock.calls.push([value]);
      },
    });

    // Add other window properties safely
    Object.keys(windowMock).forEach((key) => {
      if (key !== 'location') {
        try {
          // Use type assertion to avoid TypeScript errors with indexing
          (window as any)[key] = (windowMock as any)[key];
        } catch (e) {
          console.warn(`Could not mock window.${key}:`, e);
        }
      }
    });
  }

  // Define navigator for user-event if not already defined
  if (typeof navigator === 'undefined' || !navigator) {
    // Create a mock navigator
    (global as any).navigator = {
      ...navigatorMock,
      userAgent: 'node.js',
    };
  } else {
    // For existing navigator, we need to be careful with properties that might be getters
    // Don't try to assign directly to navigator
    // Instead, define clipboard if it doesn't exist
    if (!navigator.clipboard) {
      Object.defineProperty(navigator, 'clipboard', {
        value: navigatorMock.clipboard,
        configurable: true,
      });
    }
  }

  // Create a pre-configured user event instance instead of modifying the original
  const userEventInstance = setupUserEvent();

  // Reset all mocks
  vi.resetAllMocks();

  return { window, navigator, userEvent: userEventInstance };
}

// Cleanup function to reset all mocks
export function cleanupBrowserMocks() {
  vi.resetAllMocks();

  // Reset window.location.href to base URL if it exists
  if (window && window.location) {
    try {
      const mockLocation = window.location as any;
      if (mockLocation._href) {
        mockLocation._href = TEST_BASE_URL;
      }
    } catch (e) {
      console.warn('Could not reset window.location.href:', e);
    }
  }
}
