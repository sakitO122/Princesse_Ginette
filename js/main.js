/* ============================================================
   MAIN.JS — Navigation & transitions entre sections
   Pour Bérénice 💌
   ============================================================ */

/* ============================================================
   TRANSITIONS
   5 effets différents, un par section : iris cœur, balayage
   diagonal, rideau double, stores/blinds, iris circulaire.
   ============================================================ */

const TRANSITIONS = {
  'welcome':          { type: 'heart',    color: 'linear-gradient(135deg, #922B40, #2C1424)' },
  'berenice-section': { type: 'diagonal', color: 'linear-gradient(135deg, #3A1830, #B23A52)' },
  'timeline':         { type: 'curtain',  color: 'linear-gradient(135deg, #1F0F1A, #C94F65)' },
  'gallery':          { type: 'blinds',   color: 'linear-gradient(135deg, #2C1424, #CBA869)' },
  'quiz':             { type: 'circle',   color: 'linear-gradient(135deg, #3A1830, #D4758A)' },
  'messages':         { type: 'heart',    color: 'linear-gradient(135deg, #1F0F1A, #B23A52)' },
  'bubbles':          { type: 'diagonal', color: 'linear-gradient(135deg, #2C1424, #CBA869)' },
  'final-letter':     { type: 'curtain',  color: 'linear-gradient(135deg, #922B40, #1F0F1A)' },
};
const DEFAULT_TRANSITION = { type: 'circle', color: 'linear-gradient(135deg, #922B40, #2C1424)' };

const PHASE1_MS = { circle: 850, heart: 900, diagonal: 750, curtain: 700, blinds: 550 };
const PHASE2_MS = { circle: 600, heart: 650, diagonal: 600, curtain: 600, blinds: 540 };

let isTransitioning = false;

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function resetOverlay(overlay) {
  overlay.className = 'page-overlay';
  overlay.innerHTML = '';
  overlay.removeAttribute('style');
}

function setupOverlay(type, overlay, color, ox, oy) {
  switch (type) {
    case 'heart':
      overlay.classList.add('t-heart');
      overlay.style.background = color;
      overlay.style.left = ox;
      overlay.style.top  = oy;
      overlay.style.transform = 'translate(-50%, -50%) scale(0)';
      break;

    case 'curtain': {
      overlay.classList.add('t-curtain');
      const left  = document.createElement('div');
      left.className = 'curtain-panel curtain-l';
      left.style.background = color;
      left.style.transform  = 'scaleX(0)';
      const right = document.createElement('div');
      right.className = 'curtain-panel curtain-r';
      right.style.background = color;
      right.style.transform  = 'scaleX(0)';
      overlay.append(left, right);
      break;
    }

    case 'blinds': {
      overlay.classList.add('t-blinds');
      const BARS = 14;
      for (let i = 0; i < BARS; i++) {
        const bar = document.createElement('div');
        bar.className = 'blind-bar';
        bar.style.background = color;
        bar.style.transform = 'scaleY(0)';
        bar.style.transformOrigin = 'bottom';
        bar.style.transitionDelay = (i * 0.035) + 's';
        overlay.appendChild(bar);
      }
      break;
    }

    case 'diagonal':
      overlay.classList.add('t-diagonal');
      overlay.style.background = color;
      overlay.style.clipPath = 'polygon(-45% -20%, -25% -20%, -45% 120%, -65% 120%)';
      break;

    default: // circle
      overlay.classList.add('t-circle');
      overlay.style.background = color;
      overlay.style.clipPath = `circle(0% at ${ox} ${oy})`;
      break;
  }
}

function playExpand(type, overlay, ox, oy) {
  overlay.classList.add('expanding');
  requestAnimationFrame(() => {
    switch (type) {
      case 'heart':
        overlay.style.transform = 'translate(-50%, -50%) scale(1)';
        break;
      case 'curtain':
        overlay.querySelectorAll('.curtain-panel').forEach(p => p.style.transform = 'scaleX(1)');
        break;
      case 'blinds':
        overlay.querySelectorAll('.blind-bar').forEach(b => b.style.transform = 'scaleY(1)');
        break;
      case 'diagonal':
        overlay.style.clipPath = 'polygon(-45% -20%, 145% -20%, 125% 120%, -65% 120%)';
        break;
      default:
        overlay.style.clipPath = `circle(150% at ${ox} ${oy})`;
    }
  });
}

function playCollapse(type, overlay, ox, oy) {
  overlay.classList.remove('expanding');
  overlay.classList.add('collapsing');
  switch (type) {
    case 'heart':
      overlay.style.transform = 'translate(-50%, -50%) scale(0)';
      break;
    case 'curtain':
      overlay.querySelectorAll('.curtain-panel').forEach(p => p.style.transform = 'scaleX(0)');
      break;
    case 'blinds':
      overlay.querySelectorAll('.blind-bar').forEach(b => {
        b.style.transformOrigin = 'top';
        b.style.transform = 'scaleY(0)';
      });
      break;
    case 'diagonal':
      overlay.style.clipPath = 'polygon(125% -20%, 145% -20%, 125% 120%, 105% 120%)';
      break;
    default:
      overlay.style.clipPath = `circle(0% at ${ox} ${oy})`;
  }
}

async function transitionTo(targetId, triggerEl = null) {
  if (isTransitioning) return;
  isTransitioning = true;

  const overlay = document.getElementById('pageOverlay');
  const cfg     = TRANSITIONS[targetId] || DEFAULT_TRANSITION;

  // Calculer l'origine depuis l'élément déclencheur
  let ox = '50%', oy = '50%';
  if (triggerEl) {
    const r  = triggerEl.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    ox = ((r.left + r.width  / 2) / vw * 100).toFixed(1) + '%';
    oy = ((r.top  + r.height / 2) / vh * 100).toFixed(1) + '%';
  }

  resetOverlay(overlay);
  setupOverlay(cfg.type, overlay, cfg.color, ox, oy);
  playExpand(cfg.type, overlay, ox, oy);

  await wait(PHASE1_MS[cfg.type] || PHASE1_MS.circle);

  // Changer de section
  const currentActive = document.querySelector('.section.active');
  const target        = document.getElementById(targetId);

  if (currentActive) currentActive.classList.remove('active');
  if (target) {
    target.classList.add('active');
    target.scrollIntoView({ block: 'start' });
  }

  // Déclencher les effets propres à la section
  onSectionEnter(targetId);

  await wait(60);

  playCollapse(cfg.type, overlay, ox, oy);

  await wait(PHASE2_MS[cfg.type] || PHASE2_MS.circle);
  resetOverlay(overlay);
  isTransitioning = false;
}

/* ============================================================
   LOGIQUE PAR SECTION
   ============================================================ */

function onSectionEnter(id) {
  switch(id) {
    case 'welcome':
      startMusic();
      // Les effets welcome (sparkles, coeurs, pétales, compteur)
      // sont gérés par IntersectionObserver dans effects.js
      attachWelcomeEffects();
      break;

    case 'berenice-section':
      // Future : initialiser les cartes interactives
      break;

    default:
      break;
  }
}

/* ============================================================
   BINDING DES BOUTONS DE NAVIGATION
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Bouton d'entrée → Welcome
  const startBtn = document.getElementById('startBtn');
  if (startBtn) {
    startBtn.addEventListener('click', (e) => {
      transitionTo('welcome', e.currentTarget);
    });
  }

  // Bouton Welcome → Bérénice
  const nextBtn = document.getElementById('nextBtn');
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      transitionTo('berenice-section', e.currentTarget);
    });
  }

  // Boutons futurs — délégation globale
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-goto]');
    if (el) {
      transitionTo(el.dataset.goto, el);
    }
  });
});