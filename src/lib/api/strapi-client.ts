import { strapi } from '@strapi/client';
import config from '@/config/site';

const client = strapi({
  baseURL: `${config.strapi.url}/api`,
  auth: config.strapi.apiToken,
});

export default client;
