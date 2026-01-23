import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Admin | Tactical Growth Labs',
  description: 'Admin dashboard for Tactical Growth Labs diagnostic submissions',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="text-stone-500">Loading...</div>
      </div>
    }>
      {children}
    </Suspense>
  );
}
