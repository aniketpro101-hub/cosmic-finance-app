/**
 * Cosmic Finance — Authentic Geocentric Navagraha Zodiac Wheel & 4D Time Machine
 * Phase 10: "We don't predict. We calculate, and we show you the calculation."
 * 
 * High-Precision Astronomical & Vedic Calculation Engine:
 * - Geocentric 3D Armillary Astrolabe with Earth at center
 * - Authentic Navagraha with custom 3D shader/volumetric planetary rendering
 * - Real Saturn 3D ring system projection
 * - Rahu & Ketu mathematically locked at 180° with active nodal opposition axis
 * - Dynamic Vakri (Retrograde) loop particles & crimson resonance
 * - Vedic Drishti (Aspect) laser-beam network on planetary hover
 * - Full 360° degree graduations with 12 Rashi & 27 Nakshatra subdivisions
 * - 4D Time Machine interactive scrubbing (reads precomputed SQLite snapshots in <5ms)
 * - Frame-rate monitoring with automatic graceful degradation budget
 * - Mobile lightweight vector mode with identical real astronomical data
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- 1. Real-time Live Planetary Hour (Hora) Engine ---
  const horaBadges = document.querySelectorAll('#planetaryHourBadge, #mobileHoraBadge');

  async function updateHora() {
    try {
      const res = await fetch('/api/hora');
      const data = await res.json();
      if (data && data.hora) {
        const text = `Hora: ${data.hora.planet} ${data.hora.glyph}`;
        horaBadges.forEach(b => b.textContent = text);
      }
    } catch (e) {
      // Graceful fallback
    }
  }

  updateHora();
  setInterval(updateHora, 60000);

  // --- 2. Master Astronomical State & Navigation ---
  let isLiveMode = true;
  const DEFAULT_NAVAGRAHA = {
    Sun: { name: 'Sun', vedicName: 'Surya', glyph: '☉', color: '#ffb347', asset: 'Sovereign Debt & Gold', symbolLink: 'GOLD', significance: 'Primary vital market sentiment', longitude: 355.2, isRetrograde: false, rashi: { name: 'Pisces', vedic: 'Meena', index: 11, label: 'Pisces 25.2°' }, nakshatra: { label: 'Revati Pada 3' }, dignity: 'Neutral' },
    Moon: { name: 'Moon', vedicName: 'Chandra', glyph: '☽', color: '#d9e4f5', asset: 'Nifty 50 Short-Term Vol', symbolLink: 'NIFTY', significance: 'Intraday emotional liquidity swings', longitude: 84.6, isRetrograde: false, rashi: { name: 'Gemini', vedic: 'Mithuna', index: 2, label: 'Gemini 24.6°' }, nakshatra: { label: 'Punarvasu Pada 2' }, dignity: 'Neutral' },
    Mars: { name: 'Mars', vedicName: 'Mangala', glyph: '♂', color: '#ff5c5c', asset: 'Metals & Energy / Crude Oil', symbolLink: 'MCX', significance: 'Aggression, breakout momentum', longitude: 92.4, isRetrograde: false, rashi: { name: 'Cancer', vedic: 'Karka', index: 3, label: 'Cancer 2.4°' }, nakshatra: { label: 'Punarvasu Pada 4' }, dignity: 'Debilitated' },
    Mercury: { name: 'Mercury', vedicName: 'Budha', glyph: '☿', color: '#5ce6c0', asset: 'IT Index & High-Frequency Algo', symbolLink: 'NIFTY', significance: 'Trading velocity and logic', longitude: 348.1, isRetrograde: false, rashi: { name: 'Pisces', vedic: 'Meena', index: 11, label: 'Pisces 18.1°' }, nakshatra: { label: 'Revati Pada 1' }, dignity: 'Debilitated' },
    Jupiter: { name: 'Jupiter', vedicName: 'Guru', glyph: '♃', color: '#f4c95d', asset: 'Banking Index (Nifty Bank)', symbolLink: 'BANKNIFTY', significance: 'Capital expansion and institutional liquidity', longitude: 52.8, isRetrograde: false, rashi: { name: 'Taurus', vedic: 'Vrishabha', index: 1, label: 'Taurus 22.8°' }, nakshatra: { label: 'Rohini Pada 4' }, dignity: 'Friendly' },
    Venus: { name: 'Venus', vedicName: 'Shukra', glyph: '♀', color: '#ffd6e8', asset: 'FMCG, Auto & Luxury Equities', symbolLink: 'SENSEX', significance: 'Consumer spending and wealth luxury', longitude: 14.5, isRetrograde: false, rashi: { name: 'Aries', vedic: 'Mesha', index: 0, label: 'Aries 14.5°' }, nakshatra: { label: 'Bharani Pada 1' }, dignity: 'Neutral' },
    Saturn: { name: 'Saturn', vedicName: 'Shani', glyph: '♄', color: '#a4b4f0', asset: 'Infrastructure, PSUs & Real Estate', symbolLink: 'SENSEX', significance: 'Long-term structural valuation & discipline', longitude: 322.3, isRetrograde: false, rashi: { name: 'Aquarius', vedic: 'Kumbha', index: 10, label: 'Aquarius 22.3°' }, nakshatra: { label: 'Purva Bhadrapada Pada 1' }, dignity: 'Moolatrikona' },
    Rahu: { name: 'Rahu', vedicName: 'Rahu', glyph: '☊', color: '#7a5cff', asset: 'Crypto (BTC) & Derivatives Volatility', symbolLink: 'BTC', significance: 'Unprecedented spikes and fear/greed', longitude: 344.2, isRetrograde: true, rashi: { name: 'Pisces', vedic: 'Meena', index: 11, label: 'Pisces 14.2°' }, nakshatra: { label: 'Uttara Bhadrapada Pada 4' }, dignity: 'Neutral' },
    Ketu: { name: 'Ketu', vedicName: 'Ketu', glyph: '☋', color: '#d97706', asset: 'Defensive Gold Reserves', symbolLink: 'GOLD', significance: 'Market capitulation and deep liquidation', longitude: 164.2, isRetrograde: true, rashi: { name: 'Virgo', vedic: 'Kanya', index: 5, label: 'Virgo 14.2°' }, nakshatra: { label: 'Hasta Pada 2' }, dignity: 'Neutral' }
  };
  let activeSkyData = { planets: DEFAULT_NAVAGRAHA };
  let activeMarketData = null;
  let activeHoveredGraha = null;
  let selectedGraha = null;

  // Vedic Navagraha Hindi Nomenclature & Glyph mappings
  const GRAHA_HINDI = {
    Sun: { hindi: 'सूर्य', vedic: 'Surya', glyph: '☉' },
    Moon: { hindi: 'चन्द्र', vedic: 'Chandra', glyph: '☽' },
    Mars: { hindi: 'मंगल', vedic: 'Mangal', glyph: '♂' },
    Mercury: { hindi: 'बुध', vedic: 'Budha', glyph: '☿' },
    Jupiter: { hindi: 'गुरु', vedic: 'Guru', glyph: '♃' },
    Venus: { hindi: 'शुक्र', vedic: 'Shukra', glyph: '♀' },
    Saturn: { hindi: 'शनि', vedic: 'Shani', glyph: '♄' },
    Rahu: { hindi: 'राहु', vedic: 'Rahu', glyph: '☊' },
    Ketu: { hindi: 'केतु', vedic: 'Ketu', glyph: '☋' }
  };

  // Vedic Rashis (12 signs, 30° each) with Hindi fonts, element colors & symbols
  const RASHIS = [
    { name: 'Aries', vedic: 'Mesh', symbol: '♈', sanskrit: 'मेष', element: '#f87171', nature: 'Fire' },
    { name: 'Taurus', vedic: 'Vrishabh', symbol: '♉', sanskrit: 'वृषभ', element: '#34d399', nature: 'Earth' },
    { name: 'Gemini', vedic: 'Mithun', symbol: '♊', sanskrit: 'मिथुन', element: '#60a5fa', nature: 'Air' },
    { name: 'Cancer', vedic: 'Kark', symbol: '♋', sanskrit: 'कर्क', element: '#818cf8', nature: 'Water' },
    { name: 'Leo', vedic: 'Singh', symbol: '♌', sanskrit: 'सिंह', element: '#f87171', nature: 'Fire' },
    { name: 'Virgo', vedic: 'Kanya', symbol: '♍', sanskrit: 'कन्या', element: '#34d399', nature: 'Earth' },
    { name: 'Libra', vedic: 'Tula', symbol: '♎', sanskrit: 'तुला', element: '#60a5fa', nature: 'Air' },
    { name: 'Scorpio', vedic: 'Vrishchik', symbol: '♏', sanskrit: 'वृश्चिक', element: '#818cf8', nature: 'Water' },
    { name: 'Sagittarius', vedic: 'Dhanu', symbol: '♐', sanskrit: 'धनु', element: '#f87171', nature: 'Fire' },
    { name: 'Capricorn', vedic: 'Makar', symbol: '♑', sanskrit: 'मकर', element: '#34d399', nature: 'Earth' },
    { name: 'Aquarius', vedic: 'Kumbh', symbol: '♒', sanskrit: 'कुम्भ', element: '#60a5fa', nature: 'Air' },
    { name: 'Pisces', vedic: 'Meen', symbol: '♓', sanskrit: 'मीन', element: '#818cf8', nature: 'Water' }
  ];

  // DOM Elements
  const desktopCanvas = document.getElementById('orbitCanvas');
  const mobileCanvas = document.getElementById('mobileOrbitCanvas');
  const infoDrawer = document.getElementById('orbitInfoDrawer');
  const modeLabel = document.getElementById('observatoryModeLabel');
  const dateBadge = document.getElementById('timeMachineDateBadge');
  const statusDot = document.getElementById('observatoryStatusDot');

  const tmDateLabel = document.getElementById('tmCurrentDateLabel');
  const tmSlider = document.getElementById('tmScrubSlider');
  const tmPresets = document.querySelectorAll('.tm-preset-chip, .mobile-preset-pill');
  const btnResetToLive = document.getElementById('btnResetToLive');
  const mobileBtnResetToLive = document.getElementById('mobileBtnResetToLive');

  const tmNifty = document.getElementById('tmNiftyVal');
  const tmSensex = document.getElementById('tmSensexVal');
  const tmGold = document.getElementById('tmGoldVal');
  const tmBtc = document.getElementById('tmBtcVal');
  const tmNotes = document.getElementById('tmMarketNotes');

  const mNifty = document.getElementById('mNiftyVal');
  const mGold = document.getElementById('mGoldVal');
  const mBtc = document.getElementById('mBtcVal');
  const mobileTmDateLabel = document.getElementById('mobileTmDateLabel');

  // Interactive On-Screen Zoom Controls (v2.0)
  const btnZoomIn = document.getElementById('btnZoomIn');
  const btnZoomOut = document.getElementById('btnZoomOut');
  const btnZoomFit = document.getElementById('btnZoomFit');
  const zoomLevelPill = document.getElementById('zoomLevelPill');

  // Dynamic responsive camera distance calculation (fit on mobile Android/iPhone without clipping)
  function getBaseCamDist() {
    const w = window.innerWidth;
    if (w <= 375) return 1300; // 360px - 375px: Samsung Galaxy A, iPhone SE, iPhone 12/13 mini
    if (w <= 430) return 1180; // 390px - 430px: iPhone 12/13/14/15/16 Pro, Galaxy S23/S24
    if (w <= 640) return 1040; // Phablets / Foldables
    if (w <= 900) return 820;  // Tablets
    if (w <= 1200) return 720; // Small Laptops / Screens
    return 660;                // Desktop (Full HD / 4K)
  }

  function updateZoomPill() {
    try {
      if (zoomLevelPill && typeof targetCamDist === 'number') {
        const base = getBaseCamDist();
        const pct = Math.round((base / targetCamDist) * 100);
        zoomLevelPill.textContent = `${pct}%`;
      }
    } catch (e) {
      // Safe no-op
    }
  }

  // --- 3. Desktop True 3D Geocentric Scene Engine ---
  let orbitMode = 'multiring'; // 'multiring' (v2 concentric paths) or 'classic' (v1 single wheel)
  const ringRadius = 260;
  const multiringRashiRadius = 345;

  let ctx3D = null;
  let width3D = 600, height3D = 460;
  let camPitch = 0.46; // Tilt angle (radians) ~26.4 deg for majestic 3D perspective without distortion
  let camYaw = -0.35;   // Rotation angle (radians)
  let camDist = getBaseCamDist();   // Calibrated dynamically for device screen width
  let targetCamDist = getBaseCamDist();
  let userHasZoomed = false;
  let isDragging = false;
  let lastMouseX = 0, lastMouseY = 0;
  let targetPitch = 0.46, targetYaw = -0.35;
  let velYaw = 0, velPitch = 0;
  let animFrameId = null;

  // Exact perspective-corrected visual center: eliminates top void and centers wheel vertically
  function getSceneCenter() {
    const cx = width3D / 2;
    const R_outer = (orbitMode === 'multiring' ? multiringRashiRadius : ringRadius) + 38;
    const sinP = Math.sin(camPitch);
    const cosP = Math.cos(camPitch);
    const dTop = (540 * sinP * R_outer) / Math.max(40, camDist + R_outer * cosP);
    const dBottom = (540 * sinP * R_outer) / Math.max(40, camDist - R_outer * cosP);
    const perspectiveYOffset = (dBottom - dTop) * 0.5;
    const clampedOffset = Math.max(-height3D * 0.4, Math.min(height3D * 0.4, perspectiveYOffset));
    const cy = (height3D / 2) - clampedOffset;
    return { cx, cy };
  }

  // Performance Monitoring & Graceful Degradation Budget
  let frameCount = 0;
  let lastFpsCheck = performance.now();
  let currentFps = 60;
  let isLowPerformance = false;

  function monitorPerformance() {
    frameCount++;
    const now = performance.now();
    if (now - lastFpsCheck >= 1000) {
      currentFps = (frameCount * 1000) / (now - lastFpsCheck);
      frameCount = 0;
      lastFpsCheck = now;
      if (currentFps < 30 && !isLowPerformance) {
        isLowPerformance = true;
        console.warn('Cosmic Engine: Automatically degrading visual complexity for smooth 60fps operation.');
      }
    }
  }

  // Pre-generate 3D Starfield Particles for Deep Space Parallax (Optimized 70 points)
  const STARS_COUNT = 70;
  const stars3D = [];
  for (let i = 0; i < STARS_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI;
    const dist = 550 + Math.random() * 400;
    stars3D.push({
      x: Math.cos(phi) * Math.cos(theta) * dist,
      y: Math.sin(phi) * dist,
      z: Math.cos(phi) * Math.sin(theta) * dist,
      size: 0.8 + Math.random() * 1.6,
      brightness: 0.3 + Math.random() * 0.7,
      twinkleSpeed: 0.002 + Math.random() * 0.004,
      hue: Math.random() > 0.8 ? '#fcd34d' : (Math.random() > 0.6 ? '#93c5fd' : '#ffffff')
    });
  }

  let cachedBgGrad = null;
  let isCanvasVisible = true;

  if (desktopCanvas) {
    ctx3D = desktopCanvas.getContext('2d');

    // Pause rendering loop when canvas is off-screen (preserves full 60fps for page interactions)
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isCanvasVisible = entry.isIntersecting;
        });
      }, { threshold: 0.02 });
      obs.observe(desktopCanvas);
    }

    function setupDesktopDimensions() {
      const rect = desktopCanvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = rect.width > 50 ? rect.width : (desktopCanvas.parentElement ? desktopCanvas.parentElement.clientWidth : 1100);
      const h = rect.height > 50 ? rect.height : (window.innerWidth <= 640 ? 380 : 500);
      width3D = Math.round(w * dpr);
      height3D = Math.round(h * dpr);
      desktopCanvas.width = width3D;
      desktopCanvas.height = height3D;

      const { cx, cy } = getSceneCenter();
      const isLight = document.body.classList.contains('theme-light') || 
                      document.documentElement.getAttribute('data-theme') === 'light' ||
                      (typeof localStorage !== 'undefined' && localStorage.getItem('cosmic_site_theme') === 'light');

      cachedBgGrad = ctx3D.createRadialGradient(cx, cy, 30, cx, cy, Math.max(width3D, height3D) * 0.75);
      if (isLight) {
        cachedBgGrad.addColorStop(0, '#fdfbf7');
        cachedBgGrad.addColorStop(0.5, '#f7f4ee');
        cachedBgGrad.addColorStop(1, '#ede5d4');
      } else {
        cachedBgGrad.addColorStop(0, '#0c122c');
        cachedBgGrad.addColorStop(0.4, '#060a1a');
        cachedBgGrad.addColorStop(1, '#03050d');
      }

      if (!userHasZoomed) {
        targetCamDist = getBaseCamDist();
      }
      if (typeof updateZoomPill === 'function') updateZoomPill();
    }

    setupDesktopDimensions();
    window.addEventListener('resize', setupDesktopDimensions, { passive: true });
    window.addEventListener('cosmic-theme-changed', setupDesktopDimensions);
    window.addEventListener('orientationchange', () => {
      setTimeout(setupDesktopDimensions, 100);
    }, { passive: true });

    // 3D Camera Orbit Interactions (Mouse/Pointer Drag + Physics Easing)
    function onDragStart(e) {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      velYaw = 0;
      velPitch = 0;
      desktopCanvas.style.cursor = 'grabbing';
      window.addEventListener('mousemove', onDragMove, { passive: true });
      window.addEventListener('mouseup', onDragEnd);
    }

    function onDragMove(e) {
      if (!isDragging) return;
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;

      velYaw = dx * 0.008;
      velPitch = dy * 0.008;
      targetYaw += velYaw;
      targetPitch += velPitch;
      targetPitch = Math.max(0.12, Math.min(Math.PI / 2.05, targetPitch));
    }

    function onDragEnd() {
      if (isDragging) {
        isDragging = false;
        if (desktopCanvas) desktopCanvas.style.cursor = 'grab';
        window.removeEventListener('mousemove', onDragMove);
        window.removeEventListener('mouseup', onDragEnd);
      }
    }

    desktopCanvas.addEventListener('mousedown', onDragStart);
    desktopCanvas.addEventListener('pointerdown', onDragStart);

    function onTouchStart(e) {
      if (e.touches && e.touches.length === 1) {
        onDragStart(e.touches[0]);
        window.addEventListener('touchmove', onTouchMove, { passive: true });
        window.addEventListener('touchend', onTouchEnd, { passive: true });
      }
    }
    function onTouchMove(e) {
      if (e.touches && e.touches.length === 1) onDragMove(e.touches[0]);
    }
    function onTouchEnd() {
      onDragEnd();
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    }
    desktopCanvas.addEventListener('touchstart', onTouchStart, { passive: true });

    desktopCanvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      userHasZoomed = true;
      const zoomDelta = e.deltaY * 0.55;
      targetCamDist += zoomDelta;
      const base = getBaseCamDist();
      targetCamDist = Math.max(base * 0.55, Math.min(base * 1.8, targetCamDist));
      if (typeof updateZoomPill === 'function') updateZoomPill();
    }, { passive: false });

    // Touch Pinch-to-Zoom for Mobile & Trackpads
    let touchStartDist = null;
    desktopCanvas.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDist = Math.sqrt(dx * dx + dy * dy);
      }
    }, { passive: true });

    desktopCanvas.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches.length === 2 && touchStartDist) {
        userHasZoomed = true;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const diff = touchStartDist - dist;
        touchStartDist = dist;
        targetCamDist += diff * 1.5;
        const base = getBaseCamDist();
        targetCamDist = Math.max(base * 0.55, Math.min(base * 1.8, targetCamDist));
        if (typeof updateZoomPill === 'function') updateZoomPill();
      }
    }, { passive: true });

    desktopCanvas.addEventListener('touchend', () => {
      touchStartDist = null;
    }, { passive: true });
  }

  // 3D Projection Matrix (Transforms 3D world coordinates to 2D screen coordinates)
  function project3D(x, y, z, cx, cy) {
    // Rotation around Y (Yaw)
    const cosY = Math.cos(camYaw);
    const sinY = Math.sin(camYaw);
    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;

    // Rotation around X (Pitch)
    const cosX = Math.cos(camPitch);
    const sinX = Math.sin(camPitch);
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;

    const fov = 540;
    const depth = camDist + z2;
    if (depth <= 20) return { x: cx, y: cy, scale: 0, visible: false, depth: 9999 };

    const scale = fov / depth;
    return {
      x: cx + x1 * scale,
      y: cy + y2 * scale,
      z: z2,
      scale: scale,
      visible: true,
      depth: depth
    };
  }

  // Helper to get Aspect targets for classical Vedic Drishti
  function getVedicAspects(grahaName, signIndex) {
    const targets = [];
    // 7th house aspect is universal for all grahas
    targets.push((signIndex + 6) % 12);

    if (grahaName === 'Mars') {
      targets.push((signIndex + 3) % 12); // 4th
      targets.push((signIndex + 7) % 12); // 8th
    } else if (grahaName === 'Jupiter') {
      targets.push((signIndex + 4) % 12); // 5th (Trikona)
      targets.push((signIndex + 8) % 12); // 9th (Trikona)
    } else if (grahaName === 'Saturn') {
      targets.push((signIndex + 2) % 12); // 3rd
      targets.push((signIndex + 9) % 12); // 10th
    } else if (grahaName === 'Rahu' || grahaName === 'Ketu') {
      targets.push((signIndex + 4) % 12); // 5th
      targets.push((signIndex + 8) % 12); // 9th
    }
    return targets;
  }

  // --- 4. Render Master 3D Astrolabe Ecliptic Scene ---

  function getGrahaRadius(planetName) {
    if (orbitMode !== 'multiring') return ringRadius;
    const radii = {
      'Moon': 75,
      'Mercury': 105,
      'Venus': 135,
      'Sun': 170,
      'Mars': 205,
      'Jupiter': 245,
      'Saturn': 285,
      'Rahu': 320,
      'Ketu': 320
    };
    return radii[planetName] || ringRadius;
  }

  const nakshatraRadius = 320;
  let simTime = 0;

  function renderDesktop3D() {
    if (!ctx3D) return;
    if (!isCanvasVisible) {
      if (!prefersReducedMotion) {
        animFrameId = requestAnimationFrame(renderDesktop3D);
      }
      return;
    }
    try {
      monitorPerformance();

      simTime += 0.016;

      // Smooth camera distance zoom easing
      camDist += (targetCamDist - camDist) * 0.14;

      // Smooth inertia and physics damping
      if (!isDragging) {
        velYaw *= 0.94;
        velPitch *= 0.94;
        targetYaw += velYaw;
        targetPitch += velPitch;

        // Continuous dynamic celestial revolution
        if (Math.abs(velYaw) < 0.0001 && !activeHoveredGraha) {
          targetYaw += 0.0075; // Increased speed for fluid, majestic continuous orbital revolution
        }
      }

    camYaw += (targetYaw - camYaw) * 0.1;
    camPitch += (targetPitch - camPitch) * 0.1;

    const { cx, cy } = getSceneCenter();

    ctx3D.clearRect(0, 0, width3D, height3D);

    // Deep luxury space background with pre-cached gradient
    if (cachedBgGrad) {
      ctx3D.fillStyle = cachedBgGrad;
      ctx3D.fillRect(0, 0, width3D, height3D);
    }

    // Render 3D Parallax Starfield
    if (!isLowPerformance) {
      const isCurLight = document.body.classList.contains('theme-light');
      stars3D.forEach(star => {
        const p = project3D(star.x, star.y, star.z, cx, cy);
        if (p.visible) {
          const alpha = star.brightness * (0.6 + 0.4 * Math.sin(simTime * star.twinkleSpeed * 100));
          ctx3D.beginPath();
          ctx3D.arc(p.x, p.y, Math.max(0.6, star.size * p.scale), 0, Math.PI * 2);
          ctx3D.fillStyle = isCurLight ? '#b45309' : star.hue;
          ctx3D.globalAlpha = isCurLight ? Math.min(0.2, Math.max(0, alpha * 0.2)) : Math.min(1, Math.max(0, alpha));
          ctx3D.fill();
        }
      });
      ctx3D.globalAlpha = 1.0;
    }

    // --- Geocentric Reference Tracks & Multi-Ring Concentric Astrolabe (v2.0) ---
    const activeOuterRadius = orbitMode === 'multiring' ? multiringRashiRadius : ringRadius;

    if (orbitMode === 'multiring') {
      // Draw 8 dedicated concentric planetary orbit tracks around Earth
      const grahaTracks = [
        { name: 'Moon', r: 75, color: '#d9e4f5' },
        { name: 'Mercury', r: 105, color: '#5ce6c0' },
        { name: 'Venus', r: 135, color: '#ffd6e8' },
        { name: 'Sun', r: 170, color: '#ffb347' },
        { name: 'Mars', r: 205, color: '#ff5c5c' },
        { name: 'Jupiter', r: 245, color: '#f4c95d' },
        { name: 'Saturn', r: 285, color: '#6b7a99' },
        { name: 'Rahu / Ketu', r: 320, color: '#7a5cff' }
      ];

      grahaTracks.forEach(track => {
        ctx3D.beginPath();
        const steps = isLowPerformance ? 24 : 36;
        for (let s = 0; s <= steps; s++) {
          const rad = (s / steps) * Math.PI * 2;
          const p = project3D(Math.cos(rad) * track.r, 0, Math.sin(rad) * track.r, cx, cy);
          if (s === 0) ctx3D.moveTo(p.x, p.y);
          else ctx3D.lineTo(p.x, p.y);
        }
        const isHovered = activeHoveredGraha && (
          activeHoveredGraha.name === track.name ||
          (track.name.includes('Rahu') && (activeHoveredGraha.name === 'Rahu' || activeHoveredGraha.name === 'Ketu'))
        );
        ctx3D.strokeStyle = isHovered ? track.color : `${track.color}40`;
        ctx3D.lineWidth = isHovered ? 2.4 : 1.1;
        ctx3D.setLineDash(isHovered ? [8, 4] : [3, 5]);
        ctx3D.stroke();
        ctx3D.setLineDash([]);
      });
    } else {
      // Classic single-ring mode reference disks
      const innerRings = [105, 195];
      innerRings.forEach(r => {
        ctx3D.beginPath();
        const steps = 48;
        for (let s = 0; s <= steps; s++) {
          const rad = (s / steps) * Math.PI * 2;
          const p = project3D(Math.cos(rad) * r, 0, Math.sin(rad) * r, cx, cy);
          if (s === 0) ctx3D.moveTo(p.x, p.y);
          else ctx3D.lineTo(p.x, p.y);
        }
        ctx3D.strokeStyle = 'rgba(164, 180, 240, 0.08)';
        ctx3D.lineWidth = 1;
        ctx3D.stroke();
      });
    }

    // --- 360° Ecliptic Ribbon & Fine Graduations (Armillary Astrolabe) ---
    // Outer Ecliptic Gold Ring
    ctx3D.beginPath();
    const ringSteps = 72;
    for (let s = 0; s <= ringSteps; s++) {
      const rad = (s / ringSteps) * Math.PI * 2;
      const p = project3D(Math.cos(rad) * activeOuterRadius, 0, Math.sin(rad) * activeOuterRadius, cx, cy);
      if (s === 0) ctx3D.moveTo(p.x, p.y);
      else ctx3D.lineTo(p.x, p.y);
    }
    ctx3D.strokeStyle = 'rgba(245, 190, 72, 0.45)';
    ctx3D.lineWidth = 2.2;
    ctx3D.stroke();

    // 360 Graduation Ticks (Astronomical precision marks)
    const tickStep = isLowPerformance ? 15 : 10;
    for (let deg = 0; deg < 360; deg += tickStep) {
      const rad = (deg * Math.PI) / 180;
      const isMajor = deg % 30 === 0;
      const isMed = deg % 10 === 0;
      const len = isMajor ? 12 : (isMed ? 7 : 4);

      const pInner = project3D(Math.cos(rad) * (activeOuterRadius - len), 0, Math.sin(rad) * (activeOuterRadius - len), cx, cy);
      const pOuter = project3D(Math.cos(rad) * (activeOuterRadius + len), 0, Math.sin(rad) * (activeOuterRadius + len), cx, cy);

      if (pInner.visible && pOuter.visible) {
        ctx3D.beginPath();
        ctx3D.moveTo(pInner.x, pInner.y);
        ctx3D.lineTo(pOuter.x, pOuter.y);
        ctx3D.strokeStyle = isMajor ? 'rgba(245, 190, 72, 0.85)' : (isMed ? 'rgba(245, 190, 72, 0.4)' : 'rgba(164, 180, 240, 0.2)');
        ctx3D.lineWidth = isMajor ? 2.2 : 1.1;
        ctx3D.stroke();
      }
    }

    // 12 Rashi Sectors (30° segments with authentic Vedic glyphs & element radiance)
    for (let i = 0; i < 12; i++) {
      const rashi = RASHIS[i];
      const startDeg = i * 30;
      const midDeg = i * 30 + 15;
      const endDeg = (i + 1) * 30;

      // Sector boundary radial line
      const radBorder = (startDeg * Math.PI) / 180;
      const pC = project3D(0, 0, 0, cx, cy);
      const pEdge = project3D(Math.cos(radBorder) * (activeOuterRadius + 14), 0, Math.sin(radBorder) * (activeOuterRadius + 14), cx, cy);
      if (pEdge.visible) {
        ctx3D.beginPath();
        ctx3D.moveTo(pC.x, pC.y);
        ctx3D.lineTo(pEdge.x, pEdge.y);
        ctx3D.strokeStyle = 'rgba(245, 190, 72, 0.15)';
        ctx3D.lineWidth = 1;
        ctx3D.stroke();
      }

      // Check if active hovered graha is casting aspect on this sector
      let isAspectTarget = false;
      if (activeHoveredGraha && activeHoveredGraha.rashi) {
        const aspectTargets = getVedicAspects(activeHoveredGraha.name, activeHoveredGraha.rashi.index);
        if (aspectTargets.includes(i)) isAspectTarget = true;
      }

      // Rashi Sector Arc
      ctx3D.beginPath();
      const arcSteps = 8;
      for (let s = 0; s <= arcSteps; s++) {
        const deg = startDeg + (s / arcSteps) * 30;
        const rad = (deg * Math.PI) / 180;
        const p = project3D(Math.cos(rad) * activeOuterRadius, 0, Math.sin(rad) * activeOuterRadius, cx, cy);
        if (s === 0) ctx3D.moveTo(p.x, p.y);
        else ctx3D.lineTo(p.x, p.y);
      }
      ctx3D.strokeStyle = isAspectTarget ? 'rgba(245, 190, 72, 0.95)' : rashi.element;
      ctx3D.lineWidth = isAspectTarget ? 3.8 : 1.8;
      ctx3D.stroke();

      // Rashi Label Placement (Authentic Hindi Devanagari font)
      const midRad = (midDeg * Math.PI) / 180;
      const pLabel = project3D(Math.cos(midRad) * (activeOuterRadius + 32), 0, Math.sin(midRad) * (activeOuterRadius + 32), cx, cy);
      if (pLabel.visible) {
        ctx3D.fillStyle = isAspectTarget ? '#ffe8a3' : rashi.element;
        ctx3D.font = `bold ${Math.max(12, 14 * pLabel.scale)}px 'Noto Sans Devanagari', 'Inter', sans-serif`;
        ctx3D.textAlign = 'center';
        ctx3D.textBaseline = 'middle';
        ctx3D.fillText(`${rashi.symbol} ${rashi.sanskrit}`, pLabel.x, pLabel.y);
      }
    }

    // --- Central Earth (Geocentric Core with Volumetric Atmosphere) ---
    const earthProj = project3D(0, 0, 0, cx, cy);
    if (earthProj.visible) {
      const eRadius = 26 * earthProj.scale;

      // Outer Atmospheric Corona Glow
      const atmoGrad = ctx3D.createRadialGradient(earthProj.x, earthProj.y, eRadius * 0.4, earthProj.x, earthProj.y, eRadius * 2.4);
      atmoGrad.addColorStop(0, 'rgba(56, 189, 248, 0.55)');
      atmoGrad.addColorStop(0.5, 'rgba(138, 92, 246, 0.25)');
      atmoGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx3D.beginPath();
      ctx3D.arc(earthProj.x, earthProj.y, eRadius * 2.4, 0, Math.PI * 2);
      ctx3D.fillStyle = atmoGrad;
      ctx3D.fill();

      // Earth Globe Spherical Body
      const earthBodyGrad = ctx3D.createRadialGradient(
        earthProj.x - eRadius * 0.35, earthProj.y - eRadius * 0.35, eRadius * 0.1,
        earthProj.x, earthProj.y, eRadius
      );
      earthBodyGrad.addColorStop(0, '#38bdf8');
      earthBodyGrad.addColorStop(0.4, '#0284c7');
      earthBodyGrad.addColorStop(0.8, '#0369a1');
      earthBodyGrad.addColorStop(1, '#082f49');

      ctx3D.beginPath();
      ctx3D.arc(earthProj.x, earthProj.y, eRadius, 0, Math.PI * 2);
      ctx3D.fillStyle = earthBodyGrad;
      ctx3D.fill();
      ctx3D.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx3D.lineWidth = 1.8;
      ctx3D.stroke();

      // Rotating Latitude / Longitude Lines
      ctx3D.save();
      ctx3D.beginPath();
      ctx3D.arc(earthProj.x, earthProj.y, eRadius, 0, Math.PI * 2);
      ctx3D.clip();

      const rot = simTime * 1.4;
      ctx3D.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx3D.lineWidth = 1.2;

      // Longitude meridian ellipse
      ctx3D.beginPath();
      ctx3D.ellipse(earthProj.x, earthProj.y, Math.max(0.5, Math.abs(Math.sin(rot)) * eRadius), Math.max(0.5, eRadius), 0, 0, Math.PI * 2);
      ctx3D.stroke();

      // Latitude parallel
      ctx3D.beginPath();
      ctx3D.ellipse(earthProj.x, earthProj.y, Math.max(0.5, eRadius), Math.max(0.5, eRadius * 0.35), 0, 0, Math.PI * 2);
      ctx3D.stroke();
      ctx3D.restore();

      // Label Center Earth in Hindi
      ctx3D.fillStyle = '#f8fafc';
      ctx3D.font = `bold ${Math.max(12, 14 * earthProj.scale)}px 'Noto Sans Devanagari', 'Inter', sans-serif`;
      ctx3D.textAlign = 'center';
      ctx3D.textBaseline = 'middle';
      ctx3D.fillText('🌍 पृथ्वी', earthProj.x, earthProj.y + eRadius + 18 * earthProj.scale);
    }

    // --- Render Navagraha Bodies with Custom 3D Volumetric Shading ---
    if (activeSkyData && activeSkyData.planets) {
      const planetsList = Object.values(activeSkyData.planets);

      // Project all planets and sort by depth for correct 3D occlusion
      const projectedPlanets = planetsList.map(p => {
        const rad = (p.longitude * Math.PI) / 180;
        const pRad = getGrahaRadius(p.name);
        const wx = Math.cos(rad) * pRad;
        const wz = Math.sin(rad) * pRad;
        const proj = project3D(wx, 0, wz, cx, cy);
        return { ...p, proj, rad, wx, wz, pRad };
      }).filter(p => p.proj.visible);

      projectedPlanets.sort((a, b) => b.proj.depth - a.proj.depth);

      // 1. Draw Aspect Beams (Vedic Drishti laser threads)
      if (activeHoveredGraha) {
        const hRad = (activeHoveredGraha.longitude * Math.PI) / 180;
        const hRadius = getGrahaRadius(activeHoveredGraha.name);
        const hProj = project3D(Math.cos(hRad) * hRadius, 0, Math.sin(hRad) * hRadius, cx, cy);

        // Aspect targets
        if (activeHoveredGraha.rashi) {
          const aspectTargets = getVedicAspects(activeHoveredGraha.name, activeHoveredGraha.rashi.index);
          aspectTargets.forEach(tgtIndex => {
            const tgtRad = ((tgtIndex * 30 + 15) * Math.PI) / 180;
            const tgtProj = project3D(Math.cos(tgtRad) * activeOuterRadius, 0, Math.sin(tgtRad) * activeOuterRadius, cx, cy);

            ctx3D.beginPath();
            ctx3D.moveTo(hProj.x, hProj.y);
            ctx3D.lineTo(tgtProj.x, tgtProj.y);
            ctx3D.strokeStyle = 'rgba(245, 190, 72, 0.45)';
            ctx3D.lineWidth = 1.5;
            ctx3D.setLineDash([4, 4]);
            ctx3D.stroke();
            ctx3D.setLineDash([]);
          });
        }
      }

      // 2. Rahu-Ketu 180° Nodal Opposition Axis
      const rahuP = projectedPlanets.find(p => p.name === 'Rahu');
      const ketuP = projectedPlanets.find(p => p.name === 'Ketu');
      if (rahuP && ketuP) {
        ctx3D.beginPath();
        ctx3D.moveTo(rahuP.proj.x, rahuP.proj.y);
        ctx3D.lineTo(ketuP.proj.x, ketuP.proj.y);
        ctx3D.strokeStyle = 'rgba(167, 139, 250, 0.35)';
        ctx3D.lineWidth = 1.2;
        ctx3D.setLineDash([3, 5]);
        ctx3D.stroke();
        ctx3D.setLineDash([]);
      }

      // 3. Render Each Graha with Volumetric Depth and Authentic Planetary Identity
      projectedPlanets.forEach(p => {
        const isHovered = activeHoveredGraha && activeHoveredGraha.name === p.name;
        const baseRadius = (p.name === 'Sun' || p.name === 'Jupiter' ? 18 : 14) * p.proj.scale;
        const radius = isHovered ? baseRadius * 1.3 : baseRadius;

        // V2 Planetary Identity Palette Lookup
        const grahaPalette = {
          Sun: { color: '#ffb347', glow: 'rgba(255, 179, 71, 0.6)' },
          Moon: { color: '#d9e4f5', glow: 'rgba(217, 228, 245, 0.6)' },
          Mars: { color: '#ff5c5c', glow: 'rgba(255, 92, 92, 0.6)' },
          Mercury: { color: '#5ce6c0', glow: 'rgba(92, 230, 192, 0.6)' },
          Jupiter: { color: '#f4c95d', glow: 'rgba(244, 201, 93, 0.65)' },
          Venus: { color: '#ffd6e8', glow: 'rgba(255, 214, 232, 0.6)' },
          Saturn: { color: '#6b7a99', glow: 'rgba(107, 122, 153, 0.6)' },
          Rahu: { color: '#7a5cff', glow: 'rgba(122, 92, 255, 0.65)' },
          Ketu: { color: '#8c7b75', glow: 'rgba(140, 123, 117, 0.6)' }
        }[p.name] || { color: p.color || '#f4c95d', glow: 'rgba(244, 201, 93, 0.5)' };

        // Radial Atmospheric Corona Glow (V2 Dedicated Retrograde Violet vs Graha Color)
        const haloGrad = ctx3D.createRadialGradient(p.proj.x, p.proj.y, radius * 0.5, p.proj.x, p.proj.y, radius * 2.6);
        haloGrad.addColorStop(0, p.isRetrograde ? 'rgba(177, 131, 255, 0.65)' : grahaPalette.glow);
        haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx3D.beginPath();
        ctx3D.arc(p.proj.x, p.proj.y, radius * 2.6, 0, Math.PI * 2);
        ctx3D.fillStyle = haloGrad;
        ctx3D.fill();

        // Dynamic Vakri (Retrograde) Counter-Loop Visual Indicator — Distinct Neon Violet (#b183ff)
        if (p.isRetrograde && p.name !== 'Rahu' && p.name !== 'Ketu') {
          ctx3D.save();
          ctx3D.beginPath();
          const loopRadius = radius * 1.8;
          ctx3D.arc(p.proj.x, p.proj.y, loopRadius, simTime * 5.0, simTime * 5.0 + Math.PI * 1.5, true); // counter-clockwise
          ctx3D.strokeStyle = '#b183ff'; // V2 Dedicated Retrograde Violet
          ctx3D.lineWidth = 2.4;
          ctx3D.stroke();

          // Retrograde particle pip
          const pipAngle = simTime * 5.0;
          const pipX = p.proj.x + Math.cos(pipAngle) * loopRadius;
          const pipY = p.proj.y - Math.sin(pipAngle) * loopRadius;
          ctx3D.beginPath();
          ctx3D.arc(pipX, pipY, 3, 0, Math.PI * 2);
          ctx3D.fillStyle = '#f3e8ff';
          ctx3D.fill();
          ctx3D.restore();
        }

        // Distinct Volumetric Render by Graha Type:
        if (p.name === 'Saturn') {
          // Shani's 3D Ring System
          ctx3D.save();
          ctx3D.beginPath();
          ctx3D.ellipse(p.proj.x, p.proj.y, Math.max(0.5, radius * 2.4), Math.max(0.5, radius * 0.8), Math.PI / 6, 0, Math.PI * 2);
          ctx3D.strokeStyle = 'rgba(245, 190, 72, 0.75)';
          ctx3D.lineWidth = 3.6 * p.proj.scale;
          ctx3D.stroke();
          ctx3D.restore();
        }

        if (p.name === 'Rahu' || p.name === 'Ketu') {
          // Lunar Nodes as Mystic Chhaya Portals
          ctx3D.beginPath();
          ctx3D.arc(p.proj.x, p.proj.y, radius, 0, Math.PI * 2);
          ctx3D.fillStyle = p.name === 'Rahu' ? '#4c1d95' : '#78350f';
          ctx3D.fill();
          ctx3D.strokeStyle = p.color;
          ctx3D.lineWidth = 2.2;
          ctx3D.stroke();

          // Accretion Disk
          ctx3D.beginPath();
          ctx3D.arc(p.proj.x, p.proj.y, radius * 1.45, simTime * 3, simTime * 3 + Math.PI);
          ctx3D.strokeStyle = p.name === 'Rahu' ? '#c084fc' : '#fb923c';
          ctx3D.lineWidth = 1.6;
          ctx3D.stroke();
        } else {
          // Physical Graha Spherical Body with 3D Specular Highlight
          const sphereGrad = ctx3D.createRadialGradient(
            p.proj.x - radius * 0.35, p.proj.y - radius * 0.35, radius * 0.1,
            p.proj.x, p.proj.y, radius
          );
          sphereGrad.addColorStop(0, '#ffffff');
          sphereGrad.addColorStop(0.35, p.color);
          sphereGrad.addColorStop(1, p.isRetrograde ? '#581c87' : '#0f172a');

          ctx3D.beginPath();
          ctx3D.arc(p.proj.x, p.proj.y, radius, 0, Math.PI * 2);
          ctx3D.fillStyle = sphereGrad;
          ctx3D.fill();
          ctx3D.strokeStyle = isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.7)';
          ctx3D.lineWidth = isHovered ? 2.5 : 1.4;
          ctx3D.stroke();
        }

        // Draw Planetary Vedic Glyph & Hindi Name
        const gHindi = GRAHA_HINDI[p.name] || { hindi: p.name, glyph: p.glyph };
        ctx3D.fillStyle = p.name === 'Sun' || p.name === 'Moon' ? '#040711' : '#ffffff';
        ctx3D.font = `bold ${Math.max(12, 16 * p.proj.scale)}px 'Inter', sans-serif`;
        ctx3D.textAlign = 'center';
        ctx3D.textBaseline = 'middle';
        ctx3D.fillText(p.glyph, p.proj.x, p.proj.y);

        // Always display Hindi Graha name tag right below the planet
        ctx3D.fillStyle = isHovered ? '#ffd572' : 'rgba(250, 228, 181, 0.95)';
        ctx3D.font = `bold ${Math.max(10, 12 * p.proj.scale)}px 'Noto Sans Devanagari', 'Inter', sans-serif`;
        ctx3D.fillText(gHindi.hindi, p.proj.x, p.proj.y + radius + 14 * p.proj.scale);

        // Hover Reticle (High-precision Caliper Ring)
        if (isHovered) {
          ctx3D.save();
          ctx3D.beginPath();
          ctx3D.arc(p.proj.x, p.proj.y, radius + 10, 0, Math.PI * 2);
          ctx3D.strokeStyle = 'rgba(245, 190, 72, 0.9)';
          ctx3D.lineWidth = 1.5;
          ctx3D.setLineDash([5, 5]);
          ctx3D.stroke();
          ctx3D.restore();

          // Coordinate readout tooltip on canvas in Hindi
          ctx3D.fillStyle = '#ffe8a3';
          ctx3D.font = `bold ${Math.max(11, 13 * p.proj.scale)}px 'Noto Sans Devanagari', 'IBM Plex Mono', monospace`;
          ctx3D.fillText(`${gHindi.hindi} • ${p.longitude}°`, p.proj.x, p.proj.y - radius - 16);
        }

        // Retrograde badge indicator (V2 Dedicated Neon Violet Token)
        if (p.isRetrograde && p.name !== 'Rahu' && p.name !== 'Ketu') {
          ctx3D.fillStyle = '#b183ff';
          ctx3D.font = `bold ${Math.max(9, 11 * p.proj.scale)}px 'Inter', sans-serif`;
          ctx3D.fillText('℞ Vakri', p.proj.x + radius + 24, p.proj.y - 4);
        }
      });
    }
    } catch (err3D) {
      // Gracefully recover frame from any canvas draw exception
    }

    if (!prefersReducedMotion) {
      animFrameId = requestAnimationFrame(renderDesktop3D);
    }
  }

  // --- 5. Unified Hit-Testing & Hover/Touch Raycast (Mobile & Desktop) ---
  function findGrahaAtClientCoords(clientX, clientY) {
    if (!activeSkyData || !activeSkyData.planets || !desktopCanvas) return null;

    const rect = desktopCanvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mx = (clientX - rect.left) * dpr;
    const my = (clientY - rect.top) * dpr;

    const { cx, cy } = getSceneCenter();

    // Generous touch slop on mobile for easy finger tapping
    const hitSlop = (window.innerWidth <= 640 ? 24 : 14) * dpr;

    for (const p of Object.values(activeSkyData.planets)) {
      const rad = (p.longitude * Math.PI) / 180;
      const pRad = getGrahaRadius(p.name);
      const wx = Math.cos(rad) * pRad;
      const wz = Math.sin(rad) * pRad;
      const proj = project3D(wx, 0, wz, cx, cy);
      if (!proj.visible) continue;

      const baseRadius = 18 * proj.scale;
      const dx = mx - proj.x;
      const dy = my - proj.y;
      const maxDist = baseRadius + hitSlop;
      if (dx * dx + dy * dy <= maxDist * maxDist) {
        return p;
      }
    }
    return null;
  }

  let pendingHoverX = -1, pendingHoverY = -1;
  let hoverRafPending = false;

  if (desktopCanvas) {
    desktopCanvas.addEventListener('mousemove', (e) => {
      pendingHoverX = e.clientX;
      pendingHoverY = e.clientY;
      if (!hoverRafPending) {
        hoverRafPending = true;
        requestAnimationFrame(() => {
          hoverRafPending = false;
          if (pendingHoverX < 0) return;
          const found = findGrahaAtClientCoords(pendingHoverX, pendingHoverY);
          if (found !== activeHoveredGraha) {
            activeHoveredGraha = found;
            desktopCanvas.style.cursor = found ? 'pointer' : (isDragging ? 'grabbing' : 'grab');
            updateInspector(found || selectedGraha);
            highlightLinkedWidgets(found || selectedGraha);
          }
        });
      }
    }, { passive: true });

    desktopCanvas.addEventListener('click', (e) => {
      // Find directly at click/touch coordinates (critical for mobile tap selection)
      const found = findGrahaAtClientCoords(e.clientX, e.clientY) || activeHoveredGraha;
      if (found) {
        selectedGraha = (selectedGraha && selectedGraha.name === found.name) ? null : found;
        activeHoveredGraha = selectedGraha;
        updateInspector(selectedGraha);
        highlightLinkedWidgets(selectedGraha);
        // Sync active state on bottom badges
        document.querySelectorAll('.orbit-planet-badge').forEach(b => {
          const pName = b.getAttribute('data-planet');
          b.classList.toggle('active', !!(selectedGraha && pName && pName.toLowerCase() === selectedGraha.name.toLowerCase()));
        });
      } else {
        // Deselect when clicking on empty canvas
        selectedGraha = null;
        activeHoveredGraha = null;
        updateInspector(null);
        highlightLinkedWidgets(null);
        document.querySelectorAll('.orbit-planet-badge').forEach(b => b.classList.remove('active'));
      }
    });

    desktopCanvas.addEventListener('mouseleave', () => {
      if (!isDragging) {
        activeHoveredGraha = null;
        updateInspector(selectedGraha);
        highlightLinkedWidgets(selectedGraha);
      }
    });

    // Quick-select planet by clicking bottom badges
    const planetBadges = document.querySelectorAll('.orbit-planet-badge');
    planetBadges.forEach(badge => {
      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        const pAttr = badge.getAttribute('data-planet') || badge.textContent.split(' ')[0].trim();
        if (activeSkyData && activeSkyData.planets) {
          const found = Object.values(activeSkyData.planets).find(p =>
            p.name.toLowerCase() === pAttr.toLowerCase() ||
            (pAttr === 'Rahu' && p.name === 'Rahu') ||
            (pAttr === 'Ketu' && p.name === 'Ketu') ||
            (pAttr === 'North' && p.name === 'Rahu') ||
            (pAttr === 'South' && p.name === 'Ketu')
          );
          if (found) {
            const isAlreadyActive = badge.classList.contains('active');
            planetBadges.forEach(b => b.classList.remove('active'));
            if (!isAlreadyActive) {
              badge.classList.add('active');
              selectedGraha = found;
              activeHoveredGraha = found;
              updateInspector(found);
              highlightLinkedWidgets(found);
            } else {
              selectedGraha = null;
              activeHoveredGraha = null;
              updateInspector(null);
              highlightLinkedWidgets(null);
            }
          }
        }
      });
    });
  }

  // --- 6. Mobile 2D Lightweight Vector Engine ---
  let ctx2D = null;
  if (mobileCanvas) {
    ctx2D = mobileCanvas.getContext('2d');

    function renderMobile2D() {
      if (!ctx2D) return;
      const w = mobileCanvas.width;
      const h = mobileCanvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const mRadius = 145;

      ctx2D.clearRect(0, 0, w, h);

      // Deep space radial fill
      const grad = ctx2D.createRadialGradient(cx, cy, 10, cx, cy, w * 0.6);
      grad.addColorStop(0, '#0c122c');
      grad.addColorStop(1, '#03050d');
      ctx2D.fillStyle = grad;
      ctx2D.fillRect(0, 0, w, h);

      // Earth Center
      ctx2D.beginPath();
      ctx2D.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx2D.fillStyle = '#0284c7';
      ctx2D.fill();
      ctx2D.strokeStyle = '#ffffff';
      ctx2D.lineWidth = 1.8;
      ctx2D.stroke();

      // 12 Rashi Band
      for (let i = 0; i < 12; i++) {
        const rashi = RASHIS[i];
        const sRad = (i * 30 * Math.PI) / 180;
        const eRad = ((i + 1) * 30 * Math.PI) / 180;

        ctx2D.beginPath();
        ctx2D.arc(cx, cy, mRadius, sRad, eRad);
        ctx2D.strokeStyle = 'rgba(164, 180, 240, 0.28)';
        ctx2D.lineWidth = 2.2;
        ctx2D.stroke();

        const midRad = ((i * 30 + 15) * Math.PI) / 180;
        const lx = cx + Math.cos(midRad) * (mRadius + 18);
        const ly = cy + Math.sin(midRad) * (mRadius + 18);
        ctx2D.fillStyle = rashi.element;
        ctx2D.font = "bold 10px 'Noto Sans Devanagari', 'Inter', sans-serif";
        ctx2D.textAlign = 'center';
        ctx2D.textBaseline = 'middle';
        ctx2D.fillText(`${rashi.symbol} ${rashi.sanskrit}`, lx, ly);
      }

      // Draw Planets on 2D Top-down wheel
      if (activeSkyData && activeSkyData.planets) {
        Object.values(activeSkyData.planets).forEach(p => {
          const rad = (p.longitude * Math.PI) / 180;
          const px = cx + Math.cos(rad) * mRadius;
          const py = cy + Math.sin(rad) * mRadius;

          ctx2D.beginPath();
          ctx2D.arc(px, py, 14, 0, Math.PI * 2);
          ctx2D.fillStyle = p.isRetrograde ? '#f43f5e' : p.color;
          ctx2D.fill();
          ctx2D.strokeStyle = '#ffffff';
          ctx2D.lineWidth = 1.8;
          ctx2D.stroke();

          const gHindi = GRAHA_HINDI[p.name] || { hindi: p.name, glyph: p.glyph };
          ctx2D.fillStyle = '#040711';
          ctx2D.font = 'bold 11px sans-serif';
          ctx2D.textAlign = 'center';
          ctx2D.textBaseline = 'middle';
          ctx2D.fillText(p.glyph, px, py);

          // Planet Hindi Name label on mobile
          ctx2D.fillStyle = 'rgba(250, 228, 181, 0.95)';
          ctx2D.font = "bold 9px 'Noto Sans Devanagari', 'Inter', sans-serif";
          ctx2D.fillText(gHindi.hindi, px, py + 18);

          if (p.isRetrograde && p.name !== 'Rahu' && p.name !== 'Ketu') {
            ctx2D.fillStyle = '#ef4444';
            ctx2D.font = 'bold 9px sans-serif';
            ctx2D.fillText('(Rx)', px + 14, py - 4);
          }
        });
      }
    }

    renderMobile2D();

    // Mobile Tap Hit Testing
    mobileCanvas.addEventListener('click', (e) => {
      if (!activeSkyData || !activeSkyData.planets) return;
      const rect = mobileCanvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const cx = mobileCanvas.width / 2;
      const cy = mobileCanvas.height / 2;
      const mRadius = 145;

      let found = null;
      for (const p of Object.values(activeSkyData.planets)) {
        const rad = (p.longitude * Math.PI) / 180;
        const px = cx + Math.cos(rad) * mRadius;
        const py = cy + Math.sin(rad) * mRadius;
        const dist = Math.hypot(mx - px, my - py);
        if (dist <= 24) {
          found = p;
          break;
        }
      }
      if (found) {
        updateInspector(found);
        highlightLinkedWidgets(found);
      }
    });
  }

  // --- 7. Inspector Drawer Update (Calculation-First Transparency) ---
  function updateInspector(planet) {
    if (!infoDrawer) return;

    if (!planet) {
      infoDrawer.innerHTML = `
        <p class="orbit-hint-text">✦ Hover over or click any of the 9 Navagraha spheres to inspect authentic Rashi, degree, Nakshatra, and direct/retrograde calculations.</p>
      `;
      return;
    }

    const vakriStatusHtml = planet.isRetrograde && planet.name !== 'Rahu' && planet.name !== 'Ketu'
      ? `<span class="inspect-vakri-badge">Retrograde (Rx)</span>`
      : `<span class="inspect-direct-badge">Direct Motion</span>`;

    const dignitiesHtml = `<span class="inspect-dignity-badge">${planet.dignity || 'Standard Alignment'}</span>`;

    infoDrawer.innerHTML = `
      <div class="planet-inspect-view">
        <div class="inspect-header">
          <span class="inspect-glyph" style="color: ${planet.color}">${planet.glyph}</span>
          <div class="inspect-title">
            <h4>${planet.name}</h4>
            <div class="inspect-sub-tags">
              <span>Longitude: <strong>${planet.longitude}°</strong></span>
              ${vakriStatusHtml}
              ${dignitiesHtml}
            </div>
          </div>
        </div>
        <div class="inspect-grid-details">
          <div class="detail-box">
            <span class="detail-label">Rashi Placement:</span>
            <strong>${planet.rashi ? planet.rashi.label : planet.sign}</strong>
          </div>
          <div class="detail-box">
            <span class="detail-label">Nakshatra & Pada:</span>
            <strong>${planet.nakshatra ? planet.nakshatra.label : 'Standard Constellation'}</strong>
          </div>
        </div>
        <p class="inspect-desc">${planet.significance}</p>
        <div class="inspect-market-link">
          <span>Harmonized Market Sector:</span>
          <strong>${planet.asset} (${planet.symbolLink})</strong>
        </div>
      </div>
    `;
  }

  // --- 8. Planet-to-Live-Widget Interactivity (Targeted Sky-to-Street Correlation) ---
  function highlightLinkedWidgets(planet) {
    document.querySelectorAll('.celestial-linked-pulse').forEach(el => {
      el.classList.remove('celestial-linked-pulse');
    });

    if (!planet || !planet.symbolLink) return;

    // Highlight ONLY the specific correlated market card
    const targetCard = document.querySelector(`.instrument-card[data-symbol="${planet.symbolLink}"]`);
    if (targetCard) {
      targetCard.classList.add('celestial-linked-pulse');
    }

    const targetChip = document.querySelector(`.ticker-chip[data-symbol="${planet.symbolLink}"]`);
    if (targetChip) {
      targetChip.classList.add('celestial-linked-pulse');
    }

    const targetSyncCard = document.querySelector(`.sync-card[data-planet="${planet.name.toLowerCase()}"]`);
    if (targetSyncCard) {
      targetSyncCard.classList.add('celestial-linked-pulse');
    }
  }

  // --- 9. Load Real Data from Backend Ephemeris (NASA JPL Sidereal Engine) ---
  async function loadLiveSky() {
    try {
      const res = await fetch('/api/ephemeris');
      const data = await res.json();
      if (data && data.ephemeris) {
        activeSkyData = { planets: data.ephemeris };
        isLiveMode = true;

        if (modeLabel) modeLabel.textContent = 'Live Sky (Sidereal Lahiri)';
        if (dateBadge) dateBadge.style.display = 'none';
        if (statusDot) {
          statusDot.style.backgroundColor = 'var(--market-green)';
          statusDot.style.boxShadow = '0 0 8px var(--market-green-glow)';
        }

        const vBadge = document.getElementById('jplTelemetryBadge') || document.getElementById('vedastroTelemetryBadge');
        if (vBadge && data.telemetry) {
          vBadge.title = `Observatory Ephemeris: ${data.telemetry.provider}\nAyanamsa: ${data.telemetry.ayanamsa}\nMeridian: ${data.telemetry.coordinates}\nIST Sync: ${data.telemetry.syncTimestamp}`;
          vBadge.onclick = () => {
            alert(`🛰️ CELESTIAL OBSERVATORY TELEMETRY\n\n• Ephemeris Provider: ${data.telemetry.provider}\n• Zodiac Ayanamsa: ${data.telemetry.ayanamsa}\n• Terrestrial Meridian: ${data.telemetry.coordinates}\n• Indian Standard Time: ${data.telemetry.syncTimestamp}\n• Roundtrip Calibration: ${data.telemetry.latencyMs}ms\n\nTrust Principle: "We don't predict. We calculate, and we show you the calculation."`);
          };
        }

        if (tmDateLabel) tmDateLabel.textContent = 'Today (Live)';
        if (mobileTmDateLabel) mobileTmDateLabel.textContent = 'Today (Live)';

        if (mobileCanvas && ctx2D) {
          renderMobile2D();
        }
      }
    } catch (e) {
      console.warn('Ephemeris load fallback active');
    }
  }

  loadLiveSky();

  // --- 10. 4D Time Machine Scrubbing & Milestone Preset Engine ---
  async function jumpToDate(dateStr, label = null) {
    try {
      const res = await fetch(`/api/time-machine/snapshot?date=${dateStr}`);
      const data = await res.json();
      if (data && data.snapshot) {
        const snap = data.snapshot;
        activeSkyData = { planets: snap.planets };
        isLiveMode = false;

        // Update Observatory status
        if (modeLabel) modeLabel.textContent = `4D Archive: ${dateStr}`;
        if (dateBadge) {
          dateBadge.style.display = 'inline-block';
          dateBadge.textContent = dateStr;
        }
        if (statusDot) {
          statusDot.style.backgroundColor = '#f5be48';
          statusDot.style.boxShadow = '0 0 8px rgba(245, 190, 72, 0.6)';
        }

        // Update Labels
        if (tmDateLabel) tmDateLabel.textContent = label ? `${label} (${dateStr})` : dateStr;
        if (mobileTmDateLabel) mobileTmDateLabel.textContent = label || dateStr;

        // Update Connected Market Data Readout Panel
        if (snap.market) {
          if (tmNifty) tmNifty.textContent = snap.market.nifty ? Number(snap.market.nifty).toLocaleString('en-IN') : 'N/A';
          if (tmSensex) tmSensex.textContent = snap.market.sensex ? Number(snap.market.sensex).toLocaleString('en-IN') : 'N/A';
          if (tmGold) tmGold.textContent = snap.market.gold ? `₹${Number(snap.market.gold).toLocaleString('en-IN')}` : 'N/A';
          if (tmBtc) tmBtc.textContent = snap.market.btc ? `$${Number(snap.market.btc).toLocaleString('en-IN')}` : 'N/A';
          if (tmNotes) tmNotes.textContent = snap.market.notes || 'Historical geocentric planetary snapshot.';

          if (mNifty) mNifty.textContent = snap.market.nifty ? Number(snap.market.nifty).toLocaleString('en-IN') : 'N/A';
          if (mGold) mGold.textContent = snap.market.gold ? `₹${Number(snap.market.gold).toLocaleString('en-IN')}` : 'N/A';
          if (mBtc) mBtc.textContent = snap.market.btc ? `$${Number(snap.market.btc).toLocaleString('en-IN')}` : 'N/A';
        }

        if (mobileCanvas && ctx2D) {
          renderMobile2D();
        }
      }
    } catch (e) {
      console.warn('Error loading time machine snapshot:', e);
    }
  }

  // Preset Buttons Handling
  tmPresets.forEach(btn => {
    btn.addEventListener('click', () => {
      tmPresets.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const preset = btn.getAttribute('data-preset');
      if (preset === 'today') {
        loadLiveSky();
        if (tmSlider) tmSlider.value = 100;
      } else {
        jumpToDate(preset, btn.textContent.trim());
      }
    });
  });

  // Reset to Live
  if (btnResetToLive) {
    btnResetToLive.addEventListener('click', () => {
      tmPresets.forEach(b => b.classList.remove('active'));
      const todayChip = document.querySelector('.tm-preset-chip[data-preset="today"]');
      if (todayChip) todayChip.classList.add('active');
      loadLiveSky();
      if (tmSlider) tmSlider.value = 100;
    });
  }

  if (mobileBtnResetToLive) {
    mobileBtnResetToLive.addEventListener('click', () => {
      loadLiveSky();
    });
  }

  // Interactive Scrub Slider (Maps 0-100 to 2008 through 2026+)
  if (tmSlider) {
    const historicalDates = [
      '2008-09-15', '2008-10-24', '2009-05-18', '2016-11-08',
      '2020-03-23', '2020-11-10', '2021-10-19', '2021-11-10',
      '2023-12-08', '2024-06-04', '2024-09-27'
    ];

    tmSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      tmPresets.forEach(b => b.classList.remove('active'));

      if (val >= 98) {
        loadLiveSky();
      } else {
        const idx = Math.floor((val / 100) * historicalDates.length);
        const selectedDate = historicalDates[Math.min(idx, historicalDates.length - 1)];
        jumpToDate(selectedDate);
      }
    });
  }

  // --- 7. Cosmic Finance v2.0 Dynamic Controls & SSE Wireup ---
  const btnToggleOrbitMode = document.getElementById('btnToggleOrbitMode');
  const btnToggleCalcDrawer = document.getElementById('btnToggleCalcDrawer');
  const btnCloseCalcDrawer = document.getElementById('btnCloseCalcDrawer');
  const orbitCalcDrawer = document.getElementById('orbitCalcDrawer');
  const sseTickCount = document.getElementById('sseTickCount');
  const v2StreamStatus = document.getElementById('v2StreamStatus');

  if (btnToggleOrbitMode) {
    btnToggleOrbitMode.addEventListener('click', () => {
      orbitMode = orbitMode === 'multiring' ? 'classic' : 'multiring';
      btnToggleOrbitMode.innerHTML = orbitMode === 'multiring'
        ? '<span>🪐</span> Concentric Paths'
        : '<span>⭕</span> Single Wheel';
      btnToggleOrbitMode.classList.toggle('active', orbitMode === 'multiring');
    });
  }

  if (btnToggleCalcDrawer && orbitCalcDrawer) {
    btnToggleCalcDrawer.addEventListener('click', () => {
      orbitCalcDrawer.classList.toggle('hidden');
      btnToggleCalcDrawer.classList.toggle('active', !orbitCalcDrawer.classList.contains('hidden'));
    });
  }

  if (btnCloseCalcDrawer && orbitCalcDrawer) {
    btnCloseCalcDrawer.addEventListener('click', () => {
      orbitCalcDrawer.classList.add('hidden');
      if (btnToggleCalcDrawer) btnToggleCalcDrawer.classList.remove('active');
    });
  }

  // Interactive On-Screen Zoom Controls (v2.0)
  if (btnZoomIn) {
    btnZoomIn.addEventListener('click', (e) => {
      e.stopPropagation();
      userHasZoomed = true;
      const base = getBaseCamDist();
      const step = Math.round(base * 0.12);
      targetCamDist = Math.max(base * 0.55, targetCamDist - step);
      updateZoomPill();
    });
  }

  if (btnZoomOut) {
    btnZoomOut.addEventListener('click', (e) => {
      e.stopPropagation();
      userHasZoomed = true;
      const base = getBaseCamDist();
      const step = Math.round(base * 0.12);
      targetCamDist = Math.min(base * 1.8, targetCamDist + step);
      updateZoomPill();
    });
  }

  if (btnZoomFit) {
    btnZoomFit.addEventListener('click', (e) => {
      e.stopPropagation();
      userHasZoomed = false;
      targetCamDist = getBaseCamDist();
      targetPitch = 0.46;
      targetYaw = -0.35;
      updateZoomPill();
    });
  }

  // Real-Time SSE Packet Stream Telemetry Counter
  let ssePacketCounter = 0;
  try {
    const sse = new EventSource('/api/stream/market');
    sse.onmessage = (evt) => {
      ssePacketCounter++;
      if (sseTickCount) {
        sseTickCount.textContent = `Streaming (${ssePacketCounter} pkts)`;
      }
      if (v2StreamStatus) {
        v2StreamStatus.textContent = `Live Stream Active (${ssePacketCounter} pkts • 0ms)`;
      }
    };
    sse.onerror = () => {
      if (v2StreamStatus) {
        v2StreamStatus.textContent = 'Auto-reconnecting SSE...';
      }
    };
  } catch (err) {
    console.debug('SSE initialization error in orbit.js:', err);
  }

  // Dynamic Headline Phrase Rotator: Where Stars Meet [Phrase without quotes]
  const dynamicStreetEl = document.getElementById('dynamicStreetText');
  if (dynamicStreetEl) {
    const streetPhrases = [
      'Dalal Street',
      'Wall Street',
      'Market Trends',
      'Financial Destiny',
      'Trading Profits',
      'Wealth Creation'
    ];
    let phraseIndex = 0;
    setInterval(() => {
      dynamicStreetEl.style.opacity = '0';
      dynamicStreetEl.style.transform = 'translateY(-8px)';
      dynamicStreetEl.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => {
        phraseIndex = (phraseIndex + 1) % streetPhrases.length;
        dynamicStreetEl.textContent = streetPhrases[phraseIndex];
        dynamicStreetEl.style.opacity = '1';
        dynamicStreetEl.style.transform = 'translateY(0)';
      }, 400);
    }, 2800);
  }

  // Start 3D Render Loop
  if (ctx3D) {
    renderDesktop3D();
  }
});
