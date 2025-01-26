/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly STRAPI_URL: string;
  readonly STRAPI_IDENTIFIER: string;
  readonly STRAPI_API_TOKEN: string;
  readonly STRAPI_PASSWORD: string;
  readonly STRIPE_PUBLIC_KEY: string;
  readonly STRIPE_WEBHOOK_SECRET: string;
  readonly TICKET_PRICE: string;
  readonly GA4_ID: string;
  readonly MY_DOG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
