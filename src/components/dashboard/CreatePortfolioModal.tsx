'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TEMPLATE_METADATA } from '@/lib/mock-data';
import { TemplateId } from '@/lib/types';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

interface CreatePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (template: TemplateId, title: string) => Promise<void>;
}

export function CreatePortfolioModal({
  isOpen,
  onClose,
  onCreate,
}: CreatePortfolioModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('minimal');
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onCreate(selectedTemplate, title.trim());
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Portfolio"
      description="Choose an aesthetic foundation to start from. You can customize colors, fonts, and sections at any time."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-3">
        <Input
          label="Portfolio Name (Optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Sarah Jenkins — Staff Systems Engineer"
          helperText="Leave empty to use your default profile name."
        />

        {/* Template Cards */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Select Template
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TEMPLATE_METADATA.map((tmpl) => {
              const isSelected = selectedTemplate === tmpl.id;

              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary/20 bg-primary-soft/30 shadow-subtle'
                      : 'border-border bg-surface hover:border-border-strong hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-text-primary">{tmpl.name}</h4>
                      {isSelected && <Check className="w-4 h-4 text-primary" />}
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {tmpl.tagline}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border/60">
                    <span className="text-[10px] font-mono text-text-muted">
                      Best for: {tmpl.idealFor[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="gap-2">
            <span>Create Portfolio</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Modal>
  );
}
