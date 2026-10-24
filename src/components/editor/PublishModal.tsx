'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Globe, Copy, Check, ExternalLink, AlertTriangle, ShieldCheck } from 'lucide-react';
import { validateSlug } from '@/lib/utils';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId: string;
  currentSlug: string;
  isPublished: boolean;
  publishedSlug: string | null;
  onSlugChange: (newSlug: string) => void;
  onPublish: () => Promise<void>;
  onUnpublish: () => Promise<void>;
}

export function PublishModal({
  isOpen,
  onClose,
  portfolioId,
  currentSlug,
  isPublished,
  publishedSlug,
  onSlugChange,
  onPublish,
  onUnpublish,
}: PublishModalProps) {
  const [slugInput, setSlugInput] = useState(currentSlug);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSlugInput(currentSlug);
    setSlugError(null);
  }, [currentSlug, isOpen]);

  // Debounced slug validation
  useEffect(() => {
    if (!isOpen) return;
    const trimmed = slugInput.trim().toLowerCase();
    const formatCheck = validateSlug(trimmed);
    if (!formatCheck.valid) {
      setSlugError(formatCheck.error || 'Invalid slug');
      return;
    }

    if (trimmed === currentSlug) {
      setSlugError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingSlug(true);
      try {
        const res = await fetch(`/api/check-slug?slug=${encodeURIComponent(trimmed)}&currentId=${portfolioId}`);
        const data = await res.json();
        if (!data.available) {
          setSlugError(data.error || 'This URL is already taken');
        } else {
          setSlugError(null);
          onSlugChange(trimmed);
        }
      } catch {
        setSlugError(null);
      } finally {
        setIsCheckingSlug(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [slugInput, currentSlug, isOpen, portfolioId, onSlugChange]);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const activeSlug = isPublished && publishedSlug ? publishedSlug : slugInput;
  const liveUrl = `${origin}/p/${activeSlug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(liveUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handlePublishClick = async () => {
    if (slugError) return;
    setIsPublishing(true);
    try {
      await onPublish();
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublishClick = async () => {
    setIsUnpublishing(true);
    try {
      await onUnpublish();
    } finally {
      setIsUnpublishing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isPublished ? 'Publish Portfolio Updates' : 'Publish Your Portfolio'}
      description="Make your work accessible to clients, recruiters, and the world."
      maxWidth="lg"
    >
      <div className="space-y-6 pt-2">
        {/* Status Card */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-slate-50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isPublished ? 'bg-success-soft text-success' : 'bg-slate-200 text-slate-600'}`}>
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-text-primary">Status:</span>
                <Badge variant={isPublished ? 'success' : 'default'}>
                  {isPublished ? 'Live & Published' : 'Draft Only'}
                </Badge>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                {isPublished
                  ? 'Your portfolio is currently public at its unique URL.'
                  : 'Only you can see this draft until you choose to publish.'}
              </p>
            </div>
          </div>
        </div>

        {/* Public URL Slug Configuration */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Public Portfolio URL
          </label>
          <div className="flex items-center rounded-xl border border-border bg-surface px-3 py-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-focus-ring/20 transition-all">
            <span className="text-xs text-text-muted font-mono select-none">
              {origin}/p/
            </span>
            <input
              type="text"
              value={slugInput}
              onChange={(e) => setSlugInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="your-name"
              className="w-full text-xs font-mono font-medium text-text-primary bg-transparent focus:outline-none pl-1"
            />
            {isCheckingSlug && (
              <span className="text-[11px] text-text-muted">checking...</span>
            )}
          </div>
          {slugError ? (
            <p className="text-xs text-danger font-medium">{slugError}</p>
          ) : (
            <p className="text-xs text-text-muted">
              Choose a short, memorable slug with lowercase letters, numbers, and hyphens.
            </p>
          )}
        </div>

        {/* Live URL Link preview & copy */}
        {isPublished && (
          <div className="p-3.5 rounded-xl border border-success/30 bg-success-soft/30 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-success">
                Live URL
              </span>
              <p className="text-xs font-mono text-slate-800 truncate">
                {liveUrl}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                className="h-8 px-2.5 text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </Button>
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 h-8 px-2.5 text-xs font-medium rounded-lg bg-surface border border-border hover:bg-slate-50 transition-colors text-text-primary shadow-subtle"
              >
                <span>Visit</span>
                <ExternalLink className="w-3 h-3 text-text-muted" />
              </a>
            </div>
          </div>
        )}

        {/* Notice on Draft Separation */}
        <div className="p-3.5 rounded-xl border border-border bg-slate-50/60 flex items-start gap-2.5 text-xs text-text-secondary">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p>
            <strong>Snapshot safety:</strong> Any continuous edits in the editor remain in your draft. Your public website updates only when you click <em>Publish</em>.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border">
          {isPublished ? (
            <Button
              variant="outline"
              size="sm"
              isLoading={isUnpublishing}
              onClick={handleUnpublishClick}
              className="text-danger hover:text-danger hover:bg-red-50 border-danger/30 w-full sm:w-auto"
            >
              Unpublish Portfolio
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="primary"
              size="md"
              disabled={!!slugError || isCheckingSlug}
              isLoading={isPublishing}
              onClick={handlePublishClick}
              className="w-full sm:w-auto"
            >
              <Globe className="w-4 h-4" />
              <span>{isPublished ? 'Publish Updates Now' : 'Publish Portfolio'}</span>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
