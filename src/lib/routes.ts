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
  AUTH_LOGIN: '/auth/login',
  COMMUNITY: '/reviews',
} as const;

export const NAV_LINKS = [
  { label: 'Explore', href: ROUTES.DESTINATIONS, hasMegaMenu: true },
  { label: 'Experiences', href: ROUTES.ACTIVITIES, hasMegaMenu: true },
  { label: 'Trips', href: ROUTES.PACKAGES, hasMegaMenu: true },
  { label: 'AI Planner', href: ROUTES.PLANNER, hasMegaMenu: false },
  { label: 'Community', href: ROUTES.REVIEWS, hasMegaMenu: true },
  { label: 'About', href: ROUTES.ABOUT, hasMegaMenu: false },
  { label: 'Contact', href: ROUTES.CONTACT, hasMegaMenu: false },
] as const;

export const MEGA_MENU_DATA = {
  Explore: {
    title: 'Top Destinations',
    tagline: 'Discover handpicked escapes across Southern India',
    items: [
      { name: 'Kodaikanal', description: 'Misty hills, pine forests & lakes', href: ROUTES.KODAIKANAL, badge: 'Popular' },
      { name: 'Ooty', description: 'Tea gardens & mountain railways', href: '/destinations/ooty' },
      { name: 'Coorg', description: 'Coffee plantations & lush valleys', href: '/destinations/coorg' },
      { name: 'Munnar', description: 'Emerald hills & cloud walks', href: '/destinations/munnar' },
      { name: 'Wayanad', description: 'Wilderness, caves & waterfalls', href: '/destinations/wayanad' },
      { name: 'Yercaud', description: 'Quiet jewel of the Shevaroys', href: '/destinations/yercaud' },
    ],
  },
  Experiences: {
    title: 'Curated Experiences',
    tagline: 'Crafted for every travel vibe and mood',
    items: [
      { name: 'Campfire & Bonfire Nights', description: 'Acoustic tunes & stargazing', href: ROUTES.ACTIVITIES },
      { name: 'Waterfall Treks', description: 'Hidden streams & secret pools', href: ROUTES.ACTIVITIES },
      { name: 'Coffee & Tea Trails', description: 'Estate walks & local tastings', href: ROUTES.ACTIVITIES },
      { name: 'Sunset Viewpoints', description: 'Panoramic mountain vistas', href: ROUTES.ACTIVITIES },
      { name: 'Scenic Roadtrips', description: 'Curve roads & playlist vibes', href: ROUTES.ACTIVITIES },
    ],
  },
  Trips: {
    title: 'Trip Categories',
    tagline: 'Find your next adventure by schedule & style',
    items: [
      { name: 'Trending Escapes', description: 'Our highest rated community favourites', href: ROUTES.PACKAGES, badge: 'Hot' },
      { name: 'Upcoming Departures', description: 'Join scheduled group trips this month', href: '#upcoming' },
      { name: 'Weekend Escapes', description: 'Quick 2-4 day resets for busy people', href: ROUTES.PACKAGES },
      { name: 'Custom Group Trips', description: 'Private trips for friend groups & teams', href: ROUTES.CUSTOMIZE },
    ],
  },
  Community: {
    title: 'Friendli Community',
    tagline: 'Real stories, real photos, real vibes',
    items: [
      { name: 'Captured Gallery', description: 'Instagram highlights & reel clips', href: '#gallery' },
      { name: 'Traveller Stories', description: 'Unfiltered reviews from our group trips', href: ROUTES.REVIEWS, badge: '4.9 ★' },
      { name: 'Travel Blogs & Guides', description: 'Insider tips, packing lists & food spots', href: ROUTES.BLOGS },
      { name: 'Trip FAQs', description: 'Everything you need to know before booking', href: ROUTES.FAQS },
    ],
  },
} as const;

export const PRIMARY_CTA = {
  label: 'Join Trip',
  href: ROUTES.CUSTOMIZE,
} as const;


