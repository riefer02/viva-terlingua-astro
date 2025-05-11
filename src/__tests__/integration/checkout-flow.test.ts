import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import TicketsForm from '@/components/tickets/TicketsForm';

// Create a mock MSW server to intercept API requests
const server = setupServer(
  // Mock the checkout session creation endpoint
  rest.post('/api/create-checkout-session', (req, res, ctx) => {
    return res(
      ctx.json({
        id: 'cs_test_integration',
        url: 'https://checkout.stripe.com/pay/cs_test_integration',
      })
    );
  })
);

describe('Checkout Flow Integration', () => {
  // Start MSW server before tests
  beforeAll(() => {
    // Mock window.location before tests run
    Object.defineProperty(global, 'window', {
      value: {
        location: {
          href: '',
        },
      },
      writable: true,
    });
    
    server.listen();
  });
  
  // Reset handlers after each test
  afterEach(() => server.resetHandlers());
  
  // Clean up after all tests
  afterAll(() => server.close());
  
  it('completes the entire form submission and checkout flow', async () => {
    const user = userEvent.setup();
    render(<TicketsForm />);
    
    // Fill out the complete form with valid data
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/^email$/i), 'john@example.com');
    await user.type(screen.getByLabelText(/confirm email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/phone/i), '(555) 555-5555');
    
    // Select 2 tickets
    await user.clear(screen.getByLabelText(/number of tickets/i));
    await user.type(screen.getByLabelText(/number of tickets/i), '2');
    
    // Check gift checkbox
    await user.click(screen.getByLabelText(/gift/i));
    
    // Fill gift recipient info
    await user.type(screen.getByLabelText(/recipient's first name/i), 'Jane');
    await user.type(screen.getByLabelText(/recipient's last name/i), 'Smith');
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /purchase/i }));
    
    // Verify the form submission
    await waitFor(() => {
      // Should call API with correct data
      expect(window.location.href).toBe('https://checkout.stripe.com/pay/cs_test_integration');
    });
  });
  
  it('handles server errors during checkout', async () => {
    // Override default handler to simulate server error
    server.use(
      rest.post('/api/create-checkout-session', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ error: 'Server error during checkout' })
        );
      })
    );
    
    const user = userEvent.setup();
    render(<TicketsForm />);
    
    // Fill out form with valid data (minimal version)
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/^email$/i), 'john@example.com');
    await user.type(screen.getByLabelText(/confirm email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/phone/i), '(555) 555-5555');
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /purchase/i }));
    
    // Verify error handling
    await waitFor(() => {
      expect(screen.getByText('Server error during checkout')).toBeInTheDocument();
    });
  });
}); 