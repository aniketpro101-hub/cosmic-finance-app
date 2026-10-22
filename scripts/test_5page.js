const fs = require('fs');
const path = require('path');
const { evaluateTradingKundli } = require('../src/services/kundliEngine');
const { generateWealthDossierPdf } = require('../src/services/pdfGenerator');

async function testFullDossier() {
  console.log('Calculating sample Kundli...');
  const analysis = evaluateTradingKundli({
    fullName: 'Vrishabh Jinendra',
    dob: '1999-11-29',
    tob: '14:50:00',
    pob: 'Delhi, India'
  });
  console.log('Analysis ready. Generating 5-Page Executive Dossier PDF...');
  const t0 = Date.now();
  const pdfPath = await generateWealthDossierPdf(analysis);
  const t1 = Date.now();
  const stats = fs.statSync(pdfPath);
  console.log(`Dossier PDF created in ${t1 - t0}ms!`);
  console.log(`Size: ${stats.size} bytes`);
  console.log(`Path: ${pdfPath}`);

  // Copy to project root for inspection
  const destPath = path.join(__dirname, '../sample-wealth-dossier.pdf');
  fs.copyFileSync(pdfPath, destPath);
  console.log(`Copied sample to: ${destPath}`);
}

testFullDossier().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
