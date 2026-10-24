import React from 'react';
import { PublicPortfolioView } from '@/components/public/PublicPortfolioView';

export function generateStaticParams() {
  return [
    { slug: 'alex-chen' },
    { slug: 'sarah-jenkins' },
    { slug: 'marcus-vance' },
  ];
}

export default function PublicSlugPage({ params }: { params: { slug: string } }) {
  return <PublicPortfolioView slug={params.slug} />;
}
