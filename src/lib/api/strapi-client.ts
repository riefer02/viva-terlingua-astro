import Strapi from 'strapi-sdk-js';
import config from '@/config/site';

// Create a new instance of the Strapi client
const strapi = new Strapi({
  url: config.strapi.url,
  prefix: '/api',
  axiosOptions: {
    headers: {
      Authorization: `Bearer ${config.strapi.apiToken}`,
    },
  },
});

export default strapi;

// Type-safe helper functions can be added here as needed
