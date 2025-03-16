export interface SiteConfig {
  title: string;
  description: string;
  defaultLanguage: string;
  author: {
    name: string;
    twitter: string;
  };
  seo: {
    titleTemplate: string;
    defaultImage: string;
  };
  urls: {
    strapi: string;
  };
  analytics: {
    ga4Id: string;
  };
  stripe: {
    publicKey: string;
    ticketPrice: string;
  };
  strapi: {
    url: string;
    apiToken: string;
    identifier: string;
  };
}

const config: SiteConfig = {
  title: 'Original Terlingua International Championship Chili Cook Off',
  description:
    'Official Website for the Wick Fowler, Frank X. Tolbert, Terlingua International Chili Cook Off - Behind the store.',
  defaultLanguage: 'en',
  author: {
    name: 'Andrew Riefenstahl',
    twitter: '@riefer02',
  },
  seo: {
    titleTemplate:
      '%s | Original Terlingua International Championship Chili Cook Off',
    defaultImage: '/og-image.jpg',
  },
  urls: {
    strapi: import.meta.env.STRAPI_URL || 'http://127.0.0.1:1337',
  },
  analytics: {
    ga4Id: import.meta.env.GA4_ID || '',
  },
  stripe: {
    publicKey: import.meta.env.STRIPE_PUBLIC_KEY || '',
    ticketPrice: import.meta.env.TICKET_PRICE || '',
  },
  strapi: {
    url: import.meta.env.STRAPI_URL || 'http://127.0.0.1:1337',
    apiToken: import.meta.env.STRAPI_API_TOKEN || '',
    identifier: import.meta.env.STRAPI_IDENTIFIER || '',
  },
} as const;

export default config;
