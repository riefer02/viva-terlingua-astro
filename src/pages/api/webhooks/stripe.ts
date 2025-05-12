import type { APIRoute } from 'astro';
import stripe from '@/lib/api/stripe-client';
import strapi from '@/lib/api/strapi-client';

// Disable static generation for this API route
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Get the webhook signature
    const signature = request.headers.get('stripe-signature');
    if (!signature) {
      return new Response('Stripe signature missing', { status: 400 });
    }

    // Get raw body - important for webhook signature verification
    const rawBody = await request.text();

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      import.meta.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle different event types
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // Extract customer data from metadata
      const metadata = session.metadata;

      // Create ticket record in Strapi
      await strapi.collection('ticket-purchases').create({
        data: {
          sessionId: session.id,
          firstName: metadata?.firstName,
          lastName: metadata?.lastName,
          email: metadata?.email,
          phone: metadata?.phone,
          ticketCount: session.line_items?.data[0]?.quantity || 1,
          isGift: metadata?.isGift === 'true',
          recipientFirstName: metadata?.recipientFirstName,
          recipientLastName: metadata?.recipientLastName,
          purchaseDate: new Date().toISOString(),
          status: 'completed',
          totalPaid: session.amount_total,
          paymentId: session.payment_intent as string,
        },
      });

      // Here you could also add logic to send confirmation emails
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Webhook error:', error);
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

// This is required for Astro to work with raw body data for webhook verification
export const config = {
  api: {
    bodyParser: false,
  },
};
