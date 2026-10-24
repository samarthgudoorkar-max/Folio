import React from 'react';
import { PortfolioContent } from '@/lib/types';
import { MinimalTemplate } from './MinimalTemplate';
import { StudioTemplate } from './StudioTemplate';
import { DeveloperTemplate } from './DeveloperTemplate';
import Link from 'next/link';

interface PortfolioRendererProps {
  content: PortfolioContent;
  isPublic?: boolean;
}

export function PortfolioRenderer({ content, isPublic = false }: PortfolioRendererProps) {
  const templateId = content.design?.template || 'minimal';

  const renderTemplate = () => {
    switch (templateId) {
      case 'studio':
        return <StudioTemplate content={content} isPublic={isPublic} />;
      case 'developer':
        return <DeveloperTemplate content={content} isPublic={isPublic} />;
      case 'minimal':
      default:
        return <MinimalTemplate content={content} isPublic={isPublic} />;
    }
  };

  return (
    <div className="w-full relative">
      {renderTemplate()}

      {/* Subtle Built with Folio watermark badge for public view */}
      {isPublic && (
        <div className="w-full border-t border-slate-200/60 bg-white/80 py-4 px-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5 backdrop-blur-xs">
          <span>Crafted with</span>
          <Link
            href="/"
            className="font-semibold text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
          >
            Folio
          </Link>
          <span>— Build your free portfolio</span>
        </div>
      )}
    </div>
  );
}
