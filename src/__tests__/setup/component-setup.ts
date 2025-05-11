import { render, screen } from '@testing-library/react';
import { cleanup } from '@testing-library/react';
import { vi, afterEach } from 'vitest';

// Import our centralized mocks
import { setupBrowserEnvironment, cleanupBrowserMocks } from './mocks/browser-mocks';
import { setupFetchMock, cleanupApiMocks } from './mocks/api-mocks';
import { setupEnvMocks } from './mocks/env-mocks';

// Setup for any component test
export function setupComponentTest() {
  // Set up browser environment
  const browserEnv = setupBrowserEnvironment();
  
  // Set up fetch mock
  const fetchMock = setupFetchMock();
  
  // Set up environment variables
  const envMock = setupEnvMocks();
  
  // Return utilities for the test
  return {
    screen,
    render,
    browserEnv,
    fetchMock,
    env: envMock.env,
    
    // Cleanup function to be called after each test
    cleanup: () => {
      cleanup(); // Clean up React testing library
      cleanupBrowserMocks();
      cleanupApiMocks();
      envMock.cleanup();
    }
  };
}

// Simplified render for Astro components converted to React
export async function renderAstro(Component: any, props: any = {}) {
  // Set up the component test environment
  const utils = setupComponentTest();
  
  // Render the component
  const renderResult = render(<Component {...props} />);
  
  return {
    ...renderResult,
    ...utils,
  };
}

// Automatically clean up after each test
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
}); 