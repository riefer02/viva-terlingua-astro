import { strapi } from '@strapi/client';
import config from '@/config/site';

// Create a new instance of the Strapi client with type-safe configuration
const client = strapi({
  baseURL: `${config.strapi.url}/api`,
  auth: config.strapi.apiToken,
});

export default client;
