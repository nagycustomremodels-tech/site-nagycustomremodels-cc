/* Nagy Custom Remodels — shared page script (loaded with defer) */
(function () {
  'use strict';
  var SMS_NUMBER = '+19045771257';
  var doc = document.documentElement;
  doc.classList.remove('no-js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Mobile menu ──
  var ham = document.getElementById('hamburger');
  var mob = document.getElementById('mobMenu');
  function menuOpen() { return !!mob && mob.classList.contains('open'); }
  function setMenu(open) {
    if (!ham || !mob || open === menuOpen()) return; // não mexe no overflow se nada mudou (lightbox)
    ham.setAttribute('aria-expanded', String(open));
    ham.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mob.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (ham && mob) {
    ham.addEventListener('click', function () { setMenu(!menuOpen()); });
    mob.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuOpen()) { setMenu(false); ham.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) setMenu(false); });
  }

  // ── Scroll reveal (rootMargin positivo: dispara antes de entrar na tela) ──
  var revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('active'); revealObserver.unobserve(e.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px 15% 0px' }) : null;
  function observeReveal(el) {
    if (revealObserver) revealObserver.observe(el); else el.classList.add('active');
  }
  document.querySelectorAll('.reveal').forEach(observeReveal);

  // ── Count-up stats ──
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion || isNaN(target)) { el.textContent = target + suffix; return; }
    var start = performance.now();
    (function tick(now) {
      var p = Math.min((now - start) / 1400, 1);
      el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { countUp(e.target); countObserver.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { countObserver.observe(el); });
  }

  // ── Vídeos: preload="none" + play só depois do load e quando visíveis (não pesam no carregamento);
  //    respeita reduced-motion + botão de pausa (WCAG 2.2.2) ──
  document.querySelectorAll('video[data-autoplay]').forEach(function (v) {
    if (reduceMotion) { v.controls = true; return; }
    var start = function () {
      var p = v.play();
      if (p && p.catch) p.catch(function () {}); // modo economia do iOS bloqueia: fica o pôster + botão Play
    };
    var whenLoaded = function () {
      if (!('IntersectionObserver' in window)) { start(); return; }
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { io.disconnect(); start(); }
      });
      io.observe(v);
    };
    if (document.readyState === 'complete') whenLoaded(); else window.addEventListener('load', whenLoaded);
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'video-toggle';
    var sync = function () {
      btn.textContent = v.paused ? 'Play' : 'Pause';
      btn.setAttribute('aria-label', (v.paused ? 'Play' : 'Pause') + ' video');
    };
    btn.addEventListener('click', function () { if (v.paused) v.play(); else v.pause(); });
    v.addEventListener('play', sync);
    v.addEventListener('pause', sync);
    sync();
    v.parentNode.appendChild(btn);
  });

  // ── Gallery filters (portfolio) ──
  var filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      document.querySelectorAll('.gal-item[data-cat]').forEach(function (item) {
        item.hidden = f !== 'all' && item.getAttribute('data-cat').split(' ').indexOf(f) === -1;
      });
    });
  });

  // ── Lightbox ──
  var lb = document.getElementById('lb');
  if (lb) {
    var lbImg = document.getElementById('lbImg');
    var lbCap = document.getElementById('lbCaption');
    var lbCount = document.getElementById('lbCounter');
    var lastFocus = null;
    var items = [];
    var current = 0;
    var visible = function () {
      return Array.prototype.filter.call(document.querySelectorAll('.gal-item[data-src]'), function (i) { return !i.hidden; });
    };
    var show = function (i) {
      current = (i + items.length) % items.length;
      var item = items[current];
      var img = item.querySelector('img');
      lbImg.src = item.getAttribute('data-src');
      lbImg.alt = img ? img.alt : '';
      lbCap.textContent = item.getAttribute('data-lbl') || '';
      lbCount.textContent = (current + 1) + ' / ' + items.length;
    };
    var open = function (item) {
      items = visible();
      lastFocus = document.activeElement;
      show(items.indexOf(item));
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
      document.getElementById('lbClose').focus();
    };
    var close = function () {
      lb.classList.remove('open');
      document.body.style.overflow = '';
      lbImg.removeAttribute('src');
      if (lastFocus) lastFocus.focus();
    };
    document.addEventListener('click', function (e) {
      var item = e.target.closest('.gal-item[data-src]');
      if (item) open(item);
    });
    document.getElementById('lbClose').addEventListener('click', close);
    document.getElementById('lbPrev').addEventListener('click', function () { show(current - 1); });
    document.getElementById('lbNext').addEventListener('click', function () { show(current + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
      if (e.key === 'Tab') { // mantém o foco dentro do lightbox
        var f = lb.querySelectorAll('button');
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  // ── Booking form → iMessage / SMS ──
  function localISODate(d) {
    var t = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return t.toISOString().slice(0, 10);
  }
  function smsLink(body) {
    if (body.toWellFormed) body = body.toWellFormed(); // surrogate solto faria encodeURIComponent lançar URIError
    // "?&body=" é aceito pelo iOS (Messages) e pelo Android
    return 'sms:' + SMS_NUMBER + '?&body=' + encodeURIComponent(body);
  }
  document.querySelectorAll('form[data-sms-form]').forEach(function (form) {
    var dateInput = form.querySelector('input[type="date"]');
    if (dateInput) dateInput.min = localISODate(new Date());
    var status = form.querySelector('.form-status');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var v = function (name) {
        var el = form.elements[name];
        return el ? String(el.value).trim().slice(0, 600) : '';
      };
      var lines = ["Hi Nagy! I'd like to book a consultation.", '', 'Name: ' + v('name'), 'Phone: ' + v('phone'), 'Service: ' + v('service')];
      if (v('city')) lines.push('City: ' + v('city'));
      if (v('date')) {
        var p = v('date').split('-');
        var when = new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        lines.push('Preferred date: ' + when + (v('time') ? ', ' + v('time') : ''));
      } else if (v('time')) {
        lines.push('Preferred time: ' + v('time'));
      }
      if (v('details')) lines.push('', 'Project: ' + v('details'));
      var body = lines.join('\n');
      // Sem app de SMS (ex.: Windows) o sms: não abre nada: copia o texto e não promete sucesso
      if (navigator.clipboard) navigator.clipboard.writeText(body).catch(function () {});
      if (status) status.textContent = 'Opening Messages… If nothing opens, call (904) 577-1257. Your request is copied so you can paste it in a text.';
      if (window.dataLayer) window.dataLayer.push({ event: 'booking_sms_open', service: v('service') });
      window.location.href = smsLink(body);
    });
  });

  // ── Footer year ──
  var fy = document.getElementById('footerYear');
  if (fy) fy.textContent = new Date().getFullYear();

  window.NCR = { observeReveal: observeReveal };
})();
