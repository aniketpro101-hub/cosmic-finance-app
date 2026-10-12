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
  let activeSkyData = null;
  let activeMarketData = null;
  let activeHoveredGraha = null;
  let selectedGraha = null;

  // Vedic Rashis (12 signs, 30° each) with element colors & symbols
  const RASHIS = [
    { name: 'Aries', vedic: 'Mesha', symbol: '♈', sanskrit: 'मेष', element: '#f87171', nature: 'Fire' },
    { name: 'Taurus', vedic: 'Vrishabha', symbol: '♉', sanskrit: 'वृषभ', element: '#34d399', nature: 'Earth' },
    { name: 'Gemini', vedic: 'Mithuna', symbol: '♊', sanskrit: 'मिथुन', element: '#60a5fa', nature: 'Air' },
    { name: 'Cancer', vedic: 'Karka', symbol: '♋', sanskrit: 'कर्क', element: '#818cf8', nature: 'Water' },
    { name: 'Leo', vedic: 'Simha', symbol: '♌', sanskrit: 'सिंह', element: '#f87171', nature: 'Fire' },
    { name: 'Virgo', vedic: 'Kanya', symbol: '♍', sanskrit: 'कन्या', element: '#34d399', nature: 'Earth' },
    { name: 'Libra', vedic: 'Tula', symbol: '♎', sanskrit: 'तुला', element: '#60a5fa', nature: 'Air' },
    { name: 'Scorpio', vedic: 'Vrishchika', symbol: '♏', sanskrit: 'वृश्चिक', element: '#818cf8', nature: 'Water' },
    { name: 'Sagittarius', vedic: 'Dhanu', symbol: '♐', sanskrit: 'धनु', element: '#f87171', nature: 'Fire' },
    { name: 'Capricorn', vedic: 'Makara', symbol: '♑', sanskrit: 'मकर', element: '#34d399', nature: 'Earth' },
    { name: 'Aquarius', vedic: 'Kumbha', symbol: '♒', sanskrit: 'कुम्भ', element: '#60a5fa', nature: 'Air' },
    { name: 'Pisces', vedic: 'Meena', symbol: '♓', sanskrit: 'मीन', element: '#818cf8', nature: 'Water' }
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

  // --- 3. Desktop True 3D Geocentric Scene Engine ---
  let ctx3D = null;
  let width3D = 600, height3D = 460;
  let camPitch = 0.62; // Tilt angle (radians)
  let camYaw = -0.35;   // Rotation angle (radians)
  let camDist = 360;   // Distance (closer zoom for expansive diagram)
  let isDragging = false;
  let lastMouseX = 0, lastMouseY = 0;
  let targetPitch = 0.62, targetYaw = -0.35;
  let velYaw = 0, velPitch = 0;
  let animFrameId = null;

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

  // Pre-generate 3D Starfield Particles for Deep Space Parallax
  const STARS_COUNT = 160;
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

  // 3D Celestial Financial Candlestick Horizon (Fusing The Sky with The Street)
  const CANDLE_COUNT = 34;
  const candleHorizon3D = [];

  function generateCandleHorizon(mode = 'live') {
    candleHorizon3D.length = 0;
    let price = 100;
    for (let i = 0; i < CANDLE_COUNT; i++) {
      let delta = 0;
      if (mode === 'lehman') {
        delta = i < 8 ? (Math.random() - 0.42) * 4 : -Math.random() * 6 - 0.5;
      } else if (mode === 'covid') {
        delta = i < 14 ? -Math.random() * 7 - 0.5 : Math.random() * 8 + 0.8;
      } else if (mode === 'election') {
        delta = (i >= 12 && i <= 15) ? -9 : (i > 15 ? Math.random() * 8 + 1 : (Math.random() - 0.45) * 4);
      } else if (mode === 'crypto') {
        delta = i < 22 ? Math.random() * 7 + 0.5 : -Math.random() * 8 - 1;
      } else {
        // Live sidereal accumulation trend
        delta = (Math.random() - 0.46) * 4.2;
      }

      const open = price;
      const close = Math.max(30, open + delta);
      const high = Math.max(open, close) + Math.random() * 2.8 + 0.6;
      const low = Math.min(open, close) - (Math.random() * 2.8 + 0.6);
      price = close;

      // 3D curve positioning in space behind/below the central ecliptic plane
      const t = (i / (CANDLE_COUNT - 1)) - 0.5; // -0.5 to 0.5
      const wx = t * 760; // Spanning comfortably across the scene
      const wy = 55 + Math.sin(t * Math.PI) * 40 - (close - 100) * 0.7; // Floating below/behind the rings
      const wz = -110 + Math.cos(t * Math.PI) * 75;

      candleHorizon3D.push({
        wx, wy, wz,
        open, high, low, close,
        isBullish: close >= open
      });
    }
  }

  generateCandleHorizon('live');

  if (desktopCanvas) {
    ctx3D = desktopCanvas.getContext('2d');

    function setupDesktopDimensions() {
      const rect = desktopCanvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = rect.width > 50 ? rect.width : (desktopCanvas.parentElement ? desktopCanvas.parentElement.clientWidth : 1100);
      const h = rect.height > 50 ? rect.height : 640;
      width3D = w * dpr;
      height3D = h * dpr;
      desktopCanvas.width = width3D;
      desktopCanvas.height = height3D;
    }

    setupDesktopDimensions();
    window.addEventListener('resize', setupDesktopDimensions, { passive: true });

    // 3D Camera Orbit Interactions (Mouse/Pointer Drag + Physics Easing)
    function onDragStart(e) {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      velYaw = 0;
      velPitch = 0;
      desktopCanvas.style.cursor = 'grabbing';
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
      }
    }

    desktopCanvas.addEventListener('mousedown', onDragStart);
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);

    desktopCanvas.addEventListener('pointerdown', onDragStart);
    window.addEventListener('pointermove', onDragMove);
    window.addEventListener('pointerup', onDragEnd);

    desktopCanvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      camDist += e.deltaY * 0.35;
      camDist = Math.max(220, Math.min(520, camDist));
    }, { passive: false });
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

    const fov = 480;
    const depth = camDist + z2;
    if (depth <= 12) return { x: cx, y: cy, scale: 0, visible: false, depth: 9999 };

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
  const ringRadius = 290;
  const nakshatraRadius = 320;
  let simTime = 0;

  function renderDesktop3D() {
    if (!ctx3D) return;
    monitorPerformance();

    simTime += 0.016;

    // Smooth inertia and physics damping
    if (!isDragging) {
      velYaw *= 0.94;
      velPitch *= 0.94;
      targetYaw += velYaw;
      targetPitch += velPitch;

      // Continuous dynamic celestial revolution
      if (Math.abs(velYaw) < 0.0001 && !activeHoveredGraha) {
        targetYaw += 0.0036; // Noticeable, majestic continuous orbital revolution
      }
    }

    camYaw += (targetYaw - camYaw) * 0.1;
    camPitch += (targetPitch - camPitch) * 0.1;

    const cx = width3D / 2;
    const cy = height3D / 2;

    ctx3D.clearRect(0, 0, width3D, height3D);

    // Deep luxury space background with subtle nebular radiance
    const bgGrad = ctx3D.createRadialGradient(cx, cy, 30, cx, cy, Math.max(width3D, height3D) * 0.75);
    bgGrad.addColorStop(0, '#0c122c');
    bgGrad.addColorStop(0.4, '#060a1a');
    bgGrad.addColorStop(1, '#03050d');
    ctx3D.fillStyle = bgGrad;
    ctx3D.fillRect(0, 0, width3D, height3D);

    // Render 3D Parallax Starfield
    if (!isLowPerformance) {
      stars3D.forEach(star => {
        const p = project3D(star.x, star.y, star.z, cx, cy);
        if (p.visible) {
          const alpha = star.brightness * (0.6 + 0.4 * Math.sin(simTime * star.twinkleSpeed * 100));
          ctx3D.beginPath();
          ctx3D.arc(p.x, p.y, Math.max(0.6, star.size * p.scale), 0, Math.PI * 2);
          ctx3D.fillStyle = star.hue;
          ctx3D.globalAlpha = Math.min(1, Math.max(0, alpha));
          ctx3D.fill();
        }
      });
      ctx3D.globalAlpha = 1.0;
    }

    // --- 3D Celestial Financial Candlestick Horizon (Fusing Stars with Street) ---
    candleHorizon3D.forEach(c => {
      const p = project3D(c.wx, c.wy, c.wz, cx, cy);
      if (!p.visible) return;

      const sc = p.scale;
      const cWidth = Math.max(3.5, 7.5 * sc);
      const wickHigh = (c.high - Math.max(c.open, c.close)) * 2.4 * sc;
      const wickLow = (Math.min(c.open, c.close) - c.low) * 2.4 * sc;
      const bodyHeight = Math.max(3.5, Math.abs(c.close - c.open) * 2.4 * sc);

      const color = c.isBullish ? 'rgba(99, 217, 165, 0.45)' : 'rgba(232, 123, 140, 0.45)';
      const bodyFill = c.isBullish ? 'rgba(99, 217, 165, 0.24)' : 'rgba(232, 123, 140, 0.24)';

      // Upper Wick
      ctx3D.beginPath();
      ctx3D.moveTo(p.x, p.y - bodyHeight / 2);
      ctx3D.lineTo(p.x, p.y - bodyHeight / 2 - wickHigh);
      ctx3D.strokeStyle = color;
      ctx3D.lineWidth = 1;
      ctx3D.stroke();

      // Lower Wick
      ctx3D.beginPath();
      ctx3D.moveTo(p.x, p.y + bodyHeight / 2);
      ctx3D.lineTo(p.x, p.y + bodyHeight / 2 + wickLow);
      ctx3D.strokeStyle = color;
      ctx3D.lineWidth = 1;
      ctx3D.stroke();

      // Candle Body
      ctx3D.fillStyle = bodyFill;
      ctx3D.strokeStyle = color;
      ctx3D.lineWidth = 1.1;
      ctx3D.beginPath();
      ctx3D.rect(p.x - cWidth / 2, p.y - bodyHeight / 2, cWidth, bodyHeight);
      ctx3D.fill();
      ctx3D.stroke();
    });

    // --- Geocentric Reference Concentric Disks ---
    // Draw concentric declination / distance rings on the ecliptic plane
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

    // --- 360° Ecliptic Ribbon & Fine Graduations (Armillary Astrolabe) ---
    // Outer Ecliptic Gold Ring
    ctx3D.beginPath();
    const ringSteps = 72;
    for (let s = 0; s <= ringSteps; s++) {
      const rad = (s / ringSteps) * Math.PI * 2;
      const p = project3D(Math.cos(rad) * ringRadius, 0, Math.sin(rad) * ringRadius, cx, cy);
      if (s === 0) ctx3D.moveTo(p.x, p.y);
      else ctx3D.lineTo(p.x, p.y);
    }
    ctx3D.strokeStyle = 'rgba(245, 190, 72, 0.45)';
    ctx3D.lineWidth = 2.2;
    ctx3D.stroke();

    // 360 Graduation Ticks (Astronomical precision marks)
    const tickStep = isLowPerformance ? 15 : 5;
    for (let deg = 0; deg < 360; deg += tickStep) {
      const rad = (deg * Math.PI) / 180;
      const isMajor = deg % 30 === 0;
      const isMed = deg % 10 === 0;
      const len = isMajor ? 12 : (isMed ? 7 : 4);

      const pInner = project3D(Math.cos(rad) * (ringRadius - len), 0, Math.sin(rad) * (ringRadius - len), cx, cy);
      const pOuter = project3D(Math.cos(rad) * (ringRadius + len), 0, Math.sin(rad) * (ringRadius + len), cx, cy);

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
      const pEdge = project3D(Math.cos(radBorder) * (ringRadius + 14), 0, Math.sin(radBorder) * (ringRadius + 14), cx, cy);
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
        const p = project3D(Math.cos(rad) * ringRadius, 0, Math.sin(rad) * ringRadius, cx, cy);
        if (s === 0) ctx3D.moveTo(p.x, p.y);
        else ctx3D.lineTo(p.x, p.y);
      }
      ctx3D.strokeStyle = isAspectTarget ? 'rgba(245, 190, 72, 0.95)' : rashi.element;
      ctx3D.lineWidth = isAspectTarget ? 3.8 : 1.8;
      ctx3D.stroke();

      // Rashi Label Placement
      const midRad = (midDeg * Math.PI) / 180;
      const pLabel = project3D(Math.cos(midRad) * (ringRadius + 30), 0, Math.sin(midRad) * (ringRadius + 30), cx, cy);
      if (pLabel.visible) {
        ctx3D.fillStyle = isAspectTarget ? '#ffe8a3' : rashi.element;
        ctx3D.font = `bold ${Math.max(11, 14 * pLabel.scale)}px 'Cinzel', serif`;
        ctx3D.textAlign = 'center';
        ctx3D.textBaseline = 'middle';
        ctx3D.fillText(`${rashi.symbol} ${rashi.name}`, pLabel.x, pLabel.y);
      }
    }

    // --- Central Earth (Geocentric Core with Volumetric Atmosphere) ---
    const earthProj = project3D(0, 0, 0, cx, cy);
    if (earthProj.visible) {
      const eRadius = 42 * earthProj.scale;

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
      ctx3D.ellipse(earthProj.x, earthProj.y, Math.abs(Math.sin(rot)) * eRadius, eRadius, 0, 0, Math.PI * 2);
      ctx3D.stroke();

      // Latitude parallel
      ctx3D.beginPath();
      ctx3D.ellipse(earthProj.x, earthProj.y, eRadius, eRadius * 0.35, 0, 0, Math.PI * 2);
      ctx3D.stroke();
      ctx3D.restore();

      // Label Center Earth
      ctx3D.fillStyle = '#f8fafc';
      ctx3D.font = `bold ${Math.max(11, 13 * earthProj.scale)}px 'Inter', sans-serif`;
      ctx3D.textAlign = 'center';
      ctx3D.textBaseline = 'middle';
      ctx3D.fillText('🌍 Earth', earthProj.x, earthProj.y + eRadius + 18 * earthProj.scale);
    }

    // --- Render Navagraha Bodies with Custom 3D Volumetric Shading ---
    if (activeSkyData && activeSkyData.planets) {
      const planetsList = Object.values(activeSkyData.planets);

      // Project all planets and sort by depth for correct 3D occlusion
      const projectedPlanets = planetsList.map(p => {
        const rad = (p.longitude * Math.PI) / 180;
        const wx = Math.cos(rad) * ringRadius;
        const wz = Math.sin(rad) * ringRadius;
        const proj = project3D(wx, 0, wz, cx, cy);
        return { ...p, proj, rad, wx, wz };
      }).filter(p => p.proj.visible);

      projectedPlanets.sort((a, b) => b.proj.depth - a.proj.depth);

      // 1. Draw Aspect Beams (Vedic Drishti laser threads)
      if (activeHoveredGraha) {
        const hRad = (activeHoveredGraha.longitude * Math.PI) / 180;
        const hProj = project3D(Math.cos(hRad) * ringRadius, 0, Math.sin(hRad) * ringRadius, cx, cy);

        // Aspect targets
        if (activeHoveredGraha.rashi) {
          const aspectTargets = getVedicAspects(activeHoveredGraha.name, activeHoveredGraha.rashi.index);
          aspectTargets.forEach(tgtIndex => {
            const tgtRad = ((tgtIndex * 30 + 15) * Math.PI) / 180;
            const tgtProj = project3D(Math.cos(tgtRad) * ringRadius, 0, Math.sin(tgtRad) * ringRadius, cx, cy);

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

      // 3. Render Each Graha with Volumetric Depth
      projectedPlanets.forEach(p => {
        const isHovered = activeHoveredGraha && activeHoveredGraha.name === p.name;
        const baseRadius = (p.name === 'Sun' || p.name === 'Jupiter' ? 28 : 22) * p.proj.scale;
        const radius = isHovered ? baseRadius * 1.3 : baseRadius;

        // Radial Atmospheric Corona Glow
        const haloGrad = ctx3D.createRadialGradient(p.proj.x, p.proj.y, radius * 0.5, p.proj.x, p.proj.y, radius * 2.6);
        haloGrad.addColorStop(0, p.isRetrograde ? 'rgba(244, 63, 94, 0.6)' : (p.glow || 'rgba(245, 190, 72, 0.5)'));
        haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx3D.beginPath();
        ctx3D.arc(p.proj.x, p.proj.y, radius * 2.6, 0, Math.PI * 2);
        ctx3D.fillStyle = haloGrad;
        ctx3D.fill();

        // Dynamic Vakri (Retrograde) Counter-Loop Visual Indicator
        if (p.isRetrograde && p.name !== 'Rahu' && p.name !== 'Ketu') {
          ctx3D.save();
          ctx3D.beginPath();
          const loopRadius = radius * 1.8;
          ctx3D.arc(p.proj.x, p.proj.y, loopRadius, simTime * 5.0, simTime * 5.0 + Math.PI * 1.5, true); // counter-clockwise
          ctx3D.strokeStyle = '#f43f5e';
          ctx3D.lineWidth = 2.2;
          ctx3D.stroke();

          // Retrograde particle pip
          const pipAngle = simTime * 5.0;
          const pipX = p.proj.x + Math.cos(pipAngle) * loopRadius;
          const pipY = p.proj.y - Math.sin(pipAngle) * loopRadius;
          ctx3D.beginPath();
          ctx3D.arc(pipX, pipY, 3, 0, Math.PI * 2);
          ctx3D.fillStyle = '#ffedd5';
          ctx3D.fill();
          ctx3D.restore();
        }

        // Distinct Volumetric Render by Graha Type:
        if (p.name === 'Saturn') {
          // Shani's 3D Ring System
          ctx3D.save();
          ctx3D.beginPath();
          ctx3D.ellipse(p.proj.x, p.proj.y, radius * 2.4, radius * 0.8, Math.PI / 6, 0, Math.PI * 2);
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
          sphereGrad.addColorStop(1, p.isRetrograde ? '#991b1b' : '#0f172a');

          ctx3D.beginPath();
          ctx3D.arc(p.proj.x, p.proj.y, radius, 0, Math.PI * 2);
          ctx3D.fillStyle = sphereGrad;
          ctx3D.fill();
          ctx3D.strokeStyle = isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.7)';
          ctx3D.lineWidth = isHovered ? 2.5 : 1.4;
          ctx3D.stroke();
        }

        // Draw Planetary Vedic Glyph
        ctx3D.fillStyle = p.name === 'Sun' || p.name === 'Moon' ? '#040711' : '#ffffff';
        ctx3D.font = `bold ${Math.max(12, 16 * p.proj.scale)}px 'Inter', sans-serif`;
        ctx3D.textAlign = 'center';
        ctx3D.textBaseline = 'middle';
        ctx3D.fillText(p.glyph, p.proj.x, p.proj.y);

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

          // Coordinate readout tooltip on canvas
          ctx3D.fillStyle = '#ffe8a3';
          ctx3D.font = `bold ${Math.max(11, 13 * p.proj.scale)}px 'IBM Plex Mono', monospace`;
          ctx3D.fillText(`${p.name} • ${p.longitude}°`, p.proj.x, p.proj.y - radius - 16);
        }

        // Retrograde badge indicator
        if (p.isRetrograde && p.name !== 'Rahu' && p.name !== 'Ketu') {
          ctx3D.fillStyle = '#f43f5e';
          ctx3D.font = `bold ${Math.max(9, 11 * p.proj.scale)}px 'Inter', sans-serif`;
          ctx3D.fillText('Retrograde (Rx)', p.proj.x + radius + 24, p.proj.y - 4);
        }
      });
    }

    if (!prefersReducedMotion) {
      animFrameId = requestAnimationFrame(renderDesktop3D);
    }
  }

  // --- 5. Desktop Hit-Testing & Hover Raycast ---
  if (desktopCanvas) {
    desktopCanvas.addEventListener('mousemove', (e) => {
      if (!activeSkyData || !activeSkyData.planets) return;

      const rect = desktopCanvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const mx = (e.clientX - rect.left) * dpr;
      const my = (e.clientY - rect.top) * dpr;

      const cx = width3D / 2;
      const cy = height3D / 2;

      let found = null;
      for (const p of Object.values(activeSkyData.planets)) {
        const rad = (p.longitude * Math.PI) / 180;
        const wx = Math.cos(rad) * ringRadius;
        const wz = Math.sin(rad) * ringRadius;
        const proj = project3D(wx, 0, wz, cx, cy);
        if (!proj.visible) continue;

        const baseRadius = 28 * proj.scale;
        const dx = mx - proj.x;
        const dy = my - proj.y;
        if (Math.sqrt(dx * dx + dy * dy) <= baseRadius + 18) {
          found = p;
          break;
        }
      }

      if (found !== activeHoveredGraha) {
        activeHoveredGraha = found;
        desktopCanvas.style.cursor = found ? 'pointer' : (isDragging ? 'grabbing' : 'grab');
        updateInspector(found);
        highlightLinkedWidgets(found);
      }
    });

    desktopCanvas.addEventListener('click', () => {
      if (activeHoveredGraha) {
        selectedGraha = activeHoveredGraha;
        updateInspector(selectedGraha);
        highlightLinkedWidgets(selectedGraha);
      }
    });

    desktopCanvas.addEventListener('mouseleave', () => {
      if (!isDragging) {
        activeHoveredGraha = null;
        updateInspector(selectedGraha);
        highlightLinkedWidgets(selectedGraha);
      }
    });

    // Quick-select planet by clicking badges
    document.querySelectorAll('.orbit-planet-badge').forEach(badge => {
      badge.addEventListener('click', () => {
        const pText = badge.textContent.split(' ')[0].trim();
        if (activeSkyData && activeSkyData.planets) {
          const found = Object.values(activeSkyData.planets).find(p =>
            p.name.toLowerCase() === pText.toLowerCase() ||
            (pText === 'North' && p.name === 'Rahu') ||
            (pText === 'South' && p.name === 'Ketu')
          );
          if (found) {
            selectedGraha = found;
            activeHoveredGraha = found;
            updateInspector(found);
            highlightLinkedWidgets(found);
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
        ctx2D.font = 'bold 11px sans-serif';
        ctx2D.textAlign = 'center';
        ctx2D.textBaseline = 'middle';
        ctx2D.fillText(rashi.symbol, lx, ly);
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

          ctx2D.fillStyle = '#040711';
          ctx2D.font = 'bold 11px sans-serif';
          ctx2D.textAlign = 'center';
          ctx2D.textBaseline = 'middle';
          ctx2D.fillText(p.glyph, px, py);

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

  // --- 8. Planet-to-Live-Widget Interactivity (Preserved from Phase 2) ---
  function highlightLinkedWidgets(planet) {
    document.querySelectorAll('.celestial-linked-pulse').forEach(el => {
      el.classList.remove('celestial-linked-pulse');
    });

    if (!planet || !planet.symbolLink) return;

    const targetChip = document.querySelector(`.ticker-chip[data-symbol="${planet.symbolLink}"], .instrument-card[data-symbol="${planet.symbolLink}"]`);
    if (targetChip) targetChip.classList.add('celestial-linked-pulse');

    const targetSyncCard = document.querySelector(`.sync-card[data-planet="${planet.name.toLowerCase()}"]`);
    if (targetSyncCard) targetSyncCard.classList.add('celestial-linked-pulse');
  }

  // --- 9. Load Real Data from Backend Ephemeris (Cached VedAstro Engine) ---
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

        const vBadge = document.getElementById('vedastroTelemetryBadge');
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
        generateCandleHorizon('live');
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

        // Morph 3D Financial Candlestick Horizon to Epoch Market Structure
        if (dateStr.includes('2008')) generateCandleHorizon('lehman');
        else if (dateStr.includes('2020')) generateCandleHorizon('covid');
        else if (dateStr.includes('2024')) generateCandleHorizon('election');
        else if (dateStr.includes('2021')) generateCandleHorizon('crypto');
        else generateCandleHorizon('live');

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

  // Start 3D Render Loop
  if (ctx3D) {
    renderDesktop3D();
  }
});
