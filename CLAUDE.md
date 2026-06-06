# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Marketing site for **YNSGYM** — a 24/7 gym in Singapore. Built with **Eleventy (11ty)** SSG and **Decap CMS** (Git-based admin UI). Hosted on Netlify. Content is stored in `_data/*.json` files; admins edit via `/admin/`.

## Development

```bash
npm install
npx @11ty/eleventy --serve
# Site at http://localhost:8080
```

Build output goes to `_site/` (git-ignored). Never edit `_site/` directly. To build without serving: `npx @11ty/eleventy`.

There is no linting or test suite.

## Site Structure

| Path | Purpose |
|---|---|
| `index.njk` | Homepage |
| `gyms/index.html` | Gym locations |
| `membership/index.html` | Membership tiers |
| `personal-training/index.html` | PT session packs + pricing |
| `classes/index.html` | Class schedule/types |
| `testimonials/index.html` | Testimonials with carousel |
| `styles.css` | **Single global stylesheet** — all styles for every page |
| `js/main.js` | **Single JS file** — all interactivity for every page |
| `public/` | Images (JPEG/PNG); CMS uploads go to `public/uploads/` |
| `favicon/` | Favicon assets |
| `_includes/` | Shared layout partials (`base.njk`, `nav.njk`, `footer.njk`) |
| `_data/` | Content JSON files (CMS-editable, auto-exposed as template variables) |
| `admin/` | Decap CMS SPA (`index.html`) and collection config (`config.yml`) |

## Architecture

**Build**: Eleventy processes `.njk` and `.html` files as Nunjucks templates. Each marketing page declares `layout`, `pageTitle`, `bodyClass`, and `navCtaHref` in YAML front matter. `_includes/base.njk` is the shared marketing-site HTML shell — it handles `<head>`, nav, and footer. The `/admin/` CMS app is copied as a separate static page and does not use this layout. Do not duplicate shared marketing chrome in page files.

**Data**: Existing files in `_data/` are auto-exposed by filename (e.g. `_data/classes.json` → `{{ classes.classes }}`). CMS-managed structured content uses `{% for %}` loops. The homepage is currently hardcoded in `index.njk`; there is no `_data/home.json`.

**CSS**: One file (`styles.css`) with CSS custom properties in `:root`. Design tokens:
- Colors: `--color-bg`, `--color-surface`, `--color-surface-2`, `--color-accent` (`#ff3b3b` red)
- Fonts: `--font-head` (Syne), `--font-body` (DM Sans) — loaded via Google Fonts
- Spacing: `--space-xs` through `--space-3xl`
- Layout: `.l-wrap` centers content at max `1200px`; `.section` handles vertical rhythm

**JS** (`js/main.js`): Vanilla JS, IIFE-wrapped. Handles:
- Mobile touch-active class on interactive elements
- Contact form submit → WhatsApp deep link
- Mobile nav toggle (hamburger + overlay)
- Gallery image modal + custom scrollbar
- Testimonials carousel — driven by `[data-testimonial-carousel]`, `[data-carousel-viewport]`, `[data-carousel-prev/next/dots]` attributes

**WhatsApp number**: Stored in `_data/site.json` as `whatsappNumber`. Injected onto `<body data-whatsapp="...">` in `base.njk`. `main.js` reads it via `document.body.getAttribute("data-whatsapp")`. Do not hardcode it in JS.

**jsonSafe filter**: Custom Eleventy filter defined in `.eleventy.js`. Use it for any string value injected into inline `<script>` blocks to prevent XSS:
```njk
classData[{{ cls.key | jsonSafe | safe }}] = { ... };
```

**Contact forms** send to WhatsApp, not email.

## CMS

Admins edit content at `/admin/`. Changes commit to `_data/*.json` via Git Gateway → Netlify rebuilds → live in ~1–2 min.

Netlify Identity is loaded only by `/admin/`. Public marketing pages should not load `netlify-identity-widget.js` or create a `netlify-identity-widget` iframe.

Collections defined in `admin/config.yml`:
- **Site Settings** → `_data/site.json` (nav, WhatsApp, footer, contact topics)
- **Membership** → `_data/membership.json`
- **Personal Training** → `_data/pt.json`
- **Classes** → `_data/classes.json`
- **Testimonials** → `_data/testimonials.json`
- **Gyms** → `_data/gyms.json`
