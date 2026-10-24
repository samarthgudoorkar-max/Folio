import React from 'react';
import { PortfolioContent } from '@/lib/types';
import { ACCENT_PALETTES, FONT_PAIRINGS, sanitizeUrl } from '@/lib/utils';
import { ExternalLink, Github, Mail, MapPin, ArrowUpRight, FileText, Calendar } from 'lucide-react';

interface TemplateProps {
  content: PortfolioContent;
  isPublic?: boolean;
}

export function MinimalTemplate({ content }: TemplateProps) {
  const { profile, about, projects, experience, education, skills, socials, contact, resume, sectionsOrder, design } = content;
  const accent = ACCENT_PALETTES[design.accentColor] || ACCENT_PALETTES.indigo;
  const font = FONT_PAIRINGS[design.fontPairing] || FONT_PAIRINGS.editorial;
  const isCompact = design.spacing === 'compact';

  const isSectionEnabled = (type: string) => {
    const meta = sectionsOrder.find(s => s.type === type);
    return meta ? meta.enabled : true;
  };

  const imgRadiusClass = {
    rounded: 'rounded-2xl',
    square: 'rounded-none',
    soft: 'rounded-lg',
    circle: 'rounded-full',
  }[design.imageStyle];

  return (
    <div className={`w-full min-h-screen bg-[#FDFDFD] text-slate-800 ${font.bodyClass} selection:bg-indigo-100 selection:text-indigo-900`}>
      <div className={`max-w-3xl mx-auto px-6 ${isCompact ? 'py-12' : 'py-20'} space-y-16 sm:space-y-24`}>
        
        {/* Profile / Hero Section */}
        {isSectionEnabled('profile') && (
          <header className="space-y-6 pt-4 border-b border-slate-100 pb-12">
            <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <h1 className={`text-3xl sm:text-4xl lg:text-5xl text-slate-900 font-semibold tracking-tight ${font.headingClass}`}>
                  {profile.name}
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 font-medium">
                  {profile.role}
                </p>
                {profile.location && (
                  <p className="flex items-center gap-1.5 text-xs text-slate-400 font-normal">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{profile.location}</span>
                  </p>
                )}
              </div>
              {profile.avatarUrl && (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className={`w-24 h-24 sm:w-28 sm:h-28 object-cover border border-slate-200 shadow-xs ${imgRadiusClass}`}
                />
              )}
            </div>

            {profile.headline && (
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl font-normal">
                {profile.headline}
              </p>
            )}

            {/* Quick Actions / Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${accent.className}`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Get in Touch</span>
                </a>
              )}
              {resume.url && isSectionEnabled('resume') && (
                <a
                  href={sanitizeUrl(resume.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>{resume.filename || 'View Resume'}</span>
                </a>
              )}
            </div>
          </header>
        )}

        {/* About Section */}
        {isSectionEnabled('about') && (about.content || about.highlightText) && (
          <section className="space-y-4">
            <h2 className={`text-xs font-bold uppercase tracking-widest text-slate-400 ${font.headingClass}`}>
              {about.title || 'About'}
            </h2>
            {about.content && (
              <div className="text-slate-700 text-base leading-relaxed whitespace-pre-line space-y-4">
                {about.content}
              </div>
            )}
            {about.highlightText && (
              <div className={`p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 text-sm text-slate-700 font-medium italic border-l-4 border-l-${accent.hex}`}>
                {about.highlightText}
              </div>
            )}
          </section>
        )}

        {/* Projects Section */}
        {isSectionEnabled('projects') && projects.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className={`text-xs font-bold uppercase tracking-widest text-slate-400 ${font.headingClass}`}>
                Selected Work
              </h2>
              <span className="text-xs text-slate-400">{projects.length} Projects</span>
            </div>

            <div className="space-y-12">
              {projects.map((proj) => (
                <article key={proj.id} className="group space-y-3 pb-8 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className={`text-xl font-semibold text-slate-900 group-hover:${accent.textLight} transition-colors flex items-center gap-1.5 ${font.headingClass}`}>
                      <span>{proj.title}</span>
                      {proj.liveLink && (
                        <a
                          href={sanitizeUrl(proj.liveLink)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visit ${proj.title}`}
                          className="opacity-70 hover:opacity-100 inline-block text-slate-500 hover:text-slate-900 transition-opacity"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </h3>
                    {proj.role && (
                      <span className="text-xs font-medium text-slate-500">{proj.role}</span>
                    )}
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {proj.summary}
                  </p>

                  {/* Project Image if available */}
                  {proj.images && proj.images[0] && (
                    <div className="overflow-hidden border border-slate-200 bg-slate-50 my-3">
                      <img
                        src={proj.images[0]}
                        alt={proj.title}
                        className={`w-full h-56 sm:h-72 object-cover transition-transform duration-300 group-hover:scale-[1.01] ${imgRadiusClass}`}
                      />
                    </div>
                  )}

                  {/* Tech stack & external links */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 text-xs font-medium">
                      {proj.liveLink && (
                        <a
                          href={sanitizeUrl(proj.liveLink)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 underline underline-offset-4"
                        >
                          Live Site
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {proj.repoLink && (
                        <a
                          href={sanitizeUrl(proj.repoLink)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"
                        >
                          <Github className="w-3 h-3" />
                          Source
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {isSectionEnabled('experience') && experience.length > 0 && (
          <section className="space-y-6">
            <h2 className={`text-xs font-bold uppercase tracking-widest text-slate-400 ${font.headingClass}`}>
              Experience
            </h2>
            <div className="divide-y divide-slate-100">
              {experience.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <span className="font-semibold text-slate-900 text-base">{item.role}</span>
                    <span className="text-xs text-slate-400 font-mono">
                      {item.startDate} — {item.isCurrent ? 'Present' : item.endDate}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-slate-600">{item.organization}</div>
                  {item.description && (
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {isSectionEnabled('education') && education.length > 0 && (
          <section className="space-y-6">
            <h2 className={`text-xs font-bold uppercase tracking-widest text-slate-400 ${font.headingClass}`}>
              Education
            </h2>
            <div className="divide-y divide-slate-100">
              {education.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <span className="font-semibold text-slate-900 text-base">{item.institution}</span>
                    <span className="text-xs text-slate-400 font-mono">
                      {item.startDate} — {item.endDate}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 font-medium">
                    {item.degree} {item.fieldOfStudy ? `in ${item.fieldOfStudy}` : ''}
                  </div>
                  {item.description && (
                    <p className="text-xs text-slate-500 leading-relaxed pt-1">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {isSectionEnabled('skills') && skills.length > 0 && (
          <section className="space-y-6">
            <h2 className={`text-xs font-bold uppercase tracking-widest text-slate-400 ${font.headingClass}`}>
              Skills & Focus
            </h2>
            <div className="space-y-4">
              {skills.map((category) => (
                <div key={category.id} className="space-y-2">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {category.category}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100/90 rounded-lg"
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

        {/* Contact & Social Footer */}
        {isSectionEnabled('contact') && (
          <footer className="pt-12 border-t border-slate-200/80 space-y-8">
            <div className="space-y-3">
              <h2 className={`text-2xl font-semibold text-slate-900 ${font.headingClass}`}>
                Let’s Connect
              </h2>
              {contact.note && (
                <p className="text-sm text-slate-600 max-w-lg leading-relaxed">{contact.note}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium ${accent.className}`}
                >
                  <Mail className="w-4 h-4" />
                  <span>{contact.email}</span>
                </a>
              )}
              {contact.bookingUrl && (
                <a
                  href={sanitizeUrl(contact.bookingUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>Schedule Call</span>
                </a>
              )}
            </div>

            {/* Social Links */}
            {isSectionEnabled('socials') && socials.length > 0 && (
              <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100 text-xs font-medium text-slate-500">
                {socials.map((link) => (
                  <a
                    key={link.id}
                    href={sanitizeUrl(link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-slate-900 transition-colors capitalize underline underline-offset-4"
                  >
                    {link.label || link.platform}
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
