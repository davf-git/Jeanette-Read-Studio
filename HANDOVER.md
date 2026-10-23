# Jeanette Read Studio – developer handover

For the developer who connects selling and hosts the site (e.g. Woz). Kept up to date as the build goes on. Last updated: 23 Oct 2026 (stage 3: Eleventy build with Pages CMS admin, Netlify hosting; design work pushed to the `design` branch).

## What you are receiving
- An [Eleventy 3](https://www.11ty.dev/) project (Nunjucks templates, Markdown and JSON content). Output is plain static HTML, CSS and JavaScript; no front-end framework.
- Content lives in files edited through [Pages CMS](https://pagescms.org/) (config: `.pages.yml`). Every admin save is a commit to `main`; Netlify builds on each commit (`netlify.toml`). See README.md for the structure and ADMIN.md for the editing workflow.
- Content is placeholder where Jeanette has not yet supplied it. Placeholders are in square brackets, e.g. `[£ price]`, `[Product name]`.

## Content model
- Products: `src/content/products/*.md` (frontmatter: title, type, price in pounds, order, newIn, dateAdded, flag, colourways[{name, swatch, image}], gallery[], materials, dimensions, draft; body = description). Page per product at `/shop/<file-name>/`.
- Artworks: `src/content/art/*.md` (title, kind Original|Print, year, medium, size, image, etsyUrl, order, draft). No page of their own.
- Journal: `src/content/journal/YYYY-MM-DD-name.md` (title, date, category, image, excerpt, standfirst, draft; body = post). Page at `/journal/<name>/`.
- Info pages: `src/content/info/*.md` (title, description, updated, intro, rates[], sections[{heading, text (Markdown)}], showContactBox).
- Page text: `src/_data/pages/*.json`. Site settings: `src/_data/site.json`.
- Layout/URL rules per folder: `src/content/content.11tydata.js`. `draft: true` removes an item from the build.
- Pages CMS rewrites a file from its schema on save and drops keys it doesn't know. **Any new frontmatter key must also be added to `.pages.yml`.**
- `placeholder` keys (hidden in the admin) choose the pattern fill used until real photos exist.
- If selling moves to a platform (e.g. Shopify), products could come from its API at build time instead of these files; the card and product templates (`partials/macros.njk`, `layouts/product.njk`) are where to switch.

## Before launch
- Turn off **Site settings → Show "Design labs" link**, and delete `src/labs/` (Style lab, Components, Wallpaper lab, `apply-preview.js`; `noindex` and an `X-Robots-Tag` header via `netlify.toml`), `src/_includes/partials/lab-panel.njk` and `lab-bar.njk`, and the `build.preview` line in `layouts/base.njk`. Keep `js/wallpaper-tile.js` and `wallpaper.11ty.js` if the wallpaper is used.
- Set **Site settings → Live site address** (used for canonical URLs). Add `robots.txt`, `sitemap.xml` and Open Graph tags (Eleventy can generate the sitemap from `collections.all`). Each page has a `<title>` and `<meta name="description">`.
- Fonts: Google Fonts (Barlow Condensed, Barlow) via one `<link>`. Trim to the weights used, or self-host the woff2 files (better for privacy and speed; avoids a Google request needing cookie-banner consideration).
- Images: admin uploads are full size. Add `@11ty/eleventy-img` (or Netlify Image CDN) for resizing, WebP/AVIF and `width`/`height` attributes. Check final `alt` text.
- Minify CSS/JS if wanted (Netlify does not by default).
- Custom domain: Netlify → Domain management. HTTPS is automatic.

## CSS structure
- `settings.css`: palette, then colour roles, then per-text-level colour, typefaces, text levels (size / line height / letter spacing / weight), spacing and header, wallpaper, photo tags. All other CSS uses role tokens, not palette names or hex values. Keep it that way.
- Header (desktop): logo and name | home icon and nav, centred in the space between | tools. The name's baseline is the row's baseline: its top margin centres it on the logo (`--name-drop` fine-tunes), nav and Etsy sit on that baseline, icons stand on it (`--hdr-icon-drop`). Spacing: `--brand-gap`, `--nav-gap`, `--nav-home-gap`.
- Photo tags (`.tag`): rounded label with the JRS mark (CSS mask of `logo-mark.svg`, coloured by `--tag-icon`); all sizes and colours are `--tag-*` settings. The mark sits on the tag's x/y point.
- Wallpaper: a JRS-mark pattern behind the page (`--wall-page: 1`) and/or on Dune feature bands (`--wall-bands: 1`), drawn as a `::before` layer masked with `/images/wallpaper.svg`. That tile is generated at build time by `src/wallpaper.11ty.js` from `--wall-motif`, `--wall-gap`, `--wall-tilt`; colour, strength and pattern angle are plain CSS settings.
- Text levels are classes: `.t-hero`, `.t-title`, `.t-section`, `.t-statement`, `.t-wordmark`, `.t-lead`, `.t-body`, `.t-label`, `.t-small`.
- Breakpoints: 1079px (header switches to menu button, centred logo and name, basket; the desktop row needs about 1,040px), 899px (single-column grids and other mobile layouts), 599px (display type scales by `--mobile-scale`).
- Placeholder fills (`.ph-*`, `.pat-*`, `.cw-*`, `.art-ph--*`) stand in for photos. Remove them as real images arrive.
- Per-image crops are inline `object-position` on the `<img>` (from the `heroFocus` content field). Tag positions on the Shop/Art photos are inline `--x`/`--y` custom properties (from `tags` in page text). Colourway swatch colours on product pages are inline (from content).

## Basket and checkout (front end only)
- Basket state is held in `sessionStorage` (`jrs-basket`) so it survives moving between pages while designing. Replace with your cart state (platform cart, API) when selling is connected.
- `window.JRSBasket`: `items()` returns `{productId, variant, variantName, name, quantity, pricePence, img}[]`; `add(item)`; `render()`; `clear()`.
- Every change fires `document` event `jrs:basket-change` with `{items, count, subtotalPence}`.
- Rendered line items (`ul[data-basket-list] > li.bk-item`) carry `data-product-id`, `data-variant`, `data-qty`, `data-price-pence` (integer pence; empty until prices exist).
- Add to basket (product page, `layouts/product.njk`): `button[data-action="add-to-basket"]` with `data-product-id`, `data-variant`, `data-variant-name`, `data-name`, `data-qty`, `data-price-pence`, `data-img`. Colourway buttons update `data-variant` (`colourway-1`, `colourway-2`…) and swap the main photo; the quantity control updates `data-qty`. Price in pence comes from the product's `price` (pounds).
- Checkout: `[data-action="checkout"]` in the drawer and on `/basket/`. Currently shows "Checkout is not connected yet." Wire to the chosen payment route (Shopify Buy Button / Storefront API, Stripe Checkout, Apple Pay via Stripe, etc.).
- Header count: `.js-bk-count` (badge) and `.js-bk-count-text`. Subtotal: `.js-bk-subtotal`. Empty/full states: `.js-bk-empty` / `.js-bk-full`.
- Prices show as "[£ price]" until set; once every item has `pricePence`, subtotal and line prices are formatted automatically (en-GB, GBP).
- Free-delivery threshold: the delivery bar and product page read "[£X]" until Jeanette confirms the amount.

## Product cards, filters, sort
- Cards: `.card[data-type][data-product-id][data-colourway][data-order][data-new][data-price-pence]`. One image layer per colourway (`.card__layer`, visible one has `.is-on`), swatch buttons `.swatch[data-cw]` with `aria-pressed`. Map the selected colourway index to the variant id.
- Filters: chips `[data-filter]` inside a `[data-filter-scope]`; items carry `data-type`. Used on Home (New in), Shop, Art and Journal.
- Sort (Shop): `select[data-sort]` with `featured` (by `data-order`), `newest` (by `data-new`, yyyy-mm-dd), `price-asc`, `price-desc` (by `data-price-pence`). These are filled from the product files.
- Shop/Art photo tags: `button.tag[data-tag-filter]` set the filter and scroll to the grid. Hidden under 600px.

## Art
- Originals: "Enquire" links to `/about/#contact`. Prints and canvases: "Buy on Etsy ↗" links out to Etsy.

## Forms needing a backend
- Newsletter (`form[data-form="newsletter"]`, footer): placeholder message on submit. Connect to the chosen mailing service; add consent wording.
- Contact (`form[data-form="contact"]`, About page): placeholder message on submit. Needs a form service or endpoint, spam protection, and privacy wording.
- Search (`form[data-form="search"]`, header and mobile menu): front end only. Needs a search page or platform search.

## Links to confirm
- Instagram and Etsy links come from Site settings and currently point at the platforms' home pages until Jeanette's handle and shop URL are set.
- Footer links to Gift cards, Care guide and FAQs currently point at Shop or Delivery pages; confirm which pages will exist.

## Content waiting on Jeanette
- Launch product list (names, prices, colourways, photos, materials, dimensions), delivery threshold and rates, returns terms, business name and address, email, Instagram handle, Etsy shop URL, "made in the UK" claim (to confirm), artwork details, journal posts, privacy and terms text (needs proper legal wording).

## Accessibility
- Skip link to `#main` on every page. Landmarks: header, nav, main, footer.
- Overlays (`.ovl`: basket drawer, mobile menu) use `role="dialog"`, `aria-modal`, Escape to close, focus moves to the close button and returns to the trigger. A full focus trap is not yet implemented; add one.
- Icon buttons have `aria-label`s. Focus outlines use the accent colour.
- Sun (`--sun`) is a fill colour only; it does not meet contrast as text on sand.
- Page titles use Driftwood deep (3.1:1 on Sand, passes for large text only; keep titles at display sizes). Pebble (captions, small text, wordmark) is 4.9:1 on Sand and 4.6:1 on Dune. Driftwood itself is for rules, not text.
- Labels and nav are currently Shallows: 4.3:1 on Sand and 4.0:1 on Dune, just under the 4.5:1 needed at 14px. Design decision pending; darken Shallows slightly or change `--label-col` before launch.
- Wallpaper: if switched on behind text, check small text stays readable over it.
- Motion respects `prefers-reduced-motion`.

## Hosting
- Netlify (free tier) builds and hosts the site; `netlify.toml` sets the build, Node 22, the 404 page and labs headers. Any static host with a Node build works (Cloudflare Pages, etc.).
- Netlify site https://jeanette-read-studio.netlify.app connected to `main` on 21 Oct 2026; Pages CMS connected to the same repo and branch. Tested end to end, then **builds stopped** (Build status: Stopped) the same day: the free plan's 300 credits/month (15 per production deploy) ran out after about 20 admin saves. The site shows the last deploy before that.
- Netlify credit costs (checked 21 Oct 2026): production deploy 15; bandwidth 20 per GB; web requests 2 per 10,000; branch deploys, deploy previews and failed deploys free. Personal plan $9/month for 1,000 credits; Pro from $20/month for 3,000. Rough post-launch estimate 400–700 credits/month (assumes 20–40 saves and ~1,000 visits a month; not measured).
- Before reactivating: decide host (Netlify Personal vs Cloudflare Pages, free 500 builds/month), add image resizing, and load bulk content on a separate branch then merge once, so population costs one production deploy.
- Design work is on the `design` branch (pushed 23 Oct 2026 from the claude.ai preview artifact); `main` stays frozen until launch.
- Netlify Forms could handle the contact and newsletter forms with a `data-netlify` attribute (check the free-tier limits), or use a mailing service's embed.
- Payment, newsletter and contact form need whichever services are chosen. Domain still to be decided.
