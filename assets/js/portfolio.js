/* =========================================================
   portfolio.js
   Data loading + rendering for all JSON-driven sections
   ========================================================= */

(function () {
  'use strict';

  const DATA_PATHS = {
    profile: 'assets/data/profile.json',
    experience: 'assets/data/experience.json',
    projects: 'assets/data/projects.json',
    skills: 'assets/data/skills.json',
    certifications: 'assets/data/certifications.json',
    education: 'assets/data/education.json'
  };

  const state = {
    profile: null,
    experience: [],
    projects: [],
    skills: [],
    certifications: [],
    education: [],
    activeFilter: 'all',
    searchTerm: ''
  };

  async function fetchJSON(path) {
    try {
      const res = await fetch(path, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load ' + path);
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  function esc(str) {
    if (str === undefined || str === null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatMonthYear(str) {
    if (!str) return '';
    const parts = str.split('-');
    if (parts.length < 2) return str;
    const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  /* ---------- PROFILE / HERO / ABOUT / CONTACT ---------- */
  function renderProfile(profile) {
    if (!profile) return;

    const heroSummary = document.getElementById('hero-summary');
    if (heroSummary) heroSummary.textContent = profile.tagline || profile.summary || '';

    const aboutSummary = document.getElementById('about-summary');
    if (aboutSummary) aboutSummary.textContent = profile.summary || '';

    const roleChips = document.getElementById('role-chips');
    if (roleChips && profile.roles) {
      roleChips.innerHTML = profile.roles.map((r) => `<li>${esc(r)}</li>`).join('');
    }

    // Contact
    const contactName = document.getElementById('contact-name');
    if (contactName) contactName.textContent = profile.name || '';
    const contactPhone = document.getElementById('contact-phone');
    if (contactPhone) { contactPhone.textContent = profile.phone || ''; contactPhone.href = 'tel:' + (profile.phone || '').replace(/\s+/g, ''); }
    const contactEmail = document.getElementById('contact-email');
    if (contactEmail) { contactEmail.textContent = profile.email || ''; contactEmail.href = 'mailto:' + (profile.email || ''); }
    const contactLocation = document.getElementById('contact-location');
    if (contactLocation) contactLocation.textContent = profile.location || '';

    const heroGithub = document.getElementById('hero-github');
    if (heroGithub && profile.github) heroGithub.href = profile.github;
    const heroLinkedin = document.getElementById('hero-linkedin');
    if (heroLinkedin && profile.linkedin) heroLinkedin.href = profile.linkedin;

    // Resume download buttons
    ['download-resume-btn', 'download-resume-btn-2'].forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => {
          const link = document.createElement('a');
          link.href = profile.resumePdf || 'assets/pdf/resume.pdf';
          link.download = 'Tanmay-Bharat-Mude-Resume.pdf';
          document.body.appendChild(link);
          link.click();
          link.remove();
        });
      }
    });

    // Metrics
    const metricsGrid = document.getElementById('metrics-grid');
    if (metricsGrid && profile.metrics) {
      metricsGrid.innerHTML = profile.metrics.map((m) => `
        <div class="metric-item">
          <div class="metric-value" data-target="${esc(m.value)}">0<span class="metric-suffix">${esc(m.suffix || '')}</span></div>
          <div class="metric-label">${esc(m.label)}</div>
        </div>
      `).join('');
    }

    // Typed roles
    if (window.PortfolioAnim && profile.roles) {
      window.PortfolioAnim.initTypedRoles(profile.roles);
    }
  }

  /* ---------- EDUCATION TIMELINE (About + Resume) ---------- */
  function renderEducation(education) {
    const timeline = document.getElementById('edu-timeline');
    if (timeline) {
      timeline.innerHTML = education.map((e) => `
        <li>
          <span class="edu-degree">${esc(e.degree)}</span>
          <span class="edu-inst">${esc(e.institution)}</span>
          <span class="edu-duration">${esc(e.duration)}</span>
        </li>
      `).join('');
    }

    const resumeEdu = document.getElementById('resume-education');
    if (resumeEdu) {
      resumeEdu.innerHTML = education.map((e) => `
        <div class="resume-entry">
          <h5>${esc(e.degree)}</h5>
          <span class="meta">${esc(e.institution)} &middot; ${esc(e.duration)}</span>
        </div>
      `).join('');
    }
  }

  /* ---------- SKILLS ---------- */
  function renderSkills(skills) {
    const categories = ['All', ...Array.from(new Set(skills.map((s) => s.category)))];
    const tabsEl = document.getElementById('skill-tabs');
    const gridEl = document.getElementById('skills-grid');
    if (!tabsEl || !gridEl) return;

    let activeCategory = 'All';

    function renderGrid() {
      const filtered = activeCategory === 'All' ? skills : skills.filter((s) => s.category === activeCategory);
      gridEl.innerHTML = filtered.map((s) => `
        <div class="skill-card">
          <div class="skill-card-head">
            <div class="skill-icon"><i class="${esc(s.icon || 'fa-solid fa-gear')}"></i></div>
            <div class="skill-name">${esc(s.skill)}</div>
          </div>
          <div class="skill-bar-track"><div class="skill-bar-fill" data-level="${esc(s.level)}"></div></div>
          <div class="skill-level-label">${esc(s.level)}%</div>
        </div>
      `).join('');
      if (window.PortfolioAnim) window.PortfolioAnim.initSkillBarObserver();
    }

    tabsEl.innerHTML = categories.map((c, i) => `
      <button class="skill-tab-btn ${i === 0 ? 'active' : ''}" data-cat="${esc(c)}">${esc(c)}</button>
    `).join('');

    tabsEl.querySelectorAll('.skill-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        tabsEl.querySelectorAll('.skill-tab-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-cat');
        renderGrid();
      });
    });

    renderGrid();

    // Resume "Professional Skills" tab — split into two representative groups
    const resumeSkillBars = document.getElementById('resume-skill-bars');
    if (resumeSkillBars) {
      const half = Math.ceil(skills.length / 2);
      const groupA = skills.slice(0, half);
      const groupB = skills.slice(half);
      function buildGroup(title, list) {
        return `<div><h4>${esc(title)}</h4>${list.map((s) => `
          <div class="progress-block">
            <div class="progress-label"><span>${esc(s.skill)}</span><span>${esc(s.level)}%</span></div>
            <div class="progress-track"><div class="progress-fill" data-level="${esc(s.level)}"></div></div>
          </div>
        `).join('')}</div>`;
      }
      resumeSkillBars.innerHTML = buildGroup('Design & Manufacturing Skills', groupA) + buildGroup('Programming & Automation Skills', groupB);
    }
  }

  /* ---------- EXPERIENCE ---------- */
  function renderExperience(experience) {
    const timeline = document.getElementById('exp-timeline');
    if (!timeline) return;
    timeline.innerHTML = experience.map((e) => `
      <article class="exp-item" data-aos="fade-up">
        <div class="exp-card">
          <div class="exp-logo-wrap">
            ${e.logo ? `<img src="${esc(e.logo)}" alt="${esc(e.company)} logo" loading="lazy" />` : `<i class="fa-solid fa-building"></i>`}
          </div>
          <div class="exp-content">
            <div class="exp-header">
              <div>
                <div class="exp-role">${esc(e.position)}</div>
                <div class="exp-company">${esc(e.company)}</div>
              </div>
              <div class="exp-duration">${esc(e.duration)}</div>
            </div>
            <span class="exp-type-badge">${esc(e.type || '')}</span>
            <ul class="exp-list">${(e.responsibilities || []).map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
            ${(e.achievements && e.achievements.length) ? `
              <div class="exp-achievements">
                <h5><i class="fa-solid fa-trophy"></i> Key Achievements</h5>
                <ul class="exp-list">${e.achievements.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>
              </div>` : ''}
            ${(e.technologies && e.technologies.length) ? `
              <div class="exp-tech-tags">${e.technologies.map((t) => `<span>${esc(t)}</span>`).join('')}</div>` : ''}
          </div>
        </div>
      </article>
    `).join('');

    // Resume internships list (only "Internship" type)
    const resumeInternships = document.getElementById('resume-internships');
    if (resumeInternships) {
      const interns = experience.filter((e) => e.type && e.type.toLowerCase().includes('intern'));
      resumeInternships.innerHTML = interns.map((e) => `
        <div class="resume-entry">
          <h5>${esc(e.position)}</h5>
          <span class="meta">${esc(e.company)} &middot; ${esc(e.duration)}</span>
          <p>${esc((e.responsibilities || [])[0] || '')}</p>
        </div>
      `).join('') || '<p>No internships listed.</p>';
    }
  }

  /* ---------- PROJECTS ---------- */
  function projectCardTemplate(p) {
    const img = (p.images && p.images[0]) ? p.images[0] : '';
    return `
      <article class="project-card" data-id="${esc(p.id)}" data-category="${esc((p.category || '').toLowerCase())}" data-tags="${esc((p.tags || []).join(',').toLowerCase())}" data-name="${esc(p.name.toLowerCase())}" data-desc="${esc((p.shortDescription || '').toLowerCase())}" data-aos="fade-up">
        <div class="project-card-media">
          <span class="project-category-badge">${esc(p.category)}</span>
          ${img ? `<img src="${esc(img)}" alt="${esc(p.name)}" loading="lazy" />` : `<i class="fa-solid fa-diagram-project placeholder-icon"></i>`}
        </div>
        <div class="project-card-body">
          <h3 class="project-card-title">${esc(p.name)}</h3>
          <p class="project-card-desc">${esc(p.shortDescription)}</p>
          <div class="project-card-footer">
            <div class="project-tags-mini">${(p.tags || []).slice(0, 2).map((t) => `<span>${esc(t)}</span>`).join('')}</div>
            <button class="project-view-btn" data-open="${esc(p.id)}">View Case Study <i class="fa-solid fa-arrow-right"></i></button>
          </div>
        </div>
      </article>
    `;
  }

  function applyProjectFilters() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    const cards = grid.querySelectorAll('.project-card');
    let visibleCount = 0;
    cards.forEach((card) => {
      const category = card.getAttribute('data-category');
      const tags = card.getAttribute('data-tags');
      const name = card.getAttribute('data-name');
      const desc = card.getAttribute('data-desc');
      const matchesFilter = state.activeFilter === 'all' || category === state.activeFilter || tags.includes(state.activeFilter);
      const matchesSearch = !state.searchTerm || name.includes(state.searchTerm) || desc.includes(state.searchTerm) || tags.includes(state.searchTerm);
      const visible = matchesFilter && matchesSearch;
      card.style.display = visible ? '' : 'none';
      if (visible) visibleCount++;
    });
    const noResults = document.getElementById('no-project-results');
    if (noResults) noResults.hidden = visibleCount !== 0;
  }

  function renderProjects(projects) {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    grid.innerHTML = projects.map(projectCardTemplate).join('');

    grid.querySelectorAll('[data-open]').forEach((btn) => {
      btn.addEventListener('click', () => openProjectModal(btn.getAttribute('data-open')));
    });
    grid.querySelectorAll('.project-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('[data-open]')) return;
        openProjectModal(card.getAttribute('data-id'));
      });
    });

    // Filters
    const filterGroup = document.getElementById('project-filters');
    if (filterGroup) {
      filterGroup.querySelectorAll('.filter-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          filterGroup.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          state.activeFilter = btn.getAttribute('data-filter');
          applyProjectFilters();
        });
      });
    }

    // Search
    const searchInput = document.getElementById('project-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        state.searchTerm = searchInput.value.trim().toLowerCase();
        applyProjectFilters();
      });
    }
  }

  function openProjectModal(id) {
    const project = state.projects.find((p) => p.id === id);
    if (!project) return;
    const modal = document.getElementById('project-modal');
    const body = document.getElementById('project-modal-body');
    if (!modal || !body) return;

    const img = (project.images && project.images[0]) ? project.images[0] : '';

    body.innerHTML = `
      <div class="modal-project-inner">
        ${img ? `<img src="${esc(img)}" alt="${esc(project.name)}" class="modal-project-media" />` : ''}
        <h3 class="modal-project-title">${esc(project.name)}</h3>
        <div class="modal-project-tags">${(project.tags || []).map((t) => `<span>${esc(t)}</span>`).join('')}</div>

        <div class="modal-meta-row">
          <div class="modal-meta-item"><span class="label">Status</span><span class="value">${esc(project.status || '')}</span></div>
          <div class="modal-meta-item"><span class="label">Duration</span><span class="value">${esc(project.duration || '')}</span></div>
          <div class="modal-meta-item"><span class="label">Completed</span><span class="value">${esc(formatMonthYear(project.completionDate))}</span></div>
        </div>

        <div class="modal-section"><h4>Problem</h4><p>${esc(project.problem || '')}</p></div>
        <div class="modal-section"><h4>Objectives</h4><ul>${(project.objectives || []).map((o) => `<li>${esc(o)}</li>`).join('')}</ul></div>
        <div class="modal-section"><h4>Engineering Challenge</h4><p>${esc(project.engineeringChallenge || '')}</p></div>
        <div class="modal-section"><h4>Solution</h4><p>${esc(project.solution || '')}</p></div>
        ${project.cad ? `<div class="modal-section"><h4>CAD Approach</h4><p>${esc(project.cad)}</p></div>` : ''}
        ${project.manufacturing ? `<div class="modal-section"><h4>Manufacturing</h4><p>${esc(project.manufacturing)}</p></div>` : ''}
        <div class="modal-section"><h4>Results</h4><ul>${(project.results || []).map((r) => `<li>${esc(r)}</li>`).join('')}</ul></div>
        <div class="modal-section"><h4>Software Used</h4><p>${(project.software || []).join(', ')}</p></div>

        <div class="modal-download-row">
          ${project.downloads && project.downloads.pdf ? `<a class="btn btn-outline btn-sm" href="${esc(project.downloads.pdf)}" target="_blank" rel="noopener"><i class="fa-solid fa-file-pdf"></i> Report PDF</a>` : ''}
          ${project.downloads && project.downloads.model3d ? `<a class="btn btn-outline btn-sm" href="${esc(project.downloads.model3d)}" target="_blank" rel="noopener"><i class="fa-solid fa-cube"></i> 3D Model</a>` : ''}
          ${project.downloads && project.downloads.video ? `<a class="btn btn-outline btn-sm" href="${esc(project.downloads.video)}" target="_blank" rel="noopener"><i class="fa-solid fa-circle-play"></i> Video</a>` : ''}
          ${project.links && project.links.repo ? `<a class="btn btn-outline btn-sm" href="${esc(project.links.repo)}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> Repo</a>` : ''}
        </div>
      </div>
    `;

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  /* ---------- CERTIFICATIONS ---------- */
  function renderCertifications(certifications) {
    const grid = document.getElementById('cert-grid');
    if (!grid) return;
    grid.innerHTML = certifications.map((c) => `
      <div class="cert-card" data-id="${esc(c.id)}" data-aos="fade-up">
        <div class="cert-thumb"><img src="${esc(c.image)}" alt="${esc(c.title)} certificate" loading="lazy" /></div>
        <div class="cert-body">
          <h3 class="cert-title">${esc(c.title)}</h3>
          <div class="cert-provider">${esc(c.provider)}</div>
          <div class="cert-date">${esc(formatMonthYear(c.date.slice(0,7)))}${c.credentialId ? ' &middot; ID: ' + esc(c.credentialId) : ''}</div>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.cert-card').forEach((card) => {
      card.addEventListener('click', () => openCertModal(card.getAttribute('data-id')));
    });
  }

  function openCertModal(id) {
    const cert = state.certifications.find((c) => c.id === id);
    if (!cert) return;
    const modal = document.getElementById('cert-modal');
    const body = document.getElementById('cert-modal-body');
    if (!modal || !body) return;

    body.innerHTML = `
      <div class="modal-cert-inner">
        <img src="${esc(cert.image)}" alt="${esc(cert.title)} certificate" class="modal-cert-img" />
        <h3 class="modal-cert-title">${esc(cert.title)}</h3>
        <p class="modal-cert-meta">${esc(cert.provider)} &middot; ${esc(formatMonthYear(cert.date.slice(0,7)))}${cert.credentialId ? ' &middot; Credential ID: ' + esc(cert.credentialId) : ''}</p>
        ${cert.verificationUrl ? `<a class="btn btn-primary" href="${esc(cert.verificationUrl)}" target="_blank" rel="noopener"><i class="fa-solid fa-check-circle"></i> View / Verify Certificate</a>` : ''}
      </div>
    `;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  /* ---------- INIT ---------- */
  async function init() {
    const [profile, experience, projects, skills, certifications, education] = await Promise.all([
      fetchJSON(DATA_PATHS.profile),
      fetchJSON(DATA_PATHS.experience),
      fetchJSON(DATA_PATHS.projects),
      fetchJSON(DATA_PATHS.skills),
      fetchJSON(DATA_PATHS.certifications),
      fetchJSON(DATA_PATHS.education)
    ]);

    state.profile = profile || {};
    state.experience = experience || [];
    state.projects = projects || [];
    state.skills = skills || [];
    state.certifications = certifications || [];
    state.education = education || [];

    renderProfile(state.profile);
    renderEducation(state.education);
    renderSkills(state.skills);
    renderExperience(state.experience);
    renderProjects(state.projects);
    renderCertifications(state.certifications);

    if (window.PortfolioAnim) window.PortfolioAnim.initCounterObserver();

    // Modal close handlers
    const projectModal = document.getElementById('project-modal');
    const certModal = document.getElementById('cert-modal');
    document.getElementById('project-modal-close')?.addEventListener('click', () => closeModal(projectModal));
    document.getElementById('cert-modal-close')?.addEventListener('click', () => closeModal(certModal));
    [projectModal, certModal].forEach((modal) => {
      modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(modal); });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { closeModal(projectModal); closeModal(certModal); }
    });

    // Refresh AOS after dynamic content injection
    if (window.AOS) setTimeout(() => window.AOS.refreshHard(), 100);

    document.dispatchEvent(new CustomEvent('portfolio:ready'));
  }

  document.addEventListener('DOMContentLoaded', init);
})();
