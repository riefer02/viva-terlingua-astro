import config from '@/config/site';

export interface StrapiImage {
  url: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

export function getStrapiImageUrl(
  image: StrapiImage | null | undefined,
  format?: 'thumbnail' | 'small' | 'medium' | 'large'
): string {
  if (!image) return '';

  let imageUrl = '';

  if (format && image.formats && image.formats[format]) {
    imageUrl = image.formats[format].url;
  } else {
    imageUrl = image.url;
  }

  // If the URL is already absolute, return it as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  // Remove leading slash if present to avoid double slashes
  const cleanUrl = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
  return `${config.strapi.url}/${cleanUrl}`;
}
