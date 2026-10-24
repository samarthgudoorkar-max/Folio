'use client';

import React from 'react';
import { SocialLink } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Globe } from 'lucide-react';

interface SocialsSectionProps {
  socials: SocialLink[];
  onChange: (socials: SocialLink[]) => void;
}

const PLATFORM_OPTIONS: Array<{ value: SocialLink['platform']; label: string }> = [
  { value: 'github', label: 'GitHub' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'dribbble', label: 'Dribbble' },
  { value: 'figma', label: 'Figma' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'website', label: 'Personal Website' },
];

export function SocialsSection({ socials, onChange }: SocialsSectionProps) {
  const handleAdd = () => {
    const newLink: SocialLink = {
      id: `soc_${Date.now()}`,
      platform: 'github',
      url: 'https://',
      label: 'GitHub',
    };
    onChange([...socials, newLink]);
  };

  const handleUpdate = (id: string, updates: Partial<SocialLink>) => {
    onChange(socials.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const handleDelete = (id: string) => {
    onChange(socials.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Online Presence</h3>
          <p className="text-xs text-text-muted mt-0.5">
            Links to your social networks, profiles, and portfolios.
          </p>
        </div>
        <Button size="sm" onClick={handleAdd} className="gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          <span>Add Link</span>
        </Button>
      </div>

      {socials.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-xl border border-dashed border-border bg-slate-50">
          <Globe className="w-8 h-8 text-text-muted mx-auto mb-2" />
          <p className="text-sm font-medium text-text-primary">No links added</p>
          <Button size="sm" variant="secondary" onClick={handleAdd} className="mt-3">
            Add Social Link
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {socials.map((link) => (
            <div
              key={link.id}
              className="p-3.5 rounded-xl border border-border bg-surface flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shadow-subtle"
            >
              <select
                value={link.platform}
                onChange={(e) => {
                  const plat = e.target.value as SocialLink['platform'];
                  const opt = PLATFORM_OPTIONS.find(o => o.value === plat);
                  handleUpdate(link.id, {
                    platform: plat,
                    label: opt?.label || plat,
                  });
                }}
                className="h-10 rounded-xl border border-border bg-surface px-3 text-xs font-medium text-text-primary focus:border-primary focus:outline-none shrink-0"
              >
                {PLATFORM_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <div className="flex-1">
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => handleUpdate(link.id, { url: e.target.value })}
                  placeholder="https://..."
                  className="w-full h-10 rounded-xl border border-border bg-surface px-3 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => handleDelete(link.id)}
                aria-label="Delete link"
                className="p-2 text-danger hover:bg-red-50 rounded-lg shrink-0 self-end sm:self-auto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
