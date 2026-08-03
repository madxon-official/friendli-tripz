export interface DestinationData {
  slug: string;
  name: string;
  state: string;
  tagline: string;
  heroImage: string;
  description: string;
  bestSeason: string;
  weather: string;
  highlights: string[];
  thingsToDo: string[];
  packageCount: number;
  avgPrice: string;
  image: string;
  gallery: string[];
}

export const DESTINATIONS: DestinationData[] = [
  {
    slug: 'kodaikanal',
    name: 'Kodaikanal',
    state: 'Tamil Nadu',
    tagline: 'Princess of Hill Stations',
    heroImage: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&w=1600&q=80',
    description: 'Perched at 7,200 feet in the Palani Hills, Kodaikanal captivates with its serene lake, lush pine forests, and misty mountain trails. A paradise for nature lovers and romantics alike.',
    bestSeason: 'Oct – Mar',
    weather: '12°C – 20°C',
    highlights: ['Kodai Lake', 'Coakers Walk', 'Pillar Rocks', 'Silver Cascade Falls', 'Dolphin Nose'],
    thingsToDo: ['Boating on Kodai Lake', 'Pine Forest Trekking', 'Campfire Nights', 'Sunrise at Dolphin Nose', 'Chocolate & Cheese Shopping'],
    packageCount: 6,
    avgPrice: '₹8,999',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&w=1200&q=80',
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&w=1200&q=80',
      'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&w=1200&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&w=1200&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&w=1200&q=80',
    ],
  },
  {
    slug: 'ooty',
    name: 'Ooty',
    state: 'Tamil Nadu',
    tagline: 'Queen of Hill Stations',
    heroImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&w=1600&q=80',
    description: 'The Nilgiri queen enchants with its sprawling tea gardens, the iconic toy train, and lush botanical gardens. A perfect blend of colonial charm and natural beauty.',
    bestSeason: 'Oct – Jun',
    weather: '10°C – 25°C',
    highlights: ['Ooty Lake', 'Botanical Gardens', 'Nilgiri Mountain Railway', 'Tea Museum', 'Doddabetta Peak'],
    thingsToDo: ['Nilgiri Toy Train Ride', 'Tea Estate Walk', 'Boating on Ooty Lake', 'Rose Garden Visit', 'Chocolate Factory Tour'],
    packageCount: 5,
    avgPrice: '₹9,499',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&w=1200&q=80',
    gallery: [],
  },
  {
    slug: 'coorg',
    name: 'Coorg',
    state: 'Karnataka',
    tagline: 'Scotland of India',
    heroImage: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&w=1600&q=80',
    description: 'Hidden in the Western Ghats, Coorg welcomes you with coffee-scented air, misty valleys, and the warm hospitality of the Kodava people.',
    bestSeason: 'Oct – Mar',
    weather: '15°C – 28°C',
    highlights: ['Abbey Falls', 'Raja Seat', 'Coffee Plantations', 'Dubare Elephant Camp', 'Talacauvery'],
    thingsToDo: ['Coffee Trail Walk', 'River Rafting', 'Elephant Camp Visit', 'Tibetan Monastery', 'Sunset at Raja Seat'],
    packageCount: 5,
    avgPrice: '₹9,499',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&w=1200&q=80',
    gallery: [],
  },
  {
    slug: 'munnar',
    name: 'Munnar',
    state: 'Kerala',
    tagline: "God's Own Country",
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&w=1600&q=80',
    description: "A sea of emerald tea plantations, cloud-kissed peaks, and cascading waterfalls make Munnar one of South India's most breathtaking hill stations.",
    bestSeason: 'Sep – May',
    weather: '10°C – 25°C',
    highlights: ['Top Station', 'Eravikulam National Park', 'Tea Museum', 'Mattupetty Dam', 'Attukal Waterfalls'],
    thingsToDo: ['Tea Garden Walk', 'Neelakurinji Bloom Trek', 'Shikara Ride at Mattupetty', 'Spice Garden Tour', 'Cloud Walk at Top Station'],
    packageCount: 4,
    avgPrice: '₹10,499',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&w=1200&q=80',
    gallery: [],
  },
  {
    slug: 'wayanad',
    name: 'Wayanad',
    state: 'Kerala',
    tagline: 'Land of Paddy Fields & Waterfalls',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&w=1600&q=80',
    description: "Ancient caves, dramatic waterfalls, dense forests, and spice plantations — Wayanad is an adventurer's dream wrapped in Kerala's lush green blanket.",
    bestSeason: 'Oct – May',
    weather: '18°C – 30°C',
    highlights: ['Edakkal Caves', 'Meenmutty Falls', 'Banasura Sagar Dam', 'Chembra Peak', 'Pookode Lake'],
    thingsToDo: ['Cave Exploration', 'Bamboo Rafting', 'Wildlife Safari', 'Spice Plantation Tour', 'Trek to Heart-shaped Lake'],
    packageCount: 4,
    avgPrice: '₹8,499',
    image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&w=1200&q=80',
    gallery: [],
  },
  {
    slug: 'yercaud',
    name: 'Yercaud',
    state: 'Tamil Nadu',
    tagline: 'Jewel of the Shevaroys',
    heroImage: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&w=1600&q=80',
    description: 'Tucked away in the Shevaroy Hills, Yercaud is a peaceful haven of coffee estates, orange groves, spice gardens, and tranquil lakes.',
    bestSeason: 'Oct – Jun',
    weather: '13°C – 25°C',
    highlights: ['Yercaud Lake', 'Lady Seat', 'Kiliyur Falls', 'Pagoda Point', 'Bear Cave'],
    thingsToDo: ['Boating on Yercaud Lake', 'Sunset at Lady Seat', 'Kiliyur Falls Trek', 'Coffee Plantation Tour', 'Orchidarium Visit'],
    packageCount: 3,
    avgPrice: '₹6,999',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&w=1200&q=80',
    gallery: [],
  },
];
