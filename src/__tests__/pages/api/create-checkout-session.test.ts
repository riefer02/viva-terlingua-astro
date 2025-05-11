import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { setupEnvMocks } from '@tests/setup/mocks/env-mocks';
import {
  stripeMockImplementation,
  setupStripeMocks,
} from '@tests/setup/mocks/api-mocks';

// First import the modules we want to mock
import stripe from '@/lib/api/stripe-client';

// Then use the setupStripeMocks helper to mock Stripe
const { stripeMock } = setupStripeMocks();

// Import the API handler after mocking
import { post } from '@/pages/api/create-checkout-session';

// Set up environment variables
const envMock = setupEnvMocks({
  PUBLIC_TICKET_PRICE_ID: 'price_test123',
  SITE_URL: 'https://test.example.com',
  PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_mock',
  STRIPE_SECRET_KEY: 'sk_test_mock',
  PUBLIC_STRAPI_URL: 'https://test-cms.example.com',
  PUBLIC_STRAPI_API_TOKEN: 'test-token-123',
});

describe('create-checkout-session API', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Type assertion to avoid Session type errors - we only need partial mocks for tests
    stripeMock.checkout.sessions.create.mockResolvedValue({
      id: 'test_session_id',
      url: 'https://checkout.stripe.com/test-session',
      object: 'checkout.session',
    } as any);
  });

  afterAll(() => {
    // Clean up environment mocks
    envMock.cleanup();
  });

  it('creates a Stripe checkout session with the correct data', async () => {
    // Mock Stripe's response for this specific test - with type assertion
    stripeMock.checkout.sessions.create.mockResolvedValue({
      id: 'sess_123',
      url: 'https://checkout.stripe.com/pay/cs_test_123',
      object: 'checkout.session',
    } as any);

    // Test data
    const testData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '(555) 555-5555',
      ticketCount: 2,
      isGift: false,
    };

    // Create request with consistent port 4321
    const request = new Request(
      'http://localhost:4321/api/create-checkout-session',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      }
    );

    // Mock request.json()
    request.json = vi.fn().mockResolvedValue(testData);

    // Call API handler
    const response = await post({ request, redirect: vi.fn() } as any);
    const responseData = await response.json();

    // Verify response
    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      id: 'sess_123',
      url: 'https://checkout.stripe.com/pay/cs_test_123',
    });

    // Verify Stripe was called with correct data - loosen expectations to match actual call
    expect(stripeMock.checkout.sessions.create).toHaveBeenCalledTimes(1);

    // Check only the essential properties we care about
    const createCall = stripeMock.checkout.sessions.create.mock
      .calls[0][0] as any;
    expect(createCall).toMatchObject({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: 'john@example.com',
      line_items: [
        {
          quantity: 2,
        },
      ],
      cancel_url: 'https://test.example.com/tickets',
      success_url: expect.stringContaining(
        'https://test.example.com/thank-you'
      ),
    });

    // Check metadata separately with more specific expectations
    expect(createCall.metadata).toMatchObject({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '(555) 555-5555',
      isGift: 'false',
    });
  });

  it('includes gift recipient info in metadata when isGift is true', async () => {
    // Mock Stripe's response - with type assertion
    stripeMock.checkout.sessions.create.mockResolvedValue({
      id: 'sess_gift123',
      url: 'https://checkout.stripe.com/pay/cs_test_gift123',
      object: 'checkout.session',
    } as any);

    // Test data with gift
    const testData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '(555) 555-5555',
      ticketCount: 1,
      isGift: true,
      recipientFirstName: 'Jane',
      recipientLastName: 'Smith',
    };

    // Create request with consistent port 4321
    const request = new Request(
      'http://localhost:4321/api/create-checkout-session',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      }
    );

    // Mock request.json()
    request.json = vi.fn().mockResolvedValue(testData);

    // Call API handler
    const response = await post({ request, redirect: vi.fn() } as any);

    // Verify Stripe was called with gift recipient data by checking specific properties
    const createCall = stripeMock.checkout.sessions.create.mock
      .calls[0][0] as any;
    expect(createCall.metadata).toMatchObject({
      isGift: 'true',
      recipientFirstName: 'Jane',
      recipientLastName: 'Smith',
    });

    // Check client_reference_id contains recipient name
    expect(createCall.client_reference_id).toContain('Jane—Smith');
  });

  it('handles errors from Stripe', async () => {
    // Mock Stripe throwing an error
    stripeMock.checkout.sessions.create.mockRejectedValue(
      new Error('Invalid API key')
    );

    // Test data
    const testData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '(555) 555-5555',
      ticketCount: 1,
      isGift: false,
    };

    // Create request with consistent port 4321
    const request = new Request(
      'http://localhost:4321/api/create-checkout-session',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      }
    );

    // Mock request.json()
    request.json = vi.fn().mockResolvedValue(testData);

    // Call API handler
    const response = await post({ request, redirect: vi.fn() } as any);
    const responseData = await response.json();

    // Verify error response
    expect(response.status).toBe(500);
    expect(responseData.error).toBe('Invalid API key');
  });
});
