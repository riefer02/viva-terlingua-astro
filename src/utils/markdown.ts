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
