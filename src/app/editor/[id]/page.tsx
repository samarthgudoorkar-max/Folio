'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Portfolio, PortfolioContent, PortfolioSettings, SectionMeta } from '@/lib/types';
import { EditorTopBar } from '@/components/editor/EditorTopBar';
import { SectionsManager } from '@/components/editor/SectionsManager';
import { ProfileSection } from '@/components/editor/sections/ProfileSection';
import { AboutSection } from '@/components/editor/sections/AboutSection';
import { ProjectsSection } from '@/components/editor/sections/ProjectsSection';
import { ExperienceSection } from '@/components/editor/sections/ExperienceSection';
import { EducationSection } from '@/components/editor/sections/EducationSection';
import { SkillsSection } from '@/components/editor/sections/SkillsSection';
import { SocialsSection } from '@/components/editor/sections/SocialsSection';
import { ContactSection } from '@/components/editor/sections/ContactSection';
import { ResumeSection } from '@/components/editor/sections/ResumeSection';
import { DesignControls } from '@/components/editor/DesignControls';
import { SettingsPanel } from '@/components/editor/SettingsPanel';
import { PublishModal } from '@/components/editor/PublishModal';
import { PreviewModal } from '@/components/editor/PreviewModal';
import { PortfolioRenderer } from '@/components/templates/PortfolioRenderer';
import { Tabs } from '@/components/ui/tabs';
import { Loader2, Layers, Palette, Settings as SettingsIcon, AlertCircle, Eye, Edit3 } from 'lucide-react';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const portfolioId = params.id as string;

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [settings, setSettings] = useState<PortfolioSettings | null>(null);

  // Undo / Redo history
  const [history, setHistory] = useState<PortfolioContent[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Active navigation tab & active section
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'settings'>('content');
  const [activeSectionId, setActiveSectionId] = useState<string>('sec_profile');

  // Preview & Device view
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Mobile editor view mode: 'edit' or 'preview'
  const [mobileViewMode, setMobileViewMode] = useState<'edit' | 'preview'>('edit');

  // Autosave status
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved');
  const [lastSavedAt, setLastSavedAt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  // 1. Fetch initial portfolio data
  useEffect(() => {
    async function loadPortfolio() {
      setIsLoading(true);
      setFetchError(null);
      try {
        const res = await fetch(`/api/portfolios/${portfolioId}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to load portfolio');
        }
        const data = await res.json();
        const p: Portfolio = data.portfolio;

        // Check for local storage recovery draft
        const localKey = `folio_draft_${portfolioId}`;
        const localDraft = localStorage.getItem(localKey);
        let finalContent = p.draftData;

        if (localDraft) {
          try {
            const parsed = JSON.parse(localDraft);
            if (parsed && parsed.updatedAt && new Date(parsed.updatedAt) > new Date(p.updatedAt)) {
              finalContent = parsed.draftData;
            }
          } catch {
            // ignore malformed local storage
          }
        }

        setPortfolio(p);
        setContent(finalContent);
        setSettings(p.settings);
        setHistory([finalContent]);
        setHistoryIndex(0);
        setSaveStatus('saved');
        setLastSavedAt(p.updatedAt);
      } catch (err: any) {
        setFetchError(err.message || 'Could not load portfolio.');
      } finally {
        setIsLoading(false);
      }
    }

    if (portfolioId) {
      loadPortfolio();
    }
  }, [portfolioId]);

  // 2. Debounced Autosave to Server
  const saveToServer = useCallback(
    async (currentContent: PortfolioContent, currentSettings: PortfolioSettings) => {
      setSaveStatus('saving');
      try {
        const res = await fetch(`/api/portfolios/${portfolioId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            draftData: currentContent,
            settings: currentSettings,
          }),
        });

        if (!res.ok) {
          throw new Error('Save response not ok');
        }

        const data = await res.json();
        setPortfolio(data.portfolio);
        setSaveStatus('saved');
        const now = new Date().toISOString();
        setLastSavedAt(now);

        // Also update local storage backup
        localStorage.setItem(
          `folio_draft_${portfolioId}`,
          JSON.stringify({ draftData: currentContent, settings: currentSettings, updatedAt: now })
        );
      } catch (err) {
        console.error('Autosave error, persisting to local storage backup', err);
        setSaveStatus('error');
        // Durable local backup
        localStorage.setItem(
          `folio_draft_${portfolioId}`,
          JSON.stringify({ draftData: currentContent, settings: currentSettings, updatedAt: new Date().toISOString() })
        );
      }
    },
    [portfolioId]
  );

  // Trigger autosave when content or settings change
  const triggerSave = useCallback(
    (newContent: PortfolioContent, newSettings: PortfolioSettings) => {
      setSaveStatus('unsaved');
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      saveTimerRef.current = setTimeout(() => {
        saveToServer(newContent, newSettings);
      }, 1000);
    },
    [saveToServer]
  );

  // Update content with undo/redo history tracking
  const handleContentChange = useCallback(
    (updated: PortfolioContent, recordHistory = true) => {
      setContent(updated);

      if (recordHistory) {
        setHistory((prev) => {
          const upToCurrent = prev.slice(0, historyIndex + 1);
          const nextHistory = [...upToCurrent, updated].slice(-30); // keep max 30
          setHistoryIndex(nextHistory.length - 1);
          return nextHistory;
        });
      }

      if (settings) {
        triggerSave(updated, settings);
      }
    },
    [historyIndex, settings, triggerSave]
  );

  // Settings change
  const handleSettingsChange = useCallback(
    (updatedSettings: PortfolioSettings) => {
      setSettings(updatedSettings);
      if (content) {
        triggerSave(content, updatedSettings);
      }
    },
    [content, triggerSave]
  );

  // Undo & Redo handlers
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const prevContent = history[prevIndex];
      setHistoryIndex(prevIndex);
      setContent(prevContent);
      if (settings) triggerSave(prevContent, settings);
    }
  }, [historyIndex, history, settings, triggerSave]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextContent = history[nextIndex];
      setHistoryIndex(nextIndex);
      setContent(nextContent);
      if (settings) triggerSave(nextContent, settings);
    }
  }, [historyIndex, history, settings, triggerSave]);

  // Keyboard shortcut listener for Cmd+Z / Cmd+Shift+Z
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Section visibility and reordering helpers
  const handleToggleSectionVisibility = (secId: string) => {
    if (!content) return;
    const updatedSections = content.sectionsOrder.map((s) =>
      s.id === secId ? { ...s, enabled: !s.enabled } : s
    );
    handleContentChange({ ...content, sectionsOrder: updatedSections });
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (!content) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= content.sectionsOrder.length) return;
    const copy = [...content.sectionsOrder];
    const [moved] = copy.splice(index, 1);
    copy.splice(newIndex, 0, moved);
    handleContentChange({ ...content, sectionsOrder: copy });
  };

  // Publish / Unpublish actions
  const handlePublish = async () => {
    if (!content || !settings) return;
    // Ensure draft is saved first
    await saveToServer(content, settings);

    const res = await fetch(`/api/portfolios/${portfolioId}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'publish' }),
    });

    if (res.ok) {
      const data = await res.json();
      setPortfolio(data.portfolio);
      setIsPublishModalOpen(false);
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to publish portfolio');
    }
  };

  const handleUnpublish = async () => {
    const res = await fetch(`/api/portfolios/${portfolioId}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'unpublish' }),
    });

    if (res.ok) {
      const data = await res.json();
      setPortfolio(data.portfolio);
      setIsPublishModalOpen(false);
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to unpublish portfolio');
    }
  };

  const handleDeletePortfolio = async () => {
    const res = await fetch(`/api/portfolios/${portfolioId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      router.push('/dashboard');
    } else {
      alert('Failed to delete portfolio');
    }
  };

  // Loading & Error States
  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-text-primary gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-text-secondary">Loading your portfolio...</p>
      </div>
    );
  }

  if (fetchError || !portfolio || !content || !settings) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background px-4 text-center">
        <div className="p-3 bg-red-50 text-danger rounded-2xl mb-3">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-text-primary">Portfolio Not Found</h2>
        <p className="text-sm text-text-muted mt-1 max-w-sm">
          {fetchError || 'This portfolio may have been deleted or belongs to another user.'}
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-4 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Active section editing component resolver
  const activeSection = content.sectionsOrder.find((s) => s.id === activeSectionId);

  const renderActiveSectionEditor = () => {
    if (!activeSection) {
      return (
        <ProfileSection
          data={content.profile}
          onChange={(prof) => handleContentChange({ ...content, profile: prof })}
        />
      );
    }

    switch (activeSection.type) {
      case 'profile':
        return (
          <ProfileSection
            data={content.profile}
            onChange={(prof) => handleContentChange({ ...content, profile: prof })}
          />
        );
      case 'about':
        return (
          <AboutSection
            data={content.about}
            onChange={(abt) => handleContentChange({ ...content, about: abt })}
          />
        );
      case 'projects':
        return (
          <ProjectsSection
            projects={content.projects}
            onChange={(projs) => handleContentChange({ ...content, projects: projs })}
          />
        );
      case 'experience':
        return (
          <ExperienceSection
            experience={content.experience}
            onChange={(exp) => handleContentChange({ ...content, experience: exp })}
          />
        );
      case 'education':
        return (
          <EducationSection
            education={content.education}
            onChange={(edu) => handleContentChange({ ...content, education: edu })}
          />
        );
      case 'skills':
        return (
          <SkillsSection
            skills={content.skills}
            onChange={(sk) => handleContentChange({ ...content, skills: sk })}
          />
        );
      case 'socials':
        return (
          <SocialsSection
            socials={content.socials}
            onChange={(soc) => handleContentChange({ ...content, socials: soc })}
          />
        );
      case 'contact':
        return (
          <ContactSection
            data={content.contact}
            onChange={(ct) => handleContentChange({ ...content, contact: ct })}
          />
        );
      case 'resume':
        return (
          <ResumeSection
            data={content.resume}
            onChange={(res) => handleContentChange({ ...content, resume: res })}
          />
        );
      default:
        return null;
    }
  };

  const deviceWidthClasses = {
    desktop: 'w-full',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]',
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden select-none">
      {/* Top Bar */}
      <EditorTopBar
        portfolioTitle={settings.title}
        saveStatus={saveStatus}
        lastSavedAt={lastSavedAt}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        deviceView={deviceView}
        onDeviceChange={setDeviceView}
        onOpenPreview={() => setIsPreviewModalOpen(true)}
        onOpenPublish={() => setIsPublishModalOpen(true)}
        isPublished={portfolio.status === 'published'}
        publishedSlug={portfolio.publishedSlug}
        onRetrySave={() => saveToServer(content, settings)}
      />

      {/* Mobile/Tablet Screen View Mode Switcher */}
      <div className="lg:hidden flex items-center justify-center p-2 bg-surface border-b border-border">
        <div className="flex bg-slate-100 p-1 rounded-xl w-full max-w-xs">
          <button
            onClick={() => setMobileViewMode('edit')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              mobileViewMode === 'edit'
                ? 'bg-surface text-primary shadow-subtle'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Content</span>
          </button>
          <button
            onClick={() => setMobileViewMode('preview')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              mobileViewMode === 'preview'
                ? 'bg-surface text-primary shadow-subtle'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {/* Main Builder Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation & Controls (Hidden when mobile view mode is 'preview') */}
        <div
          className={`w-full lg:w-[480px] xl:w-[540px] flex flex-col bg-surface border-r border-border shrink-0 z-10 ${
            mobileViewMode === 'preview' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Sidebar Tab Bar */}
          <div className="p-3 border-b border-border bg-slate-50/50">
            <Tabs
              tabs={[
                { id: 'content', label: 'Content', icon: <Layers className="w-4 h-4" /> },
                { id: 'design', label: 'Design', icon: <Palette className="w-4 h-4" /> },
                { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-4 h-4" /> },
              ]}
              activeTab={activeTab}
              onChange={(tab) => setActiveTab(tab as any)}
            />
          </div>

          {/* Left Panel Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {activeTab === 'content' && (
              <div className="space-y-6">
                {/* Reorderable / Toggleable Section List */}
                <SectionsManager
                  sections={content.sectionsOrder}
                  activeSectionId={activeSectionId}
                  onSelectSection={setActiveSectionId}
                  onToggleVisibility={handleToggleSectionVisibility}
                  onMoveSection={handleMoveSection}
                />

                <div className="h-px bg-border my-4" />

                {/* Selected Section Editor */}
                <div className="bg-surface rounded-2xl p-1">
                  {renderActiveSectionEditor()}
                </div>
              </div>
            )}

            {activeTab === 'design' && (
              <DesignControls
                design={content.design}
                onChange={(d) => handleContentChange({ ...content, design: d })}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsPanel
                settings={settings}
                portfolioId={portfolioId}
                isPublished={portfolio.status === 'published'}
                publishedSlug={portfolio.publishedSlug}
                onChange={handleSettingsChange}
                onDelete={handleDeletePortfolio}
                onUnpublish={handleUnpublish}
              />
            )}
          </div>
        </div>

        {/* Right Panel: Live Interactive Preview Frame */}
        <div
          className={`flex-1 bg-slate-100/70 p-4 sm:p-6 overflow-y-auto flex justify-center items-start ${
            mobileViewMode === 'edit' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div
            className={`bg-white rounded-2xl border border-border shadow-modal transition-all duration-300 overflow-hidden ${deviceWidthClasses[deviceView]}`}
          >
            {/* Viewport Frame Header */}
            <div className="h-8 bg-slate-50 border-b border-border px-4 flex items-center justify-between text-[11px] text-text-muted select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
              </div>
              <div className="font-mono text-[10px] text-slate-500 bg-white px-3 py-0.5 rounded-full border border-border">
                folio.dev/p/{settings.slug || 'preview'}
              </div>
              <div className="w-12" />
            </div>

            {/* Shared Renderer Output */}
            <PortfolioRenderer content={content} isPublic={false} />
          </div>
        </div>
      </div>

      {/* Publish & Settings Modal */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        portfolioId={portfolioId}
        currentSlug={settings.slug}
        isPublished={portfolio.status === 'published'}
        publishedSlug={portfolio.publishedSlug}
        onSlugChange={(newSlug) => handleSettingsChange({ ...settings, slug: newSlug })}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
      />

      {/* Fullscreen Preview Modal */}
      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        content={content}
        title={settings.title}
      />
    </div>
  );
}
