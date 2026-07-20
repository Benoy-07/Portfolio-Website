/* Portfolio · interactions
   - Year stamp
   - Mobile menu toggle
   - Theme toggle (persisted)
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
    const words = ['Web Developer', 'Frontend Engineer', 'PHP Backend Dev', 'UI Designer'];
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