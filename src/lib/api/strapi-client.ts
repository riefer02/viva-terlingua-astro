import Strapi from 'strapi-sdk-js';

// Create a new instance of the Strapi client
const strapi = new Strapi({
  url: import.meta.env.STRAPI_URL || 'http://localhost:1337',
  prefix: '/api',
  axiosOptions: {
    headers: {
      Authorization: `Bearer ${import.meta.env.STRAPI_API_TOKEN}`,
    },
  },
});

export default strapi;

// Type-safe helper functions can be added here as needed
