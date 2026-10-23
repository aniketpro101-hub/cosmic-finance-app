/**
 * Cosmic Finance — Gann's Square of 9 & Sarvatobhadra Chakra Interactive Engine
 * High-performance 60fps canvas & raycast tracking with bilingual Hindi & English display.
 */

(function () {
  'use strict';

  // --- 1. Global State & Bilingual Lexicon ---
  let currentLang = localStorage.getItem('cosmic_gann_lang') || 'en';

  const I18N = {
    en: {
      gannTitle: "W.D. Gann's Square of 9 Wheel",
      gannSubtitle: "Price-Time Square Root Harmonic Matrix",
      sbcTitle: "Vedic Sarvatobhadra Chakra",
      sbcSubtitle: "81-Kostha Geocentric Vedha Raycast Matrix",
      cardinalCross: "Cardinal Cross (0°, 90°, 180°, 270°)",
      ordinalCross: "Ordinal Cross (45°, 135°, 225°, 315°)",
      trineAngles: "Trine Harmony (120°, 240°)",
      centerPoint: "Central Hub (Root 1)",
      hoverAngle: "Harmonic Ray Angle",
      vedhaActive: "Active Vedha Laser Piercing",
      sammukha: "Sammukha Vedha (Direct / Frontal)",
      vama: "Vama Vedha (Left Diagonal)",
      dakshina: "Dakshina Vedha (Right Diagonal)",
      kona: "Kona Vedha (Corner Ray)",
      beneficImpact: "Benefic Expansion / Bullish Breakout Potential",
      maleficImpact: "Malefic Pressure / Sudden Volatility & Drawdown Caution",
      calcFormula: "Formula: P = (√Price ± Deg/180)²",
      niftyRef: "NIFTY 50 Live Reference",
      supportLevel: "Support Angle",
      resistanceLevel: "Resistance Angle"
    },
    hi: {
      gannTitle: "डब्लू.डी. गैन का स्क्वायर ऑफ़ 9 चक्र",
      gannSubtitle: "मूल्य-समय वर्गमूल चक्रीय ज्यामिति (हार्मोनिक मैट्रिक्स)",
      sbcTitle: "वैदिक सर्वतोभद्र चक्र (८१ कोष्ठ)",
      sbcSubtitle: "अष्टाविंशति (२८) नक्षत्र वेध संधान एवं बाजार प्रभाव",
      cardinalCross: "कार्डिनल क्रॉस (०°, ९०°, १८०°, २७०° - मुख्य मोड़)",
      ordinalCross: "ऑर्डिनल क्रॉस (४५°, १३५°, २२५°, ३१५° - मध्यम मोड़)",
      trineAngles: "त्रिकोण सामंजस्य (१२०°, २४०° - त्रि-आयामी लय)",
      centerPoint: "केंद्र बिंदु (मूल इकाई १)",
      hoverAngle: "सक्रिय हार्मोनिक कोण",
      vedhaActive: "सक्रिय ग्रह वेध किरण संधान",
      sammukha: "सम्मुख वेध (सीधी अग्रगामी वेध किरण)",
      vama: "वाम वेध (बाईं ओर तिरछी वेध किरण)",
      dakshina: "दक्षिण वेध (दाईं ओर तिरछी वेध किरण)",
      kona: "कोण वेध (चतुष्कोण संधान)",
      beneficImpact: "शुभ वेध: मूल्य विस्तार, तेजी एवं संस्थागत खरीदारी के संकेत",
      maleficImpact: "अशुभ वेध: तीव्र अस्थिरता, दबाव एवं मुनाफावसूली की चेतावनी",
      calcFormula: "गणितीय सूत्र: P = (√मूल्य ± कोण/१८०)²",
      niftyRef: "निफ्टी ५० संदर्भ मूल्य",
      supportLevel: "समर्थन स्तर (सपोर्ट)",
      resistanceLevel: "प्रतिरोध स्तर (रेजिस्टेंस)"
    }
  };

  // --- 2. Gann Square of 9 Mathematical Generator ---
  // Generates 9x9 spiral numbers (81 cells) moving counter-clockwise from center
  function generateSquareOf9Spiral(size = 9) {
    const grid = Array.from({ length: size }, () => Array(size).fill(0));
    let x = Math.floor(size / 2);
    let y = Math.floor(size / 2);
    let val = 1;
    grid[y][x] = val++;

    let step = 1;
    while (val <= size * size) {
      // Move East (Right)
      for (let i = 0; i < step && val <= size * size; i++) {
        x++;
        if (x < size) grid[y][x] = val++;
      }
      // Move North (Up)
      for (let i = 0; i < step && val <= size * size; i++) {
        y--;
        if (y >= 0) grid[y][x] = val++;
      }
      step++;
      // Move West (Left)
      for (let i = 0; i < step && val <= size * size; i++) {
        x--;
        if (x >= 0) grid[y][x] = val++;
      }
      // Move South (Down)
      for (let i = 0; i < step && val <= size * size; i++) {
        y++;
        if (y < size) grid[y][x] = val++;
      }
      step++;
    }
    return grid;
  }

  // Calculate angle of cell (x, y) relative to center in degrees [0, 360)
  function getCellAngle(x, y, size = 9) {
    const cx = Math.floor(size / 2);
    const cy = Math.floor(size / 2);
    const dx = x - cx;
    const dy = cy - y; // Screen Y is inverted, so up is positive
    if (dx === 0 && dy === 0) return 0;
    let rad = Math.atan2(dy, dx);
    let deg = (rad * 180) / Math.PI;
    if (deg < 0) deg += 360;
    return Math.round(deg);
  }

  // Calculate Gann Price Target based on Square Root of base price
  // P = (sqrt(base) + deg / 180)^2
  function calculateGannTarget(basePrice, deg) {
    const root = Math.sqrt(Math.max(1, basePrice));
    const factor = deg / 180;
    const target = Math.pow(root + factor, 2);
    return Math.round(target * 100) / 100;
  }

  // --- 3. Sarvatobhadra Chakra 9x9 Classical Blueprint ---
  // The 28 Nakshatras along perimeter (in classic clockwise order starting from Krittika in East)
  const SBC_NAKSHATRAS = [
    // Top Row (East: Left to Right)
    { name: 'Krittika', hi: 'कृत्तिका', ruler: 'Sun', lordHi: 'सूर्य', col: 1, row: 0 },
    { name: 'Rohini', hi: 'रोहिणी', ruler: 'Moon', lordHi: 'चन्द्र', col: 2, row: 0 },
    { name: 'Mrigashira', hi: 'मृगशिरा', ruler: 'Mars', lordHi: 'मंगल', col: 3, row: 0 },
    { name: 'Ardra', hi: 'आर्द्रा', ruler: 'Rahu', lordHi: 'राहु', col: 4, row: 0 },
    { name: 'Punarvasu', hi: 'पुनर्वसु', ruler: 'Jupiter', lordHi: 'गुरु', col: 5, row: 0 },
    { name: 'Pushya', hi: 'पुष्य', ruler: 'Saturn', lordHi: 'शनि', col: 6, row: 0 },
    { name: 'Ashlesha', hi: 'आश्लेषा', ruler: 'Mercury', lordHi: 'बुध', col: 7, row: 0 },

    // Right Column (South: Top to Bottom)
    { name: 'Magha', hi: 'मघा', ruler: 'Ketu', lordHi: 'केतु', col: 8, row: 1 },
    { name: 'P.Phalguni', hi: 'पू.फाल्गुनी', ruler: 'Venus', lordHi: 'शुक्र', col: 8, row: 2 },
    { name: 'U.Phalguni', hi: 'उ.फाल्गुनी', ruler: 'Sun', lordHi: 'सूर्य', col: 8, row: 3 },
    { name: 'Hasta', hi: 'हस्त', ruler: 'Moon', lordHi: 'चन्द्र', col: 8, row: 4 },
    { name: 'Chitra', hi: 'चित्रा', ruler: 'Mars', lordHi: 'मंगल', col: 8, row: 5 },
    { name: 'Swati', hi: 'स्वाती', ruler: 'Rahu', lordHi: 'राहु', col: 8, row: 6 },
    { name: 'Vishakha', hi: 'विशाखा', ruler: 'Jupiter', lordHi: 'गुरु', col: 8, row: 7 },

    // Bottom Row (West: Right to Left)
    { name: 'Anuradha', hi: 'अनुराधा', ruler: 'Saturn', lordHi: 'शनि', col: 7, row: 8 },
    { name: 'Jyeshtha', hi: 'ज्येष्ठा', ruler: 'Mercury', lordHi: 'बुध', col: 6, row: 8 },
    { name: 'Mula', hi: 'मूल', ruler: 'Ketu', lordHi: 'केतु', col: 5, row: 8 },
    { name: 'P.Ashadha', hi: 'पूर्वाषाढ़ा', ruler: 'Venus', lordHi: 'शुक्र', col: 4, row: 8 },
    { name: 'U.Ashadha', hi: 'उत्तराषाढ़ा', ruler: 'Sun', lordHi: 'सूर्य', col: 3, row: 8 },
    { name: 'Abhijit', hi: 'अभिजित्', ruler: 'Brahma', lordHi: 'ब्रह्मा', col: 2, row: 8 },
    { name: 'Shravana', hi: 'श्रवण', ruler: 'Moon', lordHi: 'चन्द्र', col: 1, row: 8 },

    // Left Column (North: Bottom to Top)
    { name: 'Dhanishta', hi: 'धनिष्ठा', ruler: 'Mars', lordHi: 'मंगल', col: 0, row: 7 },
    { name: 'Shatabhisha', hi: 'शतभिषा', ruler: 'Rahu', lordHi: 'राहु', col: 0, row: 6 },
    { name: 'P.Bhadra', hi: 'पू.भाद्रपद', ruler: 'Jupiter', lordHi: 'गुरु', col: 0, row: 5 },
    { name: 'U.Bhadra', hi: 'उ.भाद्रपद', ruler: 'Saturn', lordHi: 'शनि', col: 0, row: 4 },
    { name: 'Revati', hi: 'रेवती', ruler: 'Mercury', lordHi: 'बुध', col: 0, row: 3 },
    { name: 'Ashwini', hi: 'अश्विनी', ruler: 'Ketu', lordHi: 'केतु', col: 0, row: 2 },
    { name: 'Bharani', hi: 'भरणी', ruler: 'Venus', lordHi: 'शुक्र', col: 0, row: 1 }
  ];

  // 4 Corner Vowels (Swaras)
  const SBC_CORNERS = [
    { name: 'A (अ)', hi: 'अ', corner: 'NE', col: 0, row: 0 },
    { name: 'AA (आ)', hi: 'आ', corner: 'SE', col: 8, row: 0 },
    { name: 'I (इ)', hi: 'इ', corner: 'SW', col: 8, row: 8 },
    { name: 'EE (ई)', hi: 'ई', corner: 'NW', col: 0, row: 8 }
  ];

  // Inner matrix cells (Varnas, Rashis, Swaras, Tithis)
  const SBC_INNER_CONTENT = {
    '1,1': { label: 'क', en: 'Ka', type: 'varna' },
    '2,1': { label: 'अ', en: 'A', type: 'swara' },
    '3,1': { label: 'मेष', en: 'Aries', type: 'rashi' },
    '4,1': { label: 'नन्दा', en: 'Nanda', type: 'tithi' },
    '5,1': { label: 'वृषभ', en: 'Taurus', type: 'rashi' },
    '6,1': { label: 'इ', en: 'I', type: 'swara' },
    '7,1': { label: 'ख', en: 'Kha', type: 'varna' },

    '1,2': { label: 'उ', en: 'U', type: 'swara' },
    '2,2': { label: 'ग', en: 'Ga', type: 'varna' },
    '3,2': { label: 'घ', en: 'Gha', type: 'varna' },
    '4,2': { label: 'भद्रा', en: 'Bhadra', type: 'tithi' },
    '5,2': { label: 'ङ', en: 'Nga', type: 'varna' },
    '6,2': { label: 'च', en: 'Cha', type: 'varna' },
    '7,2': { label: 'ऊ', en: 'OO', type: 'swara' },

    '1,3': { label: 'मीन', en: 'Pisces', type: 'rashi' },
    '2,3': { label: 'छ', en: 'Chha', type: 'varna' },
    '3,3': { label: 'ऋ', en: 'Ri', type: 'swara' },
    '4,3': { label: 'जया', en: 'Jaya', type: 'tithi' },
    '5,3': { label: 'ॠ', en: 'Ree', type: 'swara' },
    '6,3': { label: 'ज', en: 'Ja', type: 'varna' },
    '7,3': { label: 'मिथुन', en: 'Gemini', type: 'rashi' },

    '1,4': { label: 'रिक्ता', en: 'Rikta', type: 'tithi' },
    '2,4': { label: 'झ', en: 'Jha', type: 'varna' },
    '3,4': { label: 'ऌ', en: 'Lri', type: 'swara' },
    '4,4': { label: '★ केन्द्र', en: '★ BINDUS', type: 'center' },
    '5,4': { label: 'ॡ', en: 'Lree', type: 'swara' },
    '6,4': { label: 'ञ', en: 'Nya', type: 'varna' },
    '7,4': { label: 'पूर्णा', en: 'Poorna', type: 'tithi' },

    '1,5': { label: 'कुम्भ', en: 'Aquarius', type: 'rashi' },
    '2,5': { label: 'ट', en: 'Ta', type: 'varna' },
    '3,5': { label: 'ए', en: 'E', type: 'swara' },
    '4,5': { label: 'नन्दा', en: 'Nanda', type: 'tithi' },
    '5,5': { label: 'ऐ', en: 'Ai', type: 'swara' },
    '6,5': { label: 'ठ', en: 'Tha', type: 'varna' },
    '7,5': { label: 'कर्क', en: 'Cancer', type: 'rashi' },

    '1,6': { label: 'ओ', en: 'O', type: 'swara' },
    '2,6': { label: 'ड', en: 'Da', type: 'varna' },
    '3,6': { label: 'ढ', en: 'Dha', type: 'varna' },
    '4,6': { label: 'भद्रा', en: 'Bhadra', type: 'tithi' },
    '5,6': { label: 'ण', en: 'Na', type: 'varna' },
    '6,6': { label: 'त', en: 'Ta', type: 'varna' },
    '7,6': { label: 'औ', en: 'Au', type: 'swara' },

    '1,7': { label: 'थ', en: 'Tha', type: 'varna' },
    '2,7': { label: 'अं', en: 'Am', type: 'swara' },
    '3,7': { label: 'मकर', en: 'Capricorn', type: 'rashi' },
    '4,7': { label: 'जया', en: 'Jaya', type: 'tithi' },
    '5,7': { label: 'धनु', en: 'Sagittarius', type: 'rashi' },
    '6,7': { label: 'अः', en: 'Ah', type: 'swara' },
    '7,7': { label: 'द', en: 'Da', type: 'varna' }
  };

  // Real-time Navagraha placement in Sarvatobhadra Chakra
  const SBC_PLANETS = [
    { name: 'Sun', hi: 'सूर्य', glyph: '☉', nakshatra: 'Revati', color: '#ffb347', nature: 'Malefic' },
    { name: 'Moon', hi: 'चन्द्र', glyph: '☽', nakshatra: 'Punarvasu', color: '#d9e4f5', nature: 'Benefic' },
    { name: 'Mars', hi: 'मंगल', glyph: '♂', nakshatra: 'Pushya', color: '#ff5c5c', nature: 'Malefic' },
    { name: 'Mercury', hi: 'बुध', glyph: '☿', nakshatra: 'Revati', color: '#5ce6c0', nature: 'Benefic' },
    { name: 'Jupiter', hi: 'गुरु', glyph: '♃', nakshatra: 'Rohini', color: '#f4c95d', nature: 'Benefic' },
    { name: 'Venus', hi: 'शुक्र', glyph: '♀', nakshatra: 'Bharani', color: '#ffd6e8', nature: 'Benefic' },
    { name: 'Saturn', hi: 'शनि', glyph: '♄', nakshatra: 'U.Bhadra', color: '#a4b4f0', nature: 'Malefic' },
    { name: 'Rahu', hi: 'राहु', glyph: '☊', nakshatra: 'U.Bhadra', color: '#c084fc', nature: 'Malefic' },
    { name: 'Ketu', hi: 'केतु', glyph: '☋', nakshatra: 'Hasta', color: '#fb923c', nature: 'Malefic' }
  ];

  function normalizeNakName(name) {
    if (!name) return '';
    return name.toLowerCase()
      .replace(/^purva\s+/i, 'p.')
      .replace(/^uttara\s+/i, 'u.')
      .replace(/pada.*$/i, '')
      .replace(/[\s\-_.]/g, '');
  }

  function isNakshatraMatch(a, b) {
    if (!a || !b) return false;
    const na = normalizeNakName(a);
    const nb = normalizeNakName(b);
    return na === nb || na.includes(nb) || nb.includes(na);
  }

  // --- 4. Interactive Canvas Controller: Gann's Square of 9 ---
  function initGannWheel(canvasId, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const size = 9;
    const spiral = generateSquareOf9Spiral(size);

    let basePrice = options.basePrice || 24871;
    let hoveredCell = null;
    let mousePos = { x: 0, y: 0, isHovering: false };

    function resize() {
      const parent = canvas.parentElement;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent ? Math.min(parent.clientWidth, 620) : 520;
      canvas.width = w * dpr;
      canvas.height = w * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${w}px`;
      draw();
    }

    function draw() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      const isLight = document.body.classList.contains('theme-light') || 
                      document.documentElement.getAttribute('data-theme') === 'light' ||
                      (typeof localStorage !== 'undefined' && localStorage.getItem('cosmic_site_theme') === 'light');

      const cellSize = w / size;
      const cx = w / 2;
      const cy = h / 2;

      // 1. Draw Cell Grid
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          const val = spiral[r][c];
          const angle = getCellAngle(c, r, size);
          const x = c * cellSize;
          const y = r * cellSize;

          const isCenter = r === 4 && c === 4;
          const isCardinal = angle === 0 || angle === 90 || angle === 180 || angle === 270;
          const isOrdinal = angle === 45 || angle === 135 || angle === 225 || angle === 315;
          const isTrine = angle === 120 || angle === 240;

          // Background Fill
          if (isLight) {
            if (isCenter) {
              ctx.fillStyle = 'rgba(245, 190, 72, 0.35)';
            } else if (isCardinal) {
              ctx.fillStyle = 'rgba(254, 240, 138, 0.55)';
            } else if (isOrdinal) {
              ctx.fillStyle = 'rgba(237, 233, 254, 0.75)';
            } else if (isTrine) {
              ctx.fillStyle = 'rgba(224, 242, 254, 0.75)';
            } else {
              ctx.fillStyle = '#ffffff';
            }
            if (hoveredCell && hoveredCell.r === r && hoveredCell.c === c) {
              ctx.fillStyle = 'rgba(254, 240, 138, 0.9)';
            }
          } else {
            if (isCenter) {
              ctx.fillStyle = 'rgba(245, 190, 72, 0.35)';
            } else if (isCardinal) {
              ctx.fillStyle = 'rgba(245, 190, 72, 0.16)';
            } else if (isOrdinal) {
              ctx.fillStyle = 'rgba(167, 139, 250, 0.14)';
            } else if (isTrine) {
              ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
            } else {
              ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
            }
            if (hoveredCell && hoveredCell.r === r && hoveredCell.c === c) {
              ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
            }
          }

          ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

          // Border
          if (isLight) {
            ctx.strokeStyle = isCenter ? '#b45309' : (isCardinal ? 'rgba(180, 83, 9, 0.5)' : (isOrdinal ? 'rgba(139, 92, 246, 0.45)' : (isTrine ? 'rgba(14, 165, 233, 0.45)' : '#e2e8f0')));
          } else {
            ctx.strokeStyle = isCenter ? '#f5be48' : (isCardinal ? 'rgba(245, 190, 72, 0.5)' : (isOrdinal ? 'rgba(167, 139, 250, 0.4)' : 'rgba(255, 255, 255, 0.08)'));
          }
          ctx.lineWidth = isCenter || isCardinal ? 1.5 : 1;
          ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

          // Number & Angle Text
          if (isLight) {
            ctx.fillStyle = isCenter ? '#7e122a' : (isCardinal ? '#7e122a' : (isOrdinal ? '#5b21b6' : (isTrine ? '#0369a1' : '#0f172a')));
          } else {
            ctx.fillStyle = isCenter ? '#ffd572' : (isCardinal ? '#fde047' : (isOrdinal ? '#c4b5fd' : '#cbd5e1'));
          }
          ctx.font = `bold ${Math.max(10, Math.round(cellSize * 0.28))}px 'Space Grotesk', sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(val, x + cellSize / 2, y + cellSize / 2 - 4);

          // Degree annotation
          if (!isCenter) {
            ctx.font = `${Math.max(7, Math.round(cellSize * 0.18))}px 'IBM Plex Mono', monospace`;
            if (isLight) {
              ctx.fillStyle = isCardinal ? '#b45309' : (isOrdinal ? '#6d28d9' : (isTrine ? '#0284c7' : '#64748b'));
            } else {
              ctx.fillStyle = isCardinal ? '#f5be48' : (isOrdinal ? '#a78bfa' : 'rgba(148, 163, 184, 0.6)');
            }
            ctx.fillText(`${angle}°`, x + cellSize / 2, y + cellSize / 2 + cellSize * 0.26);
          }
        }
      }

      // 2. Cursor Laser Ray Tracker & Crosshairs
      if (mousePos.isHovering) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.strokeStyle = isLight ? '#b45309' : '#f5be48';
        ctx.lineWidth = 2.2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Outer Target Ring
        const cursorAngle = Math.atan2(cy - mousePos.y, mousePos.x - cx);
        let cursorDeg = Math.round((cursorAngle * 180) / Math.PI);
        if (cursorDeg < 0) cursorDeg += 360;

        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, 8, 0, Math.PI * 2);
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, 3, 0, Math.PI * 2);
        ctx.fill();

        // HUD Readout Bubble (Only render in-canvas on desktop/tablet > 640px; on mobile, data is displayed cleanly below the panel)
        if (window.innerWidth > 640) {
          const hudPrice = calculateGannTarget(basePrice, cursorDeg);
          const hudText = `${cursorDeg}° • Target: ₹${hudPrice.toLocaleString('en-IN')}`;

          ctx.font = "bold 11px 'IBM Plex Mono', monospace";
          const txtWidth = ctx.measureText(hudText).width;
          const bX = Math.min(w - txtWidth - 16, Math.max(8, mousePos.x + 12));
          const bY = Math.max(22, mousePos.y - 12);

          ctx.fillStyle = 'rgba(5, 7, 15, 0.92)';
          ctx.strokeStyle = '#f5be48';
          ctx.lineWidth = 1;
          ctx.fillRect(bX - 6, bY - 14, txtWidth + 12, 22);
          ctx.strokeRect(bX - 6, bY - 14, txtWidth + 12, 22);

          ctx.fillStyle = '#fae4b5';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(hudText, bX, bY - 3);
        }
      }

      ctx.restore();
    }

    // Hit Testing & Coordinate Tracking (RAF Throttled for Silky 60fps)
    let drawRaf = null;
    function queueDraw() {
      if (!drawRaf) {
        drawRaf = requestAnimationFrame(() => {
          drawRaf = null;
          draw();
        });
      }
    }

    function handlePointer(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      mousePos = { x, y, isHovering: true };

      const cellSize = rect.width / size;
      const col = Math.floor(x / cellSize);
      const row = Math.floor(y / cellSize);

      if (col >= 0 && col < size && row >= 0 && row < size) {
        hoveredCell = { r: row, c: col };
        const val = spiral[row][col];
        const deg = getCellAngle(col, row, size);
        updateGannInspector(val, deg, basePrice);
      } else {
        hoveredCell = null;
      }
      queueDraw();
    }

    canvas.addEventListener('mousemove', (e) => handlePointer(e.clientX, e.clientY), { passive: true });
    canvas.addEventListener('mouseleave', () => {
      mousePos.isHovering = false;
      hoveredCell = null;
      queueDraw();
    });

    // Touch support for mobile
    canvas.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        e.preventDefault();
        handlePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });

    canvas.addEventListener('touchend', () => {
      mousePos.isHovering = false;
      hoveredCell = null;
      queueDraw();
    });

    window.addEventListener('resize', resize);
    resize();

    // Hook to update base price and redraw from live inputs & themes
    return {
      setBasePrice: (p) => {
        basePrice = Number(p) || 24871;
        draw();
      },
      redraw: () => {
        draw();
      }
    };
  }

  // Updates the live Gann target cards & readout box
  function updateGannInspector(cellVal, deg, basePrice) {
    const elAngle = document.getElementById('gannInsAngle');
    const elTarget = document.getElementById('gannInsTarget');
    const elFormula = document.getElementById('gannInsFormula');
    const elNature = document.getElementById('gannInsNature');
    const homeReadout = document.getElementById('homeGannReadoutVal');

    const targetPrice = calculateGannTarget(basePrice, deg);
    const root = Math.sqrt(basePrice).toFixed(2);
    const degFactor = (deg / 180).toFixed(2);

    // Live Readout below homepage diagram panel
    if (homeReadout) {
      homeReadout.dataset.userActive = 'true';
      if (currentLang === 'hi') {
        homeReadout.textContent = `${deg}° कोण • लक्ष्य: ₹${targetPrice.toLocaleString('en-IN')} (कोष्ठ #${cellVal})`;
      } else {
        homeReadout.textContent = `${deg}° Angle • Target: ₹${targetPrice.toLocaleString('en-IN')} (Cell #${cellVal})`;
      }
    }

    if (!elAngle || !elTarget) return;

    elAngle.textContent = `${deg}° Angle (Cell #${cellVal})`;
    elTarget.textContent = `₹${targetPrice.toLocaleString('en-IN')}`;

    if (elFormula) {
      elFormula.textContent = `(${root} + ${degFactor})² = ₹${targetPrice.toLocaleString('en-IN')}`;
    }

    if (elNature) {
      if (deg === 0 || deg === 360) elNature.textContent = currentLang === 'hi' ? '३६०° पूर्ण चक्र (मास्टर चक्र)' : '360° Master Cycle Octave';
      else if (deg === 180) elNature.textContent = currentLang === 'hi' ? '१८०° मुख्य विपरीत मोड़ (मेजर रिवर्सल)' : '180° Major Trend Opposition';
      else if (deg === 90 || deg === 270) elNature.textContent = currentLang === 'hi' ? '९०°/२७०° कार्डिनल स्क्वायर ब्रेकआउट' : '90°/270° Cardinal Square';
      else if (deg === 45 || deg === 135 || deg === 225 || deg === 315) elNature.textContent = currentLang === 'hi' ? 'ऑर्डिनल फिक्स्ड क्रॉस प्रतिक्रिया' : 'Ordinal Fixed Cross Vibration';
      else elNature.textContent = currentLang === 'hi' ? 'मध्यवर्ती हार्मोनिक स्तर' : 'Intermediate Harmonic Harmonic Ray';
    }
  }

  // --- 5. Interactive Canvas Controller: Sarvatobhadra Chakra ---
  function initSarvatobhadra(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const size = 9;
    let hoveredCell = null;
    let mousePos = { x: 0, y: 0, isHovering: false };

    function resize() {
      const parent = canvas.parentElement;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent ? Math.min(parent.clientWidth, 640) : 540;
      canvas.width = w * dpr;
      canvas.height = w * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${w}px`;
      draw();
    }

    function draw() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      const cellSize = w / size;

      const isLight = document.body.classList.contains('theme-light') || 
                      document.documentElement.getAttribute('data-theme') === 'light' ||
                      (typeof localStorage !== 'undefined' && localStorage.getItem('cosmic_site_theme') === 'light');

      // 1. Draw 9x9 Grid Cells
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          const x = c * cellSize;
          const y = r * cellSize;
          const isPerimeter = r === 0 || r === 8 || c === 0 || c === 8;
          const isCorner = (r === 0 || r === 8) && (c === 0 || c === 8);

          // Find Nakshatra if on perimeter
          const nakshatra = SBC_NAKSHATRAS.find(n => n.col === c && n.row === r);
          const corner = SBC_CORNERS.find(cn => cn.col === c && cn.row === r);
          const inner = SBC_INNER_CONTENT[`${c},${r}`];

          // Check if transiting planet is here
          const planetHere = nakshatra ? SBC_PLANETS.filter(p => isNakshatraMatch(p.nakshatra, nakshatra.name)) : [];

          // Cell Background
          if (isLight) {
            if (isCorner) {
              ctx.fillStyle = 'rgba(254, 240, 138, 0.55)';
            } else if (isPerimeter) {
              ctx.fillStyle = '#ffffff';
            } else if (inner && inner.type === 'center') {
              ctx.fillStyle = 'rgba(254, 240, 138, 0.5)';
            } else if (inner && inner.type === 'rashi') {
              ctx.fillStyle = 'rgba(224, 242, 254, 0.75)';
            } else {
              ctx.fillStyle = '#fdfbf7';
            }
            if (hoveredCell && hoveredCell.r === r && hoveredCell.c === c) {
              ctx.fillStyle = 'rgba(254, 240, 138, 0.85)';
            }
          } else {
            if (isCorner) {
              ctx.fillStyle = 'rgba(212, 175, 55, 0.2)';
            } else if (isPerimeter) {
              ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            } else if (inner && inner.type === 'center') {
              ctx.fillStyle = 'rgba(245, 190, 72, 0.28)';
            } else if (inner && inner.type === 'rashi') {
              ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
            } else {
              ctx.fillStyle = 'rgba(10, 15, 30, 0.7)';
            }
            if (hoveredCell && hoveredCell.r === r && hoveredCell.c === c) {
              ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
            }
          }

          ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

          // Cell Border
          if (isLight) {
            ctx.strokeStyle = isPerimeter ? 'rgba(180, 83, 9, 0.35)' : '#e2e8f0';
          } else {
            ctx.strokeStyle = isPerimeter ? 'rgba(212, 175, 55, 0.45)' : 'rgba(255, 255, 255, 0.08)';
          }
          ctx.lineWidth = isPerimeter ? 1.4 : 1;
          ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

          // Cell Labels
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          if (isCorner && corner) {
            ctx.fillStyle = isLight ? '#7e122a' : '#fde047';
            ctx.font = `bold ${Math.max(12, Math.round(cellSize * 0.35))}px 'Space Grotesk', sans-serif`;
            ctx.fillText(currentLang === 'hi' ? corner.hi : corner.name, x + cellSize / 2, y + cellSize / 2);
          } else if (nakshatra) {
            // Nakshatra Name
            ctx.fillStyle = isLight ? '#0f172a' : '#f8fafc';
            ctx.font = `bold ${Math.max(8, Math.round(cellSize * 0.2))}px 'Inter', sans-serif`;
            const nameToDraw = currentLang === 'hi' ? nakshatra.hi : nakshatra.name;
            ctx.fillText(nameToDraw, x + cellSize / 2, y + cellSize * 0.38);

            // Ruler Tag
            ctx.fillStyle = isLight ? '#64748b' : '#94a3b8';
            ctx.font = `${Math.max(7, Math.round(cellSize * 0.16))}px 'IBM Plex Mono', monospace`;
            ctx.fillText(currentLang === 'hi' ? nakshatra.lordHi : nakshatra.ruler, x + cellSize / 2, y + cellSize * 0.68);

            // Planetary Badges if occupying
            if (planetHere.length > 0) {
              planetHere.forEach((p, idx) => {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(x + 10 + idx * 16, y + 10, 7, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#05070f';
                ctx.font = "bold 8px 'Inter', sans-serif";
                ctx.fillText(p.glyph, x + 10 + idx * 16, y + 10);
              });
            }
          } else if (inner) {
            if (isLight) {
              ctx.fillStyle = inner.type === 'rashi' ? '#0369a1' : (inner.type === 'tithi' ? '#6d28d9' : (inner.type === 'center' ? '#7e122a' : '#334155'));
            } else {
              ctx.fillStyle = inner.type === 'rashi' ? '#38bdf8' : (inner.type === 'tithi' ? '#a78bfa' : '#cbd5e1');
            }
            ctx.font = inner.type === 'center'
              ? `bold ${Math.max(9, Math.round(cellSize * 0.22))}px 'Space Grotesk', sans-serif`
              : `${Math.max(9, Math.round(cellSize * 0.24))}px 'Noto Sans Devanagari', sans-serif`;
            const inLabel = currentLang === 'hi' ? inner.label : inner.en;
            ctx.fillText(inLabel, x + cellSize / 2, y + cellSize / 2);
          }
        }
      }

      // 2. Active Vedha Laser Rays (Crosshairs & Diagonals from Hovered Cell)
      if (hoveredCell) {
        const hx = hoveredCell.c * cellSize + cellSize / 2;
        const hy = hoveredCell.r * cellSize + cellSize / 2;

        ctx.lineWidth = 2.4;
        ctx.setLineDash([5, 4]);

        // A. Sammukha Vedha (Direct Frontal Horizontal/Vertical Beam)
        ctx.beginPath();
        if (hoveredCell.r === 0 || hoveredCell.r === 8) {
          // Vertical Sammukha ray through center
          ctx.moveTo(hx, 0);
          ctx.lineTo(hx, h);
        } else if (hoveredCell.c === 0 || hoveredCell.c === 8) {
          // Horizontal Sammukha ray
          ctx.moveTo(0, hy);
          ctx.lineTo(w, hy);
        }
        ctx.strokeStyle = '#dc2626'; // Red laser for high-impact Sammukha
        ctx.stroke();

        // B. Vama & Dakshina Vedha (Left & Right Diagonals)
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(w, h);
        ctx.moveTo(w, 0);
        ctx.lineTo(0, h);
        ctx.strokeStyle = isLight ? 'rgba(180, 83, 9, 0.85)' : 'rgba(245, 190, 72, 0.7)'; // Golden diagonal rays
        ctx.stroke();

        ctx.setLineDash([]);

        // Reticle on Hovered Cell
        ctx.strokeStyle = isLight ? '#7e122a' : '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(hoveredCell.c * cellSize + 2, hoveredCell.r * cellSize + 2, cellSize - 4, cellSize - 4);
      }

      ctx.restore();
    }

    let sbcDrawRaf = null;
    function queueSbcDraw() {
      if (!sbcDrawRaf) {
        sbcDrawRaf = requestAnimationFrame(() => {
          sbcDrawRaf = null;
          draw();
        });
      }
    }

    function handlePointer(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      mousePos = { x, y, isHovering: true };

      const cellSize = rect.width / size;
      const col = Math.floor(x / cellSize);
      const row = Math.floor(y / cellSize);

      if (col >= 0 && col < size && row >= 0 && row < size) {
        hoveredCell = { r: row, c: col };
        updateSarvatobhadraInspector(col, row);
      } else {
        hoveredCell = null;
      }
      queueSbcDraw();
    }

    canvas.addEventListener('mousemove', (e) => handlePointer(e.clientX, e.clientY), { passive: true });
    canvas.addEventListener('mouseleave', () => {
      mousePos.isHovering = false;
      hoveredCell = null;
      queueSbcDraw();
    });

    canvas.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        e.preventDefault();
        handlePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });

    canvas.addEventListener('touchend', () => {
      mousePos.isHovering = false;
      hoveredCell = null;
      queueSbcDraw();
    });

    window.addEventListener('resize', resize);
    resize();

    return {
      redraw: () => {
        queueSbcDraw();
      }
    };
  }

  // Updates the live Sarvatobhadra Vedha inspector panel
  function updateSarvatobhadraInspector(col, row) {
    const elName = document.getElementById('sbcInsName');
    const elVedha = document.getElementById('sbcInsVedha');
    const elMarket = document.getElementById('sbcInsMarket');
    const homeReadout = document.getElementById('homeSbcReadoutVal');

    const nakshatra = SBC_NAKSHATRAS.find(n => n.col === col && n.row === row);
    const inner = SBC_INNER_CONTENT[`${col},${row}`];
    const corner = SBC_CORNERS.find(cn => cn.col === col && cn.row === row);

    let summaryText = '';

    if (nakshatra) {
      const nName = currentLang === 'hi' ? nakshatra.hi : nakshatra.name;
      const ruler = currentLang === 'hi' ? nakshatra.lordHi : nakshatra.ruler;

      // Determine Opposite Nakshatra for Sammukha Vedha
      let oppNak = '';
      if (row === 0) oppNak = SBC_NAKSHATRAS.find(n => n.col === col && n.row === 8);
      else if (row === 8) oppNak = SBC_NAKSHATRAS.find(n => n.col === col && n.row === 0);
      else if (col === 0) oppNak = SBC_NAKSHATRAS.find(n => n.col === 8 && n.row === row);
      else if (col === 8) oppNak = SBC_NAKSHATRAS.find(n => n.col === 0 && n.row === row);

      const oppName = oppNak ? (currentLang === 'hi' ? oppNak.hi : oppNak.name) : (currentLang === 'hi' ? 'सम्मुख नक्षत्र' : 'Opposite Nakshatra');

      summaryText = currentLang === 'hi'
        ? `${nName} (${ruler} स्वामी) • सम्मुख वेध: ${oppName}`
        : `${nName} (${ruler} Ruled) • Sammukha Vedha: ${oppName}`;

      if (elName) {
        elName.textContent = `${nName} (${ruler} Ruled)`;
        if (elVedha) {
          elVedha.innerHTML = currentLang === 'hi'
            ? `<strong>सम्मुख वेध:</strong> ${oppName} पर सीधी वेध किरण &bull; <strong>वाम/दक्षिण वेध:</strong> त्रिकोणीय अक्ष`
            : `<strong>Sammukha Vedha:</strong> Direct laser piercing on ${oppName} &bull; <strong>Vama/Dakshina:</strong> Diagonal axis`;
        }
        if (elMarket) {
          elMarket.textContent = nakshatra.ruler === 'Saturn' || nakshatra.ruler === 'Rahu' || nakshatra.ruler === 'Mars'
            ? (currentLang === 'hi' ? '⚠️ क्रूर ग्रह वेध: बैंकिंग व तकनीकी इंडेक्स में तेज झूले एवं अचानक करेक्शन की संभावना।' : '⚠️ Malefic Vedha: Elevated volatility in Banking & IT derivatives; sudden whipsaw risk.')
            : (currentLang === 'hi' ? '✨ शुभ ग्रह वेध: पूंजी प्रवाह, एफआईआई खरीदारी एवं अपट्रेंड ब्रेकआउट की प्रबलता।' : '✨ Benefic Vedha: FII capital inflows, equity accumulation and breakout continuation.');
        }
      }
    } else if (inner) {
      summaryText = currentLang === 'hi'
        ? `आंतरिक कोष्ठ: ${inner.label} (${inner.type.toUpperCase()})`
        : `Inner Kostha: ${inner.en} (${inner.type.toUpperCase()})`;

      if (elName) {
        elName.textContent = currentLang === 'hi' ? `${inner.label} (${inner.type.toUpperCase()})` : `${inner.en} (${inner.type.toUpperCase()})`;
        if (elVedha) {
          elVedha.textContent = currentLang === 'hi' ? 'आंतरिक चक्र कोष्ठ: राशि, स्वर अथवा वर्ण बिंदु।' : 'Internal Chakra Cell: Rashi, Vowel, or Consonant acoustic vibration.';
        }
        if (elMarket) {
          elMarket.textContent = currentLang === 'hi' ? 'कंपनी के नाम के प्रथम अक्षर पर वेध पड़ने से संबंधित शेयर में हलचल होती है।' : 'Vedha on corporate initial letter signals institutional action in related equities.';
        }
      }
    } else if (corner) {
      summaryText = currentLang === 'hi'
        ? `विशेष कोण: ${corner.hi} (${corner.corner})`
        : `Corner Node: ${corner.name} (${corner.corner})`;

      if (elName) {
        elName.textContent = currentLang === 'hi' ? `कोण स्वर: ${corner.hi} (${corner.corner})` : `Corner Vowel: ${corner.name}`;
        if (elVedha) {
          elVedha.textContent = currentLang === 'hi' ? 'चतुष्कोण संधान बिंदु।' : 'Four-pillar cardinal corner anchor.';
        }
      }
    }

    if (homeReadout && summaryText) {
      homeReadout.dataset.userActive = 'true';
      homeReadout.textContent = summaryText;
    }
  }

  // --- 6. Bilingual UI Language Switcher ---
  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('cosmic_gann_lang', lang);

    document.querySelectorAll('.gann-lang-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });

    // Toggle language elements
    document.querySelectorAll('.gann-text-en').forEach(el => {
      el.classList.toggle('hidden-lang', lang === 'hi');
    });
    document.querySelectorAll('.gann-text-hi').forEach(el => {
      el.classList.toggle('hidden-lang', lang === 'en');
    });

    // Update homepage diagram default readouts if user has not interacted yet
    const homeGannVal = document.getElementById('homeGannReadoutVal');
    const homeSbcVal = document.getElementById('homeSbcReadoutVal');
    if (homeGannVal && !homeGannVal.dataset.userActive) {
      homeGannVal.textContent = lang === 'hi'
        ? '९०° लक्ष्य = ₹२५,०२८ • १८०° = ₹२५,१८६'
        : '90° Target = ₹25,028 • 180° = ₹25,186';
    }
    if (homeSbcVal && !homeSbcVal.dataset.userActive) {
      homeSbcVal.textContent = lang === 'hi'
        ? 'शनि व राहु उ.भाद्रपद में • मंगल पुष्य में'
        : 'Saturn & Rahu in U.Bhadra • Mars in Pushya';
    }
  }

  // --- 7. DOM Bootstrapping & Live Bindings ---
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Language Toggle Buttons
    document.querySelectorAll('.gann-lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const l = btn.dataset.lang || 'en';
        setLanguage(l);
      });
    });

    setLanguage(currentLang);

    // 2. Initialize Wheels on Dedicated Page
    const fullGann = initGannWheel('fullGannCanvas', { basePrice: 24871 });
    const fullSbc = initSarvatobhadra('fullSarvatobhadraCanvas');

    // 3. Initialize Wheels on Homepage Widget
    const homeGann = initGannWheel('homeGannCanvas', { basePrice: 24871 });
    const homeSbc = initSarvatobhadra('homeSarvatobhadraCanvas');

    // 4. Live Price Input Recalculator
    const gannPriceInput = document.getElementById('gannBasePriceInput');
    const btnSyncLiveNifty = document.getElementById('btnSyncLiveNifty');

    if (gannPriceInput) {
      gannPriceInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val) && val > 0) {
          if (fullGann) fullGann.setBasePrice(val);
          if (homeGann) homeGann.setBasePrice(val);
          updateTargetTable(val);
        }
      });
    }

    // Dynamic Target Levels Table Updater
    function updateTargetTable(base) {
      const angles = [45, 90, 120, 135, 180, 225, 240, 270, 315, 360];
      angles.forEach(deg => {
        const resEl = document.getElementById(`gannRes${deg}`);
        const supEl = document.getElementById(`gannSup${deg}`);
        if (resEl) {
          const rVal = calculateGannTarget(base, deg);
          resEl.textContent = `₹${rVal.toLocaleString('en-IN')}`;
        }
        if (supEl) {
          const sVal = calculateGannTarget(base, -deg);
          supEl.textContent = `₹${sVal.toLocaleString('en-IN')}`;
        }
      });
    }

    // 5. Automatic Real-Time Market & Ephemeris Data Synchronization
    async function syncRealNiftyPrice() {
      try {
        const res = await fetch('/api/market-data');
        if (res.ok) {
          const json = await res.json();
          if (json && json.data) {
            const nifty = json.data.find(d => d.symbol === 'NIFTY');
            if (nifty && nifty.price > 0) {
              const liveVal = parseFloat(nifty.price);
              if (gannPriceInput) gannPriceInput.value = liveVal;
              if (fullGann) fullGann.setBasePrice(liveVal);
              if (homeGann) homeGann.setBasePrice(liveVal);
              updateTargetTable(liveVal);
            }
          }
        }
      } catch (err) {
        console.warn('Gann market data sync idle:', err.message);
      }
    }

    async function syncRealEphemeris() {
      try {
        const res = await fetch('/api/ephemeris');
        if (res.ok) {
          const json = await res.json();
          if (json && json.ephemeris) {
            Object.keys(json.ephemeris).forEach(pKey => {
              const pData = json.ephemeris[pKey];
              const planetEntry = SBC_PLANETS.find(p => p.name.toLowerCase() === pKey.toLowerCase());
              if (planetEntry && pData.nakshatra && pData.nakshatra.name) {
                planetEntry.nakshatra = pData.nakshatra.name;
              }
            });
            if (fullSbc && fullSbc.redraw) fullSbc.redraw();
            if (homeSbc && homeSbc.redraw) homeSbc.redraw();
          }
        }
      } catch (err) {
        console.warn('Sarvatobhadra ephemeris sync idle:', err.message);
      }
    }

    if (btnSyncLiveNifty) {
      btnSyncLiveNifty.addEventListener('click', () => {
        syncRealNiftyPrice();
      });
    }

    // Initial populate & real data synchronizations
    updateTargetTable(24871);
    syncRealNiftyPrice();
    syncRealEphemeris();

    // 6. Reactive Theme Change Re-render for Canvas Graphics
    window.addEventListener('cosmic-theme-changed', () => {
      if (fullGann && fullGann.redraw) fullGann.redraw();
      if (homeGann && homeGann.redraw) homeGann.redraw();
      if (fullSbc && fullSbc.redraw) fullSbc.redraw();
      if (homeSbc && homeSbc.redraw) homeSbc.redraw();
    });
  });
})();
