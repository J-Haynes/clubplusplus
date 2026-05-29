import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Club++ | The Loyalty Card That Knows You Too Well',
  description: 'Earn points. Lose privacy. Repeat. A satirical loyalty card barcode generator for NZ supermarkets.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Club++',
  },
  openGraph: {
    title: 'Club++',
    description: 'Earn points. Lose privacy. Repeat.',
    type: 'website',
    siteName: 'Club++',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Club++',
    description: 'Earn points. Lose privacy. Repeat.',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#020617',
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
