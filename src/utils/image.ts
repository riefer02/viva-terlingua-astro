import config from '@/config/site';
import type { HomePage } from '@/types/strapi';

// Original Strapi image type
type StrapiImageType = NonNullable<HomePage['marqueeImage']>;

// Content collection image type based on blog schema
type ContentCollectionImageType = {
  url: string;
  width?: number | null;
  height?: number | null;
  alternativeText?: string | null;
  formats?: Record<string, { url: string; width: number; height: number }>;
};

// Union type to handle both image types
type ImageType =
  | StrapiImageType
  | ContentCollectionImageType
  | null
  | undefined;

export function getStrapiImageUrl(
  image: ImageType,
  format?: 'thumbnail' | 'small' | 'medium' | 'large'
): string {
  if (!image?.url) return '';

  let imageUrl = '';

  if (format && image.formats && image.formats[format]?.url) {
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
