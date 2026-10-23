/**
 * Cosmic Finance — Institutional Wealth Dossier PDF Engine
 * Generates an elite 5-page comprehensive Vedic Financial Kundli PDF.
 * Uses Headless Microsoft Edge for zero-dependency, ultra-fast native PDF compilation.
 * 
 * Features:
 * - Proper Hindi Devanagari typography with Noto Sans Devanagari
 * - Classical multi-color Parashari North Indian diamond vector SVGs
 * - Embedded base64 portrait of Dr. Ashish Patni
 * - Clickable wa.me WhatsApp and tel: call hyperlinks inside the PDF
 * - Complete D1, D9, D10, D2, Sarvashtakavarga, and Vimshottari Dasha
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const CONSTANTS = require('../config/constants');
const { renderNorthIndianChartSvg } = require('./svgKundliChart');
const { buildAllDivisionalCharts } = require('./divisionalCharts');

// Locate Headless Browser (Edge, Chrome, or Chromium) across Windows & Linux (Render/Docker)
function getEdgeExecutablePath() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) return process.env.CHROME_BIN;
  if (process.env.EDGE_PATH && fs.existsSync(process.env.EDGE_PATH)) return process.env.EDGE_PATH;

  const possiblePaths = [
    // Windows paths (Chrome prioritized, then Edge)
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Microsoft\\Edge\\Application\\msedge.exe'),
    // Linux / Ubuntu / Docker (Render)
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/snap/bin/chromium',
    '/usr/bin/msedge',
    // macOS
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'
  ];

  for (const p of possiblePaths) {
    if (p && fs.existsSync(p)) return p;
  }

  // Fallback to checking via shell `which` on Unix-like systems
  if (process.platform !== 'win32') {
    const unixBinaries = ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'msedge'];
    for (const bin of unixBinaries) {
      try {
        const binPath = execSync(`which ${bin}`, { stdio: 'pipe' }).toString().trim();
        if (binPath && fs.existsSync(binPath)) return binPath;
      } catch (e) {}
    }
  }

  return null;
}

// Read and cache Dr. Ashish Patni image as Base64
let cachedFounderBase64 = null;
function getFounderPhotoBase64() {
  if (cachedFounderBase64) return cachedFounderBase64;
  const imagePaths = [
    path.join(__dirname, '../../public/images/dr-ashish-patni.jpg'),
    path.join(__dirname, '../public/images/dr-ashish-patni.jpg'),
    path.join(process.cwd(), 'public/images/dr-ashish-patni.jpg'),
    path.join(process.cwd(), 'cosmic-v2/public/images/dr-ashish-patni.jpg')
  ];

  for (const imgPath of imagePaths) {
    if (fs.existsSync(imgPath)) {
      const buffer = fs.readFileSync(imgPath);
      cachedFounderBase64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;
      return cachedFounderBase64;
    }
  }
  return '';
}

/**
 * Builds the complete multi-page HTML template for the Wealth Dossier PDF
 */
function buildDossierHtml(analysis) {
  const {
    fullName = 'Valued Client',
    gender = 'Male',
    dob = '1990-01-15',
    tob = '12:00:00',
    pob = 'Mumbai, Maharashtra',
    lagna = {},
    planets = [],
    financialHouses = {},
    speculationYoga = {},
    detectedYogas = [],
    personality = {},
    favoredAsset = 'NIFTY Index & Large-Cap Bluechips',
    vimshottariDasha = {},
    ayanamsa = 'N.C.Lahiri'
  } = analysis;

  const client = {
    name: fullName,
    dob,
    tob,
    pob
  };

  // Derive all divisional charts and Sarvashtakavarga
  const divisional = buildAllDivisionalCharts({
    lagna,
    planets,
    client
  });

  // Render SVGs
  const svgD1 = renderNorthIndianChartSvg({
    chartCode: 'D1',
    chartTitle: 'COSMIC FINANCE AUTHENTIC JANMA KUNDLI (D1)',
    subtitle: 'Canonical Parashari Geometry • Lahiri Ayanamsha • Topocentric Sidereal Horizon',
    client,
    lagnaSignIndex: lagna.signIndex || 0,
    lagnaDegrees: lagna.degrees || 15.0,
    lagnaNakshatra: lagna.nakshatra || planets[0]?.nakshatra || 'Ashwini',
    lagnaPada: 1,
    planets
  });

  const svgD9 = renderNorthIndianChartSvg({
    chartCode: 'D9',
    chartTitle: divisional.d9.titleHi,
    subtitle: divisional.d9.subtitle,
    client,
    lagnaSignIndex: divisional.d9.lagnaSignIndex,
    lagnaDegrees: divisional.d9.lagnaDegrees,
    lagnaNakshatra: 'Navamsha',
    lagnaPada: 1,
    planets: divisional.d9.planets,
    isCompact: true
  });

  const svgD10 = renderNorthIndianChartSvg({
    chartCode: 'D10',
    chartTitle: divisional.d10.titleHi,
    subtitle: divisional.d10.subtitle,
    client,
    lagnaSignIndex: divisional.d10.lagnaSignIndex,
    lagnaDegrees: divisional.d10.lagnaDegrees,
    lagnaNakshatra: 'Dashamsha',
    lagnaPada: 1,
    planets: divisional.d10.planets,
    isCompact: true
  });

  const svgD2 = renderNorthIndianChartSvg({
    chartCode: 'D2',
    chartTitle: divisional.d2.titleHi,
    subtitle: divisional.d2.subtitle,
    client,
    lagnaSignIndex: divisional.d2.lagnaSignIndex,
    lagnaDegrees: divisional.d2.lagnaDegrees,
    lagnaNakshatra: 'Hora',
    lagnaPada: 1,
    planets: divisional.d2.planets,
    isCompact: true
  });

  const founderImage = getFounderPhotoBase64();
  const phone = CONSTANTS.PHONE_NUMBER;
  const rawPhone = CONSTANTS.WHATSAPP_NUMBER_RAW;

  const consultWaText = encodeURIComponent(
    `Namaste Dr. Ashish Patni ji, I have received my Cosmic Finance Wealth Dossier for ${fullName} ` +
    `(DOB: ${dob}, Lagna: ${lagna.signName || 'N/A'}, 5th Bhava: ${speculationYoga.badge || 'N/A'}). ` +
    `I would like to schedule a personal VIP consultation to unlock my multi-asset financial timing.`
  );

  const whatsappUrl = `https://wa.me/${rawPhone}?text=${consultWaText}`;
  const callUrl = `tel:${rawPhone}`;

  // Build Planetary Table Rows
  const tableRows = planets.map(p => {
    const rx = p.isRetrograde ? '<span class="status-rx">℞ Vakri</span>' : '<span class="status-dir">Marga</span>';
    let dignityClass = 'dig-neutral';
    if (p.dignity === 'Exalted' || p.dignity === 'Uchcha') dignityClass = 'dig-exalted';
    if (p.dignity === 'Debilitated' || p.dignity === 'Neecha') dignityClass = 'dig-debilitated';

    return `
      <tr>
        <td class="col-planet">
          <span class="hi-name">${p.vedicName || p.name}</span>
          <span class="en-name">${p.name} (${p.glyph || ''})</span>
        </td>
        <td class="col-rashi">${p.rashiVedic || p.rashiName} (${p.rashiName})</td>
        <td class="col-deg mono">${p.degreesDisplay || `${p.degreesInSign}°`}</td>
        <td class="col-nak">${p.nakshatra} (Pada ${p.pada || 1})</td>
        <td class="col-house">H${p.houseNumber}</td>
        <td class="col-motion">${rx}</td>
        <td class="col-dignity"><span class="${dignityClass}">${p.dignity || 'Neutral'}</span></td>
      </tr>
    `;
  }).join('');

  // SAV House Cards HTML
  const sav = divisional.ashtakavarga;
  const savCardsHtml = sav.houses.map(h => {
    return `
      <div class="sav-house-cell">
        <span class="sav-h-num">H${h.houseNumber}</span>
        <span class="sav-h-bindus" style="color:${h.color};">${h.bindus}</span>
        <span class="sav-h-grade">${h.grade}</span>
      </div>
    `;
  }).join('');

  // Dhana Yogas HTML
  const yogasHtml = detectedYogas.map(y => {
    return `
      <div class="dossier-yoga-card">
        <div class="yoga-card-header">
          <span class="yoga-name">✦ ${y.name}</span>
          <span class="yoga-source">${y.classicalSource}</span>
        </div>
        <p class="yoga-impact">${y.impact}</p>
      </div>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Cosmic Finance Wealth Dossier — ${fullName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Montserrat:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 9mm 9mm 9mm 9mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Montserrat', sans-serif;
      color: #0f172a;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      font-size: 8.5pt;
      line-height: 1.35;
    }
    .page-break {
      page-break-after: always;
      break-after: page;
    }
    .dossier-page {
      min-height: 275mm;
      max-height: 275mm;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 2mm 0;
    }

    /* Screen Document Presentation (Institutional Portfolio View) */
    @media screen {
      body {
        background: #090e24 !important;
        padding: 30px 14px 80px !important;
      }
      .dossier-page {
        max-width: 210mm !important;
        width: 100% !important;
        min-height: 297mm !important;
        max-height: none !important;
        margin: 0 auto 36px auto !important;
        background: #ffffff !important;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(245, 190, 72, 0.2) !important;
        border-radius: 8px !important;
        padding: 12mm 14mm !important;
      }
    }
    
    /* Top Header Bar */
    .dossier-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #7e122a;
      padding-bottom: 5px;
      margin-bottom: 8px;
    }
    .brand-title {
      font-family: 'Cinzel', serif;
      font-size: 15pt;
      font-weight: 800;
      color: #7e122a;
      letter-spacing: 0.04em;
    }
    .brand-tagline {
      font-size: 7.5pt;
      color: #b45309;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .confidential-stamp {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 7pt;
      font-weight: 700;
      color: #b91c1c;
      background: #fef2f2;
      border: 1px solid #fca5a5;
      padding: 2px 7px;
      border-radius: 9999px;
      letter-spacing: 0.05em;
    }

    /* Common Footer */
    .footer-statutory {
      border-top: 1px solid #cbd5e1;
      padding-top: 4px;
      font-size: 6.2pt;
      color: #64748b;
      text-align: center;
      line-height: 1.3;
    }

    /* ================================= PAGE 1 COVER ================================= */
    .cover-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 10px 15px;
      text-align: center;
    }
    .cover-crest {
      width: 75px;
      height: 75px;
      margin: 0 auto 12px;
      background: radial-gradient(circle, #fef3c7 0%, #fde68a 100%);
      border: 2px solid #b45309;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32pt;
      color: #7e122a;
      box-shadow: 0 4px 15px rgba(180, 83, 9, 0.15);
    }
    .cover-title {
      font-family: 'Cinzel', serif;
      font-size: 23pt;
      font-weight: 900;
      color: #7e122a;
      letter-spacing: 0.05em;
      line-height: 1.15;
    }
    .cover-hindi-title {
      font-family: 'Noto Sans Devanagari', sans-serif;
      font-size: 13pt;
      font-weight: 700;
      color: #b45309;
      margin-top: 4px;
    }
    .cover-subtitle {
      font-size: 9.5pt;
      font-weight: 600;
      color: #334155;
      margin-top: 6px;
      letter-spacing: 0.03em;
    }
    .gold-divider {
      width: 140px;
      height: 2.5px;
      background: linear-gradient(90deg, transparent, #d97706, transparent);
      margin: 14px auto;
    }

    /* Client Data Plaque */
    .client-data-plaque {
      background: #f8fafc;
      border: 1.5px solid #cbd5e1;
      border-radius: 12px;
      padding: 14px 18px;
      margin: 12px auto;
      max-width: 165mm;
      text-align: left;
    }
    .plaque-head {
      font-family: 'Cinzel', serif;
      font-size: 10pt;
      font-weight: 700;
      color: #7e122a;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 5px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
    }
    .coords-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px 16px;
      font-size: 8.5pt;
    }
    .coords-item {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dashed #e2e8f0;
      padding-bottom: 3px;
    }
    .coords-label {
      color: #64748b;
      font-weight: 500;
    }
    .coords-value {
      color: #0f172a;
      font-weight: 700;
    }

    /* Executive Summary Highlights */
    .cover-highlights-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      max-width: 165mm;
      margin: 12px auto 0;
    }
    .cover-highlight-card {
      background: #ffffff;
      border: 1.2px solid #e2e8f0;
      border-radius: 9px;
      padding: 10px;
      text-align: left;
      border-top: 3px solid #7e122a;
    }
    .ch-label {
      font-size: 7pt;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 700;
    }
    .ch-val {
      font-size: 10.5pt;
      font-weight: 800;
      color: #0f172a;
      margin-top: 2px;
    }
    .ch-desc {
      font-size: 7.2pt;
      color: #475569;
      margin-top: 3px;
    }

    /* ================================= PAGE 2 D1 & POSITIONS ================================= */
    .d1-chart-wrap {
      text-align: center;
      margin: 2px auto 6px;
      max-width: 155mm;
    }
    .planet-table-wrap {
      margin-top: 4px;
    }
    .dossier-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.6pt;
    }
    .dossier-table th {
      background: #7e122a;
      color: #ffffff;
      font-weight: 700;
      padding: 4px 6px;
      text-align: left;
      font-size: 7.2pt;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .dossier-table td {
      padding: 3.5px 6px;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: middle;
    }
    .dossier-table tr:nth-child(even) {
      background: #f8fafc;
    }
    .col-planet {
      font-weight: 700;
    }
    .hi-name {
      font-family: 'Noto Sans Devanagari', sans-serif;
      font-size: 8.5pt;
      color: #7e122a;
      display: inline-block;
      min-width: 45px;
    }
    .en-name {
      color: #334155;
      font-weight: 600;
    }
    .mono {
      font-family: 'Space Grotesk', monospace;
      font-weight: 600;
    }
    .status-rx {
      color: #b91c1c;
      font-weight: 700;
    }
    .status-dir {
      color: #059669;
      font-weight: 600;
    }
    .dig-exalted {
      color: #059669;
      font-weight: 700;
      background: #ecfdf5;
      padding: 1px 5px;
      border-radius: 4px;
    }
    .dig-debilitated {
      color: #dc2626;
      font-weight: 700;
      background: #fef2f2;
      padding: 1px 5px;
      border-radius: 4px;
    }
    .dig-neutral {
      color: #475569;
      font-weight: 500;
    }

    /* ================================= PAGE 3 DIVISIONAL CHARTS ================================= */
    .divisional-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-top: 4px;
    }
    .div-card {
      background: #ffffff;
      border: 1.2px solid #cbd5e1;
      border-radius: 10px;
      padding: 8px;
      text-align: center;
    }
    .div-title {
      font-family: 'Cinzel', serif;
      font-size: 9.5pt;
      font-weight: 800;
      color: #7e122a;
    }
    .div-hi-title {
      font-family: 'Noto Sans Devanagari', sans-serif;
      font-size: 8.5pt;
      font-weight: 700;
      color: #b45309;
    }
    .div-subtitle {
      font-size: 6.8pt;
      color: #64748b;
      margin-bottom: 6px;
    }
    .div-svg-wrap {
      max-width: 90mm;
      width: 100%;
      margin: 0 auto;
    }
    .div-interpretation {
      font-size: 7.2pt;
      color: #334155;
      text-align: left;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 5px 7px;
      margin-top: 6px;
    }

    /* ================================= PAGE 4 ASHTAKAVARGA & BHAVAS ================================= */
    .sav-container {
      background: #f8fafc;
      border: 1.2px solid #cbd5e1;
      border-radius: 10px;
      padding: 10px;
      margin-top: 6px;
    }
    .sav-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 6px;
      margin-top: 6px;
    }
    .sav-house-cell {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 6px 4px;
      text-align: center;
    }
    .sav-h-num {
      display: block;
      font-size: 7pt;
      font-weight: 700;
      color: #64748b;
    }
    .sav-h-bindus {
      display: block;
      font-size: 13pt;
      font-weight: 900;
      margin: 2px 0;
    }
    .sav-h-grade {
      display: block;
      font-size: 6.5pt;
      font-weight: 600;
      color: #475569;
    }
    .sav-ratio-banner {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 8px;
      padding: 7px 12px;
      margin-top: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8pt;
    }
    .pillars-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-top: 8px;
    }
    .pillar-card {
      background: #ffffff;
      border: 1.2px solid #e2e8f0;
      border-left: 3.5px solid #d97706;
      border-radius: 8px;
      padding: 8px 10px;
    }
    .pillar-title {
      font-size: 8.5pt;
      font-weight: 800;
      color: #7e122a;
    }
    .pillar-sign {
      font-size: 7.5pt;
      color: #b45309;
      font-weight: 600;
    }
    .pillar-text {
      font-size: 7.2pt;
      color: #334155;
      margin-top: 3px;
    }
    .dossier-yogas-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-top: 8px;
    }
    .dossier-yoga-card {
      background: #faf5ff;
      border: 1px solid #e9d5ff;
      border-radius: 8px;
      padding: 7px 10px;
    }
    .yoga-name {
      font-size: 8pt;
      font-weight: 800;
      color: #6b21a8;
    }
    .yoga-source {
      font-size: 6.8pt;
      color: #9333ea;
      float: right;
    }
    .yoga-impact {
      font-size: 7pt;
      color: #3b0764;
      margin-top: 3px;
    }

    /* ================================= PAGE 5 VIP FOUNDER PLAQUE ================================= */
    .vip-founder-plaque {
      margin-top: 10px;
      background: linear-gradient(135deg, #090d22 0%, #151b40 100%);
      border: 2px solid #d97706;
      border-radius: 14px;
      padding: 14px 18px;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    }
    .plaque-avatar-wrap {
      width: 78px;
      height: 78px;
      border-radius: 50%;
      border: 2.5px solid #f59e0b;
      overflow: hidden;
      flex-shrink: 0;
      background: #000;
    }
    .plaque-avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 15%;
    }
    .plaque-info {
      flex: 1;
    }
    .plaque-badge {
      display: inline-block;
      font-size: 7.2pt;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #fbbf24;
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    .plaque-name {
      font-family: 'Cinzel', serif;
      font-size: 14pt;
      font-weight: 900;
      color: #ffffff;
      line-height: 1.15;
    }
    .plaque-subtitle {
      font-size: 8pt;
      color: #cbd5e1;
      margin-top: 3px;
    }
    .plaque-creds {
      font-size: 7.2pt;
      color: #94a3b8;
      margin-top: 4px;
    }
    .plaque-actions {
      display: flex;
      flex-direction: column;
      gap: 7px;
      flex-shrink: 0;
    }
    /* Clickable interactive buttons inside PDF */
    .btn-pdf-wa {
      background: #25D366;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 9pt;
      font-weight: 800;
      padding: 8px 16px;
      border-radius: 9999px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(37, 211, 102, 0.3);
    }
    .btn-pdf-call {
      background: #d97706;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 9pt;
      font-weight: 800;
      padding: 8px 16px;
      border-radius: 9999px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(217, 119, 6, 0.3);
    }
    .dasha-summary-box {
      background: #f8fafc;
      border: 1.2px solid #cbd5e1;
      border-radius: 10px;
      padding: 10px;
      margin-top: 6px;
    }
    .dasha-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin-top: 6px;
    }
    .dasha-card {
      flex: 1;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 8px 12px;
    }
    .dasha-tier-name {
      font-size: 7.2pt;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
    }
    .dasha-lord-val {
      font-size: 11pt;
      font-weight: 800;
      color: #7e122a;
      margin-top: 2px;
    }
    .dasha-dates-span {
      font-size: 7.5pt;
      font-weight: 600;
      color: #b45309;
    }
    .dasha-desc-txt {
      font-size: 7.2pt;
      color: #334155;
      margin-top: 3px;
    }
  </style>
</head>
<body>

  <!-- ================================= PAGE 1: EXECUTIVE COVER ================================= -->
  <div class="dossier-page">
    <div>
      <div class="dossier-top-bar">
        <div>
          <div class="brand-title">COSMIC FINANCE</div>
          <div class="brand-tagline">Vedic Multi-Asset Planetary Observatory</div>
        </div>
        <div class="confidential-stamp">CONFIDENTIAL FINANCIAL DOSSIER</div>
      </div>

      <div class="cover-body">
        <div class="cover-crest">✦</div>
        <h1 class="cover-title">EXECUTIVE WEALTH DOSSIER</h1>
        <div class="cover-hindi-title">वैदिक वित्तीय कुण्डली एवं ग्रह सम्पति विश्लेषण</div>
        <p class="cover-subtitle">Canonical Parashari Geometry • Multi-Asset Risk Horizon • N.C. Lahiri Ayanamsha</p>
        <div class="gold-divider"></div>

        <!-- Coordinates Plaque -->
        <div class="client-data-plaque">
          <div class="plaque-head">
            <span>ASTRONOMICAL BIRTH COORDINATES</span>
            <span>TOPOCENTRIC LAHIRI</span>
          </div>
          <div class="coords-grid">
            <div class="coords-item">
              <span class="coords-label">Full Name:</span>
              <span class="coords-value">${fullName}</span>
            </div>
            <div class="coords-item">
              <span class="coords-label">Gender:</span>
              <span class="coords-value">${gender}</span>
            </div>
            <div class="coords-item">
              <span class="coords-label">Date of Birth:</span>
              <span class="coords-value">${dob}</span>
            </div>
            <div class="coords-item">
              <span class="coords-label">Time of Birth:</span>
              <span class="coords-value">${tob} (IST / Local)</span>
            </div>
            <div class="coords-item">
              <span class="coords-label">Place of Birth:</span>
              <span class="coords-value">${pob}</span>
            </div>
            <div class="coords-item">
              <span class="coords-label">Lagna (Ascendant):</span>
              <span class="coords-value">${lagna.signName || 'N/A'} (${lagna.degreesDisplay || 'N/A'})</span>
            </div>
            <div class="coords-item">
              <span class="coords-label">Lagna Lord:</span>
              <span class="coords-value">${lagna.lord || 'N/A'}</span>
            </div>
            <div class="coords-item">
              <span class="coords-label">Ayanamsha:</span>
              <span class="coords-value">${ayanamsa} (Chitra Paksha)</span>
            </div>
          </div>
        </div>

        <!-- Executive Highlights -->
        <div class="cover-highlights-grid">
          <div class="cover-highlight-card">
            <div class="ch-label">5th Bhava Speculation</div>
            <div class="ch-val">${speculationYoga.score || 'High'}</div>
            <div class="ch-desc">${speculationYoga.badge || 'Auspicious Speculative Alignment'}</div>
          </div>
          <div class="cover-highlight-card">
            <div class="ch-label">Harmonized Asset Class</div>
            <div class="ch-val" style="font-size:9.5pt;">${favoredAsset.split('&')[0]}</div>
            <div class="ch-desc">Optimal planetary resonance for long-cycle capital accrual.</div>
          </div>
          <div class="cover-highlight-card">
            <div class="ch-label">Trading Personality</div>
            <div class="ch-val" style="font-size:9.5pt;">${personality.title || 'Calculated Strategist'}</div>
            <div class="ch-desc">${personality.ruler || 'Budh-Guru Harmony'}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-statutory">
      Astronomical calculations powered by Cosmic Finance Canonical Parashari Engine (Lahiri Ayanamsha 24.23°). Strictly educational and research advisory under SEBI compliance. All rights reserved &copy; Cosmic Finance &bull; www.cosmicfinance.in
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ================================= PAGE 2: D1 & PLANETARY POSITIONS ================================= -->
  <div class="dossier-page">
    <div>
      <div class="dossier-top-bar">
        <div>
          <div class="brand-title">COSMIC FINANCE</div>
          <div class="brand-tagline">Canonical Parashari D1 Janma Kundli</div>
        </div>
        <div class="confidential-stamp">PAGE 2 OF 5 &bull; D1 NATAL CHART</div>
      </div>

      <div class="d1-chart-wrap">
        ${svgD1}
      </div>

      <div class="planet-table-wrap">
        <table class="dossier-table">
          <thead>
            <tr>
              <th>Planet (Graha)</th>
              <th>Rashi (Sign)</th>
              <th>Exact Longitude</th>
              <th>Nakshatra &amp; Pada</th>
              <th>Bhava</th>
              <th>Motion</th>
              <th>Dignity</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    </div>

    <div class="footer-statutory">
      Astronomical calculations powered by Cosmic Finance Canonical Parashari Engine (Lahiri Ayanamsha 24.23°). Strictly educational and research advisory under SEBI compliance. All rights reserved &copy; Cosmic Finance &bull; www.cosmicfinance.in
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ================================= PAGE 3: DIVISIONAL CHARTS (D9, D10, D2) ================================= -->
  <div class="dossier-page">
    <div>
      <div class="dossier-top-bar">
        <div>
          <div class="brand-title">COSMIC FINANCE</div>
          <div class="brand-tagline">Divisional Wealth &amp; Career Architecture</div>
        </div>
        <div class="confidential-stamp">PAGE 3 OF 5 &bull; DIVISIONAL CHARTS</div>
      </div>

      <div class="divisional-grid">
        <!-- D9 Navamsha -->
        <div class="div-card">
          <div class="div-title">NAVAMSHA KUNDLI (D9)</div>
          <div class="div-hi-title">उत्तर भारतीय नवांश कुण्डली (D9)</div>
          <div class="div-subtitle">Inner Dharma • Compounding Fruit • Soul Potency</div>
          <div class="div-svg-wrap">
            ${svgD9}
          </div>
          <div class="div-interpretation">
            <strong>D9 Market Mandate:</strong> Reveals true inner strength of Grahas. Planets exalted in D1 but debilitated in D9 lose compounding velocity; planets debilitated in D1 but exalted in D9 produce sudden Neecha-Bhanga wealth surges.
          </div>
        </div>

        <!-- D10 Dashamsha -->
        <div class="div-card">
          <div class="div-title">DASHAMSHA KUNDLI (D10)</div>
          <div class="div-hi-title">उत्तर भारतीय दशमांश कुण्डली (D10)</div>
          <div class="div-subtitle">Professional Status • Executive Authority • Market Impact</div>
          <div class="div-svg-wrap">
            ${svgD10}
          </div>
          <div class="div-interpretation">
            <strong>D10 Market Mandate:</strong> Evaluates commercial enterprise, public recognition, institutional board positions, and fund management longevity. Governs career turning points and market reputation.
          </div>
        </div>
      </div>

      <!-- D2 Hora Bottom Plaque -->
      <div class="div-card" style="margin-top:8px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div class="div-title">HORA KUNDLI (D2) — LIQUID TREASURY &amp; BULLION ARCHITECTURE</div>
            <div class="div-hi-title">उत्तर भारतीय होरा कुण्डली (D2) — सूर्य एवं चन्द्र धन कोष</div>
          </div>
          <div style="font-size:7.5pt; color:#64748b;">Solar (Leo) vs Lunar (Cancer) Divisions</div>
        </div>
        <div style="display:flex; gap:14px; align-items:center; margin-top:6px;">
          <div style="max-width:82mm; width:82mm; flex-shrink:0;">
            ${svgD2}
          </div>
          <div style="flex:1; text-align:left; font-size:7.8pt; color:#334155; line-height:1.45;">
            <p><strong>D2 Hora Astrological Principles:</strong> In classical Parashari Jyotish, the 2nd division (Hora) partitions all cosmic wealth into two eternal polarities:</p>
            <ul style="margin-left:14px; margin-top:4px;">
              <li><strong>Solar Hora (Leo / Surya):</strong> Dynamic enterprise earnings, bullion accrual, capital risk taking, and sovereign independence.</li>
              <li><strong>Lunar Hora (Cancer / Chandra):</strong> Liquid cash reserves, banking capital, family assets, and wealth preservation during macro recessions.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-statutory">
      Astronomical calculations powered by Cosmic Finance Canonical Parashari Engine (Lahiri Ayanamsha 24.23°). Strictly educational and research advisory under SEBI compliance. All rights reserved &copy; Cosmic Finance &bull; www.cosmicfinance.in
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ================================= PAGE 4: ASHTAKAVARGA & BHAVAS ================================= -->
  <div class="dossier-page">
    <div>
      <div class="dossier-top-bar">
        <div>
          <div class="brand-title">COSMIC FINANCE</div>
          <div class="brand-tagline">Sarvashtakavarga Matrix &amp; Four Wealth Pillars</div>
        </div>
        <div class="confidential-stamp">PAGE 4 OF 5 &bull; WEALTH ARCHITECTURE</div>
      </div>

      <!-- Sarvashtakavarga -->
      <div class="sav-container">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong style="color:#7e122a; font-family:'Cinzel', serif; font-size:9.5pt;">SARVASHTAKAVARGA (SAV) 12-HOUSE MATRIX (337 BINDUS)</strong>
          <span style="font-size:7.2pt; color:#64748b;">Parashari Auspicious Dot Distribution (Average: 28 pts)</span>
        </div>
        <div class="sav-grid">
          ${savCardsHtml}
        </div>
        <div class="sav-ratio-banner">
          <div>
            <strong>Wealth Accumulation Ratio (Labha vs Vyaya):</strong>
            <span>11th House (${sav.labhaBindus} pts) &divide; 12th House (${sav.vyayaBindus} pts) = <strong>${sav.wealthAccumulationRatio}x</strong></span>
          </div>
          <span style="color:${sav.isAccumulationFavorable ? '#059669' : '#dc2626'}; font-weight:700;">
            ${sav.isAccumulationFavorable ? '✓ Positive Compounding Vector' : '⚠ Capital Protection Lock Required'}
          </span>
        </div>
      </div>

      <!-- Four Wealth Pillars -->
      <div class="pillars-grid">
        <div class="pillar-card">
          <div class="pillar-title">2nd House: Dhana Bhava (Liquid Treasury)</div>
          <div class="pillar-sign">${financialHouses.house2Dhana?.signName || 'Taurus'} (Lord: ${financialHouses.house2Dhana?.lord || 'Venus'})</div>
          <p class="pillar-text">${financialHouses.house2Dhana?.marketSignificance || 'Treasury reserves, cash liquidity, capital compounding, and banking savings.'}</p>
        </div>
        <div class="pillar-card" style="border-left-color:#7c3aed;">
          <div class="pillar-title">5th House: Purva Punya &amp; Speculation</div>
          <div class="pillar-sign">${financialHouses.house5Speculation?.signName || 'Leo'} (Lord: ${financialHouses.house5Speculation?.lord || 'Sun'})</div>
          <p class="pillar-text">${financialHouses.house5Speculation?.marketSignificance || 'Intuitive asset allocation, multi-market risk intelligence, capital timing, and speculation acumen.'}</p>
        </div>
        <div class="pillar-card" style="border-left-color:#ea580c;">
          <div class="pillar-title">9th House: Bhagya Bhava (Macro Fortune)</div>
          <div class="pillar-sign">${financialHouses.house9Bhagya?.signName || 'Sagittarius'} (Lord: ${financialHouses.house9Bhagya?.lord || 'Jupiter'})</div>
          <p class="pillar-text">${financialHouses.house9Bhagya?.marketSignificance || 'Macro tailwinds, favorable market regimes, institutional backing, and generational prosperity.'}</p>
        </div>
        <div class="pillar-card" style="border-left-color:#059669;">
          <div class="pillar-title">11th House: Labha Bhava (Realized Profits)</div>
          <div class="pillar-sign">${financialHouses.house11Labha?.signName || 'Aquarius'} (Lord: ${financialHouses.house11Labha?.lord || 'Saturn'})</div>
          <p class="pillar-text">${financialHouses.house11Labha?.marketSignificance || 'Net profit conversion, multi-bagger payoffs, compounding velocity, and capital dividends.'}</p>
        </div>
      </div>

      <!-- Detected Classical Dhana Yogas -->
      <div style="margin-top:10px;">
        <strong style="color:#7e122a; font-family:'Cinzel', serif; font-size:9.5pt;">DETECTED CLASSICAL DHANA &amp; SPECULATION YOGAS</strong>
        <div class="dossier-yogas-grid">
          ${yogasHtml}
        </div>
      </div>
    </div>

    <div class="footer-statutory">
      Astronomical calculations powered by Cosmic Finance Canonical Parashari Engine (Lahiri Ayanamsha 24.23°). Strictly educational and research advisory under SEBI compliance. All rights reserved &copy; Cosmic Finance &bull; www.cosmicfinance.in
    </div>
  </div>

  <div class="page-break"></div>

  <!-- ================================= PAGE 5: DASHA & VIP CONSULTATION ================================= -->
  <div class="dossier-page">
    <div>
      <div class="dossier-top-bar">
        <div>
          <div class="brand-title">COSMIC FINANCE</div>
          <div class="brand-tagline">Planetary Timing &amp; Executive VIP Consultation</div>
        </div>
        <div class="confidential-stamp">PAGE 5 OF 5 &bull; STRATEGIC TIMING</div>
      </div>

      <!-- Vimshottari Dasha Box -->
      <div class="dasha-summary-box">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong style="color:#7e122a; font-family:'Cinzel', serif; font-size:9.5pt;">VIMSHOTTARI DASHA STRATEGIC TIMING TIMELINE</strong>
          <span style="font-size:7.2pt; color:#64748b;">Birth Nakshatra: ${vimshottariDasha.birthNakshatra || 'Revati'}</span>
        </div>
        <div class="dasha-row">
          <div class="dasha-card">
            <div class="dasha-tier-name">Active Mahadasha</div>
            <div class="dasha-lord-val">Lord ${vimshottariDasha.activeMahadasha?.lord || 'Rahu'} (${vimshottariDasha.activeMahadasha?.vedic || 'राहु'})</div>
            <span class="dasha-dates-span">${vimshottariDasha.activeMahadasha?.startDate || 'Active'} &bull; ${vimshottariDasha.activeMahadasha?.endDate || ''}</span>
            <p class="dasha-desc-txt">${vimshottariDasha.activeMahadasha?.significance || 'Governs major transformative multi-asset market cycles.'}</p>
          </div>
          <div class="dasha-card">
            <div class="dasha-tier-name">Active Sub-Period (Antardasha)</div>
            <div class="dasha-lord-val">Lord ${vimshottariDasha.activeAntardasha?.lord || 'Moon'} (${vimshottariDasha.activeAntardasha?.vedic || 'चन्द्र'})</div>
            <span class="dasha-dates-span">${vimshottariDasha.activeAntardasha?.startDate || 'Active'} &bull; ${vimshottariDasha.activeAntardasha?.endDate || ''}</span>
            <p class="dasha-desc-txt">Governs emotional temperament, risk calibration, and short-term liquidity rotations.</p>
          </div>
        </div>
      </div>

      <!-- DR. ASHISH PATNI EXECUTIVE VIP PLAQUE WITH INTERACTIVE HYPERLINKS -->
      <div class="vip-founder-plaque">
        <div class="plaque-avatar-wrap">
          <img src="${founderImage}" alt="Dr. Ashish Patni" class="plaque-avatar">
        </div>
        <div class="plaque-info">
          <span class="plaque-badge">✦ Master Vedic Numerologist &amp; Celebrity Astrologer</span>
          <div class="plaque-name">Dr. Ashish Patni</div>
          <div class="plaque-subtitle">Founder, Bhavishyam (www.bhavishyam.com) &bull; 20+ Yrs Multi-Asset Research</div>
          <div class="plaque-creds">
            Ph.D. in Vedic Astro-Sciences &bull; 2,500+ Horoscopes Evaluated &bull; Personal Mentor to Industrialists &amp; Family Offices across 45 Countries
          </div>
        </div>
        <div class="plaque-actions">
          <!-- WhatsApp Link -->
          <a href="${whatsappUrl}" class="btn-pdf-wa" target="_blank">
            💬 WhatsApp Dr. Patni
          </a>
          <!-- Direct Call Link -->
          <a href="${callUrl}" class="btn-pdf-call">
            📞 Direct Line: ${phone}
          </a>
        </div>
      </div>

      <!-- Educational Guidance Advisory -->
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:10px 14px; margin-top:10px; font-size:7.5pt; color:#334155; line-height:1.45;">
        <strong style="color:#7e122a; font-family:'Cinzel', serif; font-size:8.5pt; display:block; margin-bottom:4px;">
          PRESTIGE ADVISORY MANDATE &amp; METHODOLOGY
        </strong>
        <p>
          The celestial positions mapped in this dossier represent immutable astronomical coordinates calculated under topocentric Parashari Sidereal parameters. In the timeless tradition of Vedic Astro-Economics, planetary combinations do not compel rigid fate; rather, they reveal the natural seasons, liquidity tides, and psychological strengths of your financial constitution.
        </p>
        <p style="margin-top:4px;">
          For comprehensive, 1-on-1 personalized guidance—including complete Vimshottari Mahadasha transition dates, Name &amp; Corporate Numerology harmonization, and specific remedial timing—connect directly with Dr. Ashish Patni via the secure links above.
        </p>
      </div>
    </div>

    <div class="footer-statutory">
      Astronomical calculations powered by Cosmic Finance Canonical Parashari Engine (Lahiri Ayanamsha 24.23°). Strictly educational and research advisory under SEBI compliance. All rights reserved &copy; Cosmic Finance &bull; www.cosmicfinance.in
    </div>
  </div>

</body>
</html>
  `;
}

/**
 * Generates the Wealth Dossier PDF file on disk and returns its file path
 */
async function generateWealthDossierPdf(analysis) {
  const edgePath = getEdgeExecutablePath();
  if (!edgePath) {
    throw new Error('Headless browser (Chrome/Edge/Chromium) not found on host environment for PDF compilation.');
  }

  const html = buildDossierHtml(analysis);
  const tempDir = os.tmpdir();
  const id = Date.now().toString() + '_' + Math.random().toString(36).slice(2, 6);
  const tempHtmlPath = path.join(tempDir, `cosmic_dossier_${id}.html`);
  const tempPdfPath = path.join(tempDir, `cosmic_dossier_${id}.pdf`);

  fs.writeFileSync(tempHtmlPath, html, 'utf8');

  const userDataDir = path.join(os.tmpdir(), `browser_pdf_profile_${id}`);
  const cmd = `"${edgePath}" --headless=new --no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage --disable-gpu --disable-extensions --no-first-run --user-data-dir="${userDataDir}" --print-to-pdf="${tempPdfPath}" "${tempHtmlPath}"`;

  try {
    execSync(cmd, { stdio: 'pipe', timeout: 45000 });
    // Clean up HTML file and temp profile
    try { fs.unlinkSync(tempHtmlPath); } catch (e) {}
    try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}

    if (!fs.existsSync(tempPdfPath) || fs.statSync(tempPdfPath).size === 0) {
      throw new Error('PDF output file was not created or is empty.');
    }

    return tempPdfPath;
  } catch (err) {
    try { fs.unlinkSync(tempHtmlPath); } catch (e) {}
    try { fs.unlinkSync(tempPdfPath); } catch (e) {}
    throw err;
  }
}

module.exports = {
  buildDossierHtml,
  generateWealthDossierPdf,
  getEdgeExecutablePath,
  getFounderPhotoBase64
};
