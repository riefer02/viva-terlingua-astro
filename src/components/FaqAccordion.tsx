import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { Faq } from '@/types/strapi';

interface FaqAccordionProps {
  faqs: Faq[];
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  return (
    <Accordion type="single" collapsible className="bg-card">
      {faqs.map((faq) => (
        <AccordionItem
          key={faq.id}
          value={`faq-${faq.id}`}
          className="border-b border-border last:border-0"
        >
          <AccordionTrigger className="hover:no-underline text-lg font-medium tracking-tight text-card-foreground hover:text-primary">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent>
            <div
              className="leading-7 text-muted-foreground py-2"
              dangerouslySetInnerHTML={{ __html: faq.answer || '' }}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
