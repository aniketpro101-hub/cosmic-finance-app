const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { renderNorthIndianChartSvg } = require('../src/services/svgKundliChart');

// Base64 encode the Dr. Ashish Patni image for 100% self-contained embedding
const imagePath = path.join(__dirname, '../public/images/dr-ashish-patni.jpg');
const imageBase64 = fs.existsSync(imagePath) 
  ? `data:image/jpeg;base64,${fs.readFileSync(imagePath).toString('base64')}`
  : '';

const svgD1 = renderNorthIndianChartSvg({
  chartCode: 'D1',
  chartTitle: 'COSMIC FINANCE AUTHENTIC JANMA KUNDLI (D1)',
  subtitle: 'Canonical Parashari Geometry • Lahiri Ayanamsha • Topocentric Sidereal Horizon',
  client: {
    name: 'Vrishabh Jinendra',
    dob: '29 November 1999',
    tob: '14:50 (2:50 PM)',
    pob: 'Delhi, India'
  },
  lagnaSignIndex: 11, // Pisces (12)
  lagnaDegrees: 27.33,
  lagnaNakshatra: 'Revati',
  lagnaPada: 4,
  planets: [
    { name: 'Jupiter', houseNumber: 2, degreesDisplay: '01° 56\' Ashwini', isRetrograde: true, functionalRole: 'Lagna Lord in 2nd House' },
    { name: 'Saturn', houseNumber: 2, degreesDisplay: '18° 05\' Bharani', isRetrograde: true, dignity: 'Debilitated', functionalRole: 'Neecha (Debilitated)' },
    { name: 'Rahu', houseNumber: 5, degreesDisplay: '12° 57\' Pushya', isRetrograde: true, functionalRole: '5th House Speculation' },
    { name: 'Moon', houseNumber: 6, degreesDisplay: '05° 40\' Magha', functionalRole: 'Janma Rashi (Simha)' },
    { name: 'Venus', houseNumber: 7, degreesDisplay: '28° 35\' Chitra', dignity: 'Debilitated', functionalRole: 'DEBILITATED (Neecha)' },
    { name: 'Mercury', houseNumber: 8, degreesDisplay: '23° 14\' Vishakha', functionalRole: 'Analytical Acumen' },
    { name: 'Sun', houseNumber: 9, degreesDisplay: '12° 51\' Anuradha', functionalRole: '9th House Fortune' },
    { name: 'Mars', houseNumber: 11, degreesDisplay: '08° 52\' U-Ashadha', dignity: 'Exalted', functionalRole: 'EXALTED (Uchcha)' },
    { name: 'Ketu', houseNumber: 11, degreesDisplay: '12° 57\' Shravana', isRetrograde: true, functionalRole: '11th House Gains' }
  ]
});

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Cosmic Finance Wealth Dossier</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Montserrat:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 10mm 12mm 10mm;
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
    }
    .page-break {
      page-break-after: always;
      break-after: page;
    }
    .dossier-page {
      min-height: 270mm;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 4mm 0;
    }
    .dossier-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #7e122a;
      padding-bottom: 6px;
      margin-bottom: 12px;
    }
    .brand-title {
      font-family: 'Cinzel', serif;
      font-size: 16pt;
      font-weight: 800;
      color: #7e122a;
      letter-spacing: 0.04em;
    }
    .brand-tagline {
      font-size: 8pt;
      color: #b45309;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .confidential-stamp {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 7.5pt;
      font-weight: 700;
      color: #b91c1c;
      background: #fef2f2;
      border: 1px solid #fca5a5;
      padding: 3px 8px;
      border-radius: 9999px;
      letter-spacing: 0.05em;
    }
    .chart-container {
      text-align: center;
      margin: 4px auto 10px;
      max-width: 185mm;
    }
    /* Dr. Ashish Patni Executive Contact Plaque */
    .vip-founder-plaque {
      margin-top: 12px;
      background: linear-gradient(135deg, #090d22 0%, #11183c 100%);
      border: 1.5px solid #d97706;
      border-radius: 14px;
      padding: 14px 18px;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    }
    .plaque-avatar-wrap {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      border: 2px solid #f59e0b;
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
      font-size: 7pt;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #fbbf24;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    .plaque-name {
      font-family: 'Cinzel', serif;
      font-size: 13pt;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.2;
    }
    .plaque-subtitle {
      font-size: 8pt;
      color: #cbd5e1;
      margin-top: 2px;
    }
    .plaque-actions {
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex-shrink: 0;
    }
    /* Clickable interactive buttons inside PDF */
    .btn-pdf-wa {
      background: #25D366;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 8.5pt;
      font-weight: 700;
      padding: 7px 14px;
      border-radius: 9999px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-align: center;
      border: none;
    }
    .btn-pdf-call {
      background: #d97706;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 8.5pt;
      font-weight: 700;
      padding: 7px 14px;
      border-radius: 9999px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-align: center;
      border: none;
    }
    .footer-statutory {
      border-top: 1px solid #e2e8f0;
      padding-top: 6px;
      font-size: 6.5pt;
      color: #64748b;
      text-align: center;
      line-height: 1.4;
    }
  </style>
</head>
<body>
  <div class="dossier-page">
    <div>
      <div class="dossier-top-bar">
        <div>
          <div class="brand-title">COSMIC FINANCE</div>
          <div class="brand-tagline">Vedic Multi-Asset Planetary Observatory</div>
        </div>
        <div class="confidential-stamp">CONFIDENTIAL FINANCIAL DOSSIER</div>
      </div>

      <div class="chart-container">
        ${svgD1}
      </div>

      <!-- Dr. Ashish Patni Executive Contact Plaque with Clickable Links -->
      <div class="vip-founder-plaque">
        <div class="plaque-avatar-wrap">
          <img src="${imageBase64}" alt="Dr. Ashish Patni" class="plaque-avatar">
        </div>
        <div class="plaque-info">
          <span class="plaque-badge">✦ Master Vedic Numerologist & Celebrity Astrologer</span>
          <div class="plaque-name">Dr. Ashish Patni</div>
          <div class="plaque-subtitle">Founder, Bhavishyam (www.bhavishyam.com) • 20+ Yrs Multi-Asset Cycles</div>
        </div>
        <div class="plaque-actions">
          <a href="https://wa.me/918888888888?text=Namaste%20Dr.%20Ashish%20Patni%20ji,%20I%20have%20reviewed%20my%20Cosmic%20Finance%20Kundli%20dossier%20and%20would%20like%20to%20schedule%20a%20VIP%20consultation." class="btn-pdf-wa" target="_blank">
            💬 WhatsApp Dr. Patni
          </a>
          <a href="tel:+918888888888" class="btn-pdf-call">
            📞 Direct Line: +91 8888888888
          </a>
        </div>
      </div>
    </div>

    <div class="footer-statutory">
      Astronomical calculations powered by Cosmic Finance Canonical Parashari Engine (Lahiri Ayanamsha 24.23°). Strictly educational and research advisory under SEBI compliance. All rights reserved &copy; Cosmic Finance &bull; www.cosmicfinance.in
    </div>
  </div>
</body>
</html>
`;

const htmlFilePath = path.join(__dirname, '../test-page.html');
const pdfFilePath = path.join(__dirname, '../test-output.pdf');

fs.writeFileSync(htmlFilePath, htmlContent);
console.log('HTML written to:', htmlFilePath);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const cmd = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfFilePath}" "${htmlFilePath}"`;

console.log('Generating PDF via headless Chromium...');
const t0 = Date.now();
execSync(cmd, { stdio: 'inherit' });
const t1 = Date.now();

console.log(`PDF successfully generated in ${t1 - t0}ms! File size: ${fs.statSync(pdfFilePath).size} bytes`);
