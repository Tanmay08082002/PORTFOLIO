/* =========================================================
   main.js
   Global site behavior: nav, header scroll, resume tabs,
   contact form validation, back-to-top, AOS init
   ========================================================= */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {

    /* ---------- AOS init ---------- */
    if (window.AOS) {
      window.AOS.init({ duration: 600, once: true, offset: 60 });
    }

    /* ---------- Blueprint canvas ---------- */
    if (window.PortfolioAnim) window.PortfolioAnim.initBlueprintCanvas();

    /* ---------- Footer year ---------- */
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Mobile nav toggle ---------- */
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('main-nav');
    if (hamburger && mainNav) {
      hamburger.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('open');
        hamburger.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
      });
      mainNav.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
          mainNav.classList.remove('open');
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    /* ---------- Active nav link on scroll ---------- */
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    function onScrollSpy() {
      let current = '';
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          current = section.id;
        }
      });
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });
    }
    window.addEventListener('scroll', onScrollSpy, { passive: true });
    onScrollSpy();

    /* ---------- Header background on scroll + back-to-top ---------- */
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
      if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    /* ---------- Resume tabs ---------- */
    const resumeTabs = document.querySelectorAll('.resume-tab');
    resumeTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        resumeTabs.forEach((t) => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        document.querySelectorAll('.resume-panel').forEach((p) => { p.classList.remove('active'); p.hidden = true; });
        const targetPanel = document.getElementById('panel-' + tab.getAttribute('data-tab'));
        if (targetPanel) { targetPanel.classList.add('active'); targetPanel.hidden = false; }
      });
    });

    /* ---------- Contact form validation (client-side, mailto fallback) ---------- */
    const form = document.getElementById('contact-form');
    if (form) {
      const fields = {
        name: { el: document.getElementById('cf-name'), validate: (v) => v.trim().length >= 2, msg: 'Please enter your name (min 2 characters).' },
        email: { el: document.getElementById('cf-email'), validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: 'Please enter a valid email address.' },
        subject: { el: document.getElementById('cf-subject'), validate: (v) => v.trim().length >= 3, msg: 'Please enter a subject (min 3 characters).' },
        message: { el: document.getElementById('cf-message'), validate: (v) => v.trim().length >= 10, msg: 'Message should be at least 10 characters.' }
      };

      function showError(key, show) {
        const field = fields[key];
        const errEl = form.querySelector(`.error-msg[data-for="${field.el.id}"]`);
        field.el.classList.toggle('invalid', show);
        if (errEl) errEl.textContent = show ? field.msg : '';
      }

      Object.keys(fields).forEach((key) => {
        fields[key].el.addEventListener('blur', () => {
          const valid = fields[key].validate(fields[key].el.value);
          showError(key, !valid);
        });
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Honeypot spam check
        const honeypot = document.getElementById('cf-honeypot');
        if (honeypot && honeypot.value.trim() !== '') {
          return; // silently drop — likely a bot
        }

        let allValid = true;
        Object.keys(fields).forEach((key) => {
          const valid = fields[key].validate(fields[key].el.value);
          showError(key, !valid);
          if (!valid) allValid = false;
        });

        if (!allValid) return;

        const name = encodeURIComponent(document.getElementById('cf-name').value.trim());
        const phone = encodeURIComponent(document.getElementById('cf-phone').value.trim());
        const email = encodeURIComponent(document.getElementById('cf-email').value.trim());
        const subject = encodeURIComponent(document.getElementById('cf-subject').value.trim());
        const message = document.getElementById('cf-message').value.trim();

        const body = encodeURIComponent(
          `Name: ${decodeURIComponent(name)}\nPhone: ${decodeURIComponent(phone) || 'N/A'}\nEmail: ${decodeURIComponent(email)}\n\nMessage:\n${message}`
        );

        const mailto = `mailto:princemude2002@gmail.com?subject=${subject}&body=${body}`;
        window.location.href = mailto;

        const successEl = document.getElementById('form-success');
        if (successEl) successEl.hidden = false;
        form.reset();
      });
    }

  });
})();
