/* Jeanette Read Studio – site script.
   Header, mobile menu, search, filters, sort, colourways, product page, basket (front end only). */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---- Overlays: basket drawer and mobile menu ---- */
  let lastTrigger = null;
  function openOverlay(id, trigger) {
    const o = document.getElementById(id); if (!o) return;
    closeAll(false);
    lastTrigger = trigger || null;
    o.classList.add('is-open'); o.setAttribute('aria-hidden', 'false');
    $$(`[aria-controls="${id}"]`).forEach(b => b.setAttribute('aria-expanded', 'true'));
    const f = $('.drawer__head [data-close], .mpanel__top [data-close]', o); if (f) setTimeout(() => f.focus(), 50);
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
    if (op) { e.preventDefault(); openOverlay(op.dataset.open === 'basket' ? 'ovl-basket' : 'ovl-menu', op); return; }
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

  /* ---- Product page: gallery thumbs, colourway, quantity ---- */
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
      const add = $('[data-action="add-to-basket"]'); if (add) { add.dataset.variant = dot.dataset.variant; add.dataset.variantName = dot.getAttribute('aria-label'); }
      const main = $('.gallery__main');
      if (main && dot.dataset.image) { main.innerHTML = `<img src="${dot.dataset.image}" alt="">`; if (add) add.dataset.img = dot.dataset.image; }
      return;
    }
    const q = e.target.closest('[data-qty-step]');
    if (q) {
      const out = $('output', q.closest('.qty'));
      const v = Math.max(1, +out.value + +q.dataset.qtyStep); out.value = v; out.textContent = v;
      const add = $('[data-action="add-to-basket"]'); if (add) add.dataset.qty = v;
    }
  });

  /* ---- Basket (front end only; see HANDOVER.md) ----
     State is kept in sessionStorage so it survives moving between pages while designing.
     Item: {productId, variant, variantName, name, quantity, pricePence (int or null), img} */
  const KEY = 'jrs-basket';
  const gbp = p => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(p / 100);
  function load() { try { return JSON.parse(sessionStorage.getItem(KEY)) || []; } catch (_) { return mem; } }
  let mem = [];
  function save(list) { mem = list; try { sessionStorage.setItem(KEY, JSON.stringify(list)); } catch (_) {} }
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function itemHTML(i, n) {
    const price = i.pricePence == null ? '[£ price]' : gbp(i.pricePence * i.quantity);
    const img = i.img ? `<img src="${esc(i.img)}" alt="">` : '';
    return `<li class="bk-item" data-index="${n}" data-product-id="${esc(i.productId)}" data-variant="${esc(i.variant)}" data-qty="${i.quantity}" data-price-pence="${i.pricePence == null ? '' : i.pricePence}">
      <div class="imgbox pat-tri cw-0">${img}</div>
      <div class="bk-item__info">
        <div class="bk-item__top"><span>${esc(i.name)}</span><span class="bk-price">${price}</span></div>
        <span class="t-small">${esc(i.variantName || i.variant)}</span>
        <div class="bk-item__bottom">
          <div class="bk-qty">
            <button type="button" data-bk="dec" aria-label="Decrease quantity"><svg><use href="#i-minus"/></svg></button>
            <output aria-live="polite">${i.quantity}</output>
            <button type="button" data-bk="inc" aria-label="Increase quantity"><svg><use href="#i-plus"/></svg></button>
          </div>
          <button class="bk-remove" type="button" data-bk="remove">Remove</button>
        </div>
      </div>
    </li>`;
  }
  function render() {
    const list = load();
    const count = list.reduce((n, i) => n + i.quantity, 0);
    const priced = list.length > 0 && list.every(i => i.pricePence != null);
    const sub = priced ? list.reduce((n, i) => n + i.quantity * i.pricePence, 0) : null;
    $$('[data-basket-list]').forEach(ul => ul.innerHTML = list.map(itemHTML).join(''));
    $$('.js-bk-count').forEach(b => { b.textContent = count; b.hidden = count === 0; });
    $$('.js-bk-count-text').forEach(b => b.textContent = count);
    $$('[data-open="basket"]').forEach(b => b.setAttribute('aria-label', `Open basket, ${count} item${count === 1 ? '' : 's'}`));
    $$('.js-bk-subtotal').forEach(s => s.textContent = sub == null ? '[£ price]' : gbp(sub));
    $$('.js-bk-empty').forEach(el => el.hidden = count > 0);
    $$('.js-bk-full').forEach(el => el.hidden = count === 0);
    document.dispatchEvent(new CustomEvent('jrs:basket-change', { detail: { items: list, count, subtotalPence: sub } }));
  }
  function add(item) {
    const list = load();
    const same = list.find(i => i.productId === item.productId && i.variant === item.variant);
    if (same) same.quantity += item.quantity; else list.push(item);
    save(list); render();
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-bk]'); if (!b) return;
    const li = b.closest('.bk-item'); const n = +li.dataset.index; const list = load();
    if (b.dataset.bk === 'inc') list[n].quantity++;
    if (b.dataset.bk === 'dec') { if (list[n].quantity > 1) list[n].quantity--; else list.splice(n, 1); }
    if (b.dataset.bk === 'remove') list.splice(n, 1);
    save(list); render();
  });
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-action="add-to-basket"]'); if (!a) return;
    add({
      productId: a.dataset.productId, variant: a.dataset.variant, variantName: a.dataset.variantName || '',
      name: a.dataset.name, quantity: +(a.dataset.qty || 1),
      pricePence: a.dataset.pricePence === '' || a.dataset.pricePence == null ? null : +a.dataset.pricePence,
      img: a.dataset.img ? new URL(a.dataset.img, location.href).href : ''
    });
    const msg = $('.js-added'); if (msg) msg.hidden = false;
    openOverlay('ovl-basket', a);
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('[data-action="checkout"]')) return;
    e.preventDefault();
    $$('.js-checkout-msg').forEach(m => { m.hidden = false; m.textContent = 'Checkout is not connected yet.'; });
  });
  window.JRSBasket = { items: load, add, render, clear: () => { save([]); render(); } };
  render();

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
