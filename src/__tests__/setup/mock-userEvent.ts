/**
 * Mock for user-event to avoid clipboard-related errors in happy-dom
 */
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

// Mock the userEvent.setup function to return a limited version that doesn't use clipboard
const originalSetup = userEvent.setup;

// Override the setup function
userEvent.setup = function setupMock(options = {}) {
  const user = originalSetup({
    ...options,
    pointerEventsCheck: 0, // Disable pointer events checks
    skipHover: true, // Skip hover events
    skipPointerEventsCheck: true, // Skip pointer events checks
  });

  return user;
};

// Mock clipboard globally using Object.defineProperty
if (typeof navigator !== 'undefined') {
  const mockClipboard = {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
    // Add other clipboard methods as needed
  };

  // Override existing clipboard property
  try {
    Object.defineProperty(navigator, 'clipboard', {
      value: mockClipboard,
      configurable: true,
      writable: true,
    });
  } catch (e) {
    console.warn('Failed to mock clipboard API:', e);
  }
}

export default userEvent;
