import type { APIRoute } from 'astro';
import { getSiteURL } from '../utils/url';

const getRobotsTxt = (sitemapURL: URL) => `# Allow all crawlers
User-agent: *
Allow: /

# Sitemap location
Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  // Use the site URL from the Astro config if available, otherwise use our getSiteURL utility
  const siteUrl = site || getSiteURL();

  // Create the sitemap URL by appending sitemap-index.xml to the site URL
  const sitemapURL = new URL('sitemap-index.xml', siteUrl);

  return new Response(getRobotsTxt(sitemapURL));
};
