const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public', 'images', 'chronicles');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Map of chronicle slugs to known authentic photo URLs
const sources = {
  'jesse-livermore-1929': 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Press_photo_of_Jesse_Livermore_in_1940_%28cropped%29.jpg',
  'the-hunt-brothers-1980': 'https://upload.wikimedia.org/wikipedia/en/2/27/Nelson_Bunker_Hunt.jpg',
  'ketan-parekh-2001': 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Ketan_parekh.jpg'
};

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const client = parsed.protocol === 'https:' ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 CosmicFinanceApp/1.0 (contact@cosmicfinance.com)',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith('//')) redirectUrl = 'https:' + redirectUrl;
        else if (redirectUrl.startsWith('/')) redirectUrl = parsed.origin + redirectUrl;
        return downloadFile(redirectUrl, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return resolve({ success: false, status: res.statusCode });
      }
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        const stats = fs.statSync(destPath);
        resolve({ success: true, size: stats.size });
      });
    });
    req.on('error', (err) => resolve({ success: false, error: err.message }));
  });
}

async function run() {
  for (const [slug, url] of Object.entries(sources)) {
    const dest = path.join(targetDir, slug + '.jpg');
    console.log(`Downloading ${slug}... from ${url}`);
    const res = await downloadFile(url, dest);
    console.log(`${slug}:`, res);
    await new Promise(r => setTimeout(r, 1500));
  }
}

run();
