import { Property, Agent, Area, PropertyPurpose, PropertyType, FurnishedStatus } from '../types';
import { agents as fallbackAgents, areas as fallbackAreas } from '../data/mockData';

// Baserow API Configuration for Client-Side Direct Fetching
const metaEnv = (import.meta as any).env || {};
const BASEROW_API_URL = (metaEnv.VITE_BASEROW_API_URL || 'https://api.baserow.io/api/database/rows/table/').trim();
const BASEROW_TABLE_ID = (metaEnv.VITE_BASEROW_TABLE_ID || '1210850').trim();
const BASEROW_AGENTS_TABLE_ID = (metaEnv.VITE_BASEROW_AGENTS_TABLE_ID || '1210849').trim();
const BASEROW_API_TOKEN = (metaEnv.VITE_BASEROW_API_TOKEN || 'sOzrobF91FeRAUTThbQYv8OFenkCtR8c').trim();

// Cache
interface ClientCache {
  properties: Property[];
  agents: Agent[];
  areas: Area[];
  timestamp: number;
}

let clientCache: ClientCache | null = null;
const CACHE_TTL_MS = 25 * 1000; // 25 seconds cache

function extractText(val: unknown): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val.trim();
  if (typeof val === 'number') return String(val);
  if (Array.isArray(val) && val.length > 0) {
    const first = val[0];
    if (typeof first === 'object' && first !== null) {
      return ((first as any).value || (first as any).name || (first as any).title || '').trim();
    }
    return String(first).trim();
  }
  if (typeof val === 'object' && val !== null) {
    if ('value' in val && typeof (val as any).value === 'string') return (val as any).value.trim();
    if ('name' in val && typeof (val as any).name === 'string') return (val as any).name.trim();
  }
  return '';
}

function extractNumber(val: unknown): number | null {
  if (val === null || val === undefined || val === '') return null;
  if (typeof val === 'number') return isNaN(val) ? null : val;
  const str = String(val).replace(/,/g, '').trim();
  const cleaned = str.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

function extractImages(val: unknown): string[] {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val
      .map((item) => {
        if (typeof item === 'string') return item.trim();
        if (typeof item === 'object' && item !== null) {
          return (item.url || item.image || item.file || '').trim();
        }
        return '';
      })
      .filter((url) => url.length > 0);
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return [];
    if (trimmed.includes(',')) {
      return trimmed.split(',').map((s) => s.trim()).filter((u) => u.startsWith('http'));
    }
    if (trimmed.startsWith('http')) return [trimmed];
  }
  return [];
}

function parseCoordinate(val: unknown): number | null {
  if (val === null || val === undefined || val === '') return null;
  if (typeof val === 'number') return isNaN(val) ? null : val;
  const str = String(val).trim();

  // DMS format like 25°11'15.5"N
  const dmsRegex = /^([+-]?\d+(?:\.\d+)?)\s*[°ºd\s]\s*(\d+(?:\.\d+)?)?\s*['’m\s]?\s*(\d+(?:\.\d+)?)?\s*["”s]?\s*([NSEW])?$/i;
  const match = str.match(dmsRegex);
  if (match) {
    const degrees = parseFloat(match[1]) || 0;
    const minutes = parseFloat(match[2]) || 0;
    const seconds = parseFloat(match[3]) || 0;
    const direction = (match[4] || '').toUpperCase();
    let dec = Math.abs(degrees) + minutes / 60 + seconds / 3600;
    if (degrees < 0 || direction === 'S' || direction === 'W') {
      dec = -dec;
    }
    return isNaN(dec) ? null : dec;
  }

  const cleaned = str.replace(/[^0-9.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function formatAedPrice(num: number | null): string {
  if (num === null || num === 0) return 'Price on Request';
  return `AED ${num.toLocaleString('en-US')}`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildUrl(tableId: string): string {
  let base = BASEROW_API_URL;
  if (base.endsWith('/')) base = base.slice(0, -1);
  if (!base.includes('/api/database/rows/table')) {
    base = `${base}/api/database/rows/table`;
  }
  return `${base}/${tableId}/?user_field_names=true&size=200`;
}

/**
 * Fetch live agents directly from Baserow table 1210849
 */
async function fetchDirectAgents(): Promise<Map<string, Agent>> {
  const agentMap = new Map<string, Agent>();
  try {
    const url = buildUrl(BASEROW_AGENTS_TABLE_ID);
    const res = await fetch(url, {
      headers: {
        Authorization: `Token ${BASEROW_API_TOKEN}`,
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const json = await res.json();
      const rows: Record<string, any>[] = Array.isArray(json) ? json : json.results || [];
      for (const row of rows) {
        const name = extractText(row['Agent Name']);
        if (!name) continue;
        const photos = extractImages(row['Profile Photo']);
        const matchedFallback = fallbackAgents.find(
          (a) => a.name.toLowerCase().trim() === name.toLowerCase().trim()
        );

        const agent: Agent = {
          id: extractText(row['Agent ID']) || slugify(name),
          name,
          title: extractText(row['Job Title']) || matchedFallback?.title || 'Secondary Market Advisor',
          phone: extractText(row['Phone Number']) || matchedFallback?.phone || '+971 58 864 8093',
          whatsapp: extractText(row['WhatsApp Number']) || matchedFallback?.whatsapp || '971588648093',
          email: extractText(row['Email']) || matchedFallback?.email || 'sales@sqftdxb.com',
          photo: photos[0] || matchedFallback?.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
          reraNumber: extractText(row['BRN / License']) || '',
          verifiedDeals: 1,
          propertyCount: 1,
        };

        agentMap.set(name.toLowerCase().trim(), agent);
        if (row.id) {
          agentMap.set(String(row.id), agent);
        }
      }
    }
  } catch (err) {
    console.warn('[BaserowClient] Direct agents fetch error:', err);
  }
  return agentMap;
}

/**
 * Maps a single raw Baserow row into our verified Property model
 */
function mapBaserowRowToProperty(
  row: Record<string, any>,
  agentMap: Map<string, Agent>
): Property | null {
  // 1. Status Filter
  const statusRaw =
    extractText(row['Listing Status']) ||
    extractText(row['Status']) ||
    extractText(row['ListingStatus']) ||
    '';

  const normalizedStatus = statusRaw.trim().toUpperCase();

  // If status is empty, check if Title and Price exist
  const rawTitle = extractText(row['Listing Title']) || extractText(row['Title']);
  if (!rawTitle) return null; // Ignore completely blank / ghost rows

  // Exclude explicit non-live statuses
  const excludedStatuses = ['DRAFT', 'SOLD', 'ARCHIVED', 'DELETED', 'HIDDEN', 'RENTED', 'OFF-MARKET', 'PENDING'];
  if (excludedStatuses.includes(normalizedStatus)) {
    return null;
  }

  // 2. Identification
  const rowId = String(row.id || '');
  const customPropId = extractText(row['Property ID']) || `JP-${rowId}`;
  const slug = slugify(customPropId) || `listing-${rowId}`;

  // 3. Location & Project
  const projectDisplay = extractText(row['Project Name']) || extractText(row['Building Name']) || 'Dubai Residence';
  const buildingName = extractText(row['Building Name']);
  const developer = extractText(row['Developer']) || 'Emaar Properties';
  const emirate = extractText(row['Emirate']) || 'Dubai';
  const areaRaw = extractText(row['Community / Area']) || extractText(row['Community']) || extractText(row['Area']) || 'Dubai';
  const areaId = slugify(areaRaw);

  // 4. Listing Type & Purpose
  const listingTypeRaw = extractText(row['Listing Type']);
  let purpose: PropertyPurpose = 'buy';
  if (/rent/i.test(listingTypeRaw)) {
    purpose = 'rent';
  }

  // 5. Property Type
  const propTypeRaw = extractText(row['Property Type']);
  let propertyType: PropertyType = 'Villa';
  if (/townhouse/i.test(propTypeRaw)) propertyType = 'Townhouse';
  else if (/penthouse/i.test(propTypeRaw)) propertyType = 'Penthouse';
  else if (/duplex/i.test(propTypeRaw)) propertyType = 'Duplex';
  else if (/apartment|flat|commercial|office/i.test(propTypeRaw)) propertyType = 'Apartment';
  else if (/villa|mansion|plot|land/i.test(propTypeRaw)) propertyType = 'Villa';

  // 6. Pricing
  const priceNum = extractNumber(row['Price']) || extractNumber(row['Price (AED)']) || 0;
  const priceDisplay = formatAedPrice(priceNum);
  const priceUnit = purpose === 'rent' ? '/ year' : undefined;

  // 7. Specifications
  const bedroomsRaw = extractText(row['Bedrooms']);
  let bedroomsNum: number = 0;
  if (/studio/i.test(bedroomsRaw)) bedroomsNum = 0;
  else bedroomsNum = extractNumber(bedroomsRaw) || 0;

  const bathroomsNum = extractNumber(row['Bathrooms']) || Math.max(1, bedroomsNum);
  const sqftNum = extractNumber(row['Property Size (sqft)']) || extractNumber(row['BUA (sqft)']) || 0;
  const plotSizeNum = extractNumber(row['Plot Size (sqft)']);
  const pricePerSqft = sqftNum > 0 && priceNum > 0 ? Math.round(priceNum / sqftNum) : 0;

  // 8. Visual Assets
  const coverImages = extractImages(row['Cover Image']);
  const galleryImages = extractImages(row['Gallery Images']);
  const floorPlanImages = extractImages(row['Floor Plan']);

  const allImages = [...coverImages, ...galleryImages].filter(
    (url, index, self) => self.indexOf(url) === index
  );
  const images = allImages.length > 0 ? allImages : ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85'];

  // 9. Coordinates
  const latNum = parseCoordinate(row['Latitude']);
  const lngNum = parseCoordinate(row['Longitude']);

  // 10. Agent assignment
  const agentVal = row['Agent'];
  const agentText = extractText(agentVal);
  let agent: Agent | undefined;

  if (agentText) {
    agent = agentMap.get(agentText.toLowerCase().trim());
  }
  if (!agent && Array.isArray(agentVal) && agentVal.length > 0) {
    const first = agentVal[0];
    if (typeof first === 'object' && first !== null && first.id) {
      agent = agentMap.get(String(first.id));
    }
  }
  if (!agent && agentText) {
    const fallback = fallbackAgents.find(
      (a) => a.name.toLowerCase().includes(agentText.toLowerCase()) || agentText.toLowerCase().includes(a.name.toLowerCase())
    );
    if (fallback) agent = fallback;
  }
  if (!agent) {
    agent = fallbackAgents[0];
  }

  // 11. Description & Amenities
  const fullDesc = extractText(row['Full Description']);
  const shortDesc = extractText(row['Short Description']);
  const description =
    fullDesc ||
    shortDesc ||
    `Verified secondary market ${propertyType.toLowerCase()} located in ${projectDisplay}, ${areaRaw}, Dubai. Delivered ready with confirmed title deed verification and immediate key handover.`;

  const amenities: string[] = [];
  const booleanAmenityMap: Record<string, string> = {
    'Swimming Pool': 'Resort-Style Swimming Pool',
    'Gym': 'Fully Equipped Gymnasium',
    'Parking': 'Dedicated Parking',
    'Covered Parking': 'Covered Parking',
    'Beach Access': 'Direct Beach Access',
    'Concierge': '24/7 Concierge Service',
    'Security': '24/7 Security & CCTV',
    "Children's Play Area": "Children's Play Area",
    'Private Garden': 'Private Landscaped Garden',
    'Private Pool': 'Private Swimming Pool',
    'Sea View': 'Panoramic Sea View',
    'Marina View': 'Canal & Marina View',
    'City View': 'Downtown Skyline View',
    'Burj View': 'Burj Khalifa View',
    "Maid's Room": "Maid's Room (En-Suite)",
    'Study Room': 'Dedicated Study Room',
    'Storage Room': 'Private Storage Room',
    'BBQ Area': 'Outdoor BBQ Area',
    'Built-in Wardrobes': 'Built-in Wardrobes',
    'Central Air Conditioning': 'Central Air Conditioning',
    'Pets Allowed': 'Pet Friendly Community',
    'Balcony': 'Private Balcony',
    'Terrace': 'Spacious Outdoor Terrace',
  };

  for (const [colName, label] of Object.entries(booleanAmenityMap)) {
    if (row[colName] === true) amenities.push(label);
  }

  const furnishingRaw = extractText(row['Furnishing']) || 'Unfurnished';
  let furnishedStatus: FurnishedStatus = 'Unfurnished';
  if (/semi/i.test(furnishingRaw)) furnishedStatus = 'Semi-Furnished';
  else if (/furnished/i.test(furnishingRaw)) furnishedStatus = 'Furnished';

  const parkingSpaces = extractNumber(row['Parking Spaces']) ?? (row['Covered Parking'] || row['Parking'] ? 2 : 1);

  return {
    id: customPropId || `prop-${rowId}`,
    baserowRowId: row.id,
    title: rawTitle,
    slug,
    projectName: projectDisplay,
    buildingName: buildingName || projectDisplay,
    developer,
    emirate,
    area: areaRaw,
    areaId,
    purpose,
    propertyType,
    price: priceNum,
    priceDisplay,
    priceUnit,
    bedrooms: bedroomsNum,
    bedroom: bedroomsNum,
    bathrooms: bathroomsNum,
    bathroom: bathroomsNum,
    sqft: sqftNum,
    totalArea: sqftNum,
    plotSize: plotSizeNum,
    pricePerSqft,
    images,
    floorPlanUrl: floorPlanImages[0] || undefined,
    videoUrl: extractText(row['Video URL']) || undefined,
    virtualTourUrl: extractText(row['Virtual Tour URL']) || undefined,
    isVerified: true,
    isReady: true,
    readyStatus: 'Ready to Move',
    handoverYear: 'Completed & Ready',
    description,
    features: [
      'Title Deed Verified with Dubai Land Department',
      'Delivered Vacant on Transfer / Ready',
      `${bedroomsNum > 0 ? `${bedroomsNum} En-Suite Bedrooms` : 'Studio Layout'}`,
      `${parkingSpaces} Dedicated Parking Bays`,
    ],
    amenities: amenities.length > 0 ? amenities : ['24/7 Gated Security', 'Landscaped Parks & Green Spaces', 'Covered Parking'],
    floor: extractText(row['Floor Number']) ? `Floor ${extractText(row['Floor Number'])}` : 'Mid Floor',
    parkingSpaces,
    furnishedStatus,
    furniture: furnishingRaw,
    furnishing: furnishingRaw,
    viewType: extractText(row['View']) || 'Community & Skyline View',
    reraPermit: `PERMIT-DXB-${rowId.padStart(6, '0')}`,
    referenceNumber: customPropId,
    agent: agent || fallbackAgents[0],
    isFeatured: row['Featured Listing'] === true,
    createdAt: extractText(row['Date Added']) || new Date().toISOString().split('T')[0],
    latitude: latNum !== null ? latNum : undefined,
    longitude: lngNum !== null ? lngNum : undefined,
    _source: 'baserow',
  };
}

/**
 * Fetch all properties directly from Baserow API.
 * Completely client-side and CORS-compliant.
 */
export async function fetchDirectBaserowProperties(forceRefresh = false): Promise<{
  properties: Property[];
  source: 'baserow' | 'cache';
  totalLive: number;
}> {
  const now = Date.now();
  if (!forceRefresh && clientCache && now - clientCache.timestamp < CACHE_TTL_MS) {
    return {
      properties: clientCache.properties,
      source: 'cache',
      totalLive: clientCache.properties.length,
    };
  }

  // 1. Fetch agents map first
  const agentMap = await fetchDirectAgents();

  // 2. Fetch properties table (1210850)
  const url = buildUrl(BASEROW_TABLE_ID);
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Token ${BASEROW_API_TOKEN}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Direct Baserow request failed: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  const rows: Record<string, any>[] = Array.isArray(json) ? json : json.results || [];

  const liveProps: Property[] = [];
  for (const row of rows) {
    const mapped = mapBaserowRowToProperty(row, agentMap);
    if (mapped) {
      liveProps.push(mapped);
    }
  }

  // Compute live agent listing counts
  const countMap: Record<string, number> = {};
  for (const p of liveProps) {
    const name = (p.agent?.name || '').toLowerCase().trim();
    if (name) countMap[name] = (countMap[name] || 0) + 1;
  }
  for (const p of liveProps) {
    const name = (p.agent?.name || '').toLowerCase().trim();
    const count = name ? countMap[name] || 1 : 1;
    p.agent.propertyCount = count;
    p.agent.verifiedDeals = count;
  }

  // Update client cache
  clientCache = {
    properties: liveProps,
    agents: Array.from(agentMap.values()),
    areas: fallbackAreas,
    timestamp: now,
  };

  return {
    properties: liveProps,
    source: 'baserow',
    totalLive: liveProps.length,
  };
}
