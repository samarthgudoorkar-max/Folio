'use client';

import React, { useState } from 'react';
import { EducationItem } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react';

interface EducationSectionProps {
  education: EducationItem[];
  onChange: (items: EducationItem[]) => void;
}

export function EducationSection({ education, onChange }: EducationSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(education[0]?.id || null);

  const handleAdd = () => {
    const newItem: EducationItem = {
      id: `edu_${Date.now()}`,
      institution: 'University / Institute',
      degree: 'B.S. Computer Science',
      fieldOfStudy: '',
      startDate: '2016',
      endDate: '2020',
      description: '',
    };
    onChange([newItem, ...education]);
    setExpandedId(newItem.id);
  };

  const handleUpdate = (id: string, updates: Partial<EducationItem>) => {
    onChange(education.map(item => (item.id === id ? { ...item, ...updates } : item)));
  };

  const handleDelete = (id: string) => {
    onChange(education.filter(item => item.id !== id));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= education.length) return;
    const copy = [...education];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, moved);
    onChange(copy);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Education</h3>
          <p className="text-xs text-text-muted mt-0.5">
            Degrees, courses, and certifications.
          </p>
        </div>
        <Button size="sm" onClick={handleAdd} className="gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          <span>Add Education</span>
        </Button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-xl border border-dashed border-border bg-slate-50">
          <GraduationCap className="w-8 h-8 text-text-muted mx-auto mb-2" />
          <p className="text-sm font-medium text-text-primary">No education listed</p>
          <Button size="sm" variant="secondary" onClick={handleAdd} className="mt-3">
            Add Degree
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {education.map((item, index) => {
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
                        {item.institution || 'Institution'}
                      </span>
                      <span className="text-xs text-text-muted ml-2">
                        {item.degree}
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
                      disabled={index === education.length - 1}
                      onClick={() => handleMove(index, 'down')}
                      aria-label="Move down"
                      className="p-1 rounded text-text-muted hover:text-text-primary disabled:opacity-30"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      aria-label="Delete education"
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
                        label="Institution / University *"
                        value={item.institution}
                        onChange={(e) => handleUpdate(item.id, { institution: e.target.value })}
                        placeholder="e.g. UC Berkeley, RISD"
                      />
                      <Input
                        label="Degree / Certificate *"
                        value={item.degree}
                        onChange={(e) => handleUpdate(item.id, { degree: e.target.value })}
                        placeholder="e.g. B.S., BFA, Certificate"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Input
                        label="Field of Study"
                        value={item.fieldOfStudy || ''}
                        onChange={(e) => handleUpdate(item.id, { fieldOfStudy: e.target.value })}
                        placeholder="e.g. Computer Science"
                      />
                      <Input
                        label="Start Year"
                        value={item.startDate}
                        onChange={(e) => handleUpdate(item.id, { startDate: e.target.value })}
                        placeholder="e.g. 2016"
                      />
                      <Input
                        label="End Year"
                        value={item.endDate}
                        onChange={(e) => handleUpdate(item.id, { endDate: e.target.value })}
                        placeholder="e.g. 2020"
                      />
                    </div>

                    <Textarea
                      label="Honors, Thesis, or Relevant Coursework"
                      value={item.description || ''}
                      onChange={(e) => handleUpdate(item.id, { description: e.target.value })}
                      placeholder="e.g. Graduated Magna Cum Laude; President of ACM."
                      rows={2}
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
