# Testing Architecture

This directory contains the testing infrastructure for the "A Bowl O' Red" Astro project. The testing architecture is designed to be modular, maintainable, and consistent across the entire codebase.

## Directory Structure

```
src/__tests__/
├── components/    # Component tests
├── config/        # Configuration tests
├── integration/   # End-to-end tests
├── pages/         # Page tests
│   └── api/       # API endpoint tests
└── setup/         # Test setup utilities
    └── mocks/     # Centralized mock implementations
```

## Core Concepts

### 1. Centralized Mocks

All mock implementations are defined in the `setup/mocks/` directory:

- `api-mocks.ts`: Mock implementations for Stripe and Strapi clients, fetch API
- `browser-mocks.ts`: Mock implementations for browser APIs (window, navigator, clipboard) and userEvent
- `env-mocks.ts`: Mock implementations for environment variables

These mocks are designed to be:

- Reusable across test files
- Consistent in behavior
- Easy to customize per test

### 2. Mock Implementation Pattern

To avoid issues with Vitest hoisting `vi.mock()` calls, follow this pattern:

```typescript
// 1. Pre-define mocks BEFORE vi.mock() calls
const myMock = vi.fn();
const myMockObject = { myMethod: myMock };

// 2. Use these mock references in your vi.mock() calls
vi.mock('my-module', () => ({
  default: myMockObject,
}));

// 3. Import the module AFTER mocking
import myModule from 'my-module';

// 4. Now you can reference the pre-defined mock in your tests
myMock.mockResolvedValue(someValue);
```

### 3. Component Test Setup

For React/JSX component tests, use the utilities in `setup/component-setup.ts`:

```typescript
import { renderAstro } from '../../setup/component-setup';

it('renders my component', async () => {
  const { screen } = await renderAstro(MyComponent, { prop1: 'value' });
  expect(screen.getByText('Expected text')).toBeInTheDocument();
});
```

### 4. Astro Container Testing

For testing Astro components and pages, use the Astro Container:

```typescript
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

it('renders my page', async () => {
  const container = await AstroContainer.create();
  const page = await container.renderPage('/my-page');
  const html = await page.html();

  expect(html).toContain('Expected content');
});
```

### 5. API and Browser Mocks

The centralized mock system provides ready-to-use mocks for common scenarios:

```typescript
// API mocks
import {
  setupFetchMock,
  fetchMock,
  createStrapiMock,
  createStripeMock,
  setupStripeMocks,
} from '../../setup/mocks/api-mocks';

// Setup fetch for testing
setupFetchMock();

// Create custom Strapi response
const strapiMock = createStrapiMock({ title: 'Test Title' });

// Mock Stripe for checkout flow
const { stripeMock } = setupStripeMocks();

// Browser mocks
import { setupBrowserEnvironment } from '../../setup/mocks/browser-mocks';

// Setup window, navigator, and userEvent
const { window, navigator, userEvent } = setupBrowserEnvironment();
```

### 6. Environment Variable Mocks

Environment variables can be mocked with the `env-mocks.ts` utilities:

```typescript
import { setupEnvMocks } from '../../setup/mocks/env-mocks';

// Mock environment variables
const envMock = setupEnvMocks({
  PUBLIC_STRAPI_URL: 'https://cms.example.com',
  STRIPE_SECRET_KEY: 'sk_test_custom',
});

// Always clean up after your test
afterAll(() => {
  envMock.cleanup();
});
```

## Best Practices

1. **Pre-define Mocks**: Always define mock implementations before `vi.mock()` calls
2. **Use Centralized Mocks**: Import from `setup/mocks/` rather than creating new implementations
3. **Reset Between Tests**: Use `beforeEach(vi.resetAllMocks)` to ensure clean tests
4. **Test Isolation**: Each test should be independent and not rely on state from other tests
5. **Type Safety**: Use proper typing for mock data and test utilities
6. **Avoid Duplication**: Extract common setup into helper functions
7. **Clean Up**: Always clean up environment variables and other global state after tests

## Running Tests

- Run all tests: `pnpm test`
- Run with coverage: `pnpm test:coverage`
- Run in watch mode: `pnpm test:watch`
- Run specific tests: `pnpm test -- -t "test name"`

## Migration Guide

If you're updating existing tests to use the new architecture:

1. Replace direct mock implementations with imports from `setup/mocks/`
2. Fix hoisting issues by pre-defining mocks before `vi.mock()` calls
3. Use `.tsx` file extension for files containing JSX syntax
4. Update environment variable mocking to use `setupEnvMocks()`
5. Clean up after tests using the provided cleanup functions

## Troubleshooting

- **Hoisting Issues**: If you see "Cannot access X before initialization", ensure your mock is defined before `vi.mock()`
- **JSX Errors**: Ensure files with JSX have the `.tsx` extension
- **Type Errors**: Check that you're using the correct types for mock data
- **Missing Cleanup**: Ensure you're resetting mocks between tests with `vi.resetAllMocks()`
- **Environment Variables**: If environment variables aren't working, make sure you're using `setupEnvMocks()` and cleaning up afterwards
