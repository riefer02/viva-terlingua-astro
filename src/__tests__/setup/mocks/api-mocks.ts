import { vi } from 'vitest';

// Pre-define mock implementations before vi.mock calls to avoid hoisting issues
export const strapiMockImplementation = {
  find: vi.fn(),
  findOne: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  count: vi.fn(),
  collection: vi.fn().mockReturnValue({
    find: vi.fn().mockResolvedValue({ data: [] }),
    findOne: vi.fn().mockResolvedValue({ data: {} }),
  }),
  single: vi.fn().mockReturnValue({
    find: vi.fn().mockResolvedValue({ data: {} }),
  }),
};

// Improved type-safe stripe mock implementation
export const stripeMockImplementation = {
  checkout: {
    sessions: {
      create: vi.fn().mockResolvedValue({
        id: 'test_session_id',
        url: 'https://checkout.stripe.com/test-session',
        object: 'checkout.session',
      }),
      retrieve: vi.fn().mockResolvedValue({
        id: 'test_session_id',
        payment_status: 'paid',
        customer_details: { email: 'test@example.com', name: 'Test User' },
        metadata: {},
        line_items: {
          data: [{ quantity: 1 }],
        },
        amount_total: 5000,
        object: 'checkout.session',
      }),
    },
  },
  webhooks: {
    constructEvent: vi.fn().mockImplementation((payload, signature, secret) => {
      // Basic validation to simulate Stripe behavior
      if (!signature || signature === 'invalid_signature') {
        throw new Error('Invalid signature');
      }

      // Return a default event with a more complete structure
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

      return typeof payload === 'string' ? JSON.parse(payload) : defaultEvent;
    }),
  },
  events: {
    retrieve: vi.fn(),
  },
  paymentIntents: {
    retrieve: vi.fn(),
  },
};

// Mock fetch API
export const fetchMock = vi.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    headers: new Headers(),
    status: 200,
    statusText: 'OK',
  })
);

// Setup fetch mock
export function setupFetchMock(customImplementation?: typeof fetchMock) {
  global.fetch = customImplementation || fetchMock;
  return global.fetch;
}

// Helper to setup Stripe mocks for a test file
export function setupStripeMocks() {
  // Mock the stripe client module
  vi.mock('@/lib/api/stripe-client', () => ({
    default: stripeMockImplementation,
  }));

  return { stripeMock: stripeMockImplementation };
}

// Mock implementation factory for Strapi responses
export function createStrapiMock(responseData: any = {}) {
  return {
    collection: vi.fn().mockReturnValue({
      find: vi.fn().mockResolvedValue({ data: responseData }),
      findOne: vi.fn().mockResolvedValue({ data: responseData }),
    }),
    single: vi.fn().mockReturnValue({
      find: vi.fn().mockResolvedValue({ data: responseData }),
    }),
  };
}

// Enhanced mock implementation factory for Stripe responses with better typing
export function createStripeMock(sessionData: any = {}) {
  return {
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({
          id: 'test_session_id',
          url: 'https://checkout.stripe.com/test-session',
          object: 'checkout.session',
          ...sessionData,
        }),
        retrieve: vi.fn().mockResolvedValue({
          id: 'test_session_id',
          payment_status: 'paid',
          customer_details: { email: 'test@example.com', name: 'Test User' },
          metadata: {},
          line_items: {
            data: [{ quantity: 1 }],
          },
          amount_total: 5000,
          object: 'checkout.session',
          ...sessionData,
        }),
      },
    },
    webhooks: {
      constructEvent: vi
        .fn()
        .mockImplementation((payload, signature, secret) => {
          if (!signature || signature === 'invalid_signature') {
            throw new Error('Invalid signature');
          }
          return {
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
        }),
    },
  };
}

// Helper to create a mock with specific failure cases
export function createFailedMock(errorMessage: string = 'API Error') {
  return {
    collection: vi.fn().mockReturnValue({
      find: vi.fn().mockRejectedValue(new Error(errorMessage)),
      findOne: vi.fn().mockRejectedValue(new Error(errorMessage)),
    }),
    single: vi.fn().mockReturnValue({
      find: vi.fn().mockRejectedValue(new Error(errorMessage)),
    }),
  };
}

// Setup function to reset all API mocks
export function resetApiMocks() {
  vi.resetAllMocks();
  setupFetchMock();
}

// Cleanup function
export function cleanupApiMocks() {
  vi.resetAllMocks();
}
