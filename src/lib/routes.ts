export const ROUTES = {
  HOME: '/',
  KODAIKANAL: '/trips/kodaikanal',
  WHY_FRIENDLI: '/#why-friendli',
  ABOUT: '/about',
  CONTACT: '/contact',
  CUSTOMIZE: '/customize',
  ENQUIRY_SUCCESS: '/enquiry/success',
} as const;

export const NAV_LINKS = [
  { label: 'Kodaikanal', href: ROUTES.KODAIKANAL },
  { label: 'Why Friendli', href: ROUTES.WHY_FRIENDLI },
  { label: 'About', href: ROUTES.ABOUT },
  { label: 'Contact', href: ROUTES.CONTACT },
] as const;

export const PRIMARY_CTA = {
  label: 'Join the Trip',
  href: ROUTES.CUSTOMIZE,
} as const;
