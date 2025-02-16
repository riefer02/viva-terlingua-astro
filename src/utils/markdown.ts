import { marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { mangle } from 'marked-mangle';

// Configure marked with extensions and options
marked.use(gfmHeadingId(), mangle());
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert line breaks to <br>
});

/**
 * Parses markdown content to HTML
 * @param content - The markdown content to parse
 * @returns HTML string
 */
export function parseMarkdown(content: string | undefined): string {
  return marked.parse(content || '').toString();
}

/**
 * Strips HTML tags from a string and decodes HTML entities
 * @param html - The HTML string to strip
 * @returns Clean text without HTML tags
 */
export function stripHtml(html: string | undefined): string {
  if (!html) return '';

  // First remove HTML tags
  const withoutTags = html.replace(/<[^>]*>/g, '');

  // Then decode common HTML entities
  return (
    withoutTags
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&nbsp;/g, ' ')
      // Trim extra whitespace
      .replace(/\s+/g, ' ')
      .trim()
  );
}
