export const ROUTES = {
  HOME: '/',
  EXPLORE: '/discover',
  DISCOVER: '/discover',
  DESTINATIONS: '/destinations',
  EXPERIENCES: '/experiences',
  PACKAGES: '/packages',
  PLANNER: '/planner',
  ENQUIRE: '/enquire',
  TRACK_TRIP: '/track',
  TRACK_BOOKING: '/track',
  BLOGS: '/blogs',
  FAQS: '/faqs',
  ABOUT: '/about',
  CONTACT: '/contact',
  CUSTOMIZE: '/customize',
  REVIEWS: '/reviews',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS: '/terms',
  CANCELLATION_POLICY: '/cancellation-policy',
  KODAIKANAL: '/destinations/kodaikanal',
  OOTY: '/destinations/ooty',
  COORG: '/destinations/coorg',
  WAYANAD: '/destinations/wayanad',
  ACTIVITIES: '/experiences',
  AUTH_LOGIN: '/admin/login',
  DASHBOARD: '/admin',
  ADMIN: '/admin',
} as const;

export const NAV_LINKS = [
  { label: 'Explore', href: ROUTES.EXPLORE, hasMegaMenu: false },
  { label: 'Experiences', href: ROUTES.EXPERIENCES, hasMegaMenu: false },
  { label: 'Packages', href: ROUTES.PACKAGES, hasMegaMenu: false },
  { label: 'AI Planner', href: ROUTES.PLANNER, hasMegaMenu: false },
  { label: 'Blogs', href: ROUTES.BLOGS, hasMegaMenu: false },
  { label: 'Track Booking', href: ROUTES.TRACK_BOOKING, hasMegaMenu: false },
  { label: 'About', href: ROUTES.ABOUT, hasMegaMenu: false },
  { label: 'Contact', href: ROUTES.CONTACT, hasMegaMenu: false },
] as const;

export const MEGA_MENU_DATA = {
  Explore: {
    title: 'Explore Places',
    tagline: 'Misty hills, tea slopes & hidden glades',
    items: [
      { name: 'Kodaikanal', description: 'Misty pine trails & lakes', href: ROUTES.KODAIKANAL },
      { name: 'Ooty', description: 'Tea gardens & toy train', href: ROUTES.OOTY },
      { name: 'Coorg', description: 'Coffee plantations & waterfalls', href: ROUTES.COORG },
      { name: 'Wayanad', description: 'Rainforests & cave trails', href: ROUTES.WAYANAD },
    ],
  },
} as const;

export const PRIMARY_CTA = {
  label: 'Find Your Vibe',
  href: ROUTES.EXPLORE,
} as const;

export const SECONDARY_CTA = {
  label: 'Start Planning',
  href: ROUTES.PLANNER,
} as const;
