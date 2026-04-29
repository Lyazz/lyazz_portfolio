(() => {
  // ------- Hero letter splitter -------
  const heroTitle = document.querySelector('.hero__title');
  if (heroTitle) {
    heroTitle.querySelectorAll('[data-split]').forEach((word) => {
      const text = word.textContent;
      word.textContent = '';
      [...text].forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.style.transitionDelay = `${0.04 * i + (parseFloat(word.dataset.delay) || 0)}s`;
        span.textContent = ch === ' ' ? ' ' : ch;
        word.appendChild(span);
      });
    });
    requestAnimationFrame(() => {
      document.querySelector('.hero')?.classList.add('is-loaded');
    });
  }

  // ------- Reveal on scroll -------
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
  document.querySelectorAll('.reveal, .reveal-up, .split-line').forEach((el) => io.observe(el));

  // ------- Scroll progress -------
  const bar = document.querySelector('.scroll-progress__bar');
  const onScroll = () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    if (bar) bar.style.width = `${pct}%`;
    handleNav();
    handleTimeline();
  };

  // ------- Auto-hide nav -------
  const nav = document.querySelector('.nav');
  let lastY = 0;
  const handleNav = () => {
    if (!nav) return;
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 20);
    if (y > 80 && y > lastY) nav.classList.add('is-hidden');
    else nav.classList.remove('is-hidden');
    lastY = y;
  };

  // ------- Timeline progress -------
  const timeline = document.querySelector('.timeline');
  const handleTimeline = () => {
    if (!timeline) return;
    const r = timeline.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = vh * 0.6;
    const total = r.height + (vh * 0.6);
    const traveled = Math.min(Math.max(start - r.top, 0), total);
    const pct = (traveled / total) * 100;
    timeline.style.setProperty('--progress', `${pct}%`);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ------- Active nav link -------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
  const navIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        navLinks.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === `#${e.target.id}`));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach((s) => navIo.observe(s));

  // ------- Role flip -------
  const flip = document.querySelector('.role-flip');
  if (flip) {
    const list = flip.querySelector('.role-flip__list');
    const items = list.children.length;
    let i = 0;
    setInterval(() => {
      i = (i + 1) % items;
      list.style.transform = `translateY(-${i * 1.4}em)`;
    }, 2400);
  }

  // ------- Skill dials -------
  const dialIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const dial = e.target;
      const pct = parseFloat(dial.dataset.value) || 0;
      const fg = dial.querySelector('.dial__fg');
      const r = parseFloat(fg.getAttribute('r'));
      const c = 2 * Math.PI * r;
      fg.style.strokeDasharray = `${(pct / 100) * c} ${c}`;
      const num = dial.querySelector('.dial__pct');
      if (num) {
        let n = 0;
        const step = () => {
          n += Math.max(1, Math.round(pct / 30));
          if (n >= pct) { n = pct; num.textContent = `${pct}%`; return; }
          num.textContent = `${n}%`;
          requestAnimationFrame(step);
        };
        step();
      }
      dialIo.unobserve(dial);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.dial').forEach((d) => dialIo.observe(d));

  // ------- Project filter -------
  const filterBtns = document.querySelectorAll('.filter__btn');
  const projects = document.querySelectorAll('.project');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      filterBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const f = btn.dataset.filter;
      projects.forEach((p) => {
        const cats = (p.dataset.cat || '').split(' ');
        const show = f === '*' || cats.includes(f);
        p.classList.toggle('is-hidden', !show);
      });
    });
  });

  // ------- Smooth anchor scroll -------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
      const mobile = document.querySelector('.nav__mobile');
      const burger = document.querySelector('.nav__burger');
      if (mobile?.classList.contains('is-open')) {
        mobile.classList.remove('is-open');
        burger?.classList.remove('is-open');
      }
    });
  });

  // ------- Mobile menu -------
  const burger = document.querySelector('.nav__burger');
  const mobile = document.querySelector('.nav__mobile');
  burger?.addEventListener('click', () => {
    burger.classList.toggle('is-open');
    mobile?.classList.toggle('is-open');
  });

  // ------- Marquee duplicate (for seamless loop) -------
  document.querySelectorAll('.marquee__track').forEach((track) => {
    track.innerHTML += track.innerHTML;
  });

  // ------- Footer year -------
  const yr = document.querySelector('.footer__year');
  if (yr) yr.textContent = new Date().getFullYear();

  // ------- Contact form -------
  const form = document.querySelector('.contact__form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.submit');
      const notice = form.querySelector('.form__notice');
      notice.textContent = '';
      notice.className = 'form__notice';
      btn.classList.add('is-loading');
      try {
        const data = Object.fromEntries(new FormData(form));
        const res = await fetch('/api/contact', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Send failed');
        btn.classList.remove('is-loading');
        btn.classList.add('is-success');
        btn.querySelector('span').textContent = 'Message received ✓';
        notice.textContent = 'Thanks! I\'ll reply within one business day.';
        notice.classList.add('is-success');
        form.reset();
        setTimeout(() => {
          btn.classList.remove('is-success');
          btn.querySelector('span').textContent = 'Send message';
        }, 4000);
      } catch (err) {
        btn.classList.remove('is-loading');
        notice.textContent = 'Something went wrong. Try again or email me directly.';
        notice.classList.add('is-error');
      }
    });
  }
})();
