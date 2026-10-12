/**
 * Cosmic Finance — Main Client Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Drawer Navigation Toggle
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileDrawer');
  const closeBtn = document.getElementById('mobileDrawerClose');
  const overlay = document.getElementById('drawerOverlay');

  function openDrawer() {
    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  // 2. Subtle Starfield Canvas Background (Lightweight)
  const backdrop = document.getElementById('starsBackdrop');
  if (backdrop) {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    backdrop.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const stars = [];
    const starCount = Math.min(Math.floor(window.innerWidth / 14), 100);

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.02 + 0.005
      });
    }

    function renderStars() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.alpha += s.speed;
        const currentAlpha = Math.abs(Math.sin(s.alpha));
        ctx.fillStyle = `rgba(200, 215, 255, ${currentAlpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(renderStars);
    }

    renderStars();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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
    let isHoveringInteractive = false;
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

    function spawnParticle(x, y, isBurst = false, dirX = 0, dirY = 0) {
      const angle = isBurst ? Math.random() * Math.PI * 2 : Math.atan2(dirY, dirX) + (Math.random() - 0.5) * 1.6;
      const speed = isBurst ? (Math.random() * 4.0 + 1.5) : (Math.random() * 1.8 + 0.4);
      const isStar = Math.random() > 0.4 || isBurst;
      const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];

      particles.push({
        x: x + (Math.random() - 0.5) * 4,
        y: y + (Math.random() - 0.5) * 4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.25,
        life: 1.0,
        decay: isBurst ? (Math.random() * 0.035 + 0.02) : (Math.random() * 0.045 + 0.025),
        size: isStar ? (Math.random() * 5.0 + 3.5) : (Math.random() * 2.5 + 1.2),
        innerSize: isStar ? (Math.random() * 1.6 + 0.8) : 0,
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.15,
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
      const dx = currentX - lastMouseX;
      const dy = currentY - lastMouseY;
      const dist = Math.hypot(dx, dy);

      // Lightweight O(1) interactive target check (No layout thrashing / No getComputedStyle)
      const target = e.target;
      isHoveringInteractive = !!(
        target && target.closest('a, button, input, select, textarea, label, [role="button"], .btn, .ticker-chip, .orbit-planet-badge, .filter-pill, .sync-card')
      );

      // Spawn smooth stardust comet sparkles when moving
      if (dist >= 4 || lastMouseX < 0) {
        const count = isHoveringInteractive ? 2 : (dist > 15 ? 2 : 1);
        for (let i = 0; i < count; i++) {
          spawnParticle(currentX, currentY, false, -dx, -dy);
        }
        lastMouseX = currentX;
        lastMouseY = currentY;
      }
    }, { passive: true });

    window.addEventListener('mousedown', (e) => {
      // Celestial Starburst on click
      for (let i = 0; i < 12; i++) {
        spawnParticle(e.clientX, e.clientY, true);
      }
    }, { passive: true });

    function renderCursorLoop() {
      cCtx.clearRect(0, 0, cWidth, cHeight);

      // Use hardware-accelerated additive blending for intense cosmic glow without GPU blur lag
      cCtx.globalCompositeOperation = 'lighter';

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.rotation += p.vRot;
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        cCtx.save();
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
        cCtx.restore();
      }

      // Reset composite operation
      cCtx.globalCompositeOperation = 'source-over';

      // Keep loop running only while particles are active (Sleep when idle to save 100% CPU/GPU)
      if (particles.length > 0) {
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
