const db = require('../src/db/database');

const rows = db.prepare('SELECT id, title, summary, source_name FROM news').all();
let updated = 0;

for (const row of rows) {
  let cleanTitle = row.title
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#8377;|&rupee;/g, '₹')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  let cleanSummary = row.summary
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#8377;|&rupee;/g, '₹')
    .replace(/&nbsp;/g, ' ')
    .replace(/http[s]?:\/\/\S+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleanSummary.length < 35 || cleanSummary.includes('target=') || cleanSummary.includes('oc=')) {
    cleanSummary = `${cleanTitle}. Market development and Dalal Street telemetry reported by ${row.source_name || 'Financial Desk'}.`;
  }

  if (cleanTitle !== row.title || cleanSummary !== row.summary) {
    db.prepare('UPDATE news SET title = ?, summary = ? WHERE id = ?').run(cleanTitle, cleanSummary, row.id);
    updated++;
  }
}

console.log(`Cleaned ${updated} news rows in database.`);
