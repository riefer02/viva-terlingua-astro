import { defineCollection } from 'astro:content';
import { musicianSchema } from '../schemas/musician';
import { loadMusicianEntries } from '../loaders/musician';

export const musicianCollection = defineCollection({
  schema: musicianSchema,
  loader: loadMusicianEntries,
});
