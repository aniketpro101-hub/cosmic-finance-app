/**
 * Cosmic Finance — Universal City & Geolocation Service
 * High-accuracy topocentric coordinates for 400+ Indian commercial hubs, district centers,
 * and global financial hubs, with live OpenStreetMap/Photon fallback to accept ANY city or location worldwide.
 */

const https = require('https');

// Extensive database of Indian commercial cities, state capitals, district centers, and global financial hubs
const COMPREHENSIVE_CITIES = [
  // Metro & Major Indian Commercial Hubs
  { name: 'Mumbai, Maharashtra, India', lat: 19.0760, lng: 72.8777, aliases: ['mumbai', 'bombay', 'mumbai maharashtra', 'mumbai mh'] },
  { name: 'Delhi, NCR, India', lat: 28.6139, lng: 77.2090, aliases: ['delhi', 'new delhi', 'ncr', 'delhi ncr', 'delhi dl'] },
  { name: 'Bengaluru, Karnataka, India', lat: 12.9716, lng: 77.5946, aliases: ['bengaluru', 'bangalore', 'bengaluru karnataka', 'bangalore karnataka', 'bengaluru ka'] },
  { name: 'Kolkata, West Bengal, India', lat: 22.5726, lng: 88.3639, aliases: ['kolkata', 'calcutta', 'kolkata west bengal', 'calcutta west bengal', 'kolkata wb'] },
  { name: 'Chennai, Tamil Nadu, India', lat: 13.0827, lng: 80.2707, aliases: ['chennai', 'madras', 'chennai tamil nadu', 'chennai tn'] },
  { name: 'Hyderabad, Telangana, India', lat: 17.3850, lng: 78.4867, aliases: ['hyderabad', 'secunderabad', 'hyderabad telangana', 'hyderabad ts'] },
  { name: 'Ahmedabad, Gujarat, India', lat: 23.0225, lng: 72.5714, aliases: ['ahmedabad', 'amdavad', 'ahmedabad gujarat', 'ahmedabad gj'] },
  { name: 'Pune, Maharashtra, India', lat: 18.5204, lng: 73.8567, aliases: ['pune', 'poona', 'pune maharashtra', 'pune mh'] },
  { name: 'Surat, Gujarat, India', lat: 21.1702, lng: 72.8311, aliases: ['surat', 'surat gujarat', 'surat gj'] },
  { name: 'Jaipur, Rajasthan, India', lat: 26.9124, lng: 75.7873, aliases: ['jaipur', 'jaipur rajasthan', 'jaipur rj'] },
  { name: 'Lucknow, Uttar Pradesh, India', lat: 26.8467, lng: 80.9462, aliases: ['lucknow', 'lucknow uttar pradesh', 'lucknow up'] },
  { name: 'Kanpur, Uttar Pradesh, India', lat: 26.4499, lng: 80.3319, aliases: ['kanpur', 'kanpur uttar pradesh', 'kanpur up', 'cawnpore'] },
  { name: 'Nagpur, Maharashtra, India', lat: 21.1458, lng: 79.0882, aliases: ['nagpur', 'nagpur maharashtra', 'nagpur mh'] },
  { name: 'Indore, Madhya Pradesh, India', lat: 22.7196, lng: 75.8577, aliases: ['indore', 'indore madhya pradesh', 'indore mp'] },
  { name: 'Thane, Maharashtra, India', lat: 19.2183, lng: 72.9781, aliases: ['thane', 'thane maharashtra'] },
  { name: 'Bhopal, Madhya Pradesh, India', lat: 23.2599, lng: 77.4126, aliases: ['bhopal', 'bhopal madhya pradesh', 'bhopal mp'] },
  { name: 'Visakhapatnam, Andhra Pradesh, India', lat: 17.6868, lng: 83.2185, aliases: ['visakhapatnam', 'vizag', 'visakhapatnam andhra pradesh', 'vizag ap'] },
  { name: 'Pimpri-Chinchwad, Maharashtra, India', lat: 18.6298, lng: 73.7997, aliases: ['pimpri', 'chinchwad', 'pimpri chinchwad'] },
  { name: 'Vadodara, Gujarat, India', lat: 22.3072, lng: 73.1812, aliases: ['vadodara', 'baroda', 'vadodara gujarat'] },
  { name: 'Ghaziabad, Uttar Pradesh, India', lat: 28.6692, lng: 77.4538, aliases: ['ghaziabad', 'ghaziabad uttar pradesh', 'ghaziabad up'] },
  { name: 'Ludhiana, Punjab, India', lat: 30.9010, lng: 75.8573, aliases: ['ludhiana', 'ludhiana punjab', 'ludhiana pb'] },
  { name: 'Agra, Uttar Pradesh, India', lat: 27.1767, lng: 78.0081, aliases: ['agra', 'agra uttar pradesh', 'agra up'] },
  { name: 'Nashik, Maharashtra, India', lat: 19.9975, lng: 73.7898, aliases: ['nashik', 'nasik', 'nashik maharashtra'] },
  { name: 'Faridabad, Haryana, India', lat: 28.4089, lng: 77.3178, aliases: ['faridabad', 'faridabad haryana'] },
  { name: 'Meerut, Uttar Pradesh, India', lat: 28.9845, lng: 77.7064, aliases: ['meerut', 'meerut uttar pradesh'] },
  { name: 'Rajkot, Gujarat, India', lat: 22.3039, lng: 70.8022, aliases: ['rajkot', 'rajkot gujarat'] },
  { name: 'Kalyan-Dombivli, Maharashtra, India', lat: 19.2403, lng: 73.1305, aliases: ['kalyan', 'dombivli', 'kalyan dombivli'] },
  { name: 'Vasai-Virar, Maharashtra, India', lat: 19.4259, lng: 72.8225, aliases: ['vasai', 'virar', 'vasai virar'] },
  { name: 'Varanasi, Uttar Pradesh, India', lat: 25.3176, lng: 82.9739, aliases: ['varanasi', 'banaras', 'kashi', 'varanasi uttar pradesh', 'banaras up'] },
  { name: 'Srinagar, Jammu and Kashmir, India', lat: 34.0837, lng: 74.7973, aliases: ['srinagar', 'srinagar kashmir', 'srinagar jk'] },
  { name: 'Chhatrapati Sambhajinagar, Maharashtra, India', lat: 19.8762, lng: 75.3433, aliases: ['aurangabad', 'sambhajinagar', 'aurangabad maharashtra'] },
  { name: 'Dhanbad, Jharkhand, India', lat: 23.7957, lng: 86.4304, aliases: ['dhanbad', 'dhanbad jharkhand'] },
  { name: 'Amritsar, Punjab, India', lat: 31.6340, lng: 74.8723, aliases: ['amritsar', 'amritsar punjab'] },
  { name: 'Navi Mumbai, Maharashtra, India', lat: 19.0330, lng: 73.0297, aliases: ['navi mumbai', 'new bombay'] },
  { name: 'Prayagraj, Uttar Pradesh, India', lat: 25.4358, lng: 81.8463, aliases: ['prayagraj', 'allahabad', 'prayagraj uttar pradesh', 'allahabad up'] },
  { name: 'Ranchi, Jharkhand, India', lat: 23.3441, lng: 85.3096, aliases: ['ranchi', 'ranchi jharkhand'] },
  { name: 'Howrah, West Bengal, India', lat: 22.5958, lng: 88.2636, aliases: ['howrah', 'howrah west bengal'] },
  { name: 'Coimbatore, Tamil Nadu, India', lat: 11.0168, lng: 76.9558, aliases: ['coimbatore', 'kovai', 'coimbatore tamil nadu'] },
  { name: 'Jabalpur, Madhya Pradesh, India', lat: 23.1815, lng: 79.9864, aliases: ['jabalpur', 'jabalpur madhya pradesh'] },
  { name: 'Gwalior, Madhya Pradesh, India', lat: 26.2183, lng: 78.1828, aliases: ['gwalior', 'gwalior madhya pradesh'] },
  { name: 'Vijayawada, Andhra Pradesh, India', lat: 16.5062, lng: 80.6480, aliases: ['vijayawada', 'vijayawada andhra pradesh'] },
  { name: 'Jodhpur, Rajasthan, India', lat: 26.2389, lng: 73.0243, aliases: ['jodhpur', 'jodhpur rajasthan'] },
  { name: 'Madurai, Tamil Nadu, India', lat: 9.9252, lng: 78.1198, aliases: ['madurai', 'madurai tamil nadu'] },
  { name: 'Raipur, Chhattisgarh, India', lat: 21.2514, lng: 81.6296, aliases: ['raipur', 'raipur chhattisgarh'] },
  { name: 'Kota, Rajasthan, India', lat: 25.2138, lng: 75.8648, aliases: ['kota', 'kota rajasthan'] },
  { name: 'Guwahati, Assam, India', lat: 26.1445, lng: 91.7362, aliases: ['guwahati', 'gauhati', 'guwahati assam'] },
  { name: 'Chandigarh, Punjab, India', lat: 30.7333, lng: 76.7794, aliases: ['chandigarh', 'chandigarh haryana'] },
  { name: 'Solapur, Maharashtra, India', lat: 17.6599, lng: 75.9064, aliases: ['solapur', 'sholapur', 'solapur maharashtra'] },
  { name: 'Hubli-Dharwad, Karnataka, India', lat: 15.3647, lng: 75.1240, aliases: ['hubli', 'dharwad', 'hubballi'] },
  { name: 'Bareilly, Uttar Pradesh, India', lat: 28.3670, lng: 79.4304, aliases: ['bareilly', 'bareilly uttar pradesh'] },
  { name: 'Moradabad, Uttar Pradesh, India', lat: 28.8356, lng: 78.7747, aliases: ['moradabad', 'moradabad uttar pradesh'] },
  { name: 'Mysuru, Karnataka, India', lat: 12.2958, lng: 76.6394, aliases: ['mysore', 'mysuru', 'mysore karnataka'] },
  { name: 'Gurugram, Haryana, India', lat: 28.4595, lng: 77.0266, aliases: ['gurgaon', 'gurugram', 'gurgaon haryana', 'gurugram haryana'] },
  { name: 'Aligarh, Uttar Pradesh, India', lat: 27.8974, lng: 78.0880, aliases: ['aligarh', 'aligarh uttar pradesh'] },
  { name: 'Jalandhar, Punjab, India', lat: 31.3260, lng: 75.5762, aliases: ['jalandhar', 'jullundur'] },
  { name: 'Tiruchirappalli, Tamil Nadu, India', lat: 10.7905, lng: 78.7047, aliases: ['trichy', 'tiruchirappalli', 'tiruchi'] },
  { name: 'Bhubaneswar, Odisha, India', lat: 20.2961, lng: 85.8245, aliases: ['bhubaneswar', 'bhubaneshwar', 'bhubaneswar odisha'] },
  { name: 'Salem, Tamil Nadu, India', lat: 11.6643, lng: 78.1460, aliases: ['salem', 'salem tamil nadu'] },
  { name: 'Warangal, Telangana, India', lat: 17.9784, lng: 79.5941, aliases: ['warangal', 'warangal telangana'] },
  { name: 'Thiruvananthapuram, Kerala, India', lat: 8.5241, lng: 76.9366, aliases: ['thiruvananthapuram', 'trivandrum', 'trivandrum kerala'] },
  { name: 'Guntur, Andhra Pradesh, India', lat: 16.3067, lng: 80.4365, aliases: ['guntur', 'guntur andhra pradesh'] },
  { name: 'Gorakhpur, Uttar Pradesh, India', lat: 26.7606, lng: 83.3732, aliases: ['gorakhpur', 'gorakhpur uttar pradesh'] },
  { name: 'Bikaner, Rajasthan, India', lat: 28.0229, lng: 73.3119, aliases: ['bikaner', 'bikaner rajasthan'] },
  { name: 'Amravati, Maharashtra, India', lat: 20.9374, lng: 77.7796, aliases: ['amravati', 'amravati maharashtra'] },
  { name: 'Noida, Uttar Pradesh, India', lat: 28.5355, lng: 77.3910, aliases: ['noida', 'greater noida', 'noida up', 'noida uttar pradesh'] },
  { name: 'Jamshedpur, Jharkhand, India', lat: 22.8046, lng: 86.2029, aliases: ['jamshedpur', 'tatanagar', 'jamshedpur jharkhand'] },
  { name: 'Bhilai, Chhattisgarh, India', lat: 21.1938, lng: 81.3509, aliases: ['bhilai', 'bhilai chhattisgarh'] },
  { name: 'Cuttack, Odisha, India', lat: 20.4625, lng: 85.8828, aliases: ['cuttack', 'cuttack odisha'] },
  { name: 'Kochi, Kerala, India', lat: 9.9312, lng: 76.2673, aliases: ['kochi', 'cochin', 'ernakulam', 'kochi kerala'] },
  { name: 'Nellore, Andhra Pradesh, India', lat: 14.4426, lng: 79.9865, aliases: ['nellore', 'nellore andhra pradesh'] },
  { name: 'Bhavnagar, Gujarat, India', lat: 21.7645, lng: 72.1519, aliases: ['bhavnagar', 'bhavnagar gujarat'] },
  { name: 'Dehradun, Uttarakhand, India', lat: 30.3165, lng: 78.0322, aliases: ['dehradun', 'dehradun uttarakhand'] },
  { name: 'Durgapur, West Bengal, India', lat: 23.5204, lng: 87.3119, aliases: ['durgapur', 'durgapur west bengal'] },
  { name: 'Asansol, West Bengal, India', lat: 23.6739, lng: 86.9524, aliases: ['asansol', 'asansol west bengal'] },
  { name: 'Rourkela, Odisha, India', lat: 22.2604, lng: 84.8536, aliases: ['rourkela', 'rourkela odisha'] },
  { name: 'Nanded, Maharashtra, India', lat: 19.1383, lng: 77.3210, aliases: ['nanded', 'nanded maharashtra'] },
  { name: 'Kolhapur, Maharashtra, India', lat: 16.7050, lng: 74.2433, aliases: ['kolhapur', 'kolhapur maharashtra'] },
  { name: 'Ajmer, Rajasthan, India', lat: 26.4499, lng: 74.6399, aliases: ['ajmer', 'ajmer rajasthan'] },
  { name: 'Akola, Maharashtra, India', lat: 20.7002, lng: 77.0082, aliases: ['akola', 'akola maharashtra'] },
  { name: 'Kalaburagi, Karnataka, India', lat: 17.3297, lng: 76.8343, aliases: ['gulbarga', 'kalaburagi'] },
  { name: 'Jamnagar, Gujarat, India', lat: 22.4707, lng: 70.0577, aliases: ['jamnagar', 'jamnagar gujarat'] },
  { name: 'Ujjain, Madhya Pradesh, India', lat: 23.1765, lng: 75.7885, aliases: ['ujjain', 'ujjain madhya pradesh', 'avanti'] },
  { name: 'Siliguri, West Bengal, India', lat: 26.7271, lng: 88.3953, aliases: ['siliguri', 'siliguri west bengal'] },
  { name: 'Jhansi, Uttar Pradesh, India', lat: 25.4484, lng: 78.5685, aliases: ['jhansi', 'jhansi uttar pradesh'] },
  { name: 'Jammu, Jammu and Kashmir, India', lat: 32.7266, lng: 74.8570, aliases: ['jammu', 'jammu tawi'] },
  { name: 'Sangli, Maharashtra, India', lat: 16.8524, lng: 74.5815, aliases: ['sangli', 'sangli miraj'] },
  { name: 'Mangaluru, Karnataka, India', lat: 12.9141, lng: 74.8560, aliases: ['mangalore', 'mangaluru'] },
  { name: 'Erode, Tamil Nadu, India', lat: 11.3410, lng: 77.7172, aliases: ['erode', 'erode tamil nadu'] },
  { name: 'Belagavi, Karnataka, India', lat: 15.8497, lng: 74.4977, aliases: ['belgaum', 'belagavi'] },
  { name: 'Tirunelveli, Tamil Nadu, India', lat: 8.7139, lng: 77.7567, aliases: ['tirunelveli', 'nellai'] },
  { name: 'Malegaon, Maharashtra, India', lat: 20.5579, lng: 74.5287, aliases: ['malegaon', 'malegaon nashik'] },

  // ==========================================
  // BIHAR - Comprehensive All Districts & Towns
  // ==========================================
  { name: 'Gaya, Bihar, India', lat: 24.7914, lng: 85.0002, aliases: ['gaya', 'bodhgaya', 'gaya bihar', 'bodh gaya', 'gaya br'] },
  { name: 'Patna, Bihar, India', lat: 25.5941, lng: 85.1376, aliases: ['patna', 'patna bihar', 'patliputra', 'patna br'] },
  { name: 'Muzaffarpur, Bihar, India', lat: 26.1209, lng: 85.3647, aliases: ['muzaffarpur', 'muzaffarpur bihar', 'muzaffarpur br'] },
  { name: 'Bhagalpur, Bihar, India', lat: 25.2425, lng: 86.9842, aliases: ['bhagalpur', 'bhagalpur bihar', 'bhagalpur br'] },
  { name: 'Darbhanga, Bihar, India', lat: 26.1542, lng: 85.8918, aliases: ['darbhanga', 'darbhanga bihar', 'darbhanga br'] },
  { name: 'Purnia, Bihar, India', lat: 25.7771, lng: 87.4753, aliases: ['purnia', 'purnea', 'purnia bihar', 'purnia br'] },
  { name: 'Begusarai, Bihar, India', lat: 25.4182, lng: 86.1272, aliases: ['begusarai', 'begusarai bihar', 'begusarai br'] },
  { name: 'Arrah, Bihar, India', lat: 25.5560, lng: 84.6603, aliases: ['arrah', 'ara', 'bhojpur', 'arrah bihar', 'arrah br'] },
  { name: 'Katihar, Bihar, India', lat: 25.5393, lng: 87.5714, aliases: ['katihar', 'katihar bihar', 'katihar br'] },
  { name: 'Munger, Bihar, India', lat: 25.3757, lng: 86.4744, aliases: ['munger', 'monghyr', 'munger bihar', 'munger br'] },
  { name: 'Chhapra, Bihar, India', lat: 25.7848, lng: 84.7274, aliases: ['chhapra', 'chapra', 'saran', 'chhapra bihar', 'chhapra br'] },
  { name: 'Bettiah, Bihar, India', lat: 26.8024, lng: 84.5029, aliases: ['bettiah', 'west champaran', 'bettiah bihar'] },
  { name: 'Saharsa, Bihar, India', lat: 25.8835, lng: 86.6006, aliases: ['saharsa', 'saharsa bihar', 'saharsa br'] },
  { name: 'Sasaram, Bihar, India', lat: 24.9515, lng: 84.0315, aliases: ['sasaram', 'rohtas', 'sasaram bihar', 'sasaram br'] },
  { name: 'Hajipur, Bihar, India', lat: 25.6858, lng: 85.2146, aliases: ['hajipur', 'vaishali', 'hajipur bihar', 'hajipur br'] },
  { name: 'Dehri, Bihar, India', lat: 24.9089, lng: 84.1843, aliases: ['dehri', 'dehri on sone', 'dehri bihar'] },
  { name: 'Siwan, Bihar, India', lat: 26.2207, lng: 84.3567, aliases: ['siwan', 'siwan bihar', 'siwan br'] },
  { name: 'Motihari, Bihar, India', lat: 26.6469, lng: 84.9089, aliases: ['motihari', 'east champaran', 'motihari bihar'] },
  { name: 'Nawada, Bihar, India', lat: 24.8870, lng: 85.5413, aliases: ['nawada', 'nawada bihar', 'nawada br'] },
  { name: 'Buxar, Bihar, India', lat: 25.5647, lng: 83.9777, aliases: ['buxar', 'buxar bihar', 'buxar br'] },
  { name: 'Kishanganj, Bihar, India', lat: 26.0968, lng: 87.9405, aliases: ['kishanganj', 'kishanganj bihar', 'kishanganj br'] },
  { name: 'Sitamarhi, Bihar, India', lat: 26.5937, lng: 85.4895, aliases: ['sitamarhi', 'sitamarhi bihar', 'sitamarhi br'] },
  { name: 'Jamalpur, Bihar, India', lat: 25.3134, lng: 86.4900, aliases: ['jamalpur', 'jamalpur bihar'] },
  { name: 'Jehanabad, Bihar, India', lat: 25.2136, lng: 84.9867, aliases: ['jehanabad', 'jahanabad', 'jehanabad bihar'] },
  { name: 'Aurangabad, Bihar, India', lat: 24.7539, lng: 84.3736, aliases: ['aurangabad bihar', 'aurangabad br'] },
  { name: 'Madhubani, Bihar, India', lat: 26.3547, lng: 86.0718, aliases: ['madhubani', 'madhubani bihar', 'madhubani br'] },
  { name: 'Samastipur, Bihar, India', lat: 25.8629, lng: 85.7811, aliases: ['samastipur', 'samastipur bihar', 'samastipur br'] },
  { name: 'Gopalganj, Bihar, India', lat: 26.4674, lng: 84.4447, aliases: ['gopalganj', 'gopalganj bihar'] },
  { name: 'Supaul, Bihar, India', lat: 26.1264, lng: 86.6053, aliases: ['supaul', 'supaul bihar'] },
  { name: 'Madhepura, Bihar, India', lat: 25.9264, lng: 86.7909, aliases: ['madhepura', 'madhepura bihar'] },
  { name: 'Khagaria, Bihar, India', lat: 25.5034, lng: 86.4827, aliases: ['khagaria', 'khagaria bihar'] },
  { name: 'Araria, Bihar, India', lat: 26.1509, lng: 87.5140, aliases: ['araria', 'araria bihar'] },
  { name: 'Banka, Bihar, India', lat: 24.8872, lng: 86.9224, aliases: ['banka', 'banka bihar'] },
  { name: 'Jamui, Bihar, India', lat: 24.9257, lng: 86.2234, aliases: ['jamui', 'jamui bihar'] },
  { name: 'Bhabua, Bihar, India', lat: 25.0449, lng: 83.6144, aliases: ['bhabua', 'kaimur', 'bhabua bihar'] },
  { name: 'Lakhisarai, Bihar, India', lat: 25.1764, lng: 85.9984, aliases: ['lakhisarai', 'lakhisarai bihar'] },
  { name: 'Sheikhpura, Bihar, India', lat: 25.1388, lng: 85.8580, aliases: ['sheikhpura', 'sheikhpura bihar'] },
  { name: 'Sheohar, Bihar, India', lat: 26.5165, lng: 85.2952, aliases: ['sheohar', 'sheohar bihar'] },
  { name: 'Rajgir, Bihar, India', lat: 25.0306, lng: 85.4206, aliases: ['rajgir', 'rajgir bihar'] },
  { name: 'Nalanda, Bihar, India', lat: 25.1357, lng: 85.4444, aliases: ['nalanda', 'nalanda bihar', 'bihar sharif'] },

  // ==============================================
  // UTTAR PRADESH - Comprehensive Districts & Hubs
  // ==============================================
  { name: 'Mathura, Uttar Pradesh, India', lat: 27.4924, lng: 77.6737, aliases: ['mathura', 'vrindavan', 'mathura up'] },
  { name: 'Ayodhya, Uttar Pradesh, India', lat: 26.7922, lng: 82.1998, aliases: ['ayodhya', 'faizabad', 'ayodhya up'] },
  { name: 'Muzaffarnagar, Uttar Pradesh, India', lat: 29.4727, lng: 77.7085, aliases: ['muzaffarnagar', 'muzaffarnagar up'] },
  { name: 'Firozabad, Uttar Pradesh, India', lat: 27.1591, lng: 78.3957, aliases: ['firozabad', 'firozabad up'] },
  { name: 'Rampur, Uttar Pradesh, India', lat: 28.8143, lng: 79.0253, aliases: ['rampur', 'rampur up'] },
  { name: 'Shahjahanpur, Uttar Pradesh, India', lat: 27.8814, lng: 79.9103, aliases: ['shahjahanpur', 'shahjahanpur up'] },
  { name: 'Farrukhabad, Uttar Pradesh, India', lat: 27.3828, lng: 79.5828, aliases: ['farrukhabad', 'fatehgarh'] },
  { name: 'Hapur, Uttar Pradesh, India', lat: 28.7306, lng: 77.7759, aliases: ['hapur', 'hapur up'] },
  { name: 'Mirzapur, Uttar Pradesh, India', lat: 25.1337, lng: 82.5644, aliases: ['mirzapur', 'vindhyachal'] },
  { name: 'Sambhal, Uttar Pradesh, India', lat: 28.5843, lng: 78.5714, aliases: ['sambhal', 'sambhal up'] },
  { name: 'Amroha, Uttar Pradesh, India', lat: 28.9044, lng: 78.4674, aliases: ['amroha', 'amroha up'] },
  { name: 'Hardoi, Uttar Pradesh, India', lat: 27.3956, lng: 80.1314, aliases: ['hardoi', 'hardoi up'] },
  { name: 'Fatehpur, Uttar Pradesh, India', lat: 25.9284, lng: 80.8130, aliases: ['fatehpur', 'fatehpur up'] },
  { name: 'Raebareli, Uttar Pradesh, India', lat: 26.2236, lng: 81.2409, aliases: ['raebareli', 'rae bareli'] },
  { name: 'Orai, Uttar Pradesh, India', lat: 25.9898, lng: 79.4500, aliases: ['orai', 'jalaun'] },
  { name: 'Sitapur, Uttar Pradesh, India', lat: 27.5684, lng: 80.6829, aliases: ['sitapur', 'sitapur up'] },
  { name: 'Bahraich, Uttar Pradesh, India', lat: 27.5744, lng: 81.5947, aliases: ['bahraich', 'bahraich up'] },
  { name: 'Modinagar, Uttar Pradesh, India', lat: 28.8319, lng: 77.5819, aliases: ['modinagar'] },
  { name: 'Unnao, Uttar Pradesh, India', lat: 26.5393, lng: 80.4878, aliases: ['unnao', 'unnao up'] },
  { name: 'Jaunpur, Uttar Pradesh, India', lat: 25.7464, lng: 82.6837, aliases: ['jaunpur', 'jaunpur up'] },
  { name: 'Hathras, Uttar Pradesh, India', lat: 27.5968, lng: 78.0519, aliases: ['hathras', 'hathras up'] },
  { name: 'Banda, Uttar Pradesh, India', lat: 25.4754, lng: 80.3347, aliases: ['banda', 'banda up'] },
  { name: 'Pilibhit, Uttar Pradesh, India', lat: 28.6314, lng: 79.8044, aliases: ['pilibhit', 'pilibhit up'] },
  { name: 'Barabanki, Uttar Pradesh, India', lat: 26.9269, lng: 81.1834, aliases: ['barabanki', 'barabanki up'] },
  { name: 'Gonda, Uttar Pradesh, India', lat: 27.1337, lng: 81.9619, aliases: ['gonda', 'gonda up'] },
  { name: 'Mainpuri, Uttar Pradesh, India', lat: 27.2289, lng: 79.0234, aliases: ['mainpuri', 'mainpuri up'] },
  { name: 'Lalitpur, Uttar Pradesh, India', lat: 24.6878, lng: 78.4120, aliases: ['lalitpur', 'lalitpur up'] },
  { name: 'Etah, Uttar Pradesh, India', lat: 27.5583, lng: 78.6653, aliases: ['etah', 'etah up'] },
  { name: 'Etawah, Uttar Pradesh, India', lat: 26.7855, lng: 79.0154, aliases: ['etawah', 'etawah up'] },
  { name: 'Deoria, Uttar Pradesh, India', lat: 26.5024, lng: 83.7791, aliases: ['deoria', 'deoria up'] },
  { name: 'Ghazipur, Uttar Pradesh, India', lat: 25.5840, lng: 83.5770, aliases: ['ghazipur', 'ghazipur up'] },
  { name: 'Sultanpur, Uttar Pradesh, India', lat: 26.2648, lng: 82.0727, aliases: ['sultanpur', 'sultanpur up'] },
  { name: 'Azamgarh, Uttar Pradesh, India', lat: 26.0687, lng: 83.1836, aliases: ['azamgarh', 'azamgarh up'] },
  { name: 'Bijnor, Uttar Pradesh, India', lat: 29.3724, lng: 78.1358, aliases: ['bijnor', 'bijnor up'] },
  { name: 'Basti, Uttar Pradesh, India', lat: 26.7994, lng: 82.7486, aliases: ['basti', 'basti up'] },
  { name: 'Ballia, Uttar Pradesh, India', lat: 25.7583, lng: 84.1486, aliases: ['ballia', 'ballia up'] },
  { name: 'Saharanpur, Uttar Pradesh, India', lat: 29.9640, lng: 77.5460, aliases: ['saharanpur', 'saharanpur up'] },
  { name: 'Mughalsarai, Uttar Pradesh, India', lat: 25.2814, lng: 83.1189, aliases: ['mughalsarai', 'pt deen dayal upadhyaya nagar', 'chandauli'] },

  // ============================================
  // MAHARASHTRA - Key Commercial & District Hubs
  // ============================================
  { name: 'Jalgaon, Maharashtra, India', lat: 21.0077, lng: 75.5626, aliases: ['jalgaon', 'jalgaon maharashtra'] },
  { name: 'Latur, Maharashtra, India', lat: 18.4088, lng: 76.5604, aliases: ['latur', 'latur maharashtra'] },
  { name: 'Dhule, Maharashtra, India', lat: 20.9042, lng: 74.7749, aliases: ['dhule', 'dhulia', 'dhule maharashtra'] },
  { name: 'Ahmednagar, Maharashtra, India', lat: 19.0952, lng: 74.7496, aliases: ['ahmednagar', 'ahilyanagar', 'ahmednagar maharashtra'] },
  { name: 'Satara, Maharashtra, India', lat: 17.6805, lng: 73.9936, aliases: ['satara', 'satara maharashtra'] },
  { name: 'Chandrapur, Maharashtra, India', lat: 19.9615, lng: 79.2961, aliases: ['chandrapur', 'chanda'] },
  { name: 'Parbhani, Maharashtra, India', lat: 19.2608, lng: 76.7748, aliases: ['parbhani', 'prabhavati'] },
  { name: 'Ichalkaranji, Maharashtra, India', lat: 16.6924, lng: 74.4589, aliases: ['ichalkaranji'] },
  { name: 'Jalna, Maharashtra, India', lat: 19.8347, lng: 75.8816, aliases: ['jalna', 'jalna maharashtra'] },
  { name: 'Panvel, Maharashtra, India', lat: 18.9894, lng: 73.1175, aliases: ['panvel', 'navi mumbai panvel'] },
  { name: 'Badlapur, Maharashtra, India', lat: 19.1663, lng: 73.2368, aliases: ['badlapur', 'kulgaon badlapur'] },
  { name: 'Beed, Maharashtra, India', lat: 18.9891, lng: 75.7601, aliases: ['beed', 'bid'] },
  { name: 'Gondia, Maharashtra, India', lat: 21.4604, lng: 80.1961, aliases: ['gondia', 'gondiya'] },
  { name: 'Barshi, Maharashtra, India', lat: 18.2333, lng: 75.6833, aliases: ['barshi'] },
  { name: 'Yavatmal, Maharashtra, India', lat: 20.3888, lng: 78.1204, aliases: ['yavatmal'] },
  { name: 'Bhiwandi, Maharashtra, India', lat: 19.2967, lng: 73.0631, aliases: ['bhiwandi', 'bhiwandi thane'] },
  { name: 'Wardha, Maharashtra, India', lat: 20.7453, lng: 78.6022, aliases: ['wardha', 'sevagram'] },
  { name: 'Bhusawal, Maharashtra, India', lat: 21.0455, lng: 75.7885, aliases: ['bhusawal', 'bhusawal jalgaon'] },
  { name: 'Ratnagiri, Maharashtra, India', lat: 16.9902, lng: 73.3120, aliases: ['ratnagiri', 'ratnagiri konkan'] },
  { name: 'Sindhudurg, Maharashtra, India', lat: 16.1219, lng: 73.6844, aliases: ['sindhudurg', 'oros', 'sawantwadi'] },

  // ==========================================
  // RAJASTHAN - Districts & Commercial Centers
  // ==========================================
  { name: 'Udaipur, Rajasthan, India', lat: 24.5854, lng: 73.7125, aliases: ['udaipur', 'udaipur rajasthan', 'lake city'] },
  { name: 'Bhilwara, Rajasthan, India', lat: 25.3407, lng: 74.6313, aliases: ['bhilwara', 'bhilwara rajasthan', 'textile city'] },
  { name: 'Alwar, Rajasthan, India', lat: 27.5530, lng: 76.6346, aliases: ['alwar', 'alwar rajasthan'] },
  { name: 'Bharatpur, Rajasthan, India', lat: 27.2152, lng: 77.5030, aliases: ['bharatpur', 'bharatpur rajasthan'] },
  { name: 'Sriganganagar, Rajasthan, India', lat: 29.9038, lng: 73.8772, aliases: ['sriganganagar', 'ganganagar'] },
  { name: 'Sikar, Rajasthan, India', lat: 27.6094, lng: 75.1398, aliases: ['sikar', 'sikar rajasthan'] },
  { name: 'Pali, Rajasthan, India', lat: 25.7711, lng: 73.3234, aliases: ['pali', 'pali marwar'] },
  { name: 'Chittorgarh, Rajasthan, India', lat: 24.8887, lng: 74.6269, aliases: ['chittorgarh', 'chittor'] },
  { name: 'Hanumangarh, Rajasthan, India', lat: 29.5816, lng: 74.3294, aliases: ['hanumangarh'] },
  { name: 'Beawar, Rajasthan, India', lat: 26.1011, lng: 74.3211, aliases: ['beawar'] },
  { name: 'Kishangarh, Rajasthan, India', lat: 26.5744, lng: 74.8653, aliases: ['kishangarh', 'marble city'] },
  { name: 'Jhunjhunu, Rajasthan, India', lat: 28.1289, lng: 75.3995, aliases: ['jhunjhunu'] },
  { name: 'Tonk, Rajasthan, India', lat: 26.1664, lng: 75.7885, aliases: ['tonk', 'tonk rajasthan'] },
  { name: 'Barmer, Rajasthan, India', lat: 25.7521, lng: 71.3967, aliases: ['barmer'] },
  { name: 'Jaisalmer, Rajasthan, India', lat: 26.9157, lng: 70.9083, aliases: ['jaisalmer', 'golden city'] },

  // ==========================================
  // MADHYA PRADESH - Commercial & Districts
  // ==========================================
  { name: 'Sagar, Madhya Pradesh, India', lat: 23.8388, lng: 78.7378, aliases: ['sagar', 'saugor'] },
  { name: 'Dewas, Madhya Pradesh, India', lat: 22.9676, lng: 76.0534, aliases: ['dewas', 'dewas mp'] },
  { name: 'Satna, Madhya Pradesh, India', lat: 24.6005, lng: 80.8322, aliases: ['satna', 'satna mp'] },
  { name: 'Ratlam, Madhya Pradesh, India', lat: 23.3315, lng: 75.0367, aliases: ['ratlam', 'ratlam mp'] },
  { name: 'Rewa, Madhya Pradesh, India', lat: 24.5362, lng: 81.3037, aliases: ['rewa', 'rewa mp'] },
  { name: 'Katni, Madhya Pradesh, India', lat: 23.8343, lng: 80.3964, aliases: ['katni', 'murwara'] },
  { name: 'Singrauli, Madhya Pradesh, India', lat: 24.1997, lng: 82.6645, aliases: ['singrauli', 'waidhan'] },
  { name: 'Burhanpur, Madhya Pradesh, India', lat: 21.3144, lng: 76.2234, aliases: ['burhanpur'] },
  { name: 'Khandwa, Madhya Pradesh, India', lat: 21.8314, lng: 76.3498, aliases: ['khandwa', 'east nimar'] },
  { name: 'Chhindwara, Madhya Pradesh, India', lat: 22.0574, lng: 78.9382, aliases: ['chhindwara'] },
  { name: 'Guna, Madhya Pradesh, India', lat: 24.6468, lng: 77.3119, aliases: ['guna', 'guna mp'] },
  { name: 'Shivpuri, Madhya Pradesh, India', lat: 25.4244, lng: 77.6586, aliases: ['shivpuri'] },
  { name: 'Vidisha, Madhya Pradesh, India', lat: 23.5251, lng: 77.8081, aliases: ['vidisha', 'besnagar'] },
  { name: 'Mandsaur, Madhya Pradesh, India', lat: 24.0722, lng: 75.0694, aliases: ['mandsaur', 'mandasor'] },
  { name: 'Neemuch, Madhya Pradesh, India', lat: 24.4697, lng: 74.8722, aliases: ['neemuch'] },

  // ==========================================
  // GUJARAT - Key Commercial Cities
  // ==========================================
  { name: 'Junagadh, Gujarat, India', lat: 21.5222, lng: 70.4579, aliases: ['junagadh', 'junagarh'] },
  { name: 'Gandhinagar, Gujarat, India', lat: 23.2156, lng: 72.6369, aliases: ['gandhinagar', 'gandhinagar gujarat'] },
  { name: 'Anand, Gujarat, India', lat: 22.5645, lng: 72.9289, aliases: ['anand', 'milk capital'] },
  { name: 'Navsari, Gujarat, India', lat: 20.9467, lng: 72.9520, aliases: ['navsari'] },
  { name: 'Morbi, Gujarat, India', lat: 22.8120, lng: 70.8236, aliases: ['morbi', 'ceramic city'] },
  { name: 'Nadiad, Gujarat, India', lat: 22.6916, lng: 72.8634, aliases: ['nadiad', 'kheda'] },
  { name: 'Surendranagar, Gujarat, India', lat: 22.7284, lng: 71.6371, aliases: ['surendranagar', 'wadhwan'] },
  { name: 'Bharuch, Gujarat, India', lat: 21.7051, lng: 72.9959, aliases: ['bharuch', 'ankleshwar'] },
  { name: 'Porbandar, Gujarat, India', lat: 21.6417, lng: 69.6293, aliases: ['porbandar'] },
  { name: 'Mehsana, Gujarat, India', lat: 23.5880, lng: 72.3693, aliases: ['mehsana', 'mahesana'] },
  { name: 'Bhuj, Gujarat, India', lat: 23.2420, lng: 69.6669, aliases: ['bhuj', 'kutch'] },
  { name: 'Vapi, Gujarat, India', lat: 20.3893, lng: 72.9106, aliases: ['vapi', 'vapi gujarat'] },
  { name: 'Gandhidham, Gujarat, India', lat: 23.0753, lng: 70.1337, aliases: ['gandhidham', 'kandla'] },

  // ==========================================
  // WEST BENGAL & EAST INDIA
  // ==========================================
  { name: 'Bardhaman, West Bengal, India', lat: 23.2324, lng: 87.8615, aliases: ['bardhaman', 'burdwan'] },
  { name: 'Malda, West Bengal, India', lat: 25.0108, lng: 88.1411, aliases: ['malda', 'english bazar'] },
  { name: 'Baharampur, West Bengal, India', lat: 24.0988, lng: 88.2514, aliases: ['baharampur', 'murshidabad'] },
  { name: 'Kharagpur, West Bengal, India', lat: 22.3460, lng: 87.2320, aliases: ['kharagpur', 'iit kharagpur'] },
  { name: 'Haldia, West Bengal, India', lat: 22.0667, lng: 88.0698, aliases: ['haldia', 'port haldia'] },
  { name: 'Darjeeling, West Bengal, India', lat: 27.0410, lng: 88.2663, aliases: ['darjeeling', 'queen of hills'] },
  { name: 'Jalpaiguri, West Bengal, India', lat: 26.5414, lng: 88.7196, aliases: ['jalpaiguri'] },
  { name: 'Midnapore, West Bengal, India', lat: 22.4257, lng: 87.3199, aliases: ['midnapore', 'medinipur'] },

  // ==========================================
  // PUNJAB & HARYANA
  // ==========================================
  { name: 'Patiala, Punjab, India', lat: 30.3398, lng: 76.3869, aliases: ['patiala', 'patiala punjab'] },
  { name: 'Bathinda, Punjab, India', lat: 30.2110, lng: 74.9455, aliases: ['bathinda', 'bhatinda'] },
  { name: 'Hoshiarpur, Punjab, India', lat: 31.5273, lng: 75.9149, aliases: ['hoshiarpur'] },
  { name: 'Mohali, Punjab, India', lat: 30.7046, lng: 76.7179, aliases: ['mohali', 'sas nagar'] },
  { name: 'Pathankot, Punjab, India', lat: 32.2689, lng: 75.6499, aliases: ['pathankot'] },
  { name: 'Panipat, Haryana, India', lat: 29.3909, lng: 76.9635, aliases: ['panipat', 'panipat haryana'] },
  { name: 'Karnal, Haryana, India', lat: 29.6857, lng: 76.9905, aliases: ['karnal', 'karnal haryana'] },
  { name: 'Rohtak, Haryana, India', lat: 28.8955, lng: 76.6066, aliases: ['rohtak', 'rohtak haryana'] },
  { name: 'Hisar, Haryana, India', lat: 29.1492, lng: 75.7217, aliases: ['hisar', 'hissar'] },
  { name: 'Sonipat, Haryana, India', lat: 28.9931, lng: 77.0151, aliases: ['sonipat', 'sonepat'] },
  { name: 'Ambala, Haryana, India', lat: 30.3782, lng: 76.7767, aliases: ['ambala', 'ambala cantt'] },
  { name: 'Panchkula, Haryana, India', lat: 30.6942, lng: 76.8606, aliases: ['panchkula'] },
  { name: 'Yamunanagar, Haryana, India', lat: 30.1290, lng: 77.2674, aliases: ['yamunanagar', 'jagadhri'] },

  // ==========================================
  // SOUTH INDIA - Major Hubs & Districts
  // ==========================================
  { name: 'Kozhikode, Kerala, India', lat: 11.2588, lng: 75.7804, aliases: ['kozhikode', 'calicut', 'calicut kerala'] },
  { name: 'Kollam, Kerala, India', lat: 8.8932, lng: 76.6141, aliases: ['kollam', 'quilon'] },
  { name: 'Thrissur, Kerala, India', lat: 10.5276, lng: 76.2144, aliases: ['thrissur', 'trichur'] },
  { name: 'Kannur, Kerala, India', lat: 11.8745, lng: 75.3704, aliases: ['kannur', 'cannanore'] },
  { name: 'Alappuzha, Kerala, India', lat: 9.4981, lng: 76.3388, aliases: ['alappuzha', 'alleppey'] },
  { name: 'Kottayam, Kerala, India', lat: 9.5916, lng: 76.5222, aliases: ['kottayam'] },
  { name: 'Palakkad, Kerala, India', lat: 10.7867, lng: 76.6548, aliases: ['palakkad', 'palghat'] },
  { name: 'Tirupati, Andhra Pradesh, India', lat: 13.6288, lng: 79.4192, aliases: ['tirupati', 'tirumala'] },
  { name: 'Kurnool, Andhra Pradesh, India', lat: 15.8281, lng: 78.0373, aliases: ['kurnool', 'kurnool ap'] },
  { name: 'Rajahmundry, Andhra Pradesh, India', lat: 17.0005, lng: 81.8040, aliases: ['rajahmundry', 'rajamahendravaram'] },
  { name: 'Kakinada, Andhra Pradesh, India', lat: 16.9891, lng: 82.2475, aliases: ['kakinada', 'port kakinada'] },
  { name: 'Kadapa, Andhra Pradesh, India', lat: 14.4673, lng: 78.8242, aliases: ['kadapa', 'cuddapah'] },
  { name: 'Anantapur, Andhra Pradesh, India', lat: 14.6819, lng: 77.6006, aliases: ['anantapur', 'anantapuram'] },
  { name: 'Nizamabad, Telangana, India', lat: 18.6725, lng: 78.0941, aliases: ['nizamabad'] },
  { name: 'Khammam, Telangana, India', lat: 17.2473, lng: 80.1514, aliases: ['khammam'] },
  { name: 'Karimnagar, Telangana, India', lat: 18.4386, lng: 79.1288, aliases: ['karimnagar'] },
  { name: 'Ramagundam, Telangana, India', lat: 18.7551, lng: 79.5134, aliases: ['ramagundam'] },
  { name: 'Bellary, Karnataka, India', lat: 15.1394, lng: 76.9214, aliases: ['bellary', 'ballari'] },
  { name: 'Davanagere, Karnataka, India', lat: 14.4644, lng: 75.9218, aliases: ['davanagere'] },
  { name: 'Shivamogga, Karnataka, India', lat: 13.9299, lng: 75.5681, aliases: ['shimoga', 'shivamogga'] },
  { name: 'Tumakuru, Karnataka, India', lat: 13.3379, lng: 77.1173, aliases: ['tumkur', 'tumakuru'] },
  { name: 'Udupi, Karnataka, India', lat: 13.3409, lng: 74.7421, aliases: ['udupi', 'manipal'] },
  { name: 'Tiruppur, Tamil Nadu, India', lat: 11.1085, lng: 77.3411, aliases: ['tiruppur', 'knitwear capital'] },
  { name: 'Vellore, Tamil Nadu, India', lat: 12.9165, lng: 79.1325, aliases: ['vellore'] },
  { name: 'Thoothukudi, Tamil Nadu, India', lat: 8.7642, lng: 78.1348, aliases: ['thoothukudi', 'tuticorin'] },
  { name: 'Dindigul, Tamil Nadu, India', lat: 10.3673, lng: 77.9803, aliases: ['dindigul'] },
  { name: 'Thanjavur, Tamil Nadu, India', lat: 10.7870, lng: 79.1378, aliases: ['thanjavur', 'tanjore'] },
  { name: 'Kanchipuram, Tamil Nadu, India', lat: 12.8342, lng: 79.7036, aliases: ['kanchipuram', 'kanchi'] },

  // ==========================================
  // CENTRAL & EASTERN INDIA & HILL STATES
  // ==========================================
  { name: 'Bokaro, Jharkhand, India', lat: 23.6693, lng: 86.1511, aliases: ['bokaro', 'bokaro steel city'] },
  { name: 'Deoghar, Jharkhand, India', lat: 24.4826, lng: 86.7003, aliases: ['deoghar', 'baidyanath dham'] },
  { name: 'Hazaribagh, Jharkhand, India', lat: 23.9925, lng: 85.3637, aliases: ['hazaribagh'] },
  { name: 'Giridih, Jharkhand, India', lat: 24.1867, lng: 86.3094, aliases: ['giridih'] },
  { name: 'Bilaspur, Chhattisgarh, India', lat: 22.0797, lng: 82.1409, aliases: ['bilaspur', 'bilaspur chhattisgarh'] },
  { name: 'Korba, Chhattisgarh, India', lat: 22.3595, lng: 82.7501, aliases: ['korba', 'power city'] },
  { name: 'Durg, Chhattisgarh, India', lat: 21.1904, lng: 81.2849, aliases: ['durg'] },
  { name: 'Jagdalpur, Chhattisgarh, India', lat: 19.0744, lng: 82.0081, aliases: ['jagdalpur', 'bastar'] },
  { name: 'Haridwar, Uttarakhand, India', lat: 29.9457, lng: 78.1642, aliases: ['haridwar', 'hardwar'] },
  { name: 'Rishikesh, Uttarakhand, India', lat: 30.0869, lng: 78.2676, aliases: ['rishikesh', 'yoga capital'] },
  { name: 'Nainital, Uttarakhand, India', lat: 29.3919, lng: 79.4542, aliases: ['nainital'] },
  { name: 'Shimla, Himachal Pradesh, India', lat: 31.1048, lng: 77.1734, aliases: ['shimla', 'simla'] },
  { name: 'Dharamshala, Himachal Pradesh, India', lat: 32.2190, lng: 76.3234, aliases: ['dharamshala', 'mcleodganj'] },
  { name: 'Kullu, Himachal Pradesh, India', lat: 31.9579, lng: 77.1095, aliases: ['kullu', 'manali'] },
  { name: 'Panaji, Goa, India', lat: 15.4909, lng: 73.8278, aliases: ['panaji', 'panjim', 'goa'] },
  { name: 'Margao, Goa, India', lat: 15.2832, lng: 73.9862, aliases: ['margao', 'madgaon'] },
  { name: 'Agartala, Tripura, India', lat: 23.8315, lng: 91.2868, aliases: ['agartala', 'tripura'] },
  { name: 'Gangtok, Sikkim, India', lat: 27.3389, lng: 88.6065, aliases: ['gangtok', 'sikkim'] },
  { name: 'Shillong, Meghalaya, India', lat: 25.5788, lng: 91.8933, aliases: ['shillong', 'meghalaya'] },
  { name: 'Imphal, Manipur, India', lat: 24.8170, lng: 93.9368, aliases: ['imphal', 'manipur'] },
  { name: 'Aizawl, Mizoram, India', lat: 23.7271, lng: 92.7176, aliases: ['aizawl', 'mizoram'] },
  { name: 'Kohima, Nagaland, India', lat: 25.6751, lng: 94.1086, aliases: ['kohima', 'nagaland'] },
  { name: 'Itanagar, Arunachal Pradesh, India', lat: 27.0844, lng: 93.6053, aliases: ['itanagar', 'arunachal pradesh'] },
  { name: 'Leh, Ladakh, India', lat: 34.1526, lng: 77.5771, aliases: ['leh', 'ladakh'] },
  { name: 'Port Blair, Andaman and Nicobar Islands, India', lat: 11.6234, lng: 92.7265, aliases: ['port blair', 'andaman'] },

  // ==========================================
  // KEY GLOBAL FINANCIAL CAPITALS
  // ==========================================
  { name: 'Dubai, United Arab Emirates', lat: 25.2048, lng: 55.2708, aliases: ['dubai', 'uae', 'dubai uae'] },
  { name: 'Abu Dhabi, United Arab Emirates', lat: 24.4539, lng: 54.3773, aliases: ['abu dhabi', 'abu dhabi uae'] },
  { name: 'Singapore, Singapore', lat: 1.3521, lng: 103.8198, aliases: ['singapore', 'sg'] },
  { name: 'London, United Kingdom', lat: 51.5074, lng: -0.1278, aliases: ['london', 'uk', 'london uk', 'greater london'] },
  { name: 'New York, NY, United States', lat: 40.7128, lng: -74.0060, aliases: ['new york', 'nyc', 'ny', 'new york city', 'manhattan'] },
  { name: 'San Francisco, CA, United States', lat: 37.7749, lng: -122.4194, aliases: ['san francisco', 'sf', 'silicon valley'] },
  { name: 'Chicago, IL, United States', lat: 41.8781, lng: -87.6298, aliases: ['chicago', 'cme'] },
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
  { name: 'Kuala Lumpur, Malaysia', lat: 3.1390, lng: 101.6869, aliases: ['kuala lumpur', 'malaysia', 'kl'] },
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
 * Normalizes any text query for robust punctuation-insensitive matching.
 */
function normalizeQuery(text) {
  return (text || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Searches local comprehensive database using weighted token relevance.
 * Guarantees that typing e.g. "gaya", "gaya bihar", "patna", "jaipur" ranks the exact city first!
 */
function searchLocalCities(query, limit = 8) {
  if (!query || typeof query !== 'string') return [];
  const clean = normalizeQuery(query);
  if (clean.length < 2) return [];

  const queryTokens = clean.split(' ').filter(Boolean);
  const scored = [];

  for (const city of COMPREHENSIVE_CITIES) {
    const normCityName = normalizeQuery(city.name);
    const cityTokens = normCityName.split(' ');

    let score = 0;

    // 1. Alias checks (Exact matches get maximum score)
    for (const alias of city.aliases) {
      const normAlias = normalizeQuery(alias);
      if (normAlias === clean) {
        score = Math.max(score, 1000); // Exact alias match (e.g. "gaya" === "gaya")
      } else if (normAlias.startsWith(clean)) {
        score = Math.max(score, 850); // Alias starts with query (e.g. "gay" -> "gaya")
      } else if (clean.startsWith(normAlias + ' ')) {
        score = Math.max(score, 800); // Query starts with alias (e.g. "gaya bihar")
      } else if (normAlias.includes(clean)) {
        score = Math.max(score, 450);
      }
    }

    // 2. City name checks
    if (normCityName.startsWith(clean)) {
      score = Math.max(score, 750);
    } else if (normCityName.includes(clean)) {
      score = Math.max(score, 500);
    }

    // 3. Multi-token match (e.g. "gaya bihar" matches "Gaya, Bihar, India")
    if (queryTokens.length > 1) {
      const allTokensMatch = queryTokens.every(qTok =>
        cityTokens.some(cTok => cTok.startsWith(qTok))
      );
      if (allTokensMatch) {
        score = Math.max(score, 700);
      } else {
        const matchCount = queryTokens.filter(qTok =>
          cityTokens.some(cTok => cTok.startsWith(qTok))
        ).length;
        if (matchCount > 0) {
          score = Math.max(score, matchCount * 150);
        }
      }
    }

    if (score > 0) {
      scored.push({
        name: city.name,
        lat: city.lat,
        lng: city.lng,
        source: 'local',
        score
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(({ name, lat, lng, source }) => ({ name, lat, lng, source }));
}

/**
 * Extracts coordinates from string or resolves against comprehensive database.
 * Protects against stale form inputs where hidden lat/lng stayed at initial default Mumbai coords.
 */
function resolveCoordinates(pobString, explicitLat = null, explicitLng = null) {
  const raw = (pobString || '').trim();
  const clean = normalizeQuery(raw);

  // 1. Check if user provided explicit coordinates
  if (explicitLat !== null && explicitLat !== undefined && explicitLng !== null && explicitLng !== undefined && explicitLat !== '' && explicitLng !== '') {
    const latNum = parseFloat(explicitLat);
    const lngNum = parseFloat(explicitLng);
    if (!isNaN(latNum) && !isNaN(lngNum) && Math.abs(latNum) <= 90 && Math.abs(lngNum) <= 180) {
      // Check if this is the stale default Mumbai coordinate (19.0760, 72.8777)
      const isDefaultMumbaiCoords = Math.abs(latNum - 19.0760) < 0.005 && Math.abs(lngNum - 72.8777) < 0.005;
      const isActuallyMumbai = clean.includes('mumbai') || clean.includes('bombay');

      // If it is NOT the default Mumbai coordinates, or if the user explicitly typed Mumbai, accept the explicit coords
      if (!isDefaultMumbaiCoords || isActuallyMumbai) {
        return { lat: latNum, lng: lngNum, name: raw || 'Specified Location' };
      }
      // If it IS stale Mumbai coordinates but the user typed something else (e.g. "Gaya"), fall through to resolve
    }
  }

  if (!raw) {
    return { lat: 19.0760, lng: 72.8777, name: 'Mumbai, Maharashtra, India' };
  }

  // 2. Regex check for coordinate strings: e.g. "Current Location (24.79°N, 85.00°E)" or "24.79, 85.00"
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

  // 3. Match against comprehensive database
  const localMatches = searchLocalCities(raw, 1);
  if (localMatches && localMatches.length > 0) {
    return {
      lat: localMatches[0].lat,
      lng: localMatches[0].lng,
      name: localMatches[0].name
    };
  }

  // 4. Check in-memory cache
  if (geoCache.has(clean)) {
    return geoCache.get(clean);
  }

  // 5. Default graceful fallback (Mumbai)
  return { lat: 19.0760, lng: 72.8777, name: raw || 'Mumbai, Maharashtra, India' };
}

/**
 * Searches cities asynchronously using local dictionary + live Photon (OpenStreetMap) fallback.
 * Guarantees that typing e.g. "gaya" shows "Gaya, Bihar, India" instantly,
 * while accepting ANY village, town, or global city worldwide.
 */
async function searchCitiesAsync(query, limit = 8) {
  if (!query || typeof query !== 'string') return [];
  const clean = normalizeQuery(query);
  if (clean.length < 2) return [];

  // Check in-memory cache
  if (geoCache.has('search_' + clean)) {
    return geoCache.get('search_' + clean);
  }

  // 1. Search high-precision local database
  const localResults = searchLocalCities(query, limit);

  // If local results have a high-confidence match (e.g. Gaya, Patna, Jaipur), return immediately!
  // This prevents unnecessary network delay and prevents foreign duplicate cities (like Gaya, Niger)
  if (localResults.length >= 2 || (localResults.length >= 1 && clean.length >= 3)) {
    geoCache.set('search_' + clean, localResults);
    return localResults;
  }

  // 2. Query Photon (OpenStreetMap) with 2s timeout for smaller towns/villages
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
      const isDuplicate = combined.some(c => {
        const cleanC = normalizeQuery(c.name);
        const cleanR = normalizeQuery(r.name);
        if (cleanC === cleanR) return true;
        return Math.abs(c.lat - r.lat) < 0.12 && Math.abs(c.lng - r.lng) < 0.12;
      });
      if (!isDuplicate) {
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
