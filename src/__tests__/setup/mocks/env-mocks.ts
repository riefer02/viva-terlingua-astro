import { vi } from 'vitest';

// Default environment variable mocks
export const envMocks = {
  STRIPE_SECRET_KEY: 'sk_test_mock',
  STRIPE_WEBHOOK_SECRET: 'whsec_test_mock',
  PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_mock',
  PUBLIC_STRAPI_URL: 'http://localhost:1337',
  PUBLIC_SITE_URL: 'http://localhost:3000',
};

// Set up environment mocks
export function setupEnvMocks(customEnv?: Record<string, string>) {
  const envToUse = { ...envMocks, ...customEnv };

  // Store original env to restore later
  const originalEnv = { ...process.env };

  // Set environment variables
  Object.entries(envToUse).forEach(([key, value]) => {
    vi.stubEnv(key, value);
  });

  return {
    env: envToUse,
    // Function to restore original environment
    cleanup: () => {
      // Reset all stubbed environment variables
      Object.keys(envToUse).forEach((key) => {
        vi.unstubAllEnvs();
      });

      // Restore original environment variables
      process.env = originalEnv;
    },
  };
}

// Shorthand function to setup common testing environments
export function setupTestEnv(
  options: {
    strapiUrl?: string;
    stripeKey?: string;
    webhookSecret?: string;
    siteUrl?: string;
  } = {}
) {
  return setupEnvMocks({
    PUBLIC_STRAPI_URL: options.strapiUrl || envMocks.PUBLIC_STRAPI_URL,
    STRIPE_SECRET_KEY: options.stripeKey || envMocks.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET:
      options.webhookSecret || envMocks.STRIPE_WEBHOOK_SECRET,
    PUBLIC_SITE_URL: options.siteUrl || envMocks.PUBLIC_SITE_URL,
  });
}
