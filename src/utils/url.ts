/**
 * URL and path manipulation utilities
 */

/**
 * Removes leading slashes from a string
 * @param slug - The string to remove leading slashes from
 * @returns The string without leading slashes
 * @example
 * ```ts
 * formatSlug('/my-slug') // returns 'my-slug'
 * formatSlug('my-slug') // returns 'my-slug'
 * formatSlug('///my-slug') // returns 'my-slug'
 * ```
 */
export const formatSlug = (slug: string = ''): string =>
  slug.replace(/^\/+/, '');

/**
 * Ensures a string starts with a single slash
 * @param path - The path to ensure starts with a slash
 * @returns The path with a leading slash
 * @example
 * ```ts
 * ensureLeadingSlash('my-path') // returns '/my-path'
 * ensureLeadingSlash('/my-path') // returns '/my-path'
 * ensureLeadingSlash('///my-path') // returns '/my-path'
 * ```
 */
export const ensureLeadingSlash = (path: string = ''): string =>
  '/' + formatSlug(path);

/**
 * Joins URL segments together, handling slashes appropriately
 * @param segments - URL segments to join
 * @returns Joined URL with proper slashes
 * @example
 * ```ts
 * joinUrlSegments('events', 'my-event') // returns 'events/my-event'
 * joinUrlSegments('/events/', '/my-event/') // returns 'events/my-event'
 * ```
 */
export const joinUrlSegments = (...segments: string[]): string =>
  segments
    .map((segment) => formatSlug(segment))
    .filter(Boolean)
    .join('/');

/**
 * Gets the correct site URL in different environments
 * - Development: http://localhost:4321
 * - Production: The configured site URL from astro.config.mjs
 * - Deploy previews: Detected from Netlify environment variables
 *
 * @returns The base site URL with no trailing slash
 */
export function getSiteURL(): string {
  // Astro built-in env variables
  const isDev = import.meta.env.DEV;
  const configuredSite = import.meta.env.SITE;

  // For development environment
  if (isDev) {
    return 'http://localhost:4321';
  }

  // For Netlify deploy previews
  if (
    typeof process !== 'undefined' &&
    process.env.CONTEXT === 'deploy-preview'
  ) {
    // Use Netlify's deploy preview URL if available
    return process.env.DEPLOY_URL || configuredSite || 'https://abowlofred.com';
  }

  // For production environment, use the configured site
  return configuredSite || 'https://abowlofred.com';
}

/**
 * Creates absolute URLs with the correct base
 *
 * @param path Path to append to the base URL (should start with /)
 * @returns Absolute URL including the path
 */
export function createURL(path: string): string {
  const base = getSiteURL();
  const basePath = import.meta.env.BASE_URL || '/';

  // Ensure path starts with / and doesn't duplicate if basePath ends with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedBasePath =
    basePath.endsWith('/') && normalizedPath.startsWith('/')
      ? basePath.slice(0, -1)
      : basePath;

  return `${normalizedBase}${normalizedBasePath}${normalizedPath}`;
}
