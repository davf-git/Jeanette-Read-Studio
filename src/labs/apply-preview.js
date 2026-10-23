/* Design preview only (added to pages by npm run build:preview, never the live build).
   Applies settings changed in the labs during this tab's session, and shows a small notice with a way to clear them. */
(() => {
  let s = {};
  try { s = JSON.parse(sessionStorage.getItem('jrs-lab-settings')) || {}; } catch (_) { return; }
  const keys = Object.keys(s); if (!keys.length) return;
  keys.forEach(k => document.documentElement.style.setProperty('--' + k, s[k]));
  document.addEventListener('DOMContentLoaded', () => {
    const n = document.createElement('div'); n.className = 'lab-applied';
    n.innerHTML = 'Showing unsaved lab settings <button type="button">Clear</button>';
    n.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:200;display:flex;gap:10px;align-items:center;padding:8px 12px;background:#1E2328;color:#E9E6E1;font:13px/1.3 system-ui,sans-serif;border-radius:6px';
    n.querySelector('button').style.cssText = 'font:inherit;padding:3px 8px;border:1px solid #C9CDD1;border-radius:4px;background:none;color:inherit;cursor:pointer';
    n.querySelector('button').addEventListener('click', () => { try { sessionStorage.removeItem('jrs-lab-settings'); } catch (_) {} location.reload(); });
    document.body.appendChild(n);
  });
})();
