export const ROUTES = {
  HOME: '/',
  KODAIKANAL: '/packages/misty-kodaikanal-escape',
  WHY_FRIENDLI: '/#why-friendli',
  DESTINATIONS: '/destinations',
  PACKAGES: '/packages',
  ACTIVITIES: '/activities',
  PLANNER: '/planner',
  BLOGS: '/blogs',
  FAQS: '/faqs',
  ABOUT: '/about',
  CONTACT: '/contact',
  CUSTOMIZE: '/customize',
  DASHBOARD: '/dashboard',
  REVIEWS: '/reviews',
  LOYALTY: '/loyalty',
  SUPPORT: '/support',
  KNOWLEDGE_BASE: '/knowledge-base',
} as const;

export const NAV_LINKS = [
  { label: 'Destinations', href: ROUTES.DESTINATIONS },
  { label: 'Packages', href: ROUTES.PACKAGES },
  { label: 'AI Planner', href: ROUTES.PLANNER },
  { label: 'Blogs', href: ROUTES.BLOGS },
  { label: 'FAQs', href: ROUTES.FAQS },
  { label: 'About', href: ROUTES.ABOUT },
] as const;

export const PRIMARY_CTA = {
  label: 'AI Trip Planner',
  href: ROUTES.PLANNER,
} as const;
