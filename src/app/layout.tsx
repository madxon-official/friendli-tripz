import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://friendlitripz.com'),
  title: {
    default: 'Friendli Tripz | Travel. Vibe. Repeat.',
    template: '%s | Friendli Tripz',
  },
  description:
    'Discover curated group trips, handpicked stays, and unforgettable experiences across Kodaikanal, Ooty, and Valparai.',
  keywords: [
    'Friendli Tripz',
    'group travel India',
    'curated trips',
    'social travel',
    'Kodaikanal trip',
    'Ooty trip',
    'Valparai trip',
    'travel lifestyle',
    'weekend getaway India',
    'hill station trips',
  ],
  openGraph: {
    title: 'Friendli Tripz | Travel. Vibe. Repeat.',
    description:
      'Curated group trips built around great places, good company, and memorable experiences in Kodaikanal, Ooty, and Valparai.',
    url: 'https://friendlitripz.com',
    siteName: 'Friendli Tripz',
    images: [
      {
        url: '/friendli/logo.png',
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
    description: 'Curated group trips built around great places, good company, and memorable experiences in Kodaikanal, Ooty, and Valparai.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/friendli/logo.svg', type: 'image/svg+xml' },
      { url: '/friendli/logo.png', type: 'image/png' },
    ],
    apple: '/friendli/logo.png',
    shortcut: '/friendli/logo.png',
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
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
