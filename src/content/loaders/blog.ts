import strapi from '@/lib/api/strapi-client';
import type { Blog } from '@/types/strapi';

export const loadBlogEntries = async () => {
  const response = await strapi.collection('blogs').find({
    populate: {
      heroImage: {
        populate: '*',
      },
      bodyContent: {
        populate: '*',
      },
      tags: true,
    },
  });

  const blogs = response.data as Blog[];

  return blogs.map(({ id, ...blog }) => ({
    id: String(id),
    ...blog,
  }));
};
