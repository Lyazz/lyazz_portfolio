(() => {
  const tilt = (el, max = 8) => {
    let rect = null;
    const onEnter = () => { rect = el.getBoundingClientRect(); el.style.transition = 'transform .2s ease-out'; };
    const onMove = (e) => {
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - y) * max;
      const ry = (x - 0.5) * max;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
      el.style.transition = 'transform .05s linear';
    };
    const onLeave = () => {
      el.style.transition = 'transform .6s cubic-bezier(0.22,1,0.36,1)';
      el.style.transform = '';
    };
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
  };

  const magnetic = (el, strength = 0.35) => {
    let rect = null;
    const target = el.querySelector('.btn__inner') || el;
    el.addEventListener('mouseenter', () => { rect = el.getBoundingClientRect(); });
    el.addEventListener('mousemove', (e) => {
      if (!rect) return;
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      target.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
    el.addEventListener('mouseleave', () => {
      target.style.transform = '';
    });
  };

  const bentoGlow = (el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth < 900) return;
    document.querySelectorAll('[data-tilt]').forEach((el) => tilt(el, parseFloat(el.dataset.tilt) || 8));
    document.querySelectorAll('[data-magnetic]').forEach((el) => magnetic(el));
    document.querySelectorAll('.bento__cell').forEach((el) => bentoGlow(el));
  });
})();
