import strapi from '@/lib/api/strapi-client';
import { z, defineCollection } from 'astro:content';
import type { BlogListResponse, Blog } from '@/types/strapi';

const blogCollection = defineCollection({
  loader: async () => {
    // TODO: Add populate for tags and bodyContent and all other fields
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
    description: z.string().nullable().optional(),
    heroImage: z
      .object({
        imageAlt: z.string().nullable().optional(),
        imageMedia: z
          .object({
            url: z.string(),
            width: z.number().nullable().optional(),
            height: z.number().nullable().optional(),
            alternativeText: z.string().nullable().optional(),
          })
          .nullable()
          .optional(),
      })
      .nullable()
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
      .nullable()
      .optional(),
    bodyContent: z
      .array(
        z.object({
          __component: z.string(),
          layoutType: z
            .enum(['text', 'image', 'textRightImageLeft', 'textLeftImageRight'])
            .nullable()
            .optional(),
          textContent: z.string().nullable().optional(),
          imageContent: z
            .object({
              imageAlt: z.string().nullable().optional(),
              imageMedia: z
                .object({
                  url: z.string(),
                  alternativeText: z.string().nullable().optional(),
                })
                .nullable()
                .optional(),
            })
            .nullable()
            .optional(),
        })
      )
      .nullable()
      .optional(),
    createdAt: z
      .string()
      .transform((str) => new Date(str))
      .nullable()
      .optional(),
    updatedAt: z
      .string()
      .transform((str) => new Date(str))
      .nullable()
      .optional(),
    publishedAt: z
      .string()
      .transform((str) => new Date(str))
      .nullable()
      .optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
