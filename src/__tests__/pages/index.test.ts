import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Index from '../../pages/index.astro';

describe('Index page', () => {
  it('should render the page', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Index);
    expect(result).toBeDefined();
  });

  it('should contain main content elements', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Index);

    // Add specific content checks based on your index page
    expect(result).toContain('<html');
    expect(result).toContain('<body');
  });
});
