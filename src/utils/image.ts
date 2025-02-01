import config from '@/config/site';
import type { HomePage } from '@/types/strapi';

type StrapiImageType = NonNullable<HomePage['marqueeImage']>;

export function getStrapiImageUrl(
  image: StrapiImageType | null | undefined,
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
