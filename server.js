require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// API Configuration — 3 providers with automatic fallback
// Priority: GoogleFlights (150/month) → SkyScrapper (100/month) → FlightAPI.io (10 searches)
// ============================================================

// Provider 1: Google Flights (RapidAPI — google-flights2) — 150 req/month free
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const GOOGLE_FLIGHTS_HOST = 'google-flights2.p.rapidapi.com';
const googleFlightsConfigured = !!(RAPIDAPI_KEY && RAPIDAPI_KEY !== 'your_rapidapi_key_here');

// Provider 2: Sky-Scrapper (RapidAPI) — 100 req/month free
const SKYSCRAPPER_HOST = 'sky-scrapper.p.rapidapi.com';
const skyscrapperConfigured = !!(RAPIDAPI_KEY && RAPIDAPI_KEY !== 'your_rapidapi_key_here');

// Provider 3: FlightAPI.io — 20 free credits (10 searches)
const FLIGHTAPI_KEY = process.env.FLIGHTAPI_KEY;
const flightapiConfigured = !!(FLIGHTAPI_KEY && FLIGHTAPI_KEY !== 'your_flightapi_key_here');

const anyApiConfigured = googleFlightsConfigured || skyscrapperConfigured || flightapiConfigured;

// Track exhaustion per provider
let googleFlightsExhausted = false;
let skyscrapperExhausted = false;
let flightapiExhausted = false;

if (googleFlightsConfigured) console.log('[API] Google Flights (RapidAPI) configured — 150 req/month');
if (skyscrapperConfigured) console.log('[API] Sky-Scrapper (RapidAPI) configured — 100 req/month');
if (flightapiConfigured) console.log('[API] FlightAPI.io configured — 20 credits');
if (!anyApiConfigured) console.log('WARNING: No API keys set. Live prices disabled.');

// In-memory airport cache
const airportCache = new Map();

// ============================================================
// Shared helpers
// ============================================================
const iataToCityName = {
  DEL: 'New Delhi', BOM: 'Mumbai', BLR: 'Bengaluru', MAA: 'Chennai',
  HYD: 'Hyderabad', CCU: 'Kolkata', AMD: 'Ahmedabad', PNQ: 'Pune',
  GOI: 'Goa', COK: 'Kochi', TRV: 'Thiruvananthapuram', JAI: 'Jaipur',
  LKO: 'Lucknow', IXC: 'Chandigarh', PAT: 'Patna', GAU: 'Guwahati',
  BBI: 'Bhubaneswar', VTZ: 'Visakhapatnam', SXR: 'Srinagar', VNS: 'Varanasi',
  IDR: 'Indore', NAG: 'Nagpur', UDR: 'Udaipur', CCJ: 'Calicut',
  DED: 'Dehradun', CJB: 'Coimbatore', STV: 'Surat', IXE: 'Mangalore',
  RPR: 'Raipur', IXZ: 'Port Blair', IXM: 'Madurai', IXR: 'Ranchi',
  SIN: 'Singapore', DXB: 'Dubai', AUH: 'Abu Dhabi', DOH: 'Doha',
  LHR: 'London Heathrow', LGW: 'London Gatwick', JFK: 'New York JFK',
  EWR: 'Newark', LAX: 'Los Angeles', SFO: 'San Francisco', ORD: 'Chicago',
  BKK: 'Bangkok', KUL: 'Kuala Lumpur', HKG: 'Hong Kong',
  NRT: 'Tokyo Narita', HND: 'Tokyo Haneda', ICN: 'Seoul Incheon',
  SYD: 'Sydney', MEL: 'Melbourne', FRA: 'Frankfurt', CDG: 'Paris',
  AMS: 'Amsterdam', CMB: 'Colombo', KTM: 'Kathmandu', MLE: 'Maldives',
  YYZ: 'Toronto', IST: 'Istanbul', FCO: 'Rome', BCN: 'Barcelona',
  MCT: 'Muscat', BAH: 'Bahrain', RUH: 'Riyadh', JED: 'Jeddah',
  DPS: 'Bali', MNL: 'Manila', SGN: 'Ho Chi Minh', PEK: 'Beijing',
  DAC: 'Dhaka', NBO: 'Nairobi', JNB: 'Johannesburg', CAI: 'Cairo',
};

const AIRLINE_NAMES = {
  '6E': 'IndiGo', 'AI': 'Air India', 'UK': 'Vistara', 'SG': 'SpiceJet',
  'I5': 'AirAsia India', 'QP': 'Akasa Air', 'G8': 'Go First',
  'EK': 'Emirates', 'SQ': 'Singapore Airlines', 'TG': 'Thai Airways',
  'QR': 'Qatar Airways', 'EY': 'Etihad', 'BA': 'British Airways',
  'LH': 'Lufthansa', 'AF': 'Air France', 'KL': 'KLM',
  'AA': 'American Airlines', 'UA': 'United Airlines', 'DL': 'Delta',
  'CX': 'Cathay Pacific', 'MH': 'Malaysia Airlines', 'AK': 'AirAsia',
  'TR': 'Scoot', 'FD': 'AirAsia (Thai)', 'WY': 'Oman Air',
  'GF': 'Gulf Air', 'SV': 'Saudia', 'TK': 'Turkish Airlines',
  'OZ': 'Asiana', 'KE': 'Korean Air', 'JL': 'Japan Airlines',
  'NH': 'ANA', 'IX': 'Air India Express', 'S5': 'Star Air',
  'G9': 'Air Arabia', 'FZ': 'flydubai', 'AC': 'Air Canada',
  'QF': 'Qantas', 'NZ': 'Air New Zealand', 'VS': 'Virgin Atlantic',
  'LX': 'SWISS', 'OS': 'Austrian Airlines', 'MS': 'EgyptAir',
  'ET': 'Ethiopian Airlines', 'KQ': 'Kenya Airways',
  'SA': 'South African Airways', 'UL': 'SriLankan Airlines',
};

function parseDurationMinutes(mins) {
  if (!mins) return 'PT0H0M';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `PT${h}H${m}M`;
}

// ============================================================
// PROVIDER 1: Google Flights (RapidAPI — google-flights2) — 150/month
// Real-time Google Flights data via DataCrawler API
// ============================================================
async function searchWithGoogleFlights(from, to, date, returnDate, adults, cabinClass) {
  const classMap = { economy: 'ECONOMY', premium_economy: 'PREMIUM_ECONOMY', business: 'BUSINESS', first: 'FIRST' };
  const travelClass = classMap[cabinClass] || 'ECONOMY';
  const pax = adults || '1';

  console.log(`  [GoogleFlights] ${from} → ${to} on ${date}`);

  const params = new URLSearchParams({
    departure_id: from,
    arrival_id: to,
    outbound_date: date,
    travel_class: travelClass,
    adults: pax,
    currency: 'INR',
    language_code: 'en-US',
    country_code: 'IN'
  });
  if (returnDate && returnDate !== 'undefined' && returnDate !== '') {
    params.set('return_date', returnDate);
  }

  const resp = await fetch(`https://${GOOGLE_FLIGHTS_HOST}/api/v1/searchFlights?${params}`, {
    headers: {
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': GOOGLE_FLIGHTS_HOST
    }
  });

  if (resp.status === 429) {
    const text = await resp.text();
    if (text.includes('MONTHLY quota') || text.includes('exceeded')) {
      googleFlightsExhausted = true;
      throw new Error('QUOTA_EXHAUSTED');
    }
    throw new Error(`GoogleFlights 429: ${text}`);
  }
  if (resp.status === 403) {
    const text = await resp.text();
    if (text.includes('not subscribed')) {
      googleFlightsExhausted = true;
      throw new Error('NOT_SUBSCRIBED: Subscribe free at https://rapidapi.com/DataCrawler/api/google-flights2');
    }
    throw new Error(`GoogleFlights 403: ${text}`);
  }
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`GoogleFlights ${resp.status}: ${text}`);
  }

  const json = await resp.json();
  if (!json.status && json.message) throw new Error(`GoogleFlights: ${json.message}`);

  // Response has best_flights and other_flights arrays
  const data = json.data || json;
  const bestFlights = data.best_flights || [];
  const otherFlights = data.other_flights || [];
  const allFlights = [...bestFlights, ...otherFlights];

  if (allFlights.length === 0) return [];

  const results = [];
  for (const entry of allFlights) {
    const segments = (entry.flights || []).map(seg => {
      const dep = seg.departure_airport || {};
      const arr = seg.arrival_airport || {};
      const cc = (seg.flight_number || '').substring(0, 2);
      return {
        departure: { iataCode: dep.id || from, at: dep.time || '' },
        arrival: { iataCode: arr.id || to, at: arr.time || '' },
        carrierCode: cc,
        carrierName: seg.airline || AIRLINE_NAMES[cc] || cc,
        flightNumber: seg.flight_number || '',
        duration: parseDurationMinutes(seg.duration || 0),
        stops: 0,
        airplane: seg.airplane || '',
        airlineLogo: seg.airline_logo || ''
      };
    });

    const layovers = (entry.layovers || []).map(l => ({
      duration: l.duration || 0,
      airport: l.name || '',
      id: l.id || ''
    }));

    const price = entry.price || 0;
    const firstSeg = segments[0] || {};
    const isBest = bestFlights.includes(entry);

    results.push({
      id: String(results.length + 1),
      source: 'google_flights',
      price: {
        total: price,
        base: price,
        currency: 'INR',
        formatted: `Rs.${Math.round(price).toLocaleString('en-IN')}`,
        fees: []
      },
      airline: {
        code: firstSeg.carrierCode || '',
        name: firstSeg.carrierName || 'Unknown',
        logoUrl: firstSeg.airlineLogo || ''
      },
      itineraries: [{
        duration: parseDurationMinutes(entry.total_duration || 0),
        segments,
        stops: layovers.length,
        layovers
      }],
      bookableSeats: null,
      deepLink: null,
      score: null,
      tags: isBest ? ['BEST'] : [],
      carbonEmissions: entry.carbon_emissions || null
    });
  }

  return results;
}

// ============================================================
// PROVIDER 2: Sky-Scrapper (RapidAPI / Skyscanner) — 100/month
// ============================================================
async function skyscrapperApiGet(endpoint, params, retries = 2) {
  const url = new URL(`https://${SKYSCRAPPER_HOST}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
  });

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) {
      console.log(`  [SkyScrapper] Retry ${attempt}/${retries}...`);
      await new Promise(r => setTimeout(r, 2000 * attempt));
    }

    const resp = await fetch(url.toString(), {
      headers: { 'X-RapidAPI-Key': RAPIDAPI_KEY, 'X-RapidAPI-Host': SKYSCRAPPER_HOST }
    });

    if (resp.status === 429) {
      const text = await resp.text();
      if (text.includes('MONTHLY quota') || text.includes('exceeded')) {
        skyscrapperExhausted = true;
        throw new Error('QUOTA_EXHAUSTED');
      }
      if (attempt < retries) continue;
      throw new Error(`API ${resp.status}: ${text}`);
    }

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`API ${resp.status}: ${text}`);
    }

    const json = await resp.json();
    if (json.status === false && attempt < retries) continue;
    return json;
  }
}

async function resolveAirport(iataCode) {
  if (airportCache.has(iataCode)) return airportCache.get(iataCode);
  const searchQuery = iataToCityName[iataCode] || iataCode;
  const result = await skyscrapperApiGet('/api/v1/flights/searchAirport', { query: searchQuery, locale: 'en-US' });

  if (!result || !result.data || result.data.length === 0) {
    const result2 = await skyscrapperApiGet('/api/v1/flights/searchAirport', { query: iataCode, locale: 'en-US' });
    if (!result2 || !result2.data || result2.data.length === 0) throw new Error(`Airport not found: ${iataCode}`);
    result.data = result2.data;
  }

  let match = result.data.find(d => (d.navigation?.relevantFlightParams?.skyId || d.skyId) === iataCode);
  if (!match) match = result.data.find(d => d.entityId) || result.data[0];

  const info = {
    skyId: match.navigation?.relevantFlightParams?.skyId || match.skyId || iataCode,
    entityId: String(match.navigation?.relevantFlightParams?.entityId || match.entityId || ''),
    name: match.presentation?.title || searchQuery,
  };
  airportCache.set(iataCode, info);
  return info;
}

async function searchWithSkyScrapper(from, to, date, returnDate, adults, cabinClass) {
  const classMap = { economy: 'economy', premium_economy: 'premium_economy', business: 'business', first: 'first' };
  const [origin, dest] = await Promise.all([resolveAirport(from), resolveAirport(to)]);
  console.log(`  [SkyScrapper] ${origin.name} → ${dest.name}`);

  const searchParams = {
    originSkyId: origin.skyId, destinationSkyId: dest.skyId,
    originEntityId: origin.entityId, destinationEntityId: dest.entityId,
    date, adults: adults || '1', cabinClass: classMap[cabinClass] || 'economy',
    currency: 'INR', market: 'IN', countryCode: 'IN', locale: 'en-US'
  };
  if (returnDate && returnDate !== 'undefined' && returnDate !== '') searchParams.returnDate = returnDate;

  const result = await skyscrapperApiGet('/api/v1/flights/searchFlights', searchParams);
  if (!result.data?.itineraries?.length) return [];

  return result.data.itineraries.map((itin, idx) => {
    const firstLeg = (itin.legs || [])[0] || {};
    const segments = (firstLeg.segments || []).map(seg => ({
      departure: { iataCode: seg.origin?.flightPlaceId || seg.origin?.displayCode || from, at: seg.departure || '' },
      arrival: { iataCode: seg.destination?.flightPlaceId || seg.destination?.displayCode || to, at: seg.arrival || '' },
      carrierCode: seg.marketingCarrier?.alternateId || '', carrierName: seg.marketingCarrier?.name || 'Unknown',
      flightNumber: (seg.marketingCarrier?.alternateId || '') + (seg.flightNumber || ''),
      duration: parseDurationMinutes(seg.durationInMinutes), stops: 0
    }));
    const priceRaw = itin.price?.raw || 0;
    const carriers = firstLeg.carriers?.marketing || [];
    const mc = carriers[0] || {};
    return {
      id: String(idx + 1), source: 'skyscanner',
      price: { total: parseFloat(priceRaw) || 0, base: parseFloat(priceRaw) || 0, currency: 'INR', formatted: itin.price?.formatted || `Rs.${Math.round(priceRaw).toLocaleString()}`, fees: [] },
      airline: { code: mc.alternateId || segments[0]?.carrierCode || '', name: mc.name || segments[0]?.carrierName || 'Unknown', logoUrl: mc.logoUrl || '' },
      itineraries: [{ duration: parseDurationMinutes(firstLeg.durationInMinutes), segments, stops: firstLeg.stopCount ?? Math.max(0, segments.length - 1) }],
      bookableSeats: null, deepLink: itin.deepLink || null, score: itin.score || null, tags: itin.tags || []
    };
  });
}

// ============================================================
// PROVIDER 3: FlightAPI.io — 10 searches free
// ============================================================
async function searchWithFlightAPI(from, to, date, returnDate, adults, cabinClass) {
  const cabinMap = { economy: 'Economy', premium_economy: 'Premium_Economy', business: 'Business', first: 'First' };
  const cabin = cabinMap[cabinClass] || 'Economy';
  const pax = adults || '1';

  const url = (returnDate && returnDate !== 'undefined' && returnDate !== '')
    ? `https://api.flightapi.io/roundtrip/${FLIGHTAPI_KEY}/${from}/${to}/${date}/${returnDate}/${pax}/0/0/${cabin}/INR`
    : `https://api.flightapi.io/onewaytrip/${FLIGHTAPI_KEY}/${from}/${to}/${date}/${pax}/0/0/${cabin}/INR`;

  console.log(`  [FlightAPI] ${from} → ${to} on ${date}`);
  const resp = await fetch(url);

  if (resp.status === 429) { flightapiExhausted = true; throw new Error('QUOTA_EXHAUSTED'); }
  if (!resp.ok) {
    const text = await resp.text();
    if (text.includes('credit') || text.includes('limit') || text.includes('exceeded')) { flightapiExhausted = true; throw new Error('QUOTA_EXHAUSTED'); }
    throw new Error(`FlightAPI ${resp.status}: ${text}`);
  }

  const data = await resp.json();
  if (!data || data.error) {
    if (data?.message?.includes('credit') || data?.message?.includes('limit')) { flightapiExhausted = true; throw new Error('QUOTA_EXHAUSTED'); }
    throw new Error(data?.message || 'FlightAPI error');
  }

  // Build lookup maps
  const toMap = (obj) => { const m = {}; const arr = Array.isArray(obj) ? obj : Object.values(obj || {}); for (const e of arr) { if (e.id) m[e.id] = e; } return m; };
  const legsMap = toMap(data.legs);
  const segmentsMap = toMap(data.segments);
  const carriersMap = toMap(data.carriers);
  const placesMap = toMap(data.places);

  if (!data.itineraries) return [];
  const itinEntries = Array.isArray(data.itineraries) ? data.itineraries : Object.values(data.itineraries);
  const flights = [];

  for (const itin of itinEntries) {
    const pricingOptions = itin.pricing_options || itin.pricingOptions || [];
    if (!pricingOptions.length) continue;
    const bestPrice = pricingOptions.reduce((best, po) => {
      const amt = po.price?.amount || po.amount || 999999;
      return amt < best.amount ? { amount: amt, deepLink: po.url || po.deepLink || null } : best;
    }, { amount: 999999, deepLink: null });
    if (bestPrice.amount >= 999999) continue;

    const legIds = itin.leg_ids || itin.legIds || [];
    const leg = legsMap[legIds[0]] || {};
    const segIds = leg.segment_ids || leg.segmentIds || [];
    const parsedSegs = segIds.map(sid => {
      const seg = segmentsMap[sid] || {};
      const carrier = carriersMap[seg.marketing_carrier_id || seg.marketingCarrierId] || {};
      const orig = placesMap[seg.origin_place_id || seg.originPlaceId] || {};
      const dst = placesMap[seg.destination_place_id || seg.destinationPlaceId] || {};
      const cc = carrier.alt_id || carrier.altId || carrier.iata || '';
      return {
        departure: { iataCode: orig.iata || orig.alt_id || from, at: seg.departure || '' },
        arrival: { iataCode: dst.iata || dst.alt_id || to, at: seg.arrival || '' },
        carrierCode: cc, carrierName: carrier.name || AIRLINE_NAMES[cc] || cc,
        flightNumber: cc + (seg.marketing_flight_number || seg.marketingFlightNumber || ''),
        duration: parseDurationMinutes(seg.duration || 0), stops: 0
      };
    });
    const legCarrier = carriersMap[(leg.marketing_carrier_ids || leg.marketingCarrierIds || [])[0]] || {};
    const mc = legCarrier.alt_id || legCarrier.altId || parsedSegs[0]?.carrierCode || '';

    flights.push({
      id: String(flights.length + 1), source: 'flightapi',
      price: { total: bestPrice.amount, base: bestPrice.amount, currency: 'INR', formatted: `Rs.${Math.round(bestPrice.amount).toLocaleString('en-IN')}`, fees: [] },
      airline: { code: mc, name: legCarrier.name || AIRLINE_NAMES[mc] || parsedSegs[0]?.carrierName || 'Unknown', logoUrl: '' },
      itineraries: [{ duration: parseDurationMinutes(leg.duration || 0), segments: parsedSegs, stops: leg.stop_count ?? leg.stopCount ?? Math.max(0, parsedSegs.length - 1) }],
      bookableSeats: null, deepLink: bestPrice.deepLink, score: null, tags: []
    });
  }
  return flights;
}

// ============================================================
// Unified search with automatic fallback
// ============================================================
async function searchFlightsUnified(from, to, date, returnDate, adults, cabinClass) {
  const errors = [];

  // Priority order: GoogleFlights (150/month) → SkyScrapper (100/month) → FlightAPI (10 searches)
  const providers = [];
  if (googleFlightsConfigured && !googleFlightsExhausted) providers.push('google_flights');
  if (skyscrapperConfigured && !skyscrapperExhausted) providers.push('skyscrapper');
  if (flightapiConfigured && !flightapiExhausted) providers.push('flightapi');
  // Exhausted providers as last resort
  if (googleFlightsConfigured && googleFlightsExhausted) providers.push('google_flights');
  if (skyscrapperConfigured && skyscrapperExhausted) providers.push('skyscrapper');
  if (flightapiConfigured && flightapiExhausted) providers.push('flightapi');

  for (const provider of providers) {
    try {
      let flights;
      if (provider === 'google_flights') {
        flights = await searchWithGoogleFlights(from, to, date, returnDate, adults, cabinClass);
      } else if (provider === 'skyscrapper') {
        flights = await searchWithSkyScrapper(from, to, date, returnDate, adults, cabinClass);
      } else {
        flights = await searchWithFlightAPI(from, to, date, returnDate, adults, cabinClass);
      }
      if (flights && flights.length > 0) {
        console.log(`  [${provider}] Found ${flights.length} flights`);
        return { flights, provider };
      }
      console.log(`  [${provider}] No flights found, trying next...`);
    } catch (err) {
      if (err.message === 'QUOTA_EXHAUSTED') {
        console.log(`  [${provider}] Quota exhausted, trying next...`);
        errors.push(`${provider}: quota exhausted`);
        continue;
      }
      console.log(`  [${provider}] Error: ${err.message}`);
      errors.push(`${provider}: ${err.message}`);
    }
  }

  if (errors.length > 0) throw new Error(errors.join(' | '));
  return { flights: [], provider: null };
}

// ============================================================
// Static files
// ============================================================
app.use(express.static(__dirname));

// ============================================================
// Health check
// ============================================================
app.get('/api/health', (req, res) => {
  res.json({
    server: true,
    apiConfigured: anyApiConfigured,
    providers: {
      google_flights: { configured: googleFlightsConfigured, exhausted: googleFlightsExhausted, limit: '150/month' },
      skyscrapper: { configured: skyscrapperConfigured, exhausted: skyscrapperExhausted, limit: '100/month' },
      flightapi: { configured: flightapiConfigured, exhausted: flightapiExhausted, limit: '10 searches' }
    },
    mode: 'production'
  });
});

// ============================================================
// Flight Search
// ============================================================
app.get('/api/search', async (req, res) => {
  if (!anyApiConfigured) {
    return res.status(503).json({ error: 'No API keys configured. Add at least one API key to .env file.' });
  }

  const { from, to, date, returnDate, adults, cabinClass } = req.query;
  if (!from || !to || !date) return res.status(400).json({ error: 'Missing required parameters: from, to, date' });

  try {
    console.log(`Searching: ${from} → ${to} on ${date}`);
    const { flights, provider } = await searchFlightsUnified(from, to, date, returnDate, adults, cabinClass);

    flights.sort((a, b) => a.price.total - b.price.total);

    if (flights.length > 0) {
      flights[0].isCheapest = true;
      const directFlights = flights.filter(f => f.itineraries.every(i => i.stops === 0));
      if (directFlights.length > 0 && directFlights[0].id !== flights[0].id) {
        flights[flights.findIndex(f => f.id === directFlights[0].id)].isBestDirect = true;
      }
      const byDuration = [...flights].sort((a, b) => {
        const dur = (fl) => fl.itineraries[0]?.segments?.reduce((s, seg) => {
          const m = seg.duration?.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
          return s + (m ? (parseInt(m[1]||0)*60 + parseInt(m[2]||0)) : 0);
        }, 0) || 9999;
        return dur(a) - dur(b);
      });
      if (byDuration[0] && byDuration[0].id !== flights[0].id) {
        flights[flights.findIndex(f => f.id === byDuration[0].id)].isFastest = true;
      }
    }

    const cheapest = flights.length > 0 ? flights[0].price.total : 0;
    const otaComparison = [
      { name: 'Airline Direct', fee: 0, total: cheapest, recommended: true, reason: 'Zero markup, zero convenience fee' },
      { name: 'EaseMyTrip', fee: 0, total: cheapest, recommended: true, reason: 'Zero convenience fee OTA' },
      { name: 'Paytm (UPI)', fee: 0, total: cheapest, recommended: false, reason: 'Zero fee with UPI payment' },
      { name: 'Trip.com', fee: Math.round(cheapest * 0.01), total: Math.round(cheapest * 1.01), recommended: false, reason: 'Low markup ~1%' },
      { name: 'Cleartrip', fee: 250, total: cheapest + 250, recommended: false, reason: 'Convenience fee ~Rs.250/pax' },
      { name: 'MakeMyTrip', fee: 350, total: cheapest + 350, recommended: false, reason: 'Convenience fee Rs.300-400/pax' },
      { name: 'Goibibo', fee: 300, total: cheapest + 300, recommended: false, reason: 'Convenience fee Rs.250-350/pax' },
      { name: 'Yatra', fee: 350, total: cheapest + 350, recommended: false, reason: 'Convenience fee Rs.300-400/pax' },
    ];

    console.log(`  Found ${flights.length} flights via ${provider}. Cheapest: Rs.${cheapest} on ${flights[0]?.airline?.name || 'N/A'}`);

    res.json({
      flights, otaComparison,
      meta: { totalResults: flights.length, cheapestPrice: cheapest || null, cheapestAirline: flights[0]?.airline?.name || null, provider: provider || 'none', searchParams: req.query }
    });

  } catch (err) {
    console.error('Flight search error:', err.message);
    const allExhausted = (!googleFlightsConfigured || googleFlightsExhausted) && (!skyscrapperConfigured || skyscrapperExhausted) && (!flightapiConfigured || flightapiExhausted);
    if (allExhausted || err.message.includes('quota')) {
      return res.status(429).json({ error: 'All flight API quotas exhausted.', detail: err.message });
    }
    res.status(500).json({ error: 'Flight search failed: ' + err.message, detail: err.message });
  }
});

// ============================================================
// Visa Info Endpoint
// ============================================================
const { VISA_DATA, US_VISA_BENEFIT_COUNTRIES } = require('./visaData');

const iataToVisaKey = {
  KTM: 'nepal', CMB: 'sri_lanka', MLE: 'maldives',
  BKK: 'thailand', DMK: 'thailand', KUL: 'malaysia', SIN: 'singapore',
  DPS: 'indonesia', CGK: 'indonesia', SGN: 'vietnam', HAN: 'vietnam',
  MNL: 'philippines', HKG: 'hong_kong', NRT: 'japan', HND: 'japan',
  ICN: 'south_korea', PEK: 'china', PVG: 'china',
  DXB: 'uae', AUH: 'uae', DOH: 'qatar', MCT: 'oman',
  BAH: 'bahrain', RUH: 'saudi_arabia', JED: 'saudi_arabia', IST: 'turkey',
  NBO: 'kenya', CAI: 'egypt', JNB: 'south_africa',
  FRA: 'germany', MUC: 'germany', CDG: 'france', AMS: 'netherlands',
  FCO: 'italy', BCN: 'spain', MAD: 'spain',
  ZRH: 'switzerland', GVA: 'switzerland', ATH: 'greece',
  BRU: 'belgium', CPH: 'denmark', ARN: 'sweden', HEL: 'finland',
  LHR: 'uk', LGW: 'uk', DUB: 'ireland',
  JFK: 'usa', LAX: 'usa', SFO: 'usa', ORD: 'usa', EWR: 'usa',
  YYZ: 'canada', YVR: 'canada', SYD: 'australia', MEL: 'australia',
  DAC: 'bangladesh',
};

app.get('/api/visa', (req, res) => {
  const { destination } = req.query;
  if (!destination) return res.status(400).json({ error: 'Missing destination IATA code' });

  const visaKey = iataToVisaKey[destination];
  if (!visaKey || !VISA_DATA[visaKey]) {
    const indianAirports = new Set(['DEL','BOM','BLR','MAA','HYD','CCU','AMD','PNQ','GOI','COK','TRV','JAI','LKO','IXC','PAT','GAU','BBI','IXB','VTZ','IXR','SXR','VNS','IXM','RPR','IDR','NAG','UDR','IXZ','CCJ','IXA','DED','IMF','BDQ','RAJ','IXS','CJB','TRZ','STV','IXE']);
    if (indianAirports.has(destination)) {
      return res.json({ domestic: true, country: 'India', visa_type: 'not_required', message: 'Domestic flight - no visa or passport required. Carry a valid government photo ID.' });
    }
    return res.json({ domestic: false, country: 'Unknown', visa_type: 'unknown', message: 'Visa information not available for this destination. Check the official embassy website.' });
  }

  res.json({ domestic: false, ...VISA_DATA[visaKey], us_visa_benefits_all: US_VISA_BENEFIT_COUNTRIES });
});

// ============================================================
// Start server (local only — Vercel uses the exported app)
// ============================================================
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log('');
    console.log('==============================================');
    console.log('  BrutalCheapFlights Server Running');
    console.log(`  Open: http://localhost:${PORT}`);
    console.log('==============================================');
    console.log('');
    if (!googleFlightsConfigured) {
      console.log('For Google Flights data (150 free req/month), add RapidAPI key:');
      console.log('  1. Subscribe free: https://rapidapi.com/DataCrawler/api/google-flights2');
      console.log('  2. Add to .env: RAPIDAPI_KEY=your_key_here');
      console.log('');
    }
  });
}

module.exports = app;
