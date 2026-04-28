import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';
import AppShell from '@/components/AppShell';

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Bibi Ilustra',
  description: 'Portfólio de ilustrações e design gráfico de Bibi',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${openSans.className} antialiased h-full w-full flex flex-col`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
