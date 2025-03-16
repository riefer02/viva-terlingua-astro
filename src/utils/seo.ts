import config from '../config/site';
import { getSiteURL } from './url';

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export function generateSEO({
  title,
  description = config.description,
  image = config.seo.defaultImage,
  noindex = false,
  nofollow = false,
}: SEOProps = {}) {
  const seoTitle = title
    ? config.seo.titleTemplate.replace('%s', title)
    : config.title;

  const robots = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
  ].join(',');

  // Get the site URL to construct absolute URLs
  const siteUrl = getSiteURL();

  // Ensure image is an absolute URL
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  return {
    title: seoTitle,
    description,
    robots,
    openGraph: {
      title: seoTitle,
      description,
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: seoTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      creator: config.author.twitter,
    },
  };
}
