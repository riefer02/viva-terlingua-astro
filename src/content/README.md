# Content Directory Structure

This directory contains the content collections for the Astro project. The structure is organized for better separation of concerns and improved readability.

## Directory Structure

```
content/
├── collections/    # Collection definitions that combine schemas and loaders
├── loaders/        # Data fetching logic for each collection
├── schemas/        # Schema definitions for each collection
├── config.ts       # Main configuration file that exports all collections
└── README.md       # This documentation file
```

## Adding a New Collection

To add a new collection, follow these steps:

1. Create a schema file in `schemas/` that defines the data structure
2. Create a loader file in `loaders/` that handles data fetching
3. Create a collection file in `collections/` that combines the schema and loader
4. Import and add the new collection to `config.ts`

### Example:

```typescript
// 1. Create schema (schemas/example.ts)
import { z } from 'astro:content';

export const exampleSchema = z.object({
  id: z.string(),
  title: z.string(),
  // ... other fields
});

// 2. Create loader (loaders/example.ts)
import strapi from '@/lib/api/strapi-client';
import type { Example } from '@/types/strapi';

export const loadExampleEntries = async () => {
  const response = await strapi.collection('examples').find({
    // ... query options
  });

  const examples = response.data as Example[];

  return examples.map(({ id, ...example }) => ({
    id: String(id),
    ...example,
  }));
};

// 3. Create collection (collections/example.ts)
import { defineCollection } from 'astro:content';
import { exampleSchema } from '../schemas/example';
import { loadExampleEntries } from '../loaders/example';

export const exampleCollection = defineCollection({
  schema: exampleSchema,
  loader: loadExampleEntries,
});

// 4. Add to config.ts
import { exampleCollection } from './collections/example';

export const collections = {
  // ... existing collections
  example: exampleCollection,
};
```

## Benefits of This Structure

- **Separation of Concerns**: Schema definitions are separate from data fetching logic
- **Maintainability**: Easier to update and maintain individual parts
- **Scalability**: Simple to add new collections without cluttering the main config file
- **Readability**: Clear organization makes it easier to understand the codebase
