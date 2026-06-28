document.addEventListener('DOMContentLoaded', () => {
  initPetals();
  initCountdown();
  initRSVP();
});

/**
 * 1. Subtle floating petal / confetti effect
 */
function initPetals() {
  const container = document.getElementById('petalsContainer');
  if (!container) return;

  const symbols = ['🌸', '🌿', '✦', '🤍', '🌺', '✿'];
  const count = 12;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'petal';
    el.innerText = symbols[Math.floor(Math.random() * symbols.length)];

    el.style.left            = `${Math.random() * 100}vw`;
    el.style.fontSize        = `${10 + Math.random() * 14}px`;
    el.style.animationDelay    = `${Math.random() * 15}s`;
    el.style.animationDuration = `${14 + Math.random() * 16}s`;

    container.appendChild(el);

    el.addEventListener('animationiteration', () => {
      el.style.left = `${Math.random() * 100}vw`;
    });
  }
}

/**
 * 2. Countdown — targeting 2026-08-23 at 14:00
 */
function initCountdown() {
  const daysEl      = document.getElementById('days');
  const hoursEl     = document.getElementById('hours');
  const minutesEl   = document.getElementById('minutes');
  const secondsEl   = document.getElementById('seconds');
  const timerEl     = document.getElementById('countdownTimer');
  const heading     = document.querySelector('.countdown-section .section-heading');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const target = new Date(2026, 7, 16, 14, 0, 0); // August = month 7
  const end    = new Date(2026, 7, 16, 16, 0, 0);

  function tick() {
    const now       = new Date();
    const remaining = target - now;
    const tillEnd   = end - now;

    if (remaining > 0) {
      const d = Math.floor(remaining / 864e5);
      const h = Math.floor((remaining % 864e5) / 36e5);
      const m = Math.floor((remaining % 36e5)  / 6e4);
      const s = Math.floor((remaining % 6e4)   / 1e3);

      daysEl.textContent    = String(d).padStart(2, '0');
      hoursEl.textContent   = String(h).padStart(2, '0');
      minutesEl.textContent = String(m).padStart(2, '0');
      secondsEl.textContent = String(s).padStart(2, '0');

    } else if (tillEnd > 0) {
      if (heading) heading.textContent = 'Kalaset pågår just nu!';
      if (timerEl) timerEl.innerHTML = `
        <p style="font-family:'Cormorant Garamond',serif;font-size:22px;font-style:italic;color:#e8547a;text-align:center;padding:20px 0;">
          Välkommen in — festen är igång fram till kl 16:00 🐾
        </p>`;
      clearInterval(interval);

    } else {
      if (heading) heading.textContent = 'Kalaset är avslutat';
      if (timerEl) timerEl.innerHTML = `
        <p style="font-family:'Cormorant Garamond',serif;font-size:20px;font-style:italic;color:#a89590;text-align:center;padding:20px 0;">
          Tack alla för en underbar dag! 🌸
        </p>`;
      clearInterval(interval);
    }
  }

  tick();
  const interval = setInterval(tick, 1000);
}

/**
 * 3. RSVP — localStorage persistence
 */
function initRSVP() {
  const form    = document.getElementById('rsvpForm');
  const success = document.getElementById('successMessage');
  const summary = document.getElementById('rsvpSummary');
  const reset   = document.getElementById('resetBtn');

  if (!form || !success || !summary || !reset) return;

  const KEY = 'alice_cat_party_2026';

  const saved = localStorage.getItem(KEY);
  if (saved) {
    try { showSuccess(JSON.parse(saved)); }
    catch { localStorage.removeItem(KEY); }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      name:  document.getElementById('guestName').value.trim(),
      count: document.getElementById('guestCount').value,
      notes: document.getElementById('guestNotes').value.trim()
        || 'Inga specifika önskemål.'
    };
    if (!data.name) return;
    localStorage.setItem(KEY, JSON.stringify(data));
    showSuccess(data);
  });

  reset.addEventListener('click', () => {
    localStorage.removeItem(KEY);
    success.style.display = 'none';
    form.style.display    = 'flex';
    form.reset();
  });

  function showSuccess(data) {
    form.style.display    = 'none';
    success.style.display = 'block';
    summary.innerHTML = `
      <p><strong>Namn:</strong> ${esc(data.name)}</p>
      <p><strong>Antal:</strong> ${data.count} person${data.count > 1 ? 'er' : ''}</p>
      <p><strong>Övrigt:</strong> ${esc(data.notes)}</p>
    `;
  }
}

function esc(str) {
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#039;');
}
