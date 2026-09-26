import 'dotenv/config';
import { Property, Agent, Area, PropertyPurpose, PropertyType, FurnishedStatus } from '../types/index';
import { properties as fallbackProperties } from '../data/mockData';

// Baserow API Configuration
const BASEROW_API_URL = process.env.BASEROW_API_URL || 'https://api.baserow.io/api/database/rows/table/';
// Primary properties table in Baserow is 1210850 (1210846 is the default Table 1)
const BASEROW_TABLE_ID = process.env.BASEROW_TABLE_ID || '1210850';
const BASEROW_AGENTS_TABLE_ID = process.env.BASEROW_AGENTS_TABLE_ID || '1210849';
const BASEROW_COMMUNITIES_TABLE_ID = process.env.BASEROW_COMMUNITIES_TABLE_ID || '1210847';
const BASEROW_API_TOKEN = process.env.BASEROW_API_TOKEN || 'sOzrobF91FeRAUTThbQYv8OFenkCtR8c';

// In-memory cache for high performance & handling 1000+ listings gracefully
interface CacheEntry {
  data: Property[];
  timestamp: number;
}

let propertiesCache: CacheEntry | null = null;
const CACHE_TTL_MS = 30 * 1000; // 30 seconds TTL for fast updates

// Helper to safely extract single string or text from Baserow cell
function extractText(val: unknown): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val.replace(/\u00A0/g, ' ').trim();
  if (typeof val === 'number') return String(val);
  if (Array.isArray(val) && val.length > 0) {
    const first = val[0];
    if (typeof first === 'object' && first !== null) {
      return (first.value || first.name || '').replace(/\u00A0/g, ' ').trim();
    }
    return String(first).replace(/\u00A0/g, ' ').trim();
  }
  if (typeof val === 'object' && val !== null) {
    if ('value' in val && typeof (val as any).value === 'string') {
      return (val as any).value.replace(/\u00A0/g, ' ').trim();
    }
    if ('name' in val && typeof (val as any).name === 'string') {
      return (val as any).name.replace(/\u00A0/g, ' ').trim();
    }
  }
  return '';
}

// Helper to parse numbers from currency strings or numeric fields
function extractNumber(val: unknown): number | null {
  if (val === null || val === undefined || val === '') return null;
  if (typeof val === 'number') return isNaN(val) ? null : val;
  const str = String(val).replace(/,/g, '').trim();
  const cleaned = str.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

// Helper to parse coordinates with DMS (degrees° minutes' seconds") or decimal format
export function parseCoordinate(val: unknown): number | null {
  if (val === null || val === undefined || val === '') return null;
  if (typeof val === 'number') return isNaN(val) ? null : val;
  const str = String(val).trim();

  // Match DMS format like 25°11'15.5 or 25°11'15.5"N or 55°15'50.1
  const dmsRegex = /^([+-]?\d+(?:\.\d+)?)\s*[°ºd\s]\s*(\d+(?:\.\d+)?)?\s*['’m\s]?\s*(\d+(?:\.\d+)?)?\s*[\"”s]?\s*([NSEW])?$/i;
  const match = str.match(dmsRegex);
  if (match) {
    const deg = parseFloat(match[1]) || 0;
    const min = parseFloat(match[2]) || 0;
    const sec = parseFloat(match[3]) || 0;
    const dir = match[4]?.toUpperCase();
    let dec = Math.abs(deg) + min / 60 + sec / 3600;
    if (deg < 0 || dir === 'S' || dir === 'W') dec = -dec;
    return dec;
  }

  const cleaned = str.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

// Helper to extract image URLs from Baserow file attachments or string lists
function extractImages(val: unknown): string[] {
  if (!val) return [];
  const urls: string[] = [];

  if (Array.isArray(val)) {
    for (const item of val) {
      if (typeof item === 'string' && item.startsWith('http')) {
        urls.push(item);
      } else if (typeof item === 'object' && item !== null) {
        const fileObj = item as any;
        if (fileObj.url) {
          urls.push(fileObj.url);
        } else if (fileObj.thumbnails?.large?.url) {
          urls.push(fileObj.thumbnails.large.url);
        } else if (fileObj.thumbnails?.card_cover?.url) {
          urls.push(fileObj.thumbnails.card_cover.url);
        }
      }
    }
  } else if (typeof val === 'string') {
    const split = val.split(/[,\n]/).map((s) => s.trim()).filter((s) => s.startsWith('http'));
    urls.push(...split);
  }

  return urls;
}

// Slugify helper
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Known SQFT DXB team advisors with verified details and Baserow S3 photos
const AGENT_PROFILES: Record<string, { title: string; photo: string; phone: string; whatsapp: string; email: string }> = {
  'sahar najahi': {
    title: 'Senior Luxury Property Advisor',
    photo: 'https://baserow-backend-production20240528124524339000000001.s3.amazonaws.com/user_files/XaofJKmPCOKwc60D1NdgfYB9vaT4sWSz_3a73754b6148e0e045993c4b01a315aca932029ba3e261ef2b8943ad75c1137e.jpg',
    phone: '+971 58 864 8093',
    whatsapp: '971588648093',
    email: 'sahar@sqftdxb.com',
  },
  'john kolawole': {
    title: 'Senior Secondary Market Specialist',
    photo: 'https://baserow-backend-production20240528124524339000000001.s3.amazonaws.com/user_files/N1F2d3OdIpJ8naCHrk2iiqcKcype3IPY_7b41e4dce7018eba3541a816883eac26dc1b7524783589ce32afcb839137e065.jpg',
    phone: '+971 58 864 8093',
    whatsapp: '971588648093',
    email: 'john@sqftdxb.com',
  },
  'syeda razvi': {
    title: 'Prime Waterfront & Villa Consultant',
    photo: 'https://baserow-backend-production20240528124524339000000001.s3.amazonaws.com/user_files/7InKg18or5jMsbApopXqXR4KG4ARJLwA_3863d95d35020ba72ebf4492d39728fce0f4ea9716ca996f5fff1d2f502d92cb.jpg',
    phone: '+971 58 864 8093',
    whatsapp: '971588648093',
    email: 'syeda@sqftdxb.com',
  },
  'jaasir shaikh': {
    title: 'Prime Residential & Investment Advisor',
    photo: 'https://baserow-backend-production20240528124524339000000001.s3.amazonaws.com/user_files/gFSsti8qdk8JYIoVgu90qjpGA0eilxQk_1eac4b12730d271af74184f877425f68b0a75fad7bc77526406ceb5e903b92d4.jpg',
    phone: '+971 58 864 8093',
    whatsapp: '971588648093',
    email: 'jaasir@sqftdxb.com',
  },
  'julia melenchuk': {
    title: 'Senior Secondary Market Specialist',
    photo: 'https://baserow-backend-production20240528124524339000000001.s3.amazonaws.com/user_files/QCLOq9Xx5N67P5AkNkZzRvO02VNCIE95_1ca56c11a8fc9b29920a1fd391ee104f8515a1e77e17b8a1c84dc278e9aba732.jpg',
    phone: '+971 58 864 8093',
    whatsapp: '971588648093',
    email: 'julia@sqftdxb.com',
  },
  'ahmad almir': {
    title: 'Senior Property Advisor',
    photo: 'https://baserow-backend-production20240528124524339000000001.s3.amazonaws.com/user_files/Mt6Cs2FjQXdTq0VJi0oHdPJEpD1iKiyD_1a6a6efef8872754f6a2552d5d3d4d1145f4cb7961760e8048d17740703cabf2.jpg',
    phone: '+971 58 864 8093',
    whatsapp: '971588648093',
    email: 'ahmad@sqftdxb.com',
  },
  'mohamed kizawi': {
    title: 'Prime Secondary Market Specialist',
    photo: 'https://baserow-backend-production20240528124524339000000001.s3.amazonaws.com/user_files/WfTSSRYsr8mrWoF9VbIaxu5L5kCWVIX0_1e44f401104c573066f5263b98e72fc020b20ad90fa98ece418bdbab62791ba2.jpg',
    phone: '+971 58 864 8093',
    whatsapp: '971588648093',
    email: 'mohamed@sqftdxb.com',
  },
  'katerina radostina': {
    title: 'Luxury Waterfront Specialist',
    photo: 'https://baserow-backend-production20240528124524339000000001.s3.amazonaws.com/user_files/8LFVxQnHvq0MsWXiVymprKPJBpKClMHO_49a1b8fb5753477a28a039682a4991eb474411f755cacdd06f7496ebf6c22d06.jpg',
    phone: '+971 58 864 8093',
    whatsapp: '971588648093',
    email: 'katerina@sqftdxb.com',
  },
  'george maged': {
    title: 'Investment Portfolio Advisor',
    photo: 'https://baserow-backend-production20240528124524339000000001.s3.amazonaws.com/user_files/RO3uj3RuSbT0woyURuahbcrLKgqRYgmb_fbc37caa90f768b8f83f59e3070288ebfd652c0a588c5b8863474e71c0485da0.jpg',
    phone: '+971 58 864 8093',
    whatsapp: '971588648093',
    email: 'george@sqftdxb.com',
  },
  'ahmed gamal': {
    title: 'Senior Residential Specialist',
    photo: 'https://baserow-backend-production20240528124524339000000001.s3.amazonaws.com/user_files/aDThA4w87P5F5etQY3fRZK3PHGRgGERq_bfd976a77a66d66955fee04e67e2f98db9da90d42363b2fdf32233ce29400019.jpg',
    phone: '+971 58 864 8093',
    whatsapp: '971588648093',
    email: 'ahmed@sqftdxb.com',
  },
  'abdelrahman eljaky': {
    title: 'Prime Residential Advisor',
    photo: 'https://baserow-backend-production20240528124524339000000001.s3.amazonaws.com/user_files/jFg3XFdcwy8HVBf9Yr6RcfzS7kyBxWov_2549c8f9eed89c80b8d05b2b7706908594cfdf3caceb271123dd137abdd61e8c.jpg',
    phone: '+971 58 864 8093',
    whatsapp: '971588648093',
    email: 'abdelrahman@sqftdxb.com',
  },
  'nawras alzuraiqi': {
    title: 'Luxury Villa Specialist',
    photo: 'https://baserow-backend-production20240528124524339000000001.s3.amazonaws.com/user_files/bPjQloiDDrweyYA0kkDpYoGOHG3Mou8c_e073db03f7d977e6f32b3586f6951b4c034da9d8af55747ed5625bbcf8060c11.jpg',
    phone: '+971 58 864 8093',
    whatsapp: '971588648093',
    email: 'nawras@sqftdxb.com',
  },
  'nicolas kapanga': {
    title: 'International Investment Advisor',
    photo: 'https://baserow-backend-production20240528124524339000000001.s3.amazonaws.com/user_files/turuzatejiJvxMEJMbY21ea0ZlCx36gi_92a33562d984cd0750d0d69279fba73f21beb30de58749e4cbe6e934b261d6d7.jpg',
    phone: '+971 58 864 8093',
    whatsapp: '971588648093',
    email: 'nicolas@sqftdxb.com',
  },
  'rozalin husseini': {
    title: 'Prime Residential Consultant',
    photo: 'https://baserow-backend-production20240528124524339000000001.s3.amazonaws.com/user_files/eij2aSVUtNIwU0pQGRjq6GgGIZvFZV5A_39a0214acb5df254ab9a47785bba2277619ac78b037b8fcee0f4970d63bd6d44.jpg',
    phone: '+971 58 864 8093',
    whatsapp: '971588648093',
    email: 'rozalin@sqftdxb.com',
  },
  'muboraksho nazarov': {
    title: 'Commercial & Prime Properties Advisor',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    phone: '+971 58 864 8093',
    whatsapp: '971588648093',
    email: 'mousa@sqftdxb.com',
  },
};

/**
 * Normalizes and maps a single Baserow row from table 1210850 to SQFT DXB Property interface.
 * Returns null if property status is NOT 'LIVE'.
 */
export function mapBaserowRowToProperty(
  row: Record<string, any>,
  liveAgentsByRowId?: Map<number, Agent>,
  liveAgentsByName?: Map<string, Agent>
): Property | null {
  // 1. Listing Status Verification: Only 'LIVE' properties appear publicly
  const statusRaw =
    extractText(row['Listing Status']) ||
    extractText(row['listing_status']) ||
    extractText(row['Status']) ||
    extractText(row['status']) ||
    '';

  const normalizedStatus = statusRaw.trim().toUpperCase();

  // If status is not LIVE (e.g., Draft, Sold, Rented, Hidden, Pending Review, Unavailable, null), filter out!
  if (normalizedStatus !== 'LIVE') {
    return null;
  }

  // 2. Property ID / Reference Number
  const rowId = String(row.id || '');
  const customPropId =
    extractText(row['Property ID']) ||
    extractText(row['property_id']) ||
    extractText(row['Reference Number']) ||
    `SQFT-${rowId}`;

  // 3. Project Name & Building
  const projectName =
    extractText(row['Project Name']) ||
    extractText(row['project_name']) ||
    extractText(row['Project']) ||
    extractText(row['Development']) ||
    '';

  const buildingName =
    extractText(row['Building Name']) ||
    extractText(row['building_name']) ||
    extractText(row['Building']) ||
    extractText(row['Tower']) ||
    '';

  const projectDisplay = projectName || buildingName || 'SQFT Verified';

  // 4. Listing Title
  const rawTitle =
    extractText(row['Listing Title']) ||
    extractText(row['listing_title']) ||
    extractText(row['Title']) ||
    extractText(row['Property Title']) ||
    '';

  // 5. Community / Area & Emirate
  const areaRaw =
    extractText(row['Community / Area']) ||
    extractText(row['Community/Area']) ||
    extractText(row['Community']) ||
    extractText(row['Area']) ||
    'Dubai';

  const emirate =
    extractText(row['Emirate']) ||
    'Dubai';

  const areaId = slugify(areaRaw) || 'dubai';

  // 6. Listing Type (Purpose: Sale or Rent)
  const rawPurpose =
    extractText(row['Listing Type']) ||
    extractText(row['listing_type']) ||
    extractText(row['Sale/Rent']) ||
    extractText(row['Purpose']) ||
    '';

  const purpose: PropertyPurpose = /rent/i.test(rawPurpose) ? 'rent' : 'buy';

  // 7. Property Type
  const rawType =
    extractText(row['Property Type']) ||
    extractText(row['property_type']) ||
    'Apartment';

  let propertyType: PropertyType = 'Apartment';
  if (/villa/i.test(rawType)) propertyType = 'Villa';
  else if (/townhouse/i.test(rawType)) propertyType = 'Townhouse';
  else if (/penthouse/i.test(rawType)) propertyType = 'Penthouse';
  else if (/duplex/i.test(rawType)) propertyType = 'Duplex';

  // 8. Bedrooms & Bathrooms
  const bedroomsNum =
    extractNumber(row['Bedrooms']) ??
    extractNumber(row['bedroom']) ??
    extractNumber(row['Beds']) ??
    2;

  const bathroomsNum =
    extractNumber(row['Bathrooms']) ??
    extractNumber(row['bathroom']) ??
    extractNumber(row['Baths']) ??
    2;

  // 9. Sizes: Property Size & Plot Size
  const sqftNum =
    extractNumber(row['Property Size (sqft)']) ??
    extractNumber(row['Property Size']) ??
    extractNumber(row['Size']) ??
    extractNumber(row['Sqft']) ??
    1500;

  const plotSizeNum =
    extractNumber(row['Plot Size (sqft)']) ??
    extractNumber(row['Plot Size']);

  // 10. Price in AED
  const priceNum =
    extractNumber(row['Price']) ??
    extractNumber(row['Price in AED']) ??
    extractNumber(row['Price (AED)']) ??
    2500000;

  const priceDisplay = `AED ${priceNum.toLocaleString()}`;
  const priceUnit = purpose === 'rent' ? '/ year' : undefined;
  const pricePerSqft = sqftNum > 0 ? Math.round(priceNum / sqftNum) : undefined;

  // 11. Title Construction
  const title =
    rawTitle ||
    `${bedroomsNum > 0 ? `${bedroomsNum}-Bedroom` : 'Luxury'} ${propertyType} in ${projectDisplay}, ${areaRaw}`;

  const slug = slugify(`${projectDisplay}-${customPropId}`) || `prop-${rowId}`;

  // 12. Photos: Cover Image (primary) + Gallery Images
  const coverImages = extractImages(row['Cover Image'] || row['cover_image']);
  const galleryImages = extractImages(row['Gallery Images'] || row['gallery_images'] || row['Photos'] || row['Images']);
  const floorPlanImages = extractImages(row['Floor Plan'] || row['floor_plan']);

  const allImages = [...coverImages, ...galleryImages];
  const uniqueImages = Array.from(new Set(allImages));

  // High-res fallback if no photos uploaded in row
  const images =
    uniqueImages.length > 0
      ? uniqueImages
      : [
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
          'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85',
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85',
        ];

  // 13. Descriptions
  const fullDesc = extractText(row['Full Description']);
  const shortDesc = extractText(row['Short Description']);
  const description =
    fullDesc ||
    shortDesc ||
    `Verified secondary market ${propertyType.toLowerCase()} located in ${projectDisplay}, ${areaRaw}, Dubai. Delivered ready with confirmed title deed verification and immediate viewing handover.`;

  // 14. Amenities Collection (from boolean fields + explicit amenity list)
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
    if (row[colName] === true) {
      amenities.push(label);
    }
  }

  // Also check if text amenities column exists
  const textAmenities = row['Amenities'] ? extractText(row['Amenities']).split(/[,\n]/).map((s) => s.trim()).filter(Boolean) : [];
  for (const item of textAmenities) {
    if (!amenities.includes(item)) amenities.push(item);
  }

  // Default amenities if none selected
  const defaultAmenities = [
    '24/7 Gated Security',
    'Landscaped Parks & Green Spaces',
    'Covered Resident Parking',
    'Contemporary Finishes',
  ];

  // 15. Additional Customer-Facing Specifications (Section 7)
  const furnishingRaw =
    extractText(row['Furnishing']) ||
    extractText(row['Furnishing Status']) ||
    'Unfurnished';

  let furnishedStatus: FurnishedStatus = 'Unfurnished';
  if (/semi/i.test(furnishingRaw)) furnishedStatus = 'Semi-Furnished';
  else if (/unfurnished/i.test(furnishingRaw)) furnishedStatus = 'Unfurnished';
  else if (/furnished/i.test(furnishingRaw)) furnishedStatus = 'Furnished';

  const parkingSpaces =
    extractNumber(row['Parking Spaces']) ??
    (row['Covered Parking'] || row['Parking'] ? 2 : 1);

  const viewType =
    extractText(row['View Description']) ||
    extractText(row['View']) ||
    (row['Burj View'] ? 'Burj Khalifa View' : row['Marina View'] ? 'Marina View' : row['Sea View'] ? 'Sea View' : 'Community & Garden View');

  const floorNumber = extractText(row['Floor Number']);
  const totalFloors = extractText(row['Total Floors']);
  const floorDisplay = floorNumber
    ? totalFloors
      ? `Floor ${floorNumber} of ${totalFloors}`
      : `Floor ${floorNumber}`
    : 'Mid Floor';

  const developer = extractText(row['Developer']);
  const propertyCondition = extractText(row['Property Condition']) || 'Brand New';

  // 16. Coordinates: Latitude & Longitude (parsed with DMS support)
  const latNum = parseCoordinate(row['Latitude']);
  const lngNum = parseCoordinate(row['Longitude']);

  // 17. Assigned Agent
  let matchedAgent: Agent | undefined;

  // 17a. Match via relational link in row['Agent'] (e.g. [ { id: 3, value: 'Sahar Najahi' } ])
  if (Array.isArray(row['Agent']) && row['Agent'].length > 0) {
    const first = row['Agent'][0];
    if (typeof first === 'object' && first !== null) {
      if (first.id && liveAgentsByRowId?.has(first.id)) {
        matchedAgent = liveAgentsByRowId.get(first.id);
      } else if (first.value && liveAgentsByName) {
        matchedAgent = liveAgentsByName.get(String(first.value).toLowerCase().trim());
      }
    }
  }

  // 17b. Match via string/text representation
  const agentRawName =
    matchedAgent?.name ||
    extractText(row['Agent']) ||
    extractText(row['agent']) ||
    extractText(row['Agent Name']) ||
    extractText(row['agent_name']) ||
    extractText(row['Assigned Agent']) ||
    extractText(row['Broker']) ||
    'Sahar Najahi';

  const agentKey = agentRawName.toLowerCase().trim();
  if (!matchedAgent && liveAgentsByName?.has(agentKey)) {
    matchedAgent = liveAgentsByName.get(agentKey);
  }

  const knownProfile = AGENT_PROFILES[agentKey];

  const agent: Agent = {
    id: matchedAgent?.id || `agent-${slugify(agentRawName || 'sahar')}`,
    name: matchedAgent?.name || agentRawName || 'Sahar Najahi',
    title: (matchedAgent?.title && matchedAgent.title.trim().length > 0)
      ? matchedAgent.title
      : (knownProfile?.title || 'Senior Secondary Market Specialist'),
    phone: (matchedAgent?.phone && matchedAgent.phone.trim().length > 0)
      ? matchedAgent.phone
      : (knownProfile?.phone || '+971 58 864 8093'),
    whatsapp: (matchedAgent?.whatsapp && matchedAgent.whatsapp.trim().length > 0)
      ? matchedAgent.whatsapp
      : (knownProfile?.whatsapp || '971588648093'),
    email: (matchedAgent?.email && matchedAgent.email.trim().length > 0)
      ? matchedAgent.email
      : (knownProfile?.email || 'sales@sqftdxb.com'),
    photo: (matchedAgent?.photo && matchedAgent.photo.trim().length > 0)
      ? matchedAgent.photo
      : (knownProfile?.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'),
    reraNumber: matchedAgent?.reraNumber || '',
    verifiedDeals: 140,
    propertyCount: matchedAgent?.propertyCount,
  };

  // Highlights list
  const highlights: string[] = [
    'Title Deed Verified with Dubai Land Department',
    'Delivered Vacant on Transfer / Ready',
    `${bedroomsNum} En-Suite Bedrooms`,
    `${parkingSpaces} Dedicated Parking Bays`,
    propertyCondition || 'Immediate Physical Viewing',
  ];
  if (plotSizeNum) {
    highlights.push(`Plot Area: ${plotSizeNum.toLocaleString()} sq.ft`);
  }

  return {
    id: customPropId || `prop-${rowId}`,
    baserowRowId: row.id,
    title,
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
    shortDescription: shortDesc || undefined,
    fullDescription: fullDesc || undefined,
    features: highlights,
    amenities: amenities.length > 0 ? amenities : defaultAmenities,
    floor: floorDisplay,
    parkingSpaces,
    furnishedStatus,
    furniture: furnishingRaw,
    furnishing: furnishingRaw,
    viewType,
    reraPermit: `PERMIT-DXB-${rowId.padStart(6, '0')}`,
    referenceNumber: customPropId,
    agent,
    isFeatured: row['Featured Listing'] === true,
    createdAt: extractText(row['Date Added']) || new Date().toISOString().split('T')[0],
    latitude: latNum !== null ? latNum : undefined,
    longitude: lngNum !== null ? lngNum : undefined,
    _source: 'baserow',
  };
}

interface AgentsCacheEntry {
  byRowId: Map<number, Agent>;
  byName: Map<string, Agent>;
  list: Agent[];
  timestamp: number;
}

let agentsCache: AgentsCacheEntry | null = null;
const AGENTS_CACHE_TTL_MS = 20 * 1000; // 20s TTL for fast live sync

/**
 * Fetch all agents directly from Baserow table 1210849.
 * Caches in-memory for 20 seconds.
 */
export async function fetchBaserowAgentsRaw(forceRefresh = false): Promise<AgentsCacheEntry> {
  const now = Date.now();
  if (!forceRefresh && agentsCache && now - agentsCache.timestamp < AGENTS_CACHE_TTL_MS) {
    return agentsCache;
  }

  const byRowId = new Map<number, Agent>();
  const byName = new Map<string, Agent>();
  const list: Agent[] = [];

  const token = process.env.BASEROW_API_TOKEN || BASEROW_API_TOKEN;
  if (!token) {
    return { byRowId, byName, list: [], timestamp: now };
  }

  try {
    const url = buildBaserowUrl(BASEROW_AGENTS_TABLE_ID);
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      const rows: Record<string, any>[] = Array.isArray(data) ? data : data.results || [];

      for (const row of rows) {
        const rawName = extractText(row['Agent Name']);
        if (!rawName) continue;
        const key = rawName.toLowerCase().trim();
        const knownProfile = AGENT_PROFILES[key];
        const photos = extractImages(row['Profile Photo']);
        const photo =
          photos[0] ||
          knownProfile?.photo ||
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80';

        const agent: Agent = {
          id: `agent-${slugify(rawName)}`,
          name: rawName,
          title: extractText(row['Job Title']) || knownProfile?.title || 'Senior Secondary Market Specialist',
          phone: extractText(row['Phone Number']) || knownProfile?.phone || '+971 58 864 8093',
          whatsapp: extractText(row['WhatsApp Number']) || knownProfile?.whatsapp || '971588648093',
          email: extractText(row['Email']) || knownProfile?.email || 'sales@sqftdxb.com',
          photo,
          reraNumber: extractText(row['BRN / License']),
          verifiedDeals: 0,
          propertyCount: 0,
        };

        byRowId.set(row.id, agent);
        byName.set(key, agent);
        list.push(agent);
      }
    }
  } catch (error) {
    console.error('[Baserow] Failed to fetch raw agents table:', error);
  }

  agentsCache = { byRowId, byName, list, timestamp: now };
  return agentsCache;
}

function buildBaserowUrl(tableId: string): string {
  let baseUrl = (process.env.BASEROW_API_URL || 'https://api.baserow.io/api/database/rows/table/').trim();
  if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
  if (!baseUrl.includes('/api/database/rows/table')) {
    baseUrl = `${baseUrl}/api/database/rows/table`;
  }
  return `${baseUrl}/${tableId}/?user_field_names=true&size=200`;
}

/**
 * Fetch all properties from Baserow table.
 * Applies server-side filtering for listing status = LIVE.
 * Implements caching and graceful fallback.
 */
export async function getLiveProperties(forceRefresh = false): Promise<{
  properties: Property[];
  source: 'baserow' | 'cache' | 'fallback';
  totalLive: number;
}> {
  const now = Date.now();

  // Return from in-memory cache if valid and refresh not forced
  if (!forceRefresh && propertiesCache && now - propertiesCache.timestamp < CACHE_TTL_MS) {
    return {
      properties: propertiesCache.data,
      source: 'cache',
      totalLive: propertiesCache.data.length,
    };
  }

  // Check if API token is available
  const token = process.env.BASEROW_API_TOKEN || BASEROW_API_TOKEN;
  let tableId = process.env.BASEROW_TABLE_ID || BASEROW_TABLE_ID;

  // Auto-resolve: if table 1210846 (Table 1 default) was passed, default to table 1210850 (Properties table)
  if (tableId === '1210846' || !tableId) {
    tableId = '1210850';
  }

  if (!token) {
    console.warn('[Baserow] Warning: BASEROW_API_TOKEN is not configured in environment. Serving verified catalog.');
    return {
      properties: fallbackProperties,
      source: 'fallback',
      totalLive: fallbackProperties.length,
    };
  }

  try {
    const url = buildBaserowUrl(tableId);
    console.log(`[Baserow] Fetching live properties & agents from: ${url}`);

    const [agentsEntry, res] = await Promise.all([
      fetchBaserowAgentsRaw(forceRefresh),
      fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          Accept: 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; SQFTDXB-Bot/1.0)',
        },
      }),
    ]);

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error(`[Baserow] API request failed with status ${res.status}: ${errText}`);
      return {
        properties: propertiesCache?.data || fallbackProperties,
        source: 'fallback',
        totalLive: (propertiesCache?.data || fallbackProperties).length,
      };
    }

    const data = await res.json();
    const rows: Record<string, any>[] = Array.isArray(data) ? data : data.results || [];

    // Map each row with live agents map so photos from Baserow are used directly
    const liveProps: Property[] = [];
    for (const row of rows) {
      const mapped = mapBaserowRowToProperty(row, agentsEntry.byRowId, agentsEntry.byName);
      if (mapped) {
        liveProps.push(mapped);
      }
    }

    console.log(`[Baserow] Successfully fetched ${rows.length} rows, found ${liveProps.length} LIVE properties.`);

    // Calculate live property count for each agent directly from the database
    const agentLiveCountMap: Record<string, number> = {};
    for (const p of liveProps) {
      const aName = (p.agent?.name || '').trim().toLowerCase();
      if (aName) {
        agentLiveCountMap[aName] = (agentLiveCountMap[aName] || 0) + 1;
      }
    }
    for (const p of liveProps) {
      const aName = (p.agent?.name || '').trim().toLowerCase();
      const count = aName ? (agentLiveCountMap[aName] || 1) : 1;
      p.agent.propertyCount = count;
      p.agent.verifiedDeals = count;
    }

    // If live properties found, update cache
    if (liveProps.length > 0) {
      propertiesCache = {
        data: liveProps,
        timestamp: now,
      };
      return {
        properties: liveProps,
        source: 'baserow',
        totalLive: liveProps.length,
      };
    }

    // If table returned rows but none were marked 'LIVE', use cache or fallback
    if (propertiesCache?.data && propertiesCache.data.length > 0) {
      return {
        properties: propertiesCache.data,
        source: 'cache',
        totalLive: propertiesCache.data.length,
      };
    }

    return {
      properties: fallbackProperties,
      source: 'fallback',
      totalLive: fallbackProperties.length,
    };
  } catch (error: any) {
    console.error('[Baserow] Exception connecting to Baserow API:', error?.message || error);
    return {
      properties: propertiesCache?.data || fallbackProperties,
      source: 'fallback',
      totalLive: (propertiesCache?.data || fallbackProperties).length,
    };
  }
}

/**
 * Fetch a single property by ID or slug.
 */
export async function getPropertyById(id: string): Promise<Property | null> {
  const { properties } = await getLiveProperties();
  const match = properties.find((p) => p.id === id || p.slug === id || String(p.baserowRowId) === id);
  return match || null;
}

/**
 * Fetch all agents with their exact live property counts directly from the database.
 */
export async function getLiveAgents(forceRefresh = false): Promise<Agent[]> {
  const [agentsEntry, propertiesResult] = await Promise.all([
    fetchBaserowAgentsRaw(forceRefresh),
    getLiveProperties(forceRefresh),
  ]);

  const properties = propertiesResult.properties;

  // Compute live property count for each agent directly from the properties table
  const agentLivePropertyCount: Record<string, number> = {};
  for (const p of properties) {
    const name = (p.agent?.name || '').trim().toLowerCase();
    if (name) {
      agentLivePropertyCount[name] = (agentLivePropertyCount[name] || 0) + 1;
    }
  }

  const agents: Agent[] = [];

  for (const rawAgent of agentsEntry.list) {
    const key = rawAgent.name.toLowerCase().trim();
    const count = agentLivePropertyCount[key] || 0;
    agents.push({
      ...rawAgent,
      verifiedDeals: count,
      propertyCount: count,
    });
  }

  // If no agents were loaded from table, fallback to constructed agents
  if (agents.length === 0) {
    const agentsMap = new Map<string, Agent>();
    for (const p of properties) {
      const name = p.agent?.name?.trim();
      if (name && !agentsMap.has(name.toLowerCase())) {
        const key = name.toLowerCase();
        const count = agentLivePropertyCount[key] || 1;
        agentsMap.set(key, {
          ...p.agent,
          propertyCount: count,
          verifiedDeals: count,
        });
      }
    }

    for (const [key, profile] of Object.entries(AGENT_PROFILES)) {
      if (!agentsMap.has(key)) {
        const formattedName = key.split(' ').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
        const count = agentLivePropertyCount[key] || 0;
        agentsMap.set(key, {
          id: `agent-${slugify(formattedName)}`,
          name: formattedName,
          title: profile.title,
          phone: profile.phone,
          whatsapp: profile.whatsapp,
          email: profile.email,
          photo: profile.photo,
          reraNumber: '',
          verifiedDeals: count,
          propertyCount: count,
        });
      }
    }
    agents.push(...Array.from(agentsMap.values()));
  }

  // Sort: agents with properties first (descending count), then others alphabetically
  agents.sort((a, b) => {
    const countA = a.propertyCount ?? a.verifiedDeals ?? 0;
    const countB = b.propertyCount ?? b.verifiedDeals ?? 0;
    if (countB !== countA) return countB - countA;
    return a.name.localeCompare(b.name);
  });

  return agents;
}

/**
 * Curated metadata dictionary for Dubai areas.
 * Note: avgPriceSqft is intentionally omitted/hidden as requested.
 * The readyCount is strictly computed directly from live database properties!
 */
export const CURATED_AREA_METADATA: Record<
  string,
  {
    name: string;
    image: string;
    description: string;
    landmark: string;
    popularTypes: string[];
  }
> = {
  difc: {
    name: 'DIFC',
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=85',
    description: 'Dubai’s global financial and culinary capital, featuring ultra-luxury modern high-rises, world-class art galleries, and Michelin-starred dining.',
    landmark: 'The Gate Building & Gate Village',
    popularTypes: ['Apartment', 'Penthouse', 'Duplex'],
  },
  'dubai-marina': {
    name: 'Dubai Marina',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
    description: 'Vibrant waterfront community with iconic towers, private yacht slips, and walkable promenades.',
    landmark: 'Marina Promenade & Dubai Marina Mall',
    popularTypes: ['Apartment', 'Penthouse', 'Duplex'],
  },
  'palm-jumeirah': {
    name: 'Palm Jumeirah',
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1000&q=85',
    description: 'World-renowned man-made archipelago offering exclusive beachfront villas and ultra-luxury penthouses.',
    landmark: 'Atlantis The Royal & Nakheel Mall',
    popularTypes: ['Villa', 'Penthouse', 'Apartment'],
  },
  'downtown-dubai': {
    name: 'Downtown Dubai',
    image: 'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=1000&q=85',
    description: 'The prestigious beating heart of Dubai, centered around Burj Khalifa, Dubai Mall, and Dubai Opera.',
    landmark: 'Burj Khalifa & Dubai Opera',
    popularTypes: ['Apartment', 'Penthouse'],
  },
  'business-bay': {
    name: 'Business Bay',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=85',
    description: 'Dynamic canal-front commercial and residential district directly adjacent to Downtown Dubai.',
    landmark: 'Dubai Water Canal & The Opus by Zaha Hadid',
    popularTypes: ['Apartment', 'Duplex', 'Commercial'],
  },
  'dubai-hills-estate': {
    name: 'Dubai Hills Estate',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85',
    description: 'Master-planned championship golf community with vast parks, Dubai Hills Mall, and prime family villas.',
    landmark: 'Dubai Hills Golf Club & Central Park',
    popularTypes: ['Villa', 'Townhouse', 'Apartment'],
  },
  'mohammed-bin-rashid-city-mbr-city': {
    name: 'Mohammed Bin Rashid City (MBR City)',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=85',
    description: 'Ultra-prime master community home to luxury designer villas, tranquil crystal lagoons, and the Meydan Racecourse.',
    landmark: 'Meydan One & Crystal Lagoons',
    popularTypes: ['Villa', 'Townhouse', 'Apartment'],
  },
  'arabian-ranches-3': {
    name: 'Arabian Ranches 3',
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=85',
    description: 'Contemporary family-oriented community featuring landscaped parks, splash pads, and sleek modern townhouses.',
    landmark: 'Central Park & Clubhouse',
    popularTypes: ['Townhouse', 'Villa'],
  },
  'arabian-ranches': {
    name: 'Arabian Ranches',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=85',
    description: 'Established, tranquil desert oasis community famous for Spanish and Mediterranean family villas.',
    landmark: 'Arabian Ranches Golf Club & Polo Club',
    popularTypes: ['Villa', 'Townhouse'],
  },
  'tilal-al-ghaf': {
    name: 'Tilal Al Ghaf',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85',
    description: 'Resort-style luxury community centered around the pristine sandy beaches of Lagoon Al Ghaf and private signature mansions.',
    landmark: 'Lagoon Al Ghaf & Sandy Beaches',
    popularTypes: ['Villa', 'Townhouse'],
  },
  'nas-al-sheba-gardens-2': {
    name: 'Nad Al Sheba Gardens',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=85',
    description: 'Exclusive, serene residential haven offering spacious bespoke villas nestled amongst winding green trails and leafy parks.',
    landmark: 'Nad Al Sheba Cycle Park & Falconcity',
    popularTypes: ['Villa', 'Townhouse'],
  },
  'hadaeq-sheikh-mohammed-bin-rashid-district-11': {
    name: 'Hadaeq Sheikh Mohammed Bin Rashid (District 11)',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=85',
    description: 'Prestigious low-density enclave featuring branded waterfront villas, private lagoons, and immediate Downtown access.',
    landmark: 'Address Hillcrest & District 11 Lagoon',
    popularTypes: ['Villa', 'Townhouse'],
  },
  jbr: {
    name: 'Jumeirah Beach Residence (JBR)',
    image: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=1000&q=85',
    description: 'A 1.7 km beachfront strip featuring seaside retail, dining, and resort-style secondary residences.',
    landmark: 'The Beach at JBR & Ain Dubai',
    popularTypes: ['Apartment', 'Penthouse'],
  },
  jumeirah: {
    name: 'Jumeirah',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1000&q=85',
    description: 'Historic prestigious coastal strip known for private beach villas and Mediterranean low-rise enclaves.',
    landmark: 'Burj Al Arab & Port de La Mer',
    popularTypes: ['Villa', 'Apartment'],
  },
};

/**
 * Checks if a property belongs to a given area by checking areaId, area text, and partial substrings.
 */
function matchesArea(property: Property, targetSlug: string, targetName: string): boolean {
  const pArea = (property.area || '').toLowerCase().trim();
  const pAreaId = (property.areaId || '').toLowerCase().trim();
  const tSlug = targetSlug.toLowerCase().trim();
  const tName = targetName.toLowerCase().trim();

  if (pAreaId === tSlug || pArea === tName) return true;
  if (tSlug && pAreaId.includes(tSlug)) return true;
  if (pAreaId && tSlug.includes(pAreaId)) return true;
  if (tName && pArea.includes(tName)) return true;
  if (pArea && tName.includes(pArea)) return true;

  // Specific community aliases
  if ((tSlug === 'difc' || tName === 'difc') && (pArea.includes('difc') || pArea.includes('financial'))) return true;
  if (tSlug.includes('arabian-ranches') && pArea.includes('arabian ranches')) return true;
  if (tSlug.includes('sheba') && pArea.includes('sheba')) return true;
  if (tSlug.includes('mohammed-bin-rashid') && (pArea.includes('mbr') || pArea.includes('mohammed bin rashid'))) return true;

  return false;
}

/**
 * Fetch all areas dynamically from the database.
 * - Auto-discovers any new area added in Table 1210850 (Properties) or Table 1210847 (Communities).
 * - Exact property count is computed directly from live database properties!
 * - Photos and landmarks are auto-linked from listings.
 * - Avg. secondary rate is excluded.
 */
export async function getLiveAreas(forceRefresh = false): Promise<Area[]> {
  const { properties } = await getLiveProperties(forceRefresh);

  // 1. Collect all communities from Table 1210847
  const token = process.env.BASEROW_API_TOKEN || BASEROW_API_TOKEN;
  const discoveredNames = new Set<string>();

  try {
    const url = buildBaserowUrl(BASEROW_COMMUNITIES_TABLE_ID);
    const res = await fetch(url, {
      headers: {
        Authorization: `Token ${token}`,
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      const rows: Record<string, any>[] = Array.isArray(data) ? data : data.results || [];
      for (const row of rows) {
        const name = extractText(row['Community Name']) || extractText(row['Name']);
        if (name && name.toLowerCase() !== 'dubai') {
          discoveredNames.add(name);
        }
      }
    }
  } catch (error) {
    console.error('[Baserow] Failed to fetch communities table:', error);
  }

  // 2. Discover any area present in live properties (e.g. newly added DIFC, etc.)
  for (const p of properties) {
    const areaName = (p.area || '').trim();
    if (areaName && areaName.toLowerCase() !== 'dubai') {
      discoveredNames.add(areaName);
    }
  }

  // 3. Include standard Dubai prime areas
  for (const meta of Object.values(CURATED_AREA_METADATA)) {
    discoveredNames.add(meta.name);
  }

  // 4. Build comprehensive Area list with exact live counts from database
  const areasList: Area[] = [];
  const processedSlugs = new Set<string>();
  const processedNames = new Set<string>();

  for (const name of discoveredNames) {
    const slug = slugify(name);
    if (!slug || processedSlugs.has(slug)) continue;

    // Look for exact matching curated metadata first
    let curatedKey: string | undefined;
    if (CURATED_AREA_METADATA[slug]) {
      curatedKey = slug;
    } else {
      curatedKey = Object.keys(CURATED_AREA_METADATA).find(
        (k) => CURATED_AREA_METADATA[k].name.toLowerCase() === name.toLowerCase()
      );
    }
    if (!curatedKey) {
      curatedKey = Object.keys(CURATED_AREA_METADATA).find(
        (k) => k === slug || (slug.startsWith(k) && k.length > 5)
      );
    }

    const curated = curatedKey ? CURATED_AREA_METADATA[curatedKey] : null;
    const finalName = curated?.name || name;
    const finalSlug = slugify(finalName);

    if (processedNames.has(finalName.toLowerCase()) || processedSlugs.has(finalSlug)) {
      continue;
    }
    processedSlugs.add(slug);
    processedSlugs.add(finalSlug);
    processedNames.add(finalName.toLowerCase());

    // Filter properties matching this area in the database
    const matchingProps = properties.filter((p) => matchesArea(p, finalSlug, finalName));
    const liveCount = matchingProps.length;

    // Pick photo: property photo if available, or curated photo, or high-res Dubai photo
    const propImage = matchingProps.find((p) => p.images && p.images.length > 0)?.images[0];
    const image = propImage || curated?.image || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85';

    // Unique property types
    const types = Array.from(new Set(matchingProps.map((p) => p.propertyType).filter(Boolean)));
    const popularTypes = types.length > 0 ? types : curated?.popularTypes || ['Apartment', 'Villa'];

    // Landmark: project name from matching property, or curated, or default
    const landmark = matchingProps[0]?.projectName || curated?.landmark || `${finalName} District`;

    // Description
    const description =
      curated?.description ||
      `Premier secondary residential destination in ${finalName}, Dubai. Featuring ready-to-move properties with title deeds verified and immediate key handover.`;

    areasList.push({
      id: finalSlug,
      name: finalName,
      slug: finalSlug,
      image,
      description,
      landmark,
      popularTypes,
      propertyCount: liveCount,
      readyCount: liveCount,
      avgPriceSqft: 0,
      featured: true,
    });
  }

  // Sort areas: communities with live properties first (descending), then alphabetically
  areasList.sort((a, b) => {
    if (b.readyCount !== a.readyCount) return b.readyCount - a.readyCount;
    return a.name.localeCompare(b.name);
  });

  return areasList;
}
