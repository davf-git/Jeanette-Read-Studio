/* Builds the wallpaper tile (an SVG of the JRS mark in a half-drop repeat).
   Used at build time (src/wallpaper.11ty.js) and live in the labs (labs/style-lab.js).
   motif: mark size in px; gap: space around each mark in px; tilt: degrees each mark is turned. */
(function (root) {
  const MARK = '<path d="M92.35 41.32L92.33 41.32C92.16 28.32 76.52 16.27 56.52 16.26L56.52 16.32C56.52 16.32 55.75 16.32 55.73 16.32C51.73 16.32 48.51 19.3 48.51 23.55C48.51 31.54 49.46 31.81 49.46 43.5C49.46 48.9 45.91 53.54 38.98 53.81C33.22 54.04 28.31 49.59 28.27 43.82C28.23 39.28 30.47 36.41 34.1 33.96C37.44 31.71 36.63 29.76 33.75 30.33C25.12 32.03 19.11 39.49 19.11 48.7C19.11 48.8 19.13 49.32 19.13 49.32L19.15 49.32C19.32 62.32 35.52 73.74 55.52 73.75L55.52 74.32C55.52 74.32 55.73 74.32 55.75 74.32C59.75 74.32 62.97 71.03 62.97 66.78C62.97 58.78 62.02 58.35 62.02 46.67C62.02 41.27 65.58 36.55 72.5 36.28C78.26 36.05 83.17 40.45 83.21 46.23C83.25 50.77 81.01 53.62 77.38 56.06C74.04 58.32 74.85 60.26 77.73 59.69C86.36 57.99 92.37 50.84 92.37 41.63C92.37 41.52 92.35 41.32 92.35 41.32Z"/>';
  const CX = 55.74, CY = 45.29, SIZE = 73.25; // centre and width of the mark in logo-mark.svg's coordinates
  function wallpaperTile(motif, gap, tilt) {
    motif = +motif || 36; gap = +gap || 0; tilt = +tilt || 0;
    const t = +(motif + gap).toFixed(2), s = +(motif / SIZE).toFixed(4);
    const at = (x, y) => `<g transform="translate(${x} ${y}) rotate(${tilt}) scale(${s}) translate(${-CX} ${-CY})">${MARK}</g>`;
    const h = t / 2;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${t}" height="${t}" viewBox="0 0 ${t} ${t}">` +
      at(h, h) + at(0, 0) + at(t, 0) + at(0, t) + at(t, t) + `</svg>`;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = wallpaperTile;
  else root.wallpaperTile = wallpaperTile;
})(this);
