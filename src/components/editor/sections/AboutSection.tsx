'use client';

import React from 'react';
import { PortfolioAbout } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface AboutSectionProps {
  data: PortfolioAbout;
  onChange: (updated: PortfolioAbout) => void;
}

export function AboutSection({ data, onChange }: AboutSectionProps) {
  const updateField = <K extends keyof PortfolioAbout>(field: K, value: PortfolioAbout[K]) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-text-primary">About & Background</h3>
        <p className="text-xs text-text-muted mt-0.5">
          Share your deeper story, career philosophy, and current work availability.
        </p>
      </div>

      <Input
        label="Section Title"
        value={data.title}
        onChange={(e) => updateField('title', e.target.value)}
        placeholder="e.g. About, Background, or Philosophy"
      />

      <Textarea
        label="Detailed Story / Narrative"
        value={data.content}
        onChange={(e) => updateField('content', e.target.value)}
        placeholder="Describe your journey, engineering or design values, and what drives you."
        rows={6}
        helperText="Supports paragraphs and clean line breaks."
      />

      <Input
        label="Featured Callout / Quote"
        value={data.highlightText || ''}
        onChange={(e) => updateField('highlightText', e.target.value)}
        placeholder="e.g. Available for select staff roles & advisory"
        helperText="Renders as a highlighted statement block in templates."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Years of Experience"
          value={data.yearsOfExperience || ''}
          onChange={(e) => updateField('yearsOfExperience', e.target.value)}
          placeholder="e.g. 8+ Years"
        />
        <Input
          label="Work Availability"
          value={data.availability || ''}
          onChange={(e) => updateField('availability', e.target.value)}
          placeholder="e.g. Available Q1 2027"
        />
      </div>
    </div>
  );
}
