import type { APIRoute } from 'astro';
import stripe from '@/lib/api/stripe-client';

// Disable static generation for this API route
export const prerender = false;

export const post: APIRoute = async ({ request }) => {
  try {
    // Parse request body from form submission
    const data = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      ticketCount,
      isGift,
      recipientFirstName,
      recipientLastName,
    } = data;

    // Build client reference ID to store customer data
    let clientReferenceId = `${firstName}—${lastName}—${ticketCount}—${phone}—${Date.now()}`;
    if (isGift) {
      clientReferenceId += `—${recipientFirstName}—${recipientLastName}`;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price: import.meta.env.PUBLIC_TICKET_PRICE_ID,
          quantity: ticketCount,
        },
      ],
      customer_email: email,
      client_reference_id: clientReferenceId,
      success_url: `${import.meta.env.SITE_URL || 'http://localhost:4321'}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${import.meta.env.SITE_URL || 'http://localhost:4321'}/tickets`,
      metadata: {
        firstName,
        lastName,
        email,
        phone,
        isGift: isGift ? 'true' : 'false',
        recipientFirstName: recipientFirstName || '',
        recipientLastName: recipientLastName || '',
      },
    });

    // Return session ID and URL to client
    return new Response(
      JSON.stringify({
        id: session.id,
        url: session.url,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
