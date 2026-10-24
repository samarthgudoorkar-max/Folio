'use client';

import React from 'react';
import { AccentColor, FontPairing, ImageStyle, PortfolioDesign, ProjectLayout, TemplateId } from '@/lib/types';
import { ACCENT_PALETTES, FONT_PAIRINGS } from '@/lib/utils';
import { TEMPLATE_METADATA } from '@/lib/mock-data';
import { Check, Sparkles, LayoutGrid, ListFilter } from 'lucide-react';

interface DesignControlsProps {
  design: PortfolioDesign;
  onChange: (updated: PortfolioDesign) => void;
}

export function DesignControls({ design, onChange }: DesignControlsProps) {
  const updateField = <K extends keyof PortfolioDesign>(field: K, value: PortfolioDesign[K]) => {
    onChange({
      ...design,
      [field]: value,
    });
  };

  const accentKeys: AccentColor[] = ['indigo', 'blue', 'emerald', 'violet', 'rose', 'amber', 'slate'];

  return (
    <div className="space-y-8">
      {/* Template Selector */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Portfolio Template</h3>
          <p className="text-xs text-text-muted mt-0.5">
            Switch styles instantly. All your content is preserved seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TEMPLATE_METADATA.map((tmpl) => {
            const isSelected = design.template === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => updateField('template', tmpl.id)}
                className={`cursor-pointer rounded-xl border p-3.5 transition-all text-left space-y-2 ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/20 bg-primary-soft/40 shadow-subtle'
                    : 'border-border bg-surface hover:border-border-strong hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-text-primary">{tmpl.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                </div>
                <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">
                  {tmpl.tagline}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Accent Color Palette */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Accent Color</h3>
          <p className="text-xs text-text-muted mt-0.5">
            Applied to buttons, badges, and callouts on your published site.
          </p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
          {accentKeys.map((key) => {
            const pal = ACCENT_PALETTES[key];
            const isSelected = design.accentColor === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => updateField('accentColor', key)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-primary ring-2 ring-focus-ring/30 bg-primary-soft/30'
                    : 'border-border hover:border-border-strong bg-surface'
                }`}
              >
                <span
                  className="w-6 h-6 rounded-full border border-black/10 shadow-2xs flex items-center justify-center"
                  style={{ backgroundColor: pal.hex }}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </span>
                <span className="text-[10px] font-medium text-text-secondary truncate w-full text-center">
                  {pal.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Typography Pairings */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Typography Pairing</h3>
          <p className="text-xs text-text-muted mt-0.5">
            Curated pairings for headers and narrative text.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(Object.keys(FONT_PAIRINGS) as FontPairing[]).map((fKey) => {
            const font = FONT_PAIRINGS[fKey];
            const isSelected = design.fontPairing === fKey;

            return (
              <div
                key={fKey}
                onClick={() => updateField('fontPairing', fKey)}
                className={`cursor-pointer p-3.5 rounded-xl border transition-all space-y-1 ${
                  isSelected
                    ? 'border-primary ring-2 ring-focus-ring/20 bg-primary-soft/30'
                    : 'border-border hover:border-border-strong bg-surface'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm text-text-primary ${font.headingClass}`}>
                    {font.name}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                </div>
                <p className="text-[11px] text-text-muted">{font.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Layout & Spacing Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Spacing Density */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Spacing Rhythm
          </label>
          <div className="flex rounded-xl border border-border p-1 bg-slate-50 gap-1">
            <button
              type="button"
              onClick={() => updateField('spacing', 'comfortable')}
              className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-colors ${
                design.spacing === 'comfortable' ? 'bg-surface text-primary shadow-subtle' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Comfortable
            </button>
            <button
              type="button"
              onClick={() => updateField('spacing', 'compact')}
              className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-colors ${
                design.spacing === 'compact' ? 'bg-surface text-primary shadow-subtle' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Compact
            </button>
          </div>
        </div>

        {/* Image Corners */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Image Corners
          </label>
          <select
            value={design.imageStyle}
            onChange={(e) => updateField('imageStyle', e.target.value as ImageStyle)}
            className="w-full h-9 rounded-xl border border-border bg-surface px-3 text-xs font-medium text-text-primary focus:border-primary focus:outline-none"
          >
            <option value="rounded">Rounded (16px)</option>
            <option value="soft">Soft (8px)</option>
            <option value="square">Square (0px)</option>
            <option value="circle">Circular</option>
          </select>
        </div>

        {/* Project Layout */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Project Layout
          </label>
          <div className="flex rounded-xl border border-border p-1 bg-slate-50 gap-1">
            <button
              type="button"
              onClick={() => updateField('projectLayout', 'grid')}
              className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 ${
                design.projectLayout === 'grid' ? 'bg-surface text-primary shadow-subtle' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <LayoutGrid className="w-3 h-3" />
              <span>Grid</span>
            </button>
            <button
              type="button"
              onClick={() => updateField('projectLayout', 'list')}
              className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 ${
                design.projectLayout === 'list' ? 'bg-surface text-primary shadow-subtle' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <ListFilter className="w-3 h-3" />
              <span>List</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
