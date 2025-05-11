import { describe, it, expect, vi, beforeEach } from 'vitest';
import { post } from '@/pages/api/webhooks/stripe';
import { setupEnvMocks } from '../../../setup/mocks/env-mocks';

// Pre-define mocks before vi.mock() calls to avoid hoisting issues
const constructEventMock = vi.fn();
const stripeMock = {
  webhooks: {
    constructEvent: constructEventMock,
  },
};

// Create a more robust mock for Strapi
const createMock = vi.fn().mockResolvedValue({ data: { id: 1 } });
const strapiMock = {
  collection: vi.fn().mockReturnValue({
    create: createMock,
  }),
};

// Mock stripe and strapi clients
vi.mock('@/lib/api/stripe-client', () => ({
  default: stripeMock,
}));

vi.mock('@/lib/api/strapi-client', () => ({
  default: strapiMock,
  __createMock: createMock, // Export mock for reference
}));

// Import after mocking
import stripe from '@/lib/api/stripe-client';
import strapi from '@/lib/api/strapi-client';

// Setup environment variables
const envMock = setupEnvMocks({
  STRIPE_WEBHOOK_SECRET: 'whsec_test123',
});

describe('stripe-webhook API', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Reset specific mocks
    createMock.mockClear();
    constructEventMock.mockReset();
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
    };

    // Mock webhook verification
    constructEventMock.mockReturnValue(mockEvent);

    // Create request with signature
    const request = new Request('http://localhost:4321/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'sig_test123',
      },
    });

    // Mock request.text to return raw body
    request.text = vi.fn().mockResolvedValue(JSON.stringify(mockEvent));

    // Call the webhook handler
    const response = await post({ request } as any);
    const responseData = await response.json();

    // Verify response
    expect(response.status).toBe(200);
    expect(responseData.received).toBe(true);

    // Verify signature verification
    expect(stripe.webhooks.constructEvent).toHaveBeenCalledWith(
      expect.any(String),
      'sig_test123',
      expect.any(String)
    );

    // Verify Strapi was called to create a ticket record
    expect(strapi.collection).toHaveBeenCalledWith('ticket-purchases');
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
    // Create request without signature
    const request = new Request('http://localhost:4321/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Call the webhook handler
    const response = await post({ request } as any);

    // Verify response
    expect(response.status).toBe(400);

    // Verify Strapi was not called
    expect(strapi.collection).not.toHaveBeenCalled();
  });

  it('handles signature verification errors', async () => {
    // Mock webhook verification throwing an error
    constructEventMock.mockImplementation(() => {
      throw new Error('Invalid signature');
    });

    // Create request with invalid signature
    const request = new Request('http://localhost:4321/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'invalid_signature',
      },
    });

    // Mock request.text
    request.text = vi.fn().mockResolvedValue('{}');

    // Call the webhook handler
    const response = await post({ request } as any);
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
    };

    // Mock webhook verification
    constructEventMock.mockReturnValue(mockEvent);

    // Create request
    const request = new Request('http://localhost:4321/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'sig_test123',
      },
    });

    // Mock request.text
    request.text = vi.fn().mockResolvedValue(JSON.stringify(mockEvent));

    // Call the webhook handler
    const response = await post({ request } as any);

    // Verify response is still successful
    expect(response.status).toBe(200);

    // Verify Strapi was not called for this event type
    expect(strapi.collection).not.toHaveBeenCalled();
  });
});
