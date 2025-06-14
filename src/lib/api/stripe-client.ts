import Stripe from 'stripe';

// Create a singleton instance of the Stripe client
const stripe = new Stripe(
  import.meta.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
  {
    apiVersion: '2025-04-30.basil',
  }
);

export default stripe;
