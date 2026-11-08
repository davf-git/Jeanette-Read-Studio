/* Jeanette Read Studio – site script.
   Header, mobile menu, search, filters, sort, colourways, product page. Products are sold through Etsy. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---- Overlay: mobile menu ---- */
  let lastTrigger = null;
  function openOverlay(id, trigger) {
    const o = document.getElementById(id); if (!o) return;
    closeAll(false);
    lastTrigger = trigger || null;
    o.classList.add('is-open'); o.setAttribute('aria-hidden', 'false');
    $$(`[aria-controls="${id}"]`).forEach(b => b.setAttribute('aria-expanded', 'true'));
    const f = $('.mpanel__top [data-close]', o); if (f) setTimeout(() => f.focus(), 50);
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
    if (op) { e.preventDefault(); openOverlay('ovl-menu', op); return; }
    if (e.target.closest('[data-close]')) { e.preventDefault(); closeAll(); return; }
    const tg = e.target.closest('[data-toggle="search"]');
    if (tg) {
      const box = document.getElementById('hdr-search'); box.hidden = !box.hidden;
      tg.setAttribute('aria-expanded', String(!box.hidden));
      if (!box.hidden) $('input', box).focus();
    }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

  /* ---- Compact header on scroll ---- */
  const onScroll = () => $$('.hdr').forEach(h => h.classList.toggle('is-compact', window.scrollY > 80));
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Filters (Shop, Home "New in", Art) ----
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

  /* ---- Sort (Shop). Cards carry data-order, data-new (yyyy-mm-dd), data-price-pence ---- */
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
