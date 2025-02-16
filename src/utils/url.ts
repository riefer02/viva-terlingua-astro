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
