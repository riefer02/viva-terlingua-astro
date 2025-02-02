import config from '@/config/site';

/**
 * Converts a Strapi relative path to a full URL
 * @param path - The relative path from Strapi
 * @returns The full URL including the Strapi base URL
 */
export const getStrapiUrl = (path: string | undefined): string => {
  if (!path) return '';

  // If the path is already a full URL, return it as is
  if (path.startsWith('http')) {
    return path;
  }

  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const fullUrl = `${config.strapi.url}/${cleanPath}`;

  return fullUrl;
};
