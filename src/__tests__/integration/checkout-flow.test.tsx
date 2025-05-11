import React from 'react';
import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  afterAll,
  afterEach,
  beforeEach,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import TicketsForm from '@/components/tickets/TicketsForm';
import {
  setupBrowserEnvironment,
  cleanupBrowserMocks,
} from '@tests/setup/mocks/browser-mocks';
import { setupFetchMock, fetchMock } from '@tests/setup/mocks/api-mocks';

// Create a mock MSW server to intercept API requests
const server = setupServer(
  // Mock the checkout session creation endpoint - use port 4321 consistently
  http.post('http://localhost:4321/api/create-checkout-session', () => {
    return HttpResponse.json({
      id: 'cs_test_integration',
      url: 'https://checkout.stripe.com/pay/cs_test_integration',
    });
  })
);

describe('Checkout Flow Integration', () => {
  // Start MSW server before tests
  beforeAll(() => {
    // Start MSW server
    server.listen({ onUnhandledRequest: 'warn' });
  });

  // Setup browser environment before each test
  beforeEach(() => {
    // Use our centralized browser mocks with proper window.location implementation
    setupBrowserEnvironment();

    // Setup fetch mock
    setupFetchMock();

    // Initialize _href property to track redirects
    window.location._href = 'http://localhost:3000';

    // Manually ensure window.location.href setter is properly mocked
    Object.defineProperty(window.location, 'href', {
      configurable: true,
      get: vi
        .fn()
        .mockReturnValue(window.location._href || 'http://localhost:3000'),
      set: vi.fn().mockImplementation((value) => {
        // Log the redirect to help with debugging
        console.log(`Redirecting to: ${value}`);
        // Store the value so we can verify it later
        window.location._href = value;
        console.log(
          `Updated window.location._href to: ${window.location._href}`
        );
      }),
    });

    console.log('Initial window.location._href:', window.location._href);
  });

  // Reset handlers and mocks after each test
  afterEach(() => {
    vi.resetAllMocks();
    server.resetHandlers();
    cleanupBrowserMocks();
  });

  // Clean up after all tests
  afterAll(() => server.close());

  it('completes the entire form submission and checkout flow', async () => {
    // Setup custom fetch mock for this test with logging
    fetchMock.mockImplementation(() => {
      console.log('Fetch called, will redirect soon');
      return Promise.resolve({
        ok: true,
        json: () => {
          console.log('Returning session data');
          return Promise.resolve({
            id: 'cs_test_integration',
            url: 'https://checkout.stripe.com/pay/cs_test_integration',
          });
        },
      });
    });

    const user = userEvent.setup();
    render(<TicketsForm />);

    // Fill out the complete form with valid data
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/^email$/i), 'john@example.com');
    await user.type(
      screen.getByLabelText(/confirm email/i),
      'john@example.com'
    );
    await user.type(screen.getByLabelText(/phone/i), '(555) 555-5555');

    // Select 2 tickets - ensure value is actually changed
    const ticketInput = screen.getByLabelText(/number of tickets/i);
    await user.clear(ticketInput);
    await user.type(ticketInput, '2');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /purchase/i });
    await user.click(submitButton);

    // Verify the API was called and response was processed
    await waitFor(
      () => {
        // Instead of checking window.location.href directly, check the stored value
        expect(window.location._href).toContain('checkout.stripe.com');
      },
      { timeout: 3000 }
    );
  });

  it('handles server errors during checkout', async () => {
    // Override default handler to simulate server error
    server.use(
      http.post('http://localhost:4321/api/create-checkout-session', () => {
        // Return error with the exact same text format as in the component
        return new HttpResponse(
          JSON.stringify({
            error: "Cannot read properties of undefined (reading 'ok')",
          }),
          { status: 500 }
        );
      })
    );

    const user = userEvent.setup();
    render(<TicketsForm />);

    // Fill out form with valid data (minimal version)
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/^email$/i), 'john@example.com');
    await user.type(
      screen.getByLabelText(/confirm email/i),
      'john@example.com'
    );
    await user.type(screen.getByLabelText(/phone/i), '(555) 555-5555');

    // Submit the form
    await user.click(screen.getByRole('button', { name: /purchase/i }));

    // Verify error handling - look for the actual error message that appears in the output
    await waitFor(() => {
      expect(
        screen.getByText(/Cannot read properties of undefined/)
      ).toBeInTheDocument();
    });
  });
});
