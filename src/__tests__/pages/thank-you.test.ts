import { describe, it, expect, vi, beforeEach } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

// Import our centralized mocks
import { createStripeMock } from '../../setup/mocks/api-mocks';
import { createStrapiMock } from '../../setup/mocks/api-mocks';

// Pre-define mocks before vi.mock() calls to avoid hoisting issues
const stripeMock = {
  checkout: {
    sessions: {
      retrieve: vi.fn(),
    },
  },
};

// Create mocks for Strapi
const findMock = vi.fn();
const strapiMock = {
  single: vi.fn().mockReturnValue({
    find: findMock,
  }),
};

// Mock clients
vi.mock('@/lib/api/stripe-client', () => ({
  default: stripeMock,
}));

vi.mock('@/lib/api/strapi-client', () => ({
  default: strapiMock,
  __findMock: findMock, // Export mock for reference
}));

// Import after mocking
import stripe from '@/lib/api/stripe-client';
import strapi from '@/lib/api/strapi-client';

describe('Thank You page', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Mock Strapi response for page data
    findMock.mockResolvedValue({
      data: {
        id: 1,
        attributes: {
          message: 'Thank you for your support!',
          seoMeta: {
            title: 'Thank You',
            description: 'Thank you for your purchase',
          },
          marqueeImage: {
            data: {
              attributes: {
                url: '/images/test.jpg',
              },
            },
          },
        },
      },
    });
  });

  it('renders thank you page with session data when session_id is present', async () => {
    // Mock Stripe session response
    stripeMock.checkout.sessions.retrieve.mockResolvedValue({
      id: 'cs_test_123',
      customer_details: {
        name: 'John Doe',
        email: 'john@example.com',
      },
      line_items: {
        data: [
          {
            quantity: 2,
          },
        ],
      },
      amount_total: 5000,
    });

    // Create test container with thank-you page and session_id param
    const container = await AstroContainer.create();
    const page = await container.renderPage(
      '/thank-you?session_id=cs_test_123'
    );
    const html = await page.html();

    // Test that Stripe session was retrieved with correct ID
    expect(stripe.checkout.sessions.retrieve).toHaveBeenCalledWith(
      'cs_test_123',
      expect.any(Object)
    );

    // Verify page content includes session data
    expect(html).toContain('John Doe');
    expect(html).toContain('john@example.com');
    expect(html).toContain('Tickets: 2');
    expect(html).toContain('$50.00');
  });

  it('renders thank you page with default message when no session_id is present', async () => {
    // Create test container with thank-you page and no session_id
    const container = await AstroContainer.create();
    const page = await container.renderPage('/thank-you');
    const html = await page.html();

    // Verify Stripe was not called
    expect(stripe.checkout.sessions.retrieve).not.toHaveBeenCalled();

    // Verify page content shows default message
    expect(html).toContain('Thank you for your support!');
    // Order confirmation section should not be present
    expect(html).not.toContain('Order Confirmation');
  });

  it('handles errors from Stripe gracefully', async () => {
    // Mock Stripe throwing an error
    stripeMock.checkout.sessions.retrieve.mockRejectedValue(
      new Error('Invalid session ID')
    );

    // Create test container with thank-you page and invalid session_id
    const container = await AstroContainer.create();
    const page = await container.renderPage('/thank-you?session_id=invalid_id');
    const html = await page.html();

    // Verify page falls back to default content
    expect(html).toContain('Thank you for your support!');
    expect(html).not.toContain('Order Confirmation');
  });
});
