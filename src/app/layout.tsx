import type { Metadata, Viewport } from 'next';
import { Manrope, Inter } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://friendlitripz.com'),
  title: 'Friendli Tripz | Kodaikanal Group Trips & Experiences',
  description:
    'Discover Kodaikanal with Friendli Tripz — thoughtfully planned trips built around great places, good company and memorable experiences.',
  keywords: [
    'Kodaikanal trip',
    'Kodaikanal tour package',
    'Friendli Tripz',
    'social travel India',
    'group travel Tamil Nadu',
    'Kodaikanal hill station',
  ],
  openGraph: {
    title: 'Friendli Tripz | Kodaikanal Group Trips & Experiences',
    description:
      'Travel feels better with friends. Join our curated Kodaikanal mountain escape.',
    url: 'https://friendlitripz.com',
    siteName: 'Friendli Tripz',
    images: [
      {
        url: '/logo.jpeg',
        width: 800,
        height: 600,
        alt: 'Friendli Tripz Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
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
    <html lang="en" className={`scroll-smooth ${manrope.variable} ${inter.variable}`}>
      <body className="antialiased bg-brand-warm text-brand-text min-h-screen flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
