import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { ThemeProvider } from '../components/ui/theme-provider'; // ThemeProvider is client-side only

const inter = Inter({ subsets: ['latin'] });

// Metadata is server-side only
export const metadata: Metadata = {
  title: 'read-me.pro - Github PRO Readme Editor',
  description: 'Professional README Editor with dark mode and GitHub integration',
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