# Folio — The No-Code Portfolio Studio

A polished, fully functional web application that allows developers, designers, students, freelancers, and creative professionals to create, customize, preview, and publish responsive portfolios without writing code.

Built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS** using a bespoke **Slate + Indigo** design system.

---

## ✨ Features

- **End-to-End Workflow**: Choose a template $\rightarrow$ Add & organize content $\rightarrow$ Customize typography & accents $\rightarrow$ Preview across devices $\rightarrow$ Publish to a public URL.
- **Three Curated Responsive Templates**:
  - **Minimal**: Typography-led, generous whitespace, understated simplicity for writers, minimalists, and strategists.
  - **Studio**: Image-led layout with large project cards and contemporary aesthetic for visual designers and art directors.
  - **Developer**: Structured projects with tech stacks, repository and live demo links, categorized skills, and verifiable experience.
- **Template Switching with Zero Data Loss**: Seamlessly switch between Minimal, Studio, and Developer without losing any content.
- **Studio Editor**:
  - Live preview inside simulated device viewports (Desktop, Tablet, Mobile).
  - Undo & Redo with keyboard shortcuts (`Cmd+Z` / `Cmd+Shift+Z`).
  - Section reordering (with keyboard accessibility) and show/hide visibility toggles.
  - Section editors: Profile, About, Projects, Work Experience, Education, Skills, Social Links, Direct Contact (`mailto:`), and Resume (PDF upload / external link).
  - Image uploader with file validation (PNG, JPG, WebP, SVG, PDF up to 5MB).
  - Debounced autosave with real-time saving status indicators (`Saving...`, `Saved`, `Failed`).
- **Publishing & Draft Separation**:
  - Continuous editing updates private draft data only.
  - The live published portfolio (`/p/[slug]`) only updates when the user explicitly clicks **Publish Updates**.
  - One-click unpublish to revert private access.
  - Custom public URL slugs with real-time format and uniqueness validation.
- **Multi-Tenant Privacy**:
  - Strict ownership checks on every read and write operation.
  - Demo user switcher (Alex Chen, Sarah Jenkins, Marcus Vance) showing isolated tenant spaces.
- **Slate + Indigo Design System**:
  - Strict matching tokens (`#F8FAFC` background, `#FFFFFF` surfaces, `#4F46E5` primary indigo, `#0F172A` slate text).
  - Accessible focus states, 12–16px radii, restrained shadows, and reduced-motion support.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.17+ or v20+)
- [npm](https://www.npmjs.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/samarthgudoorkar-max/Folio.git
cd Folio

# Install dependencies
npm install

# Build the project
npm run build

# Start production server
npm start
```

For development with hot reloading:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Verification & Automated Tests

Folio includes an automated end-to-end test suite verifying all 13 core scenarios:

```bash
npm run verify
```

Scenarios verified:
1. Landing page copy & navigation
2. Template gallery rendering
3. Multi-user session management
4. Portfolio creation from templates
5. Real-time slug validation & availability
6. Private draft protection (404 on un-published routes)
7. Autosave and content persistence
8. Public portfolio snapshot publishing
9. Draft separation (unpublished edits do not leak to public site)
10. Multi-tenant privacy & access control
11. Portfolio duplication
12. Unpublishing
13. Deletion & cleanup

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Storage**: Durable local JSON database (`.data/`) with offline sync fallback
- **File Uploads**: Server-side validation with local asset serving (`/uploads/`)

---

## 📄 License

MIT
