'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Portfolio } from '@/lib/types';
import { formatDateRelative } from '@/lib/utils';
import { TEMPLATE_METADATA } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import {
  Edit3,
  ExternalLink,
  Copy,
  Trash2,
  MoreVertical,
  Globe,
  Eye,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface PortfolioCardProps {
  portfolio: Portfolio;
  onPreview: (portfolio: Portfolio) => void;
  onDuplicate: (portfolio: Portfolio) => void;
  onRename: (portfolio: Portfolio) => void;
  onDelete: (portfolio: Portfolio) => void;
}

export function PortfolioCard({
  portfolio,
  onPreview,
  onDuplicate,
  onRename,
  onDelete,
}: PortfolioCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isPublished = portfolio.status === 'published';
  const tmpl = portfolio.draftData?.design?.template || 'minimal';
  const role = portfolio.draftData?.profile?.role || 'Professional Portfolio';
  const projectCount = portfolio.draftData?.projects?.length || 0;

  return (
    <div className="group relative bg-surface border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-dropdown hover:border-border-strong transition-all duration-200 flex flex-col justify-between">
      {/* Top Banner / Mock Preview */}
      <div className="relative h-44 bg-slate-100/90 border-b border-border p-4 flex flex-col justify-between overflow-hidden">
        {/* Subtle Preview Representation */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 flex items-center justify-between">
          <Badge
            variant={isPublished ? 'success' : 'default'}
            className="shadow-2xs text-[11px]"
          >
            {isPublished ? (
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            ) : (
              'Draft'
            )}
          </Badge>

          <span className="text-[11px] font-mono font-medium text-text-muted bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-border capitalize shadow-2xs">
            {tmpl} template
          </span>
        </div>

        {/* Mini Preview Header preview simulation */}
        <div className="relative z-10 bg-white/95 backdrop-blur-xs rounded-xl p-3 border border-border/80 shadow-subtle space-y-1">
          <div className="flex items-center gap-2">
            {portfolio.draftData?.profile?.avatarUrl && (
              <img
                src={portfolio.draftData.profile.avatarUrl}
                alt="Avatar"
                className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-text-primary truncate">
                {portfolio.draftData?.profile?.name || portfolio.settings.title}
              </p>
              <p className="text-[10px] text-text-muted truncate">
                {role}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-text-muted pt-1 border-t border-slate-100">
            <span>{projectCount} projects</span>
            {isPublished && portfolio.publishedSlug && (
              <span className="text-primary font-mono truncate">
                /p/{portfolio.publishedSlug}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base text-text-primary leading-snug truncate">
              {portfolio.settings.title}
            </h3>

            {/* Overflow Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 text-text-muted hover:text-text-primary rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Portfolio options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-7 z-30 w-44 rounded-xl bg-surface border border-border shadow-dropdown p-1 space-y-0.5 animate-in fade-in zoom-in-95">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onRename(portfolio);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-text-primary hover:bg-slate-100 rounded-lg text-left"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-text-muted" />
                      <span>Rename</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onDuplicate(portfolio);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-text-primary hover:bg-slate-100 rounded-lg text-left"
                    >
                      <Copy className="w-3.5 h-3.5 text-text-muted" />
                      <span>Duplicate</span>
                    </button>
                    <div className="h-px bg-border my-1" />
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onDelete(portfolio);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-danger hover:bg-red-50 rounded-lg text-left"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Edited {formatDateRelative(portfolio.updatedAt)}</span>
          </div>
        </div>

        {/* Card Actions Footer */}
        <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPreview(portfolio)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary bg-slate-100 hover:bg-slate-200/70 rounded-lg transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>

            {isPublished && portfolio.publishedSlug && (
              <Link
                href={`/p/?slug=${portfolio.publishedSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-success hover:bg-success-soft rounded-lg transition-colors"
                title="Open live URL"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Live</span>
              </Link>
            )}
          </div>

          <Link
            href={`/editor/?id=${portfolio.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors shadow-subtle"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
