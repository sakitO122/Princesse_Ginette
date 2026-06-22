/* ============================================================
   MUSIC.JS — Lecteur musical
   Pour Bérénice 💌
   ============================================================ */

const TRACKS = [
  { src: 'assets/music/perfect.m4a',       label: 'Perfect — Ed Sheeran' },
  { src: 'assets/music/kiff_no_beat.m4a',  label: 'Tu es dans pain — Kiff No Beat' },
];

let currentTrackIdx = 0;
let isPlaying       = false;
let audioEl         = null;
let fadeTimeout     = null;

function buildAudio(src) {
  const a    = new Audio(src);
  a.volume   = 0;
  a.preload  = 'metadata';
  a.loop     = true;
  return a;
}

function initMusicPlayer() {
  audioEl = buildAudio(TRACKS[currentTrackIdx].src);
  updateUI();
}

/* --- Lecture avec fondu entrant --- */
function playWithFadeIn(target = .45, duration = 1200) {
  if (!audioEl) return;
  clearTimeout(fadeTimeout);
  audioEl.volume = 0;

  const step      = target / (duration / 50);
  const interval  = setInterval(() => {
    if (audioEl.volume + step >= target) {
      audioEl.volume = target;
      clearInterval(interval);
    } else {
      audioEl.volume += step;
    }
  }, 50);
}

/* --- Pause avec fondu sortant --- */
function pauseWithFadeOut(duration = 700) {
  if (!audioEl) return;
  const startVol  = audioEl.volume;
  const step      = startVol / (duration / 50);
  const interval  = setInterval(() => {
    if (audioEl.volume - step <= 0) {
      audioEl.volume = 0;
      audioEl.pause();
      clearInterval(interval);
    } else {
      audioEl.volume -= step;
    }
  }, 50);
}

function startMusic() {
  if (isPlaying) return;
  audioEl.play()
    .then(() => {
      isPlaying = true;
      playWithFadeIn();
      updateUI();
    })
    .catch(() => {
      // Autoplay bloqué — l'utilisateur devra cliquer lui-même
    });
}

function togglePlayPause() {
  if (!audioEl) return;
  if (isPlaying) {
    pauseWithFadeOut();
    isPlaying = false;
  } else {
    audioEl.play()
      .then(() => {
        isPlaying = true;
        playWithFadeIn();
      })
      .catch(() => {});
  }
  updateUI();
}

function nextTrack() {
  pauseWithFadeOut(400);
  setTimeout(() => {
    currentTrackIdx = (currentTrackIdx + 1) % TRACKS.length;
    audioEl.src     = TRACKS[currentTrackIdx].src;
    audioEl.load();
    if (isPlaying) {
      audioEl.play().then(() => playWithFadeIn()).catch(() => {});
    }
    updateUI();
  }, 450);
}

function updateUI() {
  const playBtn   = document.getElementById('musicPlayBtn');
  const titleEl   = document.getElementById('musicTitle');
  const waveEl    = document.getElementById('musicWave');

  if (titleEl)  titleEl.textContent = TRACKS[currentTrackIdx].label;
  if (playBtn)  playBtn.textContent = isPlaying ? '⏸' : '▶';
  if (waveEl) {
    if (isPlaying) waveEl.classList.remove('paused');
    else           waveEl.classList.add('paused');
  }
}

/* --- Événements du player --- */
document.addEventListener('DOMContentLoaded', () => {
  initMusicPlayer();

  const playBtn  = document.getElementById('musicPlayBtn');
  const skipBtn  = document.getElementById('musicSkipBtn');

  if (playBtn)  playBtn.addEventListener('click', togglePlayPause);
  if (skipBtn)  skipBtn.addEventListener('click', nextTrack);
});