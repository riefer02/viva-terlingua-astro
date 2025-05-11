import { describe, it, expect, vi, beforeEach } from 'vitest';
import { post } from '@/pages/api/create-checkout-session';

// Mock stripe client
vi.mock('@/lib/api/stripe-client', () => ({
  default: {
    checkout: {
      sessions: {
        create: vi.fn(),
      },
    },
  },
}));

// Import after mocking
import stripe from '@/lib/api/stripe-client';

// Mock environment variables
vi.mock('import.meta.env', () => ({
  PUBLIC_TICKET_PRICE_ID: 'price_test123',
  SITE_URL: 'https://test.example.com',
}));

describe('create-checkout-session API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('creates a Stripe checkout session with the correct data', async () => {
    // Mock Stripe's response
    (stripe.checkout.sessions.create as any).mockResolvedValue({
      id: 'sess_123',
      url: 'https://checkout.stripe.com/pay/cs_test_123',
    });

    // Test data
    const testData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '(555) 555-5555',
      ticketCount: 2,
      isGift: false,
    };

    // Create request
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

    // Verify Stripe was called with correct data
    expect(stripe.checkout.sessions.create).toHaveBeenCalledTimes(1);
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price: expect.any(String),
            quantity: 2,
          },
        ],
        customer_email: 'john@example.com',
        metadata: expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '(555) 555-5555',
          isGift: 'false',
        }),
      })
    );
  });

  it('includes gift recipient info in metadata when isGift is true', async () => {
    // Mock Stripe's response
    (stripe.checkout.sessions.create as any).mockResolvedValue({
      id: 'sess_gift123',
      url: 'https://checkout.stripe.com/pay/cs_test_gift123',
    });

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

    // Create request
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

    // Verify Stripe was called with gift recipient data
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({
          isGift: 'true',
          recipientFirstName: 'Jane',
          recipientLastName: 'Smith',
        }),
        client_reference_id: expect.stringContaining('Jane—Smith'),
      })
    );
  });

  it('handles errors from Stripe', async () => {
    // Mock Stripe throwing an error
    (stripe.checkout.sessions.create as any).mockRejectedValue(
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

    // Create request
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
