const { execSync } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const t0 = Date.now();
const outPdf = path.join(os.tmpdir(), 'quick_test.pdf');
const htmlPage = path.join(__dirname, '../test-page.html');
const userDataDir = path.join(os.tmpdir(), 'msedge_pdf_profile');

const cmd = `"${edgePath}" --headless --disable-gpu --disable-extensions --disable-background-networking --disable-sync --disable-default-apps --no-first-run --user-data-dir="${userDataDir}" --print-to-pdf="${outPdf}" "${htmlPage}"`;
console.log('Running primed call...');
execSync(cmd, { stdio: 'pipe' });
console.log(`Generated in ${Date.now() - t0}ms, file size: ${fs.statSync(outPdf).size} bytes`);
