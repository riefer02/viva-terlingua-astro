import strapi from '@/lib/api/strapi-client';
import type { Musician } from '@/types/strapi';

export const loadMusicianEntries = async () => {
  const response = await strapi.collection('musicians').find({
    populate: {
      squareImage: {
        populate: '*',
      },
      seoMeta: {
        populate: '*',
      },
    },
  });

  if (!response?.data) {
    throw new Error('Musicians data not found');
  }

  const musicians = response.data as Musician[];

  return musicians.map(({ id, squareImage, seoMeta, ...musician }) => {
    // Transform the squareImage data to match our schema
    const transformedSquareImage =
      squareImage && Object.keys(squareImage).length > 0
        ? {
            imageAlt: squareImage.alternativeText || '',
            imageMedia: {
              url: squareImage.url,
              width: squareImage.width,
              height: squareImage.height,
              alternativeText: squareImage.alternativeText,
            },
          }
        : null;

    return {
      id: String(id),
      ...musician,
      squareImage: transformedSquareImage,
      seoMeta,
    };
  });
};
