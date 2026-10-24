'use client';

import React from 'react';
import { SkillCategory } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Cpu } from 'lucide-react';

interface SkillsSectionProps {
  skills: SkillCategory[];
  onChange: (skills: SkillCategory[]) => void;
}

export function SkillsSection({ skills, onChange }: SkillsSectionProps) {
  const handleAddCategory = () => {
    const newCat: SkillCategory = {
      id: `skill_cat_${Date.now()}`,
      category: 'New Category',
      skills: ['Skill 1', 'Skill 2'],
    };
    onChange([...skills, newCat]);
  };

  const handleUpdateCategory = (id: string, updates: Partial<SkillCategory>) => {
    onChange(skills.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const handleDeleteCategory = (id: string) => {
    onChange(skills.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Skills & Disciplines</h3>
          <p className="text-xs text-text-muted mt-0.5">
            Organize competencies into clear, structured categories.
          </p>
        </div>
        <Button size="sm" onClick={handleAddCategory} className="gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          <span>Add Category</span>
        </Button>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-xl border border-dashed border-border bg-slate-50">
          <Cpu className="w-8 h-8 text-text-muted mx-auto mb-2" />
          <p className="text-sm font-medium text-text-primary">No skills listed</p>
          <Button size="sm" variant="secondary" onClick={handleAddCategory} className="mt-3">
            Add Skill Group
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {skills.map((category) => (
            <div
              key={category.id}
              className="p-4 rounded-xl border border-border bg-surface space-y-3 shadow-subtle"
            >
              <div className="flex items-center justify-between gap-3">
                <Input
                  value={category.category}
                  onChange={(e) => handleUpdateCategory(category.id, { category: e.target.value })}
                  placeholder="Category Name (e.g. Languages, Design Tools)"
                  className="font-medium"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(category.id)}
                  aria-label="Delete category"
                  className="p-2 text-danger hover:bg-red-50 rounded-lg shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <Input
                label="Skills (comma-separated)"
                value={category.skills.join(', ')}
                onChange={(e) => {
                  const items = e.target.value
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean);
                  handleUpdateCategory(category.id, { skills: items });
                }}
                placeholder="TypeScript, Go, React, PostgreSQL"
                helperText="Type skills separated by commas"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
