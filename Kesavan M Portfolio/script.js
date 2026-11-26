// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

menuBtn.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});

// Close the menu after choosing a link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

// Show a monogram if the profile photo is missing
const frame = document.getElementById('photoFrame');
const img = document.getElementById('profileImg');
img.addEventListener('error', () => frame.classList.add('no-photo'));
if (img.complete && img.naturalWidth === 0) frame.classList.add('no-photo');

// Highlight the nav link of the section in view
const links = document.querySelectorAll('.nav-links a:not(.btn)');
const sections = [...links].map(a => document.querySelector(a.getAttribute('href')));

window.addEventListener('scroll', () => {
  const y = window.scrollY + 120;
  let current = sections[0];
  sections.forEach(s => { if (s && s.offsetTop <= y) current = s; });
  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current.id));
});

document.getElementById('year').textContent = new Date().getFullYear();

// Inside the claude.ai preview, plain download links are blocked, so the
// resume goes through the viewer's save prompt. On a normal host
// window.claude does not exist and the links download as usual.
if (window.claude && window.claude.use) {
  window.claude.use('downloads').then(dl => {
    if (!dl) return;
    document.querySelectorAll('a[download]').forEach(link => {
      link.addEventListener('click', async e => {
        e.preventDefault();
        try {
          const blob = await (await fetch(link.getAttribute('href'))).blob();
          await dl.save({ filename: 'Kesavan_M_Resume.pdf', data: blob });
        } catch (err) { /* viewer declined or saving unavailable */ }
      });
    });
  }).catch(() => {});
}
