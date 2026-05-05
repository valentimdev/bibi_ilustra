import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/AppShell';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'Bibi Ilustra',
  description: 'Portfólio de ilustrações e design gráfico de Bibi',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="antialiased h-full w-full flex flex-col">
        <AppShell>{children}</AppShell>
        <Analytics />
      </body>
    </html>
  );
}
