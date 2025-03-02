// Main content configuration file
// This file imports and exports all collections

import { blogCollection } from './collections/blog';
import { musicianCollection } from './collections/musician';

// Export all collections
export const collections = {
  blog: blogCollection,
  musicians: musicianCollection,
};

// Add new collections here as they are created
// Example:
// import { newCollection } from './collections/new';
// Then add to the collections object above:
// newCollection: newCollection,
