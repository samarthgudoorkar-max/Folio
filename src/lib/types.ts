export type TemplateId = 'minimal' | 'studio' | 'developer';

export type AccentColor = 
  | 'indigo' 
  | 'blue' 
  | 'emerald' 
  | 'violet' 
  | 'rose' 
  | 'amber' 
  | 'slate';

export type FontPairing = 'sans' | 'editorial' | 'mono' | 'grotesk';
export type SpacingDensity = 'comfortable' | 'compact';
export type ImageStyle = 'rounded' | 'square' | 'soft' | 'circle';
export type ProjectLayout = 'grid' | 'list' | 'minimal';

export interface ProjectItem {
  id: string;
  title: string;
  summary: string;
  images: string[];
  technologies: string[];
  role?: string;
  liveLink?: string;
  repoLink?: string;
  featured?: boolean;
}

export interface ExperienceItem {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
}

export interface SocialLink {
  id: string;
  platform: 'github' | 'linkedin' | 'twitter' | 'dribbble' | 'figma' | 'youtube' | 'website' | 'email';
  url: string;
  label?: string;
}

export interface SectionMeta {
  id: string;
  type: 'profile' | 'about' | 'projects' | 'experience' | 'education' | 'skills' | 'socials' | 'contact' | 'resume';
  title: string;
  enabled: boolean;
}

export interface PortfolioDesign {
  template: TemplateId;
  accentColor: AccentColor;
  fontPairing: FontPairing;
  spacing: SpacingDensity;
  imageStyle: ImageStyle;
  projectLayout: ProjectLayout;
}

export interface PortfolioProfile {
  name: string;
  role: string;
  headline: string;
  bio: string;
  location: string;
  avatarUrl?: string;
}

export interface PortfolioAbout {
  title: string;
  content: string;
  highlightText?: string;
  yearsOfExperience?: string;
  availability?: string;
}

export interface PortfolioContact {
  email: string;
  phone?: string;
  location?: string;
  bookingUrl?: string;
  note?: string;
}

export interface PortfolioResume {
  url?: string;
  filename?: string;
  lastUpdated?: string;
}

export interface PortfolioContent {
  profile: PortfolioProfile;
  about: PortfolioAbout;
  projects: ProjectItem[];
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  socials: SocialLink[];
  contact: PortfolioContact;
  resume: PortfolioResume;
  sectionsOrder: SectionMeta[];
  design: PortfolioDesign;
}

export interface PortfolioSettings {
  title: string;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  socialImage?: string;
}

export interface Portfolio {
  id: string;
  userId: string;
  settings: PortfolioSettings;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  publishedSlug: string | null;
  draftData: PortfolioContent;
  publishedData: PortfolioContent | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
}
