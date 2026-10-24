'use client';

import React, { useState } from 'react';
import { ExperienceItem } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronUp, Briefcase } from 'lucide-react';

interface ExperienceSectionProps {
  experience: ExperienceItem[];
  onChange: (items: ExperienceItem[]) => void;
}

export function ExperienceSection({ experience, onChange }: ExperienceSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(experience[0]?.id || null);

  const handleAdd = () => {
    const newItem: ExperienceItem = {
      id: `exp_${Date.now()}`,
      organization: 'Company Name',
      role: 'Role / Title',
      startDate: '2023',
      endDate: 'Present',
      isCurrent: true,
      description: 'Key responsibilities, team impact, and technical accomplishments.',
    };
    onChange([newItem, ...experience]);
    setExpandedId(newItem.id);
  };

  const handleUpdate = (id: string, updates: Partial<ExperienceItem>) => {
    onChange(experience.map(item => (item.id === id ? { ...item, ...updates } : item)));
  };

  const handleDelete = (id: string) => {
    onChange(experience.filter(item => item.id !== id));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= experience.length) return;
    const copy = [...experience];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, moved);
    onChange(copy);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Work Experience</h3>
          <p className="text-xs text-text-muted mt-0.5">
            Your career trajectory, roles held, and key achievements.
          </p>
        </div>
        <Button size="sm" onClick={handleAdd} className="gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          <span>Add Experience</span>
        </Button>
      </div>

      {experience.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-xl border border-dashed border-border bg-slate-50">
          <Briefcase className="w-8 h-8 text-text-muted mx-auto mb-2" />
          <p className="text-sm font-medium text-text-primary">No experience listed</p>
          <Button size="sm" variant="secondary" onClick={handleAdd} className="mt-3">
            Add Role
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {experience.map((item, index) => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className="border border-border rounded-xl bg-surface overflow-hidden shadow-subtle transition-all"
              >
                <div className="p-3.5 flex items-center justify-between gap-3 bg-slate-50/50">
                  <div
                    className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  >
                    <span className="text-xs font-mono font-bold text-text-muted w-5">
                      #{index + 1}
                    </span>
                    <div className="truncate">
                      <span className="text-sm font-semibold text-text-primary">
                        {item.role || 'New Role'}
                      </span>
                      <span className="text-xs text-text-muted ml-2">
                        @ {item.organization || 'Company'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, 'up')}
                      aria-label="Move up"
                      className="p-1 rounded text-text-muted hover:text-text-primary disabled:opacity-30"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === experience.length - 1}
                      onClick={() => handleMove(index, 'down')}
                      aria-label="Move down"
                      className="p-1 rounded text-text-muted hover:text-text-primary disabled:opacity-30"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      aria-label="Delete experience"
                      className="p-1 rounded text-danger hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="p-1 rounded text-text-muted hover:text-text-primary"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 space-y-4 border-t border-border">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Company / Organization *"
                        value={item.organization}
                        onChange={(e) => handleUpdate(item.id, { organization: e.target.value })}
                        placeholder="e.g. Stripe, Acme Corp"
                      />
                      <Input
                        label="Role / Title *"
                        value={item.role}
                        onChange={(e) => handleUpdate(item.id, { role: e.target.value })}
                        placeholder="e.g. Staff Engineer"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Start Date"
                        value={item.startDate}
                        onChange={(e) => handleUpdate(item.id, { startDate: e.target.value })}
                        placeholder="e.g. Jan 2021 or 2021"
                      />
                      <Input
                        label="End Date"
                        value={item.isCurrent ? 'Present' : item.endDate}
                        disabled={item.isCurrent}
                        onChange={(e) => handleUpdate(item.id, { endDate: e.target.value })}
                        placeholder="e.g. Present, or Dec 2023"
                      />
                    </div>

                    <Toggle
                      label="I currently work here"
                      checked={!!item.isCurrent}
                      onChange={(checked) => handleUpdate(item.id, { isCurrent: checked, endDate: checked ? 'Present' : '' })}
                    />

                    <Textarea
                      label="Key Responsibilities & Impact"
                      value={item.description}
                      onChange={(e) => handleUpdate(item.id, { description: e.target.value })}
                      placeholder="Outline key systems built, problems solved, metrics, or teams led."
                      rows={3}
                    />
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
