// Mobile nav
const btn = document.querySelector('.navToggle');
const nav = document.querySelector('.nav');
btn?.addEventListener('click', () => {
  const open = nav.classList.toggle('nav--open');
  btn.setAttribute('aria-expanded', String(open));
});
document.getElementById('year')?.append(String(new Date().getFullYear()));


// Scroll reveal (images + cards load in as you scroll)
(() => {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = [
    ...document.querySelectorAll('.card, .split__media img, .gallery__item, .note, .contact__box, .contact__copy')
  ];

  // Add base class
  targets.forEach(el => el.classList.add('reveal'));

  if (prefersReduced || !('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('reveal--in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('reveal--in');
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

  targets.forEach(el => io.observe(el));
})();


// AUTO GALLERY
// Drops in any files named gallery-1.jpg, gallery-2.jpg ... (or .png)
// Put them in /assets/ and they will appear automatically.
(() => {
  const el = document.getElementById('autoGallery');
  if (!el) return;

  // Config: how many images to try
  const MAX = 60;
  const exts = ['jpg', 'jpeg', 'png', 'webp'];

  // Build list of candidate URLs
  const candidates = [];
  for (let i = 1; i <= MAX; i++) {
    for (const ext of exts) {
      candidates.push({ i, url: `assets/gallery-${i}.${ext}` });
    }
  }

  // Helper: create gallery item
  const addItem = (url, i) => {
    const a = document.createElement('a');
    a.className = 'gallery__item';
    a.href = url;
    a.target = '_blank';
    a.rel = 'noreferrer';

    const img = document.createElement('img');
    img.loading = 'lazy';
    img.alt = `Gallery photo ${i}`;
    img.src = url;

    a.appendChild(img);
    el.appendChild(a);
  };

  // Try load each candidate; only add if it exists
  const seenIndex = new Set();
  candidates.forEach(({ i, url }) => {
    const test = new Image();
    test.onload = () => {
      // Only add first successful ext per index
      if (seenIndex.has(i)) return;
      seenIndex.add(i);
      addItem(url, i);
    };
    test.src = url;
  });
})();

