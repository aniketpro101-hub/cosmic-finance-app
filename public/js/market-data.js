/**
 * Cosmic Finance — Live Market Telemetry Client Engine
 * Polls internal server cache, flashes real-time updates, and updates all telemetry panels.
 */

document.addEventListener('DOMContentLoaded', () => {
  const clock = document.getElementById('lastUpdatedClock');

  function updateDisplay(telemetry) {
    if (!telemetry || !telemetry.data) return;

    if (clock && telemetry.marketStatus) {
      const istStr = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      clock.textContent = `Last Updated: ${istStr} IST (${telemetry.marketStatus.label})`;
    }

    telemetry.data.forEach(item => {
      // 1. Update Homepage Pulse Strips
      const chip = document.querySelector(`.ticker-chip[data-symbol="${item.symbol}"]`);
      if (chip) {
        const priceEl = chip.querySelector('.chip-price');
        const changeEl = chip.querySelector('.chip-change');

        if (priceEl && priceEl.textContent !== item.priceFormatted) {
          priceEl.textContent = item.priceFormatted;
          chip.classList.add('ticker-tick-flash');
          setTimeout(() => chip.classList.remove('ticker-tick-flash'), 1000);
        }

        if (changeEl) {
          changeEl.textContent = item.changeFormatted;
          chip.className = `ticker-chip ${item.isPositive ? 'positive' : 'negative'}`;
        }
      }

      // 1b. Update Homepage Live Instrument Cards
      const card = document.querySelector(`.instrument-card[data-symbol="${item.symbol}"]`);
      if (card) {
        const instPrice = card.querySelector('.inst-price');
        const instBadge = card.querySelector('.inst-badge');
        const instTime = card.querySelector('.inst-timestamp');

        if (instPrice) {
          let targetDisplay = item.priceFormatted;
          if (item.symbol === 'GOLD') {
            // Gold per gram in INR
            const perGram = Math.round(item.price / 10);
            targetDisplay = `${perGram.toLocaleString('en-IN')} <span class="inst-unit">/g</span>`;
          } else if (item.symbol === 'BTC') {
            // Bitcoin converted to INR in Lakhs
            const inLakhs = ((item.price * 86.5) / 100000).toFixed(2);
            targetDisplay = `&#8377;${inLakhs}L`;
          } else if (item.symbol === 'ETH') {
            // Ethereum converted to INR in Lakhs
            const inLakhs = ((item.price * 86.5) / 100000).toFixed(2);
            targetDisplay = `&#8377;${inLakhs}L`;
          }

          if (instPrice.innerHTML.trim() !== targetDisplay.trim()) {
            instPrice.innerHTML = targetDisplay;
            card.classList.add('ticker-tick-flash');
            setTimeout(() => card.classList.remove('ticker-tick-flash'), 900);
          }
        }

        if (instBadge) {
          const arrow = item.isPositive ? '▲' : '▼';
          instBadge.innerHTML = `<span class="${item.isPositive ? 'arrow-up' : 'arrow-down'}">${arrow}</span> ${item.changeFormatted}`;
          instBadge.className = `inst-badge ${item.isPositive ? 'badge-up' : 'badge-down'}`;
          card.classList.remove('positive', 'negative');
          card.classList.add(item.isPositive ? 'positive' : 'negative');
        }

        if (instTime) {
          const istNow = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
          instTime.textContent = `last updated ${istNow} IST`;
        }
      }

      // 1c. Update Design 1 HUD Tickers
      const hudCell = document.querySelector(`.hud-ticker-cell[data-symbol="${item.symbol}"]`);
      if (hudCell) {
        const pEl = hudCell.querySelector('.hud-ticker-price');
        const cEl = hudCell.querySelector('.hud-ticker-change');
        if (pEl) pEl.textContent = item.priceFormatted;
        if (cEl) {
          cEl.textContent = item.changeFormatted;
          cEl.className = `hud-ticker-change ${item.isPositive ? 'change-pos' : 'change-neg'}`;
        }
      }

      // 2. Update Live Market Data Dashboard Rows
      const rowId = `row${item.symbol.charAt(0) + item.symbol.slice(1).toLowerCase()}`;
      const row = document.getElementById(rowId);
      if (row) {
        const priceSpan = row.querySelector('.asset-price');
        const changeSpan = row.querySelector('.asset-change');

        if (priceSpan && priceSpan.textContent !== item.priceFormatted) {
          priceSpan.textContent = item.priceFormatted;
          priceSpan.classList.add('ticker-tick-flash');
          setTimeout(() => priceSpan.classList.remove('ticker-tick-flash'), 900);
        }

        if (changeSpan) {
          changeSpan.textContent = item.changeFormatted;
          changeSpan.className = `asset-change ${item.isPositive ? 'positive' : 'negative'}`;
        }
      }
    });
  }

  async function pollMarketData() {
    try {
      const res = await fetch('/api/market-data');
      if (res.ok) {
        const json = await res.json();
        updateDisplay(json);
      }
    } catch (e) {
      console.warn('Market data poll idle or paused.');
    }
  }

  let sseConnected = false;

  function connectSSEStream() {
    if (!window.EventSource) return;
    try {
      const es = new EventSource('/api/stream/market');
      es.onmessage = (event) => {
        sseConnected = true;
        try {
          const payload = JSON.parse(event.data);
          updateDisplay(payload);
        } catch (err) {}
      };
      es.onerror = () => {
        sseConnected = false;
      };
    } catch (err) {
      sseConnected = false;
    }
  }

  // Connect Real-Time SSE Stream with Smart Fallback
  connectSSEStream();
  pollMarketData();
  setInterval(() => {
    if (!sseConnected) {
      pollMarketData();
    }
  }, 3000);

  // C.4 Load Sector Heatmap by Planetary Dignity
  async function loadSectorHeatmap() {
    const grid = document.getElementById('sectorHeatmapGrid');
    if (!grid) return;

    try {
      const res = await fetch('/api/market-data/sectors-heatmap');
      if (!res.ok) throw new Error('Failed to fetch sector heatmap');
      const data = await res.json();
      if (!data.sectors || data.sectors.length === 0) return;

      grid.innerHTML = data.sectors.map(sec => {
        let badgeClass = 'dignity-neutral';
        const d = (sec.dignity || '').toLowerCase();
        if (d.includes('exalt') || d.includes('mool') || d.includes('own')) badgeClass = 'dignity-strong';
        else if (d.includes('debil') || d.includes('enemy')) badgeClass = 'dignity-stressed';
        else if (d.includes('friend')) badgeClass = 'dignity-friendly';

        const vakriBadge = sec.isRetrograde ? '<span class="vakri-tag">Vakri (Rx)</span>' : '';

        return `
          <div class="sector-heat-card">
            <div class="sector-card-top">
              <span class="sector-title">${sec.sector}</span>
              <span class="graha-ruler-tag">${sec.rulerGraha}</span>
            </div>
            <div class="sector-card-body">
              <div class="coordinate-row">
                <span class="coord-label">Current Transit:</span>
                <span class="coord-val">${sec.sign} ${vakriBadge}</span>
              </div>
              <div class="coordinate-row">
                <span class="coord-label">Planetary Dignity:</span>
                <span class="dignity-badge ${badgeClass}">${sec.dignity}</span>
              </div>
              <p class="influence-note">${sec.influence}</p>
            </div>
          </div>
        `;
      }).join('');
    } catch (e) {
      grid.innerHTML = '<div class="error-state-card">Unable to load planetary dignity feed.</div>';
    }
  }

  // C.5 Load Vikram Samvat Seasonality
  async function loadVikramSamvat() {
    const grid = document.getElementById('samvatMonthsGrid');
    if (!grid) return;

    try {
      const res = await fetch('/api/market-data/vikram-samvat');
      if (!res.ok) throw new Error('Failed to fetch Vikram Samvat data');
      const data = await res.json();
      if (!data.months) return;

      const pEl = document.getElementById('samvatSamplePeriod');
      const oEl = document.getElementById('samvatObservations');
      if (pEl) pEl.textContent = data.samplePeriod;
      if (oEl) oEl.textContent = `${data.totalObservations} Observations (${data.sampleSizePerMonth} per month)`;

      grid.innerHTML = data.months.map(m => {
        const isPos = m.avgReturnPct >= 0;
        const retSign = isPos ? '+' : '';
        const retClass = isPos ? 'pos' : 'neg';

        return `
          <div class="samvat-month-card">
            <div class="month-card-header">
              <div>
                <h4 class="month-name">${m.name}</h4>
                <span class="month-greg">${m.approxGregorian}</span>
              </div>
              <span class="month-idx">#${m.id}</span>
            </div>
            <div class="month-metrics">
              <div class="metric-row">
                <span class="metric-lbl">Avg Nifty Return:</span>
                <strong class="metric-val ${retClass}">${retSign}${m.avgReturnPct.toFixed(2)}%</strong>
              </div>
              <div class="metric-row">
                <span class="metric-lbl">Historical Win Rate:</span>
                <strong class="metric-val win-rate">${m.positiveWinRate.toFixed(1)}%</strong>
              </div>
            </div>
            <div class="win-rate-track">
              <div class="win-rate-fill" style="width: ${Math.min(100, Math.max(0, m.positiveWinRate))}%;"></div>
            </div>
            <div class="archetype-tag">${m.archetype}</div>
          </div>
        `;
      }).join('');
    } catch (e) {
      grid.innerHTML = '<div class="error-state-card">Unable to compute empirical Samvat seasonality.</div>';
    }
  }

  // C.6 Load Index Natal Charts
  async function loadIndexCharts() {
    const grid = document.getElementById('indexChartsGrid');
    if (!grid) return;

    try {
      const res = await fetch('/api/market-data/index-charts');
      if (!res.ok) throw new Error('Failed to fetch index natal charts');
      const data = await res.json();
      if (!data.charts) return;

      grid.innerHTML = data.charts.map(chart => {
        return `
          <div class="index-natal-card" id="card-${chart.symbol.replace(/\s+/g, '')}">
            <div class="index-card-header">
              <div class="index-badge-wrap">
                <span class="cosmic-seal">🔯</span>
                <div>
                  <h3 class="index-symbol">${chart.symbol}</h3>
                  <span class="index-sub">${chart.officialLaunch}</span>
                </div>
              </div>
              <span class="launch-place-tag">📍 ${chart.launchPlace}</span>
            </div>

            <div class="index-natal-placements">
              <div class="placement-pill">
                <span class="placement-title">Ascendant / Lagna</span>
                <strong class="placement-val">${chart.lagna.sign}</strong>
                <span class="placement-lord">Lord: ${chart.lagna.lord}</span>
                <p class="placement-desc">${chart.lagna.significance}</p>
              </div>

              <div class="placement-pill">
                <span class="placement-title">Chandra Rashi & Janma Star</span>
                <strong class="placement-val">${chart.moonSign.sign}</strong>
                <span class="placement-lord">Star: ${chart.moonSign.nakshatra}</span>
                <p class="placement-desc">${chart.moonSign.significance}</p>
              </div>

              <div class="placement-pill">
                <span class="placement-title">10th House (Karma / Authority)</span>
                <strong class="placement-val">${chart.tenthHouseKarma.sign}</strong>
                <span class="placement-lord">Lord: ${chart.tenthHouseKarma.lord}</span>
                <p class="placement-desc">${chart.tenthHouseKarma.significance}</p>
              </div>
            </div>

            <div class="index-insight-box">
              <strong>Horary Synthesis:</strong> ${chart.astrologicalInsight}
            </div>

            <div class="index-share-bar">
              <button class="btn btn-secondary btn-sm btn-share-index" data-symbol="${chart.symbol}" data-lagna="${chart.lagna.sign}" data-moon="${chart.moonSign.sign}">
                <span>📤 Share Cosmic Card</span>
              </button>
              <span class="share-toast" style="display:none; color:var(--gold-400); font-size:var(--text-xs); margin-left:var(--space-2);">Copied to clipboard!</span>
            </div>
          </div>
        `;
      }).join('');

      // Wire Share buttons
      grid.querySelectorAll('.btn-share-index').forEach(btn => {
        btn.addEventListener('click', () => {
          const sym = btn.getAttribute('data-symbol');
          const lagna = btn.getAttribute('data-lagna');
          const moon = btn.getAttribute('data-moon');
          const text = `Sovereign Index Natal Chart: ${sym}\nLagna: ${lagna}\nMoon: ${moon}\nComputed via Cosmic Finance Sidereal Engine:\nhttps://cosmicfinance.in/market-data`;

          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
              const toast = btn.nextElementSibling;
              if (toast) {
                toast.style.display = 'inline';
                setTimeout(() => toast.style.display = 'none', 2500);
              }
            });
          }
        });
      });
    } catch (e) {
      grid.innerHTML = '<div class="error-state-card">Unable to erect index natal charts.</div>';
    }
  }

  // Initialize new Part C market telemetry widgets
  loadSectorHeatmap();
  loadVikramSamvat();
  loadIndexCharts();
});

