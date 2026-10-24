import React from 'react';
import { PortfolioContent } from '@/lib/types';
import { ACCENT_PALETTES, FONT_PAIRINGS, sanitizeUrl } from '@/lib/utils';
import { ExternalLink, Github, Mail, MapPin, Terminal, FileText, Code2, Layers, Cpu, CheckCircle2 } from 'lucide-react';

interface TemplateProps {
  content: PortfolioContent;
  isPublic?: boolean;
}

export function DeveloperTemplate({ content }: TemplateProps) {
  const { profile, about, projects, experience, education, skills, socials, contact, resume, sectionsOrder, design } = content;
  const accent = ACCENT_PALETTES[design.accentColor] || ACCENT_PALETTES.indigo;
  const font = FONT_PAIRINGS[design.fontPairing] || FONT_PAIRINGS.mono;
  const isCompact = design.spacing === 'compact';

  const isSectionEnabled = (type: string) => {
    const meta = sectionsOrder.find(s => s.type === type);
    return meta ? meta.enabled : true;
  };

  const imgRadiusClass = {
    rounded: 'rounded-xl',
    square: 'rounded-none',
    soft: 'rounded-md',
    circle: 'rounded-full',
  }[design.imageStyle];

  return (
    <div className={`w-full min-h-screen bg-[#F8FAFC] text-slate-800 ${font.bodyClass} selection:bg-indigo-500 selection:text-white`}>
      <div className={`max-w-5xl mx-auto px-6 ${isCompact ? 'py-10' : 'py-16'} space-y-16`}>
        
        {/* Terminal/Developer Header */}
        {isSectionEnabled('profile') && (
          <header className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col-reverse sm:flex-row sm:items-start justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-mono font-medium border border-slate-200">
                    <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                    <span>portfolio.init()</span>
                  </div>
                  {about.availability && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-mono border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {about.availability}
                    </span>
                  )}
                </div>

                <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight ${font.headingClass}`}>
                  {profile.name}
                </h1>
                <p className="text-base sm:text-lg font-medium text-indigo-600 font-mono">
                  {profile.role}
                </p>

                {profile.headline && (
                  <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                    {profile.headline}
                  </p>
                )}

                {profile.location && (
                  <p className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{profile.location}</span>
                  </p>
                )}
              </div>

              {profile.avatarUrl && (
                <div className="shrink-0">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className={`w-20 h-20 sm:w-24 sm:h-24 object-cover border-2 border-slate-200 shadow-xs ${imgRadiusClass}`}
                  />
                </div>
              )}
            </div>

            {/* Quick Action Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold shadow-xs ${accent.className}`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </a>
              )}
              {resume.url && isSectionEnabled('resume') && (
                <a
                  href={sanitizeUrl(resume.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>{resume.filename || 'Resume.pdf'}</span>
                </a>
              )}
              {socials.find(s => s.platform === 'github') && (
                <a
                  href={sanitizeUrl(socials.find(s => s.platform === 'github')?.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Profile</span>
                </a>
              )}
            </div>
          </header>
        )}

        {/* Technical Skills Grid */}
        {isSectionEnabled('skills') && skills.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <span>Technical Skills & Tooling</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {skills.map((category) => (
                <div
                  key={category.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs"
                >
                  <div className="text-xs font-mono font-semibold text-slate-700 pb-1 border-b border-slate-100">
                    // {category.category}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {category.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-flex items-center px-2.5 py-1 text-xs font-mono bg-slate-100 text-slate-800 rounded-md border border-slate-200/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Projects / Code Repos */}
        {isSectionEnabled('projects') && projects.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                <Code2 className="w-4 h-4 text-indigo-600" />
                <span>Featured Projects & Systems</span>
              </div>
              <span className="text-xs font-mono text-slate-400">Total: {projects.length}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <article
                  key={proj.id}
                  className="group flex flex-col justify-between bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-indigo-300 hover:shadow-sm transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className={`text-lg font-bold text-slate-900 group-hover:${accent.textLight} transition-colors ${font.headingClass}`}>
                        {proj.title}
                      </h3>
                      {proj.liveLink && (
                        <a
                          href={sanitizeUrl(proj.liveLink)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Live demo for ${proj.title}`}
                          className="text-slate-400 hover:text-slate-900 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {proj.summary}
                    </p>

                    {/* Screenshot if provided */}
                    {proj.images && proj.images[0] && (
                      <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 my-2">
                        <img
                          src={proj.images[0]}
                          alt={proj.title}
                          className="w-full h-44 object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 space-y-3">
                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-mono bg-indigo-50/70 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center justify-between text-xs font-mono pt-1">
                      {proj.role ? (
                        <span className="text-slate-400">{proj.role}</span>
                      ) : <span />}

                      <div className="flex items-center gap-3">
                        {proj.repoLink && (
                          <a
                            href={sanitizeUrl(proj.repoLink)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-950 font-medium"
                          >
                            <Github className="w-3.5 h-3.5" />
                            <span>Repository</span>
                          </a>
                        )}
                        {proj.liveLink && (
                          <a
                            href={sanitizeUrl(proj.liveLink)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold"
                          >
                            <span>Live Demo</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Experience & Career Timeline */}
        {isSectionEnabled('experience') && experience.length > 0 && (
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Professional History</span>
            </div>

            <div className="space-y-8">
              {experience.map((exp, idx) => (
                <div key={exp.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-indigo-600 before:rounded-full before:ring-4 before:ring-indigo-50 border-l border-slate-200 ml-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h4 className="font-bold text-slate-900 text-base">
                      {exp.role} <span className="text-indigo-600 font-normal">@ {exp.organization}</span>
                    </h4>
                    <span className="text-xs font-mono text-slate-400">
                      {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {isSectionEnabled('education') && education.length > 0 && (
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
              // Education & Credentials
            </div>
            <div className="space-y-4">
              {education.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{item.institution}</span>
                    <div className="text-xs text-slate-600 font-mono">
                      {item.degree} {item.fieldOfStudy ? `in ${item.fieldOfStudy}` : ''}
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {item.startDate} — {item.endDate}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* About Section */}
        {isSectionEnabled('about') && about.content && (
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
              // Bio & Systems Overview
            </div>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {about.content}
            </p>
          </section>
        )}

        {/* Developer Contact Footer */}
        {isSectionEnabled('contact') && (
          <footer className="bg-slate-900 text-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">// Connection endpoint</span>
                <h3 className="text-xl font-bold text-white">Let’s discuss architectures and projects.</h3>
                {contact.note && (
                  <p className="text-xs text-slate-400 max-w-md">{contact.note}</p>
                )}
              </div>

              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{contact.email}</span>
                </a>
              )}
            </div>

            {/* Socials */}
            {isSectionEnabled('socials') && socials.length > 0 && (
              <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-800 text-xs font-mono text-slate-400">
                {socials.map((link) => (
                  <a
                    key={link.id}
                    href={sanitizeUrl(link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    [{link.platform} &rarr;]
                  </a>
                ))}
              </div>
            )}
          </footer>
        )}

      </div>
    </div>
  );
}
