/**
 * Cosmic Finance — Main Client Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Drawer Navigation Toggle (With Accessible State & Auto-Close)
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileDrawer');
  const closeBtn = document.getElementById('mobileDrawerClose');
  const overlay = document.getElementById('drawerOverlay');

  function openDrawer() {
    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('active');
      drawer.setAttribute('aria-hidden', 'false');
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('active');
      drawer.setAttribute('aria-hidden', 'true');
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  // Auto-close drawer when clicking on any navigation link inside
  if (drawer) {
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });
  }

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Automatically close mobile drawer if window resized to desktop (>1200px)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1200 && drawer && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // 2. Living Brahmand (Cosmic Galaxy) Canvas Background with Drifting Grahas & Wishing Stars
  const backdrop = document.getElementById('starsBackdrop');
  if (backdrop) {
    const canvas = document.createElement('canvas');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    backdrop.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let animId = null;
    let brahmandTime = 0;

    // A. Multi-layer Stars
    const starCount = Math.min(Math.floor(window.innerWidth / 10), 130);
    const stars = [];
    const STAR_HUES = ['rgba(255, 255, 255,', 'rgba(250, 228, 181,', 'rgba(196, 181, 253,', 'rgba(186, 230, 253,'];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.006,
        driftX: (Math.random() - 0.5) * 0.08,
        driftY: (Math.random() - 0.5) * 0.05,
        hue: STAR_HUES[Math.floor(Math.random() * STAR_HUES.length)]
      });
    }

    // B. Subtle Background Celestial Grahas (Surya, Chandra, Guru)
    const celestialGrahas = [
      { name: 'Guru', x: width * 0.82, y: height * 0.22, radius: 9, color: '#f4c95d', glow: 'rgba(244, 201, 93, 0.2)', speedX: -0.04, speedY: 0.015, hasRing: true },
      { name: 'Chandra', x: width * 0.14, y: height * 0.35, radius: 7, color: '#d9e4f5', glow: 'rgba(217, 228, 245, 0.25)', speedX: 0.03, speedY: 0.01, hasRing: false },
      { name: 'Surya', x: width * 0.52, y: height * 0.78, radius: 11, color: '#ffb347', glow: 'rgba(255, 179, 71, 0.18)', speedX: -0.02, speedY: -0.02, hasRing: false }
    ];

    // C. Wishing Stars (Shooting Stars / Falling Tara)
    const shootingStars = [];
    function spawnShootingStar() {
      if (document.hidden) return;
      shootingStars.push({
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.4,
        length: Math.random() * 110 + 70,
        speed: Math.random() * 8 + 6,
        angle: (Math.PI / 180) * (Math.random() * 15 + 20), // 20°-35° gentle wish angle
        alpha: 1,
        fade: Math.random() * 0.018 + 0.012
      });
    }

    // Schedule regular wishing stars every 5.5 to 8.5 seconds
    setInterval(() => {
      if (shootingStars.length < 2) spawnShootingStar();
    }, 6500);
    // Initial wishing star soon after load
    setTimeout(spawnShootingStar, 1200);

    // Pre-rendered offscreen nebula canvas for 60fps zero-allocation background
    const nebCanvas = document.createElement('canvas');
    nebCanvas.width = 640;
    nebCanvas.height = 360;
    const nebCtx = nebCanvas.getContext('2d');
    function updateNebulaOffscreen() {
      nebCtx.clearRect(0, 0, 640, 360);
      const g1 = nebCtx.createRadialGradient(200, 140, 10, 200, 140, 300);
      g1.addColorStop(0, 'rgba(109, 40, 217, 0.065)');
      g1.addColorStop(0.6, 'rgba(30, 27, 75, 0.028)');
      g1.addColorStop(1, 'transparent');
      nebCtx.fillStyle = g1;
      nebCtx.fillRect(0, 0, 640, 360);

      const g2 = nebCtx.createRadialGradient(480, 230, 10, 480, 230, 280);
      g2.addColorStop(0, 'rgba(212, 175, 55, 0.045)');
      g2.addColorStop(0.5, 'rgba(13, 148, 136, 0.018)');
      g2.addColorStop(1, 'transparent');
      nebCtx.fillStyle = g2;
      nebCtx.fillRect(0, 0, 640, 360);
    }
    updateNebulaOffscreen();

    function renderBrahmand() {
      brahmandTime += 0.01;
      ctx.clearRect(0, 0, width, height);

      // 1. Ethereal Nebulae Glow Clusters (GPU texture blit)
      ctx.drawImage(nebCanvas, 0, 0, width, height);

      // 2. Stars
      for (const s of stars) {
        s.alpha += s.twinkleSpeed;
        s.x += s.driftX;
        s.y += s.driftY;
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        const currentAlpha = 0.25 + 0.75 * Math.abs(Math.sin(s.alpha));
        ctx.fillStyle = `${s.hue} ${currentAlpha * 0.75})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Subtle Celestial Grahas (Planets)
      for (const g of celestialGrahas) {
        g.x += g.speedX;
        g.y += g.speedY;
        if (g.x < -40) g.x = width + 40;
        if (g.x > width + 40) g.x = -40;
        if (g.y < -40) g.y = height + 40;
        if (g.y > height + 40) g.y = -40;

        // Aura
        const auraGrad = ctx.createRadialGradient(g.x, g.y, g.radius * 0.2, g.x, g.y, g.radius * 3.2);
        auraGrad.addColorStop(0, g.glow);
        auraGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.radius * 3.2, 0, Math.PI * 2);
        ctx.fill();

        // Planet Body
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2);
        ctx.fillStyle = g.color;
        ctx.globalAlpha = 0.75;
        ctx.fill();

        // Rings (for Guru)
        if (g.hasRing) {
          ctx.beginPath();
          ctx.ellipse(g.x, g.y, g.radius * 2.2, g.radius * 0.65, Math.PI / 5, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(244, 201, 93, 0.45)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
        ctx.globalAlpha = 1.0;
      }

      // 4. Wishing Stars (Falling Tara)
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.alpha -= star.fade;

        if (star.alpha <= 0 || star.x > width || star.y > height) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = star.x - Math.cos(star.angle) * star.length;
        const tailY = star.y - Math.sin(star.angle) * star.length;

        const starGrad = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
        starGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        starGrad.addColorStop(0.7, `rgba(254, 240, 138, ${star.alpha * 0.6})`);
        starGrad.addColorStop(1, `rgba(255, 255, 255, ${star.alpha})`);

        ctx.strokeStyle = starGrad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(star.x, star.y);
        ctx.stroke();

        // Glowing Starhead
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(renderBrahmand);
    }

    renderBrahmand();

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });
  }

  // 2b. High-Performance Interactive Cosmic Star Cursor (Desktop & Pointer Devices)
  const cursorCanvas = document.getElementById('cosmicCursorCanvas');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (cursorCanvas && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    const cCtx = cursorCanvas.getContext('2d');
    let cWidth = (cursorCanvas.width = window.innerWidth);
    let cHeight = (cursorCanvas.height = window.innerHeight);

    function resizeCursorCanvas() {
      cWidth = cursorCanvas.width = window.innerWidth;
      cHeight = cursorCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCursorCanvas, { passive: true });

    let lastMouseX = -100, lastMouseY = -100;
    let livePointerX = -100, livePointerY = -100;
    let isHoveringInteractive = false;
    let pointerFade = 0;
    const particles = [];
    let isLoopRunning = false;

    // Palette of luminous cosmic star tokens (Gold, Amber, Celestial Violet, Pure White, Cyan)
    const STAR_COLORS = ['#f5be48', '#ffd572', '#a78bfa', '#c084fc', '#ffffff', '#38bdf8'];

    // Ultra-fast 4-pointed radiant sparkle star drawing
    function drawFourPointStar(ctx, cx, cy, radius, innerRadius, rotation) {
      const step = Math.PI / 4;
      let rot = (Math.PI / 2) * 3 + rotation;
      ctx.beginPath();
      ctx.moveTo(cx, cy - radius);
      for (let i = 0; i < 4; i++) {
        ctx.lineTo(cx + Math.cos(rot) * radius, cy + Math.sin(rot) * radius);
        rot += step;
        ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
        rot += step;
      }
      ctx.closePath();
    }

    let lastTarget = null;

    function spawnParticle(x, y, isBurst = false, dirX = 0, dirY = 0) {
      if (particles.length > 44) particles.splice(0, particles.length - 44);

      const angle = isBurst ? Math.random() * Math.PI * 2 : Math.atan2(dirY, dirX) + (Math.random() - 0.5) * 1.5;
      const speed = isBurst ? (Math.random() * 5.5 + 2.5) : (Math.random() * 2.2 + 0.8);
      const isStar = Math.random() > 0.3 || isBurst;
      const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];

      particles.push({
        x: x + (Math.random() - 0.5) * 4,
        y: y + (Math.random() - 0.5) * 4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.15,
        life: 1.0,
        decay: isBurst ? (Math.random() * 0.045 + 0.025) : (Math.random() * 0.052 + 0.035),
        size: isStar ? (Math.random() * 5.0 + 3.0) : (Math.random() * 2.5 + 1.0),
        innerSize: isStar ? (Math.random() * 1.6 + 0.8) : 0,
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.3,
        color: color,
        isStar: isStar
      });

      if (!isLoopRunning) {
        isLoopRunning = true;
        requestAnimationFrame(renderCursorLoop);
      }
    }

    window.addEventListener('mousemove', (e) => {
      const currentX = e.clientX;
      const currentY = e.clientY;
      livePointerX = currentX;
      livePointerY = currentY;
      pointerFade = 1.0;

      // Cached target check (Zero layout thrashing)
      if (e.target !== lastTarget) {
        lastTarget = e.target;
        isHoveringInteractive = !!(
          lastTarget && lastTarget.closest && lastTarget.closest('a, button, input, select, textarea, label, [role="button"], .btn, .ticker-chip, .orbit-planet-badge, .filter-pill, .sync-card')
        );
      }

      if (lastMouseX < 0) {
        lastMouseX = currentX;
        lastMouseY = currentY;
        spawnParticle(currentX, currentY, false, 0, 0);
        return;
      }

      const dx = currentX - lastMouseX;
      const dy = currentY - lastMouseY;
      const dist = Math.hypot(dx, dy);

      // Fast, ultra-responsive continuous path interpolation
      if (dist >= 3) {
        const steps = Math.min(5, Math.max(1, Math.floor(dist / 14)));
        for (let s = 1; s <= steps; s++) {
          const ix = lastMouseX + (dx * s) / steps;
          const iy = lastMouseY + (dy * s) / steps;
          spawnParticle(ix, iy, false, -dx, -dy);
        }
        if (isHoveringInteractive) {
          spawnParticle(currentX, currentY, false, -dx, -dy);
        }
        lastMouseX = currentX;
        lastMouseY = currentY;
      }
    }, { passive: true });

    window.addEventListener('mousedown', (e) => {
      // Celestial Starburst on click
      for (let i = 0; i < 14; i++) {
        spawnParticle(e.clientX, e.clientY, true);
      }
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      pointerFade = 0;
      lastMouseX = -100;
      lastMouseY = -100;
    });

    let cursorAnimTime = 0;

    function renderCursorLoop() {
      cCtx.clearRect(0, 0, cWidth, cHeight);
      cursorAnimTime += 0.05;

      // Hardware-accelerated additive blending
      cCtx.globalCompositeOperation = 'lighter';

      // 1. Instantaneous Glowing Pointer Tip Sparkle (Zero delay, attached to current mouse)
      if (pointerFade > 0.05 && livePointerX > 0) {
        cCtx.globalAlpha = pointerFade * 0.85;
        cCtx.fillStyle = isHoveringInteractive ? '#ffd572' : '#f5be48';
        drawFourPointStar(cCtx, livePointerX, livePointerY, 6.5, 2.0, cursorAnimTime * 2);
        cCtx.fill();

        // Inner white nucleus
        cCtx.fillStyle = '#ffffff';
        cCtx.beginPath();
        cCtx.arc(livePointerX, livePointerY, 1.8, 0, Math.PI * 2);
        cCtx.fill();

        pointerFade *= 0.94; // Gently fades when mouse stops
      }

      // 2. Trailing Stardust Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.rotation += p.vRot;
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        cCtx.globalAlpha = Math.max(0, Math.min(1, p.life));
        cCtx.fillStyle = p.color;

        if (p.isStar) {
          drawFourPointStar(cCtx, p.x, p.y, p.size * p.life, p.innerSize * p.life, p.rotation);
          cCtx.fill();
        } else {
          cCtx.beginPath();
          cCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          cCtx.fill();
        }
      }

      cCtx.globalAlpha = 1.0;
      cCtx.globalCompositeOperation = 'source-over';

      if (particles.length > 0 || pointerFade > 0.05) {
        requestAnimationFrame(renderCursorLoop);
      } else {
        isLoopRunning = false;
        cCtx.clearRect(0, 0, cWidth, cHeight);
      }
    }
  }

  // 3. Article Reactions (No Login Required)
  const reactionButtons = document.querySelectorAll('.btn-reaction');
  reactionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const countSpan = btn.querySelector('.count');
      if (countSpan && !btn.classList.contains('reacted')) {
        let current = parseInt(countSpan.textContent, 10) || 0;
        countSpan.textContent = current + 1;
        btn.classList.add('reacted');
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => btn.style.transform = '', 200);
      }
    });
  });

  // 4. Articles Listing Category Filter & Search
  const filterPills = document.querySelectorAll('.category-pills .filter-pill');
  const searchInput = document.getElementById('articleSearchInput');
  const articleCards = document.querySelectorAll('.articles-master-grid .article-card');

  if (filterPills.length > 0 && articleCards.length > 0) {
    let activeCategory = 'all';
    let searchQuery = '';

    function filterArticles() {
      articleCards.forEach(card => {
        const cardCat = (card.getAttribute('data-category') || '').toLowerCase();
        const cardTitle = (card.querySelector('.card-title') ? card.querySelector('.card-title').textContent : '').toLowerCase();
        const cardExcerpt = (card.querySelector('.card-excerpt') ? card.querySelector('.card-excerpt').textContent : '').toLowerCase();

        const matchesCat = activeCategory === 'all' || cardCat.includes(activeCategory.toLowerCase());
        const matchesSearch = !searchQuery || cardTitle.includes(searchQuery) || cardExcerpt.includes(searchQuery);

        if (matchesCat && matchesSearch) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    }

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeCategory = pill.getAttribute('data-category') || 'all';
        filterArticles();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        filterArticles();
      });
    }
  }

  // 5. Submit Article Form AJAX Handling
  const submitArticleForm = document.getElementById('submitArticleForm');
  const submitSuccessAlert = document.getElementById('submitSuccessAlert');
  if (submitArticleForm) {
    submitArticleForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const authorName = document.getElementById('authorName').value.trim();
      const authorEmail = document.getElementById('authorEmail').value.trim();
      const articleTitle = document.getElementById('articleTitle').value.trim();
      const category = document.getElementById('category').value;
      const articleExcerpt = document.getElementById('articleExcerpt').value.trim();
      const articleContent = document.getElementById('articleContent').value.trim();
      const authorBio = document.getElementById('authorBio').value.trim();

      const btnSubmit = document.getElementById('btnSubmitArticle');
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Submitting to Moderation Queue...';
      }

      try {
        const res = await fetch('/api/articles/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            authorName,
            authorEmail,
            articleTitle,
            category,
            articleExcerpt,
            articleContent,
            authorBio
          })
        });
        const data = await res.json();
        if (data.success) {
          submitArticleForm.style.display = 'none';
          if (submitSuccessAlert) submitSuccessAlert.style.display = 'block';
        } else {
          alert(data.error || 'Failed to submit article.');
          if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Submit Article For Review';
          }
        }
      } catch (err) {
        alert('Network error submitting article.');
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.textContent = 'Submit Article For Review';
        }
      }
    });
  }

  // 6. Contact Page Inquiry Form AJAX Handling
  const contactForm = document.getElementById('contactInquiryForm');
  const contactSuccessMsg = document.getElementById('contactSuccessMsg');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fullName = document.getElementById('contactName').value.trim();
      const phone = document.getElementById('contactPhone').value.trim();
      const notes = document.getElementById('contactMessage').value.trim();

      try {
        const res = await fetch('/api/leads/inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName, phone, notes })
        });
        const data = await res.json();
        if (data.success) {
          contactForm.style.display = 'none';
          if (contactSuccessMsg) contactSuccessMsg.style.display = 'block';
        } else {
          alert(data.error || 'Failed to submit inquiry.');
        }
      } catch (err) {
        alert('Network error submitting inquiry.');
      }
    });
  }

  // 7. Live Indian Standard Time (IST, UTC+5:30) & Planetary Hour Telemetry Synchronizer
  async function syncLiveIndianHora() {
    try {
      const res = await fetch('/api/hora');
      const data = await res.json();
      if (data && data.hora) {
        const h = data.hora;
        const heroName = document.getElementById('heroHoraName');
        const heroGlyph = document.getElementById('heroHoraGlyph');
        const heroRange = document.getElementById('heroHoraRange');
        const floatTitle = document.getElementById('floatingHoraTitle');
        const floatGlyph = document.getElementById('floatingHoraGlyph');
        const floatSub = document.getElementById('floatingHoraSub');

        if (heroName) heroName.textContent = h.label || `${h.planet}'s hour ${h.horaNumber || ''}`;
        if (heroGlyph) heroGlyph.textContent = h.glyph;
        if (heroRange) heroRange.innerHTML = `${h.sunrise || '06:33'} &#8599; ${h.sunset || '18:24'} &#8600; &middot; next: ${h.nextGlyph || ''} ${h.nextPlanet || ''} &middot; Mumbai (NSE/BSE), IST (UTC+5:30).`;
        
        if (floatTitle) floatTitle.textContent = h.label || `${h.planet}'s hour ${h.horaNumber || ''}`;
        if (floatGlyph) floatGlyph.textContent = h.glyph;
        if (floatSub) floatSub.innerHTML = `<span>${h.sunrise || '06:33'} &#8599; ${h.sunset || '18:24'} &#8600; next ${h.nextGlyph || ''} ${h.nextPlanet || ''} &middot; IST</span>`;

        // Dynamic Hora Palette Tinting
        const horaColors = {
          'Sun': '#f5be48',
          'Moon': '#e0f2fe',
          'Mars': '#f87171',
          'Mercury': '#34d399',
          'Jupiter': '#fbbf24',
          'Venus': '#f472b6',
          'Saturn': '#818cf8'
        };
        const activeColor = horaColors[h.planet] || '#f5be48';
        document.documentElement.style.setProperty('--current-hora-color', activeColor);
        document.body.setAttribute('data-hora-planet', h.planet);
      }
    } catch (e) {
      // Graceful fallback to static SSR
    }
  }

  function updateLiveHoraDisplays() {
    try {
      const now = new Date();
      // Strictly format to Indian Standard Time (Asia/Kolkata)
      const istTimeStr = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      const istDateStr = now.toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      
      const heroTime = document.getElementById('heroHoraTime');
      const floatClock = document.getElementById('floatingHoraClock');
      if (heroTime) {
        heroTime.textContent = `${istTimeStr} IST · ${istDateStr}`;
      }
      if (floatClock) {
        floatClock.textContent = `${istTimeStr.slice(0, 5)} IST`;
      }

      // Synchronize all instrument cards to live Indian Standard Time ticks
      document.querySelectorAll('.inst-timestamp').forEach(el => {
        el.textContent = `last updated ${istTimeStr} IST`;
      });
    } catch (e) {
      // Fallback
    }
  }

  updateLiveHoraDisplays();
  setInterval(updateLiveHoraDisplays, 1000);
  syncLiveIndianHora();
  setInterval(syncLiveIndianHora, 30000);
});
