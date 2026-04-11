/* ──────────────────────────────────────────
   Nagy Custom Remodeling — Cookie Consent
   Stores choice in localStorage.
   Key: ncr_consent  |  Values: "accepted" | "declined"
   ────────────────────────────────────────── */

(function () {
  const KEY = 'ncr_consent';

  // If already answered, do nothing
  if (localStorage.getItem(KEY)) return;

  // Inject styles
  const style = document.createElement('style');
  style.textContent = [
    '#ncr-consent{',
      'position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);',
      'z-index:9999;width:calc(100% - 3rem);max-width:680px;',
      'background:#1A1A1A;color:#F0F0F0;',
      'border:1px solid rgba(255,255,255,.1);',
      'padding:1.25rem 1.5rem;',
      'display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap;',
      'box-shadow:0 8px 40px rgba(0,0,0,.35);',
      "font-family:'DM Sans',sans-serif;",
      'animation:ncr-in .35s cubic-bezier(.22,.68,0,1.2) both;',
    '}',
    '@keyframes ncr-in{',
      'from{opacity:0;transform:translateX(-50%) translateY(16px);}',
      'to{opacity:1;transform:translateX(-50%) translateY(0);}',
    '}',
    '#ncr-consent.ncr-out{animation:ncr-out .3s ease forwards;}',
    '@keyframes ncr-out{to{opacity:0;transform:translateX(-50%) translateY(20px);}}',
    '#ncr-consent p{flex:1;font-size:.82rem;line-height:1.65;color:#ABABAB;margin:0;}',
    '#ncr-consent a{color:#B5572E;text-decoration:none;}',
    '#ncr-consent a:hover{text-decoration:underline;}',
    '#ncr-btns{display:flex;gap:.625rem;flex-shrink:0;}',
    '#ncr-accept,#ncr-decline{',
      "font-family:'DM Sans',sans-serif;",
      'font-size:.68rem;font-weight:600;letter-spacing:.1em;',
      'text-transform:uppercase;border:none;cursor:pointer;',
      'padding:.6rem 1.25rem;transition:opacity .2s,transform .2s;',
    '}',
    '#ncr-accept{background:#B5572E;color:#fff;}',
    '#ncr-accept:hover{opacity:.9;transform:translateY(-1px);}',
    '#ncr-decline{background:transparent;color:#6A6A6A;border:1px solid rgba(255,255,255,.15);}',
    '#ncr-decline:hover{color:#ABABAB;border-color:rgba(255,255,255,.3);}',
    '@media(max-width:540px){',
      '#ncr-consent{flex-direction:column;gap:1rem;}',
      '#ncr-btns{width:100%;justify-content:flex-end;}',
    '}'
  ].join('');
  document.head.appendChild(style);

  // Build banner using safe DOM methods (no innerHTML)
  const banner = document.createElement('div');
  banner.id = 'ncr-consent';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Cookie consent');

  const msg = document.createElement('p');
  msg.appendChild(document.createTextNode('We use cookies to improve your experience. See our '));
  const link = document.createElement('a');
  link.href = '/privacy/';
  link.textContent = 'Privacy Policy';
  msg.appendChild(link);
  msg.appendChild(document.createTextNode(' for details.'));

  const btns = document.createElement('div');
  btns.id = 'ncr-btns';

  const btnDecline = document.createElement('button');
  btnDecline.id = 'ncr-decline';
  btnDecline.textContent = 'Decline';

  const btnAccept = document.createElement('button');
  btnAccept.id = 'ncr-accept';
  btnAccept.textContent = 'Accept';

  btns.appendChild(btnDecline);
  btns.appendChild(btnAccept);
  banner.appendChild(msg);
  banner.appendChild(btns);
  document.body.appendChild(banner);

  function dismiss(choice) {
    localStorage.setItem(KEY, choice);
    banner.classList.add('ncr-out');
    setTimeout(() => banner.remove(), 350);
  }

  btnAccept.addEventListener('click', function () { dismiss('accepted'); });
  btnDecline.addEventListener('click', function () { dismiss('declined'); });
})();
