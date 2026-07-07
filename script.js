/**
 * Centralized Party Date Configuration
 * Note: month is 0-indexed (7 = August)
 */
const PARTY_CONFIG = {
  year: 2026,
  month: 7, // August
  day: 16,
  hour: 14,
  minute: 0,
  durationHours: 2,
  dateStringSwedish: '16 Augusti 2026',
  dateWithDaySwedish: 'Söndag, 16 Augusti 2026',
  timeSwedish: '14:00 — 16:00',
  rsvpDeadlineSwedish: '31 Juli (men gärna så snart som möjligt)',
  descriptionSwedish: 'Du är hjärtligt välkommen till Alices katt-inspirerade 10-årsfest den 16 augusti kl 14:00 på Kvarnbogatan 36 i Uppsala.'
};

document.addEventListener('DOMContentLoaded', () => {
  initCentralizedDate();
  initPetals();
  initCountdown();
  initRSVP();
});

function initCentralizedDate() {
  document.title = `Alices 10-Års Fest — ${PARTY_CONFIG.dateStringSwedish}`;
  
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', PARTY_CONFIG.descriptionSwedish);
  }
  
  const heroSubtitle = document.getElementById('heroSubtitle');
  if (heroSubtitle) {
    heroSubtitle.textContent = `10 år — ${PARTY_CONFIG.dateStringSwedish}`;
  }
  
  const detailsDate = document.getElementById('detailsDate');
  if (detailsDate) {
    detailsDate.textContent = PARTY_CONFIG.dateWithDaySwedish;
  }
  
  const detailsTime = document.getElementById('detailsTime');
  if (detailsTime) {
    detailsTime.textContent = `Kl. ${PARTY_CONFIG.timeSwedish}`;
  }
  
  const rsvpDeadline = document.getElementById('rsvpDeadline');
  if (rsvpDeadline) {
    rsvpDeadline.textContent = PARTY_CONFIG.rsvpDeadlineSwedish;
  }
  
  const successDate = document.getElementById('successDate');
  if (successDate) {
    successDate.textContent = `Vi ses söndagen den ${PARTY_CONFIG.day} Augusti kl. ${PARTY_CONFIG.hour}:00!`;
  }
  
  const footerDate = document.getElementById('footerDate');
  if (footerDate) {
    footerDate.textContent = `${PARTY_CONFIG.dateStringSwedish} · Kl. ${PARTY_CONFIG.hour}:00–${PARTY_CONFIG.hour + PARTY_CONFIG.durationHours}:00`;
  }
}

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
 * 2. Countdown — targeting 2026-08-16 at 14:00
 */
function initCountdown() {
  const daysEl      = document.getElementById('days');
  const hoursEl     = document.getElementById('hours');
  const minutesEl   = document.getElementById('minutes');
  const secondsEl   = document.getElementById('seconds');
  const timerEl     = document.getElementById('countdownTimer');
  const heading     = document.querySelector('.countdown-section .section-heading');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const target = new Date(PARTY_CONFIG.year, PARTY_CONFIG.month, PARTY_CONFIG.day, PARTY_CONFIG.hour, PARTY_CONFIG.minute, 0);
  const end    = new Date(PARTY_CONFIG.year, PARTY_CONFIG.month, PARTY_CONFIG.day, PARTY_CONFIG.hour + PARTY_CONFIG.durationHours, PARTY_CONFIG.minute, 0);

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
 * 3. RSVP — sends data to Google Sheets via Apps Script, localStorage for UX
 *
 * SETUP (one-time, ~3 min):
 *  1. Go to https://sheets.new  → create a spreadsheet, note its ID from the URL.
 *  2. In the spreadsheet: Extensions → Apps Script → paste the script from SHEETS_SCRIPT.md.
 *  3. Click Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone.
 *  4. Copy the deployment URL and paste it below as APPS_SCRIPT_URL.
 */
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwZ29DYASooO_mD4zc3qN74ytUgHtsvFQ471pj0TbC5udJPm-GY0pWs2_p07cAgIPtc7Q/exec';

function initRSVP() {
  const form      = document.getElementById('rsvpForm');
  const success   = document.getElementById('successMessage');
  const summary   = document.getElementById('rsvpSummary');
  const reset     = document.getElementById('resetBtn');
  const submitBtn = document.getElementById('submitBtn');
  const errorBox  = document.getElementById('rsvpError');

  if (!form || !success || !summary || !reset) return;

  const KEY = 'alice_cat_party_2026';

  // Show confirmation if already submitted in this browser
  const saved = localStorage.getItem(KEY);
  if (saved) {
    try { showSuccess(JSON.parse(saved)); }
    catch { localStorage.removeItem(KEY); }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      name:      document.getElementById('guestName').value.trim(),
      count:     document.getElementById('guestCount').value,
      notes:     document.getElementById('guestNotes').value.trim() || 'Inga specifika önskemål.',
      timestamp: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 19).replace('T', ' ')
    };
    if (!data.name) return;

    // Loading state
    setLoading(true);
    if (errorBox) errorBox.style.display = 'none';

    const configured = APPS_SCRIPT_URL && APPS_SCRIPT_URL !== 'PASTE_YOUR_APPS_SCRIPT_URL_HERE';

    if (configured) {
      try {
        // Apps Script requires no-cors for the initial fetch
        await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(data)
        });
        // no-cors gives opaque response, so we assume success if no throw
        localStorage.setItem(KEY, JSON.stringify(data));
        showSuccess(data);
      } catch (err) {
        console.error('RSVP submission failed:', err);
        showError();
      } finally {
        setLoading(false);
      }
    } else {
      // URL not yet configured — save locally and show success anyway
      console.warn('Apps Script URL not configured. Saving to localStorage only.');
      localStorage.setItem(KEY, JSON.stringify(data));
      setLoading(false);
      showSuccess(data);
    }
  });

  reset.addEventListener('click', () => {
    localStorage.removeItem(KEY);
    success.style.display = 'none';
    form.style.display    = 'flex';
    if (errorBox) errorBox.style.display = 'none';
    form.reset();
  });

  function setLoading(on) {
    if (!submitBtn) return;
    submitBtn.disabled = on;
    submitBtn.textContent = on ? 'Skickar…' : 'Skicka anmälan';
    submitBtn.style.opacity = on ? '0.7' : '1';
  }

  function showError() {
    if (!errorBox) return;
    errorBox.style.display = 'block';
  }

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
