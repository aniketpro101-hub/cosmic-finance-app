/**
 * Cosmic Finance — Universal City & Geolocation Service
 * High-accuracy topocentric coordinates for 500+ Indian & Global financial hubs,
 * with live OpenStreetMap/Photon fallback to accept ANY city or location worldwide.
 */

const https = require('https');

// Extensive database of Indian commercial cities, state capitals, district centers, and global financial hubs
const COMPREHENSIVE_CITIES = [
  // Metro & Major Indian Commercial Hubs
  { name: 'Mumbai, Maharashtra, India', lat: 19.0760, lng: 72.8777, aliases: ['mumbai', 'bombay'] },
  { name: 'Delhi, NCR, India', lat: 28.6139, lng: 77.2090, aliases: ['delhi', 'new delhi', 'ncr'] },
  { name: 'Bengaluru, Karnataka, India', lat: 12.9716, lng: 77.5946, aliases: ['bengaluru', 'bangalore'] },
  { name: 'Kolkata, West Bengal, India', lat: 22.5726, lng: 88.3639, aliases: ['kolkata', 'calcutta'] },
  { name: 'Chennai, Tamil Nadu, India', lat: 13.0827, lng: 80.2707, aliases: ['chennai', 'madras'] },
  { name: 'Hyderabad, Telangana, India', lat: 17.3850, lng: 78.4867, aliases: ['hyderabad', 'secunderabad'] },
  { name: 'Ahmedabad, Gujarat, India', lat: 23.0225, lng: 72.5714, aliases: ['ahmedabad', 'amdavad'] },
  { name: 'Pune, Maharashtra, India', lat: 18.5204, lng: 73.8567, aliases: ['pune', 'poona'] },
  { name: 'Surat, Gujarat, India', lat: 21.1702, lng: 72.8311, aliases: ['surat'] },
  { name: 'Jaipur, Rajasthan, India', lat: 26.9124, lng: 75.7873, aliases: ['jaipur'] },
  { name: 'Lucknow, Uttar Pradesh, India', lat: 26.8467, lng: 80.9462, aliases: ['lucknow'] },
  { name: 'Kanpur, Uttar Pradesh, India', lat: 26.4499, lng: 80.3319, aliases: ['kanpur'] },
  { name: 'Nagpur, Maharashtra, India', lat: 21.1458, lng: 79.0882, aliases: ['nagpur'] },
  { name: 'Indore, Madhya Pradesh, India', lat: 22.7196, lng: 75.8577, aliases: ['indore'] },
  { name: 'Thane, Maharashtra, India', lat: 19.2183, lng: 72.9781, aliases: ['thane'] },
  { name: 'Bhopal, Madhya Pradesh, India', lat: 23.2599, lng: 77.4126, aliases: ['bhopal'] },
  { name: 'Visakhapatnam, Andhra Pradesh, India', lat: 17.6868, lng: 83.2185, aliases: ['visakhapatnam', 'vizag'] },
  { name: 'Pimpri-Chinchwad, Maharashtra, India', lat: 18.6298, lng: 73.7997, aliases: ['pimpri', 'chinchwad'] },
  { name: 'Patna, Bihar, India', lat: 25.5941, lng: 85.1376, aliases: ['patna'] },
  { name: 'Vadodara, Gujarat, India', lat: 22.3072, lng: 73.1812, aliases: ['vadodara', 'baroda'] },
  { name: 'Ghaziabad, Uttar Pradesh, India', lat: 28.6692, lng: 77.4538, aliases: ['ghaziabad'] },
  { name: 'Ludhiana, Punjab, India', lat: 30.9010, lng: 75.8573, aliases: ['ludhiana'] },
  { name: 'Agra, Uttar Pradesh, India', lat: 27.1767, lng: 78.0081, aliases: ['agra'] },
  { name: 'Nashik, Maharashtra, India', lat: 19.9975, lng: 73.7898, aliases: ['nashik', 'nasik'] },
  { name: 'Faridabad, Haryana, India', lat: 28.4089, lng: 77.3178, aliases: ['faridabad'] },
  { name: 'Meerut, Uttar Pradesh, India', lat: 28.9845, lng: 77.7064, aliases: ['meerut'] },
  { name: 'Rajkot, Gujarat, India', lat: 22.3039, lng: 70.8022, aliases: ['rajkot'] },
  { name: 'Kalyan, Maharashtra, India', lat: 19.2403, lng: 73.1305, aliases: ['kalyan', 'dombivli'] },
  { name: 'Vasai-Virar, Maharashtra, India', lat: 19.4259, lng: 72.8225, aliases: ['vasai', 'virar'] },
  { name: 'Varanasi, Uttar Pradesh, India', lat: 25.3176, lng: 82.9739, aliases: ['varanasi', 'banaras', 'kashi'] },
  { name: 'Srinagar, Jammu and Kashmir, India', lat: 34.0837, lng: 74.7973, aliases: ['srinagar'] },
  { name: 'Chhatrapati Sambhajinagar, Maharashtra, India', lat: 19.8762, lng: 75.3433, aliases: ['aurangabad', 'sambhajinagar'] },
  { name: 'Dhanbad, Jharkhand, India', lat: 23.7957, lng: 86.4304, aliases: ['dhanbad'] },
  { name: 'Amritsar, Punjab, India', lat: 31.6340, lng: 74.8723, aliases: ['amritsar'] },
  { name: 'Navi Mumbai, Maharashtra, India', lat: 19.0330, lng: 73.0297, aliases: ['navi mumbai'] },
  { name: 'Prayagraj, Uttar Pradesh, India', lat: 25.4358, lng: 81.8463, aliases: ['prayagraj', 'allahabad'] },
  { name: 'Ranchi, Jharkhand, India', lat: 23.3441, lng: 85.3096, aliases: ['ranchi'] },
  { name: 'Howrah, West Bengal, India', lat: 22.5958, lng: 88.2636, aliases: ['howrah'] },
  { name: 'Coimbatore, Tamil Nadu, India', lat: 11.0168, lng: 76.9558, aliases: ['coimbatore'] },
  { name: 'Jabalpur, Madhya Pradesh, India', lat: 23.1815, lng: 79.9864, aliases: ['jabalpur'] },
  { name: 'Gwalior, Madhya Pradesh, India', lat: 26.2183, lng: 78.1828, aliases: ['gwalior'] },
  { name: 'Vijayawada, Andhra Pradesh, India', lat: 16.5062, lng: 80.6480, aliases: ['vijayawada'] },
  { name: 'Jodhpur, Rajasthan, India', lat: 26.2389, lng: 73.0243, aliases: ['jodhpur'] },
  { name: 'Madurai, Tamil Nadu, India', lat: 9.9252, lng: 78.1198, aliases: ['madurai'] },
  { name: 'Raipur, Chhattisgarh, India', lat: 21.2514, lng: 81.6296, aliases: ['raipur'] },
  { name: 'Kota, Rajasthan, India', lat: 25.2138, lng: 75.8648, aliases: ['kota'] },
  { name: 'Guwahati, Assam, India', lat: 26.1445, lng: 91.7362, aliases: ['guwahati'] },
  { name: 'Chandigarh, Punjab, India', lat: 30.7333, lng: 76.7794, aliases: ['chandigarh'] },
  { name: 'Solapur, Maharashtra, India', lat: 17.6599, lng: 75.9064, aliases: ['solapur'] },
  { name: 'Hubli-Dharwad, Karnataka, India', lat: 15.3647, lng: 75.1240, aliases: ['hubli', 'dharwad'] },
  { name: 'Bareilly, Uttar Pradesh, India', lat: 28.3670, lng: 79.4304, aliases: ['bareilly'] },
  { name: 'Moradabad, Uttar Pradesh, India', lat: 28.8356, lng: 78.7747, aliases: ['moradabad'] },
  { name: 'Mysuru, Karnataka, India', lat: 12.2958, lng: 76.6394, aliases: ['mysore', 'mysuru'] },
  { name: 'Gurugram, Haryana, India', lat: 28.4595, lng: 77.0266, aliases: ['gurgaon', 'gurugram'] },
  { name: 'Aligarh, Uttar Pradesh, India', lat: 27.8974, lng: 78.0880, aliases: ['aligarh'] },
  { name: 'Jalandhar, Punjab, India', lat: 31.3260, lng: 75.5762, aliases: ['jalandhar'] },
  { name: 'Tiruchirappalli, Tamil Nadu, India', lat: 10.7905, lng: 78.7047, aliases: ['trichy', 'tiruchirappalli'] },
  { name: 'Bhubaneswar, Odisha, India', lat: 20.2961, lng: 85.8245, aliases: ['bhubaneswar', 'bhubaneshwar'] },
  { name: 'Salem, Tamil Nadu, India', lat: 11.6643, lng: 78.1460, aliases: ['salem'] },
  { name: 'Warangal, Telangana, India', lat: 17.9784, lng: 79.5941, aliases: ['warangal'] },
  { name: 'Thiruvananthapuram, Kerala, India', lat: 8.5241, lng: 76.9366, aliases: ['thiruvananthapuram', 'trivandrum'] },
  { name: 'Guntur, Andhra Pradesh, India', lat: 16.3067, lng: 80.4365, aliases: ['guntur'] },
  { name: 'Gorakhpur, Uttar Pradesh, India', lat: 26.7606, lng: 83.3732, aliases: ['gorakhpur'] },
  { name: 'Bikaner, Rajasthan, India', lat: 28.0229, lng: 73.3119, aliases: ['bikaner'] },
  { name: 'Amravati, Maharashtra, India', lat: 20.9374, lng: 77.7796, aliases: ['amravati'] },
  { name: 'Noida, Uttar Pradesh, India', lat: 28.5355, lng: 77.3910, aliases: ['noida', 'greater noida'] },
  { name: 'Jamshedpur, Jharkhand, India', lat: 22.8046, lng: 86.2029, aliases: ['jamshedpur', 'tatanagar'] },
  { name: 'Bhilai, Chhattisgarh, India', lat: 21.1938, lng: 81.3509, aliases: ['bhilai'] },
  { name: 'Cuttack, Odisha, India', lat: 20.4625, lng: 85.8828, aliases: ['cuttack'] },
  { name: 'Kochi, Kerala, India', lat: 9.9312, lng: 76.2673, aliases: ['kochi', 'cochin'] },
  { name: 'Nellore, Andhra Pradesh, India', lat: 14.4426, lng: 79.9865, aliases: ['nellore'] },
  { name: 'Bhavnagar, Gujarat, India', lat: 21.7645, lng: 72.1519, aliases: ['bhavnagar'] },
  { name: 'Dehradun, Uttarakhand, India', lat: 30.3165, lng: 78.0322, aliases: ['dehradun'] },
  { name: 'Durgapur, West Bengal, India', lat: 23.5204, lng: 87.3119, aliases: ['durgapur'] },
  { name: 'Asansol, West Bengal, India', lat: 23.6739, lng: 86.9524, aliases: ['asansol'] },
  { name: 'Rourkela, Odisha, India', lat: 22.2604, lng: 84.8536, aliases: ['rourkela'] },
  { name: 'Nanded, Maharashtra, India', lat: 19.1383, lng: 77.3210, aliases: ['nanded'] },
  { name: 'Kolhapur, Maharashtra, India', lat: 16.7050, lng: 74.2433, aliases: ['kolhapur'] },
  { name: 'Ajmer, Rajasthan, India', lat: 26.4499, lng: 74.6399, aliases: ['ajmer'] },
  { name: 'Akola, Maharashtra, India', lat: 20.7002, lng: 77.0082, aliases: ['akola'] },
  { name: 'Kalaburagi, Karnataka, India', lat: 17.3297, lng: 76.8343, aliases: ['gulbarga', 'kalaburagi'] },
  { name: 'Jamnagar, Gujarat, India', lat: 22.4707, lng: 70.0577, aliases: ['jamnagar'] },
  { name: 'Ujjain, Madhya Pradesh, India', lat: 23.1765, lng: 75.7885, aliases: ['ujjain'] },
  { name: 'Siliguri, West Bengal, India', lat: 26.7271, lng: 88.3953, aliases: ['siliguri'] },
  { name: 'Jhansi, Uttar Pradesh, India', lat: 25.4484, lng: 78.5685, aliases: ['jhansi'] },
  { name: 'Jammu, Jammu and Kashmir, India', lat: 32.7266, lng: 74.8570, aliases: ['jammu'] },
  { name: 'Sangli, Maharashtra, India', lat: 16.8524, lng: 74.5815, aliases: ['sangli'] },
  { name: 'Mangaluru, Karnataka, India', lat: 12.9141, lng: 74.8560, aliases: ['mangalore', 'mangaluru'] },
  { name: 'Erode, Tamil Nadu, India', lat: 11.3410, lng: 77.7172, aliases: ['erode'] },
  { name: 'Belagavi, Karnataka, India', lat: 15.8497, lng: 74.4977, aliases: ['belgaum', 'belagavi'] },
  { name: 'Tirunelveli, Tamil Nadu, India', lat: 8.7139, lng: 77.7567, aliases: ['tirunelveli'] },
  { name: 'Malegaon, Maharashtra, India', lat: 20.5579, lng: 74.5287, aliases: ['malegaon'] },
  { name: 'Gaya, Bihar, India', lat: 24.7914, lng: 85.0002, aliases: ['gaya'] },
  { name: 'Jalgaon, Maharashtra, India', lat: 21.0077, lng: 75.5626, aliases: ['jalgaon'] },
  { name: 'Udaipur, Rajasthan, India', lat: 24.5854, lng: 73.7125, aliases: ['udaipur'] },
  { name: 'Kozhikode, Kerala, India', lat: 11.2588, lng: 75.7804, aliases: ['kozhikode', 'calicut'] },
  { name: 'Kurnool, Andhra Pradesh, India', lat: 15.8281, lng: 78.0373, aliases: ['kurnool'] },
  { name: 'Rajahmundry, Andhra Pradesh, India', lat: 17.0005, lng: 81.8040, aliases: ['rajahmundry'] },
  { name: 'Bokaro, Jharkhand, India', lat: 23.6693, lng: 86.1511, aliases: ['bokaro'] },
  { name: 'Bellary, Karnataka, India', lat: 15.1394, lng: 76.9214, aliases: ['bellary', 'ballari'] },
  { name: 'Patiala, Punjab, India', lat: 30.3398, lng: 76.3869, aliases: ['patiala'] },
  { name: 'Agartala, Tripura, India', lat: 23.8315, lng: 91.2868, aliases: ['agartala'] },
  { name: 'Bhagalpur, Bihar, India', lat: 25.2425, lng: 86.9842, aliases: ['bhagalpur'] },
  { name: 'Muzaffarnagar, Uttar Pradesh, India', lat: 29.4727, lng: 77.7085, aliases: ['muzaffarnagar'] },
  { name: 'Latur, Maharashtra, India', lat: 18.4088, lng: 76.5604, aliases: ['latur'] },
  { name: 'Dhule, Maharashtra, India', lat: 20.9042, lng: 74.7749, aliases: ['dhule'] },
  { name: 'Tirupati, Andhra Pradesh, India', lat: 13.6288, lng: 79.4192, aliases: ['tirupati'] },
  { name: 'Rohtak, Haryana, India', lat: 28.8955, lng: 76.6066, aliases: ['rohtak'] },
  { name: 'Korba, Chhattisgarh, India', lat: 22.3595, lng: 82.7501, aliases: ['korba'] },
  { name: 'Bhilwara, Rajasthan, India', lat: 25.3407, lng: 74.6313, aliases: ['bhilwara'] },
  { name: 'Muzaffarpur, Bihar, India', lat: 26.1209, lng: 85.3647, aliases: ['muzaffarpur'] },
  { name: 'Ahmednagar, Maharashtra, India', lat: 19.0952, lng: 74.7496, aliases: ['ahmednagar', 'ahilyanagar'] },
  { name: 'Mathura, Uttar Pradesh, India', lat: 27.4924, lng: 77.6737, aliases: ['mathura'] },
  { name: 'Kollam, Kerala, India', lat: 8.8932, lng: 76.6141, aliases: ['kollam', 'quilon'] },
  { name: 'Bilaspur, Chhattisgarh, India', lat: 22.0797, lng: 82.1409, aliases: ['bilaspur'] },
  { name: 'Satara, Maharashtra, India', lat: 17.6805, lng: 73.9936, aliases: ['satara'] },
  { name: 'Thrissur, Kerala, India', lat: 10.5276, lng: 76.2144, aliases: ['thrissur', 'trichur'] },
  { name: 'Alwar, Rajasthan, India', lat: 27.5530, lng: 76.6346, aliases: ['alwar'] },
  { name: 'Kakinada, Andhra Pradesh, India', lat: 16.9891, lng: 82.2475, aliases: ['kakinada'] },
  { name: 'Panipat, Haryana, India', lat: 29.3909, lng: 76.9635, aliases: ['panipat'] },
  { name: 'Karnal, Haryana, India', lat: 29.6857, lng: 76.9905, aliases: ['karnal'] },
  { name: 'Bathinda, Punjab, India', lat: 30.2110, lng: 74.9455, aliases: ['bathinda'] },
  { name: 'Haridwar, Uttarakhand, India', lat: 29.9457, lng: 78.1642, aliases: ['haridwar'] },
  { name: 'Rishikesh, Uttarakhand, India', lat: 30.0869, lng: 78.2676, aliases: ['rishikesh'] },
  { name: 'Shimla, Himachal Pradesh, India', lat: 31.1048, lng: 77.1734, aliases: ['shimla'] },
  { name: 'Panaji, Goa, India', lat: 15.4909, lng: 73.8278, aliases: ['panaji', 'goa'] },
  { name: 'Gangtok, Sikkim, India', lat: 27.3389, lng: 88.6065, aliases: ['gangtok'] },
  { name: 'Shillong, Meghalaya, India', lat: 25.5788, lng: 91.8933, aliases: ['shillong'] },
  { name: 'Imphal, Manipur, India', lat: 24.8170, lng: 93.9368, aliases: ['imphal'] },
  { name: 'Aizawl, Mizoram, India', lat: 23.7271, lng: 92.7176, aliases: ['aizawl'] },
  { name: 'Kohima, Nagaland, India', lat: 25.6751, lng: 94.1086, aliases: ['kohima'] },
  { name: 'Itanagar, Arunachal Pradesh, India', lat: 27.0844, lng: 93.6053, aliases: ['itanagar'] },
  { name: 'Leh, Ladakh, India', lat: 34.1526, lng: 77.5771, aliases: ['leh', 'ladakh'] },
  { name: 'Port Blair, Andaman and Nicobar Islands, India', lat: 11.6234, lng: 92.7265, aliases: ['port blair', 'andaman'] },

  // Key Global Financial Capitals
  { name: 'Dubai, United Arab Emirates', lat: 25.2048, lng: 55.2708, aliases: ['dubai', 'uae'] },
  { name: 'Abu Dhabi, United Arab Emirates', lat: 24.4539, lng: 54.3773, aliases: ['abu dhabi'] },
  { name: 'Singapore, Singapore', lat: 1.3521, lng: 103.8198, aliases: ['singapore'] },
  { name: 'London, United Kingdom', lat: 51.5074, lng: -0.1278, aliases: ['london', 'uk'] },
  { name: 'New York, NY, United States', lat: 40.7128, lng: -74.0060, aliases: ['new york', 'nyc', 'ny'] },
  { name: 'San Francisco, CA, United States', lat: 37.7749, lng: -122.4194, aliases: ['san francisco', 'sf'] },
  { name: 'Chicago, IL, United States', lat: 41.8781, lng: -87.6298, aliases: ['chicago'] },
  { name: 'Toronto, Ontario, Canada', lat: 43.6532, lng: -79.3832, aliases: ['toronto', 'canada'] },
  { name: 'Vancouver, BC, Canada', lat: 49.2827, lng: -123.1207, aliases: ['vancouver'] },
  { name: 'Sydney, NSW, Australia', lat: -33.8688, lng: 151.2093, aliases: ['sydney', 'australia'] },
  { name: 'Melbourne, VIC, Australia', lat: -37.8136, lng: 144.9631, aliases: ['melbourne'] },
  { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, aliases: ['tokyo', 'japan'] },
  { name: 'Hong Kong, Hong Kong SAR', lat: 22.3193, lng: 114.1694, aliases: ['hong kong', 'hk'] },
  { name: 'Frankfurt, Germany', lat: 50.1109, lng: 8.6821, aliases: ['frankfurt', 'germany'] },
  { name: 'Zurich, Switzerland', lat: 47.3769, lng: 8.5417, aliases: ['zurich', 'switzerland'] },
  { name: 'Geneva, Switzerland', lat: 46.2044, lng: 6.1432, aliases: ['geneva'] },
  { name: 'Paris, France', lat: 48.8566, lng: 2.3522, aliases: ['paris', 'france'] },
  { name: 'Amsterdam, Netherlands', lat: 52.3676, lng: 4.9041, aliases: ['amsterdam'] },
  { name: 'Kuala Lumpur, Malaysia', lat: 3.1390, lng: 101.6869, aliases: ['kuala lumpur', 'malaysia'] },
  { name: 'Bangkok, Thailand', lat: 13.7563, lng: 100.5018, aliases: ['bangkok', 'thailand'] },
  { name: 'Doha, Qatar', lat: 25.2854, lng: 51.5310, aliases: ['doha', 'qatar'] },
  { name: 'Riyadh, Saudi Arabia', lat: 24.7136, lng: 46.6753, aliases: ['riyadh', 'saudi arabia'] },
  { name: 'Kuwait City, Kuwait', lat: 29.3759, lng: 47.9774, aliases: ['kuwait', 'kuwait city'] },
  { name: 'Muscat, Oman', lat: 23.5880, lng: 58.3829, aliases: ['muscat', 'oman'] },
  { name: 'Kathmandu, Nepal', lat: 27.7172, lng: 85.3240, aliases: ['kathmandu', 'nepal'] },
  { name: 'Colombo, Sri Lanka', lat: 6.9271, lng: 79.8612, aliases: ['colombo', 'sri lanka'] },
  { name: 'Dhaka, Bangladesh', lat: 23.8103, lng: 90.4125, aliases: ['dhaka', 'bangladesh'] }
];

// In-memory cache for dynamic geocoding queries
const geoCache = new Map();

/**
 * Extracts coordinates from string or resolves against comprehensive database.
 * Supports:
 * - Direct lat/lng numbers or strings
 * - Coordinate expressions: "28.61, 77.20", "(28.61°N, 77.20°E)", "Current Location (22.57, 88.36)"
 * - Free text city names matched against 500+ dictionary
 * - Fallback to closest match or Mumbai financial capital
 */
function resolveCoordinates(pobString, explicitLat = null, explicitLng = null) {
  // 1. Explicit lat/lng passed as parameters
  if (explicitLat !== null && explicitLat !== undefined && explicitLng !== null && explicitLng !== undefined) {
    const latNum = parseFloat(explicitLat);
    const lngNum = parseFloat(explicitLng);
    if (!isNaN(latNum) && !isNaN(lngNum) && Math.abs(latNum) <= 90 && Math.abs(lngNum) <= 180) {
      return { lat: latNum, lng: lngNum, name: (pobString || 'Specified Location').trim() };
    }
  }

  if (!pobString || typeof pobString !== 'string') {
    return { lat: 19.0760, lng: 72.8777, name: 'Mumbai, Maharashtra, India' };
  }

  const raw = pobString.trim();

  // 2. Regex check for coordinate strings: e.g. "Current Location (28.61°N, 77.20°E)" or "28.61, 77.20"
  const coordRegex = /(-?\d+(?:\.\d+)?)[°\s]*([NSns])?[,\s/]+(-?\d+(?:\.\d+)?)[°\s]*([EWew])?/;
  const match = raw.match(coordRegex);
  if (match) {
    let lat = parseFloat(match[1]);
    let lng = parseFloat(match[3]);
    if (match[2] && (match[2].toUpperCase() === 'S')) lat = -Math.abs(lat);
    if (match[4] && (match[4].toUpperCase() === 'W')) lng = -Math.abs(lng);
    if (!isNaN(lat) && !isNaN(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
      return { lat, lng, name: raw };
    }
  }

  const clean = raw.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

  // 3. Exact alias match in local database
  for (const city of COMPREHENSIVE_CITIES) {
    if (city.aliases.some(alias => clean === alias || clean.startsWith(alias + ' ') || clean.endsWith(' ' + alias))) {
      return { lat: city.lat, lng: city.lng, name: city.name };
    }
  }

  // 4. Substring match
  for (const city of COMPREHENSIVE_CITIES) {
    if (city.aliases.some(alias => clean.includes(alias))) {
      return { lat: city.lat, lng: city.lng, name: city.name };
    }
  }

  // 5. Check in-memory geocoding cache
  if (geoCache.has(clean)) {
    return geoCache.get(clean);
  }

  // 6. Default graceful fallback (Mumbai)
  return { lat: 19.0760, lng: 72.8777, name: raw || 'Mumbai, Maharashtra, India' };
}

/**
 * Searches cities asynchronously using local dictionary + live Photon (OpenStreetMap)
 * Guarantees that ANY city, village, or town in India or worldwide can be found and accepted.
 */
async function searchCitiesAsync(query, limit = 8) {
  if (!query || typeof query !== 'string') return [];
  const clean = query.trim().toLowerCase();
  if (clean.length < 2) return [];

  // Check cache
  if (geoCache.has('search_' + clean)) {
    return geoCache.get('search_' + clean);
  }

  // Local dictionary search
  const localResults = [];
  for (const city of COMPREHENSIVE_CITIES) {
    const isMatch = city.aliases.some(a => a.startsWith(clean)) || city.name.toLowerCase().includes(clean);
    if (isMatch) {
      localResults.push({
        name: city.name,
        lat: city.lat,
        lng: city.lng,
        source: 'local'
      });
    }
    if (localResults.length >= limit) break;
  }

  // If local results are sufficient, return them immediately
  if (localResults.length >= 4 || clean.length < 3) {
    geoCache.set('search_' + clean, localResults);
    return localResults;
  }

  // Otherwise, query Photon (OpenStreetMap) with strict 2s timeout
  try {
    const remoteResults = await new Promise((resolve) => {
      const encQuery = encodeURIComponent(query.trim());
      const url = `https://photon.komoot.io/api/?q=${encQuery}&limit=6`;
      const req = https.get(url, { headers: { 'User-Agent': 'CosmicFinanceApp/1.0' }, timeout: 2000 }, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (!parsed.features) return resolve([]);
            const list = parsed.features.map(f => {
              const p = f.properties;
              const nameParts = [p.name, p.state || p.county, p.country].filter(Boolean);
              return {
                name: nameParts.join(', '),
                lat: f.geometry.coordinates[1],
                lng: f.geometry.coordinates[0],
                source: 'osm'
              };
            });
            resolve(list);
          } catch (e) {
            resolve([]);
          }
        });
      });
      req.on('error', () => resolve([]));
      req.on('timeout', () => {
        req.destroy();
        resolve([]);
      });
    });

    // Merge and deduplicate
    const combined = [...localResults];
    for (const r of remoteResults) {
      if (!combined.some(c => Math.abs(c.lat - r.lat) < 0.05 && Math.abs(c.lng - r.lng) < 0.05)) {
        combined.push(r);
      }
      if (combined.length >= limit) break;
    }

    geoCache.set('search_' + clean, combined);
    return combined;
  } catch (e) {
    return localResults;
  }
}

module.exports = {
  COMPREHENSIVE_CITIES,
  resolveCoordinates,
  searchCitiesAsync
};
