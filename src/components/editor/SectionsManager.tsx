'use client';

import React from 'react';
import { SectionMeta } from '@/lib/types';
import {
  User,
  FileText,
  FolderKanban,
  Briefcase,
  GraduationCap,
  Cpu,
  Globe,
  Mail,
  FileDown,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  GripVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionsManagerProps {
  sections: SectionMeta[];
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onMoveSection: (index: number, direction: 'up' | 'down') => void;
}

const SECTION_ICONS: Record<SectionMeta['type'], React.ReactNode> = {
  profile: <User className="w-4 h-4" />,
  about: <FileText className="w-4 h-4" />,
  projects: <FolderKanban className="w-4 h-4" />,
  experience: <Briefcase className="w-4 h-4" />,
  education: <GraduationCap className="w-4 h-4" />,
  skills: <Cpu className="w-4 h-4" />,
  socials: <Globe className="w-4 h-4" />,
  contact: <Mail className="w-4 h-4" />,
  resume: <FileDown className="w-4 h-4" />,
};

export function SectionsManager({
  sections,
  activeSectionId,
  onSelectSection,
  onToggleVisibility,
  onMoveSection,
}: SectionsManagerProps) {
  return (
    <div className="space-y-1.5">
      <div className="px-2 pb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-text-muted">
        <span>Page Sections</span>
        <span>{sections.filter(s => s.enabled).length}/{sections.length} visible</span>
      </div>

      <div className="space-y-1">
        {sections.map((sec, index) => {
          const isActive = sec.id === activeSectionId;
          const icon = SECTION_ICONS[sec.type] || <FileText className="w-4 h-4" />;

          return (
            <div
              key={sec.id}
              className={cn(
                'group flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all select-none',
                isActive
                  ? 'bg-primary text-white shadow-subtle'
                  : 'bg-surface text-text-primary hover:bg-slate-100 border border-transparent hover:border-border'
              )}
            >
              {/* Section selection button */}
              <button
                type="button"
                onClick={() => onSelectSection(sec.id)}
                className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
              >
                <span className={cn('shrink-0', isActive ? 'text-white' : 'text-text-muted')}>
                  {icon}
                </span>
                <span className="truncate">{sec.title}</span>
              </button>

              {/* Action buttons */}
              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 shrink-0">
                {/* Reorder Up */}
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveSection(index, 'up');
                  }}
                  title="Move section up"
                  aria-label={`Move ${sec.title} up`}
                  className={cn(
                    'p-1 rounded transition-colors',
                    isActive
                      ? 'hover:bg-white/20 text-white disabled:opacity-30'
                      : 'hover:bg-slate-200 text-text-muted disabled:opacity-20'
                  )}
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                {/* Reorder Down */}
                <button
                  type="button"
                  disabled={index === sections.length - 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveSection(index, 'down');
                  }}
                  title="Move section down"
                  aria-label={`Move ${sec.title} down`}
                  className={cn(
                    'p-1 rounded transition-colors',
                    isActive
                      ? 'hover:bg-white/20 text-white disabled:opacity-30'
                      : 'hover:bg-slate-200 text-text-muted disabled:opacity-20'
                  )}
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                {/* Visibility Toggle */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility(sec.id);
                  }}
                  title={sec.enabled ? 'Hide section' : 'Show section'}
                  aria-label={sec.enabled ? `Hide ${sec.title}` : `Show ${sec.title}`}
                  className={cn(
                    'p-1 rounded transition-colors',
                    isActive
                      ? 'hover:bg-white/20 text-white'
                      : 'hover:bg-slate-200 text-text-muted',
                    !sec.enabled && (isActive ? 'text-white/50' : 'text-slate-300')
                  )}
                >
                  {sec.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
