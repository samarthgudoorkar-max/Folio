import fs from 'fs';
import path from 'path';
import { Portfolio, PortfolioContent, PortfolioSettings, TemplateId } from './types';
import { DEFAULT_SECTIONS, DEMO_USERS, getInitialTemplateContent } from './mock-data';
import { generateSlug, validateSlug } from './utils';

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'portfolios.json');

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function initializeDefaultData(): Portfolio[] {
  const initialPortfolios: Portfolio[] = [
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
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      publishedSlug: 'sarah-jenkins',
      draftData: getInitialTemplateContent('developer'),
      publishedData: getInitialTemplateContent('developer'),
    },
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
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      publishedSlug: 'alex-chen',
      draftData: getInitialTemplateContent('studio'),
      publishedData: getInitialTemplateContent('studio'),
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
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      publishedSlug: 'marcus-vance',
      draftData: getInitialTemplateContent('minimal'),
      publishedData: getInitialTemplateContent('minimal'),
    }
  ];

  return initialPortfolios;
}

function readAllPortfolios(): Portfolio[] {
  ensureDataDirectory();
  if (!fs.existsSync(DATA_FILE)) {
    const defaults = initializeDefaultData();
    saveAllPortfolios(defaults);
    return defaults;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return initializeDefaultData();
  } catch (err) {
    console.error('Error reading portfolios database:', err);
    return initializeDefaultData();
  }
}

function saveAllPortfolios(portfolios: Portfolio[]): void {
  ensureDataDirectory();
  fs.writeFileSync(DATA_FILE, JSON.stringify(portfolios, null, 2), 'utf-8');
}

export function getUserPortfolios(userId: string): Portfolio[] {
  const all = readAllPortfolios();
  return all
    .filter(p => p.userId === userId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getPortfolioById(id: string, userId?: string): Portfolio | null {
  const all = readAllPortfolios();
  const portfolio = all.find(p => p.id === id);
  if (!portfolio) return null;
  if (userId && portfolio.userId !== userId) {
    return null; // Ownership protection
  }
  return portfolio;
}

export function getPublishedPortfolioBySlug(slug: string): { portfolio: Portfolio; content: PortfolioContent } | null {
  const all = readAllPortfolios();
  const cleanSlug = slug.toLowerCase().trim();
  
  // Find published portfolio matching publishedSlug
  const portfolio = all.find(
    p => p.status === 'published' && (p.publishedSlug === cleanSlug || p.settings.slug === cleanSlug)
  );

  if (!portfolio || !portfolio.publishedData) {
    return null;
  }

  return {
    portfolio,
    content: portfolio.publishedData,
  };
}

export function isSlugAvailable(slug: string, currentPortfolioId?: string): boolean {
  const validation = validateSlug(slug);
  if (!validation.valid) return false;

  const all = readAllPortfolios();
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
  const all = readAllPortfolios();
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

  all.push(newPortfolio);
  saveAllPortfolios(all);
  return newPortfolio;
}

export function updatePortfolioDraft(
  id: string,
  userId: string,
  draftData: PortfolioContent,
  settingsUpdate?: Partial<PortfolioSettings>
): Portfolio | null {
  const all = readAllPortfolios();
  const idx = all.findIndex(p => p.id === id);
  if (idx === -1) return null;

  // Ownership verification
  if (all[idx].userId !== userId) {
    throw new Error('Forbidden: You do not own this portfolio');
  }

  const current = all[idx];
  const now = new Date().toISOString();

  // If slug is changing, validate uniqueness
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
  const all = readAllPortfolios();
  const idx = all.findIndex(p => p.id === id);
  if (idx === -1) return null;

  if (all[idx].userId !== userId) {
    throw new Error('Forbidden: You do not own this portfolio');
  }

  const current = all[idx];
  const now = new Date().toISOString();

  // Snapshot draft content into published content
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
  const all = readAllPortfolios();
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
  const all = readAllPortfolios();
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

  all.push(duplicate);
  saveAllPortfolios(all);
  return duplicate;
}

export function deletePortfolio(id: string, userId: string): boolean {
  const all = readAllPortfolios();
  const idx = all.findIndex(p => p.id === id);
  if (idx === -1) return false;

  if (all[idx].userId !== userId) {
    throw new Error('Forbidden: You do not own this portfolio');
  }

  all.splice(idx, 1);
  saveAllPortfolios(all);
  return true;
}
