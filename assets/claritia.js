/* ═════════════════════════════════════════════════════════════
   claritia — CONFIGURACIÓN
   Lo único que hay que editar para publicar. Todo lo que está vacío
   se muestra en el sitio como placeholder marcado.
   ═════════════════════════════════════════════════════════════ */
const CONFIG = {
  // WhatsApp Business de claritia, solo dígitos: 52 + 10 dígitos. Ej. "5215512345678" o "525512345678"
  whatsapp: "",

  // Precio por sesión en pesos. Vacío = placeholder "$XXX MXN · Precio pendiente"
  price: "",                 // ej. "$450"
  priceUnit: "MXN por sesión",
  priceNote: "Sin costos ocultos. Pagas por sesión.",

  // Mensajes que aparecen ya escritos al abrir WhatsApp
  // Cada botón abre WhatsApp con su propio mensaje: así Dani sabe qué busca la persona
  // y, con la medición activa, se ve qué botón trae más conversaciones.
  messages: {
    general:  "Hola, me gustaría empezar con claritia.",          // Cierre: "Escríbenos. Solo eso." · Contacto
    talk:     "Hola, me gustaría hablar con alguien.",            // Barra superior · Hero
    start:    "Hola, quiero dar el primer paso.",                 // Cómo funciona
    book:     "Hola, me gustaría agendar mi primera sesión.",     // Botón flotante
    team:     "Hola, me gustaría agendar una sesión con alguien del equipo.", // Botón flotante en la sección de equipo
    price:    "Hola, me gustaría saber el precio de las sesiones.",// Precio: "Preguntar por WhatsApp"
    question: "Hola, tengo una pregunta antes de empezar.",       // Preguntas frecuentes
    unsure:   "Hola, no sé bien por dónde empezar.",              // "Cuéntanos con tus palabras"
    choose:   "Hola, no sé a quién elegir. ¿Me orientan?"         // Página de equipo: "Ayúdame a elegir"
  },

  // Videos explicativos: ID de YouTube (lo que va después de "v=" en el enlace). Vacío = placeholder.
  videos: {
    queEs: "",               // Video 1 — ¿Qué es claritia?
    comoFunciona: "",        // Video 2 — Cómo funciona por WhatsApp
    primeraSesion: ""        // Video 3 — Tu primera sesión
  },

  // Equipo clínico. Las fotos van en img/equipo/<slug>.webp (4:5).
  // Los campos vacíos se muestran como [placeholder]. "video" = ID de YouTube del video de presentación.
  team: [
    { slug: "psicologa-1", name: "", role: "Psicóloga clínica",  cedula: "", approach: "", specs: ["Ansiedad", "Agotamiento laboral"], quote: "", video: "" },
    { slug: "psicologo-2", name: "", role: "Psicólogo clínico",  cedula: "", approach: "", specs: ["Tristeza y desánimo", "Duelo y transiciones"], quote: "", video: "" },
    { slug: "psicologa-3", name: "", role: "Psicóloga clínica",  cedula: "", approach: "", specs: ["Maternidad", "Ansiedad"], quote: "", video: "" },
    { slug: "psicologa-4", name: "", role: "Psicóloga clínica",  cedula: "", approach: "", specs: ["Experiencias del pasado", "Rupturas y pérdidas"], quote: "", video: "" },
    { slug: "psicologo-5", name: "", role: "Psicólogo clínico",  cedula: "", approach: "", specs: ["Neurodivergencia", "Agotamiento laboral"], quote: "", video: "" },
    { slug: "psicologa-6", name: "", role: "Psicóloga clínica",  cedula: "", approach: "", specs: ["Duelo y transiciones", "Tristeza y desánimo"], quote: "", video: "" }
  ],

  // Lista de especialidades (filtros de la página de equipo). Agregar aquí si se suma una nueva.
  specialties: ["Ansiedad", "Tristeza y desánimo", "Agotamiento laboral", "Rupturas y pérdidas", "Experiencias del pasado", "Maternidad", "Neurodivergencia", "Duelo y transiciones"]
};

(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth >= 900;
  // Raíz del sitio (funciona igual en / y en /equipo/)
  const ROOT = new URL('..', document.currentScript ? document.currentScript.src : location.href).href;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ── WhatsApp ── */
  const waNumber = (CONFIG.whatsapp || '').replace(/\D/g, '');
  const waLink = text => {
    const t = encodeURIComponent(text);
    return waNumber ? `https://wa.me/${waNumber}?text=${t}` : `https://wa.me/?text=${t}`;
  };
  const msgFor = key => CONFIG.messages[key] || CONFIG.messages.general;
  const wireWA = scope => scope.querySelectorAll('[data-wa]').forEach(a => {
    if (a.dataset.waWired) return;
    a.dataset.waWired = '1';
    a.href = waLink(a.dataset.waText || msgFor(a.dataset.wa));
    a.target = '_blank';
    a.rel = 'noopener';
    a.addEventListener('click', e => {
      if (!desktop()) return;              // en celular abre WhatsApp directo
      e.preventDefault();
      openQR(a.dataset.waText || msgFor(a.dataset.wa));   // se lee al dar clic (el botón flotante cambia)
    });
  });
  if (!waNumber) console.warn('[claritia] Falta CONFIG.whatsapp — los botones y el QR usan un enlace de ejemplo.');

  /* ── QR en escritorio: escanear con el celular ── */
  let dlg, qrLib;
  const loadQR = () => qrLib || (qrLib = new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = ROOT + 'assets/qrcode.min.js';
    s.onload = () => res(window.qrcode); s.onerror = rej;
    document.head.appendChild(s);
  }));
  const openQR = async text => {
    const link = waLink(text);
    if (!dlg) {
      dlg = document.createElement('dialog');
      dlg.className = 'qr-modal';
      dlg.setAttribute('aria-labelledby', 'qr-title');
      dlg.innerHTML = `
        <button class="qr-close" type="button" aria-label="Cerrar"><svg class="i"><use href="#close"/></svg></button>
        <div class="qr-wrap">
          <div class="qr-side">
            ${waNumber ? '' : '<span class="qr-badge">QR de ejemplo · falta el número</span>'}
            <div class="qr-box"><div class="qr-code"></div><span class="qr-logo"><span class="logo-cluster"><span class="c1"></span><span class="c2"></span><span class="c3"></span></span></span></div>
          </div>
          <div class="qr-copy">
            <span class="label" style="margin:0">WhatsApp</span>
            <h2 id="qr-title">Escríbenos desde tu celular</h2>
            <ol>
              <li>Abre la cámara de tu celular.</li>
              <li>Apunta al código.</li>
              <li>Toca el enlace: el mensaje ya va escrito.</li>
            </ol>
            <a class="btn btn-primary qr-open" target="_blank" rel="noopener"><svg class="i i-wa"><use href="#wa"/></svg>Abrir WhatsApp en esta computadora</a>
            <p class="alt">Te responde Dani, el asistente de claritia. La terapia siempre la conduce un psicólogo.</p>
          </div>
        </div>`;
      document.body.appendChild(dlg);
      dlg.querySelector('.qr-close').addEventListener('click', () => dlg.close());
      dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
    }
    dlg.querySelector('.qr-open').href = link;
    const box = dlg.querySelector('.qr-code');
    box.innerHTML = '';
    dlg.showModal();
    try {
      const qrcode = await loadQR();
      const qr = qrcode(0, 'H');          // corrección alta: deja espacio para el logo al centro
      qr.addData(link); qr.make();
      box.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
      const svg = box.querySelector('svg');
      svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', 'Código QR para escribir a claritia por WhatsApp');
      svg.querySelectorAll('path').forEach(p => p.setAttribute('fill', '#3D3860'));
    } catch (_) { box.textContent = 'No se pudo generar el código.'; }
  };

  /* ── Fotos: si el archivo existe en /img se muestra; si no, queda el placeholder ── */
  const ART = (() => {
    const W = 'rgba(255,255,255,', P = 'rgba(61,56,96,';
    const glow = `<defs><radialGradient id="gl" cx="72%" cy="22%" r="60%"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <radialGradient id="wm" cx="80%" cy="30%" r="55%"><stop offset="0" stop-color="#FFE9C7" stop-opacity=".55"/><stop offset="1" stop-color="#FFE9C7" stop-opacity="0"/></radialGradient></defs>`;
    const win = `<rect x="250" y="40" width="120" height="180" rx="8" fill="${W}.22)" stroke="${W}.75)" stroke-width="3"/><path d="M310 40v180M250 130h120" stroke="${W}.75)" stroke-width="3"/>`;
    const plant = `<path d="M60 400c0-40 8-70 20-90M80 400c4-34 18-58 34-70M70 330c-20-6-34-22-36-44 22 2 36 18 36 44zM96 340c4-22 20-36 42-38-2 22-18 36-42 38z" fill="${P}.12)" stroke="${P}.22)" stroke-width="2.5"/>`;
    const person = (x = 170, s = 1) => `<g transform="translate(${x} 0) scale(${s})"><circle cx="0" cy="215" r="44" fill="${P}.2)"/><path d="M-100 420c0-88 44-148 100-148s100 60 100 148z" fill="${P}.2)"/></g>`;
    const phone = (x = 205, y = 300) => `<rect x="${x}" y="${y}" width="58" height="104" rx="12" fill="${P}.38)"/><rect x="${x + 6}" y="${y + 10}" width="46" height="80" rx="5" fill="${W}.65)"/>`;
    const laptop = `<rect x="140" y="250" width="200" height="124" rx="10" fill="${P}.3)"/><rect x="152" y="262" width="176" height="100" rx="4" fill="${W}.55)"/><path d="M110 382h260l-16 18H126z" fill="${P}.3)"/>`;
    const lamp = `<circle cx="320" cy="140" r="200" fill="url(#wm)"/><path d="M290 70h70l-16 56h-38z" fill="#FFE9C7" fill-opacity=".8"/><rect x="322" y="126" width="5" height="250" fill="${W}.25)"/>`;
    const door = `<rect x="230" y="30" width="130" height="370" rx="6" fill="${W}.18)" stroke="${W}.6)" stroke-width="3"/><circle cx="340" cy="220" r="6" fill="${W}.7)"/>`;
    const clouds = `<g fill="${W}.75)"><ellipse cx="110" cy="150" rx="90" ry="30"/><ellipse cx="160" cy="130" rx="60" ry="34"/><ellipse cx="300" cy="250" rx="110" ry="32"/><ellipse cx="270" cy="228" rx="56" ry="30"/><ellipse cx="60" cy="300" rx="70" ry="18"/></g>`;
    const mug = `<rect x="150" y="300" width="64" height="70" rx="12" fill="${W}.65)"/><path d="M214 316c22 0 22 36 0 36" fill="none" stroke="${W}.65)" stroke-width="7"/><rect x="0" y="370" width="400" height="30" fill="${P}.1)"/>`;
    const textile = `<path d="M240 330c40-20 90-14 140 0v40H230z" fill="#B8B4D4" fill-opacity=".55"/>`;
    const svg = inner => `<svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${glow}<rect width="400" height="400" fill="url(#gl)"/>${inner}</svg>`;
    return {
      'window-person': svg(win + plant + person(165) + phone(205, 320)),
      'laptop': svg(win + person(130, .85) + laptop),
      'lamp': svg(lamp + person(160) + phone(200, 320)),
      'door': svg(door + person(150, .9)),
      'hands-phone': svg(plant + `<path d="M120 400c10-60 50-96 90-100l40 4c30 10 40 40 40 96z" fill="${P}.18)"/>` + phone(170, 210).replace(/58/g, '90').replace(/104/g, '160').replace(/46/g, '78').replace(/80"/g, '130"')),
      'glance-phone': svg(win + mug + person(200) + phone(240, 300)),
      'sky': svg(clouds),
      'still': svg(win + plant + mug + textile + phone(260, 336).replace('rx="12"', 'rx="12" transform="rotate(90 289 388)"')),
      'exhale': svg(win + plant + person(200)),
      'portrait': svg(plant + person(200, 1.15)),
      'person-talk': svg(plant + win + person(200, 1.05))
    };
  })();

  const initMedia = scope => scope.querySelectorAll('.media').forEach(fig => {
    if (fig.dataset.init) return;
    fig.dataset.init = '1';
    const scene = fig.dataset.scene;
    if (scene && ART[scene] && !fig.querySelector('.ph-art')) fig.insertAdjacentHTML('afterbegin', `<div class="ph-art">${ART[scene]}</div>`);
    const img = fig.querySelector(':scope > img');
    if (!img) return;
    const ok = () => fig.classList.add('loaded');
    const bad = () => img.remove();
    if (img.complete) (img.naturalWidth ? ok : bad)();
    else { img.addEventListener('load', ok, { once: true }); img.addEventListener('error', bad, { once: true }); }
  });

  /* ── Videos: el iframe de YouTube solo se carga al dar clic (no pesa al abrir la página) ── */
  const wireVideos = scope => scope.querySelectorAll('.media.video').forEach(fig => {
    if (fig.dataset.vWired) return;
    fig.dataset.vWired = '1';
    fig.addEventListener('click', () => {
      const id = fig.dataset.youtube || CONFIG.videos[fig.dataset.video];
      if (!id) {
        const tag = fig.querySelector('.ph-tag');
        if (tag) { tag.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 450 }); }
        return;
      }
      fig.classList.add('playing');
      fig.insertAdjacentHTML('beforeend', `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&cc_load_policy=1&hl=es" title="Video de claritia" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`);
    });
  });

  /* ── Equipo (inicio: vista previa · /equipo: todo + filtros) ── */
  const ph = (val, label) => val ? esc(val) : `<span class="pending">[${label}]</span>`;
  const teamCard = m => `
    <article class="team-card" data-specs="${esc(m.specs.join('|'))}">
      <figure class="media${m.video ? ' video' : ''}" data-scene="portrait" ${m.video ? `data-youtube="${esc(m.video)}"` : ''}>
        <img src="${ROOT}img/equipo/${esc(m.slug)}.webp" alt="${m.name ? 'Retrato de ' + esc(m.name) : ''}" loading="lazy" />
        ${m.video ? '<button class="play" type="button" aria-label="Ver presentación"><svg class="i"><use href="#play"/></svg></button>' : ''}
        <figcaption class="ph-tag"><b>Retrato</b>img/equipo/${esc(m.slug)}.webp · 4:5</figcaption>
      </figure>
      <div class="team-body">
        <h3>${ph(m.name, 'Nombre y apellido')}</h3>
        <span class="team-role">${esc(m.role)}</span>
        <span class="team-meta">Cédula profesional: ${ph(m.cedula, 'número')}</span>
        <p>${m.approach ? esc(m.approach) : '<span class="pending">[Enfoque, p. ej. terapia cognitivo-conductual]</span>'}</p>
        <div class="tags">${m.specs.map(s => `<span class="tag">${esc(s)}</span>`).join('')}</div>
        <p style="font-style:italic">${m.quote ? '“' + esc(m.quote) + '”' : '<span class="pending">[Una frase en sus propias palabras]</span>'}</p>
        <a class="btn btn-primary" data-wa="team" data-wa-text="${esc('Hola, me gustaría agendar una sesión con ' + (m.name || 'esta psicóloga o psicólogo') + '.')}" href="#"><svg class="i i-wa"><use href="#wa"/></svg>Agenda con ${m.name ? esc(m.name.split(' ')[0]) : '<span class="pending">[Nombre]</span>'}</a>
      </div>
    </article>`;
  document.querySelectorAll('[data-team]').forEach(grid => {
    const n = parseInt(grid.dataset.team, 10);
    const list = n ? CONFIG.team.slice(0, n) : CONFIG.team;
    grid.innerHTML = list.map(teamCard).join('');
    initMedia(grid); wireWA(grid); wireVideos(grid);
  });
  const filters = document.querySelector('[data-filters]');
  if (filters) {
    const used = CONFIG.specialties.filter(s => CONFIG.team.some(m => m.specs.includes(s)));
    filters.innerHTML = ['Todas', ...used].map((s, i) => `<button class="filter" type="button" aria-pressed="${i === 0}" data-spec="${i ? esc(s) : ''}">${esc(s)}</button>`).join('');
    const cards = [...document.querySelectorAll('.team-card')];
    const empty = document.querySelector('.empty-note');
    filters.addEventListener('click', e => {
      const b = e.target.closest('.filter'); if (!b) return;
      filters.querySelectorAll('.filter').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      const spec = b.dataset.spec;
      let shown = 0;
      cards.forEach(c => { const on = !spec || c.dataset.specs.split('|').includes(spec); c.hidden = !on; shown += on; });
      if (empty) empty.hidden = shown > 0;
    });
  }

  initMedia(document); wireWA(document); wireVideos(document);

  /* ── Precio ── */
  const amt = document.getElementById('price-amount');
  const note = document.getElementById('price-note');
  if (amt) {
    if (CONFIG.price) {
      amt.innerHTML = `${esc(CONFIG.price)}<small>${esc(CONFIG.priceUnit)}</small>`;
      note.textContent = CONFIG.priceNote;
    } else {
      amt.innerHTML = `<span class="pending">$XXX</span><small>${esc(CONFIG.priceUnit)}</small>`;
      note.innerHTML = '<span class="pending">[Precio pendiente — se define en CONFIG.price]</span>';
    }
  }

  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ── Un solo bucle de scroll (rAF): primero lecturas, luego escrituras ── */
  const tasks = [];
  let ticking = false;
  const frame = () => {
    ticking = false;
    const live = tasks.filter(t => t.active());
    const data = live.map(t => t.read());
    live.forEach((t, i) => t.write(data[i]));
  };
  const schedule = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });

  const visible = new WeakMap();
  const watch = (el, onChange) => {
    new IntersectionObserver(es => es.forEach(e => {
      visible.set(el, e.isIntersecting);
      if (onChange) onChange(e.isIntersecting);
      schedule();
    }), { rootMargin: '100px 0px' }).observe(el);
  };

  // Animaciones infinitas en pausa fuera de pantalla
  document.querySelectorAll('.hero-panel, .feel, .closing-panel').forEach(el =>
    watch(el, on => el.classList.toggle('paused', !on)));

  // Nav + botón flotante
  const nav = document.getElementById('nav');
  const fab = document.getElementById('wa-float');
  const hero = document.querySelector('.hero-panel, .page-hero');
  const fabLabel = fab && fab.querySelector('.fab-label');
  const fabDefault = fab ? { label: fabLabel ? fabLabel.textContent : '', key: fab.dataset.wa } : null;
  const fabZones = [...document.querySelectorAll('[data-fab], [data-fab-label]')];
  if (nav) tasks.push({
    active: () => true,
    read: () => ({
      y: window.scrollY,
      heroBottom: hero ? hero.getBoundingClientRect().bottom : 0,
      zone: fabZones.filter(z => { const r = z.getBoundingClientRect(); return r.top < window.innerHeight * .7 && r.bottom > window.innerHeight * .4; }).pop(), // la más interna gana
      vh: window.innerHeight
    }),
    write: d => {
      nav.classList.toggle('scrolled', d.y > 20);
      if (!fab) return;
      // Botón flotante dinámico: cambia de texto según la sección y se oculta donde ya hay un botón propio
      const z = d.zone;
      const hide = z && z.dataset.fab === 'hide';
      fab.classList.toggle('show', d.heroBottom < 80 && !hide);
      const label = (z && z.dataset.fabLabel) || fabDefault.label;
      const key = (z && z.dataset.fabMsg) || fabDefault.key;
      if (fabLabel && fabLabel.textContent !== label) {
        fabLabel.textContent = label;
        fab.setAttribute('aria-label', label + ' por WhatsApp');
        fab.dataset.wa = key;
        fab.href = waLink(msgFor(key));
      }
    }
  });
  schedule();

  /* ── Título del hero palabra por palabra ── */
  const h1 = document.querySelector('[data-words]');
  if (h1 && !reduce) {
    const words = h1.textContent.trim().split(/\s+/);
    h1.setAttribute('aria-label', h1.textContent.trim());
    h1.innerHTML = words.map((w, i) => `<span class="word" aria-hidden="true" style="animation-delay:${0.1 + i * 0.07}s">${w}</span>`).join(' ');
  }

  /* ── Conversación del hero ── */
  const phone = document.querySelector('.phone');
  if (phone) {
    const msgs = [...phone.querySelectorAll('.msg')];
    const typing = document.getElementById('typing');
    const playChat = () => {
      if (reduce) { msgs.forEach(m => m.classList.add('show')); return; }
      let t = 600;
      msgs.forEach(m => {
        const isIn = m.classList.contains('in');
        if (isIn) { setTimeout(() => { typing.classList.add('show'); m.before(typing); }, t); t += 1200; }
        setTimeout(() => { typing.classList.remove('show'); m.classList.add('show'); }, t);
        t += isIn ? 1400 : 1000;
      });
    };
    const chatIO = new IntersectionObserver(es => {
      if (es.some(e => e.isIntersecting)) { chatIO.disconnect(); playChat(); }
    }, { threshold: 0.35 });
    chatIO.observe(phone);
  }

  /* ── Entrada al hacer scroll ── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));

  /* ── Frase que se revela con el scroll ── */
  const quote = document.getElementById('reveal');
  if (quote && !reduce) {
    const ws = quote.textContent.trim().split(/\s+/);
    quote.setAttribute('aria-label', quote.textContent.trim());
    quote.innerHTML = ws.map(w => `<span class="w" aria-hidden="true">${w}</span>`).join(' ');
    const spans = [...quote.querySelectorAll('.w')];
    let shown = -1;
    watch(quote);
    tasks.push({
      active: () => visible.get(quote),
      read: () => ({ top: quote.getBoundingClientRect().top, vh: window.innerHeight }),
      write: d => {
        const p = Math.min(1, Math.max(0, (d.vh * 0.85 - d.top) / (d.vh * 0.55)));
        const n = Math.round(p * spans.length);
        if (n === shown) return;
        shown = n;
        spans.forEach((s, i) => s.classList.toggle('on', i < n));
      }
    });
  }

  /* ── Tarjetas apiladas ── */
  const steps = [...document.querySelectorAll('.step')];
  const stack = document.querySelector('.stack');
  if (!reduce && stack && steps.length > 1) {
    watch(stack);
    tasks.push({
      active: () => visible.get(stack),
      read: () => steps.map(s => ({ top: s.getBoundingClientRect().top, h: s.offsetHeight })),
      write: rects => steps.forEach((s, i) => {
        const next = rects[i + 1];
        if (!next) return;
        const p = Math.min(1, Math.max(0, 1 - (next.top - rects[i].top) / rects[i].h));
        s.style.transform = `scale(${(1 - p * 0.05).toFixed(4)})`;
      })
    });
  }

  /* ── Preguntas (acordeón) ── */
  document.querySelectorAll('.qa button').forEach(btn => {
    btn.addEventListener('click', () => {
      const qa = btn.parentElement;
      const open = !qa.classList.contains('open');
      document.querySelectorAll('.qa.open').forEach(o => { o.classList.remove('open'); o.querySelector('button').setAttribute('aria-expanded', 'false'); });
      qa.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  /* ── Botones magnéticos (solo con mouse) ── */
  if (!reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach(b => {
      b.addEventListener('mousemove', e => {
        const r = b.getBoundingClientRect();
        b.style.setProperty('--bx', `${(e.clientX - r.left - r.width / 2) * 0.18}px`);
        b.style.setProperty('--by', `${(e.clientY - r.top - r.height / 2) * 0.28}px`);
      });
      b.addEventListener('mouseleave', () => { b.style.setProperty('--bx', '0px'); b.style.setProperty('--by', '0px'); });
    });
  }
})();
