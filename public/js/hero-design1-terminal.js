/**
 * Design 1: The Cyber-Observatory Terminal Engine
 * Holographic 3D Aspect Radar with laser aspect raycasting and multi-instrument telemetry
 */

(function () {
  const canvas = document.getElementById('terminalRadarCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement.clientWidth || 600);
  let height = (canvas.height = canvas.parentElement.clientHeight || 480);

  function resize() {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.clientWidth || 600;
    height = canvas.height = canvas.parentElement.clientHeight || 480;
  }
  window.addEventListener('resize', resize, { passive: true });

  // Camera orientation
  let pitch = 0.58; // Isometric tilt
  let yaw = 0.2;
  let isDragging = false;
  let startX = 0, startY = 0;
  let showAspectRays = true;
  let showRadarSweep = true;
  let sweepAngle = 0;

  // The 9 Navagrahas with actual sidereal longitudes and colors
  const PLANETS = [
    { name: 'Sun', vedic: 'Surya', glyph: '☉', color: '#ffd572', r: 90, speed: 0.009, angle: 4.46, asset: 'SENSEX' },
    { name: 'Moon', vedic: 'Chandra', glyph: '☽', color: '#e2e8f0', r: 55, speed: 0.045, angle: 3.30, asset: 'NIFTY' },
    { name: 'Mars', vedic: 'Mangal', glyph: '♂', color: '#f87171', r: 125, speed: 0.006, angle: 5.29, asset: 'BANKNIFTY' },
    { name: 'Mercury', vedic: 'Budha', glyph: '☿', color: '#6ee7b7', r: 75, speed: 0.015, angle: 4.31, asset: 'NIFTY IT' },
    { name: 'Jupiter', vedic: 'Guru', glyph: '♃', color: '#fcd34d', r: 160, speed: 0.003, angle: 0.02, asset: 'GOLD' },
    { name: 'Venus', vedic: 'Shukra', glyph: '♀', color: '#f5be48', r: 105, speed: 0.012, angle: 3.78, asset: 'AUTO' },
    { name: 'Saturn', vedic: 'Shani', glyph: '♄', color: '#c084fc', r: 195, speed: 0.0015, angle: 0.28, asset: 'ENERGY' },
    { name: 'Rahu', vedic: 'Rahu', glyph: '☊', color: '#818cf8', r: 140, speed: -0.002, angle: 1.76, asset: 'BTC' },
    { name: 'Ketu', vedic: 'Ketu', glyph: '☋', color: '#fb7185', r: 140, speed: -0.002, angle: 4.90, asset: 'HEDGES' }
  ];

  // Mouse interaction
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    yaw += dx * 0.005;
    pitch = Math.max(0.15, Math.min(1.2, pitch + dy * 0.005));
    startX = e.clientX;
    startY = e.clientY;
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

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
    yaw += dx * 0.005;
    pitch = Math.max(0.15, Math.min(1.2, pitch + dy * 0.005));
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  canvas.addEventListener('touchend', () => { isDragging = false; });

  // UI buttons
  const btnAspect = document.getElementById('btnTerminalAspects');
  if (btnAspect) {
    btnAspect.addEventListener('click', () => {
      showAspectRays = !showAspectRays;
      btnAspect.classList.toggle('active', showAspectRays);
    });
  }

  const btnSweep = document.getElementById('btnTerminalSweep');
  if (btnSweep) {
    btnSweep.addEventListener('click', () => {
      showRadarSweep = !showRadarSweep;
      btnSweep.classList.toggle('active', showRadarSweep);
    });
  }

  // 3D Isometric Projection Helper
  function project3D(x, y, z, cx, cy) {
    // Rotate around Y axis (yaw)
    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);
    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;

    // Pitch tilt
    const cosP = Math.cos(pitch);
    const sinP = Math.sin(pitch);
    const y2 = y * cosP - z1 * sinP;
    const z2 = y * sinP + z1 * cosP;

    // Perspective factor
    const fov = 480;
    const scale = fov / (fov + z2 * 0.6);

    return {
      x: cx + x1 * scale,
      y: cy + y2 * scale,
      scale: scale,
      z: z2
    };
  }

  // Animation Loop
  function render() {
    ctx.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;

    // 1. Draw 3D Isometric Cyber-Grid Floor
    ctx.strokeStyle = 'rgba(110, 231, 183, 0.06)';
    ctx.lineWidth = 1;
    const gridSize = 240;
    const step = 40;

    for (let x = -gridSize; x <= gridSize; x += step) {
      const p1 = project3D(x, 20, -gridSize, cx, cy);
      const p2 = project3D(x, 20, gridSize, cx, cy);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    for (let z = -gridSize; z <= gridSize; z += step) {
      const p1 = project3D(-gridSize, 20, z, cx, cy);
      const p2 = project3D(gridSize, 20, z, cx, cy);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    // 2. Concentric Orbital Rings
    const ringRadii = [55, 75, 90, 105, 125, 140, 160, 195];
    ringRadii.forEach((r, idx) => {
      ctx.beginPath();
      ctx.strokeStyle = idx % 2 === 0 ? 'rgba(110, 231, 183, 0.18)' : 'rgba(157, 130, 240, 0.14)';
      ctx.lineWidth = 1;
      const segments = 48;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const pt = project3D(r * Math.cos(theta), 0, r * Math.sin(theta), cx, cy);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    });

    // 3. Radar Sweep Line
    if (showRadarSweep) {
      sweepAngle += 0.02;
      const maxR = 210;
      const sweepEnd = project3D(maxR * Math.cos(sweepAngle), 0, maxR * Math.sin(sweepAngle), cx, cy);
      const centerPt = project3D(0, 0, 0, cx, cy);

      const grad = ctx.createLinearGradient(centerPt.x, centerPt.y, sweepEnd.x, sweepEnd.y);
      grad.addColorStop(0, 'rgba(110, 231, 183, 0.8)');
      grad.addColorStop(1, 'rgba(110, 231, 183, 0.0)');

      ctx.beginPath();
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.moveTo(centerPt.x, centerPt.y);
      ctx.lineTo(sweepEnd.x, sweepEnd.y);
      ctx.stroke();
    }

    // 4. Update Planet Positions & Project
    const projectedPlanets = PLANETS.map(p => {
      p.angle += p.speed;
      const x = p.r * Math.cos(p.angle);
      const z = p.r * Math.sin(p.angle);
      const proj = project3D(x, 0, z, cx, cy);
      return { ...p, px: proj.x, py: proj.y, pScale: proj.scale, z: proj.z };
    });

    // Sort by depth (Z-buffer)
    projectedPlanets.sort((a, b) => b.z - a.z);

    // 5. Draw Laser Aspect Rays between planets
    if (showAspectRays) {
      for (let i = 0; i < projectedPlanets.length; i++) {
        for (let j = i + 1; j < projectedPlanets.length; j++) {
          const p1 = projectedPlanets[i];
          const p2 = projectedPlanets[j];

          // Calculate angular separation in degrees
          let diff = Math.abs((p1.angle - p2.angle) * (180 / Math.PI)) % 360;
          if (diff > 180) diff = 360 - diff;

          let aspectType = null;
          let aspectColor = null;

          if (Math.abs(diff - 120) < 14) {
            aspectType = 'Trine';
            aspectColor = 'rgba(110, 231, 183, 0.45)'; // Luminous Emerald
          } else if (Math.abs(diff - 90) < 10) {
            aspectType = 'Square';
            aspectColor = 'rgba(248, 113, 113, 0.45)'; // Crimson
          } else if (Math.abs(diff - 180) < 12) {
            aspectType = 'Opposition';
            aspectColor = 'rgba(242, 200, 121, 0.5)'; // Sun Gold
          } else if (diff < 15) {
            aspectType = 'Conjunction';
            aspectColor = 'rgba(129, 140, 248, 0.55)'; // Cyan
          }

          if (aspectType) {
            ctx.beginPath();
            ctx.strokeStyle = aspectColor;
            ctx.lineWidth = 1.5;
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();

            // Laser pulse bead traveling along the ray
            const tBead = (Date.now() * 0.001 + i) % 1;
            const bx = p1.px + (p2.px - p1.px) * tBead;
            const by = p1.py + (p2.py - p1.py) * tBead;
            ctx.beginPath();
            ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
          }
        }
      }
    }

    // 6. Draw Center Earth / Dalal Street Core
    const earthPt = project3D(0, 0, 0, cx, cy);
    const coreGrad = ctx.createRadialGradient(earthPt.x, earthPt.y, 2, earthPt.x, earthPt.y, 16);
    coreGrad.addColorStop(0, '#ffd572');
    coreGrad.addColorStop(0.6, 'rgba(242, 200, 121, 0.3)');
    coreGrad.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.arc(earthPt.x, earthPt.y, 14, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(earthPt.x, earthPt.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.font = '600 9px "IBM Plex Mono", monospace';
    ctx.fillStyle = '#ffd572';
    ctx.textAlign = 'center';
    ctx.fillText('DALAL ST (IST)', earthPt.x, earthPt.y + 24);

    // 7. Draw Planets with Glowing Halos & Glyphs
    projectedPlanets.forEach(p => {
      const radius = Math.max(5, 7.5 * p.pScale);

      // Glow halo
      const halo = ctx.createRadialGradient(p.px, p.py, 1, p.px, p.py, radius * 2.8);
      halo.addColorStop(0, p.color);
      halo.addColorStop(0.5, p.color + '44');
      halo.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(p.px, p.py, radius * 2.8, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();

      // Planet body
      ctx.beginPath();
      ctx.arc(p.px, p.py, radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Glyph & Label
      ctx.font = '700 11px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(p.glyph, p.px, p.py - radius - 5);

      ctx.font = '500 9px "IBM Plex Mono", monospace';
      ctx.fillStyle = 'rgba(236, 235, 244, 0.85)';
      ctx.fillText(p.name, p.px, p.py + radius + 11);
    });

    requestAnimationFrame(render);
  }

  render();
})();
