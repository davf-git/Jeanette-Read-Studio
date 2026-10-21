/* Style lab. Labs only, not part of the live site.
   Sliders set CSS custom properties on this page. "Copy settings.css" writes the
   current values into the text of css/settings.css so it can be pasted back. */
(() => {
  const root = document.documentElement;
  const PAL = ['sand', 'dune', 'wet-sand', 'driftwood', 'deep-sea', 'open-sea', 'shallows', 'sun', 'coral', 'slate', 'pebble'];
  const FONTS = {
    'Barlow Condensed': '"Barlow Condensed", "Arial Narrow", "Helvetica Neue", sans-serif',
    'Barlow Semi Condensed': '"Barlow Semi Condensed", "Helvetica Neue", Arial, sans-serif',
    'Barlow': '"Barlow", "Helvetica Neue", Arial, sans-serif'
  };
  const LEVELS = [['hero', 'Hero', 40, 140], ['title', 'Page title', 32, 120], ['section', 'Section heading', 28, 96], ['statement', 'Statement', 22, 72],
    ['wordmark', 'Wordmark', 14, 44], ['lead', 'Lead', 14, 30], ['body', 'Body', 13, 22], ['label', 'Label / nav', 10, 18], ['small', 'Small', 10, 18]];
  const ROLES = [['page-bg', 'Page background'], ['band-bg', 'Feature bands'], ['on-image', 'Text over photos'], ['link-col', 'Links'], ['btn-bg', 'Button fill'], ['btn-fg', 'Button text'],
    ['accent', 'Accent'], ['bar-bg', 'Delivery bar'], ['bar-fg', 'Delivery bar text'], ['footer-bg', 'Footer'], ['footer-fg', 'Footer text'], ['footer-mute', 'Footer muted text']];
  const SPACE = [['gutter', 'Side margin', 16, 96, 'px'], ['section-gap', 'Section gap', 24, 200, 'px'], ['logo-h', 'Logo height', 32, 140, 'px'], ['logo-h-m', 'Logo, mobile', 24, 80, 'px'],
    ['hero-img-h', 'Hero height', 240, 900, 'px'], ['hero-img-h-m', 'Hero, mobile', 200, 700, 'px'], ['radius', 'Corner radius', 0, 24, 'px'], ['mobile-scale', 'Mobile type scale', 0.5, 1, '']];

  let source = '';
  const initial = {};
  const val = n => (initial[n] ?? getComputedStyle(root).getPropertyValue('--' + n)).trim();
  const set = (n, v) => root.style.setProperty('--' + n, v);
  const changed = {};
  const put = (n, v) => { set(n, v); changed[n] = v; meta(); };

  const box = document.getElementById('lab-controls');
  const group = (title, open) => { const d = document.createElement('details'); d.className = 'lab-group'; d.open = !!open; d.innerHTML = `<summary>${title}</summary>`; box.appendChild(d); return d; };
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
  const palOpts = PAL.map(c => [`var(--${c})`, c]);

  function build() {
    box.innerHTML = '';
    const t = group('Typefaces', true);
    select(t, 'font-display', 'Display', Object.entries(FONTS).map(([k, v]) => [v, k]));
    select(t, 'font-body', 'Body', Object.entries(FONTS).map(([k, v]) => [v, k]));
    LEVELS.forEach(([k, name, min, max]) => {
      const g = group(name);
      g.dataset.level = k;
      range(g, k + '-size', 'Size', min, max, 1, 'px');
      range(g, k + '-lh', 'Line height', 0.8, 2, 0.01, '');
      range(g, k + '-ls', 'Letter spacing', -0.05, 0.3, 0.005, 'em');
      range(g, k + '-wt', 'Weight', 100, 700, 100, '');
      select(g, k + '-col', 'Colour', palOpts);
    });
    const r = group('Colour roles');
    ROLES.forEach(([k, label]) => select(r, k, label, palOpts));
    const p = group('Palette');
    PAL.forEach(c => {
      const row = document.createElement('div'); row.className = 'lab-ctl';
      row.innerHTML = `<label for="c-${c}">${c}</label><input type="color" id="c-${c}" value="${val(c).toLowerCase()}">`;
      row.querySelector('input').addEventListener('input', e => put(c, e.target.value.toUpperCase()));
      p.appendChild(row);
    });
    const s = group('Spacing and sizes');
    SPACE.forEach(([k, label, min, max, unit]) => range(s, k, label, min, max, unit ? 1 : 0.01, unit));
    meta();
  }

  /* Clicking a sample opens its controls */
  document.addEventListener('click', e => {
    const row = e.target.closest('.spec-row[data-level]'); if (!row) return;
    const g = box.querySelector(`.lab-group[data-level="${row.dataset.level}"]`);
    if (g) { g.open = true; g.scrollIntoView({ block: 'nearest' }); }
  });
  function meta() {
    document.querySelectorAll('.spec-row[data-level]').forEach(row => {
      const k = row.dataset.level, cs = getComputedStyle(root);
      const g = n => cs.getPropertyValue(`--${k}-${n}`).trim();
      row.querySelector('.js-meta').textContent = `${g('size')} / ${g('lh')} / ${g('ls')} / ${g('wt')}`;
    });
  }

  function output() {
    let text = source;
    if (!text) return Object.entries(changed).map(([k, v]) => `  --${k}: ${v};`).join('\n');
    Object.entries(changed).forEach(([k, v]) => {
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
    Object.keys(changed).forEach(k => { root.style.removeProperty('--' + k); delete changed[k]; });
    build();
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
