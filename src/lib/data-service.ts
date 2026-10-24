import { Portfolio, PortfolioContent, PortfolioSettings, TemplateId, User } from './types';
import { DEMO_USERS, getInitialTemplateContent } from './mock-data';
import { generateSlug, validateSlug } from './utils';

const STORAGE_KEY = 'folio_portfolios_v1';
const USER_KEY = 'folio_active_user_v1';

function getInitialPortfolios(): Portfolio[] {
  const now = new Date();
  return [
    {
      id: 'folio_alex_chen_studio',
      userId: 'user_alex_chen',
      settings: {
        title: 'Alex Chen — Creative Direction & Art Direction',
        slug: 'alex-chen',
        seoTitle: 'Alex Chen — Art Director & Visual Designer',
        seoDescription: 'Selected works in brand universe design, spatial computing interfaces, and editorial design.',
      },
      status: 'published',
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 20).toISOString(),
      updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 12).toISOString(),
      publishedAt: new Date(now.getTime() - 1000 * 60 * 60 * 12).toISOString(),
      publishedSlug: 'alex-chen',
      draftData: getInitialTemplateContent('studio'),
      publishedData: getInitialTemplateContent('studio'),
    },
    {
      id: 'folio_sarah_jenkins_dev',
      userId: 'user_sarah_jenkins',
      settings: {
        title: 'Sarah Jenkins — Staff Systems Engineer',
        slug: 'sarah-jenkins',
        seoTitle: 'Sarah Jenkins — Systems & Distributed Infrastructure',
        seoDescription: 'Staff software engineer building distributed systems, Kubernetes tools, and high-performance microservices.',
      },
      status: 'published',
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 14).toISOString(),
      updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 4).toISOString(),
      publishedAt: new Date(now.getTime() - 1000 * 60 * 60 * 4).toISOString(),
      publishedSlug: 'sarah-jenkins',
      draftData: getInitialTemplateContent('developer'),
      publishedData: getInitialTemplateContent('developer'),
    },
    {
      id: 'folio_marcus_vance_min',
      userId: 'user_marcus_vance',
      settings: {
        title: 'Marcus Vance — Design Systems',
        slug: 'marcus-vance',
        seoTitle: 'Marcus Vance — Product Design & Systems',
        seoDescription: 'Design systems lead and typography specialist crafting deliberate software interfaces.',
      },
      status: 'published',
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
      publishedAt: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
      publishedSlug: 'marcus-vance',
      draftData: getInitialTemplateContent('minimal'),
      publishedData: getInitialTemplateContent('minimal'),
    }
  ];
}

export function getActiveUser(): User {
  if (typeof window === 'undefined') return DEMO_USERS[0];
  try {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      const found = DEMO_USERS.find(u => u.id === stored);
      if (found) return found;
    }
  } catch {}
  return DEMO_USERS[0];
}

export function setActiveUser(userId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USER_KEY, userId);
  } catch {}
}

export function getAllPortfolios(): Portfolio[] {
  if (typeof window === 'undefined') return getInitialPortfolios();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialPortfolios();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    const initial = getInitialPortfolios();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  } catch {
    return getInitialPortfolios();
  }
}

export function saveAllPortfolios(portfolios: Portfolio[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolios));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

export function getUserPortfolios(userId: string): Portfolio[] {
  const all = getAllPortfolios();
  return all
    .filter(p => p.userId === userId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getPortfolioById(id: string, userId?: string): Portfolio | null {
  const all = getAllPortfolios();
  const portfolio = all.find(p => p.id === id);
  if (!portfolio) return null;
  if (userId && portfolio.userId !== userId) {
    return null; // Ownership protection
  }
  return portfolio;
}

export function getPublishedPortfolioBySlug(slug: string): { portfolio: Portfolio; content: PortfolioContent } | null {
  const all = getAllPortfolios();
  const cleanSlug = slug.toLowerCase().trim();
  const portfolio = all.find(
    p => p.status === 'published' && (p.publishedSlug === cleanSlug || p.settings.slug === cleanSlug)
  );

  if (!portfolio || !portfolio.publishedData) return null;

  return {
    portfolio,
    content: portfolio.publishedData,
  };
}

export function isSlugAvailable(slug: string, currentPortfolioId?: string): boolean {
  const validation = validateSlug(slug);
  if (!validation.valid) return false;

  const all = getAllPortfolios();
  const clean = slug.toLowerCase().trim();

  return !all.some(p => {
    if (currentPortfolioId && p.id === currentPortfolioId) return false;
    return p.settings.slug.toLowerCase() === clean || (p.publishedSlug && p.publishedSlug.toLowerCase() === clean);
  });
}

export function createPortfolio(
  userId: string,
  templateId: TemplateId = 'minimal',
  customTitle?: string
): Portfolio {
  const all = getAllPortfolios();
  const initialContent = getInitialTemplateContent(templateId);
  const user = DEMO_USERS.find(u => u.id === userId) || DEMO_USERS[0];

  const title = customTitle || `${user.name}’s Portfolio`;
  let baseSlug = generateSlug(title || `portfolio-${templateId}`);
  if (!baseSlug) baseSlug = `portfolio-${templateId}`;

  let candidateSlug = baseSlug;
  let counter = 1;
  while (!isSlugAvailable(candidateSlug)) {
    candidateSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  const now = new Date().toISOString();
  const newPortfolio: Portfolio = {
    id: `folio_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId,
    settings: {
      title,
      slug: candidateSlug,
      seoTitle: `${title} | Built with Folio`,
      seoDescription: initialContent.profile.headline || 'Professional portfolio',
    },
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    publishedAt: null,
    publishedSlug: null,
    draftData: initialContent,
    publishedData: null,
  };

  all.unshift(newPortfolio);
  saveAllPortfolios(all);
  return newPortfolio;
}

export function updatePortfolioDraft(
  id: string,
  userId: string,
  draftData: PortfolioContent,
  settingsUpdate?: Partial<PortfolioSettings>
): Portfolio | null {
  const all = getAllPortfolios();
  const idx = all.findIndex(p => p.id === id);
  if (idx === -1) return null;

  if (all[idx].userId !== userId) {
    throw new Error('Forbidden: You do not own this portfolio');
  }

  const current = all[idx];
  const now = new Date().toISOString();

  let updatedSettings = { ...current.settings };
  if (settingsUpdate) {
    if (settingsUpdate.slug && settingsUpdate.slug !== current.settings.slug) {
      if (!isSlugAvailable(settingsUpdate.slug, id)) {
        throw new Error('Slug is already in use by another portfolio');
      }
    }
    updatedSettings = { ...updatedSettings, ...settingsUpdate };
  }

  current.draftData = draftData;
  current.settings = updatedSettings;
  current.updatedAt = now;

  all[idx] = current;
  saveAllPortfolios(all);
  return current;
}

export function publishPortfolio(id: string, userId: string): Portfolio | null {
  const all = getAllPortfolios();
  const idx = all.findIndex(p => p.id === id);
  if (idx === -1) return null;

  if (all[idx].userId !== userId) {
    throw new Error('Forbidden: You do not own this portfolio');
  }

  const current = all[idx];
  const now = new Date().toISOString();

  current.publishedData = JSON.parse(JSON.stringify(current.draftData));
  current.status = 'published';
  current.publishedAt = now;
  current.publishedSlug = current.settings.slug;
  current.updatedAt = now;

  all[idx] = current;
  saveAllPortfolios(all);
  return current;
}

export function unpublishPortfolio(id: string, userId: string): Portfolio | null {
  const all = getAllPortfolios();
  const idx = all.findIndex(p => p.id === id);
  if (idx === -1) return null;

  if (all[idx].userId !== userId) {
    throw new Error('Forbidden: You do not own this portfolio');
  }

  const current = all[idx];
  current.status = 'draft';
  current.publishedSlug = null;
  current.updatedAt = new Date().toISOString();

  all[idx] = current;
  saveAllPortfolios(all);
  return current;
}

export function duplicatePortfolio(id: string, userId: string): Portfolio | null {
  const all = getAllPortfolios();
  const original = all.find(p => p.id === id);
  if (!original) return null;

  if (original.userId !== userId) {
    throw new Error('Forbidden: You do not own this portfolio');
  }

  const now = new Date().toISOString();
  const copyTitle = `${original.settings.title} (Copy)`;
  let baseSlug = generateSlug(copyTitle);
  let candidateSlug = baseSlug;
  let counter = 1;
  while (!isSlugAvailable(candidateSlug)) {
    candidateSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  const duplicate: Portfolio = {
    id: `folio_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId,
    settings: {
      ...original.settings,
      title: copyTitle,
      slug: candidateSlug,
    },
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    publishedAt: null,
    publishedSlug: null,
    draftData: JSON.parse(JSON.stringify(original.draftData)),
    publishedData: null,
  };

  all.unshift(duplicate);
  saveAllPortfolios(all);
  return duplicate;
}

export function deletePortfolio(id: string, userId: string): boolean {
  const all = getAllPortfolios();
  const idx = all.findIndex(p => p.id === id);
  if (idx === -1) return false;

  if (all[idx].userId !== userId) {
    throw new Error('Forbidden: You do not own this portfolio');
  }

  all.splice(idx, 1);
  saveAllPortfolios(all);
  return true;
}

export async function uploadFileClient(file: File): Promise<{ url: string; filename: string }> {
  // Validate size
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size exceeds 5MB limit.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve({
          url: e.target.result as string,
          filename: file.name,
        });
      } else {
        reject(new Error('Failed to read file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}
