'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAdminRoute =
    pathname.startsWith('/admin') || pathname.startsWith('/bibi-login-admin');

  return (
    <>
      <Header />
      <main className={isAdminRoute ? 'flex-1' : 'flex-1 max-w-8xl px-8 sm:px-12 lg:px-16'}>
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
}
