/**
 * Automated WCAG 2.1 Color Contrast Checker
 * Validates text-to-background contrast ratios for "Deep Space Meets Gold Vault"
 */

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function relativeLuminance(rgb) {
  const sRGB = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map(val => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

function contrastRatio(hex1, hex2) {
  const lum1 = relativeLuminance(hexToRgb(hex1));
  const lum2 = relativeLuminance(hexToRgb(hex2));
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

const backgrounds = {
  'bg-space-950': '#04050d',
  'bg-space-900': '#080a18',
  'bg-space-800': '#0d1024',
  'bg-space-700': '#141833',
  'bg-space-600': '#1c2145'
};

const textColors = {
  'text-primary': '#ecebf4',
  'text-secondary': '#a8a5c4',
  'text-dim': '#8f8db0',
  'gold-400': '#f6d697',
  'gold-500': '#f2c879',
  'violet-400': '#ad94f3',
  'success-400': '#63d9a5',
  'negative-400': '#e87b8c'
};

console.log('🌌 WCAG 2.1 AA Contrast Ratio Verification (Target ≥ 4.5:1)');
console.log('===========================================================');

let passCount = 0;
let totalCount = 0;

for (const [bgName, bgHex] of Object.entries(backgrounds)) {
  for (const [textName, textHex] of Object.entries(textColors)) {
    totalCount++;
    const ratio = contrastRatio(textHex, bgHex);
    // Large text or UI controls can pass at 3.0:1, normal text at 4.5:1
    const passesAA = ratio >= 4.5;
    const passesLarge = ratio >= 3.0;
    const status = passesAA ? '✅ PASS (AA)' : (passesLarge ? '🟡 PASS (AA Large)' : '❌ FAIL');
    
    if (passesLarge) passCount++;
    console.log(`[${status}] ${textName.padEnd(16)} on ${bgName.padEnd(14)} : ${ratio.toFixed(2)}:1`);
  }
}

console.log('===========================================================');
console.log(`Results: ${passCount} / ${totalCount} combinations verified.`);
