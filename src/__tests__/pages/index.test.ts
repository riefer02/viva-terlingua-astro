import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Index from '../../pages/index.astro';

describe('Index page', () => {
  it('should render the page', async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Index);
    expect(result).toBeDefined();
  });
});
