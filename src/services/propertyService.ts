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
      return fallbackAreas;
    }

    const data = await res.json();
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      return data.data;
    }

    return fallbackAreas;
  } catch (error) {
    console.warn('[PropertyService] Network error fetching areas:', error);
    return fallbackAreas;
  }
}

/**
 * Client-side helper to dynamically compute & auto-discover areas from loaded live properties.
 * If a new listing is added in Baserow (e.g. for DIFC), it automatically surfaces the area with
 * its picture, title, landmark, and exact ready properties count.
 */
export function computeDynamicAreas(liveProperties: Property[], baseAreas: Area[] = fallbackAreas): Area[] {
  const result: Area[] = [];
  const processedSlugs = new Set<string>();

  // Helper to match area
  const matchArea = (p: Property, areaId: string, areaName: string) => {
    const pArea = (p.area || '').toLowerCase().trim();
    const pAreaId = (p.areaId || '').toLowerCase().trim();
    const aId = areaId.toLowerCase().trim();
    const aName = areaName.toLowerCase().trim();

    if (pAreaId === aId || pArea === aName) return true;
    if (aId && pAreaId.includes(aId)) return true;
    if (pAreaId && aId.includes(pAreaId)) return true;
    if (aName && pArea.includes(aName)) return true;
    if (pArea && aName.includes(pArea)) return true;
    if ((aId === 'difc' || aName === 'difc') && (pArea.includes('difc') || pArea.includes('financial'))) return true;
    return false;
  };

  // 1. Process base areas with exact property counts from live database
  for (const base of baseAreas) {
    const matching = liveProperties.filter((p) => matchArea(p, base.id, base.name));
    const liveCount = matching.length;
    const propImage = matching.find((p) => p.images && p.images.length > 0)?.images[0];

    processedSlugs.add(base.id);
    result.push({
      ...base,
      image: propImage || base.image,
      propertyCount: liveCount,
      readyCount: liveCount,
      avgPriceSqft: 0, // Hidden as requested
    });
  }

  // 2. Discover any brand new area present in live properties (e.g. DIFC if not already listed)
  for (const p of liveProperties) {
    const areaName = (p.area || '').trim();
    if (!areaName || areaName.toLowerCase() === 'dubai') continue;
    const slug = (p.areaId || areaName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'));

    if (!processedSlugs.has(slug)) {
      processedSlugs.add(slug);
      const matching = liveProperties.filter((item) => matchArea(item, slug, areaName));
      const liveCount = matching.length;
      const propImage = matching.find((item) => item.images && item.images.length > 0)?.images[0];

      result.push({
        id: slug,
        name: areaName,
        slug,
        image: propImage || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
        description: `Premier ready residential community in ${areaName}, Dubai. Featuring verified secondary residences with title deeds verified and immediate key handover.`,
        landmark: matching[0]?.projectName || `${areaName} Central`,
        popularTypes: Array.from(new Set(matching.map((item) => item.propertyType).filter(Boolean))),
        propertyCount: liveCount,
        readyCount: liveCount,
        avgPriceSqft: 0,
        featured: true,
      });
    }
  }

  // Sort: areas with live properties first (descending), then alphabetically
  result.sort((a, b) => {
    if (b.readyCount !== a.readyCount) return b.readyCount - a.readyCount;
    return a.name.localeCompare(b.name);
  });

  return result;
}
