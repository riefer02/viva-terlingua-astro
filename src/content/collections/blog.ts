import { defineCollection } from 'astro:content';
import { blogSchema } from '../schemas/blog';
import { loadBlogEntries } from '../loaders/blog';

export const blogCollection = defineCollection({
  schema: blogSchema,
  loader: loadBlogEntries,
});
