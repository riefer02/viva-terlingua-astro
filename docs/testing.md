# Testing Strategy for Ticket Checkout Flow

This document outlines the testing approach for the ticket purchase flow in the A Bowl O' Red project.

## Test Types

The checkout flow is tested at multiple levels:

1. **Unit Tests** - Testing individual components and API endpoints in isolation
2. **Integration Tests** - Testing the interactions between components and services
3. **End-to-End Tests** - Testing the full flow in a near-production environment

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode during development
pnpm test:watch

# Run with UI for debugging
pnpm test:ui

# Run tests with coverage report
pnpm test:coverage

# Run specific test file
pnpm test src/__tests__/components/tickets/TicketsForm.test.tsx
```

## Test Environments

The project uses Vitest with different environments for different types of tests:

1. **happy-dom** - Used for React component tests (provides browser API simulation)
2. **node** - Used for API and utility tests (simpler and faster)

You can specify the environment for a specific test file by adding a comment at the top of the file:

```typescript
// @vitest-environment happy-dom
// Rest of the test file...
```

## Common Challenges and Solutions

### TextEncoder/Decoder Issues

When using esbuild with Vitest, you might encounter issues with the TextEncoder/Decoder implementation:

```
Error: Invariant violation: "new TextEncoder().encode("") instanceof Uint8Array" is incorrectly false
```

This issue is addressed in our setup (vitest.setup.ts) with proper polyfills.

### Browser API Mocking

For components that use browser APIs (like clipboard), we use Object.defineProperty in the setup files:

```typescript
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn(),
    readText: vi.fn(),
  },
  configurable: true,
});
```

### Complex Component Setup

For complex component tests, we have component-specific setup files:

- `src/__tests__/components/tickets/tickets-form-setup.ts`

## Test Files

### Unit Tests

1. **Form Component Test** - `src/__tests__/components/tickets/TicketsForm.test.tsx`

   - Tests form validation and submission
   - Mocks API calls to isolate component behavior
   - Verifies handling of success and error cases

2. **Checkout API Test** - `src/__tests__/pages/api/create-checkout-session.test.ts`

   - Tests session creation with Stripe
   - Verifies correct data is sent to Stripe
   - Tests error handling

3. **Webhook API Test** - `src/__tests__/pages/api/webhooks/stripe.test.ts`

   - Tests webhook signature validation
   - Verifies Strapi database record creation
   - Tests error handling

4. **Thank You Page Test** - `src/__tests__/pages/thank-you.test.ts`
   - Tests both with and without session data
   - Verifies correct rendering of purchase details
   - Tests error handling

### Integration Tests

- **Checkout Flow Test** - `src/__tests__/integration/checkout-flow.test.ts`
  - Tests the form submission and API interaction
  - Uses MSW to mock server responses
  - Verifies the full user flow

## Mocking Strategy

- **Stripe Client** - We use centralized mocks in `src/__tests__/setup/stripe-mocks.ts`
- **Strapi Client** - Mock database calls to verify data storage
- **MSW** - Mock Service Worker intercepts network requests for integration tests
- **fetch** - Mocked for form submission tests

### External Service Mocking

For consistent mocking of Stripe and other external services:

```typescript
// Import the setup helper
import { setupStripeMocks } from '../__tests__/setup/stripe-mocks';

// Use at the top of your test file
setupStripeMocks();
```

## CI/CD Integration

Tests are automatically run as part of the CI pipeline:

1. On pull requests to main branch
2. On direct pushes to main branch

## Adding New Tests

When adding features to the checkout flow:

1. Add or update unit tests for individual components
2. Update integration tests to cover the new functionality
3. Consider adding end-to-end tests for critical flows

## Best Practices

- Focus on testing core functionality, not implementation details
- Mock external services to avoid real API calls during tests
- Test both happy paths and error conditions
- Keep test data simple and focused on what's being tested
- Use the right environment for each test type (happy-dom for components, node for API tests)
- For React components that use browser APIs, use `@vitest-environment happy-dom` directive
- Centralize common mocks in the `/setup` directory for consistency
