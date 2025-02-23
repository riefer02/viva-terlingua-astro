export const desktopNavLinks = [
  { label: 'Tickets', href: '/tickets' },
  { label: 'Music', href: '/music' },
  { label: 'About', href: '/about' },
  { label: 'Resources', href: '/resources' },
  { label: 'FAQ', href: '/faqs' },
  { label: 'Blog', href: '/blog' },
] as const;

export const mobileNavLinks = [
  { label: 'Home', href: '/' },
  { label: 'Tickets', href: '/tickets' },
  { label: 'Music', href: '/music' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faqs' },
  { label: 'Resources', href: '/resources' },
  { label: 'News & Events', href: '/events' },
  { label: 'Local Attractions', href: '/local-attractions' },
  { label: 'Blog', href: '/blog' },
] as const;

export interface NavLink {
  label: string;
  href: string;
}
