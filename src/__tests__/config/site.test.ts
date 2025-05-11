import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { setupEnvMocks } from '../setup/mocks/env-mocks';
import config, { type SiteConfig } from '../../config/site';

describe('Site Configuration', () => {
  // Store the original module so we can re-import it with different env vars
  let originalModule: typeof config;

  beforeEach(() => {
    // Clear any mocked environment variables between tests
    vi.resetModules();
    vi.unstubAllEnvs();

    // Store original module
    originalModule = { ...config };
  });

  afterEach(() => {
    // Clean up any environment mocks
    vi.unstubAllEnvs();
  });

  it('should have all required properties', () => {
    expect(config).toEqual(
      expect.objectContaining({
        title: expect.any(String),
        description: expect.any(String),
        defaultLanguage: expect.any(String),
        author: expect.objectContaining({
          name: expect.any(String),
          twitter: expect.any(String),
        }),
        seo: expect.objectContaining({
          titleTemplate: expect.any(String),
          defaultImage: expect.any(String),
        }),
        urls: expect.objectContaining({
          strapi: expect.any(String),
        }),
        analytics: expect.objectContaining({
          ga4Id: expect.any(String),
        }),
        stripe: expect.objectContaining({
          publicKey: expect.any(String),
          ticketPrice: expect.any(String),
        }),
        strapi: expect.objectContaining({
          url: expect.any(String),
          apiToken: expect.any(String),
          identifier: expect.any(String),
        }),
      })
    );
  });

  it('should have correct default values', () => {
    expect(config.title).toBe(
      'Original Terlingua International Championship Chili Cook Off'
    );
    expect(config.defaultLanguage).toBe('en');
    expect(config.author.name).toBe('Andrew Riefenstahl');
    expect(config.author.twitter).toBe('@riefer02');
    expect(config.seo.defaultImage).toBe('/og-image.jpg');
  });

  it('should use default strapi URL when environment variable is not set', () => {
    expect(config.urls.strapi).toBe('http://127.0.0.1:1337');
    expect(config.strapi.url).toBe('http://127.0.0.1:1337');
  });

  it('should have empty strings as defaults for sensitive configuration when env vars are not set', () => {
    expect(config.analytics.ga4Id).toBe('');
    expect(config.stripe.publicKey).toBe('');
    expect(config.stripe.ticketPrice).toBe('');
    expect(config.strapi.apiToken).toBe('');
    expect(config.strapi.identifier).toBe('');
  });

  it('should use environment variables when set', () => {
    // Setup environment with our centralized mock system
    const envMock = setupEnvMocks({
      PUBLIC_STRAPI_URL: 'https://cms.example.com',
      PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_custom',
      PUBLIC_TICKET_PRICE_ID: 'price_custom123',
    });

    // Re-import the module to get the new environment values
    vi.resetModules();
    const updatedConfig = require('../../config/site').default;

    // Check that environment variables are properly used
    expect(updatedConfig.urls.strapi).toBe('https://cms.example.com');
    expect(updatedConfig.strapi.url).toBe('https://cms.example.com');
    expect(updatedConfig.stripe.publicKey).toBe('pk_test_custom');
    expect(updatedConfig.stripe.ticketPrice).toBe('price_custom123');

    // Clean up
    envMock.cleanup();
  });

  // Type check test
  it('should satisfy SiteConfig type', () => {
    const typeCheck: SiteConfig = config;
    expect(typeCheck).toBe(config);
  });
});
