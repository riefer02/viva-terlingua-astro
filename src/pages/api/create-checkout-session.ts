import type { APIRoute } from 'astro';
import stripe from '@/lib/api/stripe-client';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
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

    let clientReferenceId = `${firstName}—${lastName}—${ticketCount}—${phone}—${Date.now()}`;
    if (isGift) {
      clientReferenceId += `—${recipientFirstName}—${recipientLastName}`;
    }

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

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({ message: 'This endpoint requires a POST request' }),
    {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};
