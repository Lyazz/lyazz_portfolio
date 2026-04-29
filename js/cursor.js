(() => {
  if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 900) return;

  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'cursor-dot is-hidden';
  ring.className = 'cursor-ring is-hidden';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    dot.classList.remove('is-hidden');
    ring.classList.remove('is-hidden');
  });

  document.addEventListener('mouseleave', () => {
    dot.classList.add('is-hidden');
    ring.classList.add('is-hidden');
  });

  function loop() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  const hoverSel = 'a, button, input, textarea, [data-cursor="hover"]';
  const textSel = 'p, h1, h2, h3, h4, h5, span';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSel)) {
      ring.classList.add('is-hover');
      ring.classList.remove('is-text');
    } else if (e.target.matches(textSel)) {
      ring.classList.add('is-text');
      ring.classList.remove('is-hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSel)) ring.classList.remove('is-hover');
    if (e.target.matches(textSel)) ring.classList.remove('is-text');
  });
})();
