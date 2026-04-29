(() => {
  const KEY = 'portfolio-theme';
  const root = document.documentElement;

  const stored = localStorage.getItem(KEY);
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initial = stored || (prefersLight ? 'light' : 'dark');
  root.setAttribute('data-theme', initial);

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem(KEY, next);
    });
  });

  if (!stored) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      if (localStorage.getItem(KEY)) return;
      root.setAttribute('data-theme', e.matches ? 'light' : 'dark');
    });
  }
})();
