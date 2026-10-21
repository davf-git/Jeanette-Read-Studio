// Eleventy configuration for Jeanette Read Studio.
// Source lives in src/, the built site goes to _site/ (Netlify publishes that folder).
import path from "node:path";
import markdownIt from "markdown-it";

const md = markdownIt({ html: true, linkify: true, typographer: true });

export default function (eleventyConfig) {
  // Static files copied as they are
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/labs/*.css");
  eleventyConfig.addPassthroughCopy("src/labs/*.js");

  // Collections, ordered for display
  const byOrder = (a, b) => (a.data.order ?? 999) - (b.data.order ?? 999);
  eleventyConfig.addCollection("products", (api) =>
    api.getFilteredByGlob("src/content/products/*.md").filter((p) => !p.data.draft).sort(byOrder));
  eleventyConfig.addCollection("artworks", (api) =>
    api.getFilteredByGlob("src/content/art/*.md").filter((p) => !p.data.draft).sort(byOrder));
  eleventyConfig.setLibrary("md", md);
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/content/journal/*.md").filter((p) => !p.data.draft).sort((a, b) => b.date - a.date));

  // Filters
  eleventyConfig.addFilter("md", (text) => (text ? md.render(String(text)) : ""));
  eleventyConfig.addFilter("slug", (text) => String(text || "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  eleventyConfig.addFilter("pence", (pounds) => (pounds === undefined || pounds === null || pounds === "" ? "" : Math.round(Number(pounds) * 100)));
  eleventyConfig.addFilter("gbp", (pounds) =>
    pounds === undefined || pounds === null || pounds === "" ? "[£ price]" :
      new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(Number(pounds)));
  eleventyConfig.addFilter("ukDate", (d) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "[Date]");
  eleventyConfig.addFilter("isoDate", (d) => (d ? new Date(d).toISOString().slice(0, 10) : ""));
  eleventyConfig.addFilter("unique", (arr) => [...new Set(arr)]);
  eleventyConfig.addFilter("pluck", (items, key) => items.map((i) => i.data[key]).filter(Boolean));
  eleventyConfig.addFilter("where", (items, key) => items.filter((i) => i.data[key]));
  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));
  eleventyConfig.addFilter("exclude", (arr, url) => arr.filter((i) => i.url !== url));

  // Preview build only (npm run build:preview): rewrite root-relative links to relative
  // ones so the built files also work when opened from a folder or a sub-path.
  if (process.env.ELEVENTY_RELATIVE) {
    eleventyConfig.addTransform("relative-links", function (content) {
      if (!(this.page.outputPath || "").endsWith(".html")) return content;
      const from = path.posix.dirname(this.page.url.endsWith("/") ? this.page.url + "index.html" : this.page.url);
      return content.replace(/(href|src|data-src|data-img|srcset)="\/(?!\/)([^"]*)"/g, (m, attr, target) => {
        let [p, hash = ""] = target.split("#");
        if (p === "" || p.endsWith("/")) p += "index.html";
        let rel = path.posix.relative(from, "/" + p) || "index.html";
        return `${attr}="${rel}${hash ? "#" + hash : ""}"`;
      });
    });
  }

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
