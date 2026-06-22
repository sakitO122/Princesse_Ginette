/* ============================================================
   COUNTER.JS — Compteur d'amour en temps réel
   Pour Bérénice 💌
   ============================================================ */

// ⚠️ REMPLACE ICI par votre vraie date de début (format: 'AAAA-MM-JJ')
const LOVE_START_DATE = new Date('2024-01-01T00:00:00');

let counterInterval = null;

function updateCounter() {
  const now  = new Date();
  const diff = now - LOVE_START_DATE;
  if (diff < 0) return;

  const totalSeconds = Math.floor(diff / 1000);
  const days    = Math.floor(totalSeconds / 86400);
  const hours   = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600)  / 60);
  const seconds = totalSeconds % 60;

  const dEl = document.getElementById('cnt-days');
  const hEl = document.getElementById('cnt-hours');
  const mEl = document.getElementById('cnt-minutes');
  const sEl = document.getElementById('cnt-seconds');

  if (!dEl) return; // Section pas encore dans le DOM

  const newD = String(days).padStart(3, '0');
  const newH = String(hours).padStart(2, '0');
  const newM = String(minutes).padStart(2, '0');
  const newS = String(seconds).padStart(2, '0');

  // Petit flash animé si la valeur change
  function setWithFlash(el, val) {
    if (el.textContent !== val) {
      el.textContent = val;
      el.classList.remove('flash');
      void el.offsetWidth; // reflow
      el.classList.add('flash');
    }
  }

  setWithFlash(dEl, newD);
  setWithFlash(hEl, newH);
  setWithFlash(mEl, newM);
  setWithFlash(sEl, newS);
}

function startCounter() {
  updateCounter();
  if (!counterInterval) {
    counterInterval = setInterval(updateCounter, 1000);
  }
}

function stopCounter() {
  clearInterval(counterInterval);
  counterInterval = null;
}