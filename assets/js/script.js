/* Portfolio · interactions
   - Year stamp
   - Mobile menu toggle
   - Theme toggle (persisted)
   - Animated particle-network background canvas
   - Scroll progress bar
   - Scroll-spy active nav link
   - Smooth-scroll for in-page anchors
   - Reveal-on-scroll animations
   - Card pointer-tracking glow
   - Hero typed text + counters
   - Contact form: client validation + GitHub Pages fallback notice
*/

(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* Year ------------------------------------------------------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Animated particle-network background ---------------------- */
  (function initBgCanvas() {
    const canvas = $('#bgCanvas');
    if (!canvas || canvas.__bgInited) return;
    canvas.__bgInited = true;

    let ctx;
    try { ctx = canvas.getContext('2d', { alpha: true }); }
    catch (e) { return; }                  // no canvas support → just skip
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles = [];
    let mouse = { x: -9999, y: -9999, active: false };
    let rafId = null;

    const ACCENT = ['124,92,255', '0,212,255', '255,92,138'];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.style.width  = w + 'px';
      canvas.style.height = h + 'px';
      canvas.width  = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const seed = () => {
      const density = Math.min(110, Math.floor((w * h) / 18000));
      particles = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.6,
        color: ACCENT[(Math.random() * ACCENT.length) | 0],
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const tick = (t) => {
      ctx.clearRect(0, 0, w, h);

      // Update + draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // gentle wrap
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // mouse repulsion
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 16000) {
            const d = Math.sqrt(d2) || 1;
            const force = (1 - d / 130) * 0.6;
            p.x += (dx / d) * force;
            p.y += (dy / d) * force;
          }
        }

        // soft pulsing glow
        const pulse = 0.6 + Math.sin(t * 0.001 + p.phase) * 0.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (0.9 + pulse * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${0.55 * pulse})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(${p.color}, 0.9)`;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Connecting lines
      const LINK = 130;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            const alpha = (1 - d / LINK) * 0.35;
            ctx.strokeStyle = `rgba(${a.color}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Cursor highlight ring
      if (mouse.active) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 140);
        grad.addColorStop(0, 'rgba(124, 92, 255, 0.25)');
        grad.addColorStop(1, 'rgba(124, 92, 255, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(mouse.x - 140, mouse.y - 140, 280, 280);
      }

      rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (reduce) return;          // honor reduced-motion preference
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
    }, { passive: true });
    window.addEventListener('mouseout', () => { mouse.active = false; });

    // Pause when tab is hidden to save battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(rafId);
      else start();
    });

    resize();
    start();
  })();

  /* Theme toggle ---------------------------------------------- */
  const themeBtn = $('#themeToggle');
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  if (stored) root.setAttribute('data-theme', stored);

  const syncIcon = () => {
    if (!themeBtn) return;
    const cur = root.getAttribute('data-theme') === 'light' ? 'sun' : 'moon';
    themeBtn.innerHTML = cur === 'sun'
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
  };
  syncIcon();

  themeBtn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    syncIcon();
  });

  /* Mobile menu ----------------------------------------------- */
  const menuBtn = $('#menuToggle');
  const navLinks = $('#navLinks');
  menuBtn?.addEventListener('click', () => {
    menuBtn.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu when a link is clicked
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menuBtn?.classList.remove('open');
      navLinks?.classList.remove('open');
    });
  });

  /* Scroll progress ------------------------------------------- */
  const progress = $('#scrollProgress');
  const onScroll = () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    if (progress) progress.style.width = scrolled + '%';
  };

  /* Scroll spy ------------------------------------------------ */
  const sections = ['home', 'services', 'projects', 'education', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const linkMap = new Map($$('.nav-link').map(a => [a.dataset.target, a]));

  const spy = () => {
    const pos = window.scrollY + 120;
    let activeId = sections[0]?.id;
    for (const s of sections) {
      if (s.offsetTop <= pos) activeId = s.id;
    }
    linkMap.forEach((a, id) => a.classList.toggle('active', id === activeId));
  };

  window.addEventListener('scroll', () => {
    onScroll();
    spy();
  }, { passive: true });
  onScroll(); spy();

  /* Smooth scroll (anchors that aren't already handled by CSS) */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* Reveal on scroll ------------------------------------------ */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => io.observe(el));

  /* Card pointer-glow ----------------------------------------- */
  $$('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* Typed text in hero ---------------------------------------- */
  const typedEl = $('#typed');
  if (typedEl) {
    const words = ['Flutter Developer', 'Full-Stack Web Developer', 'Frontend Engineer', 'Backend Engineer'];
    let wi = 0, ci = 0, deleting = false;

    const tick = () => {
      const w = words[wi];
      typedEl.textContent = w.slice(0, ci);

      if (!deleting) {
        ci++;
        if (ci > w.length) { deleting = true; setTimeout(tick, 1400); return; }
        setTimeout(tick, 90);
      } else {
        ci--;
        if (ci < 0) { deleting = false; wi = (wi + 1) % words.length; setTimeout(tick, 200); return; }
        setTimeout(tick, 45);
      }
    };
    setTimeout(tick, 600);
  }

  /* Stat counters --------------------------------------------- */
  const counters = $$('[data-count]');
  const cIO = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseInt(el.dataset.count, 10) || 0;
      let n = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const t = setInterval(() => {
        n += step;
        if (n >= target) { n = target; clearInterval(t); }
        el.textContent = n + '+';
      }, 30);
      cIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => cIO.observe(c));

  /* Contact form --------------------------------------------- */
  const form = $('#contactForm');
  const status = $('#formStatus');

  const setStatus = (msg, ok = true) => {
    if (!status) return;
    status.textContent = msg;
    status.classList.toggle('ok', ok);
    status.classList.toggle('err', !ok);
  };

  form?.addEventListener('submit', async (e) => {
    // If we are on a static host (GitHub Pages), `php/contact.php` will 404.
    // Detect by checking the current host — *.github.io falls back to a friendly notice.
    const isGitHubPages = location.host.endsWith('github.io');
    if (isGitHubPages) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      setStatus(
        'Static demo mode: this build is on GitHub Pages, so the PHP endpoint is disabled. ' +
        'Run locally with PHP (e.g. `php -S localhost:8000`) to enable the contact handler.',
        true
      );
      return;
    }

    // On a real PHP host: let the form submit. If the response is JSON we update inline.
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const data = new FormData(form);
    try {
      const res = await fetch(form.action, { method: 'POST', body: data });
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        const json = await res.json();
        setStatus(json.message || (json.ok ? 'Sent!' : 'Error'), !!json.ok);
        if (json.ok) form.reset();
      } else {
        // Server returned HTML (redirect / success page)
        setStatus('Message sent successfully!', true);
        form.reset();
      }
    } catch (err) {
      setStatus('Network error. Please try again later.', false);
    }
  });
})();