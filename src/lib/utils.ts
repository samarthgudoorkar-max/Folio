import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AccentColor, FontPairing } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

const RESERVED_SLUGS = new Set([
  'admin', 'api', 'app', 'auth', 'dashboard', 'editor', 'explore', 'folio',
  'help', 'home', 'login', 'new', 'p', 'portfolio', 'portfolios', 'privacy',
  'settings', 'signin', 'signout', 'signup', 'templates', 'terms', 'user'
]);

export function validateSlug(slug: string): { valid: boolean; error?: string } {
  if (!slug || slug.trim().length === 0) {
    return { valid: false, error: 'Slug cannot be empty' };
  }
  const clean = slug.trim().toLowerCase();
  if (clean.length < 3) {
    return { valid: false, error: 'Slug must be at least 3 characters long' };
  }
  if (clean.length > 48) {
    return { valid: false, error: 'Slug cannot exceed 48 characters' };
  }
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(clean)) {
    return { valid: false, error: 'Slug can only contain lowercase letters, numbers, and single hyphens' };
  }
  if (RESERVED_SLUGS.has(clean)) {
    return { valid: false, error: `"${clean}" is a reserved system path` };
  }
  return { valid: true };
}

export function sanitizeUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function formatDateRelative(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 45) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  } catch {
    return 'Recently';
  }
}

export const ACCENT_PALETTES: Record<AccentColor, {
  name: string;
  hex: string;
  className: string;
  bgLight: string;
  borderLight: string;
  textLight: string;
  badgeBg: string;
  badgeText: string;
}> = {
  indigo: {
    name: 'Indigo',
    hex: '#4F46E5',
    className: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    bgLight: 'bg-indigo-50',
    borderLight: 'border-indigo-200',
    textLight: 'text-indigo-600',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
  },
  blue: {
    name: 'Slate Blue',
    hex: '#2563EB',
    className: 'bg-blue-600 hover:bg-blue-700 text-white',
    bgLight: 'bg-blue-50',
    borderLight: 'border-blue-200',
    textLight: 'text-blue-600',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
  },
  emerald: {
    name: 'Emerald',
    hex: '#059669',
    className: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-200',
    textLight: 'text-emerald-600',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
  },
  violet: {
    name: 'Violet',
    hex: '#7C3AED',
    className: 'bg-violet-600 hover:bg-violet-700 text-white',
    bgLight: 'bg-violet-50',
    borderLight: 'border-violet-200',
    textLight: 'text-violet-600',
    badgeBg: 'bg-violet-50',
    badgeText: 'text-violet-700',
  },
  rose: {
    name: 'Rose',
    hex: '#E11D48',
    className: 'bg-rose-600 hover:bg-rose-700 text-white',
    bgLight: 'bg-rose-50',
    borderLight: 'border-rose-200',
    textLight: 'text-rose-600',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
  },
  amber: {
    name: 'Amber',
    hex: '#D97706',
    className: 'bg-amber-600 hover:bg-amber-700 text-white',
    bgLight: 'bg-amber-50',
    borderLight: 'border-amber-200',
    textLight: 'text-amber-600',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
  },
  slate: {
    name: 'Monochrome',
    hex: '#0F172A',
    className: 'bg-slate-900 hover:bg-black text-white',
    bgLight: 'bg-slate-100',
    borderLight: 'border-slate-300',
    textLight: 'text-slate-900',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-900',
  },
};

export const FONT_PAIRINGS: Record<FontPairing, {
  name: string;
  headingClass: string;
  bodyClass: string;
  description: string;
}> = {
  sans: {
    name: 'Modern Sans',
    headingClass: 'font-sans tracking-tight font-semibold',
    bodyClass: 'font-sans',
    description: 'Clean, neutral, and highly legible across all screens.',
  },
  editorial: {
    name: 'Editorial Serif',
    headingClass: 'font-serif tracking-tight font-medium',
    bodyClass: 'font-sans',
    description: 'Literary, classic, and dignified with serif titles.',
  },
  mono: {
    name: 'Technical Mono',
    headingClass: 'font-mono font-medium tracking-tight',
    bodyClass: 'font-sans',
    description: 'Structured, purposeful, and ideal for code and engineering.',
  },
  grotesk: {
    name: 'Bold Grotesk',
    headingClass: 'font-sans font-extrabold tracking-tight',
    bodyClass: 'font-sans font-normal',
    description: 'Expressive, punchy, and confident contemporary styling.',
  },
};
