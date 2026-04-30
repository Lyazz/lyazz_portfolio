(() => {
  // ------- Reveal on scroll -------
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // ------- Scroll progress + nav + timeline -------
  const bar = document.querySelector('.scroll-progress__bar');
  const nav = document.querySelector('.nav');
  const timeline = document.querySelector('.timeline');
  let lastY = 0;

  const onScroll = () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    if (bar) bar.style.width = `${pct}%`;

    if (nav) {
      const y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 20);
      if (y > 100 && y > lastY) nav.classList.add('is-hidden');
      else nav.classList.remove('is-hidden');
      lastY = y;
    }

    if (timeline) {
      const r = timeline.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.6;
      const total = r.height + (vh * 0.6);
      const traveled = Math.min(Math.max(start - r.top, 0), total);
      const pcts = (traveled / total) * 100;
      timeline.style.setProperty('--progress', `${pcts}%`);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ------- Active nav link via IntersectionObserver -------
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

  // ------- Role flipper (in hero) -------
  const flip = document.querySelector('.role-flip__inner');
  if (flip) {
    const roles = ['Software Developer', 'Mobile Engineer', 'Full-Stack Builder', 'Flutter Specialist'];
    let i = 0;
    const cycle = () => {
      flip.style.opacity = '0';
      flip.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        i = (i + 1) % roles.length;
        flip.textContent = roles[i];
        flip.style.opacity = '1';
        flip.style.transform = 'translateY(0)';
      }, 400);
    };
    setInterval(cycle, 2800);
  }

  // ------- Stat counter -------
  const statIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.value, 10) || 0;
      const dur = 1400;
      const start = performance.now();
      const tick = (t) => {
        const p = Math.min((t - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      statIo.unobserve(el);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.stat__num').forEach((n) => statIo.observe(n));

  // ------- Project filter -------
  const filterBtns = document.querySelectorAll('.filter__btn');
  const projects = document.querySelectorAll('.project-row');
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

  // ------- Marquee duplicate (seamless loop) -------
  document.querySelectorAll('.skills-strip__track').forEach((track) => {
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
        btn.querySelector('span').textContent = 'Sent ✓';
        notice.textContent = "Thanks! I'll reply within one business day.";
        notice.classList.add('is-success');
        form.reset();
        setTimeout(() => {
          btn.classList.remove('is-success');
          btn.querySelector('span').textContent = 'Submit';
        }, 4000);
      } catch (err) {
        btn.classList.remove('is-loading');
        notice.textContent = 'Something went wrong. Try again or email me directly.';
        notice.classList.add('is-error');
      }
    });
  }
})();
