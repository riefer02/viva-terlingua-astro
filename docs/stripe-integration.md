# Stripe Integration

This document outlines the Stripe integration for ticket purchases in the A Bowl O' Red project.

## Environment Variables

The following environment variables are used:

- `PUBLIC_STRIPE_PUBLIC_KEY`: Public key for Stripe (used on client-side)
- `STRIPE_SECRET_KEY`: Secret key for Stripe API (used on server-side, must be set in production)
- `PUBLIC_TICKET_PRICE_ID`: The Stripe price ID for the tickets
- `STRIPE_WEBHOOK_SECRET`: Secret for verifying Stripe webhook signatures

## Architecture

The Stripe integration consists of:

1. **Client Singletons**:

   - `src/lib/stripe.ts` - Frontend Stripe client for checkout
   - `src/lib/api/stripe-client.ts` - Backend Stripe API client

2. **API Endpoints**:

   - `src/pages/api/create-checkout-session.ts` - Creates Stripe checkout sessions
   - `src/pages/api/webhooks/stripe.ts` - Handles webhook events from Stripe

3. **Frontend Components**:
   - `src/components/tickets/TicketsForm.tsx` - Form for ticket purchases
   - `src/pages/thank-you.astro` - Order confirmation page

## Workflow

1. User fills out the ticket form
2. Form submits to `/api/create-checkout-session` endpoint
3. Server creates a Stripe checkout session and returns the URL
4. User is redirected to Stripe checkout
5. After payment, Stripe sends a webhook to `/api/webhooks/stripe` endpoint
6. Server creates a record in Strapi and processes order
7. User is redirected to the thank-you page with order details

## Development Testing

For local testing:

1. Use Stripe CLI to forward webhooks to your local environment
2. Set up the required environment variables
3. Run the application in SSR mode (Astro hybrid mode)

## Deployment

Ensure all environment variables are properly set in the production environment.
