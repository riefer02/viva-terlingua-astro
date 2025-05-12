import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { setupEnvMocks } from '../../../setup/mocks/env-mocks';
import { setupStripeMocks } from '../../../setup/mocks/api-mocks';

// First import the modules we want to mock
import stripe from '@/lib/api/stripe-client';
import strapi from '@/lib/api/strapi-client';

// Use the setupStripeMocks helper to mock Stripe
const { stripeMock } = setupStripeMocks();

// Mock the strapi client with a factory function to avoid initialization errors
vi.mock('@/lib/api/strapi-client', () => {
  return {
    default: {
      collection: vi.fn(),
    },
  };
});

// Import the component after mocking
import { POST } from '@/pages/api/webhooks/stripe';

// Setup environment variables
const envMock = setupEnvMocks({
  STRIPE_WEBHOOK_SECRET: 'whsec_test123',
  PUBLIC_STRAPI_URL: 'https://test-cms.example.com',
  PUBLIC_STRAPI_API_TOKEN: 'test-token-123',
  SITE_URL: 'https://test.example.com',
  PUBLIC_TICKET_PRICE_ID: 'price_test123',
  PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_mock',
  STRIPE_SECRET_KEY: 'sk_test_mock',
});

describe('stripe-webhook API', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Set up mock implementations - use the properly typed stripeMock
    stripeMock.webhooks.constructEvent.mockImplementation(
      (payload, signature, secret) => {
        // Basic validation to simulate Stripe behavior
        if (!signature || signature === 'invalid_signature') {
          throw new Error('Invalid signature');
        }

        // Return a default event or parse the payload if it's a string
        const defaultEvent = {
          type: 'checkout.session.completed',
          data: {
            object: {
              id: 'cs_test_123',
              metadata: {},
              line_items: {
                data: [{ quantity: 1 }],
              },
              amount_total: 5000,
              payment_intent: 'pi_123',
            },
          },
          id: 'evt_test',
          object: 'event',
          api_version: '2020-08-27',
          created: 1661000000,
          livemode: false,
          pending_webhooks: 0,
          request: { id: null, idempotency_key: null },
        };

        return typeof payload === 'string'
          ? { ...defaultEvent, ...JSON.parse(payload) }
          : defaultEvent;
      }
    );

    // Create a mock for Strapi
    const createMock = vi.fn().mockResolvedValue({ data: { id: 1 } });

    // Mock collection method with proper type assertion
    const mockCollectionReturn = {
      create: createMock,
    };

    vi.mocked(strapi.collection).mockReturnValue(mockCollectionReturn as any);
  });

  afterAll(() => {
    // Clean up environment mocks
    envMock.cleanup();
  });

  it('verifies webhook signature and processes checkout.session.completed events', async () => {
    // Mock event data
    const mockEvent = {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_123',
          metadata: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '(555) 555-5555',
            isGift: 'false',
          },
          line_items: {
            data: [{ quantity: 2 }],
          },
          amount_total: 5000,
          payment_intent: 'pi_123',
        },
      },
      id: 'evt_test',
      object: 'event',
      api_version: '2020-08-27',
      created: 1661000000,
      livemode: false,
      pending_webhooks: 0,
      request: { id: null, idempotency_key: null },
    };

    // Mock webhook verification with proper type assertion
    stripeMock.webhooks.constructEvent.mockReturnValue(mockEvent as any);

    // Create request with signature - maintain consistency with port 4321
    const request = new Request('http://localhost:4321/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'sig_test123',
      },
      body: JSON.stringify(mockEvent),
    });

    // Mock request.text to return raw body
    request.text = vi.fn().mockResolvedValue(JSON.stringify(mockEvent));

    // Call the webhook handler
    const response = await POST({ request } as any);
    const responseData = await response.json();

    // Verify response
    expect(response.status).toBe(200);
    expect(responseData.received).toBe(true);

    // Verify signature verification
    expect(stripeMock.webhooks.constructEvent).toHaveBeenCalledWith(
      expect.any(String),
      'sig_test123',
      expect.any(String)
    );

    // Verify Strapi was called to create a ticket record
    expect(strapi.collection).toHaveBeenCalledWith('ticket-purchases');

    // Get the create mock directly from our implementation
    const createMock = vi.mocked(strapi.collection('ticket-purchases').create);
    expect(createMock).toHaveBeenCalledWith({
      data: expect.objectContaining({
        sessionId: 'cs_test_123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '(555) 555-5555',
        ticketCount: 2,
        isGift: false,
        status: 'completed',
        totalPaid: 5000,
        paymentId: 'pi_123',
      }),
    });
  });

  it('handles missing stripe signature', async () => {
    // Create request without signature - ensure consistent URL
    const request = new Request('http://localhost:4321/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Call the webhook handler
    const response = await POST({ request } as any);

    // Verify response
    expect(response.status).toBe(400);

    // Verify Strapi was not called
    expect(strapi.collection).not.toHaveBeenCalled();
  });

  it('handles signature verification errors', async () => {
    // Mock webhook verification throwing an error
    stripeMock.webhooks.constructEvent.mockImplementation(() => {
      throw new Error('Invalid signature');
    });

    // Create request with invalid signature - ensure consistent URL
    const request = new Request('http://localhost:4321/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'invalid_signature',
      },
      body: '{}',
    });

    // Mock request.text
    request.text = vi.fn().mockResolvedValue('{}');

    // Call the webhook handler
    const response = await POST({ request } as any);
    const responseData = await response.json();

    // Verify error response
    expect(response.status).toBe(500);
    expect(responseData.error).toBe('Invalid signature');

    // Verify Strapi was not called
    expect(strapi.collection).not.toHaveBeenCalled();
  });

  it('ignores non-checkout events', async () => {
    // Mock a different event type
    const mockEvent = {
      type: 'payment_intent.created',
      data: {
        object: {
          id: 'pi_test_123',
        },
      },
      id: 'evt_test',
      object: 'event',
      api_version: '2020-08-27',
      created: 1661000000,
      livemode: false,
      pending_webhooks: 0,
      request: { id: null, idempotency_key: null },
    };

    // Mock webhook verification with proper type assertion
    stripeMock.webhooks.constructEvent.mockReturnValue(mockEvent as any);

    // Create request - ensure consistent URL
    const request = new Request('http://localhost:4321/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'sig_test123',
      },
      body: JSON.stringify(mockEvent),
    });

    // Mock request.text
    request.text = vi.fn().mockResolvedValue(JSON.stringify(mockEvent));

    // Call the webhook handler
    const response = await POST({ request } as any);

    // Verify response is still successful
    expect(response.status).toBe(200);

    // Verify Strapi was not called for this event type
    expect(strapi.collection).not.toHaveBeenCalled();
  });
});
