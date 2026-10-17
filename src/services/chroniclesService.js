/**
 * Cosmic Finance — Chronicles Service
 * Handles data querying, filtering, and image synchronization for Rise & Fall Chronicles
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { CHRONICLES } = require('../data/chroniclesData');

class ChroniclesService {
  constructor() {
    this.chronicles = CHRONICLES;
    this.imageDir = path.join(__dirname, '../../public/images/chronicles');
    this.ensureImageDir();
  }

  ensureImageDir() {
    if (!fs.existsSync(this.imageDir)) {
      fs.mkdirSync(this.imageDir, { recursive: true });
    }
  }

  getAll(category = null) {
    if (!category || category === 'all') {
      return this.chronicles;
    }
    return this.chronicles.filter(c => c.category.toLowerCase() === category.toLowerCase());
  }

  getBySlug(slug) {
    return this.chronicles.find(c => c.slug === slug) || null;
  }

  getRelated(currentSlug, limit = 3) {
    const current = this.getBySlug(currentSlug);
    if (!current) return this.chronicles.slice(0, limit);

    const related = this.chronicles
      .filter(c => c.slug !== currentSlug)
      .sort((a, b) => (a.category === current.category ? -1 : 1));

    return related.slice(0, limit);
  }

  getCategories() {
    const cats = new Set(this.chronicles.map(c => c.category));
    return Array.from(cats);
  }

  /**
   * Generates or checks image using Agnes AI API
   * Saves local image to public/images/chronicles/<slug>.png
   */
  async generateImageForChronicle(slug, apiKey) {
    const item = this.getBySlug(slug);
    if (!item) throw new Error(`Chronicle not found: ${slug}`);

    const targetFile = path.join(this.imageDir, `${slug}.png`);
    if (fs.existsSync(targetFile)) {
      return { success: true, cached: true, path: `/images/chronicles/${slug}.png` };
    }

    const key = apiKey || process.env.AGNES_API_KEY || 'sk-vYLjz9Eebq4uvaxsNEHw1hRZ7EaVqBnKDRhtExnKQxbxVUV0';

    return new Promise((resolve, reject) => {
      const postData = JSON.stringify({
        model: 'agnes-image-2.1-flash',
        prompt: item.imagePrompt,
        n: 1,
        size: '1024x1024'
      });

      const req = https.request({
        hostname: 'apihub.agnes-ai.com',
        path: '/v1/images/generations',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        },
        timeout: 45000
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            if (parsed.data && parsed.data[0] && parsed.data[0].url) {
              const remoteUrl = parsed.data[0].url;
              // Download and save locally
              this.downloadFile(remoteUrl, targetFile)
                .then(() => resolve({ success: true, path: `/images/chronicles/${slug}.png` }))
                .catch(err => resolve({ success: false, remoteUrl, error: err.message }));
            } else {
              resolve({ success: false, raw: body });
            }
          } catch (e) {
            resolve({ success: false, error: e.message, body });
          }
        });
      });

      req.on('error', err => resolve({ success: false, error: err.message }));
      req.on('timeout', () => { req.destroy(); resolve({ success: false, error: 'timeout' }); });
      req.write(postData);
      req.end();
    });
  }

  downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(dest);
      https.get(url, (res) => {
        res.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      }).on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    });
  }
}

module.exports = new ChroniclesService();
