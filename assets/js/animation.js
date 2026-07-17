/* =========================================================
   animation.js
   Hero canvas blueprint animation + typed rotating role text
   ========================================================= */

(function () {
  'use strict';

  /* ---------- Blueprint canvas animation ---------- */
  function initBlueprintCanvas() {
    const canvas = document.getElementById('blueprint-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, dpr;
    let nodes = [];
    const NODE_COUNT = 46;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initNodes() {
      nodes = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.6 + 1
        });
      }
    }

    function step() {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(47,215,196,0.18)';
      ctx.fillStyle = 'rgba(255,122,26,0.65)';
      ctx.lineWidth = 1;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.globalAlpha = 1 - dist / 140;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(step);
    }

    resize();
    initNodes();
    step();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resize(); initNodes(); }, 200);
    });
  }

  /* ---------- Typed rotating role text ---------- */
  function initTypedRoles(roles) {
    const el = document.getElementById('role-typed');
    if (!el || !roles || !roles.length) return;
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1600);
          return;
        }
        setTimeout(tick, 65);
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(tick, 400);
          return;
        }
        setTimeout(tick, 35);
      }
    }
    tick();
  }

  /* ---------- Animated counters ---------- */
  function animateCounter(el, target, duration) {
    const start = 0;
    const startTime = performance.now();
    function frame(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(start + (target - start) * eased);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(frame);
      else el.textContent = target;
    }
    requestAnimationFrame(frame);
  }

  function initCounterObserver() {
    const metricEls = document.querySelectorAll('.metric-value[data-target]');
    if (!metricEls.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10) || 0;
          animateCounter(el, target, 1400);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    metricEls.forEach((el) => observer.observe(el));
  }

  /* ---------- Skill bar fill on scroll ---------- */
  function initSkillBarObserver() {
    const bars = document.querySelectorAll('.skill-bar-fill[data-level], .progress-fill[data-level]');
    if (!bars.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const level = el.getAttribute('data-level');
          requestAnimationFrame(() => { el.style.width = level + '%'; });
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach((el) => observer.observe(el));
  }

  window.PortfolioAnim = {
    initBlueprintCanvas,
    initTypedRoles,
    initCounterObserver,
    initSkillBarObserver
  };
})();
