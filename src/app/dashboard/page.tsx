'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Portfolio, TemplateId } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import {
  getUserPortfolios,
  createPortfolio,
  duplicatePortfolio,
  deletePortfolio,
  updatePortfolioDraft,
} from '@/lib/data-service';
import { PortfolioCard } from '@/components/dashboard/PortfolioCard';
import { CreatePortfolioModal } from '@/components/dashboard/CreatePortfolioModal';
import { RenameModal } from '@/components/dashboard/RenameModal';
import { DeleteModal } from '@/components/dashboard/DeleteModal';
import { PreviewModal } from '@/components/editor/PreviewModal';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Search,
  FolderKanban,
  ChevronDown,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { TEMPLATE_METADATA } from '@/lib/mock-data';

export default function DashboardPage() {
  const router = useRouter();
  const { user, allDemoUsers, switchUser, isLoading: isAuthLoading } = useAuth();

  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [previewPortfolio, setPreviewPortfolio] = useState<Portfolio | null>(null);
  const [renamePortfolio, setRenamePortfolio] = useState<Portfolio | null>(null);
  const [deletePortfolioTarget, setDeletePortfolioTarget] = useState<Portfolio | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Fetch portfolios for current user
  const loadUserPortfolios = () => {
    setIsLoading(true);
    try {
      const list = getUserPortfolios(user.id);
      setPortfolios(list);
    } catch (err) {
      console.error('Failed to load portfolios', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading) {
      loadUserPortfolios();
    }
  }, [user.id, isAuthLoading]);

  // Actions
  const handleCreatePortfolio = async (template: TemplateId, title: string) => {
    try {
      const created = createPortfolio(user.id, template, title || undefined);
      router.push(`/editor/?id=${created.id}`);
    } catch (err) {
      console.error('Failed to create portfolio', err);
    }
  };

  const handleDuplicate = async (portfolio: Portfolio) => {
    try {
      duplicatePortfolio(portfolio.id, user.id);
      loadUserPortfolios();
    } catch (err) {
      console.error('Failed to duplicate portfolio', err);
    }
  };

  const handleRename = async (newTitle: string) => {
    if (!renamePortfolio) return;
    try {
      updatePortfolioDraft(renamePortfolio.id, user.id, renamePortfolio.draftData, {
        ...renamePortfolio.settings,
        title: newTitle,
      });
      loadUserPortfolios();
    } catch (err) {
      console.error('Failed to rename portfolio', err);
    }
  };

  const handleDelete = async () => {
    if (!deletePortfolioTarget) return;
    try {
      deletePortfolio(deletePortfolioTarget.id, user.id);
      loadUserPortfolios();
    } catch (err) {
      console.error('Failed to delete portfolio', err);
    }
  };

  // Filtered portfolios
  const filteredPortfolios = useMemo(() => {
    return portfolios.filter((p) => {
      const matchesSearch =
        p.settings.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.settings.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.draftData?.profile?.role || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'published'
          ? p.status === 'published'
          : p.status === 'draft';

      return matchesSearch && matchesStatus;
    });
  }, [portfolios, searchQuery, statusFilter]);

  const publishedCount = portfolios.filter((p) => p.status === 'published').length;
  const draftCount = portfolios.filter((p) => p.status === 'draft').length;

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
      {/* Top Navigation */}
      <header className="h-16 border-b border-border bg-surface px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-base shadow-subtle group-hover:bg-primary-hover transition-colors">
              F
            </span>
            <span className="font-bold text-lg text-text-primary tracking-tight">Folio</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-text-secondary">
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-text-primary font-semibold">
              Portfolios
            </span>
            <Link
              href="/templates"
              className="px-3 py-1.5 rounded-lg hover:text-text-primary hover:bg-slate-50 transition-colors"
            >
              Templates
            </Link>
          </nav>
        </div>

        {/* User Identity & Switcher (Multi-user demo privacy) */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl border border-border bg-surface hover:bg-slate-50 hover:border-border-strong transition-all shadow-subtle text-left"
            >
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-7 h-7 rounded-lg object-cover border border-slate-200"
              />
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-text-primary leading-tight">{user.name}</p>
                <p className="text-[10px] text-text-muted truncate max-w-[120px]">{user.role}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
            </button>

            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl bg-surface border border-border shadow-dropdown p-2 space-y-1 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-border/80">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
                      Active User Account
                    </p>
                    <p className="text-xs font-bold text-text-primary">{user.name}</p>
                    <p className="text-xs text-text-muted truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                      Switch Demo Profile
                    </p>
                    {allDemoUsers.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          switchUser(u.id);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors text-left ${
                          u.id === user.id
                            ? 'bg-primary-soft text-primary font-semibold'
                            : 'hover:bg-slate-100 text-text-secondary'
                        }`}
                      >
                        <img
                          src={u.avatarUrl}
                          alt={u.name}
                          className="w-6 h-6 rounded-md object-cover"
                        />
                        <div className="truncate">
                          <p className="font-medium text-text-primary truncate">{u.name}</p>
                          <p className="text-[10px] text-text-muted truncate">{u.role}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-1 border-t border-border">
                    <Link
                      href="/"
                      className="block w-full px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-slate-100 rounded-lg text-left"
                    >
                      Sign Out / Back to Home
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Portfolio</span>
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              Welcome back, {user.name.split(' ')[0]}
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Manage your personal portfolios, customize layouts, and publish updates.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsCreateOpen(true)}
            className="self-start md:self-auto gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Portfolio</span>
          </Button>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Status Filter Tabs */}
          <div className="flex p-1 bg-slate-200/60 rounded-xl space-x-1 shrink-0">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === 'all'
                  ? 'bg-surface text-text-primary shadow-subtle'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              All ({portfolios.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === 'published'
                  ? 'bg-surface text-text-primary shadow-subtle'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Published ({publishedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === 'draft'
                  ? 'bg-surface text-text-primary shadow-subtle'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Drafts ({draftCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search portfolios..."
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-surface text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus-ring/20 transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Portfolio Cards Grid or Loading / Empty States */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs text-text-muted">Loading your portfolios...</p>
          </div>
        ) : filteredPortfolios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolios.map((portfolio) => (
              <PortfolioCard
                key={portfolio.id}
                portfolio={portfolio}
                onPreview={(p) => setPreviewPortfolio(p)}
                onDuplicate={handleDuplicate}
                onRename={(p) => setRenamePortfolio(p)}
                onDelete={(p) => setDeletePortfolioTarget(p)}
              />
            ))}
          </div>
        ) : (
          /* Useful Empty State */
          <div className="border border-dashed border-border-strong rounded-3xl bg-surface p-8 sm:p-12 text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-primary-soft text-primary mx-auto flex items-center justify-center">
              <FolderKanban className="w-7 h-7" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-bold text-text-primary">
                {searchQuery ? 'No portfolios matched your search' : 'No portfolios created yet'}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {searchQuery
                  ? `Try clearing your search terms or filtering differently.`
                  : `Select one of our curated templates below to create your first portfolio in seconds.`}
              </p>
            </div>

            {/* Quick-start starter cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-2 text-left">
              {TEMPLATE_METADATA.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => handleCreatePortfolio(tmpl.id, '')}
                  className="p-4 rounded-2xl border border-border bg-slate-50/60 hover:border-primary hover:bg-surface hover:shadow-subtle cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-text-primary group-hover:text-primary transition-colors">
                      {tmpl.name}
                    </span>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {tmpl.tagline}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsCreateOpen(true)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Custom Portfolio</span>
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-6 px-4 text-center text-xs text-text-muted">
        <p>Folio Portfolio Builder &bull; Built with Slate + Indigo design language</p>
      </footer>

      {/* Create Modal */}
      <CreatePortfolioModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreatePortfolio}
      />

      {/* Rename Modal */}
      {renamePortfolio && (
        <RenameModal
          isOpen={!!renamePortfolio}
          onClose={() => setRenamePortfolio(null)}
          currentTitle={renamePortfolio.settings.title}
          onRename={handleRename}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletePortfolioTarget && (
        <DeleteModal
          isOpen={!!deletePortfolioTarget}
          onClose={() => setDeletePortfolioTarget(null)}
          portfolioTitle={deletePortfolioTarget.settings.title}
          onConfirm={handleDelete}
        />
      )}

      {/* Preview Modal */}
      {previewPortfolio && (
        <PreviewModal
          isOpen={!!previewPortfolio}
          onClose={() => setPreviewPortfolio(null)}
          content={previewPortfolio.draftData}
          title={previewPortfolio.settings.title}
        />
      )}
    </div>
  );
}
