# Tanmay Bharat Mude — Mechanical Design Engineer Portfolio 2026

A premium, recruiter-focused, ATS-friendly portfolio for a Mechanical Design Engineer, rebuilt from the original GitHub Pages template into a modular, JSON-driven static website.

**Live source repo target:** `https://tanmay08082002.github.io/Tanmay08082008.github.io/`

---

## 1. Project Goal

Transform the original personal portfolio template into a modern, engineering-focused, JSON-driven site while preserving:
- All original images (profile photo, contact illustration)
- Company logos (Sakar Robotics, Endurance Technologies, MIT Academy of Engineering)
- All 8 original certifications (images + metadata)
- Contact information (email, phone, LinkedIn, GitHub, Instagram)
- GitHub Pages compatibility (pure static HTML/CSS/JS, no build step, no server)
- Full responsiveness and accessibility

---

## 2. Folder Structure

```
index.html
robots.txt
sitemap.xml
assets/
  css/
    style.css          -> core design system + layout
    animations.css      -> keyframes & motion
    responsive.css       -> breakpoints
  js/
    main.js             -> nav, header, resume tabs, form validation, back-to-top
    animation.js         -> canvas blueprint animation, typed roles, counters, skill bars
    portfolio.js          -> fetches JSON data and renders every dynamic section
  images/
    profile/            -> hero + contact photos
    companies/            -> employer / institution logos
    certificates/          -> certification images
    icons/                -> site logo / favicon
  data/
    profile.json          -> name, bio, contact, metrics
    experience.json        -> work/internship history
    projects.json          -> engineering case studies
    skills.json            -> categorized skill set with proficiency levels
    certifications.json     -> certificates with issuing org + verification links
    education.json          -> education timeline
    testimonials.json        -> reserved for future use (currently empty array)
  pdf/
    resume.pdf            -> downloadable resume (placeholder — replace with final PDF)
```

This mirrors the proposed architecture: **content lives in JSON, not HTML** — updating `assets/data/*.json` updates the live site with no HTML edits required.

---

## 3. Functional Entry Points (single-page app, in-page anchors)

| Path / Anchor | Section | Notes |
|---|---|---|
| `/` or `/index.html` | Hero | Landing / intro, typed rotating role text, resume + contact CTAs |
| `#about` | About | Bio, role chips, education timeline |
| `#skills` | Skills | Filterable skill cards by category (CAD, Manufacturing, Automation, Programming, Analysis) |
| `#experience` | Experience | Company timeline with logos, responsibilities, achievements, tech tags |
| `#projects` | Projects | Filterable + searchable engineering case-study cards → modal detail view |
| `#certifications` | Certifications | Certificate gallery → lightbox modal with verification links |
| `#resume` | Resume | Tabbed education/skills summary + PDF download |
| `#contact` | Contact | Validated contact form (mailto fallback) + direct contact details |

No query parameters are required; all data is loaded client-side from the JSON files above via `fetch()`.

---

## 4. Data Models

All records are plain JSON arrays/objects consumed by `assets/js/portfolio.js`.

- **profile.json** — `name, title, roles[], tagline, summary, location, email, phone, linkedin, github, instagram, resumePdf, profileImage, contactImage, metrics[]`
- **experience.json** — `id, company, logo, position, location, startDate, endDate, duration, type, responsibilities[], achievements[], technologies[]`
- **projects.json** — `id, name, category, tags[], status, completionDate, duration, shortDescription, problem, objectives[], engineeringChallenge, solution, cad, manufacturing, results[], skills[], software[], images[], gallery[], downloads{pdf,model3d,video}, links{repo,demo}`
- **skills.json** — `category, skill, level (0-100), icon (Font Awesome class)`
- **certifications.json** — `id, title, provider, date, credentialId, verificationUrl, image`
- **education.json** — `id, degree, institution, logo, duration, type`
- **testimonials.json** — reserved; empty array, ready for future entries `{name, company, position, message, image}`

**Storage:** static JSON files in the git repo (no backend/database). This keeps the site 100% GitHub-Pages compatible.

---

## 5. Completed Features

- Premium dark engineering visual theme (steel grey / dark blue / orange accent, blueprint-grid hero background, animated canvas node network)
- Rotating typed role headline, animated engineering metrics counters
- Fully data-driven About, Skills, Experience, Projects, Certifications, and Resume sections
- Project **filtering** (by category) and **live search** (name/description/tags)
- Project case-study **modal** (problem → objectives → challenge → solution → results → downloads)
- Certification **lightbox** with issuing org, date, credential ID, and verification link
- Animated skill proficiency bars + category tabs
- Responsive resume tabs (Education/Internships vs. Skills) with PDF download button (wired to `assets/pdf/resume.pdf`)
- Accessible, validated contact form (client-side validation + honeypot spam field + `mailto:` fallback since this is a static site with no backend)
- Mobile hamburger navigation, scroll-spy active nav highlighting, back-to-top button
- SEO: meta description/keywords, Open Graph, Twitter Card, canonical URL, JSON-LD `Person` structured data, `robots.txt`, `sitemap.xml`
- Accessibility: skip-link, semantic landmarks, alt text on all images, ARIA roles/labels on nav, tabs, and modals, keyboard-dismissible modals (Esc)
- All original assets preserved and reorganized: profile photo, 3 company logos (sourced to match real employers/institution), all 8 certification images, contact illustration, site logo

## 6. Features Not Yet Implemented

- **3D model viewer** (GLB / STEP / eDrawings embed) — `assets/models/` folder reserved but no models supplied yet
- **Project media galleries** (exploded views, BOM, drawings, videos) — `projects.json` has the fields (`images[]`, `gallery[]`, `downloads.video`) but no engineering project photos/videos were available in the source template to migrate
- **Testimonials section** UI (data file exists and is empty; no UI section added since there is no content yet)
- **Blog / research paper library**
- **Standalone Portfolio Management Tool (CMS/Electron app)** described in the PRD — this is a separate desktop/local-web application outside the scope of a static website and was not built here
- **Backend spam protection / server email delivery** — the contact form uses a client-side `mailto:` fallback since this is a static site with no server; true server-side email sending would require a backend or third-party form service (e.g., Formspree) which was not requested/configured
- Final production resume PDF — a placeholder `resume.pdf` was generated; replace with your finished resume file at `assets/pdf/resume.pdf`
- Multiple resume variants (Design / Manufacturing / R&D)
- Real Lighthouse audit run (structure follows best practices, but a live Lighthouse pass should be run post-deploy to confirm 95+/95+/100/100 targets)

## 7. Recommended Next Steps

1. Add real project photography/CAD screenshots to `assets/images/projects/` and reference them in `projects.json` (`images[]`) for richer case studies.
2. Add exploded-view renders, BOM screenshots, and drawing PDFs per project under `assets/pdf/project_reports/`.
3. Replace `assets/pdf/resume.pdf` with your finalized resume PDF.
4. If a 3D viewer is desired, add `.glb` files to `assets/models/glb/` and integrate a lightweight viewer (e.g., `<model-viewer>` web component from Google) — purely client-side and GitHub Pages compatible.
5. If real-time form delivery is required, connect the form to a CORS-enabled, auth-free form backend (e.g., Formspree/Web3Forms) — currently it uses a `mailto:` fallback since no backend is available in a static site.
6. Populate `testimonials.json` and add a testimonials UI section once quotes/references are collected.
7. Run a live Lighthouse audit after publishing and compress/convert certificate JPGs to WebP if further performance gains are needed (several certificate images are large source JPGs).

---

## 8. Technical Stack

- HTML5 (semantic markup)
- CSS3 (custom design system; no framework dependency)
- Vanilla JavaScript (ES6+, no build step)
- Font Awesome 6 (icons, via CDN)
- AOS — Animate On Scroll (via CDN)
- Google Fonts: Space Grotesk, Inter, JetBrains Mono
- 100% static — deployable as-is to GitHub Pages or any static host

## 9. Public URLs

- Production (GitHub Pages): `https://tanmay08082002.github.io/Tanmay08082008.github.io/`
- No API endpoints — all data is served from static JSON files in `assets/data/`.

## 10. Contact Information (preserved from original)

- Email: princemude2002@gmail.com
- Phone: +91 70570 02169
- LinkedIn: https://www.linkedin.com/in/tanmay-mude-077715208/
- GitHub: https://github.com/Tanmay08082002
- Instagram: https://www.instagram.com/mude._tanmay/
