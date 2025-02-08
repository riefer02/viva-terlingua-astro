import type { Faq } from '@/types/strapi';

export function groupFaqsByCategory(faqs: Faq[]): Record<string, Faq[]> {
  return faqs.reduce<Record<string, Faq[]>>((acc, faq) => {
    const category = faq.category || 'general';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {});
}

export function formatCategoryName(category: string): string {
  return category
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
