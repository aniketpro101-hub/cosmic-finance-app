/**
 * Cosmic Finance — Celestial Effects & Luxury Micro-Interactions Engine
 * High-performance, 60fps GPU-accelerated interaction suite:
 * 1. 3D Interactive Card Tilt with Specular Gold Highlight
 * 2. Magnetic Golden Action Buttons with Proximity Spring
 * 3. Mechanical Precision Number Counters (Rolling Odometer)
 * 4. Desktop Celestial Stardust Cursor & Ambient Glow
 * 5. Interactive Kundli Bhava Drishti & House Highlighting
 *
 * Designed strictly to respect prefers-reduced-motion and mobile battery life.
 */

(function () {
  'use strict';

  // Check user motion preferences & touch capability
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = !window.matchMedia('(pointer: fine)').matches || 'ontouchstart' in window;

  /* ==============================================================
     1. 3D CARD TILT WITH SPECULAR GOLD LIGHT SHINE
     ============================================================== */
  function init3DCardTilt() {
    if (isReducedMotion || isTouchDevice) return;

    const tiltSelectors = [
      '.chronicle-card',
      '.prestige-profile-card',
      '.multi-asset-card-master',
      '.locked-specifications-card',
      '.blueprint-card',
      '.hindi-quote-card',
      '.propensity-card',
      '.pillar-card'
    ];

    const cards = document.querySelectorAll(tiltSelectors.join(', '));

    cards.forEach((card) => {
      // Create and inject specular glare overlay if not present
      if (!card.querySelector('.specular-glare')) {
        const glare = document.createElement('div');
        glare.className = 'specular-glare';
        card.appendChild(glare);
      }

      let bounds = null;
      let rafId = null;

      function onMouseEnter() {
        bounds = card.getBoundingClientRect();
        card.classList.add('is-tilting');
      }

      function onMouseMove(e) {
        if (!bounds) bounds = card.getBoundingClientRect();
        if (rafId) cancelAnimationFrame(rafId);

        rafId = requestAnimationFrame(() => {
          const mouseX = e.clientX - bounds.left;
          const mouseY = e.clientY - bounds.top;

          // Normalize -1 to +1
          const normX = (mouseX / bounds.width) * 2 - 1;
          const normY = (mouseY / bounds.height) * 2 - 1;

          // Subtle, luxurious tilt angles (max 6 degrees to avoid distortion)
          const tiltX = -normY * 5.5;
          const tiltY = normX * 5.5;

          card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(4px)`;

          // Move the specular golden glare
          const glare = card.querySelector('.specular-glare');
          if (glare) {
            const glareX = (mouseX / bounds.width) * 100;
            const glareY = (mouseY / bounds.height) * 100;
            glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(245, 190, 72, 0.18) 0%, rgba(245, 190, 72, 0.04) 40%, transparent 70%)`;
            glare.style.opacity = '1';
          }
        });
      }

      function onMouseLeave() {
        if (rafId) cancelAnimationFrame(rafId);
        card.classList.remove('is-tilting');
        card.style.transform = '';
        const glare = card.querySelector('.specular-glare');
        if (glare) glare.style.opacity = '0';
        bounds = null;
      }

      card.addEventListener('mouseenter', onMouseEnter, { passive: true });
      card.addEventListener('mousemove', onMouseMove, { passive: true });
      card.addEventListener('mouseleave', onMouseLeave, { passive: true });
    });
  }

  /* ==============================================================
     2. MAGNETIC GOLDEN ACTION BUTTONS & FLUID CTAS
     ============================================================== */
  function initMagneticButtons() {
    if (isReducedMotion || isTouchDevice) return;

    const magneticSelectors = [
      '.btn-whatsapp-prestige',
      '.btn-whatsapp-vip',
      '.compact-submit-btn',
      '.btn-header-cta',
      '.chronicle-read-btn',
      '.btn-legend-gold'
    ];

    const buttons = document.querySelectorAll(magneticSelectors.join(', '));

    buttons.forEach((btn) => {
      let rect = null;
      let rafId = null;

      btn.addEventListener('mouseenter', () => {
        rect = btn.getBoundingClientRect();
      }, { passive: true });

      btn.addEventListener('mousemove', (e) => {
        if (!rect) rect = btn.getBoundingClientRect();
        if (rafId) cancelAnimationFrame(rafId);

        rafId = requestAnimationFrame(() => {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const distanceX = e.clientX - centerX;
          const distanceY = e.clientY - centerY;

          // Subtle pull (max 8px translation)
          const pullX = distanceX * 0.22;
          const pullY = distanceY * 0.22;

          btn.style.transform = `translate(${pullX.toFixed(2)}px, ${pullY.toFixed(2)}px) scale(1.02)`;
        });
      }, { passive: true });

      btn.addEventListener('mouseleave', () => {
        if (rafId) cancelAnimationFrame(rafId);
        btn.style.transform = '';
        rect = null;
      }, { passive: true });
    });
  }

  /* ==============================================================
     3. MECHANICAL PRECISION NUMBER COUNTERS (ROLLING ODOMETER)
     ============================================================== */
  function initRollingCounters() {
    if (isReducedMotion) return;

    const counterElements = document.querySelectorAll('.prestige-stat-val, [data-counter]');

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    counterElements.forEach((el) => observer.observe(el));

    function animateCounter(el) {
      const text = el.textContent.trim();
      // Extract numeric core and non-numeric prefix/suffix (e.g., "25,000+", "20+ Yrs", "₹40,000+ Cr")
      const match = text.match(/^([^\d]*)([\d,.]+)([^\d]*)$/);
      if (!match) return;

      const prefix = match[1] || '';
      const rawNum = match[2].replace(/,/g, '');
      const suffix = match[3] || '';
      const targetVal = parseFloat(rawNum);
      if (isNaN(targetVal)) return;

      const duration = 1600; // 1.6s smooth glide
      const startTime = performance.now();
      const hasComma = match[2].includes(',');

      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Exponential ease-out for mechanical horology feel
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * targetVal);

        const formattedNum = hasComma ? currentVal.toLocaleString('en-IN') : currentVal;
        el.textContent = `${prefix}${formattedNum}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = text; // Final exact restore
        }
      }

      requestAnimationFrame(step);
    }
  }

  /* ==============================================================
     4. DESKTOP CELESTIAL STARDUST CURSOR OVERLAY
     ============================================================== */
  function initCelestialCursor() {
    const canvas = document.getElementById('cosmicCursorCanvas');
    if (!canvas || isReducedMotion || isTouchDevice) {
      if (canvas) canvas.style.display = 'none';
      return;
    }

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;
    let isHoveringInteractive = false;
    let isVisible = false;

    // Stardust trail particles
    const particles = [];
    const MAX_PARTICLES = 16;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) isVisible = true;

      // Check if hovering interactive element
      const target = e.target;
      isHoveringInteractive = !!(target && (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.chronicle-card') ||
        target.closest('.interactive-clickable') ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT'
      ));

      // Emit subtle micro star particle
      if (Math.random() < 0.4 && particles.length < MAX_PARTICLES) {
        particles.push({
          x: mouseX + (Math.random() - 0.5) * 6,
          y: mouseY + (Math.random() - 0.5) * 6,
          size: Math.random() * 2.2 + 0.8,
          alpha: 0.8,
          decay: Math.random() * 0.04 + 0.02,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8
        });
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      isVisible = false;
    });

    function renderLoop() {
      ctx.clearRect(0, 0, width, height);

      if (isVisible) {
        // Smooth lerp trailing
        cursorX += (mouseX - cursorX) * 0.28;
        cursorY += (mouseY - cursorY) * 0.28;

        // Render Stardust Trail
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.fillStyle = `rgba(245, 190, 72, ${p.alpha * 0.6})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Ambient Golden Glow (Radial Spotlight)
        const glowRadius = isHoveringInteractive ? 42 : 28;
        const grad = ctx.createRadialGradient(cursorX, cursorY, 2, cursorX, cursorY, glowRadius);
        grad.addColorStop(0, 'rgba(245, 190, 72, 0.35)');
        grad.addColorStop(0.5, 'rgba(245, 190, 72, 0.08)');
        grad.addColorStop(1, 'rgba(245, 190, 72, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cursorX, cursorY, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Core Golden Polaris Micro-Star
        ctx.save();
        ctx.translate(cursorX, cursorY);
        ctx.fillStyle = isHoveringInteractive ? '#ffd700' : '#ffffff';
        ctx.shadowColor = 'rgba(245, 190, 72, 0.9)';
        ctx.shadowBlur = isHoveringInteractive ? 12 : 6;

        const starSize = isHoveringInteractive ? 3.8 : 2.4;
        ctx.beginPath();
        ctx.arc(0, 0, starSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      requestAnimationFrame(renderLoop);
    }

    requestAnimationFrame(renderLoop);
  }

  /* ==============================================================
     5. INTERACTIVE KUNDLI BHAVA DRISHTI & HOUSE HIGHLIGHTING
     ============================================================== */
  function initKundliHouseInteractions() {
    // Map house indices to key wealth & speculation attributes
    const houseDescriptions = {
      2: { name: '2nd Bhava — Dhana (Accumulated Wealth)', color: '#f5be48' },
      5: { name: '5th Bhava — Purva Punya & Speculation', color: '#ffd700' },
      9: { name: '9th Bhava — Bhagya (Fortune & Prosperity)', color: '#34d399' },
      11: { name: '11th Bhava — Labha (Highest Financial Gains)', color: '#60a5fa' }
    };

    const pillarCards = document.querySelectorAll('.pillar-card');
    pillarCards.forEach((card, idx) => {
      // Find matching SVG House group if available
      const houseNums = [2, 5, 9, 11];
      const hNum = houseNums[idx];
      if (!hNum) return;

      card.addEventListener('mouseenter', () => {
        const svgGroup = document.getElementById(`svgHousePlanets${hNum}`);
        if (svgGroup) {
          svgGroup.classList.add('bhava-glow-active');
        }
      });

      card.addEventListener('mouseleave', () => {
        const svgGroup = document.getElementById(`svgHousePlanets${hNum}`);
        if (svgGroup) {
          svgGroup.classList.remove('bhava-glow-active');
        }
      });
    });
  }

  /* ==============================================================
     6. AMBIENT VEDIC MICRO-SOUND (SYNTHESIZED WEB AUDIO API)
     Zero audio assets — purely synthesized Tibetan singing bowl
     harmonic chimes defaulting to polite silence (opt-in toggle).
     ============================================================== */
  let audioCtx = null;
  let isSoundEnabled = false;

  function initAmbientVedicSound() {
    const toggleBtn = document.getElementById('btnSoundToggle');
    const soundIcon = document.getElementById('soundIcon');
    if (!toggleBtn) return;

    // Retrieve user preference (defaults to muted)
    isSoundEnabled = localStorage.getItem('cosmic_sound_enabled') === 'true';
    updateSoundButtonUi();

    function updateSoundButtonUi() {
      if (isSoundEnabled) {
        toggleBtn.classList.add('is-active');
        if (soundIcon) soundIcon.textContent = '🔔';
        toggleBtn.setAttribute('title', 'Vedic Harmonic Chime: Active (Click to mute)');
      } else {
        toggleBtn.classList.remove('is-active');
        if (soundIcon) soundIcon.textContent = '🔇';
        toggleBtn.setAttribute('title', 'Vedic Harmonic Chime: Muted (Click to enable)');
      }
    }

    function getAudioContext() {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          audioCtx = new AudioContextClass();
        }
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    }

    // Synthesize an authentic singing bowl tone at fundamental + harmonic overtone
    function playSingingBowlChime(freq = 432) {
      if (!isSoundEnabled || isReducedMotion) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const masterGain = ctx.createGain();
        masterGain.connect(ctx.destination);

        // Soft envelope: attack 0.04s, slow exponential decay over 1.8s
        masterGain.gain.setValueAtTime(0.0001, now);
        masterGain.gain.exponentialRampToValueAtTime(0.035, now + 0.04);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        // Fundamental oscillator (432Hz - sacred geometry tuning)
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, now);
        osc1.connect(masterGain);
        osc1.start(now);
        osc1.stop(now + 1.85);

        // 2nd harmonic overtone (slight detune for acoustic shimmer)
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 1.503, now);
        const gain2 = ctx.createGain();
        gain2.gain.value = 0.4;
        osc2.connect(gain2);
        gain2.connect(masterGain);
        osc2.start(now);
        osc2.stop(now + 1.6);

        // Deep sub-harmonic tone (216Hz)
        const osc3 = ctx.createOscillator();
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(freq * 0.5, now);
        const gain3 = ctx.createGain();
        gain3.gain.value = 0.25;
        osc3.connect(gain3);
        gain3.connect(masterGain);
        osc3.start(now);
        osc3.stop(now + 1.7);
      } catch (err) {
        // Silently catch any audio permissions block
      }
    }

    toggleBtn.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      localStorage.setItem('cosmic_sound_enabled', isSoundEnabled ? 'true' : 'false');
      updateSoundButtonUi();

      if (isSoundEnabled) {
        getAudioContext();
        playSingingBowlChime(432); // Confirmation chime
      }
    });

    // Expose chime trigger globally for chart events
    window.playCosmicChime = playSingingBowlChime;

    // Attach to Kundli interactive house pillars
    document.querySelectorAll('.pillar-card, .financial-houses-panel .pillar-row').forEach(p => {
      p.addEventListener('mouseenter', () => {
        playSingingBowlChime(528); // Miraculous 528Hz Solfeggio tone on house inspection
      });
    });

    // Attach to Kundli form submission
    const formSubmitBtn = document.getElementById('btnSubmitCoordinates');
    if (formSubmitBtn) {
      formSubmitBtn.addEventListener('click', () => {
        playSingingBowlChime(432);
      });
    }
  }

  /* ==============================================================
     INITIALIZATION ORCHESTRATION
     ============================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    init3DCardTilt();
    initMagneticButtons();
    initRollingCounters();
    initCelestialCursor();
    initKundliHouseInteractions();
    initAmbientVedicSound();
  });

})();
