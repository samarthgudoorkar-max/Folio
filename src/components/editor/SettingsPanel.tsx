'use client';

import React, { useState, useEffect } from 'react';
import { PortfolioSettings } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ImageUploader } from './ImageUploader';
import { validateSlug } from '@/lib/utils';
import { AlertCircle, Trash2, Globe, ShieldAlert } from 'lucide-react';

interface SettingsPanelProps {
  settings: PortfolioSettings;
  portfolioId: string;
  isPublished: boolean;
  publishedSlug: string | null;
  onChange: (updated: PortfolioSettings) => void;
  onDelete: () => void;
  onUnpublish: () => void;
}

export function SettingsPanel({
  settings,
  portfolioId,
  isPublished,
  publishedSlug,
  onChange,
  onDelete,
  onUnpublish,
}: SettingsPanelProps) {
  const [slugError, setSlugError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updateField = <K extends keyof PortfolioSettings>(field: K, value: PortfolioSettings[K]) => {
    onChange({
      ...settings,
      [field]: value,
    });
  };

  const handleSlugChange = (raw: string) => {
    const clean = raw.toLowerCase().replace(/[^a-z0-9-]/g, '');
    updateField('slug', clean);
    const check = validateSlug(clean);
    if (!check.valid) {
      setSlugError(check.error || 'Invalid slug');
    } else {
      setSlugError(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Basic Settings */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">General Settings</h3>
          <p className="text-xs text-text-muted mt-0.5">
            Title and custom public web address for your portfolio.
          </p>
        </div>

        <Input
          label="Portfolio Name *"
          value={settings.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="e.g. Alex Chen — Design Systems"
          error={!settings.title.trim() ? 'Portfolio title is required' : undefined}
          helperText="Appears on the browser tab and your Folio dashboard."
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Public Web Slug *
          </label>
          <div className="flex items-center rounded-xl border border-border bg-surface px-3 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-focus-ring/20 transition-all">
            <span className="text-xs text-text-muted font-mono select-none">
              /p/
            </span>
            <input
              type="text"
              value={settings.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="alex-chen"
              className="w-full text-xs font-mono font-medium text-text-primary bg-transparent focus:outline-none pl-1"
            />
          </div>
          {slugError ? (
            <p className="text-xs text-danger font-medium">{slugError}</p>
          ) : (
            <p className="text-xs text-text-muted">
              Used to access your portfolio publicly: <span className="font-mono text-text-secondary">/p/{settings.slug}</span>
            </p>
          )}
        </div>
      </div>

      {/* SEO & Meta */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Search Engine & Social Preview</h3>
          <p className="text-xs text-text-muted mt-0.5">
            Optimize how your portfolio appears in Google searches, iMessage, and Twitter shares.
          </p>
        </div>

        <Input
          label="Meta Title"
          value={settings.seoTitle || ''}
          onChange={(e) => updateField('seoTitle', e.target.value)}
          placeholder="e.g. Alex Chen | Product Designer & Art Director"
        />

        <Textarea
          label="Meta Description"
          value={settings.seoDescription || ''}
          onChange={(e) => updateField('seoDescription', e.target.value)}
          placeholder="e.g. Selected works in brand systems, design architectures, and interactive digital products."
          rows={3}
        />

        <ImageUploader
          label="Social Share Card (Open Graph Image)"
          value={settings.socialImage}
          onChange={(url) => updateField('socialImage', url)}
          aspectRatio="wide"
          helperText="Recommended: 1200x630px image for link previews"
        />
      </div>

      {/* Danger Zone */}
      <div className="space-y-4 pt-6 border-t border-red-200">
        <div>
          <h3 className="text-sm font-semibold text-danger flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            <span>Danger Zone</span>
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Actions here affect site availability and permanent data removal.
          </p>
        </div>

        {isPublished && (
          <div className="p-4 rounded-xl border border-border bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-text-primary">Unpublish Portfolio</p>
              <p className="text-xs text-text-muted">
                Takes your live site offline immediately. Your draft content is completely preserved.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onUnpublish}
              className="text-text-secondary hover:text-text-primary shrink-0"
            >
              Take Offline
            </Button>
          </div>
        )}

        <div className="p-4 rounded-xl border border-red-200 bg-red-50/40 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-danger">Delete This Portfolio</p>
              <p className="text-xs text-text-muted">
                Permanently deletes this portfolio and all associated draft content.
              </p>
            </div>
            {!showDeleteConfirm ? (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={onDelete}
                >
                  Confirm Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
