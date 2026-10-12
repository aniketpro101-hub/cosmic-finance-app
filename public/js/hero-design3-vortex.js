/**
 * Design 3: The 4D Spacetime Helix & Vortex Engine
 * Cinematic 3D Financial Wormhole with Hyper-Space Epoch Warp Jumps
 */

(function () {
  const canvas = document.getElementById('vortexCanvas');
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

  // Camera orientation & Warp parameters
  let camZ = 0;
  let targetCamZ = 0;
  let pitch = 0.15;
  let yaw = 0.0;
  let isDragging = false;
  let startX = 0, startY = 0;
  let warpSpeed = 0;

  // Starfield warp particles
  const PARTICLES_COUNT = 90;
  const particles = [];
  for (let i = 0; i < PARTICLES_COUNT; i++) {
    particles.push({
      x: (Math.random() - 0.5) * 600,
      y: (Math.random() - 0.5) * 600,
      z: Math.random() * 1000,
      size: Math.random() * 2 + 0.5,
      color: Math.random() > 0.5 ? '#9d82f0' : '#f2c879'
    });
  }

  // Historical Market Epoch Presets
  const EPOCHS = {
    'live': { z: 0, year: '2026 TODAY', nifty: '22,514', sensex: '74,228', gold: '₹71,850', btc: '$67,820', alignment: 'Saturn in Aquarius, Jupiter in Taurus' },
    '2024': { z: 400, year: '2024 ELECTION', nifty: '21,884', sensex: '72,079', gold: '₹72,400', btc: '$68,500', alignment: 'Jupiter conjunct Uranus in Taurus' },
    '2021': { z: 800, year: '2021 CRYPTO PEAK', nifty: '18,109', sensex: '60,686', gold: '₹49,200', btc: '$69,000', alignment: 'Rahu exalted in Taurus (High Speculation)' },
    '2020': { z: 1200, year: '2020 COVID LOW', nifty: '7,610', sensex: '25,981', gold: '₹40,800', btc: '$5,800', alignment: 'Saturn-Jupiter-Ketu in Sagittarius' },
    '2008': { z: 1600, year: '2008 LEHMAN CRASH', nifty: '4,038', sensex: '13,531', gold: '₹13,150', btc: '$0.00', alignment: 'Saturn in Leo opposition Rahu in Aquarius' }
  };

  // Setup Warp buttons
  document.querySelectorAll('.warp-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.warp-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const epochKey = btn.getAttribute('data-epoch');
      const epoch = EPOCHS[epochKey];
      if (epoch) {
        targetCamZ = epoch.z;
        warpSpeed = 25; // Trigger hyper-space blur
        updateHud(epoch);
      }
    });
  });

  function updateHud(epoch) {
    const epochEl = document.getElementById('warpHudEpoch');
    const niftyEl = document.getElementById('warpHudNifty');
    const goldEl = document.getElementById('warpHudGold');
    const alignEl = document.getElementById('warpHudAlign');

    if (epochEl) epochEl.textContent = epoch.year;
    if (niftyEl) niftyEl.textContent = epoch.nifty;
    if (goldEl) goldEl.textContent = epoch.gold;
    if (alignEl) alignEl.textContent = epoch.alignment;
  }

  // Mouse drag controls
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    yaw += (e.clientX - startX) * 0.003;
    pitch = Math.max(-0.6, Math.min(0.6, pitch + (e.clientY - startY) * 0.003));
    startX = e.clientX;
    startY = e.clientY;
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  // 3D Perspective Projection for Vortex
  function projectVortex(x, y, z, cx, cy) {
    const relZ = z - camZ;
    if (relZ <= 5) return null; // Behind camera

    // Rotate
    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);
    const x1 = x * cosY - relZ * sinY;
    const z1 = x * sinY + relZ * cosY;

    const cosP = Math.cos(pitch);
    const sinP = Math.sin(pitch);
    const y1 = y * cosP - z1 * sinP;
    const z2 = y * sinP + z1 * cosP;

    if (z2 <= 10) return null;

    const fov = 420;
    const scale = fov / z2;

    return {
      x: cx + x1 * scale,
      y: cy + y1 * scale,
      scale: scale,
      z: z2
    };
  }

  // Animation Loop
  function render() {
    // Smooth camera warp interpolation
    camZ += (targetCamZ - camZ) * 0.06;
    warpSpeed *= 0.92;

    ctx.fillStyle = '#020308';
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    // 1. Draw Warp Starfield Particles
    particles.forEach(p => {
      p.z -= 4 + warpSpeed;
      if (p.z <= 0) p.z += 1000;

      const pt = projectVortex(p.x, p.y, p.z + camZ, cx, cy);
      if (pt) {
        ctx.beginPath();
        const rad = Math.max(1, p.size * pt.scale);
        ctx.arc(pt.x, pt.y, rad, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Warp Streak
        if (warpSpeed > 5) {
          ctx.beginPath();
          ctx.strokeStyle = p.color + '66';
          ctx.lineWidth = rad;
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(pt.x, pt.y - warpSpeed * pt.scale * 2);
          ctx.stroke();
        }
      }
    });

    // 2. Draw 3D Spacetime Cylindrical Rings (Tunnel Segments)
    const ringSpacing = 120;
    const totalRings = 16;
    const tunnelR = 190;

    for (let rIdx = 0; rIdx < totalRings; rIdx++) {
      const ringZ = Math.floor(camZ / ringSpacing) * ringSpacing + (rIdx * ringSpacing);
      const ringOpacity = Math.max(0, 1 - ((ringZ - camZ) / 1800));

      ctx.beginPath();
      ctx.strokeStyle = `rgba(157, 130, 240, ${0.35 * ringOpacity})`;
      ctx.lineWidth = 1.2;

      const segs = 32;
      let firstPt = null;
      for (let s = 0; s <= segs; s++) {
        const theta = (s / segs) * Math.PI * 2;
        const x = tunnelR * Math.cos(theta);
        const y = tunnelR * Math.sin(theta);

        const pt = projectVortex(x, y, ringZ, cx, cy);
        if (pt) {
          if (!firstPt) {
            firstPt = pt;
            ctx.moveTo(pt.x, pt.y);
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
      }
      ctx.stroke();

      // Epoch Milestone Markers in the tunnel
      Object.values(EPOCHS).forEach(ep => {
        if (Math.abs(ringZ - ep.z) < ringSpacing / 2) {
          const ptTop = projectVortex(0, -tunnelR - 15, ringZ, cx, cy);
          if (ptTop) {
            ctx.font = '700 11px "Space Grotesk", sans-serif';
            ctx.fillStyle = '#f2c879';
            ctx.textAlign = 'center';
            ctx.fillText(`⚡ ${ep.year}`, ptTop.x, ptTop.y);
          }
        }
      });
    }

    // 3. Draw 3D Helix Financial Spiral Ribbon
    const helixPoints = 120;
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(242, 200, 121, 0.75)';
    ctx.lineWidth = 2.5;

    let started = false;
    for (let i = 0; i < helixPoints; i++) {
      const theta = (i * 0.25);
      const hz = camZ + (i * 18);
      const hx = (tunnelR * 0.75) * Math.cos(theta);
      const hy = (tunnelR * 0.75) * Math.sin(theta);

      const pt = projectVortex(hx, hy, hz, cx, cy);
      if (pt) {
        if (!started) {
          ctx.moveTo(pt.x, pt.y);
          started = true;
        } else {
          ctx.lineTo(pt.x, pt.y);
        }

        // Draw Candlestick Bars along the Helix
        if (i % 3 === 0) {
          const isBull = (i % 2 === 0);
          ctx.save();
          ctx.fillStyle = isBull ? '#63d9a5' : '#e87b8c';
          const barH = 12 * pt.scale;
          ctx.fillRect(pt.x - 2, pt.y - barH / 2, 4, barH);
          ctx.restore();
        }
      }
    }
    ctx.stroke();

    // 4. Draw Orbiting Navagrahas at current camera focal depth
    const planetsAtFocal = [
      { name: 'Sun', glyph: '☉', color: '#ffd572', angle: Date.now() * 0.0008 + 0 },
      { name: 'Moon', glyph: '☽', color: '#e2e8f0', angle: Date.now() * 0.0035 + 1.2 },
      { name: 'Jupiter', glyph: '♃', color: '#fcd34d', angle: Date.now() * 0.0004 + 2.5 },
      { name: 'Saturn', glyph: '♄', color: '#c084fc', angle: Date.now() * 0.0002 + 4.1 },
      { name: 'Mars', glyph: '♂', color: '#f87171', angle: Date.now() * 0.0006 + 5.2 }
    ];

    planetsAtFocal.forEach(p => {
      const px = (tunnelR * 0.6) * Math.cos(p.angle);
      const py = (tunnelR * 0.6) * Math.sin(p.angle);
      const pt = projectVortex(px, py, camZ + 160, cx, cy);
      if (pt) {
        const rad = Math.max(5, 8 * pt.scale);

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, rad * 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color + '44';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, rad, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.font = '700 11px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(p.glyph, pt.x, pt.y - rad - 4);
      }
    });

    requestAnimationFrame(render);
  }

  render();
})();
