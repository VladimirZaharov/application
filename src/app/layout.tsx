import type { Metadata } from 'next';
import { Onest } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '700'],
  variable: '--font-onest',
});

export const metadata: Metadata = {
  title: 'PropoCraft',
  description: 'Создавайте профессиональные предложения с легкостью.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased', onest.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
