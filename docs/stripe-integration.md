# Stripe Integration

This document outlines the Stripe integration for ticket purchases in the A Bowl O' Red project.

## Environment Variables

The following environment variables are required:

- `PUBLIC_STRIPE_PUBLIC_KEY`: Public key for Stripe (used on client-side)
- `STRIPE_SECRET_KEY`: Secret key for Stripe API (used on server-side, must be set in production)
- `PUBLIC_TICKET_PRICE_ID`: The Stripe price ID for the tickets
- `STRIPE_WEBHOOK_SECRET`: Secret for verifying Stripe webhook signatures
- `SITE_URL`: Base URL of the application (used for success/cancel URLs)

## Architecture

The Stripe integration consists of several key components:

1. **Client Singletons**:

   - `src/lib/stripe.ts` - Frontend Stripe client for checkout using `@stripe/stripe-js`
   - `src/lib/api/stripe-client.ts` - Backend Stripe API client using `stripe` package

2. **API Endpoints**:

   - `src/pages/api/create-checkout-session.ts` - Creates Stripe checkout sessions
   - `src/pages/api/webhooks/stripe.ts` - Handles webhook events from Stripe

3. **Frontend Components**:
   - `src/components/tickets/TicketsForm.tsx` - Form for ticket purchases using React Hook Form
   - `src/pages/thank-you.astro` - Order confirmation page with session details

## Workflow

1. User fills out the ticket form (`TicketsForm.tsx`)

   - Form includes validation using Zod schema
   - Handles both regular and gift ticket purchases
   - Collects customer and recipient information

2. Form submits to `/api/create-checkout-session` endpoint

   - Creates a Stripe checkout session with:
     - Customer details
     - Line items (tickets)
     - Success/cancel URLs
     - Metadata for webhook processing

3. Server creates a Stripe checkout session and returns the URL

   - Uses `stripe.checkout.sessions.create()`
   - Includes all necessary metadata for webhook processing
   - Sets up success and cancel URLs

4. User is redirected to Stripe checkout

   - Handled by Stripe's hosted checkout page
   - Secure payment processing
   - Mobile-responsive design

5. After payment, Stripe sends a webhook to `/api/webhooks/stripe` endpoint

   - Verifies webhook signature
   - Processes `checkout.session.completed` events
   - Creates ticket holder records in Strapi

6. Server creates a record in Strapi

   - Stores ticket holder information
   - Links to Stripe transaction
   - Includes metadata for tracking

7. User is redirected to the thank-you page
   - Displays order confirmation
   - Shows ticket details
   - Provides next steps

## Development Testing

For local testing:

1. Use Stripe CLI to forward webhooks:

   ```bash
   stripe listen --forward-to localhost:4321/api/webhooks/stripe
   ```

2. Set up required environment variables in `.env`:

   ```
   PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   PUBLIC_TICKET_PRICE_ID=price_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   SITE_URL=http://localhost:4321
   ```

3. Run the application in SSR mode:
   ```bash
   pnpm dev
   ```

## Error Handling

The integration includes comprehensive error handling:

1. **Form Validation**

   - Client-side validation using Zod
   - Type-safe form handling with React Hook Form

2. **API Error Handling**

   - Proper error responses with status codes
   - Detailed error messages for debugging
   - Type-safe error handling

3. **Webhook Processing**
   - Signature verification
   - Required field validation
   - Error logging and reporting

## Security Considerations

1. **API Keys**

   - Public key used only on client-side
   - Secret key used only on server-side
   - Webhook secret for signature verification

2. **Data Protection**

   - Sensitive data stored in Strapi
   - Payment information handled by Stripe
   - No sensitive data in client-side code

3. **Webhook Security**
   - Signature verification for all webhooks
   - Raw body parsing for signature validation
   - Proper error handling for invalid signatures

## Deployment

1. Set up environment variables in production:

   - Use production Stripe keys
   - Configure webhook endpoints
   - Set correct site URL

2. Configure webhook endpoints in Stripe Dashboard:

   - Add production webhook URL
   - Select required events
   - Store webhook signing secret

3. Test the integration:
   - Verify webhook delivery
   - Test successful payments
   - Confirm error handling
