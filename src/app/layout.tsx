import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import { headers } from 'next/headers';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || headersList.get('referer') || '';
  const isAdminRoute = pathname.includes('/admin') || pathname.includes('/bibi-login-admin');

  return (
    <html lang="en" className="h-full">
      <body
        className={`${openSans.className} antialiased h-full w-full flex flex-col`}
      >
        <Header />
        <main className={isAdminRoute ? 'flex-1' : 'flex-1 max-w-8xl px-8 sm:px-12 lg:px-16'}>
          {children}
        </main>
        {!isAdminRoute && <Footer />}
      </body>
    </html>
  );
}