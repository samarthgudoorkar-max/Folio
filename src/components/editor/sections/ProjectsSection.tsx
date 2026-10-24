'use client';

import React, { useState } from 'react';
import { ProjectItem } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { ImageUploader } from '../ImageUploader';
import { Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronUp, FolderKanban } from 'lucide-react';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  onChange: (projects: ProjectItem[]) => void;
}

export function ProjectsSection({ projects, onChange }: ProjectsSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(projects[0]?.id || null);

  const handleAddProject = () => {
    const newProj: ProjectItem = {
      id: `proj_${Date.now()}`,
      title: 'New Project',
      summary: 'Brief overview of this project, goals achieved, and impact.',
      images: [],
      technologies: ['TypeScript', 'Design'],
      role: 'Lead',
      liveLink: '',
      repoLink: '',
      featured: false,
    };
    onChange([newProj, ...projects]);
    setExpandedId(newProj.id);
  };

  const handleUpdate = (id: string, updates: Partial<ProjectItem>) => {
    onChange(projects.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const handleDelete = (id: string) => {
    onChange(projects.filter(p => p.id !== id));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= projects.length) return;
    const copy = [...projects];
    const [moved] = copy.splice(index, 1);
    copy.splice(newIndex, 0, moved);
    onChange(copy);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Featured Projects</h3>
          <p className="text-xs text-text-muted mt-0.5">
            Add case studies, open-source repositories, or client work.
          </p>
        </div>
        <Button size="sm" onClick={handleAddProject} className="gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-xl border border-dashed border-border bg-slate-50">
          <FolderKanban className="w-8 h-8 text-text-muted mx-auto mb-2" />
          <p className="text-sm font-medium text-text-primary">No projects yet</p>
          <p className="text-xs text-text-muted mt-1">Add your first project to highlight your work.</p>
          <Button size="sm" variant="secondary" onClick={handleAddProject} className="mt-3">
            Add Project
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((proj, index) => {
            const isExpanded = expandedId === proj.id;

            return (
              <div
                key={proj.id}
                className="border border-border rounded-xl bg-surface overflow-hidden shadow-subtle transition-all"
              >
                {/* Project Header Bar */}
                <div className="p-3.5 flex items-center justify-between gap-3 bg-slate-50/50">
                  <div
                    className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
                    onClick={() => setExpandedId(isExpanded ? null : proj.id)}
                  >
                    <span className="text-xs font-mono font-bold text-text-muted w-5">
                      #{index + 1}
                    </span>
                    <span className="text-sm font-semibold text-text-primary truncate">
                      {proj.title || 'Untitled Project'}
                    </span>
                    {proj.featured && (
                      <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.2 rounded font-medium">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Move Up/Down Controls for Keyboard & Fast Reordering */}
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, 'up')}
                      aria-label="Move project up"
                      title="Move up"
                      className="p-1 rounded text-text-muted hover:text-text-primary disabled:opacity-30 disabled:hover:text-text-muted"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === projects.length - 1}
                      onClick={() => handleMove(index, 'down')}
                      aria-label="Move project down"
                      title="Move down"
                      className="p-1 rounded text-text-muted hover:text-text-primary disabled:opacity-30 disabled:hover:text-text-muted"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(proj.id)}
                      aria-label="Delete project"
                      title="Delete project"
                      className="p-1 rounded text-danger hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : proj.id)}
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      className="p-1 rounded text-text-muted hover:text-text-primary"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Form */}
                {isExpanded && (
                  <div className="p-4 space-y-4 border-t border-border">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Project Title *"
                        value={proj.title}
                        onChange={(e) => handleUpdate(proj.id, { title: e.target.value })}
                        placeholder="e.g. Acme Dashboard"
                        error={!proj.title.trim() ? 'Project title is required' : undefined}
                      />
                      <Input
                        label="Your Role"
                        value={proj.role || ''}
                        onChange={(e) => handleUpdate(proj.id, { role: e.target.value })}
                        placeholder="e.g. Lead Designer / Frontend Dev"
                      />
                    </div>

                    <Textarea
                      label="Project Summary *"
                      value={proj.summary}
                      onChange={(e) => handleUpdate(proj.id, { summary: e.target.value })}
                      placeholder="Explain what the project solves, key challenges, or notable metrics."
                      rows={3}
                      error={!proj.summary.trim() ? 'Summary is required' : undefined}
                    />

                    {/* Technologies Tag input (comma separated) */}
                    <Input
                      label="Technologies & Skills (comma separated)"
                      value={proj.technologies.join(', ')}
                      onChange={(e) => {
                        const tags = e.target.value
                          .split(',')
                          .map(t => t.trim())
                          .filter(Boolean);
                        handleUpdate(proj.id, { technologies: tags });
                      }}
                      placeholder="e.g. React, TypeScript, Tailwind, GraphQL"
                      helperText="Separate tags with commas"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Live Site URL"
                        value={proj.liveLink || ''}
                        onChange={(e) => handleUpdate(proj.id, { liveLink: e.target.value })}
                        placeholder="https://example.com"
                      />
                      <Input
                        label="Source Code / Repo URL"
                        value={proj.repoLink || ''}
                        onChange={(e) => handleUpdate(proj.id, { repoLink: e.target.value })}
                        placeholder="https://github.com/..."
                      />
                    </div>

                    <ImageUploader
                      label="Cover / Showcase Image"
                      value={proj.images?.[0]}
                      onChange={(url) => handleUpdate(proj.id, { images: url ? [url] : [] })}
                      aspectRatio="wide"
                      helperText="High-resolution screenshot or mockup"
                    />

                    <div className="pt-2">
                      <Toggle
                        label="Highlight as Featured Project"
                        description="Adds a prominent badge or spotlight treatment in the portfolio."
                        checked={!!proj.featured}
                        onChange={(checked) => handleUpdate(proj.id, { featured: checked })}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
