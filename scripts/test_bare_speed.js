const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const testHtml = '<html><head><style>@page { size: A4; margin: 10mm; } body { font-family: Segoe UI, sans-serif; }</style></head><body><h1>Speed Test</h1><p>Testing basic PDF speed</p></body></html>';
const tempHtml = path.join(os.tmpdir(), 'speed_test.html');
const tempPdf = path.join(os.tmpdir(), 'speed_test.pdf');
fs.writeFileSync(tempHtml, testHtml);

const t0 = Date.now();
const cmd = `"${edgePath}" --headless --disable-gpu --no-first-run --print-to-pdf="${tempPdf}" "${tempHtml}"`;
execSync(cmd, { stdio: 'pipe' });
console.log('Bare HTML PDF compiled in:', Date.now() - t0, 'ms');
