import strapi from '@/lib/api/strapi-client';
import type { Blog } from '@/types/strapi';

export const loadBlogEntries = async () => {
  const response = await strapi.collection('blogs').find({
    populate: {
      heroImage: {
        populate: '*',
      },
      bodyContent: {
        on: {
          'blog-component.dynamic-blog-content': {
            populate: {
              imageContent: {
                populate: '*',
              },
            },
          },
          // Add other component types here if needed
          // 'blog-component.other-type': { ... }
        },
      },
      tags: true,
    },
  });
  // console.log('response', JSON.stringify(response, null, 2));

  const blogs = response.data as Blog[];

  return blogs.map(({ id, ...blog }) => ({
    id: String(id),
    ...blog,
  }));
};
