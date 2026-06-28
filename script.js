document.addEventListener('DOMContentLoaded', () => {
  initCatEyes();
  initCatRain();
  initCountdown();
  initRSVP();
});

/**
 * 1. Cat Eyes Tracking Movement
 */
function initCatEyes() {
  const eyeLeft = document.getElementById('eyeLeft');
  const eyeRight = document.getElementById('eyeRight');
  
  if (!eyeLeft || !eyeRight) return;

  const eyes = [eyeLeft, eyeRight];

  document.addEventListener('mousemove', (e) => {
    eyes.forEach((eye) => {
      const pupil = eye.querySelector('.cat-pupil');
      if (!pupil) return;

      const eyeRect = eye.getBoundingClientRect();
      const eyeCenterX = eyeRect.left + eyeRect.width / 2;
      const eyeCenterY = eyeRect.top + eyeRect.height / 2;
      
      const deltaX = e.clientX - eyeCenterX;
      const deltaY = e.clientY - eyeCenterY;
      
      // Calculate angle and limit the distance the pupil can move (max 10px for cat slot)
      const angle = Math.atan2(deltaY, deltaX);
      const maxDistance = 10;
      const distance = Math.min(maxDistance, Math.hypot(deltaX, deltaY) / 12);
      
      const moveX = Math.cos(angle) * distance;
      const moveY = Math.sin(angle) * distance;
      
      pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  });
}

/**
 * 2. Falling Cat Rain Backdrop Effect
 */
function initCatRain() {
  const container = document.getElementById('catRainContainer');
  if (!container) return;

  const elements = ['🐾', '🐾', '🐱', '🐟', '🧶', '💖', '✨'];
  const maxElements = 15;

  for (let i = 0; i < maxElements; i++) {
    createFallingElement(container, elements);
  }
}

function createFallingElement(container, elements) {
  const el = document.createElement('div');
  el.className = 'cat-emoji';
  el.innerText = elements[Math.floor(Math.random() * elements.length)];
  
  // Random horizontal position
  el.style.left = `${Math.random() * 100}vw`;
  
  // Random delay and duration
  const delay = Math.random() * 10;
  const duration = 8 + Math.random() * 12;
  el.style.animationDelay = `${delay}s`;
  el.style.animationDuration = `${duration}s`;
  
  // Random sizing
  const scale = 0.5 + Math.random() * 0.8;
  el.style.transform = `scale(${scale})`;
  
  container.appendChild(el);

  // Recycle elements by moving them back to top and randomizing left
  el.addEventListener('animationiteration', () => {
    el.style.left = `${Math.random() * 100}vw`;
  });
}

/**
 * 3. Countdown Timer Logic
 * Target is August 23, 2026, at 14:00.
 */
function initCountdown() {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const timerTitle = document.querySelector('.countdown-section .section-title');
  const timerContainer = document.getElementById('countdownTimer');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // Target: 2026-08-23 14:00:00 (Note: Month 7 is August in JavaScript Date)
  const targetDate = new Date(2026, 7, 23, 14, 0, 0);
  const endDate = new Date(2026, 7, 23, 16, 0, 0);

  function updateTimer() {
    const currentTime = new Date();
    const timeRemaining = targetDate - currentTime;
    const timeRemainingEnd = endDate - currentTime;

    if (timeRemaining > 0) {
      // Party is in the future
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      daysEl.innerText = String(days).padStart(2, '0');
      hoursEl.innerText = String(hours).padStart(2, '0');
      minutesEl.innerText = String(minutes).padStart(2, '0');
      secondsEl.innerText = String(seconds).padStart(2, '0');
    } else if (timeRemainingEnd > 0) {
      // Party is happening right now
      if (timerTitle) timerTitle.innerHTML = '🎈 Kalaset är igång just nu! 🐾';
      timerContainer.innerHTML = `
        <div style="font-size: 20px; font-weight: 700; color: #fecdd3; padding: 10px; text-align: center; width: 100%;">
          Kom in och mys! Kalaset slutar kl 16:00.
        </div>
      `;
      clearInterval(timerInterval);
    } else {
      // Party has ended
      if (timerTitle) timerTitle.innerHTML = '👋 Kalaset har slutat';
      timerContainer.innerHTML = `
        <div style="font-size: 16px; font-weight: 500; color: #a1a1aa; padding: 10px; text-align: center; width: 100%;">
          Tack för att du kom och firade med oss! Mjau!
        </div>
      `;
      clearInterval(timerInterval);
    }
  }

  // Initial call and set interval
  updateTimer();
  const timerInterval = setInterval(updateTimer, 1000);
}

/**
 * 4. RSVP Handling & LocalStorage Persistence
 */
function initRSVP() {
  const rsvpForm = document.getElementById('rsvpForm');
  const successMessage = document.getElementById('successMessage');
  const rsvpSummary = document.getElementById('rsvpSummary');
  const resetBtn = document.getElementById('resetBtn');

  if (!rsvpForm || !successMessage || !rsvpSummary || !resetBtn) return;

  const storageKey = 'cat_party_rsvp';

  // Load existing RSVP
  const savedData = localStorage.getItem(storageKey);
  if (savedData) {
    try {
      const data = JSON.parse(savedData);
      showSuccess(data);
    } catch (e) {
      localStorage.removeItem(storageKey);
    }
  }

  // Handle Form Submit
  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('guestName').value.trim();
    const count = document.getElementById('guestCount').value;
    const notes = document.getElementById('guestNotes').value.trim();

    if (!name) return;

    const rsvpData = {
      name,
      count,
      notes: notes || 'Inga allergier eller särskilda önskemål.'
    };

    // Save to localStorage
    localStorage.setItem(storageKey, JSON.stringify(rsvpData));

    // Show success view
    showSuccess(rsvpData);
  });

  // Handle Reset RSVP
  resetBtn.addEventListener('click', () => {
    localStorage.removeItem(storageKey);
    successMessage.style.display = 'none';
    rsvpForm.style.display = 'flex';
    rsvpForm.reset();
  });

  function showSuccess(data) {
    rsvpForm.style.display = 'none';
    successMessage.style.display = 'block';
    
    rsvpSummary.innerHTML = `
      <p><strong>Anmäld gäst:</strong> ${escapeHTML(data.name)}</p>
      <p><strong>Antal kattungar:</strong> ${data.count}</p>
      <p><strong>Info/Allergier:</strong> ${escapeHTML(data.notes)}</p>
    `;
  }
}

// Simple HTML escaping helper for safety
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
