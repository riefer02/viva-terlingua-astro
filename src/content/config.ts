import strapi from '@/lib/api/strapi-client';
import { z, defineCollection } from 'astro:content';
import type { BlogListResponse, Blog } from '@/types/strapi';

const blogCollection = defineCollection({
  loader: async () => {
    const response = await strapi.find<BlogListResponse>('blogs', {
      populate: '*',
    });
    const blogs = response.data as Blog[];
    return blogs.map(({ id, ...blog }) => ({
      id: String(id),
      ...blog,
    }));
  },
  schema: z.object({
    id: z.string(),
    documentId: z.string(),
    title: z.string(),
    author: z.string(),
    description: z.string().optional(),
    heroImage: z
      .object({
        imageAlt: z.string().optional(),
        imageMedia: z
          .object({
            url: z.string(),
            width: z.number().optional(),
            height: z.number().optional(),
            alternativeText: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
    featuredPost: z.boolean().optional(),
    tags: z
      .array(
        z.object({
          id: z.number(),
          name: z.string(),
          slug: z.string(),
        })
      )
      .optional(),
    bodyContent: z
      .array(
        z.object({
          __component: z.string(),
          layoutType: z
            .enum(['text', 'image', 'textRightImageLeft', 'textLeftImageRight'])
            .optional(),
          textContent: z.string().optional(),
          imageContent: z
            .object({
              imageAlt: z.string().optional(),
              imageMedia: z
                .object({
                  url: z.string(),
                  alternativeText: z.string().optional(),
                })
                .optional(),
            })
            .optional(),
        })
      )
      .optional(),
    createdAt: z
      .string()
      .transform((str) => new Date(str))
      .optional(),
    updatedAt: z
      .string()
      .transform((str) => new Date(str))
      .optional(),
    publishedAt: z
      .string()
      .transform((str) => new Date(str))
      .optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
