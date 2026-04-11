# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML/CSS/JS website for **YNSGYM** — a 24/7 gym in Singapore. No build step, no framework, no package manager. Files are deployed directly to Netlify (drag-and-drop or git-connected auto-deploy on push to `main`).

## Development

Preview locally with any static server — e.g.:
```bash
python3 -m http.server 8080
# or
npx serve .
```

There is no linting, test suite, or build process.

## Site Structure

| Path | Purpose |
|---|---|
| `index.html` | Homepage |
| `gyms/index.html` | Gym locations |
| `membership/index.html` | Membership tiers |
| `personal-training/index.html` | PT session packs + pricing |
| `classes/index.html` | Class schedule/types |
| `testimonials/index.html` | Testimonials with carousel |
| `styles.css` | **Single global stylesheet** — all styles for every page live here |
| `js/main.js` | **Single JS file** — all interactivity for every page |
| `public/` | All images (JPEG/PNG) |
| `favicon/` | Favicon assets |

## Architecture

**CSS**: One file (`styles.css`) with CSS custom properties defined in `:root`. Design tokens:
- Colors: `--color-bg`, `--color-surface`, `--color-surface-2`, `--color-accent` (`#ff3b3b` red)
- Fonts: `--font-head` (Syne), `--font-body` (DM Sans) — loaded via Google Fonts
- Spacing: `--space-xs` through `--space-3xl`
- Layout: `.l-wrap` centers content at max `1200px`; `.section` handles vertical rhythm

**JS** (`js/main.js`): Vanilla JS, IIFE-wrapped. Handles:
- Mobile touch-active class on interactive elements (`.btn`, `.card`, `.bento__item`, etc.)
- Contact form submit → WhatsApp deep link (`wa.me/6587675510`)
- Mobile nav toggle (hamburger + overlay)
- Gallery image modal + custom scrollbar
- Testimonials carousel (mobile merry-go-round; desktop grid) — driven by `[data-testimonial-carousel]`, `[data-carousel-viewport]`, `[data-carousel-prev/next/dots]` attributes

**Contact forms** send to WhatsApp, not email. The `WHATSAPP_NUMBER` constant at the top of `main.js` is `6587675510`.

## Shopify Integration (Pending)

`SHOPIFY_INTEGRATION.md` documents the full plan for adding Shopify Buy Button checkout to `personal-training/index.html`. The recommended approach: replace `href="#pt-contact"` on the 5 PT pricing card CTAs with direct Shopify checkout URLs (`/cart/VARIANT_ID:1?channel=buy_button`). No iframe embeds needed. See that file for product SKUs, pricing, and setup steps.
