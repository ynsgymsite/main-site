# YNSGYM – Main Site

Marketing site for YNSGYM, a 24/7 gym in Singapore. Built with [Eleventy](https://www.11ty.dev/) and managed via [Decap CMS](https://decapcms.org/). Hosted on Netlify.

## Branches

| Branch | Purpose | URL |
|---|---|---|
| `main` | Production site | Primary Netlify domain |
| `cms/eleventy-decap` | CMS + Eleventy build | `cms-eleventy-decap--neon-torte-74f9bb.netlify.app` |
| `shopify-integration` | Shopify checkout (parked) | — |

## Local Development

```bash
npm install
npx @11ty/eleventy --serve
# Site at http://localhost:8080
```

The build compiles to `_site/` (git-ignored). Never edit files in `_site/` directly.

## File Structure

```
/
├── .eleventy.js              # Eleventy config + jsonSafe filter
├── netlify.toml              # Build command + publish dir
├── package.json
│
├── _includes/                # Shared layout partials
│   ├── base.njk              # Marketing-site HTML shell (head, body, nav, footer)
│   ├── nav.njk               # Site nav — loops over site.json navLinks
│   └── footer.njk            # Footer — renders site.json footerCopyright
│
├── _data/                    # Content data files (CMS-editable)
│   ├── site.json             # Global: logo, nav links, WhatsApp number, contact topics, footer
│   ├── gyms.json             # Gym locations (name, address, phone, coordinates)
│   ├── membership.json       # Membership plans (name, price, features, badges)
│   ├── pt.json               # PT pricing: intro pack + session packs
│   ├── classes.json          # Class list (key, name, image, price, desc, features)
│   └── testimonials.json     # Testimonial cards (name, avatar, stats, quote, tags)
│
├── admin/
│   ├── index.html            # Decap CMS single-page app
│   └── config.yml            # CMS collection definitions — maps UI fields to _data/*.json
│
├── index.njk                 # Homepage (hardcoded template content)
├── gyms/index.html           # Gym locations page
├── membership/index.html     # Membership tiers page
├── personal-training/index.html  # PT pricing page
├── classes/index.html        # Classes page (tiles + modal)
├── testimonials/index.html   # Testimonials page (carousel)
│
├── styles.css                # Single global stylesheet (all pages)
├── js/
│   └── main.js               # Single JS file (all interactivity)
├── public/                   # Images (JPEG/PNG) + CMS uploads land in public/uploads/
└── favicon/                  # Favicon assets
```

## How Content Editing Works

1. Admin logs in at `/admin/` using Netlify Identity
2. Edits a field (e.g. a PT session price) and clicks **Publish**
3. Decap CMS commits the change to the relevant `_data/*.json` file via Git Gateway
4. Netlify detects the push, runs `npx @11ty/eleventy`, and deploys `_site/`
5. Live site updates in ~1–2 minutes

## Architecture Notes

**Templates**: Marketing pages use Nunjucks (`.njk` or `.html` processed as Nunjucks). Each page has YAML front matter declaring `layout`, `pageTitle`, `bodyClass`, and `navCtaHref`. The shared layout in `_includes/base.njk` eliminates duplicated `<head>`, nav, and footer. The `/admin/` CMS app is a separate static page and does not use this layout.

**Data binding**: Existing `_data/*.json` files are auto-exposed as template variables by filename (e.g. `classes.json` → `{{ classes.classes }}`). CMS-managed structured content is rendered via `{% for %}` loops. The homepage is currently hardcoded in `index.njk`; there is no `_data/home.json`.

**WhatsApp number**: Stored in `_data/site.json` as `whatsappNumber`. Injected into the page as a `data-whatsapp` attribute on `<body>`. `js/main.js` reads it at runtime — no hardcoded number in JS.

**jsonSafe filter**: Custom Eleventy filter used when injecting JSON data into inline `<script>` blocks (classes page modal data). Escapes `</` to prevent XSS via `</script>` in content strings.

**Contact forms**: Submit to WhatsApp via deep link (`wa.me/NUMBER`), not email.

## CMS Setup (Netlify — one-time)

1. **Identity** → Enable → set Registration to **Invite only**
2. **Identity → Services** → Enable **Git Gateway**
3. **Identity → Invite users** → invite admin email(s)
4. Admin clicks invite link, sets password, accesses `/admin/`

Netlify Identity is loaded only by `/admin/`. Public marketing pages should not load `netlify-identity-widget.js` or create a `netlify-identity-widget` iframe.

## Shopify Integration

Planned but parked on the `shopify-integration` branch. See `SHOPIFY_INTEGRATION.md` for the approach (direct Shopify checkout URLs on PT pricing cards, no iframe embeds).
