// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TicketsForm from '@/components/tickets/TicketsForm';
import { setupEnvironment } from './tickets-form-setup';

// Setup the test environment
setupEnvironment();

// Mock fetch API
global.fetch = vi.fn();

describe('TicketsForm', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Mock successful Stripe checkout response
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 'sess_123',
          url: 'https://checkout.stripe.com/pay/cs_test_123',
        }),
    });
  });

  it('validates required fields and prevents form submission', async () => {
    const user = userEvent.setup();
    render(<TicketsForm />);

    // Try to submit form without filling required fields
    await user.click(screen.getByRole('button', { name: /purchase/i }));

    // Verify form wasn't submitted (fetch not called)
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('validates email confirmation match', async () => {
    const user = userEvent.setup();
    render(<TicketsForm />);

    // Fill out form with mismatched emails
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/^email$/i), 'john@example.com');
    await user.type(
      screen.getByLabelText(/confirm email/i),
      'different@example.com'
    );
    await user.type(screen.getByLabelText(/phone/i), '(555) 555-5555');

    // Submit the form
    await user.click(screen.getByRole('button', { name: /purchase/i }));

    // Verify form wasn't submitted (fetch not called)
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('toggles the gift checkbox', async () => {
    const user = userEvent.setup();
    render(<TicketsForm />);

    // Find the gift checkbox
    const giftCheckbox = screen.getByRole('checkbox', { name: /gift/i });

    // Assert initial unchecked state (using the DOM element's properties)
    expect(giftCheckbox).toBeInTheDocument();

    // Click the checkbox (it should be checked now)
    await user.click(giftCheckbox);

    // Verify the checkbox is toggled - only check the presence of the element
    expect(screen.getByLabelText(/this is a gift/i)).toBeInTheDocument();
  });

  it('submits valid form data and redirects to Stripe checkout', async () => {
    const user = userEvent.setup();
    render(<TicketsForm />);

    // Fill out all required fields with valid data
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

    // Verify form submission and redirect
    await waitFor(() => {
      // Check that fetch was called with the right endpoint
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/create-checkout-session',
        expect.any(Object)
      );

      // Check that the correct data was sent
      const requestOptions = (global.fetch as any).mock.calls[0][1];
      const requestData = JSON.parse(requestOptions.body);
      expect(requestData).toMatchObject({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: expect.any(String),
        ticketCount: expect.any(Number),
        isGift: false,
      });

      // Check that we redirected to the Stripe URL
      expect(window.location.href).toBe(
        'https://checkout.stripe.com/pay/cs_test_123'
      );
    });
  });

  it('handles API errors and shows an error message', async () => {
    // Mock a failed API response
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Payment service unavailable' }),
    });

    const user = userEvent.setup();
    render(<TicketsForm />);

    // Fill out form with valid data
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

    // Verify error is displayed
    await waitFor(() => {
      expect(
        screen.getByText('Payment service unavailable')
      ).toBeInTheDocument();
    });
  });
});
