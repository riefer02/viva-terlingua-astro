import React from 'react';
import type { Faq } from '@/types/strapi';
import FaqAccordion from './FaqAccordion';
import { formatCategoryName } from '@/utils/faq';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FaqSectionProps {
  groupedFaqs: Record<string, Faq[]>;
}

export default function FaqSection({ groupedFaqs }: FaqSectionProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-12 md:space-y-16">
      {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
        <Card
          key={category}
          className="transition-shadow duration-200 hover:shadow-md bg-card border border-border"
        >
          <CardHeader className="pb-2">
            <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight text-primary">
              {formatCategoryName(category)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md">
              <FaqAccordion faqs={categoryFaqs} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
