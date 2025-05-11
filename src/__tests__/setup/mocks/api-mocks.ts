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

export const stripeMockImplementation = {
  checkout: {
    sessions: {
      create: vi.fn().mockResolvedValue({
        id: 'test_session_id',
        url: 'https://checkout.stripe.com/test-session',
      }),
      retrieve: vi.fn().mockResolvedValue({
        payment_status: 'paid',
        customer_details: { email: 'test@example.com' },
        metadata: {},
      }),
    },
  },
  webhooks: {
    constructEvent: vi.fn().mockImplementation((payload, signature, secret) => {
      // Basic validation to simulate Stripe behavior
      if (!signature || signature === 'invalid_signature') {
        throw new Error('Invalid signature');
      }

      // Return a default event or parse the payload if it's a string
      const defaultEvent = {
        type: 'checkout.session.completed',
        data: { object: { metadata: {} } },
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

// Mock implementation factory for Stripe responses
export function createStripeMock(sessionData: any = {}) {
  return {
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({
          id: 'test_session_id',
          url: 'https://checkout.stripe.com/test-session',
          ...sessionData,
        }),
        retrieve: vi.fn().mockResolvedValue({
          payment_status: 'paid',
          customer_details: { email: 'test@example.com' },
          metadata: {},
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
            data: { object: { metadata: {} } },
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
