import type { APIRoute } from 'astro';
import stripe from '@/lib/api/stripe-client';
import type { TicketHolderRequest } from '@/types/strapi';
import siteConfig from '@/config/site';

const STRAPI_API_URL = siteConfig.strapi.url + '/api';
const STRAPI_API_TOKEN = siteConfig.strapi.apiToken;

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const signature = request.headers.get('stripe-signature');
    if (!signature) {
      return new Response('Stripe signature missing', { status: 400 });
    }

    const rawBody = await request.text();

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      import.meta.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const metadata = session.metadata;

      console.log('Stripe session metadata:', metadata);

      if (!metadata?.email || !session.id || !session.payment_intent) {
        throw new Error(
          'Missing required fields: email, session ID, or payment intent'
        );
      }

      const ticketHolderData: TicketHolderRequest = {
        data: {
          name: [metadata.firstName, metadata.lastName]
            .filter(Boolean)
            .join(' '),
          firstName: metadata.firstName || undefined,
          lastName: metadata.lastName || undefined,
          email: metadata.email,
          transactionID: session.id,
          customerID: session.payment_intent as string,
          cookOffYear: new Date().getFullYear(),
          timeOfPurchase: new Date().toISOString(),
          phoneNumber: metadata.phone
            ? String(Number(metadata.phone.replace(/\D/g, '')))
            : undefined,
          numberOfTickets: session.line_items?.data[0]?.quantity || 1,
          ...(metadata.recipientFirstName
            ? { recipientFirstName: metadata.recipientFirstName }
            : {}),
          ...(metadata.recipientLastName
            ? { recipientLastName: metadata.recipientLastName }
            : {}),
        },
      };

      console.log(
        'Sending to Strapi:',
        JSON.stringify(ticketHolderData, null, 2)
      );

      try {
        const response = await fetch(`${STRAPI_API_URL}/ticket-holders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          },
          body: JSON.stringify(ticketHolderData),
        });
        const result = await response.json();
        console.log('Strapi response:', result);
        if (!response.ok) {
          throw new Error(
            `Strapi error: ${response.status} ${JSON.stringify(result)}`
          );
        }
      } catch (fetchError) {
        console.error('Direct fetch Strapi error:', fetchError);
        throw fetchError;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Webhook error:', error);

    const errorResponse = {
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString(),
      type: error instanceof Error ? error.constructor.name : 'Unknown',
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

// This is required for Astro to work with raw body data for webhook verification
export const config = {
  api: {
    bodyParser: false,
  },
};
