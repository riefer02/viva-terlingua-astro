import { z } from 'astro:content';

export const blogSchema = z.object({
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
});
