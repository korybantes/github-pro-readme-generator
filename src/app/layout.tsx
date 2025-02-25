import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { ThemeProvider } from '../components/ui/theme-provider'; // ThemeProvider is client-side only

const inter = Inter({ subsets: ['latin'] });

// Metadata is server-side only
export const metadata: Metadata = {
  title: 'read-me.pro - Github PRO Readme Editor',
  description:
    'Professional README Editor with dark mode and GitHub integration. Create outstanding project documentation quickly and easily with our powerful, user-friendly tool.',
  keywords: [
    'readme editor',
    'github readme generator',
    'professional readme',
    'documentation tool',
    'dark mode editor',
    'GitHub integration',
    'developer tools',
    'project documentation',
  ].join(', '),
  openGraph: {
    title: 'read-me.pro - Github PRO Readme Editor',
    description:
      'Create outstanding README documentation for your projects with our professional, dark mode enabled editor. Seamlessly integrate with GitHub and showcase your work.',
    url: 'https://read-me.pro/',
    siteName: 'read-me.pro',
    images: [
      {
        url: 'https://read-me.pro/og-image.jpg', // Replace with your actual Open Graph image URL
        width: 1200,
        height: 630,
        alt: 'read-me.pro - Github PRO Readme Editor',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'read-me.pro - Github PRO Readme Editor',
    description:
      'Professional README Editor with dark mode and GitHub integration. Create outstanding documentation quickly and easily.',
    site: '@readme_pro', 
    creator: '@readme_pro', 
    images: ['https://read-me.pro/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// RootLayout is server-side by default
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Wrap ThemeProvider in a client component */}
        <ThemeProvider>
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}