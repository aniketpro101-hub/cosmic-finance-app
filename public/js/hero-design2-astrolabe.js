/**
 * Design 2: The Imperial Celestial Astrolabe & Orrery Vault Engine
 * Luxury Royal Vedic Astronomical Spherical Orrery with gyroscopic rings and planet zoom
 */

(function () {
  const canvas = document.getElementById('astrolabeCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement.clientWidth || 700);
  let height = (canvas.height = canvas.parentElement.clientHeight || 520);

  function resize() {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.clientWidth || 700;
    height = canvas.height = canvas.parentElement.clientHeight || 520;
  }
  window.addEventListener('resize', resize, { passive: true });

  // 3D Camera Controls with smooth inertia
  let pitch = 0.42;
  let yaw = 0.5;
  let targetPitch = 0.42;
  let targetYaw = 0.5;
  let zoom = 1.0;
  let targetZoom = 1.0;
  let isDragging = false;
  let startX = 0, startY = 0;
  let selectedPlanetIndex = 4; // Default to Jupiter (Guru)

  // 12 Rashis
  const RASHIS = [
    { name: 'Mesha', sym: '♈', color: '#f87171' },
    { name: 'Vrishabha', sym: '♉', color: '#ffd572' },
    { name: 'Mithuna', sym: '♊', color: '#6ee7b7' },
    { name: 'Karka', sym: '♋', color: '#e2e8f0' },
    { name: 'Simha', sym: '♌', color: '#ffd572' },
    { name: 'Kanya', sym: '♍', color: '#6ee7b7' },
    { name: 'Tula', sym: '♎', color: '#f5be48' },
    { name: 'Vrishchika', sym: '♏', color: '#f87171' },
    { name: 'Dhanu', sym: '♐', color: '#fcd34d' },
    { name: 'Makara', sym: '♑', color: '#c084fc' },
    { name: 'Kumbha', sym: '♒', color: '#c084fc' },
    { name: 'Meena', sym: '♓', color: '#fcd34d' }
  ];

  // 9 Navagrahas
  const PLANETS = [
    { name: 'Sun', vedic: 'Surya', glyph: '☉', color: '#ffd572', r: 80, speed: 0.007, angle: 4.46, dignity: 'Own Sign (Leo)', deg: '22° 14\'', nak: 'Purva Phalguni (Pada 3)', asset: 'Sovereign Debt & PSU Index', impact: 'Primary market trend anchor; governs sovereign monetary discretion and state capex flow.' },
    { name: 'Moon', vedic: 'Chandra', glyph: '☽', color: '#e2e8f0', r: 50, speed: 0.038, angle: 3.30, dignity: 'Exalted in Taurus', deg: '09° 22\'', nak: 'Rohini (Pada 2)', asset: 'Intraday Liquidity & FMCG', impact: 'Governs emotional retail order velocity, intraday sentiment momentum, and consumer demand surges.' },
    { name: 'Mars', vedic: 'Mangal', glyph: '♂', color: '#f87171', r: 110, speed: 0.005, angle: 5.29, dignity: 'Exalted in Makara', deg: '28° 05\'', nak: 'Dhanishta (Pada 2)', asset: 'Defense, Real Estate & High Beta', impact: 'Drives physical capital expenditure, real estate expansion, and aggressive market beta breakouts.' },
    { name: 'Mercury', vedic: 'Budha', glyph: '☿', color: '#6ee7b7', r: 68, speed: 0.013, angle: 4.31, dignity: 'Exalted in Kanya', deg: '15° 40\'', nak: 'Hasta (Pada 4)', asset: 'NIFTY IT, Fintech & HFT', impact: 'Governs algorithmic trading architectures, software exports, and high-frequency settlement contracts.' },
    { name: 'Jupiter', vedic: 'Guru', glyph: '♃', color: '#fcd34d', r: 145, speed: 0.0025, angle: 0.02, dignity: 'Exalted in Karka', deg: '05° 12\'', nak: 'Pushya (Pada 1)', asset: 'Gold (MCX), Banking & Institutional Capital', impact: 'Apex sovereign credit expander; governs banking balance sheet reserves, bullion reserves, and macro institutional confidence.' },
    { name: 'Venus', vedic: 'Shukra', glyph: '♀', color: '#f5be48', r: 95, speed: 0.010, angle: 3.78, dignity: 'Own Sign (Libra)', deg: '18° 33\'', nak: 'Swati (Pada 3)', asset: 'Luxury Equities, Auto & Consumer', impact: 'Governs valuation multiples, discretionary consumption, consumer durables, and wealth aesthetics.' },
    { name: 'Saturn', vedic: 'Shani', glyph: '♄', color: '#c084fc', r: 180, speed: 0.0012, angle: 0.28, dignity: 'Own Sign (Kumbha)', deg: '16° 34\'', nak: 'Shatabhisha (Pada 1)', asset: 'Heavy Infrastructure, Metals & Energy', impact: 'Enforces long-cycle valuation discipline, commodity extraction limits, and regulatory market compression.' },
    { name: 'Rahu', vedic: 'Rahu (North Node)', glyph: '☊', color: '#818cf8', r: 130, speed: -0.0018, angle: 1.76, dignity: 'Exalted in Taurus', deg: '11° 18\'', nak: 'Rohini (Pada 4)', asset: 'Cryptocurrencies & Options Skew', impact: 'Governs disruptive technological speculation, algorithmic leverage shocks, and options gamma squeeze dynamics.' },
    { name: 'Ketu', vedic: 'Ketu (South Node)', glyph: '☋', color: '#fb7185', r: 130, speed: -0.0018, angle: 4.90, dignity: 'Exalted in Scorpio', deg: '11° 18\'', nak: 'Jyeshtha (Pada 4)', asset: 'Macro Hedging, Gold Mining & Unwinding', impact: 'Governs sudden deleveraging capitulations, systemic debt liquidations, and hedging asset reallocations.' }
  ];

  // Mouse & Touch controls
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    targetYaw += dx * 0.004;
    targetPitch = Math.max(0.1, Math.min(1.4, targetPitch + dy * 0.004));
    startX = e.clientX;
    startY = e.clientY;
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    targetZoom = Math.max(0.7, Math.min(1.8, targetZoom - e.deltaY * 0.001));
  }, { passive: false });

  // Touch controls
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    targetYaw += dx * 0.004;
    targetPitch = Math.max(0.1, Math.min(1.4, targetPitch + dy * 0.004));
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  canvas.addEventListener('touchend', () => { isDragging = false; });

  // Update inspection lens card
  function updateLens(planet) {
    const titleEl = document.getElementById('lensPlanetTitle');
    const badgeEl = document.getElementById('lensDignityBadge');
    const degEl = document.getElementById('lensDegreeVal');
    const nakEl = document.getElementById('lensNakshatraVal');
    const assetEl = document.getElementById('lensAssetVal');
    const impactEl = document.getElementById('lensImpactDesc');

    if (titleEl) titleEl.innerHTML = `<span>${planet.glyph}</span> ${planet.name} (${planet.vedic})`;
    if (badgeEl) badgeEl.textContent = planet.dignity;
    if (degEl) degEl.textContent = planet.deg;
    if (nakEl) nakEl.textContent = planet.nak;
    if (assetEl) assetEl.textContent = planet.asset;
    if (impactEl) impactEl.textContent = planet.impact;
  }

  // Hook ribbon buttons
  document.querySelectorAll('.ribbon-planet-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ribbon-planet-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const pIdx = parseInt(btn.getAttribute('data-planet-index'), 10);
      if (!isNaN(pIdx) && PLANETS[pIdx]) {
        selectedPlanetIndex = pIdx;
        updateLens(PLANETS[pIdx]);
      }
    });
  });

  // Initial lens update
  updateLens(PLANETS[selectedPlanetIndex]);

  // 3D Spherical Coordinate Projection
  function project3D(x, y, z, cx, cy) {
    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);
    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;

    const cosP = Math.cos(pitch);
    const sinP = Math.sin(pitch);
    const y2 = y * cosP - z1 * sinP;
    const z2 = y * sinP + z1 * cosP;

    const fov = 520 * zoom;
    const scale = fov / (fov + z2 * 0.5);

    return {
      x: cx + x1 * scale,
      y: cy + y2 * scale,
      scale: scale,
      z: z2
    };
  }

  // Animation Loop
  function render() {
    // Smooth camera inertia interpolation
    yaw += (targetYaw - yaw) * 0.08;
    pitch += (targetPitch - pitch) * 0.08;
    zoom += (targetZoom - zoom) * 0.08;

    ctx.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;

    // 1. Draw Outer Astrolabe Celestial Sphere Ring (Armillary Meridian)
    const armillaryR = 210;
    ctx.strokeStyle = 'rgba(242, 200, 121, 0.2)';
    ctx.lineWidth = 1.5;

    // Vertical Meridian Ring
    ctx.beginPath();
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      const pt = project3D(0, armillaryR * Math.cos(theta), armillaryR * Math.sin(theta), cx, cy);
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();

    // Equatorial Astrolabe Ring
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(242, 200, 121, 0.35)';
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      const pt = project3D(armillaryR * Math.cos(theta), 0, armillaryR * Math.sin(theta), cx, cy);
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();

    // 2. Draw 12 Luminous Zodiac Signs along the Tilted Ecliptic Band
    RASHIS.forEach((rashi, idx) => {
      const angle = (idx / 12) * Math.PI * 2;
      const nextAngle = ((idx + 1) / 12) * Math.PI * 2;

      const p1 = project3D(armillaryR * Math.cos(angle), 0, armillaryR * Math.sin(angle), cx, cy);
      const p2 = project3D(armillaryR * Math.cos(nextAngle), 0, armillaryR * Math.sin(nextAngle), cx, cy);

      // Section divider tick
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(242, 200, 121, 0.4)';
      ctx.lineWidth = 1;
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      // Sign Symbol
      const midAngle = angle + (Math.PI / 12);
      const midPt = project3D(armillaryR * Math.cos(midAngle), 0, armillaryR * Math.sin(midAngle), cx, cy);
      if (midPt.z < 100) { // Only render if front-facing
        ctx.font = '600 11px "Space Grotesk", sans-serif';
        ctx.fillStyle = rashi.color;
        ctx.textAlign = 'center';
        ctx.fillText(rashi.sym, midPt.x, midPt.y + 4);
      }
    });

    // 3. Draw Concentric Planetary Orbit Tracks
    PLANETS.forEach((p, idx) => {
      ctx.beginPath();
      ctx.strokeStyle = idx === selectedPlanetIndex ? 'rgba(242, 200, 121, 0.5)' : 'rgba(157, 130, 240, 0.12)';
      ctx.lineWidth = idx === selectedPlanetIndex ? 1.8 : 0.8;
      const steps = 40;
      for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2;
        const pt = project3D(p.r * Math.cos(theta), 0, p.r * Math.sin(theta), cx, cy);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    });

    // 4. Update and Project Planets
    const projectedPlanets = PLANETS.map((p, idx) => {
      p.angle += p.speed;
      const x = p.r * Math.cos(p.angle);
      const z = p.r * Math.sin(p.angle);
      const proj = project3D(x, 0, z, cx, cy);
      return { ...p, px: proj.x, py: proj.y, pScale: proj.scale, z: proj.z, index: idx };
    });

    // Depth sort
    projectedPlanets.sort((a, b) => b.z - a.z);

    // 5. Draw Central Cosmic Bindu (Earth Core with gold sunburst)
    const centerPt = project3D(0, 0, 0, cx, cy);
    const sunburst = ctx.createRadialGradient(centerPt.x, centerPt.y, 1, centerPt.x, centerPt.y, 22);
    sunburst.addColorStop(0, '#ffffff');
    sunburst.addColorStop(0.3, '#fcd34d');
    sunburst.addColorStop(0.7, 'rgba(242, 200, 121, 0.25)');
    sunburst.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.arc(centerPt.x, centerPt.y, 20, 0, Math.PI * 2);
    ctx.fillStyle = sunburst;
    ctx.fill();

    // 6. Draw Planets
    projectedPlanets.forEach(p => {
      const isSelected = p.index === selectedPlanetIndex;
      const radius = Math.max(5, (isSelected ? 9 : 7) * p.pScale);

      // Selected Planet Spotlight Ring
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(p.px, p.py, radius * 2.6, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(242, 200, 121, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Planet Glow
      const glow = ctx.createRadialGradient(p.px, p.py, 1, p.px, p.py, radius * 2.4);
      glow.addColorStop(0, p.color);
      glow.addColorStop(0.6, p.color + '55');
      glow.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(p.px, p.py, radius * 2.4, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Planet Sphere
      ctx.beginPath();
      ctx.arc(p.px, p.py, radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Glyph & Title
      ctx.font = '700 12px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(p.glyph, p.px, p.py - radius - 5);

      if (isSelected || p.z < 20) {
        ctx.font = '600 10px "IBM Plex Mono", monospace';
        ctx.fillStyle = isSelected ? '#ffd572' : 'rgba(236, 235, 244, 0.8)';
        ctx.fillText(`${p.name}`, p.px, p.py + radius + 12);
      }
    });

    requestAnimationFrame(render);
  }

  render();
})();
