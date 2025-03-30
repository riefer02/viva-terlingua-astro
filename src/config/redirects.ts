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

  // Event page redirects
  '/terlingua-international-chili-cook-off-2021': {
    destination: '/events/terlingua-international-chili-cook-off-2021',
    status: 301,
  },
  '/terlingua-international-chili-cook-off-2022': {
    destination: '/events/terlingua-international-chili-cook-off-2022',
    status: 301,
  },
  '/first-time-chili-head': {
    destination: '/events/first-time-chili-head',
    status: 301,
  },
  '/what-is-texas-chili': {
    destination: '/events/what-is-texas-chili',
    status: 301,
  },
  '/schedule-2021': {
    destination: '/events',
    status: 301,
  },
  '/terlingua-official-shirt': {
    destination: '/',
    status: 301,
  },

  // Musician redirects - redirecting to proper musician pages instead of /music
  '/butch-hancock': {
    destination: '/musicians/butch-hancock',
    status: 301,
  },
  '/ellis-bullard': {
    destination: '/musicians/ellis-bullard',
    status: 301,
  },
  '/gary-p-nunn': {
    destination: '/musicians/gary-p-nunn',
    status: 301,
  },
  '/james-mcmurtry': {
    destination: '/musicians/james-mcmurtry',
    status: 301,
  },
  '/kaitlin-butts': {
    destination: '/musicians/kaitlin-butts',
    status: 301,
  },
  '/kathryn-legendre': {
    destination: '/musicians/kathryn-legendre',
    status: 301,
  },
  '/mark-david-manders': {
    destination: '/musicians/mark-david-manders',
    status: 301,
  },
  '/matt-castillo': {
    destination: '/musicians/matt-castillo',
    status: 301,
  },
  '/mike-and-the-moon-pies': {
    destination: '/musicians/mike-and-the-moon-pies',
    status: 301,
  },
  '/nathan-colt-young': {
    destination: '/musicians/nathan-colt-young',
    status: 301,
  },
  '/nik-parr-and-the-selfless-lovers': {
    destination: '/musicians/nik-parr-and-the-selfless-lovers',
    status: 301,
  },
  '/nikki-lane': {
    destination: '/musicians/nikki-lane',
    status: 301,
  },
  '/pinche-gringos': {
    destination: '/musicians/pinche-gringos',
    status: 301,
  },
  '/ray-wylie-hubbard': {
    destination: '/musicians/ray-wylie-hubbard',
    status: 301,
  },
  '/scott-walker-band': {
    destination: '/musicians/scott-walker-band',
    status: 301,
  },
  '/summer-dean': {
    destination: '/musicians/summer-dean',
    status: 301,
  },
  '/sunny-sweeney': {
    destination: '/musicians/sunny-sweeney',
    status: 301,
  },
  '/the-moonshiners': {
    destination: '/musicians/the-moonshiners',
    status: 301,
  },
  '/thomas-michael-riley': {
    destination: '/musicians/thomas-michael-riley',
    status: 301,
  },
  '/jesse-dayton': {
    destination: '/musicians/jesse-dayton',
    status: 301,
  },
  '/petty-theft': {
    destination: '/musicians/petty-theft',
    status: 301,
  },
  '/victor-trevino-/jr': {
    destination: '/musicians/victor-trevino-jr',
    status: 301,
  },
};
