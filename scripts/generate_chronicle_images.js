/**
 * Batch generate chronicle images using Agnes AI API
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const chroniclesService = require('../src/services/chroniclesService');

async function generateAll() {
  console.log('Starting Agnes image generation for all 10 chronicles...');
  const all = chroniclesService.getAll();

  for (const item of all) {
    console.log(`\nGenerating image for: ${item.name} (${item.slug})...`);
    try {
      const res = await chroniclesService.generateImageForChronicle(item.slug);
      console.log(`Result for ${item.slug}:`, res);
    } catch (err) {
      console.error(`Error for ${item.slug}:`, err.message);
    }
    // Brief pause to respect rate limits
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('\nAll chronicle images generated successfully!');
}

generateAll();
