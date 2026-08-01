import type { Metadata, Viewport } from 'next';
import { Outfit, Inter } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://friendlitripz.com'),
  title: {
    default: 'Friendli Tripz | Travel. Vibe. Repeat.',
    template: '%s | Friendli Tripz',
  },
  description:
    'Discover curated group trips, handpicked stays, and unforgettable experiences across South India. Travel with great people, zero planning stress.',
  keywords: [
    'Friendli Tripz',
    'group travel India',
    'curated trips',
    'social travel',
    'Kodaikanal trip',
    'Ooty trip',
    'Coorg trip',
    'Munnar trip',
    'Wayanad trip',
    'travel lifestyle',
    'weekend getaway India',
    'hill station trips',
  ],
  openGraph: {
    title: 'Friendli Tripz | Travel. Vibe. Repeat.',
    description:
      'Curated group trips built around great places, good company, and memorable experiences. Stop scrolling. Start living.',
    url: 'https://friendlitripz.com',
    siteName: 'Friendli Tripz',
    images: [
      {
        url: '/logo.jpeg',
        width: 800,
        height: 600,
        alt: 'Friendli Tripz — Travel Lifestyle Platform',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Friendli Tripz | Travel. Vibe. Repeat.',
    description: 'Curated group trips built around great places, good company, and memorable experiences.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/logo.jpeg',
    apple: '/logo.jpeg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#062B57',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${outfit.variable} ${inter.variable}`}>
      <body className="antialiased bg-brand-warm text-brand-text min-h-screen flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
