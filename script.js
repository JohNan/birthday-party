document.addEventListener('DOMContentLoaded', () => {
  initMinionEye();
  initBananaRain();
  initCountdown();
  initRSVP();
});

/**
 * 1. Minion Eye Tracking Movement
 */
function initMinionEye() {
  const minionEye = document.getElementById('minionEye');
  const pupil = minionEye ? minionEye.querySelector('.minion-pupil') : null;
  
  if (!minionEye || !pupil) return;

  document.addEventListener('mousemove', (e) => {
    const eyeRect = minionEye.getBoundingClientRect();
    const eyeCenterX = eyeRect.left + eyeRect.width / 2;
    const eyeCenterY = eyeRect.top + eyeRect.height / 2;
    
    const deltaX = e.clientX - eyeCenterX;
    const deltaY = e.clientY - eyeCenterY;
    
    // Calculate angle and limit the distance the pupil can move (max 15px)
    const angle = Math.atan2(deltaY, deltaX);
    const maxDistance = 15;
    const distance = Math.min(maxDistance, Math.hypot(deltaX, deltaY) / 10);
    
    const moveX = Math.cos(angle) * distance;
    const moveY = Math.sin(angle) * distance;
    
    pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });
}

/**
 * 2. Falling Banana Backdrop Effect
 */
function initBananaRain() {
  const container = document.getElementById('bananaRainContainer');
  if (!container) return;

  const elements = ['🍌', '🍌', '🎈', '🎉', '🍌'];
  const maxElements = 15;

  for (let i = 0; i < maxElements; i++) {
    createFallingElement(container, elements);
  }
}

function createFallingElement(container, elements) {
  const el = document.createElement('div');
  el.className = 'banana-emoji';
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
 * Target is 14:00 today.
 */
function initCountdown() {
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const timerTitle = document.querySelector('.countdown-section .section-title');
  const timerContainer = document.getElementById('countdownTimer');

  if (!hoursEl || !minutesEl || !secondsEl) return;

  // Set target date to today at 14:00:00 (local time)
  const now = new Date();
  const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0, 0);
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 0, 0);

  function updateTimer() {
    const currentTime = new Date();
    const timeRemaining = targetDate - currentTime;
    const timeSinceStart = currentTime - targetDate;
    const timeRemainingEnd = endDate - currentTime;

    if (timeRemaining > 0) {
      // Party is in the future (today before 14:00)
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      hoursEl.innerText = String(hours).padStart(2, '0');
      minutesEl.innerText = String(minutes).padStart(2, '0');
      secondsEl.innerText = String(seconds).padStart(2, '0');
    } else if (timeRemainingEnd > 0) {
      // Party is happening right now (between 14:00 and 16:00)
      if (timerTitle) timerTitle.innerHTML = '🎈 Kalaset är igång just nu! 🍌';
      timerContainer.innerHTML = `
        <div style="font-size: 20px; font-weight: 700; color: #fde047; padding: 10px; text-align: center; width: 100%;">
          Kom in och ät glass! Vi slutar kl 16:00.
        </div>
      `;
      clearInterval(timerInterval);
    } else {
      // Party has ended (after 16:00)
      if (timerTitle) timerTitle.innerHTML = '👋 Kalaset har slutat';
      timerContainer.innerHTML = `
        <div style="font-size: 16px; font-weight: 500; color: #94a3b8; padding: 10px; text-align: center; width: 100%;">
          Tack för att du kom och firade med oss! Poopaye!
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

  const storageKey = 'minion_party_rsvp';

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
      <p><strong>Antal Minioner:</strong> ${data.count}</p>
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
