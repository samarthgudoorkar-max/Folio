'use client';

import React, { useState } from 'react';
import { PortfolioContent } from '@/lib/types';
import { PortfolioRenderer } from '../templates/PortfolioRenderer';
import { X, Monitor, Tablet, Smartphone, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: PortfolioContent;
  title: string;
}

export function PreviewModal({ isOpen, onClose, content, title }: PreviewModalProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!isOpen) return null;

  const deviceWidths = {
    desktop: 'w-full max-w-6xl',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]',
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/90 backdrop-blur-sm animate-in fade-in">
      {/* Header Controls */}
      <div className="h-14 border-b border-slate-800 bg-slate-950/80 px-4 sm:px-6 flex items-center justify-between shrink-0 text-white">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-widest hidden sm:inline">
            Interactive Preview
          </span>
          <span className="text-sm font-semibold text-white truncate max-w-xs">
            {title}
          </span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center border border-slate-700 rounded-xl p-0.5 bg-slate-900">
          <button
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded-lg transition-colors ${
              device === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`p-1.5 rounded-lg transition-colors ${
              device === 'tablet' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet (768px)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded-lg transition-colors ${
              device === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile (375px)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close preview"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Frame Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
        <div
          className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 min-h-full ${deviceWidths[device]}`}
        >
          <PortfolioRenderer content={content} isPublic={false} />
        </div>
      </div>
    </div>
  );
}
