'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { TEMPLATE_METADATA } from '@/lib/mock-data';
import { TemplateId } from '@/lib/types';
import {
  ArrowRight,
  Layers,
  Palette,
  Share2,
  CheckCircle2,
  Monitor,
  Tablet,
  Smartphone,
  Sparkles,
  Eye,
  SlidersHorizontal,
  Code2,
  FolderKanban,
  FileCheck
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [activeInteractiveTab, setActiveInteractiveTab] = useState<'content' | 'design' | 'preview'>('content');
  const [demoDevice, setDemoDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
      {/* Top Header */}
      <header className="h-16 border-b border-border bg-surface px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-base shadow-subtle group-hover:bg-primary-hover transition-colors">
              F
            </span>
            <span className="font-bold text-xl text-text-primary tracking-tight">Folio</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text-secondary">
            <Link href="/templates" className="hover:text-text-primary transition-colors">
              Templates
            </Link>
            <a href="#how-it-works" className="hover:text-text-primary transition-colors">
              How it works
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="primary" size="sm" className="gap-1.5">
              <span>Get started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16 px-4 sm:px-8 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-soft text-primary text-xs font-semibold border border-indigo-100/80 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The No-Code Portfolio Studio</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.12]">
          Your work deserves a great first impression.
        </h1>

        <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed font-normal">
          Build, customize, and publish a distinctive, accessible portfolio in minutes without touching a line of code. Designed for creators, engineers, and designers who value craftsmanship.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2">
              <span>Build your portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/templates" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Explore templates
            </Button>
          </Link>
        </div>
      </section>

      {/* Realistic Interactive Builder Preview */}
      <section className="px-4 sm:px-8 max-w-6xl mx-auto w-full pb-20">
        <div className="bg-surface rounded-3xl border border-border shadow-modal overflow-hidden">
          {/* Editor Header Bar Simulation */}
          <div className="h-14 border-b border-border bg-slate-50 px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
              </div>
              <div className="h-4 w-px bg-border hidden sm:block" />
              <span className="text-xs font-semibold text-text-primary hidden sm:inline">
                Sarah Jenkins — Staff Systems Engineer
              </span>
              <span className="text-[10px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                Live
              </span>
            </div>

            {/* Simulated Device Controls */}
            <div className="flex items-center border border-border rounded-xl p-0.5 bg-white shadow-2xs">
              <button
                onClick={() => setDemoDevice('desktop')}
                className={`p-1.5 rounded-lg transition-colors ${
                  demoDevice === 'desktop' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDemoDevice('tablet')}
                className={`p-1.5 rounded-lg transition-colors ${
                  demoDevice === 'tablet' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'
                }`}
                title="Tablet View"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDemoDevice('mobile')}
                className={`p-1.5 rounded-lg transition-colors ${
                  demoDevice === 'mobile' ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white shadow-subtle hover:bg-primary-hover transition-colors">
                  <Share2 className="w-3 h-3" />
                  <span>Publish</span>
                </span>
              </Link>
            </div>
          </div>

          {/* Builder Body Simulation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
            {/* Left Controls Column */}
            <div className="lg:col-span-4 border-r border-border p-5 space-y-4 bg-slate-50/40">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
                <button
                  onClick={() => setActiveInteractiveTab('content')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    activeInteractiveTab === 'content'
                      ? 'bg-white text-text-primary shadow-subtle font-semibold'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Content
                </button>
                <button
                  onClick={() => setActiveInteractiveTab('design')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    activeInteractiveTab === 'design'
                      ? 'bg-white text-text-primary shadow-subtle font-semibold'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Design
                </button>
              </div>

              {activeInteractiveTab === 'content' ? (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Active Sections
                  </span>
                  {[
                    { title: 'Profile Header', icon: '👤', status: 'Visible' },
                    { title: 'Selected Projects (3)', icon: '💼', status: 'Visible' },
                    { title: 'Skills & Tooling', icon: '⚡', status: 'Visible' },
                    { title: 'Work Experience', icon: '🏢', status: 'Visible' },
                    { title: 'Contact & Resume', icon: '📬', status: 'Visible' },
                  ].map((sec, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-border bg-white flex items-center justify-between text-xs font-medium shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <span>{sec.icon}</span>
                        <span className="text-text-primary font-semibold">{sec.title}</span>
                      </div>
                      <span className="text-[10px] text-text-muted">{sec.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                      Template Style
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-lg border border-primary bg-primary-soft text-primary font-bold">
                        Developer
                      </div>
                      <div className="p-2 rounded-lg border border-border bg-white text-text-muted">
                        Minimal
                      </div>
                      <div className="p-2 rounded-lg border border-border bg-white text-text-muted">
                        Studio
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                      Accent Color
                    </span>
                    <div className="flex gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 ring-2 ring-indigo-300" />
                      <span className="w-5 h-5 rounded-full bg-blue-600" />
                      <span className="w-5 h-5 rounded-full bg-emerald-600" />
                      <span className="w-5 h-5 rounded-full bg-violet-600" />
                      <span className="w-5 h-5 rounded-full bg-slate-900" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Live Canvas Simulation */}
            <div className="lg:col-span-8 p-6 sm:p-8 bg-slate-100/60 flex items-center justify-center">
              <div
                className={`bg-white rounded-2xl border border-border p-6 shadow-sm space-y-5 transition-all duration-300 ${
                  demoDevice === 'mobile'
                    ? 'w-[320px]'
                    : demoDevice === 'tablet'
                    ? 'w-[520px]'
                    : 'w-full'
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">Sarah Jenkins</h4>
                    <p className="text-xs text-indigo-600 font-mono font-medium">Senior Staff Software Engineer</p>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Open to Advisory
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Building fault-tolerant distributed systems and telemetry pipelines. Previously led infrastructure initiatives at Stripe and Cloudflare.
                </p>

                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    // Featured Work
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-900">KubeStream — Event Telemetry</span>
                      <span className="text-[10px] font-mono text-indigo-600">Rust / eBPF</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Sub-millisecond p99 telemetry router for Kubernetes microservices.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100">
                  <span>github.com/sarahjenkins</span>
                  <span className="text-indigo-600 font-semibold">contact@sarah.dev &rarr;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Workflow Explanation */}
      <section id="how-it-works" className="py-20 bg-surface border-y border-border px-4 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-primary">
              Simple 3-Step Flow
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-text-primary">
              From draft to published in minutes.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-border bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-subtle">
                1
              </div>
              <h3 className="text-base font-bold text-text-primary">Pick your template</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Choose between Minimal, Studio, or Developer styles. Your content is never locked in — swap anytime with zero loss.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-subtle">
                2
              </div>
              <h3 className="text-base font-bold text-text-primary">Add content & tune style</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Add case studies, work history, and skills. Customize typography pairings and accent colors with live instant feedback.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-subtle">
                3
              </div>
              <h3 className="text-base font-bold text-text-primary">Publish with one click</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Claim your custom public slug. Draft edits remain private until you explicitly choose to publish updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Preview Cards */}
      <section className="py-20 px-4 sm:px-8 max-w-6xl mx-auto w-full space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-primary">
              Crafted Foundations
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-text-primary mt-1">
              Three genuinely distinct designs.
            </h2>
          </div>
          <Link href="/templates" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
            <span>View all template details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEMPLATE_METADATA.map((tmpl) => (
            <div
              key={tmpl.id}
              className="group rounded-3xl border border-border bg-surface overflow-hidden shadow-card hover:shadow-dropdown transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/10 overflow-hidden bg-slate-100 border-b border-border">
                  <img
                    src={tmpl.previewImage}
                    alt={tmpl.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-lg font-bold text-text-primary">{tmpl.name}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{tmpl.tagline}</p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link href="/dashboard" className="block w-full">
                  <Button variant="secondary" size="sm" className="w-full">
                    Start with {tmpl.name}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-4 sm:px-8 bg-surface border-t border-border text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Ready to present your finest work?
          </h2>
          <p className="text-base text-text-secondary leading-relaxed">
            Create your portfolio for free today. No credit card required, no lock-in, and full control over your content.
          </p>
          <div className="pt-2">
            <Link href="/dashboard">
              <Button variant="primary" size="lg" className="gap-2">
                <span>Build your portfolio now</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-8 px-4 sm:px-8 text-center text-xs text-text-muted">
        <p>Folio &bull; Professional Portfolio Builder &bull; Slate + Indigo Palette</p>
      </footer>
    </div>
  );
}
