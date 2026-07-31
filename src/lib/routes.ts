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
  PRIVACY_POLICY: '/privacy-policy',
  TERMS: '/terms',
  CANCELLATION_POLICY: '/cancellation-policy',
  TRACK_TRIP: '/trip',
} as const;

export const NAV_LINKS = [
  { label: 'Destinations', href: ROUTES.DESTINATIONS },
  { label: 'Packages', href: ROUTES.PACKAGES },
  { label: 'Track Booking', href: ROUTES.TRACK_TRIP },
  { label: 'AI Planner', href: ROUTES.PLANNER },
  { label: 'Blogs', href: ROUTES.BLOGS },
  { label: 'FAQs', href: ROUTES.FAQS },
  { label: 'About', href: ROUTES.ABOUT },
  { label: 'Contact', href: ROUTES.CONTACT },
] as const;

export const PRIMARY_CTA = {
  label: 'Join the Trip',
  href: ROUTES.CUSTOMIZE,
} as const;

