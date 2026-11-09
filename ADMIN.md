# Admin: editing the site

The site is edited in **Pages CMS**, a free web app at <https://app.pagescms.org>. Everything you change there is saved to this GitHub repo, and Netlify rebuilds the live site about a minute later.

## Part 1: one-off setup (Dav, about 15 minutes)

You need a GitHub account with access to `davf-git/jeanette-read-studio` (you already have this).

### A. Put the site on Netlify (free)

1. Go to <https://app.netlify.com/signup> and sign up with **GitHub**.
2. Choose **Add new site → Import an existing project → GitHub**. Allow Netlify to see the repo when GitHub asks (you can limit it to just this repo).
3. Pick **jeanette-read-studio**. Netlify reads the settings from `netlify.toml`, so the boxes should already say:
   - Branch to deploy: `main`
   - Build command: `npm run build`
   - Publish directory: `_site`
4. Click **Deploy**. After a minute or two you get an address like `https://something-random.netlify.app`. Open it: that is the live site.
5. Optional: **Site configuration → Change site name** to something like `jeanette-read-studio`, giving `https://jeanette-read-studio.netlify.app`.

### B. Connect the admin

1. Go to <https://app.pagescms.org> and **Sign in with GitHub**.
2. If Pages CMS asks to install its GitHub App, install it and give it access to **jeanette-read-studio** only.
3. Open **davf-git / jeanette-read-studio**, branch **main**. The admin menu appears on the left, read from `.pages.yml`.

### C. Try it

1. Open **Page text – Home**, change the hero title, and click **Save**.
2. In Netlify, open **Deploys**: a new deploy starts within seconds. When it says *Published*, refresh the live site and the change is there.
3. The same change appears as a commit in the GitHub repo, so every edit can be undone there.

### D. Give Jeanette access (when ready)

In Pages CMS, open the repo's **Collaborators** settings and invite Jeanette by email. She doesn't need a GitHub account: she gets an email link and can edit that repo only.

## Part 2: editing (Dav and Jeanette)

The left-hand menu in the admin has:

| Menu item | What it edits |
|---|---|
| **Homeware – products** | One entry per product: name, type, price, Etsy listing link, colourways (name, photo, swatch point and zoom, dot colour), product photos, description, materials, dimensions, "New in", order, draft |
| **Art – works** | One entry per artwork (each has its own page): title, original or print, year, medium, size (cm and inches), depth, signed, availability, price, photo of the whole work, close-up photos, photo on a wall, framing, about this work, Etsy link, order |
| **Journal – posts** | One entry per post: title, date, category, header photo, excerpt, the post itself |
| **Page text – Home / Homeware / Art / Journal / About** | Headings, intro text, header photos and their crop, photo tags, buttons |
| **Info pages** | Delivery and returns (including the rates table), privacy policy, terms |
| **Site settings** | Delivery bar, email, Instagram, Etsy, footer line, newsletter text |

Tips:
- **Adding a product, artwork or post:** open the list and click **Add an entry**. Tick **Hide from the site (draft)** to save it without publishing it.
- **Photos:** use the image picker and upload. Uploads go into `src/images/`. Make them about 2000 px on the long side; very large camera files slow the site down.
- **Header crop** ("x% y%"): the first number moves the visible area left and right, the second up and down. `50% 50%` is the centre; `50% 80%` shows more of the bottom.
- **Photo tags** on Homeware and Art: x and y are percentages across and down the visible header photo. Keep them out of the top-left corner, where the page title sits.
- **Artworks:** each work has its own page. Add a straight-on photo of the whole work, a few close-ups with captions (surface, edges, side), and optionally a photo on a wall. Fill in size (cm and inches), depth, availability and, for originals, a price or leave it empty for "Price on request".
- **Prices:** leave empty to show "[£ price]". Prices here are for display only; customers buy on Etsy.
- **Etsy listing link:** paste the product's Etsy page address. The product's "Buy on Etsy" button goes there; if it's empty, the button goes to the main Etsy shop (Site settings).
- **Swatches:** each colourway's swatch shows a close-up of its photo. Set *Swatch point: across* and *down* (in %) to a spot on the fabric; *Swatch zoom* 8 is the default, higher shows a smaller patch. Save and check the result; nudge the numbers if it lands off the fabric. With no point set, the swatch uses the dot colour.
- Each save publishes. For several changes, expect a rebuild after each one; that's fine.

## Not in the admin

Design (colours, type, spacing, header layout, photo tags and their motion, wallpaper) is changed in code, using the labs (`/labs/style/`, `/labs/components/`, `/labs/wallpaper/`, `/labs/motion/`) to try values and `src/css/settings.css` to keep them.
