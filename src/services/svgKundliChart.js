/**
 * Cosmic Finance — Universal North Indian Diamond Chart SVG Generator
 * Canonical Parashari Geometry • Multi-Color Dignity Accents • Crisp Devanagari Hindi
 * 
 * Generates standalone, print-ready, high-resolution vector SVGs for D1, D9, D10, D2.
 */

const RASHI_NAMES_EN = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const RASHI_NAMES_HI = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क',
  'सिंह', 'कन्या', 'तुला', 'वृश्चिक',
  'धनु', 'मकर', 'कुम्भ', 'मीन'
];

const SIGN_LORDS = [
  'Mars', 'Venus', 'Mercury', 'Moon',
  'Sun', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Saturn', 'Jupiter'
];

const GRAHA_COLORS = {
  Sun: '#ea580c',
  Moon: '#1e293b',
  Mars: '#dc2626',
  Mercury: '#059669',
  Jupiter: '#d97706',
  Venus: '#e11d48',
  Saturn: '#7c3aed',
  Rahu: '#4338ca',
  Ketu: '#475569'
};

const GRAHA_COLORS_DARK = {
  Sun: '#fb923c',     // Luminous Amber Orange
  Moon: '#f1f5f9',    // Glowing Silver Pearl
  Mars: '#f87171',    // Radiant Mars Crimson
  Mercury: '#34d399', // Emerald Mercury
  Jupiter: '#fbbf24', // Luminous Gold Jupiter
  Venus: '#f472b6',   // Radiant Rose Venus
  Saturn: '#818cf8',  // Indigo Sapphire Saturn
  Rahu: '#c084fc',    // Cosmic Violet Rahu
  Ketu: '#a3a3a3'     // Ethereal Mist Ketu
};

const GRAHA_HINDI = {
  Sun: 'सूर्य',
  Moon: 'चन्द्र',
  Mars: 'मङ्गल',
  Mercury: 'बुध',
  Jupiter: 'गुरु',
  Venus: 'शुक्र',
  Saturn: 'शनि',
  Rahu: 'राहु',
  Ketu: 'केतु'
};

/**
 * Renders a full North Indian Diamond Kundli as a scalable SVG.
 * Supports full master view (with luxury frame and client details) or compact grid view.
 */
function renderNorthIndianChartSvg({
  chartCode = 'D1',
  chartTitle = 'COSMIC FINANCE AUTHENTIC JANMA KUNDLI (D1)',
  subtitle = 'Canonical Parashari Geometry • Lahiri Ayanamsha • Topocentric Sidereal Horizon',
  theme = 'light',
  client = {
    name: 'Valued Client',
    dob: '15 January 1990',
    tob: '12:00 PM',
    pob: 'Mumbai, India'
  },
  lagnaSignIndex = 0, // 0 = Aries, 11 = Pisces
  lagnaDegrees = 15.0,
  lagnaNakshatra = 'Ashwini',
  lagnaPada = 1,
  planets = [], // array of { name, houseNumber, degreesInSign, degreesDisplay, nakshatra, pada, isRetrograde, dignity, functionalRole }
  isCompact = false
}) {
  const isDark = (theme === 'dark');
  const width = isCompact ? 680 : 760;
  const height = isCompact ? 680 : 860;

  // Chart square dimensions
  const chartX = isCompact ? 20 : 35;
  const chartY = isCompact ? 20 : 110;
  const chartSize = isCompact ? 640 : 690;
  const midX = chartX + chartSize / 2;
  const midY = chartY + chartSize / 2;
  const rightX = chartX + chartSize;
  const bottomY = chartY + chartSize;

  const qX1 = chartX + chartSize / 4;
  const qY1 = chartY + chartSize / 4;
  const qX3 = chartX + (3 * chartSize) / 4;
  const qY3 = chartY + (3 * chartSize) / 4;

  // Group planets by house (1 to 12)
  const housePlanets = {};
  for (let h = 1; h <= 12; h++) {
    housePlanets[h] = [];
  }
  planets.forEach(p => {
    const h = p.houseNumber || 1;
    if (housePlanets[h]) {
      housePlanets[h].push(p);
    }
  });

  // Calculate Rashi sign number (1-12) for each house
  const houseSignNum = {};
  for (let h = 1; h <= 12; h++) {
    houseSignNum[h] = ((lagnaSignIndex + h - 1) % 12) + 1;
  }

  // Lagna display info
  const lagnaRashiEn = RASHI_NAMES_EN[lagnaSignIndex];
  const lagnaRashiHi = RASHI_NAMES_HI[lagnaSignIndex];
  const lagnaLord = SIGN_LORDS[lagnaSignIndex];
  const lagnaDegFormatted = `${Math.floor(lagnaDegrees)}° ${Math.round((lagnaDegrees % 1) * 60)}'`;

  // Define house content centers (for placing text without overlapping borders)
  const houseCenters = {
    1: { x: midX, y: chartY + chartSize * 0.28, align: 'middle' },
    2: { x: chartX + chartSize * 0.23, y: chartY + chartSize * 0.14, align: 'middle' },
    3: { x: chartX + chartSize * 0.12, y: chartY + chartSize * 0.25, align: 'middle' },
    4: { x: chartX + chartSize * 0.24, y: midY, align: 'middle' },
    5: { x: chartX + chartSize * 0.13, y: chartY + chartSize * 0.72, align: 'middle' },
    6: { x: chartX + chartSize * 0.23, y: chartY + chartSize * 0.85, align: 'middle' },
    7: { x: midX, y: chartY + chartSize * 0.76, align: 'middle' },
    8: { x: chartX + chartSize * 0.77, y: chartY + chartSize * 0.85, align: 'middle' },
    9: { x: chartX + chartSize * 0.87, y: chartY + chartSize * 0.72, align: 'middle' },
    10: { x: chartX + chartSize * 0.76, y: midY, align: 'middle' },
    11: { x: chartX + chartSize * 0.87, y: chartY + chartSize * 0.25, align: 'middle' },
    12: { x: chartX + chartSize * 0.77, y: chartY + chartSize * 0.14, align: 'middle' }
  };

  // Positions of Rashi sign badges (circular red chips at canonical intersection points)
  const signBadgePos = {
    1: { x: midX, y: midY - 34 },
    2: { x: qX1 + 18, y: qY1 - 18 },
    3: { x: qX1 - 18, y: qY1 + 18 },
    4: { x: midX - 34, y: midY },
    5: { x: qX1 - 18, y: qY3 - 18 },
    6: { x: qX1 + 18, y: qY3 + 18 },
    7: { x: midX, y: midY + 34 },
    8: { x: qX3 - 18, y: qY3 + 18 },
    9: { x: qX3 + 18, y: qY3 - 18 },
    10: { x: midX + 34, y: midY },
    11: { x: qX3 + 18, y: qY1 + 18 },
    12: { x: qX3 - 18, y: qY1 - 18 }
  };

  // Helper to render planet entries inside a house
  function renderPlanetsInHouse(h) {
    const list = housePlanets[h] || [];
    const center = houseCenters[h];
    if (list.length === 0) return '';

    const count = list.length;
    const baseSpacing = count > 2 ? 30 : 38;
    const startY = center.y - ((count - 1) * baseSpacing) / 2;

    return list.map((p, idx) => {
      const colorMap = isDark ? GRAHA_COLORS_DARK : GRAHA_COLORS;
      const color = colorMap[p.name] || (isDark ? '#f1f5f9' : '#1e293b');
      const hindiName = GRAHA_HINDI[p.name] || p.name;
      const degText = p.degreesDisplay || `${Math.floor(p.degreesInSign || 0)}°`;
      const nakText = p.nakshatra ? `${degText} ${p.nakshatra}` : degText;

      let badge = '';
      if (p.isRetrograde && p.name !== 'Rahu' && p.name !== 'Ketu') {
        badge = ' [R]';
      }
      if (p.dignity === 'Exalted' || p.dignity === 'Uchcha') {
        badge = ' [EXA]';
      } else if (p.dignity === 'Debilitated' || p.dignity === 'Neecha') {
        badge = ' [DEB]';
      }

      const curY = (h === 1) 
        ? (chartY + chartSize * 0.24 + idx * 36)
        : (startY + idx * baseSpacing);

      let roleTag = '';
      if (p.functionalRole && !isCompact) {
        let roleColor = isDark ? '#34d399' : '#059669';
        if (p.dignity === 'Debilitated' || p.dignity === 'Neecha') roleColor = isDark ? '#f87171' : '#dc2626';
        if (h === 5) roleColor = isDark ? '#c084fc' : '#7c3aed';
        if (h === 9) roleColor = isDark ? '#fb923c' : '#ea580c';
        if (h === 11) roleColor = isDark ? '#94a3b8' : '#475569';
        roleTag = `<text x="${center.x}" y="${curY + 22}" font-family="'Noto Sans Devanagari', 'Montserrat', sans-serif" font-size="8.5" font-weight="600" fill="${roleColor}" text-anchor="${center.align}">${p.functionalRole}</text>`;
      }

      const fontSize = isCompact ? '11' : (count > 2 ? '11.5' : '12.5');
      const degFontSize = isCompact ? '8.5' : '9.5';
      const degColor = isDark ? '#94a3b8' : '#475569';

      return `
        <g class="graha-entry" data-graha="${p.name}">
          <!-- Planet Title: Sanskrit + English + Badge -->
          <text x="${center.x}" y="${curY}" font-family="'Noto Sans Devanagari', 'Montserrat', sans-serif" font-size="${fontSize}" font-weight="700" fill="${color}" text-anchor="${center.align}">
            <tspan fill="${color}">${hindiName}</tspan> <tspan font-family="'Montserrat', sans-serif">${p.name.toUpperCase()}${badge}</tspan>
          </text>
          <!-- Degrees & Nakshatra -->
          <text x="${center.x}" y="${curY + 12}" font-family="'Montserrat', sans-serif" font-size="${degFontSize}" font-weight="500" fill="${degColor}" text-anchor="${center.align}">
            ${nakText}
          </text>
          ${roleTag}
        </g>
      `;
    }).join('\n');
  }

  // Render Rashi numbers in circular badges
  const rashiBg = isDark ? '#0d1536' : '#ffffff';
  const rashiBorder = isDark ? '#f5be48' : '#b91c1c';
  const rashiText = isDark ? '#f5be48' : '#b91c1c';
  let rashiBadgesSvg = '';
  for (let h = 1; h <= 12; h++) {
    const pos = signBadgePos[h];
    const signNum = houseSignNum[h];
    rashiBadgesSvg += `
      <g class="rashi-badge" data-house="${h}" data-sign="${signNum}">
        <circle cx="${pos.x}" cy="${pos.y}" r="11" fill="${rashiBg}" stroke="${rashiBorder}" stroke-width="1.3" />
        <text x="${pos.x}" y="${pos.y + 3.8}" font-family="'Montserrat', sans-serif" font-size="10" font-weight="700" fill="${rashiText}" text-anchor="middle">${signNum}</text>
      </g>
    `;
  }

  // Header section (full master only)
  let headerBlock = '';
  if (!isCompact) {
    headerBlock = `
    <!-- ================= TOP HEADER BLOCK ================= -->
    <g class="chart-header">
      <text x="${width / 2}" y="36" class="chart-title" font-size="19" font-weight="800" fill="${isDark ? '#ffffff' : '#7e122a'}" text-anchor="middle">
        ${chartTitle}
      </text>
      <text x="${width / 2}" y="56" font-family="'Montserrat', sans-serif" font-size="10.5" font-weight="600" fill="${isDark ? '#fcd34d' : '#b45309'}" letter-spacing="0.06em" text-anchor="middle">
        ${subtitle}
      </text>
      <text x="${width / 2}" y="78" font-family="'Montserrat', sans-serif" font-size="11" font-weight="500" fill="${isDark ? '#cbd5e1' : '#334155'}" text-anchor="middle">
        <tspan font-weight="600">Name:</tspan> ${client.name} &nbsp;|&nbsp; 
        <tspan font-weight="600">DOB:</tspan> ${client.dob} &nbsp;|&nbsp; 
        <tspan font-weight="600">Time:</tspan> ${client.tob} &nbsp;|&nbsp; 
        <tspan font-weight="600">Place:</tspan> ${client.pob}
      </text>
    </g>
    `;
  }

  const svgBgColor = isDark ? '#080c1e' : '#ffffff';
  const outerBorderColor = isDark ? '#f59e0b' : '#7e122a';
  const innerBorderColor = isDark ? '#d4af37' : '#f59e0b';
  const baseRectFill = isDark ? '#090e24' : '#ffffff';
  const parashariLineStroke = isDark ? '#f5be48' : '#7e122a';
  const binduFill = isDark ? '#f59e0b' : '#f59e0b';
  const binduStroke = isDark ? '#d4af37' : '#7e122a';
  const binduCore = isDark ? '#ffffff' : '#7e122a';

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="auto" class="cosmic-diamond-svg" style="max-width:${width}px; background:${svgBgColor}; border-radius:14px;">
  <defs>
    <!-- Kendra Shading Gradient -->
    <radialGradient id="kendraGlowGrad_${chartCode}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${isDark ? '#f59e0b' : '#fffbeb'}" stop-opacity="${isDark ? '0.22' : '0.95'}" />
      <stop offset="70%" stop-color="${isDark ? '#d97706' : '#fef3c7'}" stop-opacity="${isDark ? '0.08' : '0.55'}" />
      <stop offset="100%" stop-color="${isDark ? '#b45309' : '#fef9c3'}" stop-opacity="${isDark ? '0.02' : '0.35'}" />
    </radialGradient>

    <!-- Outer Frame Drop Shadow -->
    <filter id="softChartShadow_${chartCode}" x="-3%" y="-2%" width="106%" height="106%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="${isDark ? '#000000' : '#0f172a'}" flood-opacity="${isDark ? '0.5' : '0.08'}"/>
    </filter>
  </defs>

  <style>
    text {
      user-select: none;
    }
    .chart-title {
      font-family: 'Cinzel', serif;
      letter-spacing: 0.04em;
    }
  </style>

  ${headerBlock}

  <!-- ================= DOUBLE LUXURY BORDER ================= -->
  <!-- Outer Rounded Crimson/Gold Border -->
  <rect x="${isCompact ? 6 : 14}" y="${isCompact ? 6 : 90}" width="${width - (isCompact ? 12 : 28)}" height="${height - (isCompact ? 12 : 106)}" rx="16" ry="16" fill="none" stroke="${outerBorderColor}" stroke-width="2.6" filter="url(#softChartShadow_${chartCode})" />
  <!-- Inner Delicate Gold Pinstripe -->
  <rect x="${isCompact ? 12 : 22}" y="${isCompact ? 12 : 98}" width="${width - (isCompact ? 24 : 44)}" height="${height - (isCompact ? 24 : 122)}" rx="10" ry="10" fill="none" stroke="${innerBorderColor}" stroke-width="1.1" opacity="0.85" />

  <!-- ================= CHART BACKGROUNDS ================= -->
  <!-- Base Background for whole square -->
  <rect x="${chartX}" y="${chartY}" width="${chartSize}" height="${chartSize}" fill="${baseRectFill}" />

  <!-- Kendra Houses Shading (Houses 1, 4, 7, 10) -->
  <!-- House 1 (Top Diamond) -->
  <polygon points="${midX},${chartY} ${qX3},${qY1} ${midX},${midY} ${qX1},${qY1}" fill="url(#kendraGlowGrad_${chartCode})" />
  <!-- House 4 (Left Diamond) -->
  <polygon points="${chartX},${midY} ${qX1},${qY1} ${midX},${midY} ${qX1},${qY3}" fill="url(#kendraGlowGrad_${chartCode})" />
  <!-- House 7 (Bottom Diamond) -->
  <polygon points="${midX},${midY} ${qX3},${qY3} ${midX},${bottomY} ${qX1},${qY3}" fill="url(#kendraGlowGrad_${chartCode})" />
  <!-- House 10 (Right Diamond) -->
  <polygon points="${qX3},${qY1} ${rightX},${midY} ${qX3},${qY3} ${midX},${midY}" fill="url(#kendraGlowGrad_${chartCode})" />

  <!-- ================= GEOMETRIC PARASHARI LINES ================= -->
  <g stroke="${parashariLineStroke}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Outer Square of the Chart -->
    <rect x="${chartX}" y="${chartY}" width="${chartSize}" height="${chartSize}" fill="none" />

    <!-- Main Diagonal Lines -->
    <line x1="${chartX}" y1="${chartY}" x2="${rightX}" y2="${bottomY}" />
    <line x1="${rightX}" y1="${chartY}" x2="${chartX}" y2="${bottomY}" />

    <!-- Center Diamond Lines -->
    <line x1="${midX}" y1="${chartY}" x2="${rightX}" y2="${midY}" />
    <line x1="${rightX}" y1="${midY}" x2="${midX}" y2="${bottomY}" />
    <line x1="${midX}" y1="${bottomY}" x2="${chartX}" y2="${midY}" />
    <line x1="${chartX}" y1="${midY}" x2="${midX}" y2="${chartY}" />
  </g>

  <!-- Center Bindu Hub -->
  <circle cx="${midX}" cy="${midY}" r="8" fill="${binduFill}" stroke="${binduStroke}" stroke-width="1.8" />
  <circle cx="${midX}" cy="${midY}" r="2.5" fill="${binduCore}" />

  <!-- ================= HOUSE 1: LAGNA DISPLAY ================= -->
  <g class="lagna-core-block">
    <text x="${midX}" y="${chartY + chartSize * 0.11}" font-family="'Noto Sans Devanagari', 'Montserrat', sans-serif" font-size="${isCompact ? '13' : '15'}" font-weight="700" fill="${isDark ? '#ffffff' : '#0f172a'}" text-anchor="middle">
      <tspan fill="${isDark ? '#ffffff' : '#0f172a'}">लग्न</tspan> <tspan font-family="'Montserrat', sans-serif" fill="${isDark ? '#fcd34d' : '#1e3a8a'}">LAGNA</tspan>
    </text>
    <text x="${midX}" y="${chartY + chartSize * 0.11 + 15}" font-family="'Montserrat', sans-serif" font-size="${isCompact ? '9.5' : '11'}" font-weight="600" fill="${isDark ? '#e2e8f0' : '#334155'}" text-anchor="middle">
      ${lagnaDegFormatted} ${lagnaNakshatra} (${lagnaPada})
    </text>
    <text x="${midX}" y="${chartY + chartSize * 0.11 + 29}" font-family="'Montserrat', sans-serif" font-size="${isCompact ? '8.5' : '9.5'}" font-weight="500" fill="${isDark ? '#94a3b8' : '#64748b'}" text-anchor="middle">
      ${lagnaRashiEn} / ${lagnaRashiHi} (Lord: ${lagnaLord})
    </text>
  </g>

  <!-- ================= PLANETS IN HOUSES ================= -->
  ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => renderPlanetsInHouse(h)).join('\n')}

  <!-- ================= RASHI NUMERICAL BADGES ================= -->
  ${rashiBadgesSvg}
</svg>
  `;
}

module.exports = {
  renderNorthIndianChartSvg,
  RASHI_NAMES_EN,
  RASHI_NAMES_HI,
  SIGN_LORDS,
  GRAHA_COLORS,
  GRAHA_HINDI
};
