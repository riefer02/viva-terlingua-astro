import { z } from 'astro:content';

export const musicianSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable().optional(),
  setTime: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  spotifyID: z.string().nullable().optional(),
  musicVideoID: z.string().nullable().optional(),
  year: z.number().nullable().optional(),
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
});
