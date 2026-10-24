'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Globe,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EditorTopBarProps {
  portfolioTitle: string;
  saveStatus: 'saved' | 'saving' | 'unsaved' | 'error';
  lastSavedAt?: string;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  deviceView: 'desktop' | 'tablet' | 'mobile';
  onDeviceChange: (device: 'desktop' | 'tablet' | 'mobile') => void;
  onOpenPreview: () => void;
  onOpenPublish: () => void;
  isPublished: boolean;
  publishedSlug: string | null;
  onRetrySave?: () => void;
}

export function EditorTopBar({
  portfolioTitle,
  saveStatus,
  lastSavedAt,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  deviceView,
  onDeviceChange,
  onOpenPreview,
  onOpenPublish,
  isPublished,
  publishedSlug,
  onRetrySave,
}: EditorTopBarProps) {
  return (
    <header className="h-14 border-b border-border bg-surface px-4 flex items-center justify-between z-20 shrink-0">
      {/* Left: Back & Title */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-slate-100 transition-colors"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="h-4 w-px bg-border hidden sm:block" />

        <div className="flex items-center gap-2">
          <span className="font-semibold text-text-primary text-sm max-w-[140px] sm:max-w-[240px] truncate">
            {portfolioTitle}
          </span>
          <Badge variant={isPublished ? 'success' : 'default'} className="hidden md:inline-flex text-[10px]">
            {isPublished ? 'Published' : 'Draft'}
          </Badge>
        </div>

        {/* Save Status Indicator */}
        <div className="hidden lg:flex items-center text-xs text-text-muted gap-1.5 ml-2">
          {saveStatus === 'saving' && (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
              <span>Saving...</span>
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              <span>Saved</span>
            </>
          )}
          {saveStatus === 'unsaved' && (
            <span className="text-amber-600 font-medium">Unsaved edits</span>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center gap-1 text-danger font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Save failed</span>
              {onRetrySave && (
                <button
                  onClick={onRetrySave}
                  className="underline hover:text-red-900 ml-1 cursor-pointer"
                >
                  Retry
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Center: Undo/Redo & Device view selector */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <div className="flex items-center border border-border rounded-xl p-0.5 bg-slate-50/70">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl/Cmd+Z)"
            aria-label="Undo"
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <div className="h-3.5 w-px bg-border" />
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl/Cmd+Shift+Z)"
            aria-label="Redo"
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Device Switcher (hidden on small screens) */}
        <div className="hidden md:flex items-center border border-border rounded-xl p-0.5 bg-slate-50/70">
          <button
            onClick={() => onDeviceChange('desktop')}
            title="Desktop View (100%)"
            aria-label="Desktop view"
            className={`p-1.5 rounded-lg transition-colors ${
              deviceView === 'desktop'
                ? 'bg-surface text-primary shadow-subtle'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDeviceChange('tablet')}
            title="Tablet View (768px)"
            aria-label="Tablet view"
            className={`p-1.5 rounded-lg transition-colors ${
              deviceView === 'tablet'
                ? 'bg-surface text-primary shadow-subtle'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDeviceChange('mobile')}
            title="Mobile View (375px)"
            aria-label="Mobile view"
            className={`p-1.5 rounded-lg transition-colors ${
              deviceView === 'mobile'
                ? 'bg-surface text-primary shadow-subtle'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right: Preview & Publish */}
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onOpenPreview}
          className="hidden sm:inline-flex"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Preview</span>
        </Button>

        {isPublished && publishedSlug && (
          <a
            href={`/p/${publishedSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary font-medium px-2 py-1"
          >
            <Globe className="w-3.5 h-3.5 text-success" />
            <span>View Live</span>
          </a>
        )}

        <Button
          variant="primary"
          size="sm"
          onClick={onOpenPublish}
          className="gap-1.5"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{isPublished ? 'Publish Updates' : 'Publish'}</span>
        </Button>
      </div>
    </header>
  );
}
