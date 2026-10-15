import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://clubplusplus.nz'),
  alternates: { canonical: '/' },
  title: 'Club++ | The Loyalty Card That Knows You Too Well',
  description: 'Earn points. Lose privacy. A satirical loyalty card barcode generator for NZ supermarkets.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Club++',
  },
  openGraph: {
    title: 'Club++',
    description: 'Earn points. Lose privacy.',
    type: 'website',
    siteName: 'Club++',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Club++',
    description: 'Earn points. Lose privacy.',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#020617',
  viewportFit: 'cover', // lets the fixed mode switch pad for the iPhone home indicator
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
