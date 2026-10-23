/* Style controls for the Style lab and Components pages. Labs only, not part of the live site.
   Sliders set CSS custom properties on the page (and on any .lab-frame iframes).
   Changes are kept in sessionStorage so they carry between the two lab pages.
   "Copy settings.css" writes the current values into the text of css/settings.css. */
(() => {
  const root = document.documentElement;
  const PAL = ['sand', 'dune', 'wet-sand', 'driftwood', 'driftwood-deep', 'deep-sea', 'open-sea', 'shallows', 'sun', 'coral', 'slate', 'pebble'];
  const FONTS = {
    'Barlow Condensed': '"Barlow Condensed", "Arial Narrow", "Helvetica Neue", sans-serif',
    'Barlow Semi Condensed': '"Barlow Semi Condensed", "Helvetica Neue", Arial, sans-serif',
    'Barlow': '"Barlow", "Helvetica Neue", Arial, sans-serif'
  };
  const LEVELS = [['hero', 'Hero', 40, 140], ['title', 'Page title', 32, 120], ['section', 'Section heading', 28, 96], ['statement', 'Statement', 22, 72],
    ['wordmark', 'Wordmark', 14, 44], ['lead', 'Lead', 14, 30], ['body', 'Body', 13, 22], ['label', 'Label / nav', 10, 18], ['small', 'Small', 10, 18]];
  const ROLES = [['page-bg', 'Page background'], ['band-bg', 'Feature bands'], ['on-image', 'Text over photos'], ['link-col', 'Links'], ['btn-bg', 'Button fill'], ['btn-fg', 'Button text'],
    ['accent', 'Accent'], ['bar-bg', 'Delivery bar'], ['bar-fg', 'Delivery bar text'], ['footer-bg', 'Footer'], ['footer-fg', 'Footer text'], ['footer-mute', 'Footer muted text']];
  const HEADER = [['logo-h', 'Logo height', 32, 140, 'px'], ['logo-h-m', 'Logo, mobile', 24, 96, 'px'], ['header-pad', 'Header padding (above and below logo)', 0, 40, 'px'], ['wordmark-scale-m', 'Wordmark, mobile (× desktop size)', 0.4, 1, ''],
    ['brand-gap', 'Logo to name', 0, 48, 'px'], ['nav-gap', 'Between nav links', 8, 64, 'px'], ['nav-home-gap', 'Home icon to nav', 0, 64, 'px'], ['hdr-icon-drop', 'Icons up/down from baseline', -8, 8, 'px'], ['name-drop', 'Name and nav up/down against logo', -24, 24, 'px']];
  const TAGS = [['tag-bg-opacity', 'Background opacity', 0, 1, ''], ['tag-h', 'Height', 28, 72, 'px'], ['tag-pad', 'Side padding', 4, 32, 'px'], ['tag-gap', 'Icon to text', 4, 32, 'px'],
    ['tag-radius', 'Corner radius', 0, 36, 'px'], ['tag-icon-size', 'Icon size', 10, 48, 'px'], ['tag-size', 'Text size', 10, 24, 'px'], ['tag-ls', 'Letter spacing', 0, 0.3, 'em'], ['tag-wt', 'Weight', 300, 700, '']];
  const TAG_COLS = [['tag-bg', 'Background'], ['tag-fg', 'Text'], ['tag-icon', 'Icon']];
  const WALL = [['wall-opacity', 'Strength', 0, 1, ''], ['wall-motif', 'Mark size', 8, 140, 'px'], ['wall-gap', 'Spacing', 0, 160, 'px'],
    ['wall-tilt', 'Mark rotation', -180, 180, 'deg'], ['wall-angle', 'Pattern angle', -90, 90, 'deg']];
  const SPACE = [['gutter', 'Side margin', 16, 96, 'px'], ['section-gap', 'Section gap', 24, 200, 'px'],
    ['hero-img-h', 'Hero height', 240, 900, 'px'], ['hero-img-h-m', 'Hero, mobile', 200, 700, 'px'], ['radius', 'Corner radius', 0, 24, 'px'], ['mobile-scale', 'Mobile type scale', 0.5, 1, '']];

  let source = '';
  const initial = {};
  const KEY = 'jrs-lab-settings';
  const changed = (() => { try { return JSON.parse(sessionStorage.getItem(KEY)) || {}; } catch (_) { return {}; } })();
  const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify(changed)); } catch (_) {} };
  const val = n => String(changed[n] ?? initial[n] ?? getComputedStyle(root).getPropertyValue('--' + n)).trim();
  const frames = () => [...document.querySelectorAll('iframe.lab-frame')].map(f => { try { return f.contentDocument && f.contentDocument.documentElement; } catch (_) { return null; } }).filter(Boolean);
  const set = (n, v) => [root, ...frames()].forEach(el => v == null ? el.style.removeProperty('--' + n) : el.style.setProperty('--' + n, v));
  const put = (n, v) => { set(n, v); changed[n] = v; save(); meta(); };
  Object.entries(changed).forEach(([k, v]) => set(k, v));
  document.querySelectorAll('iframe.lab-frame').forEach(f => f.addEventListener('load', () => Object.entries(changed).forEach(([k, v]) => set(k, v))));

  const box = document.getElementById('lab-controls');
  const group = (title, key, open) => { const d = document.createElement('details'); d.className = 'lab-group'; d.dataset.key = key; d.open = !!open; d.innerHTML = `<summary>${title}</summary>`; box.appendChild(d); return d; };
  function range(parent, name, label, min, max, step, unit) {
    const id = 'c-' + name, v = parseFloat(val(name)) || 0;
    const row = document.createElement('div'); row.className = 'lab-ctl';
    row.innerHTML = `<label for="${id}">${label}</label><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${v}"><output>${v}${unit}</output>`;
    const inp = row.querySelector('input'), out = row.querySelector('output');
    inp.addEventListener('input', () => { out.textContent = inp.value + unit; put(name, inp.value + unit); });
    parent.appendChild(row); return inp;
  }
  function select(parent, name, label, options) {
    const id = 'c-' + name, cur = val(name);
    const row = document.createElement('div'); row.className = 'lab-ctl';
    row.innerHTML = `<label for="${id}">${label}</label><select id="${id}">${options.map(([v, t]) => `<option value='${v}'${v === cur ? ' selected' : ''}>${t}</option>`).join('')}</select>`;
    row.querySelector('select').addEventListener('change', e => put(name, e.target.value));
    parent.appendChild(row);
  }
  function toggle(parent, name, label) {
    const id = 'c-' + name;
    const row = document.createElement('div'); row.className = 'lab-ctl';
    row.innerHTML = `<label for="${id}">${label}</label><input type="checkbox" id="${id}"${parseFloat(val(name)) ? ' checked' : ''}>`;
    row.querySelector('input').addEventListener('change', e => put(name, e.target.checked ? '1' : '0'));
    parent.appendChild(row);
  }
  /* The wallpaper tile is an SVG built from three settings; in the labs it is rebuilt live as a data URL.
     The published site builds the same tile into /images/wallpaper.svg, so --wall-tile is never copied out. */
  function tile() {
    if (!window.wallpaperTile) return;
    const svg = window.wallpaperTile(parseFloat(val('wall-motif')), parseFloat(val('wall-gap')), parseFloat(val('wall-tilt')));
    put('wall-tile', `url("data:image/svg+xml,${encodeURIComponent(svg)}")`);
  }
  const palOpts = PAL.map(c => [`var(--${c})`, c]);

  function buildWall(open) {
    const w = group('Wallpaper', 'wall', open);
    toggle(w, 'wall-page', 'Behind pages');
    toggle(w, 'wall-bands', 'On feature bands');
    select(w, 'wall-col', 'Colour', palOpts);
    WALL.forEach(([k, label, min, max, unit]) => {
      const inp = range(w, k, label, min, max, unit === '' ? 0.01 : 1, unit);
      if (['wall-motif', 'wall-gap', 'wall-tilt'].includes(k)) inp.addEventListener('input', tile);
    });
  }
  function build() {
    box.innerHTML = '';
    if (box.dataset.only === 'wall') { buildWall(true); const r = group('Colour roles', 'roles'); ROLES.forEach(([k, label]) => select(r, k, label, palOpts)); return meta(); }
    const t = group('Typefaces', 'type', true);
    select(t, 'font-display', 'Display', Object.entries(FONTS).map(([k, v]) => [v, k]));
    select(t, 'font-body', 'Body', Object.entries(FONTS).map(([k, v]) => [v, k]));
    LEVELS.forEach(([k, name, min, max]) => {
      const g = group(name, k);
      range(g, k + '-size', 'Size', min, max, 1, 'px');
      range(g, k + '-lh', 'Line height', 0.8, 2, 0.01, '');
      range(g, k + '-ls', 'Letter spacing', -0.05, 0.3, 0.005, 'em');
      range(g, k + '-wt', 'Weight', 100, 700, 100, '');
      select(g, k + '-col', 'Colour', palOpts);
    });
    const r = group('Colour roles', 'roles');
    ROLES.forEach(([k, label]) => select(r, k, label, palOpts));
    const p = group('Palette', 'palette');
    PAL.forEach(c => {
      const row = document.createElement('div'); row.className = 'lab-ctl';
      row.innerHTML = `<label for="c-${c}">${c}</label><input type="color" id="c-${c}" value="${val(c).toLowerCase()}">`;
      row.querySelector('input').addEventListener('input', e => put(c, e.target.value.toUpperCase()));
      p.appendChild(row);
    });
    const h = group('Header and logo', 'header');
    HEADER.forEach(([k, label, min, max, unit]) => range(h, k, label, min, max, unit ? 1 : 0.01, unit));
    const tg = group('Photo tags', 'tags');
    TAG_COLS.forEach(([k, label]) => select(tg, k, label, palOpts));
    TAGS.forEach(([k, label, min, max, unit]) => range(tg, k, label, min, max, unit === 'px' ? 1 : unit === 'em' ? 0.005 : max > 1 ? 100 : 0.01, unit));
    buildWall(false);
    const s = group('Spacing and sizes', 'spacing');
    SPACE.forEach(([k, label, min, max, unit]) => range(s, k, label, min, max, unit ? 1 : 0.01, unit));
    meta();
  }

  /* Clicking any part of the page opens the controls that affect it.
     On these lab pages, links inside the site don't navigate (the lab bar still does). */
  const LEVEL_KEYS = LEVELS.map(l => l[0]);
  const AREAS = [['.tag', 'tags'], ['.dbar', 'small roles'], ['.hdr', 'header wordmark label roles'], ['.ftr', 'section label body small roles']];
  const onClick = (e, framed) => {
    const t = e.target;
    if (!t || !t.closest || t.closest('.lab-panel, .lab-bar, .ovl')) return;
    if (!t.closest('.site')) return;
    const a = t.closest('a[href]'); if (a) e.preventDefault();
    const keys = [];
    const lvl = t.closest('[class*="t-"]');
    const m = lvl && lvl.className.match(/(?:^|\s)t-([a-z]+)/);
    if (m && LEVEL_KEYS.includes(m[1])) keys.push(m[1]);
    let block = t.closest('[data-ctl], .spec-row[data-level]');
    if (block) keys.push(...(block.dataset.ctl || block.dataset.level).split(' '));
    else { const hit = AREAS.find(([sel]) => t.closest(sel)); if (hit) { block = t.closest(hit[0]); keys.push(...hit[1].split(' ')); } }
    if (!keys.length) return;
    box.querySelectorAll('.lab-group').forEach(g => { g.open = keys.includes(g.dataset.key); });
    const first = box.querySelector(`.lab-group[data-key="${keys[0]}"]`);
    if (first) first.scrollIntoView({ block: 'nearest' });
    document.querySelectorAll('.lab-on').forEach(el => el.classList.remove('lab-on'));
    if (block && !framed) { block.classList.add('lab-on'); setTimeout(() => block.classList.remove('lab-on'), 1200); }
  };
  document.addEventListener('click', e => onClick(e));
  /* Clicks inside the phone-width frames open controls too; their links don't navigate either */
  document.querySelectorAll('iframe.lab-frame').forEach(f => f.addEventListener('load', () => {
    try { f.contentDocument.addEventListener('click', e => onClick(e, true)); } catch (_) {}
  }));
  function meta() {
    document.querySelectorAll('.spec-row[data-level]').forEach(row => {
      const k = row.dataset.level, cs = getComputedStyle(root);
      const g = n => cs.getPropertyValue(`--${k}-${n}`).trim();
      row.querySelector('.js-meta').textContent = `${g('size')} / ${g('lh')} / ${g('ls')} / ${g('wt')}`;
    });
  }

  function output() {
    let text = source;
    const keep = Object.entries(changed).filter(([k]) => k !== 'wall-tile');
    if (!text) return keep.map(([k, v]) => `  --${k}: ${v};`).join('\n');
    keep.forEach(([k, v]) => {
      text = text.replace(new RegExp(`(--${k.replace(/[-]/g, '\\-')}:\\s*)([^;]+)`), (m, a) => a + v);
    });
    return text;
  }
  document.getElementById('lab-copy').addEventListener('click', async () => {
    const out = document.getElementById('lab-out');
    out.value = output(); out.hidden = false;
    try { await navigator.clipboard.writeText(out.value); document.getElementById('lab-copy').textContent = 'Copied'; }
    catch (_) { out.select(); }
    setTimeout(() => { document.getElementById('lab-copy').textContent = 'Copy settings.css'; }, 2000);
  });
  document.getElementById('lab-reset').addEventListener('click', () => {
    Object.keys(changed).forEach(k => { set(k, null); delete changed[k]; });
    save(); build();
  });

  /* Read the real settings file so values (including role names like var(--sun)) come from it */
  fetch((document.querySelector('link[href$="settings.css"]') || {}).href || '/css/settings.css').then(r => r.ok ? r.text() : '').then(t => {
    source = t;
    (t.match(/--[\w-]+:\s*[^;]+/g) || []).forEach(d => { const i = d.indexOf(':'); initial[d.slice(2, i).trim()] = d.slice(i + 1).trim(); });
  }).catch(() => {}).finally(build);

  const l = document.createElement('link'); l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@200;300;400;500;600;700&display=swap';
  document.head.appendChild(l);
})();
