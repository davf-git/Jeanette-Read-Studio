/* Jeanette Read Studio – site script.
   Header, mobile menu, search, filters, sort, colourways, product page. Products are sold through Etsy. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---- Overlays: mobile menu, enquiry panel (Art page) ---- */
  let lastTrigger = null;
  function openOverlay(id, trigger) {
    const o = document.getElementById(id); if (!o) return;
    closeAll(false);
    lastTrigger = trigger || null;
    o.classList.add('is-open'); o.setAttribute('aria-hidden', 'false');
    $$(`[aria-controls="${id}"]`).forEach(b => b.setAttribute('aria-expanded', 'true'));
    if (id === 'ovl-enquire') fillEnquiry(o, trigger);
    const f = $('aside [data-close]', o); if (f) setTimeout(() => f.focus(), 50);
  }
  function closeAll(refocus = true) {
    $$('.ovl.is-open').forEach(o => {
      o.classList.remove('is-open'); o.setAttribute('aria-hidden', 'true');
      $$(`[aria-controls="${o.id}"]`).forEach(b => b.setAttribute('aria-expanded', 'false'));
    });
    if (refocus && lastTrigger) { lastTrigger.focus(); lastTrigger = null; }
  }
  document.addEventListener('click', e => {
    const op = e.target.closest('[data-open]');
    if (op) { e.preventDefault(); openOverlay('ovl-' + op.dataset.open, op); return; }
    if (e.target.closest('[data-close]')) { e.preventDefault(); closeAll(); return; }
    const tg = e.target.closest('[data-toggle="search"]');
    if (tg) {
      const box = document.getElementById('hdr-search'); box.hidden = !box.hidden;
      tg.setAttribute('aria-expanded', String(!box.hidden));
      if (!box.hidden) $('input', box).focus();
    }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

  /* Enquiry panel: show the artwork the visitor clicked (or the general commissions text) and start the message */
  let lastPrefill = '';
  function fillEnquiry(o, t) {
    const title = t && t.dataset.enqTitle;
    $('.js-enq-work', o).hidden = !title;
    $$('.js-enq-general', o).forEach(el => { el.hidden = !!title; });
    $('.js-enq-field', o).value = title || '';
    if (title) {
      $('.js-enq-title', o).textContent = title;
      $('.js-enq-meta', o).textContent = t.dataset.enqMeta || '';
      const box = $('.js-enq-img', o);
      box.innerHTML = t.dataset.enqImg ? `<img src="${t.dataset.enqImg}" alt="">` : `<div class="art-ph art-ph--${t.dataset.enqPh || 1}"></div>`;
    }
    const panel = o.querySelector('aside');
    if (title) { panel.setAttribute('aria-labelledby', 'enq-title'); panel.removeAttribute('aria-label'); }
    else { panel.removeAttribute('aria-labelledby'); panel.setAttribute('aria-label', $('.js-enq-general', o).textContent); }
    const msg = $('.js-enq-msg', o), start = title ? `I'm interested in "${title}". ` : '';
    if (!msg.value || msg.value === lastPrefill) msg.value = start;
    lastPrefill = start;
    const status = $('[role="status"]', o); if (status) status.textContent = '';
  }

  /* ---- Compact header on scroll ---- */
  const onScroll = () => $$('.hdr').forEach(h => h.classList.toggle('is-compact', window.scrollY > 80));
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Filters (Homeware, Home "New in", Art) ----
     Chips: [data-filter] inside [data-filter-scope]. Items: [data-type]. Count: .js-count with data-unit. */
  function applyFilter(scope, value) {
    $$('[data-filter]', scope).forEach(c => c.setAttribute('aria-pressed', String(c.dataset.filter === value)));
    const items = $$('[data-type]', scope);
    items.forEach(c => c.hidden = !(value === 'All' || c.dataset.type === value));
    const n = items.filter(c => !c.hidden).length;
    const cnt = $('.js-count', scope);
    if (cnt) { const u = (cnt.dataset.unit || 'product,products').split(','); cnt.textContent = n + ' ' + (n === 1 ? u[0] : u[1]); }
  }
  document.addEventListener('click', e => {
    const chip = e.target.closest('[data-filter]'); if (!chip) return;
    applyFilter(chip.closest('[data-filter-scope]') || document, chip.dataset.filter);
  });
  /* Tags on the staged photo: set the filter and scroll to the grid */
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-tag-filter]'); if (!t) return;
    e.preventDefault();
    const scope = $('[data-filter-scope]'); if (!scope) return;
    applyFilter(scope, t.dataset.tagFilter);
    const grid = $('[data-grid]', scope) || scope;
    grid.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });

  /* ---- Sort (Homeware page). Cards carry data-order, data-new (yyyy-mm-dd), data-price-pence ---- */
  document.addEventListener('change', e => {
    const s = e.target.closest('[data-sort]'); if (!s) return;
    const grid = $('[data-grid]', s.closest('[data-filter-scope]') || document); if (!grid) return;
    const key = s.value;
    const num = (c, a) => c.dataset[a] === '' || c.dataset[a] == null ? Infinity : +c.dataset[a];
    const cards = $$('.card', grid);
    cards.sort((a, b) => {
      if (key === 'newest') return (b.dataset.new || '').localeCompare(a.dataset.new || '');
      if (key === 'price-asc') return num(a, 'pricePence') - num(b, 'pricePence');
      if (key === 'price-desc') return (num(b, 'pricePence') === Infinity ? -1 : num(b, 'pricePence')) - (num(a, 'pricePence') === Infinity ? -1 : num(a, 'pricePence'));
      return +a.dataset.order - +b.dataset.order;
    }).forEach(c => grid.appendChild(c));
  });

  /* ---- Colourway swatches on product cards ---- */
  document.addEventListener('click', e => {
    const sw = e.target.closest('.swatch[data-cw]'); if (!sw) return;
    e.preventDefault();
    const card = sw.closest('.card'); const i = sw.dataset.cw;
    card.dataset.colourway = i;
    $$('.swatch', card).forEach(s => s.setAttribute('aria-pressed', String(s === sw)));
    $$('.card__layer', card).forEach((l, n) => l.classList.toggle('is-on', String(n) === i));
    const name = $('.js-cw-name', card); if (name) name.textContent = sw.getAttribute('aria-label');
  });

  /* ---- Product page: gallery thumbs, colourway ---- */
  document.addEventListener('click', e => {
    const th = e.target.closest('.thumb[data-src]');
    if (th) {
      const main = $('.gallery__main'); if (!main) return;
      $$('.thumb').forEach(t => t.setAttribute('aria-pressed', String(t === th)));
      main.innerHTML = th.dataset.src ? `<img src="${th.dataset.src}" alt="${th.dataset.alt || ''}">` : '';
      main.className = 'imgbox gallery__main ' + (th.dataset.ground || '');
      if (main.matches('button')) main.insertAdjacentHTML('beforeend', '<span class="zoom-hint" aria-hidden="true"><svg><use href="#i-search"/></svg>Zoom</span>');
      const cap = $('.js-gallery-cap'); if (cap) cap.textContent = th.dataset.cap || '';
      return;
    }
    const dot = e.target.closest('.dot[data-variant]');
    if (dot) {
      const fs = dot.closest('fieldset');
      $$('.dot', fs).forEach(d => d.setAttribute('aria-pressed', String(d === dot)));
      const n = $('.js-variant-name', fs); if (n) n.textContent = dot.getAttribute('aria-label');
      const main = $('.gallery__main');
      if (main && dot.dataset.image) main.innerHTML = `<img src="${dot.dataset.image}" alt="">`;
    }
  });

  /* ---- Artwork pages: "See it on a wall", full-screen viewer with zoom ----
     Zoom stops at the picture's own size, so nothing is shown larger than the file (about 2000 px). */
  document.addEventListener('click', e => {
    if (!e.target.closest('[data-show-room]')) return;
    const t = $('.thumb[data-room]'); if (t) { t.click(); $('.gallery__main').scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  });
  const mainPic = $('.gallery__main[data-viewer]');
  if (mainPic) {
    const thumbs = $$('.awork .thumb[data-src]');
    const pics = thumbs.length ? thumbs.map(t => ({ src: t.dataset.src, alt: t.dataset.alt, cap: t.dataset.cap }))
      : [{ src: $('img', mainPic).getAttribute('src'), alt: $('img', mainPic).alt, cap: ($('.js-gallery-cap') || {}).textContent || '' }];
    const v = document.createElement('div');
    v.className = 'viewer'; v.hidden = true; v.setAttribute('role', 'dialog'); v.setAttribute('aria-modal', 'true'); v.setAttribute('aria-label', 'Full-screen view');
    v.innerHTML = `<div class="v-bar"><span class="js-v-cap"></span><div class="v-tools">
        <button type="button" class="v-btn js-v-out" aria-label="Zoom out">−</button><span class="v-level js-v-level">100%</span>
        <button type="button" class="v-btn js-v-in" aria-label="Zoom in">+</button><button type="button" class="v-btn js-v-close">Close</button></div></div>
      <div class="v-area js-v-area">${pics.length > 1 ? '<button type="button" class="v-btn v-nav v-prev js-v-prev" aria-label="Previous picture">‹</button><button type="button" class="v-btn v-nav v-next js-v-next" aria-label="Next picture">›</button>' : ''}<img alt=""></div>
      <div class="v-bar v-bar--foot"><span class="v-hint">Scroll, pinch or double-click to zoom. Drag to move around.${pics.length > 1 ? ' Arrow keys change picture.' : ''}</span><span class="js-v-count"></span></div>`;
    document.body.appendChild(v);
    const area = $('.js-v-area', v), img = $('img', area), q = c => $(c, v);
    let cur = 0, s = 1, fit = 1, maxS = 1, x = 0, y = 0, back = null; const ptr = new Map(); let d0 = 0, s0 = 1;
    const clampXY = () => { const r = area.getBoundingClientRect(); const mx = Math.max(0, (img.naturalWidth * s - r.width) / 2), my = Math.max(0, (img.naturalHeight * s - r.height) / 2); x = Math.min(mx, Math.max(-mx, x)); y = Math.min(my, Math.max(-my, y)); };
    const draw = () => { clampXY(); img.style.transform = `translate(${x - img.naturalWidth * s / 2}px, ${y - img.naturalHeight * s / 2}px) scale(${s})`;
      q('.js-v-level').textContent = Math.round(s / fit * 100) + '%'; q('.js-v-in').disabled = s >= maxS - 1e-3; q('.js-v-out').disabled = s <= fit + 1e-3; };
    const fitNow = () => { const r = area.getBoundingClientRect(); if (!img.naturalWidth) return; fit = Math.min((r.width - 32) / img.naturalWidth, (r.height - 32) / img.naturalHeight, 1); maxS = Math.max(fit, 1); s = fit; x = y = 0; draw(); };
    const zoomAt = (ns, cx, cy) => { ns = Math.min(maxS, Math.max(fit, ns)); const r = area.getBoundingClientRect(); const px = cx - r.left - r.width / 2, py = cy - r.top - r.height / 2; x = px - (px - x) * ns / s; y = py - (py - y) * ns / s; s = ns; draw(); };
    const mid = () => { const r = area.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
    const go = i => { cur = (i + pics.length) % pics.length; img.onload = fitNow; img.src = pics[cur].src; img.alt = pics[cur].alt || '';
      q('.js-v-cap').textContent = pics[cur].cap || ''; q('.js-v-count').textContent = pics.length > 1 ? `${cur + 1} of ${pics.length}` : ''; if (img.complete) fitNow(); };
    const openV = () => { back = document.activeElement; const on = thumbs.findIndex(t => t.getAttribute('aria-pressed') === 'true'); v.hidden = false; document.documentElement.style.overflow = 'hidden'; go(on < 0 ? 0 : on); q('.js-v-close').focus(); };
    const closeV = () => { v.hidden = true; document.documentElement.style.overflow = ''; if (thumbs[cur]) thumbs[cur].click(); if (back) back.focus(); };
    mainPic.addEventListener('click', openV);
    q('.js-v-close').addEventListener('click', closeV);
    q('.js-v-in').addEventListener('click', () => zoomAt(s * 1.5, ...mid()));
    q('.js-v-out').addEventListener('click', () => zoomAt(s / 1.5, ...mid()));
    if (pics.length > 1) { q('.js-v-prev').addEventListener('click', () => go(cur - 1)); q('.js-v-next').addEventListener('click', () => go(cur + 1)); }
    area.addEventListener('wheel', e => { e.preventDefault(); zoomAt(s * Math.exp(-e.deltaY * 0.0015), e.clientX, e.clientY); }, { passive: false });
    area.addEventListener('dblclick', e => { if (!e.target.closest('.v-nav')) zoomAt(s > fit * 1.05 ? fit : maxS, e.clientX, e.clientY); });
    area.addEventListener('pointerdown', e => { if (e.target.closest('.v-nav')) return; area.setPointerCapture(e.pointerId); ptr.set(e.pointerId, [e.clientX, e.clientY]); area.classList.add('is-drag');
      if (ptr.size === 2) { const [a, b] = [...ptr.values()]; d0 = Math.hypot(a[0] - b[0], a[1] - b[1]); s0 = s; } });
    area.addEventListener('pointermove', e => { if (!ptr.has(e.pointerId)) return; const p0 = ptr.get(e.pointerId); ptr.set(e.pointerId, [e.clientX, e.clientY]);
      if (ptr.size === 2) { const [a, b] = [...ptr.values()]; zoomAt(s0 * Math.hypot(a[0] - b[0], a[1] - b[1]) / d0, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); }
      else { x += e.clientX - p0[0]; y += e.clientY - p0[1]; draw(); } });
    const up = e => { ptr.delete(e.pointerId); if (!ptr.size) area.classList.remove('is-drag'); };
    area.addEventListener('pointerup', up); area.addEventListener('pointercancel', up);
    img.addEventListener('contextmenu', e => e.preventDefault());
    window.addEventListener('resize', () => { if (!v.hidden) fitNow(); });
    document.addEventListener('keydown', e => { if (v.hidden) return;
      if (e.key === 'Escape') { e.stopImmediatePropagation(); closeV(); } else if (e.key === 'ArrowLeft' && pics.length > 1) go(cur - 1); else if (e.key === 'ArrowRight' && pics.length > 1) go(cur + 1);
      else if (e.key === '+' || e.key === '=') zoomAt(s * 1.5, ...mid()); else if (e.key === '-') zoomAt(s / 1.5, ...mid()); }, true);
  }

  /* ---- Forms: placeholders until a backend is connected ---- */
  document.addEventListener('submit', e => {
    const f = e.target.closest('[data-form]'); if (!f) return;
    e.preventDefault();
    const msg = $('[role="status"]', f);
    if (f.dataset.form === 'newsletter') {
      const em = f.querySelector('input[type=email]');
      msg.textContent = em.checkValidity() && em.value ? 'Thanks. (Sign-up is not connected yet.)' : 'Enter an email address, for example name@example.com.';
    }
    if (f.dataset.form === 'contact' && msg) msg.textContent = f.checkValidity() ? 'Thanks. (The form is not connected yet.)' : 'Please fill in your name, email and message.';
  });
})();
