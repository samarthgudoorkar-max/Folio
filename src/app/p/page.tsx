'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PublicPortfolioView } from '@/components/public/PublicPortfolioView';

function PublicPortfolioContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug') || '';

  return <PublicPortfolioView slug={slug} />;
}

export default function PublicStaticPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PublicPortfolioContent />
    </Suspense>
  );
}
