'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { EditorWorkspace } from '@/components/editor/EditorWorkspace';
import { Loader2 } from 'lucide-react';

function EditorContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || 'folio_alex_chen_studio';

  return <EditorWorkspace portfolioId={id} />;
}

export default function EditorStaticPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center bg-background">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  );
}
