/* Builds the wallpaper tile (an SVG of the JRS mark in a half-drop repeat).
   Used at build time (src/wallpaper.11ty.js) and live in the labs (labs/style-lab.js).
   motif: mark size in px; gap: space around each mark in px; tilt: degrees each mark is turned. */
(function (root) {
  const MARK = '<path d="M297.4,129.1c5.6-49.6,39-54.6,39.9-24.8c0.2,5.6,3.4,9.4,8.9,10.1c4.5,0.5,10-4.5,11.1-11.2c0.2-1.3,0.3-2.6,0.2-3.8c1.6-37.3-61.3-45-61.8,29.3C295.6,130.6,297.2,130.9,297.4,129.1z"/>' +
    '<path d="M322.9,108.8c-5.6,49.6-39,54.6-39.9,24.8c-0.2-5.6-3.4-9.4-8.9-10.1c-4.5-0.5-10,4.5-11.1,11.2c-0.2,1.3-0.3,2.6-0.2,3.8c-1.6,37.3,61.3,45,61.8-29.3C324.7,107.3,323.1,107,322.9,108.8z"/>';
  const CX = 310.15, CY = 118.95, SIZE = 94.78; // centre and width of the mark's own drawing
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
