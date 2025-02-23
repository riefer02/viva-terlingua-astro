import type { AstroConfig } from 'astro';

type RedirectConfig = NonNullable<AstroConfig['redirects']>;

export const redirects: RedirectConfig = {
  // Blog redirects
  '/blogs': {
    destination: '/blog',
    status: 301,
  },
  '/blogs/:slug': {
    destination: '/blog/:slug',
    status: 301,
  },

  // Historical page redirects
  '/terlingua-international-chili-cook-off-2021': {
    destination: '/terlingua-international-chili-cook-off',
    status: 301,
  },
  '/terlingua-official-shirt': {
    destination: '/',
    status: 301,
  },
  '/schedule-2021': {
    destination: '/',
    status: 301,
  },

  // Music artist redirects
  '/jesse-dayton': {
    destination: '/music',
    status: 301,
  },
  '/mike-and-the-moon-pies': {
    destination: '/music',
    status: 301,
  },
  '/petty-theft': {
    destination: '/music',
    status: 301,
  },
  '/victor-trevino-/jr': {
    destination: '/music',
    status: 301,
  },
};
