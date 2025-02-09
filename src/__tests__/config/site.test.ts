import { describe, it, expect, beforeEach, vi } from 'vitest';
import config, { type SiteConfig } from '../../config/site';

describe('Site Configuration', () => {
  beforeEach(() => {
    // Clear any mocked environment variables between tests
    vi.resetModules();
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
    expect(config.seo.defaultImage).toBe('/og-image.png');
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

  // Type check test
  it('should satisfy SiteConfig type', () => {
    const typeCheck: SiteConfig = config;
    expect(typeCheck).toBe(config);
  });
});
