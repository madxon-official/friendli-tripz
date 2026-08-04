import { Trip, ExperienceFeature, WhyFriendliPrinciple, HowItWorksStep } from '../types';

export const BRAND_INFO = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME || 'Friendli Tripz',
  tagline: process.env.NEXT_PUBLIC_BRAND_TAGLINE || 'Travel. Vibe. Repeat.',
  eyebrow: 'FRIENDLI TRIPZ PRESENTS',
  badgeTag: 'FRIENDLI TRIPZ × ESCAPES',
  chapterLabel: 'CHAPTER 01',
  coordinates: '10.2381° N, 77.4892° E',
  trustLine: 'Curated trips · Friendli support · Made for good memories',
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+91 94301 87099',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917603967190',
  whatsappUrl: process.env.NEXT_PUBLIC_WHATSAPP_URL || `https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917603967190').replace(/[\s\+]/g, '')}`,
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@friendlitripz.com',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@friendlitripz.com',
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/friendlitripz',
  youtubeUrl: process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://youtube.com/@friendlitripz',
};

export const VIBE_CATEGORIES = [
  {
    id: 'vibe-1',
    title: 'Mountain Escape',
    subtitle: 'Misty hills & cool breeze',
    icon: 'Trees',
    color: 'from-emerald-500/20 to-teal-500/20',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=600&q=75',
  },
  {
    id: 'vibe-3',
    title: 'Campfire Nights',
    subtitle: 'Stargazing & cozy music',
    icon: 'Flame',
    color: 'from-orange-500/20 to-amber-500/20',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=75',
  },
  {
    id: 'vibe-4',
    title: 'Café Vibes',
    subtitle: 'Artisan brews & slow afternoons',
    icon: 'Coffee',
    color: 'from-amber-600/20 to-orange-400/20',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=75',
  },
  {
    id: 'vibe-5',
    title: 'Road Trip',
    subtitle: 'Winding roads & epic playlists',
    icon: 'Car',
    color: 'from-indigo-500/20 to-purple-500/20',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=75',
  },
  {
    id: 'vibe-6',
    title: 'Nature Reset',
    subtitle: 'Forest baths & hidden trails',
    icon: 'Leaf',
    color: 'from-green-500/20 to-emerald-600/20',
    image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=600&q=75',
  },
  {
    id: 'vibe-7',
    title: 'Weekend Vibe',
    subtitle: 'Quick 2-3 day escapes',
    icon: 'Sparkles',
    color: 'from-rose-500/20 to-pink-500/20',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=75',
  },
];

export const TRENDING_TRIPS = [
  {
    id: 'kodai-01',
    slug: 'misty-kodaikanal-escape',
    name: 'Kodaikanal Escape',
    location: 'Tamil Nadu',
    duration: '4D / 3N',
    price: '₹8,999',
    rating: '4.9',
    reviewsCount: '243',
    nextDeparture: '15 May',
    seatsLeft: '09 Seats Left',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=600&q=75',
    badge: 'Bestseller',
  },
  {
    id: 'ooty-01',
    slug: 'ooty-adventure',
    name: 'Ooty Adventure',
    location: 'Tamil Nadu',
    duration: '4D / 3N',
    price: '₹9,499',
    rating: '4.8',
    reviewsCount: '192',
    nextDeparture: '18 May',
    seatsLeft: '05 Seats Left',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=75',
    badge: 'Trending',
  },
  {
    id: 'valparai-01',
    slug: 'valparai-retreat',
    name: 'Valparai Retreat',
    location: 'Tamil Nadu',
    duration: '3D / 2N',
    price: '₹7,499',
    rating: '4.9',
    reviewsCount: '180',
    nextDeparture: '20 May',
    seatsLeft: '06 Seats Left',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=75',
    badge: 'Popular',
  },
];

export const WHY_FRIENDLI_V2 = [
  {
    id: 'wf-1',
    title: 'Verified Stays',
    description: 'Handpicked & quality-checked accommodations with top ratings.',
    iconName: 'ShieldCheck',
  },
  {
    id: 'wf-2',
    title: 'Curated Itineraries',
    description: 'Experience-rich trips crafted by experts, not checklist rushing.',
    iconName: 'Compass',
  },
  {
    id: 'wf-3',
    title: 'Local Experts',
    description: 'On-ground team & local guides who know secret hidden spots.',
    iconName: 'UserCheck',
  },
  {
    id: 'wf-4',
    title: 'Comfortable Transport',
    description: 'Safe, clean & well-maintained vehicles for smooth journeys.',
    iconName: 'Car',
  },
  {
    id: 'wf-5',
    title: 'Small Groups',
    description: '8 - 16 travellers for better bonds and authentic social vibes.',
    iconName: 'Users',
  },
  {
    id: 'wf-6',
    title: 'Zero Planning Stress',
    description: 'We handle stay, transport & spots. You just show up and vibe.',
    iconName: 'Smile',
  },
];

export const UPCOMING_DEPARTURES = [
  {
    id: 'dep-1',
    destination: 'Kodaikanal',
    date: '15 May',
    duration: '4D / 3N',
    price: '₹8,999',
    seatsLeft: 9,
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
    month: 'May 26',
  },
  {
    id: 'dep-2',
    destination: 'Ooty',
    date: '18 May',
    duration: '4D / 3N',
    price: '₹9,499',
    seatsLeft: 5,
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    month: 'May 26',
  },
  {
    id: 'dep-3',
    destination: 'Valparai',
    date: '20 May',
    duration: '3D / 2N',
    price: '₹7,499',
    seatsLeft: 6,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    month: 'May 26',
  },
];

export const GALLERY_ITEMS = [
  {
    id: 'g-1',
    type: 'video',
    title: 'Campfire Jamming session in Kodai',
    author: '@rahul_travels',
    thumbnail: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=600&q=75',
    aspect: 'aspect-[4/5]',
  },
  {
    id: 'g-2',
    type: 'photo',
    title: 'Morning mist at Silver Cascade',
    author: '@ananya_clicks',
    thumbnail: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=600&q=75',
    aspect: 'aspect-square',
  },
  {
    id: 'g-3',
    type: 'photo',
    title: 'Jeep ride through pine forests',
    author: '@karthik_vlog',
    thumbnail: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=75',
    aspect: 'aspect-[4/3]',
  },
  {
    id: 'g-4',
    type: 'photo',
    title: 'Sunset over Kodai Lake',
    author: '@priya.wanderlust',
    thumbnail: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=75',
    aspect: 'aspect-[3/4]',
  },
  {
    id: 'g-5',
    type: 'photo',
    title: 'Group photo at Dolphin Nose viewpoint',
    author: '@friendlitripz_official',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=75',
    aspect: 'aspect-square',
  },
  {
    id: 'g-6',
    type: 'photo',
    title: 'Coffee brew by the valley',
    author: '@vikram_adventures',
    thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=75',
    aspect: 'aspect-[4/5]',
  },
];

export const TRAVELLER_STORIES = [
  {
    id: 'ts-1',
    name: 'Rahul S.',
    location: 'Bangalore',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    time: '10:30 AM',
    comment: 'Bro... didn\'t expect strangers to become friends for life. Already planning my next trip! 🔥',
    rating: 5,
    tripName: 'Kodaikanal Escape',
  },
  {
    id: 'ts-2',
    name: 'Ananya R.',
    location: 'Chennai',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
    time: '11:45 AM',
    comment: 'Everything was so well-organized. The stay, food, itinerary — perfect! 10/10 experience.',
    rating: 5,
    tripName: 'Ooty Adventure',
  },
  {
    id: 'ts-4',
    name: 'Priya M.',
    location: 'Mumbai',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    time: '12:20 PM',
    comment: 'Already booked my next trip with you guys ❤️ See you soon!',
    rating: 5,
    tripName: 'Valparai Retreat',
  },
];

export const HOW_IT_WORKS_V2 = [
  {
    step: '01',
    title: 'Choose Your Vibe',
    description: 'Pick how you want to feel — mountain mist, beach waves, or campfire tunes.',
    icon: 'Sparkles',
  },
  {
    step: '02',
    title: 'Choose Your Trip',
    description: 'Explore handpicked itineraries with fixed dates and clear transparent prices.',
    icon: 'Compass',
  },
  {
    step: '03',
    title: 'Book & Confirm',
    description: 'Secure your spot in just a few clicks with instant WhatsApp support.',
    icon: 'CheckCircle2',
  },
  {
    step: '04',
    title: 'Travel & Enjoy',
    description: 'We handle the stay, transport, and routes. You show up and make memories.',
    icon: 'HeartHandshake',
  },
];

export const TRAVEL_CONFIDENCE_ITEMS = [
  {
    id: 'tc-1',
    title: 'Secure Payments',
    description: 'Your data and payments are 100% safe & encrypted.',
    icon: 'ShieldCheck',
  },
  {
    id: 'tc-2',
    title: '24/7 Support',
    description: 'We\'re with you before, during & after the trip.',
    icon: 'Headphones',
  },
  {
    id: 'tc-3',
    title: 'Flexible Cancellation',
    description: 'Plans that flex with your plans with minimal hassle.',
    icon: 'Calendar',
  },
  {
    id: 'tc-4',
    title: 'No Hidden Costs',
    description: 'What you see is what you pay. Transparent pricing always.',
    icon: 'Receipt',
  },
];

export const FAQ_ITEMS = [
  {
    id: 'faq-1',
    question: 'Who travels with Friendli Tripz?',
    answer: 'Our trips attract friendly solo travellers, small friend groups, couples, and young professionals aged 18 to 35 who want to travel without planning stress and meet like-minded people.',
  },
  {
    id: 'faq-2',
    question: 'Can I join solo?',
    answer: 'Absolutely! Over 60% of our travellers join solo. You will instantly feel part of the group from day one, with twin or triple sharing rooms paired with same-gender trip mates.',
  },
  {
    id: 'faq-3',
    question: 'What is included in the trip cost?',
    answer: 'Our packages include verified boutique accommodations, comfortable AC transport throughout the trip, selected meals, bonfire nights, entry tickets, and full-time local tour leader support.',
  },
  {
    id: 'faq-4',
    question: 'How do I confirm my seat?',
    answer: 'Select your preferred trip departure date, click "Book Now" or "Join Trip", enter your traveller details, and complete the partial deposit or full payment via our 100% secure gateway.',
  },
  {
    id: 'faq-5',
    question: 'What if I need to cancel or reschedule?',
    answer: 'We offer flexible cancellation up to 7 days before departure. You can either receive a full credit voucher valid for 1 year or request a refund as per our cancellation policy.',
  },
];

export const KODAIKANAL_TRIP: Trip = {
  id: 'kodai-01',
  slug: 'kodaikanal',
  name: 'Kodaikanal Mountain Escape',
  tagline: 'Misty roads, pine forests, and mountain air with good company.',
  destination: 'Kodaikanal, Tamil Nadu',
  state: 'Tamil Nadu',
  country: 'India',
  heroHeadline: 'Kodaikanal hits different with the right people.',
  heroSubheadline: "Misty roads, mountain views and a trip worth remembering. We've planned the Kodaikanal escape — you just have to show up.",
  duration: '4 Days / 3 Nights',
  departureCity: 'Madurai',
  startingPrice: '₹8,999 per person',
  nextTripDate: 'May 15, 2026',
  heroImage: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
  galleryImages: [
    'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
  ],
  isFeatured: true,
  isAvailable: true,
};

export const EXPERIENCE_FEATURES: ExperienceFeature[] = [
  {
    id: 'exp-1',
    title: 'See More',
    description: 'Experience Kodaikanal beyond rushing from one checkpoint to another.',
    iconName: 'compass',
    imageBg: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'exp-2',
    title: 'Rush Less',
    description: 'Give the trip enough breathing room to actually enjoy the hills.',
    iconName: 'wind',
    imageBg: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'exp-3',
    title: 'Travel Together',
    description: 'Because the right company can turn a good destination into a great memory.',
    iconName: 'users',
    imageBg: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80',
  },
];

export const WHY_FRIENDLI_PRINCIPLES: WhyFriendliPrinciple[] = [
  {
    id: 'prin-1',
    number: '01',
    title: 'Thoughtfully Planned',
    description: 'We handle the details so you can focus on the experience.',
    iconName: 'sparkles',
  },
  {
    id: 'prin-2',
    number: '02',
    title: 'Good Company',
    description: 'Trips designed around sharing experiences, not just sharing transport.',
    iconName: 'users',
  },
  {
    id: 'prin-3',
    number: '03',
    title: 'Room to Enjoy',
    description: "A trip shouldn't feel like racing through a sightseeing checklist.",
    iconName: 'coffee',
  },
  {
    id: 'prin-4',
    number: '04',
    title: 'Human Support',
    description: "When you need help, you're talking to people — not fighting through a support maze.",
    iconName: 'heartHandshake',
  },
];

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    stepNumber: '01',
    title: 'Discover',
    description: "See what we've planned for Kodaikanal.",
  },
  {
    stepNumber: '02',
    title: 'Make It Yours',
    description: 'Join the standard trip or tell us what you would like changed.',
  },
  {
    stepNumber: '03',
    title: 'Send Your Request',
    description: 'Share your traveller details and preferences.',
  },
  {
    stepNumber: '04',
    title: 'We Connect',
    description: 'Friendli Tripz reviews your request and continues the conversation with you personally.',
  },
];
