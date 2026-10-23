// Builds /images/wallpaper.svg from the --wall-motif, --wall-gap and --wall-tilt values in css/settings.css.
import fs from "node:fs";

export const data = { permalink: "/images/wallpaper.svg", eleventyExcludeFromCollections: true };

export function render() {
  const css = fs.readFileSync("src/css/settings.css", "utf8");
  const num = (name, fallback) => { const m = css.match(new RegExp(`--${name}:\\s*(-?[\\d.]+)`)); return m ? +m[1] : fallback; };
  const ctx = {};
  new Function(fs.readFileSync("src/js/wallpaper-tile.js", "utf8")).call(ctx);
  return ctx.wallpaperTile(num("wall-motif", 36), num("wall-gap", 34), num("wall-tilt", 45));
}
