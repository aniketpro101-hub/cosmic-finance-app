/**
 * Cosmic Finance — Advanced Vedic Financial Kundli Engine Client
 * Handles full coordinate inputs, North & South Indian chart rendering,
 * planetary dignity calculation, financial houses breakdown, and Dr. Ashish Patni VIP consultation.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('tradingKundliForm');
  const formCard = document.getElementById('kundliFormCard');
  const processingState = document.getElementById('kundliProcessingState');
  const resultCard = document.getElementById('kundliResultCard');

  // Input Fields
  const fullNameInput = document.getElementById('fullName');
  const genderInput = document.getElementById('genderInput');
  const btnGenderMale = document.getElementById('btnGenderMale');
  const btnGenderFemale = document.getElementById('btnGenderFemale');

  const birthDay = document.getElementById('birthDay');
  const birthMonth = document.getElementById('birthMonth');
  const birthYear = document.getElementById('birthYear');
  const birthHrs = document.getElementById('birthHrs');
  const birthMin = document.getElementById('birthMin');
  const birthSec = document.getElementById('birthSec');
  const pobInput = document.getElementById('pob');

  const btnCurrentLocation = document.getElementById('btnCurrentLocation');
  const btnSetNow = document.getElementById('btnSetNow');
  const btnToggleSettings = document.getElementById('btnToggleSettings');
  const advancedSettingsDrawer = document.getElementById('advancedSettingsDrawer');
  const settingsIcon = document.getElementById('settingsIcon');
  const btnRandomKP = document.getElementById('btnRandomKP');
  const horaryInput = document.getElementById('horaryNumber');

  // Result Elements
  const resultUserName = document.getElementById('resultUserName');
  const resultMetaLine = document.getElementById('resultMetaLine');
  const speculationScore = document.getElementById('speculationScore');
  const speculationDesc = document.getElementById('speculationDesc');
  const personalityArchetype = document.getElementById('personalityArchetype');
  const personalityDesc = document.getElementById('personalityDesc');
  const favoredAsset = document.getElementById('favoredAsset');
  const planetaryTableBody = document.getElementById('planetaryTableBody');
  const kundliWhatsAppLink = document.getElementById('kundliWhatsAppLink');

  // Chart Switchers
  const btnChartStyleNorth = document.getElementById('btnChartStyleNorth');
  const btnChartStyleSouth = document.getElementById('btnChartStyleSouth');
  const chartViewNorth = document.getElementById('chartViewNorth');
  const chartViewSouth = document.getElementById('chartViewSouth');
  const southIndianGrid = document.getElementById('southIndianGrid');

  let activeAnalysisData = null;

  // Dynamic Bot Protection Challenge (Human Number Calculation)
  let botNum1 = Math.floor(Math.random() * 8) + 2; // 2 to 9
  let botNum2 = Math.floor(Math.random() * 7) + 1; // 1 to 7
  let botExpectedAnswer = botNum1 + botNum2;

  const botMathQuestionEls = document.querySelectorAll('.bot-math-question');
  botMathQuestionEls.forEach(el => {
    el.textContent = `${botNum1} + ${botNum2} = ?`;
  });

  const botMathInputs = document.querySelectorAll('.bot-math-input');
  const botStatusEls = document.querySelectorAll('.bot-status-indicator');

  botMathInputs.forEach(inp => {
    inp.addEventListener('input', () => {
      const val = parseInt(inp.value.trim(), 10);
      if (val === botExpectedAnswer) {
        botStatusEls.forEach(st => {
          st.textContent = '✓ Verified Real Human';
          st.className = 'bot-status-indicator verified';
        });
      } else {
        botStatusEls.forEach(st => {
          st.textContent = 'Enter calculation result';
          st.className = 'bot-status-indicator';
        });
      }
    });
  });

  // 1. Gender Selection Toggle
  if (btnGenderMale && btnGenderFemale && genderInput) {
    btnGenderMale.addEventListener('click', () => {
      btnGenderMale.classList.add('active');
      btnGenderFemale.classList.remove('active');
      genderInput.value = 'Male';
    });
    btnGenderFemale.addEventListener('click', () => {
      btnGenderFemale.classList.add('active');
      btnGenderMale.classList.remove('active');
      genderInput.value = 'Female';
    });
  }

  // 2. NOW Button (Pre-fills live system date and time)
  if (btnSetNow) {
    btnSetNow.addEventListener('click', () => {
      const now = new Date();
      if (birthDay) birthDay.value = now.getDate();
      if (birthMonth) birthMonth.value = now.getMonth() + 1;
      if (birthYear) birthYear.value = now.getFullYear();
      if (birthHrs) birthHrs.value = now.getHours();
      if (birthMin) birthMin.value = now.getMinutes();
      if (birthSec) birthSec.value = now.getSeconds();
    });
  }

  // 3. CURRENT LOCATION Button & Universal City Autocomplete
  const pobLatInp = document.getElementById('pobLat');
  const pobLngInp = document.getElementById('pobLng');

  if (btnCurrentLocation && pobInput) {
    btnCurrentLocation.addEventListener('click', () => {
      if (navigator.geolocation) {
        btnCurrentLocation.innerHTML = '<span>⏳ Detecting GPS...</span>';
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            pobInput.value = `Current Location (${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E)`;
            if (pobLatInp) pobLatInp.value = lat;
            if (pobLngInp) pobLngInp.value = lng;
            const latDeg = document.getElementById('latDeg');
            const latMin = document.getElementById('latMin');
            const longDeg = document.getElementById('longDeg');
            const longMin = document.getElementById('longMin');
            if (latDeg) latDeg.value = Math.floor(Math.abs(lat));
            if (latMin) latMin.value = Math.round((Math.abs(lat) % 1) * 60);
            if (longDeg) longDeg.value = Math.floor(Math.abs(lng));
            if (longMin) longMin.value = Math.round((Math.abs(lng) % 1) * 60);
            btnCurrentLocation.innerHTML = '<span>✅ GPS Located</span>';
          },
          () => {
            pobInput.value = 'Mumbai, Maharashtra';
            if (pobLatInp) pobLatInp.value = '19.0760';
            if (pobLngInp) pobLngInp.value = '72.8777';
            btnCurrentLocation.innerHTML = '<span>📍 Mumbai (Default)</span>';
          },
          { timeout: 5000 }
        );
      } else {
        pobInput.value = 'Mumbai, Maharashtra';
      }
    });
  }

  // Universal City Autocomplete Initializer (Supports all forms: Home & Kundli pages)
  function initCityAutocomplete() {
    const cityInputs = document.querySelectorAll('.pob-autocomplete-input, #pob, input[name="pob"]');

    cityInputs.forEach(inputEl => {
      const container = inputEl.closest('.pob-input-wrapper') || inputEl.closest('.input-icon-wrap') || inputEl.parentElement;
      const form = inputEl.closest('form');
      const dropdown = (container && container.querySelector('.city-autocomplete-dropdown')) ||
                       (form && form.querySelector('.city-autocomplete-dropdown')) ||
                       document.getElementById('cityAutocompleteDropdown');

      const latInp = (container && container.querySelector('input[name="lat"]')) ||
                     (form && form.querySelector('input[name="lat"]')) ||
                     document.getElementById('pobLat');

      const lngInp = (container && container.querySelector('input[name="lng"]')) ||
                     (form && form.querySelector('input[name="lng"]')) ||
                     document.getElementById('pobLng');

      if (!dropdown) return;

      let debounceTimer = null;
      let activeIndex = -1;
      let currentResults = [];

      function highlightItem(index) {
        const items = dropdown.querySelectorAll('.city-autocomplete-item');
        items.forEach((item, idx) => {
          if (idx === index) {
            item.classList.add('is-active');
            item.setAttribute('aria-selected', 'true');
            item.scrollIntoView({ block: 'nearest' });
          } else {
            item.classList.remove('is-active');
            item.removeAttribute('aria-selected');
          }
        });
      }

      function selectCity(cityObj) {
        if (!cityObj) return;
        inputEl.value = cityObj.name;
        if (latInp) latInp.value = cityObj.lat;
        if (lngInp) lngInp.value = cityObj.lng;

        // Also update advanced coordinates drawer if available
        const latDeg = document.getElementById('latDeg');
        const latMin = document.getElementById('latMin');
        const longDeg = document.getElementById('longDeg');
        const longMin = document.getElementById('longMin');
        if (latDeg) latDeg.value = Math.floor(Math.abs(cityObj.lat));
        if (latMin) latMin.value = Math.round((Math.abs(cityObj.lat) % 1) * 60);
        if (longDeg) longDeg.value = Math.floor(Math.abs(cityObj.lng));
        if (longMin) longMin.value = Math.round((Math.abs(cityObj.lng) % 1) * 60);

        dropdown.style.display = 'none';
        dropdown.innerHTML = '';
        currentResults = [];
        activeIndex = -1;
      }

      // Input event listener: fetches live suggestions as user types
      inputEl.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        clearTimeout(debounceTimer);
        activeIndex = -1;

        // Reset stale coordinates so un-selected city edits trigger accurate geo resolution
        if (latInp) latInp.value = '';
        if (lngInp) lngInp.value = '';

        if (val.length < 2) {
          dropdown.style.display = 'none';
          dropdown.innerHTML = '';
          currentResults = [];
          return;
        }

        debounceTimer = setTimeout(async () => {
          try {
            const res = await fetch(`/api/geo/cities?q=${encodeURIComponent(val)}`);
            const data = await res.json();
            if (data.status === 'success' && Array.isArray(data.cities) && data.cities.length > 0) {
              currentResults = data.cities;
              dropdown.innerHTML = data.cities.map((c, i) => {
                const parts = c.name.split(',');
                const mainName = parts[0].trim();
                const restName = parts.slice(1).join(',').trim();
                return `
                  <li class="city-autocomplete-item" data-index="${i}" data-lat="${c.lat}" data-lng="${c.lng}" data-name="${c.name}" role="option">
                    <span class="city-pin">📍</span>
                    <span class="city-name-text"><strong>${mainName}</strong>${restName ? ', ' + restName : ''}</span>
                    <span class="city-coords">${c.lat.toFixed(2)}°, ${c.lng.toFixed(2)}°</span>
                  </li>
                `;
              }).join('');
              dropdown.style.display = 'block';

              // Click handler on suggestions
              dropdown.querySelectorAll('.city-autocomplete-item').forEach(item => {
                item.addEventListener('click', (ev) => {
                  ev.preventDefault();
                  ev.stopPropagation();
                  const idx = parseInt(item.getAttribute('data-index'), 10);
                  selectCity(currentResults[idx]);
                });
              });
            } else {
              dropdown.style.display = 'none';
              currentResults = [];
            }
          } catch (err) {
            dropdown.style.display = 'none';
            currentResults = [];
          }
        }, 150);
      });

      // Keyboard navigation (ArrowDown, ArrowUp, Enter, Escape)
      inputEl.addEventListener('keydown', (e) => {
        if (dropdown.style.display === 'none' || currentResults.length === 0) return;

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          activeIndex = (activeIndex + 1) % currentResults.length;
          highlightItem(activeIndex);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          activeIndex = (activeIndex - 1 + currentResults.length) % currentResults.length;
          highlightItem(activeIndex);
        } else if (e.key === 'Enter') {
          if (activeIndex >= 0 && activeIndex < currentResults.length) {
            e.preventDefault();
            selectCity(currentResults[activeIndex]);
          } else if (currentResults.length > 0) {
            // Auto-select first suggestion if Enter pressed without highlighting
            e.preventDefault();
            selectCity(currentResults[0]);
          }
        } else if (e.key === 'Escape') {
          dropdown.style.display = 'none';
        }
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!inputEl.contains(e.target) && !dropdown.contains(e.target)) {
          dropdown.style.display = 'none';
        }
      });
    });
  }

  // Initialize universal autocomplete on all forms
  initCityAutocomplete();

  // Initialize all advanced settings drawers to strictly hidden by default everywhere
  document.querySelectorAll('.advanced-settings-drawer').forEach(drawer => {
    drawer.classList.add('hidden');
    drawer.style.display = 'none';
  });

  // 4. Advanced Settings Toggle ([+] SETTINGS starts minimized by default)
  const toggleButtons = document.querySelectorAll('.btn-toggle-settings, .compact-settings-btn, #btnToggleSettings');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const formScope = btn.closest('form') || btn.closest('.front-coordinates-card') || document;
      const targetDrawer = formScope.querySelector('.advanced-settings-drawer') || document.getElementById('advancedSettingsDrawer');
      const targetIcon = btn.querySelector('.toggle-symbol') || btn.querySelector('#settingsIcon') || document.getElementById('settingsIcon');
      const targetText = btn.querySelector('.toggle-text');

      if (targetDrawer) {
        const isHidden = targetDrawer.classList.contains('hidden') || targetDrawer.style.display === 'none';
        if (isHidden) {
          targetDrawer.classList.remove('hidden');
          targetDrawer.style.display = 'block';
          btn.setAttribute('aria-expanded', 'true');
          if (targetIcon) targetIcon.textContent = '−';
          if (targetText) targetText.textContent = 'Hide Settings';
          else if (!btn.querySelector('.toggle-symbol')) btn.innerHTML = '<span id="settingsIcon">[-]</span> HIDE SETTINGS';
        } else {
          targetDrawer.classList.add('hidden');
          targetDrawer.style.display = 'none';
          btn.setAttribute('aria-expanded', 'false');
          if (targetIcon) targetIcon.textContent = '+';
          if (targetText) targetText.textContent = 'Settings (GPS, Ayanamsha)';
          else if (!btn.querySelector('.toggle-symbol')) btn.innerHTML = '<span id="settingsIcon">[+]</span> SETTINGS';
        }
      }
    });
  });

  // 5. Random KP Horary Number (1-249)
  if (btnRandomKP && horaryInput) {
    btnRandomKP.addEventListener('click', () => {
      horaryInput.value = Math.floor(Math.random() * 249) + 1;
    });
  }

  // 6. Chart Style Toggles (North vs South Indian)
  if (btnChartStyleNorth && btnChartStyleSouth) {
    btnChartStyleNorth.addEventListener('click', () => {
      btnChartStyleNorth.classList.add('active');
      btnChartStyleSouth.classList.remove('active');
      if (chartViewNorth) chartViewNorth.classList.remove('hidden');
      if (chartViewSouth) chartViewSouth.classList.add('hidden');
    });

    btnChartStyleSouth.addEventListener('click', () => {
      btnChartStyleSouth.classList.add('active');
      btnChartStyleNorth.classList.remove('active');
      if (chartViewNorth) chartViewNorth.classList.add('hidden');
      if (chartViewSouth) chartViewSouth.classList.remove('hidden');
      if (activeAnalysisData) renderSouthIndianChart(activeAnalysisData);
    });
  }

  // 7. Form Submission Handler
  const activeForms = document.querySelectorAll('#tradingKundliForm, #homeCoordinatesForm');
  activeForms.forEach(curForm => {
    curForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const curNameInp = curForm.querySelector('#fullName') || fullNameInput;
      const curGenderInp = curForm.querySelector('#genderInput') || genderInput;
      const curDay = curForm.querySelector('#birthDay') || birthDay;
      const curMonth = curForm.querySelector('#birthMonth') || birthMonth;
      const curYear = curForm.querySelector('#birthYear') || birthYear;
      const curHrs = curForm.querySelector('#birthHrs') || birthHrs;
      const curMin = curForm.querySelector('#birthMin') || birthMin;
      const curSec = curForm.querySelector('#birthSec') || birthSec;
      const curPob = curForm.querySelector('#pob') || pobInput;
      const curPobLat = curForm.querySelector('#pobLat') || document.getElementById('pobLat');
      const curPobLng = curForm.querySelector('#pobLng') || document.getElementById('pobLng');

      const fullName = curNameInp ? curNameInp.value.trim() : 'Trader';
      const gender = curGenderInp ? curGenderInp.value : 'Male';
      const day = curDay ? parseInt(curDay.value, 10) : 15;
      const month = curMonth ? parseInt(curMonth.value, 10) : 1;
      const year = curYear ? parseInt(curYear.value, 10) : 1994;
      const hrs = curHrs ? parseInt(curHrs.value, 10) : 12;
      const min = curMin ? parseInt(curMin.value, 10) : 0;
      const sec = curSec ? parseInt(curSec.value, 10) : 0;
      let pob = curPob ? curPob.value.trim() : 'Mumbai, Maharashtra';
      let lat = curPobLat && curPobLat.value ? parseFloat(curPobLat.value) : null;
      let lng = curPobLng && curPobLng.value ? parseFloat(curPobLng.value) : null;

      // If lat or lng is missing, or if user typed a city name without clicking dropdown, auto-resolve immediately
      if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
        try {
          const geoRes = await fetch(`/api/geo/cities?q=${encodeURIComponent(pob)}`);
          const geoData = await geoRes.json();
          if (geoData.status === 'success' && geoData.cities && geoData.cities.length > 0) {
            const topMatch = geoData.cities[0];
            pob = topMatch.name;
            lat = topMatch.lat;
            lng = topMatch.lng;
            if (curPob) curPob.value = topMatch.name;
            if (curPobLat) curPobLat.value = topMatch.lat;
            if (curPobLng) curPobLng.value = topMatch.lng;
          }
        } catch (e) {
          // Graceful fallback handled by backend resolveCoordinates
        }
      }

      if (!fullName) {
        alert('Please enter your Full Name.');
        return;
      }

      if (!day || !month || !year) {
        alert('Please specify your Day, Month, and Year of birth.');
        return;
      }

      const ayanamsa = document.getElementById('ayanamsaSelect')?.value || 'N.C.Lahiri';
      const chartStyle = document.getElementById('chartStyleSelect')?.value || 'North Indian';
      const horaryNumber = horaryInput ? parseInt(horaryInput.value, 10) : null;

      // Animate Loading Ceremony
      if (formCard) formCard.style.display = 'none';
      if (processingState) processingState.style.display = 'flex';

      try {
        const payload = {
          fullName,
          gender,
          day, month, year,
          hrs, min, sec,
          pob,
          lat,
          lng,
          ayanamsa,
          chartStyle,
          horaryNumber
        };

        const response = await fetch('/api/kundli/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        setTimeout(() => {
          if (processingState) processingState.style.display = 'none';

          if (data.success && data.analysis) {
            activeAnalysisData = data.analysis;
            renderKundliResults(data.analysis);
            if (resultCard) {
              resultCard.style.display = 'block';
              resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          } else {
            if (formCard) formCard.style.display = 'block';
            alert(data.error || 'Unable to calculate Kundli. Please verify details.');
          }
        }, 900);

      } catch (err) {
        if (processingState) processingState.style.display = 'none';
        if (formCard) formCard.style.display = 'block';
        alert('Error connecting to astrological calculation engine.');
      }
    });
  });

  // 8. Master Render Function for Full Kundli Results
  function renderKundliResults(analysis) {
    if (!analysis) return;

    // Personalize Locked VIP Consultation Card
    const lockedTargetText = document.getElementById('lockedConsultantNotice');
    if (lockedTargetText) {
      lockedTargetText.textContent = `To unlock full personalized specification, Vimshottari Mahadasha timing, name-numerology compatibility and transit remedies for ${analysis.fullName}, please consult VIP Astrologer Dr. Ashish Patni.`;
    }

    const lockedWaBtn = document.getElementById('lockedWhatsAppCta');
    if (lockedWaBtn) {
      const msg = `Namaste Dr. Ashish Patni ji, I have calculated my Birth Coordinates for ${analysis.fullName} (DOB: ${analysis.dob}, Lagna: ${analysis.lagna.signName}) on Cosmic Finance and wish to consult you for my full personalized financial and multi-asset guidance.`;
      lockedWaBtn.href = `https://wa.me/919039610001?text=${encodeURIComponent(msg)}`;
    }

    // Header metadata
    if (resultUserName) resultUserName.textContent = `Vedic Financial Kundli for ${analysis.fullName}`;
    if (resultMetaLine) {
      resultMetaLine.innerHTML = `
        <span>📅 ${analysis.dob} (${analysis.tob})</span>
        <span>📍 ${analysis.pob}</span>
        <span>🪐 Lagna: <strong>${analysis.lagna.signName}</strong> (${analysis.lagna.degreesDisplay})</span>
        <span>🛡️ Ayanamsha: ${analysis.ayanamsa}</span>
      `;
    }

    // Speculation & Personality
    if (speculationScore) speculationScore.textContent = analysis.speculationYoga.badge;
    if (speculationDesc) speculationDesc.textContent = analysis.speculationYoga.description;
    if (personalityArchetype) personalityArchetype.textContent = analysis.personality.title;
    if (personalityDesc) personalityDesc.textContent = analysis.personality.description;
    if (favoredAsset) favoredAsset.textContent = analysis.favoredAsset;

    // Financial Pillars
    if (analysis.financialHouses) {
      const fh = analysis.financialHouses;
      const h2Sign = document.getElementById('h2SignDisplay');
      const h5Sign = document.getElementById('h5SignDisplay');
      const h9Sign = document.getElementById('h9SignDisplay');
      const h11Sign = document.getElementById('h11SignDisplay');

      if (h2Sign && fh.house2Dhana) h2Sign.textContent = `${fh.house2Dhana.signName.split(' ')[0]} (Lord: ${fh.house2Dhana.lord})`;
      if (h5Sign && fh.house5Speculation) h5Sign.textContent = `${fh.house5Speculation.signName.split(' ')[0]} (Lord: ${fh.house5Speculation.lord})`;
      if (h9Sign && fh.house9Bhagya) h9Sign.textContent = `${fh.house9Bhagya.signName.split(' ')[0]} (Lord: ${fh.house9Bhagya.lord})`;
      if (h11Sign && fh.house11Labha) h11Sign.textContent = `${fh.house11Labha.signName.split(' ')[0]} (Lord: ${fh.house11Labha.lord})`;
    }

    // Populate North Indian Diamond SVG Houses
    renderNorthIndianSvg(analysis);

    // Wire up Executive Action Toolbar (Download PDF, Print, Unlock VIP)
    setupActionToolbar(analysis);

    // Populate South Indian Grid if active
    renderSouthIndianChart(analysis);

    // Populate Planetary Positions Table
    renderPlanetaryTable(analysis.planets);

    // Populate Vimshottari Dasha
    if (analysis.vimshottariDasha) {
      const vd = analysis.vimshottariDasha;
      const nakLabel = document.getElementById('birthNakshatraLabel');
      if (nakLabel) nakLabel.textContent = `Birth Nakshatra: ${vd.birthNakshatra} (${vd.birthMoonLongitude}°)`;

      if (vd.activeMahadasha) {
        const mLord = document.getElementById('mahadashaLord');
        const mDates = document.getElementById('mahadashaDates');
        const mDesc = document.getElementById('mahadashaDesc');
        if (mLord) mLord.textContent = `${vd.activeMahadasha.glyph} Lord ${vd.activeMahadasha.lord} (${vd.activeMahadasha.vedic})`;
        if (mDates) mDates.textContent = `${vd.activeMahadasha.startDate} to ${vd.activeMahadasha.endDate}`;
        if (mDesc) mDesc.textContent = vd.activeMahadasha.significance;
      }

      if (vd.activeAntardasha) {
        const aLord = document.getElementById('antardashaLord');
        const aDates = document.getElementById('antardashaDates');
        if (aLord) aLord.textContent = `Lord ${vd.activeAntardasha.lord} (${vd.activeAntardasha.vedic})`;
        if (aDates) aDates.textContent = `${vd.activeAntardasha.startDate} to ${vd.activeAntardasha.endDate}`;
      }
    }

    // Populate Classical Dhana & Wealth Yogas
    const dhanaList = document.getElementById('dhanaYogasList');
    if (dhanaList && analysis.detectedYogas) {
      dhanaList.innerHTML = analysis.detectedYogas.map(yoga => `
        <div class="dhana-yoga-item">
          <div class="dhana-item-top">
            <span class="dhana-item-name">${escapeHtml(yoga.name)}</span>
            <span class="dhana-category-badge badge-gold">✦ Auspicious Dhana Yoga</span>
          </div>
          <p class="dhana-item-desc">${escapeHtml(yoga.impact)}</p>
          <div class="dhana-item-footer">
            <span class="dhana-source-tag">📜 ${escapeHtml(yoga.classicalSource)}</span>
          </div>
        </div>
      `).join('');
    }

    // Configure Dr. Ashish Patni VIP WhatsApp Link
    if (kundliWhatsAppLink && analysis.consultation && analysis.consultation.whatsappUrl) {
      kundliWhatsAppLink.href = analysis.consultation.whatsappUrl;
    }
  }

  // 9. North Indian Diamond SVG House Plotter
  function renderNorthIndianSvg(analysis) {
    if (!analysis) return;
    const container = document.getElementById('northIndianChartContainer');
    if (container && analysis.d1Svg) {
      container.innerHTML = analysis.d1Svg;
      return;
    }

    if (!analysis.houses) return;
    // Set rashi short labels in houses 1-12
    const shortNames = ['Mesha', 'Vrish', 'Mith', 'Kark', 'Simh', 'Kany', 'Tula', 'Vris', 'Dhan', 'Maka', 'Kumb', 'Meen'];

    analysis.houses.forEach(h => {
      const signLabel = document.getElementById(`svgSign${h.houseNumber}`);
      if (signLabel) {
        signLabel.textContent = shortNames[h.signIndex] || `H${h.houseNumber}`;
      }

      // Plot planets inside house group
      const gOccupants = document.getElementById(`svgHousePlanets${h.houseNumber}`);
      if (gOccupants) {
        gOccupants.innerHTML = '';
        if (h.occupants && h.occupants.length > 0) {
          const planetText = h.occupants.map(p => {
            const rx = p.isRetrograde ? '℞' : '';
            return `${p.glyph}${rx}`;
          }).join(' ');

          const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          textEl.setAttribute('x', '0');
          textEl.setAttribute('y', '0');
          textEl.setAttribute('text-anchor', 'middle');
          textEl.setAttribute('fill', '#ffd700');
          textEl.setAttribute('font-size', '13');
          textEl.setAttribute('font-weight', 'bold');
          textEl.textContent = planetText;
          gOccupants.appendChild(textEl);
        }
      }
    });
  }

  // Helper to open the dedicated 5-page Institutional Wealth Dossier in a clean window
  function openWealthDossierWindow(analysisData, autoPrint = false) {
    if (!analysisData) return;
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `/kundli/dossier${autoPrint ? '?print=1' : ''}`;
    form.target = '_blank';
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'analysis';
    input.value = JSON.stringify(analysisData);
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    setTimeout(() => {
      try { document.body.removeChild(form); } catch (e) {}
    }, 1500);
  }

  // 9b. Setup Executive Action Toolbar (Download PDF, Print, Unlock Financial Future)
  function setupActionToolbar(analysis) {
    if (!analysis) return;

    // Download PDF Button
    const btnDownload = document.getElementById('btnDownloadDossierPdf');
    const noticeEl = document.getElementById('pdfDownloadNotice');
    const noticeText = document.getElementById('pdfNoticeText');

    if (btnDownload) {
      btnDownload.onclick = () => {
        const origContent = btnDownload.innerHTML;
        btnDownload.innerHTML = `
          <span class="action-icon">⏳</span>
          <div class="action-texts">
            <span class="action-primary">Opening Wealth Dossier...</span>
            <span class="action-secondary">Ready for instant PDF Save</span>
          </div>
        `;

        if (noticeEl) {
          noticeEl.style.display = 'flex';
          if (noticeText) {
            noticeText.innerHTML = '✨ <strong>Opening Your 5-Page Wealth Dossier...</strong> High-resolution Parashari vector geometry loaded. In the print dialog, select <strong>"Save as PDF"</strong> to save your report.';
          }
        }

        // Open standalone 5-page dossier formatted for immediate PDF save/print
        openWealthDossierWindow(analysis, true);

        // Restore button state after short delay
        setTimeout(() => {
          btnDownload.innerHTML = origContent;
          if (noticeText) {
            noticeText.innerHTML = '✅ <strong>Dossier Loaded in New Tab!</strong> You can save as PDF or print anytime.';
          }
        }, 3000);
      };
    }

    // Print Button (Prints ONLY the 5-page dossier report, completely free of website chrome)
    const btnPrint = document.getElementById('btnPrintDossier');
    if (btnPrint) {
      btnPrint.onclick = () => {
        openWealthDossierWindow(analysis, true);
      };
    }

    // Unlock Financial Future CTA
    const btnUnlock = document.getElementById('btnUnlockFutureCta');
    if (btnUnlock && analysis.consultation && analysis.consultation.whatsappUrl) {
      btnUnlock.href = analysis.consultation.whatsappUrl;
    }
  }

  // 10. South Indian Fixed Zodiac Grid Plotter
  function renderSouthIndianChart(analysis) {
    if (!southIndianGrid || !analysis || !analysis.planets) return;

    // South Indian Chart has fixed zodiac signs:
    // Row 1: Pisces, Aries, Taurus, Gemini
    // Row 2: Aquarius, (Center), (Center), Cancer
    // Row 3: Capricorn, (Center), (Center), Leo
    // Row 4: Sagittarius, Scorpio, Libra, Virgo
    const southSignOrder = [
      11, 0, 1, 2,
      10, null, null, 3,
      9, null, null, 4,
      8, 7, 6, 5
    ];

    const signNames = ['Mesha (Aries)', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya', 'Tula', 'Vrischika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];

    southIndianGrid.innerHTML = southSignOrder.map(sIdx => {
      if (sIdx === null) {
        return `<div class="si-box center-void"></div>`;
      }

      const isLagna = sIdx === analysis.lagna.signIndex;
      const occupants = analysis.planets.filter(p => p.rashiIndex === sIdx);
      const occupantStr = occupants.map(p => `${p.glyph} ${p.name.slice(0, 2)}${p.isRetrograde ? '℞' : ''}`).join(', ');

      return `
        <div class="si-box ${isLagna ? 'si-lagna-box' : ''}">
          <div class="si-sign-header">
            <span>${signNames[sIdx]}</span>
            ${isLagna ? '<span class="si-asc-tag">ASC</span>' : ''}
          </div>
          <div class="si-planets-content">
            ${occupantStr ? `<span class="si-planets">${occupantStr}</span>` : '<span class="si-empty">—</span>'}
          </div>
        </div>
      `;
    }).join('');
  }

  // 11. Planetary Positions Matrix Table Plotter
  function renderPlanetaryTable(planets) {
    if (!planetaryTableBody || !planets) return;

    planetaryTableBody.innerHTML = planets.map(p => {
      const isRetro = p.isRetrograde;
      return `
        <tr>
          <td><strong>${escapeHtml(p.name)}</strong> (${escapeHtml(p.vedicName)})</td>
          <td class="glyph-cell">${p.glyph}</td>
          <td>${escapeHtml(p.rashiName)} (${escapeHtml(p.rashiVedic)})</td>
          <td class="mono-deg">${p.degreesDisplay}</td>
          <td>${escapeHtml(p.nakshatra)}</td>
          <td>Pada ${p.pada}</td>
          <td class="house-cell">House ${p.houseNumber}</td>
          <td>
            ${isRetro ? '<span class="badge-motion vakri">℞ Retrograde</span>' : '<span class="badge-motion direct">Direct</span>'}
          </td>
          <td>
            <span class="badge-dignity ${p.dignity.toLowerCase()}">${escapeHtml(p.dignity)}</span>
          </td>
        </tr>
      `;
    }).join('');
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m]);
  }
});
