# Jeanette Read Studio – developer handover

For the developer who hosts the site and connects any services (e.g. Woz). Kept up to date as the build goes on. Last updated: 9 Nov 2026 (stage 3: Eleventy build with Pages CMS admin, Netlify hosting; `design` merged into `main` on 9 Nov 2026 so Jeanette can review it on the Netlify address). Since 5 Nov 2026 products are sold through Jeanette's Etsy shop; the site has no basket or checkout.

## What you are receiving
- An [Eleventy 3](https://www.11ty.dev/) project (Nunjucks templates, Markdown and JSON content). Output is plain static HTML, CSS and JavaScript; no front-end framework.
- Content lives in files edited through [Pages CMS](https://pagescms.org/) (config: `.pages.yml`). Every admin save is a commit to `main`; Netlify builds on each commit (`netlify.toml`). See README.md for the structure and ADMIN.md for the editing workflow.
- Content is placeholder where Jeanette has not yet supplied it. Placeholders are in square brackets, e.g. `[£ price]`, `[Product name]`.

## Content model
- Products: `src/content/products/*.md` (frontmatter: title, type, price in pounds, order, newIn, dateAdded, flag, etsyUrl, colourways[{name, image, swatchX, swatchY, swatchZoom, swatch}], gallery[], materials, dimensions, draft; body = description). Page per product at `/homeware/<file-name>/` (the Shop page was renamed Homeware on 8 Nov 2026; `netlify.toml` redirects old `/shop/` addresses).
- Artworks: `src/content/art/*.md` (title, kind Original|Print, year, medium, size, sizeIn, depth, signed, availability Available|Reserved|Sold, price, image, gallery[{image, caption}], roomImage, framing, etsyUrl, order, draft; body = about this work). Page per work at `/art/<file-name>/` (`layouts/artwork.njk`).
- Journal: `src/content/journal/YYYY-MM-DD-name.md` (title, date, category, image, excerpt, standfirst, draft; body = post). Page at `/journal/<name>/`.
- Info pages: `src/content/info/*.md` (title, description, updated, intro, rates[], sections[{heading, text (Markdown)}], showContactBox).
- Page text: `src/_data/pages/*.json`. Site settings: `src/_data/site.json`.
- Layout/URL rules per folder: `src/content/content.11tydata.js`. `draft: true` removes an item from the build.
- Pages CMS rewrites a file from its schema on save and drops keys it doesn't know. **Any new frontmatter key must also be added to `.pages.yml`.**
- `placeholder` keys (hidden in the admin) choose the pattern fill used until real photos exist.
- If selling moves to a platform (e.g. Shopify), products could come from its API at build time instead of these files; the card and product templates (`partials/macros.njk`, `layouts/product.njk`) are where to switch.

## Before launch
- Turn off **Site settings → Show "Design labs" link**, and delete `src/labs/` (Style lab, Components, Wallpaper lab, Motion lab, `apply-preview.js`; `noindex` and an `X-Robots-Tag` header via `netlify.toml`), `src/_includes/partials/lab-panel.njk` and `lab-bar.njk`, and the `build.preview` line in `layouts/base.njk`. Keep `js/wallpaper-tile.js` and `wallpaper.11ty.js` if the wallpaper is used.
- Set **Site settings → Live site address** (used for canonical URLs). Add `robots.txt`, `sitemap.xml` and Open Graph tags (Eleventy can generate the sitemap from `collections.all`). Each page has a `<title>` and `<meta name="description">`.
- Fonts: Google Fonts (Barlow Condensed, Barlow) via one `<link>`. Trim to the weights used, or self-host the woff2 files (better for privacy and speed; avoids a Google request needing cookie-banner consideration).
- Images: admin uploads are full size. Add `@11ty/eleventy-img` (or Netlify Image CDN) for resizing, WebP/AVIF and `width`/`height` attributes. Check final `alt` text.
- Minify CSS/JS if wanted (Netlify does not by default).
- Custom domain: Netlify → Domain management. HTTPS is automatic.

## CSS structure
- `settings.css`: palette, then colour roles, then per-text-level colour, typefaces, text levels (size / line height / letter spacing / weight), spacing and header, wallpaper, photo tags. All other CSS uses role tokens, not palette names or hex values. Keep it that way.
- Logo (new from 5 Nov 2026): `images/logos/` holds `logo-mark.svg` (blue mark: header, mobile menu, favicon, wallpaper), `logo-name.svg` (the logo's own lettering, used as the header name), `logo-lockup.svg` (mark and name together) and `logo-square.svg` (white mark on blue, not used yet). Extracted from Jeanette's Illustrator files (JRS-logo-art-df-01/02); those SVGs held only Illustrator editing data, so re-export them before sending to anyone else. The mark's path is also copied into `js/wallpaper-tile.js` and the `#i-mark` symbol in `partials/icons.njk`; update all three if the mark changes.
- Header (desktop): logo and name | home icon and nav, centred in the space between | tools. `--logo-h` sizes the mark; the name scales with it (0.62 of the mark's height × `--name-scale`) and sits against it as in the logo artwork. The name's baseline (22.2% up from the bottom of `logo-name.svg`) is the row's baseline: nav and Etsy sit on it, icons stand on it (`--hdr-icon-drop`), `--name-drop` nudges it. Spacing: `--brand-gap`, `--nav-gap`, `--nav-home-gap`. Below 1080px the whole logo shrinks to fit between the menu button and the right edge.
- Nav: the current page's underline is a drawn line (`--nav-line`, `--nav-line-offset`) that stops at the last letter and wipes in from the left; hover shows it in `--nav-hover-col`. The home icon is filled on the home page, outlined elsewhere.
- Photo tags (`.tag`): rounded label with the JRS mark as an inline SVG (`<use href="#i-mark">`, coloured by `--tag-icon`); all sizes and colours are `--tag-*` settings. The mark sits on the tag's x/y point. Motion: `--tag-motion-load` plays on the svg once per page (staggered per tag by `--i`), `--tag-motion-hover` on the `<use>` inside it, so hover never restarts the load motion; keyframes `tag-swirl`, `tag-turn`, `tag-pop`, `tag-draw`, `tag-wave` in components.css. Current: swirl in on load, turn while hovered.
- Wallpaper: a JRS-mark pattern behind the page (`--wall-page: 1`) and/or on Dune feature bands (`--wall-bands: 1`), drawn as a `::before` layer masked with `/images/wallpaper.svg`. That tile is generated at build time by `src/wallpaper.11ty.js` from `--wall-motif`, `--wall-gap`, `--wall-tilt`; colour, strength and pattern angle are plain CSS settings.
- Text levels are classes: `.t-hero`, `.t-title`, `.t-section`, `.t-statement`, `.t-lead`, `.t-body`, `.t-label`, `.t-small`.
- Breakpoints: 1079px (header switches to menu button and centred logo; the desktop row needs about 1,060px), 899px (single-column grids and other mobile layouts), 599px (display type scales by `--mobile-scale`).
- Placeholder fills (`.ph-*`, `.pat-*`, `.cw-*`, `.art-ph--*`) stand in for photos. Remove them as real images arrive.
- Per-image crops are inline `object-position` on the `<img>` (from the `heroFocus` content field). Tag positions on the Homeware/Art photos are inline `--x`/`--y` custom properties (from `tags` in page text). Colourway swatches (product page dots and card swatches) show a close-up of the colourway photo: an `img.fabric` centred on the colourway's swatchX/swatchY point (% of the photo) and enlarged swatchZoom times (default 8). Without a point, the dot uses the plain `swatch` colour.

## Selling (through Etsy)
- Products are sold on Jeanette's Etsy shop. The product page has "Buy on Etsy ↗" (`a.btn--etsy`, `layouts/product.njk`) linking to the product's `etsyUrl`, or to `site.etsyUrl` (Site settings) if none is set. Prints and canvases on the Art page link to Etsy the same way.
- Colourway dots on the product page swap the main photo only; colour and quantity are chosen on Etsy.
- The earlier front-end basket (drawer, `/basket/` page, `window.JRSBasket`, quantity control) was removed on 5 Nov 2026; it is in the git history (`design` branch, commit 89778dc and before) if Jeanette later wants her own checkout.
- Prices on the site are display only. Delivery wording ("Free UK delivery on orders over [£X]" in the delivery bar and product note, the Delivery & returns page) still describes the site's own orders and needs rewording once Jeanette's Etsy shipping and returns policies are known.

## Product cards, filters, sort
- Cards: `.card[data-type][data-product-id][data-colourway][data-order][data-new][data-price-pence]`. One image layer per colourway (`.card__layer`, visible one has `.is-on`), swatch buttons `.swatch[data-cw]` with `aria-pressed`. The card swatch switches the card photo.
- Filters: chips `[data-filter]` inside a `[data-filter-scope]`; items carry `data-type`. Used on Home (New in), Homeware, Art and Journal.
- Sort (Homeware): `select[data-sort]` with `featured` (by `data-order`), `newest` (by `data-new`, yyyy-mm-dd), `price-asc`, `price-desc` (by `data-price-pence`). These are filled from the product files.
- Homeware/Art photo tags: `button.tag[data-tag-filter]` set the filter and scroll to the grid. They grow on hover (`--tag-hover-grow`) and get smaller under 1080px and 900px. The x/y point marks the top of the tag, level with the icon's middle. The photo-header title scales with the header (80px at 1440px wide) so tags placed clear of it stay clear. Hidden under 600px.

## Art
- Each work has its own page (`layouts/artwork.njk`): large picture, then thumbnails for the whole work, "On the wall" (`roomImage`) and the close-ups (`gallery`). Clicking the large picture opens a full-screen viewer (built by `site.js`) with scroll, pinch, double-click and button zoom, drag to pan and arrow keys. Zoom stops at the image file's own size; keep uploads at about 2000 px so nothing larger is ever served.
- Originals show availability, "Price on request" (or the price), Enquire and "See it on a wall". Sold hides Enquire. Prints show "Buy on Etsy ↗".
- Enquiries: Enquire (artwork pages, art cards, and the commissions button on the Art page) opens a panel (`partials/enquiry.njk`) over the page with the work's thumbnail and a started message, so visitors don't leave the page. It uses the same placeholder form handling as the contact form until a form service is connected. Without script, the links fall back to `/about/#contact`.
- Page text for artwork pages (Art page text): `replyNote` under Enquire, `deliveryText` for Delivery and viewing.
- The preview build rewrites `data-enq-img` (and `data-src`, `data-img`) to relative paths; add any new attribute that carries a root-relative path to the transform in `eleventy.config.js`.

## Forms needing a backend
- Newsletter (`form[data-form="newsletter"]`, footer): placeholder message on submit. Connect to the chosen mailing service; add consent wording.
- Contact (`form[data-form="contact"]`, About page): placeholder message on submit. Needs a form service or endpoint, spam protection, and privacy wording.
- Search (`form[data-form="search"]`, header and mobile menu): front end only. Needs a search page or platform search.

## Links to confirm
- Instagram and Etsy links come from Site settings and currently point at the platforms' home pages until Jeanette's handle and shop URL are set.
- Footer links to Gift cards, Care guide and FAQs currently point at Homeware or Delivery pages; confirm which pages will exist.

## Content waiting on Jeanette
- Launch product list (names, prices, colourways, photos, materials, dimensions), delivery threshold and rates, returns terms, business name and address, email, Instagram handle, Etsy shop URL, "made in the UK" claim (to confirm), artwork details, journal posts, privacy and terms text (needs proper legal wording).

## Accessibility
- Skip link to `#main` on every page. Landmarks: header, nav, main, footer.
- Overlay (`.ovl`: mobile menu) use `role="dialog"`, `aria-modal`, Escape to close, focus moves to the close button and returns to the trigger. A full focus trap is not yet implemented; add one.
- Icon buttons have `aria-label`s. Focus outlines use the accent colour.
- Sun (`--sun`) is a fill colour only; it does not meet contrast as text on sand.
- Page titles use Driftwood deep (3.1:1 on Sand, passes for large text only; keep titles at display sizes). Pebble (captions, small text) is 4.9:1 on Sand and 4.6:1 on Dune. Driftwood itself is for rules, not text.
- Labels and nav are Shallows: 4.3:1 on Sand and 4.0:1 on Dune, just under the 4.5:1 WCAG asks for at 14px. Kept by design decision (Dav, 23 Oct 2026).
- Wallpaper: if switched on behind text, check small text stays readable over it.
- Motion (nav underline, photo tag icons) respects `prefers-reduced-motion`: all animation is switched off.

## Hosting
- Netlify (free tier) builds and hosts the site; `netlify.toml` sets the build, Node 22, the 404 page and labs headers. Any static host with a Node build works (Cloudflare Pages, etc.).
- Netlify site https://jeanette-read-studio.netlify.app connected to `main` on 21 Oct 2026; Pages CMS connected to the same repo and branch. Tested end to end, then **builds stopped** (Build status: Stopped) the same day: the free plan's 300 credits/month (15 per production deploy) ran out after about 20 admin saves. The site shows the last deploy before that.
- Netlify credit costs (checked 21 Oct 2026): production deploy 15; bandwidth 20 per GB; web requests 2 per 10,000; branch deploys, deploy previews and failed deploys free. Personal plan $9/month for 1,000 credits; Pro from $20/month for 3,000. Rough post-launch estimate 400–700 credits/month (assumes 20–40 saves and ~1,000 visits a month; not measured).
- Before reactivating: decide host (Netlify Personal vs Cloudflare Pages, free 500 builds/month), add image resizing, and load bulk content on a separate branch then merge once, so population costs one production deploy.
- Design work is on the `design` branch, pushed from the claude.ai preview artifact. On 9 Nov 2026 Dav asked for it to go to Netlify: `design` was merged into `main`, so the Netlify address shows the current design (placeholders, and the Design labs link in the footer) once Netlify builds are set back to Active. Each production deploy costs 15 credits; every admin save is a deploy.
- Netlify Forms could handle the contact and newsletter forms with a `data-netlify` attribute (check the free-tier limits), or use a mailing service's embed.
- Newsletter and contact form need whichever services are chosen. Payment is handled by Etsy. Domain still to be decided.
