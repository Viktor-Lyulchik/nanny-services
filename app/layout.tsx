import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/AuthProvider/AuthProvider';
import { Toaster } from 'react-hot-toast';
import 'modern-normalize/modern-normalize.css';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Nanny Services - Easy seeking babysitters Online',
  description: 'Find a trusted nanny for your child.',
  openGraph: {
    type: 'website',
    title: 'Nanny Services - Easy seeking babysitters Online',
    description: 'Find a trusted nanny for your child.',
    url: 'https://nanny-services-mocha.vercel.app/',
    siteName: 'Nanny Services',
    images: [
      {
        url: 'https://nanny-services-mocha.vercel.app/img/hero.png',
        width: 1200,
        height: 630,
        alt: 'Nanny Services - Easy seeking babysitters Online',
      },
    ],
  },
  twitter: {
    title: 'Nanny Services - Easy seeking babysitters Online',
    description: 'Find a trusted nanny for your child.',
    images: ['https://nanny-services-mocha.vercel.app/img/hero.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
