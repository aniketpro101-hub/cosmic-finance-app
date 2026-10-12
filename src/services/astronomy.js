/**
 * Astronomical & Vedic Planetary Ephemeris Service
 * Powered by authentic VedAstro-backed Geocentric Sidereal Engine (Lahiri Ayanamsha)
 * Phase 10: Full Navagraha alignment (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu)
 */

const { getTodaySky, calculatePanchang, calculateGeocentricPositions, NAVAGRAHA_CONFIG, RASHIS, NAKSHATRAS } = require('./vedAstroService');

function calculateCurrentPlanetaryEphemeris(targetDate = null) {
  const sky = targetDate ? calculateGeocentricPositions(targetDate) : getTodaySky();
  const planets = sky.planets;

  // Format with full backward compatibility + new Phase 10 rich attributes
  const results = {};
  for (const [key, p] of Object.entries(planets)) {
    results[key] = {
      name: p.name,
      vedicName: p.vedicName,
      glyph: p.glyph,
      color: p.color,
      glow: p.glow,
      asset: p.asset,
      symbolLink: p.symbolLink,
      significance: p.significance,
      longitude: p.longitude,
      isRetrograde: p.isRetrograde,
      velocity: p.velocity,
      sign: `${p.rashi.name} (${p.rashi.vedic})`,
      degreesInSign: p.rashi.label,
      rashi: p.rashi,
      nakshatra: p.nakshatra,
      dignity: p.dignity
    };
  }

  return results;
}

function calculateCurrentHora() {
  const panchang = calculatePanchang();
  return panchang.hora;
}

module.exports = {
  calculateCurrentPlanetaryEphemeris,
  calculateCurrentHora,
  calculatePanchang,
  NAVAGRAHA_CONFIG,
  RASHIS,
  NAKSHATRAS
};
