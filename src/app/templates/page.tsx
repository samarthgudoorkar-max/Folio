'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TEMPLATE_METADATA, getInitialTemplateContent } from '@/lib/mock-data';
import { TemplateId } from '@/lib/types';
import { PreviewModal } from '@/components/editor/PreviewModal';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Eye, Check, Sparkles } from 'lucide-react';

export default function TemplatesPage() {
  const router = useRouter();
  const [previewTemplateId, setPreviewTemplateId] = useState<TemplateId | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleUseTemplate = async (templateId: TemplateId) => {
    setIsCreating(true);
    try {
      const res = await fetch('/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: templateId }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/editor/${data.portfolio.id}`);
      }
    } catch (err) {
      console.error('Failed to create portfolio from template', err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
      {/* Navigation */}
      <header className="h-16 border-b border-border bg-surface px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-slate-100 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-base shadow-subtle">
              F
            </span>
            <span className="font-bold text-lg text-text-primary tracking-tight">Folio Templates</span>
          </div>
        </div>

        <Link href="/dashboard">
          <Button variant="secondary" size="sm">
            Go to Dashboard
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-primary bg-primary-soft px-3 py-1 rounded-full border border-indigo-100">
            Curated Templates
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
            Designed for substance and style.
          </h1>
          <p className="text-base text-text-secondary leading-relaxed">
            Every template is fully responsive, keyboard-accessible, and built around genuine professional needs. Switch templates anytime without losing a single word.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TEMPLATE_METADATA.map((tmpl) => (
            <div
              key={tmpl.id}
              className="group bg-surface border border-border rounded-3xl overflow-hidden shadow-card hover:shadow-modal hover:border-primary/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Visual Header / Mockup */}
                <div className="relative aspect-16/10 overflow-hidden bg-slate-100 border-b border-border">
                  <img
                    src={tmpl.previewImage}
                    alt={tmpl.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setPreviewTemplateId(tmpl.id)}
                      className="bg-white/95 backdrop-blur-xs text-text-primary shadow-subtle gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Live Preview</span>
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-text-primary flex items-center justify-between">
                      <span>{tmpl.name}</span>
                    </h3>
                    <p className="text-xs font-medium text-primary">
                      {tmpl.tagline}
                    </p>
                  </div>

                  <p className="text-sm text-text-secondary leading-relaxed">
                    {tmpl.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-border">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
                      Tailored For:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {tmpl.idealFor.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium bg-slate-100 text-text-secondary px-2 py-0.5 rounded-md"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-6 pt-0 flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewTemplateId(tmpl.id)}
                  className="flex-1"
                >
                  Preview
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={isCreating}
                  onClick={() => handleUseTemplate(tmpl.id)}
                  className="flex-1 gap-1.5"
                >
                  <span>Use Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Preview Modal */}
      {previewTemplateId && (
        <PreviewModal
          isOpen={!!previewTemplateId}
          onClose={() => setPreviewTemplateId(null)}
          content={getInitialTemplateContent(previewTemplateId)}
          title={`${TEMPLATE_METADATA.find(t => t.id === previewTemplateId)?.name} Template Preview`}
        />
      )}
    </div>
  );
}
