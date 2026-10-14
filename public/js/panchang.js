/**
 * Cosmic Finance — Bilingual Panchang Controller (English & Hindi)
 * Client-side language switching and real-time Muhurat active tracking.
 */

document.addEventListener('DOMContentLoaded', () => {
  const langButtons = document.querySelectorAll('.panchang-lang-btn');
  const enElements = document.querySelectorAll('.panchang-en');
  const hiElements = document.querySelectorAll('.panchang-hi');

  // 1. Language Toggle with Persistence
  function setLanguage(lang) {
    if (lang === 'hi') {
      enElements.forEach(el => el.classList.add('hidden-lang'));
      hiElements.forEach(el => el.classList.remove('hidden-lang'));
      langButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === 'hi');
      });
      localStorage.setItem('cosmic_panchang_lang', 'hi');
    } else {
      enElements.forEach(el => el.classList.remove('hidden-lang'));
      hiElements.forEach(el => el.classList.add('hidden-lang'));
      langButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === 'en');
      });
      localStorage.setItem('cosmic_panchang_lang', 'en');
    }
  }

  // Bind click handlers
  langButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = btn.dataset.lang || 'en';
      setLanguage(lang);
    });
  });

  // Restore saved preference (default to 'hi')
  const savedLang = localStorage.getItem('cosmic_panchang_lang') || 'hi';
  setLanguage(savedLang);

  // 2. Real-time Muhurat Status Evaluation (Rahu Kaal & Abhijit)
  function evaluateMuhuratStatus() {
    const now = new Date();
    // Convert to IST minutes from midnight
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();
    let istTotalMinutes = (utcHours * 60 + utcMinutes) + 330; // +5:30
    if (istTotalMinutes >= 1440) istTotalMinutes -= 1440;

    function timeToMinutes(str) {
      if (!str) return null;
      const parts = str.split(':');
      if (parts.length < 2) return null;
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }

    // Rahu Kaal Tracker
    const rahuCard = document.getElementById('rahuKaalCard');
    const rahuBadge = document.getElementById('rahuKaalStatusBadge');
    if (rahuCard && rahuBadge) {
      const startMin = timeToMinutes(rahuCard.dataset.start);
      const endMin = timeToMinutes(rahuCard.dataset.end);

      if (startMin !== null && endMin !== null) {
        if (istTotalMinutes >= startMin && istTotalMinutes <= endMin) {
          rahuBadge.className = 'muhurat-badge badge-active-danger';
          rahuBadge.innerHTML = '<span class="status-pulse-dot red"></span> ACTIVE NOW (Cautious Window)';
        } else if (istTotalMinutes < startMin) {
          rahuBadge.className = 'muhurat-badge badge-upcoming';
          rahuBadge.textContent = 'Upcoming Today';
        } else {
          rahuBadge.className = 'muhurat-badge badge-passed';
          rahuBadge.textContent = 'Passed for Today';
        }
      }
    }

    // Abhijit Muhurat Tracker
    const abhijitCard = document.getElementById('abhijitMuhuratCard');
    const abhijitBadge = document.getElementById('abhijitStatusBadge');
    if (abhijitCard && abhijitBadge) {
      const aStartMin = timeToMinutes(abhijitCard.dataset.start);
      const aEndMin = timeToMinutes(abhijitCard.dataset.end);

      if (aStartMin !== null && aEndMin !== null) {
        if (istTotalMinutes >= aStartMin && istTotalMinutes <= aEndMin) {
          abhijitBadge.className = 'muhurat-badge badge-active-success';
          abhijitBadge.innerHTML = '<span class="status-pulse-dot green"></span> ACTIVE NOW (Auspicious Window)';
        } else if (istTotalMinutes < aStartMin) {
          abhijitBadge.className = 'muhurat-badge badge-upcoming';
          abhijitBadge.textContent = 'Upcoming Today';
        } else {
          abhijitBadge.className = 'muhurat-badge badge-passed';
          abhijitBadge.textContent = 'Passed for Today';
        }
      }
    }
  }

  evaluateMuhuratStatus();
  setInterval(evaluateMuhuratStatus, 30000);
});
