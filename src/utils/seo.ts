import config from '../config/site';

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
          url: image,
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
