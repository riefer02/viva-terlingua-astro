import { describe, it, expect, beforeEach } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Welcome from '../../components/Welcome.astro';

describe('Welcome component', () => {
  let container: Awaited<ReturnType<typeof AstroContainer.create>>;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it('renders without crashing', async () => {
    const html = await container.renderToString(Welcome);
    expect(html).toBeDefined();
  });

  it('contains welcome message', async () => {
    const html = await container.renderToString(Welcome);
    expect(html).toContain('Welcome');
  });

  it('renders with props', async () => {
    const html = await container.renderToString(Welcome, {
      props: {
        // Add component props here when needed
      },
    });
    expect(html).toBeDefined();
  });
});
