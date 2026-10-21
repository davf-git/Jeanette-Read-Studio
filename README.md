# Jeanette Read Studio website

Website for Jeanette Read Studio (homeware and art). Built with [Eleventy](https://www.11ty.dev/) (a static site generator), edited through [Pages CMS](https://pagescms.org/), hosted on Netlify. Plain HTML, CSS and JavaScript in the output; no front-end framework. All code belongs to Jeanette.

- **Editing content:** see [ADMIN.md](ADMIN.md) (how to log in and edit, and how to set up hosting and the admin the first time).
- **Developer notes** (selling, checkout, forms, launch checklist): see [HANDOVER.md](HANDOVER.md).

## How it fits together

```
Pages CMS (admin)  ──saves──▶  this GitHub repo  ──triggers──▶  Netlify build (Eleventy)  ──▶  live site
```

Every save in the admin is a commit to `main`. Netlify rebuilds and publishes the site in about a minute.

## Structure

```
src/
  index.njk, shop.njk, art.njk, journal.njk, about.njk, basket.njk, 404.njk   Page templates
  _includes/layouts/    base.njk (every page), product.njk, post.njk, info.njk
  _includes/partials/   header, footer, overlays (basket drawer, mobile menu), icons, macros (cards, filters, photo header)
  _data/site.json       Site settings: name, delivery bar, email, social links, footer
  _data/pages/*.json    Page text for Home, Shop, Art, Journal, About
  content/products/     One file per product   → /shop/<name>/
  content/art/          One file per artwork   (listed on /art/)
  content/journal/      One file per post      → /journal/<name>/
  content/info/         Delivery, privacy, terms → /delivery/, /privacy/, /terms/
  content/content.11tydata.js   Layout and URL rules for the content folders
  css/settings.css      Design tokens: colours, colour roles, type scale, spacing
  css/base.css, components.css, pages.css
  js/site.js            Menu, search, filters, sort, colourways, product options, basket (front end only)
  images/               logos/, photos/, uploads/ (admin uploads)
  labs/                 Style lab and components lab (design sandbox, not for launch)
eleventy.config.js      Eleventy settings, collections, filters
.pages.yml              Admin configuration: what can be edited and where it is saved
netlify.toml            Netlify build settings
```

## Running it locally

Needs Node 20 or later.

```
npm install
npm start          # local server with live reload at http://localhost:8080
npm run build      # build the site into _site/
```

`npm run build:preview` builds into `_preview/` with relative links, so the files also work when opened from a folder. It is only used for design previews.

## Design changes

- Colours, type and spacing live in `src/css/settings.css`. Other CSS uses its role tokens (`--page-bg`, `--btn-bg`, `--title-col` and so on), never hex values, so the settings stay in charge.
- `/labs/style/` previews settings changes live with sliders. "Copy settings.css" gives the whole file with the changes, to paste over `src/css/settings.css`. `/labs/components/` shows every reusable part on one page.
- The admin edits content (text, photos, products, posts). It does not change the design.
