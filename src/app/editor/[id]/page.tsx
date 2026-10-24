import React from 'react';
import { EditorWorkspace } from '@/components/editor/EditorWorkspace';

export function generateStaticParams() {
  return [
    { id: 'folio_alex_chen_studio' },
    { id: 'folio_sarah_jenkins_dev' },
    { id: 'folio_marcus_vance_min' },
  ];
}

export default function EditorParamPage({ params }: { params: { id: string } }) {
  return <EditorWorkspace portfolioId={params.id} />;
}
