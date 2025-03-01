import strapi from '@/lib/api/strapi-client';
import { z, defineCollection } from 'astro:content';
import type { Blog, Musician } from '@/types/strapi';

const blogCollection = defineCollection({
  loader: async () => {
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

const musicianCollection = defineCollection({
  loader: async () => {
    const response = await strapi.collection('musicians').find({
      populate: {
        squareImage: {
          populate: '*',
        },
        meta: {
          populate: '*',
        },
        image: {
          populate: '*',
        },
      },
    });

    if (!response?.data) {
      throw new Error('Musicians data not found');
    }

    const musicians = response.data as Musician[];
    return musicians.map(({ id, ...musician }) => ({
      id: String(id),
      ...musician,
    }));
  },
  schema: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    setTime: z.string().nullable().optional(),
    website: z.string().nullable().optional(),
    spotifyID: z.string().nullable().optional(),
    musicVideoID: z.string().nullable().optional(),
    squareImage: z
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
    meta: z
      .object({
        title: z.string().nullable().optional(),
        description: z.string().nullable().optional(),
      })
      .nullable()
      .optional(),
  }),
});

export const collections = {
  blog: blogCollection,
  musicians: musicianCollection,
};
