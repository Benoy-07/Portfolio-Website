# Md Hajek Anjum Benoy · Portfolio

A modern, responsive personal portfolio built with **HTML, CSS, JavaScript** and a small **PHP** backend for the contact form.

## ✨ Features
- Hero, Services, Projects, Education and Contact sections — all reachable from the navbar
- Animated canvas particle-network + animated gradient mesh background
- Dark / light theme toggle (persisted)
- Smooth-scroll, scroll-spy nav, reveal-on-scroll animations, pointer-tracking card glow
- Mobile-friendly responsive layout
- PHP contact handler with validation, honeypot anti-spam and optional message logging
- GitHub Pages ready (PHP gracefully falls back to a friendly notice on static hosts)

## 👤 About
- **Name:** Md Hajek Anjum Benoy
- **Focus:** Flutter app development (frontend & backend) · Full-stack web development
- **Currently:** B.Sc. Engineering in CSE at Patuakhali Science and Technology University (CGPA 3.41)
- **Higher Secondary:** Govt Ananda Moha College, Mymensingh — GPA 5.00 / 5.00 (Science, 2021)

## 🔗 Links
- **Facebook:** https://www.facebook.com/share/1EVM1RdZfU/
- **GitHub:** https://github.com/benoy-07
- **LinkedIn:** https://www.linkedin.com/in/md-hajek-anjum-benoy-76b601281

## 📁 Structure
```
.
├── index.html              # Main page (all sections)
├── 404.html                # Friendly 404 for GitHub Pages
├── .nojekyll               # Skip Jekyll processing on GitHub Pages
├── assets/
│   ├── css/style.css
│   ├── js/script.js
│   └── img/
│       ├── avatar.jpg      # Your profile photo
│       ├── favicon.jpg
│       ├── varsity.jpg     # PSTU campus / logo (Education timeline)
│       └── college.jpg     # Ananda Moha College (Education timeline)
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
- Edit **name, bio, links, project details** in `index.html`.
- Swap `assets/img/avatar.jpg`, `varsity.jpg` and `college.jpg` with your own images (keep the same filenames or update the `<img src>` and CSS references).
- Update **destination email** in `php/contact.php` (`$config['to']`).
- Tweak colors in the `:root` CSS variables inside `assets/css/style.css`.

## 📜 License
MIT — use it freely for your own portfolio.