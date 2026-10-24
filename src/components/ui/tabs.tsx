import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'underline' | 'pill';
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'pill',
}: TabsProps) {
  if (variant === 'underline') {
    return (
      <div className={cn('flex border-b border-border space-x-6', className)}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center gap-2 py-3 px-1 text-sm font-medium border-b-2 transition-colors -mb-px',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-strong'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-text-secondary">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('flex p-1 bg-slate-100/80 rounded-xl space-x-1', className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-1.5 px-3 text-xs sm:text-sm font-medium rounded-lg transition-all',
              isActive
                ? 'bg-surface text-text-primary shadow-subtle'
                : 'text-text-secondary hover:text-text-primary hover:bg-slate-200/50'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] text-text-secondary">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
