import { Property, Agent, Area } from '../types';
import { properties as fallbackProperties, agents as fallbackAgents, areas as fallbackAreas } from '../data/mockData';
import { fetchDirectBaserowProperties } from './baserowClient';

export interface PropertiesResponse {
  properties: Property[];
  source: 'baserow' | 'cache' | 'fallback';
  totalLive: number;
}

/**
 * Fetches all live properties.
 * 1. Tries Express backend proxy (/api/properties)
 * 2. If backend is not available (e.g. static hosting, Vercel/Netlify static, network error, or 404),
 *    immediately fails over to direct Baserow API (table 1210850)
 * 3. Gracefully falls back to pre-seeded verified catalog if completely offline
 */
export async function fetchLiveProperties(forceRefresh = false): Promise<PropertiesResponse> {
  // 1. Try server proxy endpoint first
  try {
    const url = `/api/properties${forceRefresh ? '?refresh=true' : ''}`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          return {
            properties: data.data,
            source: data.source || 'baserow',
            totalLive: data.count || data.data.length,
          };
        }
      }
    }
  } catch {
    // Backend proxy not reachable (expected on static deployments)
  }

  // 2. Failover: Query Baserow API directly from browser (CORS supported)
  try {
    const directResult = await fetchDirectBaserowProperties(forceRefresh);
    if (directResult.properties.length > 0) {
      return directResult;
    }
  } catch (directErr) {
    console.warn('[PropertyService] Direct Baserow fetch failed, using pre-seeded catalog:', directErr);
  }

  // 3. Fallback: Pre-seeded verified properties
  return {
    properties: fallbackProperties,
    source: 'fallback',
    totalLive: fallbackProperties.length,
  };
}

/**
 * Fetches single property detail by ID.
 */
export async function fetchPropertyById(id: string): Promise<Property | null> {
  try {
    const res = await fetch(`/api/properties/${encodeURIComponent(id)}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success && data.data) return data.data;
      }
    }
  } catch {
    // Ignore server error, proceed to fallback lookup
  }

  // Check in-memory/direct properties
  try {
    const direct = await fetchDirectBaserowProperties();
    const found = direct.properties.find(
      (p) => p.id === id || p.slug === id || String(p.baserowRowId) === id
    );
    if (found) return found;
  } catch {
    // Ignore
  }

  return fallbackProperties.find((p) => p.id === id || p.slug === id) || null;
}

/**
 * Fetches all active agents with their actual live property counts directly from database.
 */
export async function fetchLiveAgents(forceRefresh = false): Promise<Agent[]> {
  try {
    const url = `/api/agents${forceRefresh ? '?refresh=true' : ''}`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          return data.data;
        }
      }
    }
  } catch {
    // Backend not reachable
  }

  // Use agents derived from direct Baserow properties
  try {
    const direct = await fetchDirectBaserowProperties(forceRefresh);
    const agentMap = new Map<string, Agent>();
    for (const p of direct.properties) {
      if (p.agent && !agentMap.has(p.agent.name)) {
        agentMap.set(p.agent.name, p.agent);
      }
    }
    if (agentMap.size > 0) {
      return Array.from(agentMap.values());
    }
  } catch {
    // Ignore
  }

  return fallbackAgents;
}

/**
 * Fetches all Dubai areas with dynamic property counts and newly added areas (e.g. DIFC).
 */
export async function fetchLiveAreas(forceRefresh = false): Promise<Area[]> {
  try {
    const url = `/api/areas${forceRefresh ? '?refresh=true' : ''}`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      return data.data;
    }

    return [];
  } catch (error) {
    console.warn('[PropertyService] Network error fetching areas:', error);
    return [];
  }
}

/**
 * Client-side helper to dynamically compute & deduplicate areas strictly from loaded live database properties.
 * Eliminates duplicate areas and only surfaces communities that actually exist in the Baserow database.
 */
export function computeDynamicAreas(liveProperties: Property[], baseAreas: Area[] = []): Area[] {
  // If baseAreas contains valid database-sourced areas, use them as lookup for enriched metadata
  const areaMetadataMap = new Map<string, Area>();
  for (const b of baseAreas) {
    const key = (b.slug || b.id || '').toLowerCase().trim();
    if (key) {
      areaMetadataMap.set(key, b);
      areaMetadataMap.set(b.name.toLowerCase().trim(), b);
    }
  }

  const areaMap = new Map<
    string,
    {
      id: string;
      name: string;
      slug: string;
      matchingProps: Property[];
    }
  >();

  // Extract areas strictly from live database properties
  for (const p of liveProperties) {
    const rawName = (p.area || '').trim();
    if (!rawName || rawName.toLowerCase() === 'dubai') continue;

    const slug = (
      p.areaId || rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    )
      .toLowerCase()
      .trim();
    if (!slug) continue;

    if (!areaMap.has(slug)) {
      areaMap.set(slug, {
        id: slug,
        name: rawName,
        slug,
        matchingProps: [],
      });
    }

    areaMap.get(slug)!.matchingProps.push(p);
  }

  // If liveProperties is still loading but baseAreas has areas, use baseAreas directly
  if (areaMap.size === 0 && baseAreas.length > 0) {
    return baseAreas;
  }

  const result: Area[] = [];

  for (const [slug, { name, matchingProps }] of areaMap.entries()) {
    const liveCount = matchingProps.length;
    const existing = areaMetadataMap.get(slug) || areaMetadataMap.get(name.toLowerCase().trim());

    const propImage = matchingProps.find((p) => p.images && p.images.length > 0)?.images[0];
    const image =
      existing?.image ||
      propImage ||
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85';

    const types = Array.from(new Set(matchingProps.map((p) => p.propertyType).filter(Boolean)));
    const popularTypes = types.length > 0 ? types : existing?.popularTypes || ['Apartment', 'Villa'];

    const landmark = matchingProps[0]?.projectName || existing?.landmark || `${name} Central`;
    const description =
      existing?.description ||
      `Premier secondary residential destination in ${name}, Dubai. Featuring verified ready-to-move properties with title deeds verified and immediate key handover.`;

    result.push({
      id: slug,
      name,
      slug,
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

  // Sort: areas with most live properties first (descending), then alphabetically
  result.sort((a, b) => {
    if (b.readyCount !== a.readyCount) return b.readyCount - a.readyCount;
    return a.name.localeCompare(b.name);
  });

  return result;
}
