// Layout and URL for each kind of content file, set by folder.
// Kept here (not in the content folders) so the admin only sees content files.
const rules = {
  products: { layout: "layouts/product.njk", permalink: (d) => `/shop/${d.page.fileSlug}/`, nav: "shop" },
  journal: { layout: "layouts/post.njk", permalink: (d) => `/journal/${d.page.fileSlug}/`, nav: "journal" },
  info: { layout: "layouts/info.njk", permalink: (d) => `/${d.page.fileSlug}/` },
  art: { permalink: () => false },
};
const folder = (d) => d.page.inputPath.split("/content/")[1]?.split("/")[0];

export default {
  eleventyComputed: {
    layout: (d) => d.layout || rules[folder(d)]?.layout,
    permalink: (d) => (d.draft ? false : rules[folder(d)]?.permalink(d)),
    nav: (d) => rules[folder(d)]?.nav,
  },
};
