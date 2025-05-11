/**
 * Stripe API mocks for testing
 * This file provides consistent Stripe mocks for API tests
 */
import { vi } from 'vitest';

// Create mock Stripe client with common test methods
export const mockStripeClient = {
  checkout: {
    sessions: {
      create: vi.fn().mockResolvedValue({
        id: 'test_session_id',
        url: 'https://checkout.stripe.com/pay/test_session_id',
      }),
    },
  },
  webhooks: {
    constructEvent: vi.fn().mockImplementation((payload, signature, secret) => {
      // Basic validation to simulate Stripe behavior
      if (!signature || signature === 'invalid_signature') {
        throw new Error('Invalid signature');
      }

      // Return mock event based on payload
      return typeof payload === 'string' ? JSON.parse(payload) : payload;
    }),
  },
};

// Create mock for environment variables related to Stripe
export const mockStripeEnv = {
  STRIPE_SECRET_KEY: 'sk_test_mock_key_for_tests',
  STRIPE_WEBHOOK_SECRET: 'whsec_test_mock_webhook_secret',
  PUBLIC_TICKET_PRICE_ID: 'price_test_mock_price_id',
  SITE_URL: 'https://test.example.com',
};

// Helper to setup Stripe mocks for a test file
export function setupStripeMocks() {
  // Mock the stripe client module
  vi.mock('@/lib/api/stripe-client', () => ({
    default: mockStripeClient,
  }));

  // Mock environment variables
  vi.mock('import.meta.env', () => mockStripeEnv);

  return { mockStripeClient, mockStripeEnv };
}
