import React from 'react';
import { PortfolioContent } from '@/lib/types';
import { ACCENT_PALETTES, FONT_PAIRINGS, sanitizeUrl } from '@/lib/utils';
import { ExternalLink, Mail, MapPin, ArrowUpRight, FileText, Sparkles } from 'lucide-react';

interface TemplateProps {
  content: PortfolioContent;
  isPublic?: boolean;
}

export function StudioTemplate({ content }: TemplateProps) {
  const { profile, about, projects, experience, education, skills, socials, contact, resume, sectionsOrder, design } = content;
  const accent = ACCENT_PALETTES[design.accentColor] || ACCENT_PALETTES.indigo;
  const font = FONT_PAIRINGS[design.fontPairing] || FONT_PAIRINGS.grotesk;
  const isCompact = design.spacing === 'compact';

  const isSectionEnabled = (type: string) => {
    const meta = sectionsOrder.find(s => s.type === type);
    return meta ? meta.enabled : true;
  };

  const imgRadiusClass = {
    rounded: 'rounded-2xl',
    square: 'rounded-none',
    soft: 'rounded-xl',
    circle: 'rounded-full',
  }[design.imageStyle];

  const layoutCols = design.projectLayout === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2';

  return (
    <div className={`w-full min-h-screen bg-[#FAFAFA] text-slate-900 ${font.bodyClass} selection:bg-slate-900 selection:text-white`}>
      <div className={`max-w-6xl mx-auto px-6 sm:px-8 ${isCompact ? 'py-12' : 'py-20'} space-y-20 sm:space-y-28`}>
        
        {/* Studio Hero Header */}
        {isSectionEnabled('profile') && (
          <header className="space-y-8 pt-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-slate-200">
              <div className="space-y-4 max-w-3xl">
                <div className="flex items-center gap-3">
                  {profile.avatarUrl && (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className={`w-16 h-16 sm:w-20 sm:h-20 object-cover border-2 border-white shadow-md ${imgRadiusClass}`}
                    />
                  )}
                  <div>
                    <span className="text-xs font-mono font-medium uppercase tracking-widest text-slate-500">
                      Studio Portfolio
                    </span>
                    <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 ${font.headingClass}`}>
                      {profile.name}
                    </h1>
                  </div>
                </div>

                <p className="text-xl sm:text-2xl text-slate-700 font-normal leading-snug">
                  {profile.role}
                </p>

                {profile.headline && (
                  <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                    {profile.headline}
                  </p>
                )}
              </div>

              {/* Status / Location Box */}
              <div className="space-y-4 md:text-right shrink-0">
                {profile.location && (
                  <div className="flex md:justify-end items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {about.availability && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-xs font-medium text-slate-800 border border-slate-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{about.availability}</span>
                  </div>
                )}
                <div className="flex md:justify-end gap-3 pt-1">
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all hover:opacity-95 ${accent.className}`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Start a Project</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Selected Works (Visual Card Grid) */}
        {isSectionEnabled('projects') && projects.length > 0 && (
          <section className="space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Featured Work</span>
                <h2 className={`text-2xl sm:text-3xl font-bold text-slate-900 ${font.headingClass}`}>
                  Selected Case Studies
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">({projects.length} Works)</span>
            </div>

            <div className={`grid ${layoutCols} gap-8 sm:gap-10`}>
              {projects.map((proj, idx) => (
                <article
                  key={proj.id}
                  className="group flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
                >
                  <div className="space-y-4">
                    {/* Visual Card Image */}
                    <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                      {proj.images && proj.images[0] ? (
                        <img
                          src={proj.images[0]}
                          alt={proj.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-mono">
                          Image preview
                        </div>
                      )}
                      {proj.featured && (
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-xs text-slate-900 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-xs">
                            <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                            Featured
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 sm:p-7 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className={`text-xl font-bold text-slate-900 group-hover:${accent.textLight} transition-colors ${font.headingClass}`}>
                          {proj.title}
                        </h3>
                        {proj.liveLink && (
                          <a
                            href={sanitizeUrl(proj.liveLink)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open ${proj.title}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
                          >
                            <ArrowUpRight className="w-5 h-5" />
                          </a>
                        )}
                      </div>

                      <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {proj.summary}
                      </p>

                      {proj.role && (
                        <p className="text-xs font-mono font-medium text-slate-400">
                          Role: <span className="text-slate-700">{proj.role}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Footer with tags */}
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 mt-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies.slice(0, 4).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {proj.liveLink && (
                      <a
                        href={sanitizeUrl(proj.liveLink)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-slate-900 hover:underline inline-flex items-center gap-1"
                      >
                        Explore <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Studio About & Statement */}
        {isSectionEnabled('about') && (about.content || about.highlightText) && (
          <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 space-y-8">
            <div className="flex flex-col md:flex-row gap-8 lg:gap-16 justify-between items-start">
              <div className="space-y-4 max-w-xl">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  {about.title || 'Creative Philosophy'}
                </span>
                {about.highlightText && (
                  <h3 className={`text-2xl sm:text-3xl font-semibold leading-snug tracking-tight ${font.headingClass}`}>
                    “{about.highlightText}”
                  </h3>
                )}
                {about.content && (
                  <div className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4 font-light">
                    {about.content}
                  </div>
                )}
              </div>

              {/* Stats / Highlights */}
              <div className="w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-12 space-y-6">
                {about.yearsOfExperience && (
                  <div>
                    <div className="text-3xl sm:text-4xl font-bold font-mono text-white">
                      {about.yearsOfExperience}
                    </div>
                    <div className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-medium">
                      Industry Experience
                    </div>
                  </div>
                )}
                {resume.url && isSectionEnabled('resume') && (
                  <div>
                    <a
                      href={sanitizeUrl(resume.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{resume.filename || 'Download Dossier / CV'}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Studio Experience & Skills Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
          {/* Experience */}
          {isSectionEnabled('experience') && experience.length > 0 && (
            <div className={`${isSectionEnabled('skills') ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-6`}>
              <div className="border-b border-slate-200 pb-3">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Timeline</span>
                <h3 className={`text-xl font-bold text-slate-900 ${font.headingClass}`}>
                  Select Experience
                </h3>
              </div>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1.5 pb-6 border-b border-slate-100 last:border-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-bold text-slate-900 text-base">{exp.role}</h4>
                      <span className="text-xs font-mono text-slate-400">
                        {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-600">{exp.organization}</p>
                    {exp.description && (
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pt-1">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills & Disciplines */}
          {isSectionEnabled('skills') && skills.length > 0 && (
            <div className={`${isSectionEnabled('experience') ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-6`}>
              <div className="border-b border-slate-200 pb-3">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Capabilities</span>
                <h3 className={`text-xl font-bold text-slate-900 ${font.headingClass}`}>
                  Disciplines & Tools
                </h3>
              </div>
              <div className="space-y-6">
                {skills.map((cat) => (
                  <div key={cat.id} className="space-y-2.5">
                    <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {cat.category}
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contact Footer */}
        {isSectionEnabled('contact') && (
          <footer className="border-t-2 border-slate-900 pt-12 pb-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Get In Touch</span>
                <h2 className={`text-3xl sm:text-4xl font-bold text-slate-950 ${font.headingClass}`}>
                  Let’s collaborate on something extraordinary.
                </h2>
                {contact.note && (
                  <p className="text-sm text-slate-600 max-w-lg pt-1">{contact.note}</p>
                )}
              </div>

              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider shadow-sm transition-all hover:opacity-95 ${accent.className}`}
                >
                  <Mail className="w-4 h-4" />
                  <span>{contact.email}</span>
                </a>
              )}
            </div>

            {/* Social Grid */}
            {isSectionEnabled('socials') && socials.length > 0 && (
              <div className="flex flex-wrap gap-6 pt-6 border-t border-slate-200 text-xs font-mono font-medium text-slate-500">
                {socials.map((link) => (
                  <a
                    key={link.id}
                    href={sanitizeUrl(link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-slate-950 transition-colors uppercase"
                  >
                    [ {link.label || link.platform} ]
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
