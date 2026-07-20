# Portfolio Website

A modern, responsive personal portfolio built with **HTML, CSS, JavaScript** and a small **PHP** backend for the contact form.

## ✨ Features
- Hero, Services, Projects, Education and Contact sections — all reachable from the navbar
- Animated gradient UI with dark / light theme toggle (persisted)
- Smooth-scroll, scroll-spy nav, reveal-on-scroll animations, pointer-tracking card glow
- Mobile-friendly responsive layout
- PHP contact handler with validation, honeypot anti-spam and optional message logging
- GitHub Pages ready (PHP gracefully falls back to a friendly notice on static hosts)

## 📁 Structure
```
.
├── index.html              # Main page (all sections)
├── 404.html                # Friendly 404 for GitHub Pages
├── .nojekyll               # Skip Jekyll processing on GitHub Pages
├── assets/
│   ├── css/style.css
│   ├── js/script.js
│   └── img/                # avatar.svg, favicon.svg
└── php/
    └── contact.php         # POST handler for the contact form
```

## 🚀 Run locally (PHP enabled)
```bash
php -S localhost:8000
# then open http://localhost:8000
```

## 🌐 Deploy to GitHub Pages
1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, pick **Deploy from a branch** → `main` → `/ (root)` → **Save**.
4. Your site will be live at `https://<username>.github.io/Portfolio-Website/`.

> The contact form posts to `php/contact.php`. On GitHub Pages the JS detects the static host and shows an inline notice instead. To enable real email delivery, host the `php/` folder on any PHP-capable host (e.g. a small VPS, Render, Railway, InfinityFree) and update `form.action` in `index.html` to point at that endpoint.

## 🛠 Customize
- Edit **name, bio, links** in `index.html`.
- Swap `assets/img/avatar.svg` for your own photo (use the same filename or update the `<img src>`).
- Update **destination email** in `php/contact.php` (`$config['to']`).
- Tweak colors in the `:root` CSS variables inside `assets/css/style.css`.

## 📜 License
MIT — use it freely for your own portfolio.