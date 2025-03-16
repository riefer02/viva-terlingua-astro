/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SITE: string;
  readonly BASE_URL: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly STRAPI_URL: string;
  readonly STRAPI_API_TOKEN: string;
  readonly STRAPI_IDENTIFIER: string;
  readonly GA4_ID: string;
  readonly STRIPE_PUBLIC_KEY: string;
  readonly TICKET_PRICE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
