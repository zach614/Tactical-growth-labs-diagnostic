import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tactical Growth Labs | Revenue Leak Diagnostic for Tactical Gear Stores',
  description:
    'Discover where your tactical gear store is leaking revenue. Enter 5 Shopify metrics to get instant insights on conversion, cart abandonment, and AOV opportunities.',
  keywords: [
    'tactical gear',
    'ecommerce optimization',
    'shopify',
    'conversion rate',
    'revenue optimization',
    'tactical store',
    'ecommerce consulting',
  ],
  openGraph: {
    title: 'Revenue Leak Diagnostic | Tactical Growth Labs',
    description:
      'How a Tactical Gear Store Averaged 14.29x ROAS for 3+ Years — and Where Most Stores Leak Revenue',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Revenue Leak Diagnostic | Tactical Growth Labs',
    description: 'Discover where your tactical gear store is leaking revenue.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">
        {children}
      </body>
    </html>
  );
}
