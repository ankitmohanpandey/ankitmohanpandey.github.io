import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Analytics } from '@/components/Analytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ankit Mohan Pandey - Senior Data Engineer',
  description: 'Senior Data Engineer specializing in GCP, Apache Beam, Airflow, and BigQuery',
  keywords: ['Data Engineering', 'GCP', 'Apache Beam', 'Airflow', 'BigQuery', 'Data Pipeline'],
  authors: [{ name: 'Ankit Mohan Pandey' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ankitmohanpandey.in',
    siteName: 'Ankit Mohan Pandey',
    title: 'Ankit Mohan Pandey - Senior Data Engineer',
    description: 'Senior Data Engineer specializing in GCP, Apache Beam, Airflow, and BigQuery',
    images: [
      {
        url: 'https://ankitmohanpandey.in/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ankit Mohan Pandey',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ankit Mohan Pandey - Senior Data Engineer',
    description: 'Senior Data Engineer specializing in GCP, Apache Beam, Airflow, and BigQuery',
    images: ['https://ankitmohanpandey.in/og-image.png'],
    creator: '@ankitmohanpandey',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://ankitmohanpandey.in" />
      </head>
      <body className={inter.className}>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
