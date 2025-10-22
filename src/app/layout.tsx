import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '700'], // 400 para normal, 700 para negrito
});

export const metadata: Metadata = {
  title: 'Bibi Ilustra',
  description: 'Portfólio de ilustrações e design gráfico de Bibi',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${openSans.className} antialiased h-full w-full flex flex-col`}
      >
        <Header />
        <main className="flex-1 max-w-8xl px-8 sm:px-12 lg:px-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
