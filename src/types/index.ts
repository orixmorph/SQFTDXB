export type PropertyPurpose = 'buy' | 'rent';

export type PropertyType = 'Apartment' | 'Villa' | 'Penthouse' | 'Townhouse' | 'Duplex';

export type FurnishedStatus = 'Furnished' | 'Semi-Furnished' | 'Unfurnished';

export interface Agent {
  id: string;
  name: string;
  title: string;
  phone: string;
  whatsapp: string;
  email: string;
  photo: string;
  reraNumber: string;
  verifiedDeals: number;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  projectName: string;
  area: string;
  areaId: string;
  purpose: PropertyPurpose;
  propertyType: PropertyType;
  price: number;
  priceDisplay: string;
  priceUnit?: string; // e.g. '/ year' for rent
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  pricePerSqft?: number;
  images: string[];
  isVerified: boolean;
  isReady: boolean;
  readyStatus: 'Ready to Move' | 'Vacant on Transfer' | 'Tenanted (High ROI)';
  handoverYear: string;
  description: string;
  features: string[];
  amenities: string[];
  floor?: string;
  parkingSpaces: number;
  furnishedStatus: FurnishedStatus;
  viewType: string;
  reraPermit: string;
  referenceNumber: string;
  agent: Agent;
  isFeatured?: boolean;
  createdAt: string;
}

export interface Area {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  propertyCount: number;
  readyCount: number;
  avgPriceSqft: number;
  popularTypes: string[];
  landmark: string;
  featured?: boolean;
}

export interface SearchFilterState {
  purpose: PropertyPurpose;
  area: string;
  propertyType: string;
  bedrooms: string;
  minPrice: number | null;
  maxPrice: number | null;
  searchQuery?: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'size-desc';
}

export interface ViewingRequestData {
  propertyId: string;
  propertyTitle: string;
  fullName: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  viewingType: 'In-person' | 'Virtual Video Tour';
  notes?: string;
}

export interface PropertyListingSubmission {
  purpose: PropertyPurpose;
  propertyType: PropertyType;
  area: string;
  buildingName: string;
  bedrooms: number;
  expectedPrice: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  currentStatus: 'Vacant' | 'Rented' | 'Owner Occupied';
  notes?: string;
}
