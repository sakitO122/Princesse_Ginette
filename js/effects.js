/* ============================================================
   EFFECTS.JS — Coeurs flottants, pétales, sparkles
   Pour Bérénice 💌
   ============================================================ */

/* ===== CONFIG ===== */
const HEART_INTERVAL_MS  = 1100;
const PETAL_INTERVAL_MS  = 700;
const SPARKLE_COUNT      = 55;

const HEART_SYMBOLS = ['❤️','💕','💗','💖','🩷','✨','💝','🌸'];
const PETAL_COLORS  = [
  '#F4A7B9','#FAD4DC','#E8B4C0','#FFB7C5',
  '#B23A52','#C94F65',
  '#FF8C42','#FFD166',
  '#E2C88A','#fff'
];

let heartInterval  = null;
let petalInterval  = null;

/* ===== SPARKLES ===== */
function initSparkles(containerId) {
  const layer = document.getElementById(containerId);
  if (!layer) return;
  layer.innerHTML = '';

  for (let i = 0; i < SPARKLE_COUNT; i++) {
    const s = document.createElement('div');
    s.className = 'sparkle';

    const size     = 2 + Math.random() * 5;
    const duration = 1.4 + Math.random() * 2.6;
    const delay    = Math.random() * 4;

    Object.assign(s.style, {
      left: Math.random() * 100 + '%',
      top:  Math.random() * 100 + '%',
      width:  size + 'px',
      height: size + 'px',
      animation: `sparkleTwinkle ${duration}s ease-in-out ${delay}s infinite`,
    });

    // Varier la forme : certains sont des losanges
    if (Math.random() > .6) {
      s.style.borderRadius  = '0';
      s.style.transform     = 'rotate(45deg)';
      s.style.background    = 'rgba(203,168,105,.8)';
    }

    layer.appendChild(s);
  }
}

/* ===== CŒURS FLOTTANTS ===== */
function spawnHeart(layerId) {
  const layer = document.getElementById(layerId);
  if (!layer) return;

  const h = document.createElement('div');
  h.className  = 'floating-heart';
  h.textContent = HEART_SYMBOLS[Math.floor(Math.random() * HEART_SYMBOLS.length)];

  const dur   = 5  + Math.random() * 6;
  const delay = Math.random() * 1.5;
  const size  = .9 + Math.random() * 1.3;

  Object.assign(h.style, {
    left:      5 + Math.random() * 90 + '%',
    bottom:    '-30px',
    fontSize:  size + 'rem',
    animation: `heartFloat ${dur}s ease-in ${delay}s`,
  });

  layer.appendChild(h);
  setTimeout(() => h.remove(), (dur + delay + .5) * 1000);
}

function startHearts(layerId) {
  if (heartInterval) return;
  spawnHeart(layerId);
  heartInterval = setInterval(() => spawnHeart(layerId), HEART_INTERVAL_MS);
}
function stopHearts() {
  clearInterval(heartInterval);
  heartInterval = null;
}

/* ===== PÉTALES ===== */
function spawnPetal(layerId) {
  const layer = document.getElementById(layerId);
  if (!layer) return;

  const p = document.createElement('div');
  p.className = 'petal';

  const size = 7 + Math.random() * 11;
  const dur  = 6  + Math.random() * 8;
  const del  = Math.random() * 3;

  // Formes variées : ellipse ou triangle doux
  const shapes = ['50% 50% 40% 40%', '60% 40% 60% 40%', '50% 30% 50% 70%'];

  Object.assign(p.style, {
    left:         Math.random() * 100 + '%',
    width:        size + 'px',
    height:       size * 1.35 + 'px',
    background:   PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    borderRadius: shapes[Math.floor(Math.random() * shapes.length)],
    opacity:      (.38 + Math.random() * .4).toString(),
    animation:    `petalFall ${dur}s linear ${del}s`,
  });

  layer.appendChild(p);
  setTimeout(() => p.remove(), (dur + del + .5) * 1000);
}

function startPetals(layerId) {
  if (petalInterval) return;
  spawnPetal(layerId);
  petalInterval = setInterval(() => spawnPetal(layerId), PETAL_INTERVAL_MS);
}
function stopPetals() {
  clearInterval(petalInterval);
  petalInterval = null;
}

/* ===== INTERSECTION OBSERVER POUR WELCOME ===== */
function attachWelcomeEffects() {
  const welcomeEl = document.getElementById('welcome');
  if (!welcomeEl) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        initSparkles('sparkleLayer');
        startHearts('heartsLayer');
        startPetals('petalsLayer');
        startCounter();
      } else {
        stopHearts();
        stopPetals();
        stopCounter();
      }
    });
  }, { threshold: 0.1 });

  io.observe(welcomeEl);
}