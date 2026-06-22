/* ============================================================
   CARDS.JS — Cartes 3D "Qui est Bérénice ?"
   Retournement, éclats (cœurs/pétales), lueur au clic
   Pour Bérénice 💌
   ============================================================ */

const QB_HEART_SYMBOLS = ['❤️', '💕', '💗', '🩷', '💖'];
const QB_PETAL_COLORS   = [
  '#F4A7B9', '#FAD4DC', '#E8B4C0', '#FFB7C5',
  '#D4758A', '#E2C88A',
];

/* ===== Éclats localisés au point de clic ===== */
function qbBurst(x, y) {
  const layer = document.getElementById('qbBurstLayer');
  if (!layer) return;

  // Quelques cœurs
  const heartCount = 6;
  for (let i = 0; i < heartCount; i++) {
    const h = document.createElement('span');
    h.className = 'burst-heart';
    h.textContent = QB_HEART_SYMBOLS[Math.floor(Math.random() * QB_HEART_SYMBOLS.length)];

    const angle = (Math.random() * 140 - 70); // dispersion vers le haut
    const dist  = 60 + Math.random() * 70;
    const dx    = Math.sin(angle * Math.PI / 180) * dist;
    const dy    = 70 + Math.random() * 60;

    h.style.left = x + 'px';
    h.style.top  = y + 'px';
    h.style.setProperty('--dx', dx + 'px');
    h.style.setProperty('--dy', dy + 'px');
    h.style.animationDelay = (Math.random() * .15) + 's';

    layer.appendChild(h);
    setTimeout(() => h.remove(), 1500);
  }

  // Quelques pétales
  const petalCount = 7;
  for (let i = 0; i < petalCount; i++) {
    const p = document.createElement('span');
    p.className = 'burst-petal';
    p.style.background = QB_PETAL_COLORS[Math.floor(Math.random() * QB_PETAL_COLORS.length)];

    const dx = (Math.random() * 160 - 80);
    const dy = 80 + Math.random() * 70;

    p.style.left = x + 'px';
    p.style.top  = y + 'px';
    p.style.setProperty('--dx', dx + 'px');
    p.style.setProperty('--dy', dy + 'px');
    p.style.animationDelay = (Math.random() * .2) + 's';

    layer.appendChild(p);
    setTimeout(() => p.remove(), 1600);
  }
}

/* ===== Retournement des cartes ===== */
function attachCardFlip() {
  const cards = document.querySelectorAll('.qb-card');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;

      const willOpen = !card.classList.contains('flipped');

      if (willOpen) {
        cards.forEach(otherCard => {
          if (otherCard !== card) {
            otherCard.classList.remove('flipped', 'glowing');
          }
        });
      }

      card.classList.toggle('flipped', willOpen);

      // Effets uniquement à l'ouverture (pas à la fermeture)
      if (willOpen) {
        qbBurst(cx, cy);

        card.classList.remove('glowing');
        void card.offsetWidth; // reflow pour relancer l'animation
        card.classList.add('glowing');
        setTimeout(() => card.classList.remove('glowing'), 950);
      }
    });
  });
}

/* ===== Apparition progressive du titre/texte ===== */
function attachBereniceReveal() {
  const section = document.getElementById('berenice-section');
  if (!section) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        section.querySelectorAll('.anim-fade-up').forEach(el => el.classList.add('visible'));
      }
    });
  }, { threshold: 0.15 });

  io.observe(section);
}

/* ===== Vidéos fluides dans les cartes ===== */
function attachCardVideos() {
  const videos = document.querySelectorAll('.qb-video');

  videos.forEach(video => {
    video.muted = true;
    video.playsInline = true;

    video.addEventListener('loadeddata', () => {
      video.classList.add('is-ready');
      video.play().catch(() => {});
    });

    video.addEventListener('error', () => {
      video.classList.add('has-error');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  attachCardFlip();
  attachCardVideos();
  attachBereniceReveal();
});
