import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  Search,
  Filter,
  ArrowUpDown,
  RotateCcw,
  Building,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Property, SearchFilterState, PropertyPurpose } from '../types';
import { PropertyCard } from './PropertyCard';
import { areas } from '../data/mockData';

interface PropertiesPageProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  savedPropertyIds: string[];
  onToggleSaveProperty: (propertyId: string, e: React.MouseEvent) => void;
  initialFilters?: Partial<SearchFilterState>;
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({
  properties,
  onSelectProperty,
  savedPropertyIds,
  onToggleSaveProperty,
  initialFilters,
}) => {
  const [purpose, setPurpose] = useState<PropertyPurpose>(
    initialFilters?.purpose || 'buy'
  );
  const [selectedArea, setSelectedArea] = useState<string>(
    initialFilters?.area || ''
  );
  const [propertyType, setPropertyType] = useState<string>(
    initialFilters?.propertyType || ''
  );
  const [bedrooms, setBedrooms] = useState<string>(
    initialFilters?.bedrooms || ''
  );
  const [priceBudget, setPriceBudget] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>(
    initialFilters?.searchQuery || ''
  );
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Synchronize when initialFilters change
  React.useEffect(() => {
    if (initialFilters) {
      if (initialFilters.purpose) setPurpose(initialFilters.purpose);
      if (initialFilters.area !== undefined) setSelectedArea(initialFilters.area);
      if (initialFilters.propertyType !== undefined) setPropertyType(initialFilters.propertyType);
      if (initialFilters.bedrooms !== undefined) setBedrooms(initialFilters.bedrooms);
      if (initialFilters.searchQuery !== undefined) setSearchQuery(initialFilters.searchQuery);
    }
  }, [initialFilters]);

  const handleReset = () => {
    setPurpose('buy');
    setSelectedArea('');
    setPropertyType('');
    setBedrooms('');
    setPriceBudget('');
    setSearchQuery('');
    setSortBy('featured');
  };

  const filteredProperties = useMemo(() => {
    return properties
      .filter((item) => {
        // Purpose filter
        if (item.purpose !== purpose) return false;

        // Area filter
        if (selectedArea && item.areaId !== selectedArea) return false;

        // Property type filter
        if (propertyType && item.propertyType !== propertyType) return false;

        // Bedrooms filter
        if (bedrooms) {
          if (bedrooms === '5') {
            if (item.bedrooms < 5) return false;
          } else {
            if (item.bedrooms !== parseInt(bedrooms, 10)) return false;
          }
        }

        // Price Budget filter
        if (priceBudget) {
          if (priceBudget === 'under-3m' && item.price > 3000000) return false;
          if (priceBudget === '3m-7m' && (item.price < 3000000 || item.price > 7000000)) return false;
          if (priceBudget === '7m-15m' && (item.price < 7000000 || item.price > 15000000)) return false;
          if (priceBudget === 'above-15m' && item.price < 15000000) return false;
          if (priceBudget === 'rent-under-200k' && item.price > 200000) return false;
          if (priceBudget === 'rent-200k-400k' && (item.price < 200000 || item.price > 400000)) return false;
          if (priceBudget === 'rent-above-400k' && item.price < 400000) return false;
        }

        // Search Query filter (matches title, area, projectName, description)
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(query);
          const matchArea = item.area.toLowerCase().includes(query);
          const matchProject = item.projectName.toLowerCase().includes(query);
          const matchDesc = item.description.toLowerCase().includes(query);
          if (!matchTitle && !matchArea && !matchProject && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'size-desc') return b.sqft - a.sqft;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0; // default order
      });
  }, [properties, purpose, selectedArea, propertyType, bedrooms, priceBudget, searchQuery, sortBy]);

  const hasActiveFilters =
    selectedArea || propertyType || bedrooms || priceBudget || searchQuery;

  return (
    <div className="w-full min-h-screen bg-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#F0F0EE]">
            <div>
              <span className="text-xs font-semibold text-[#CF9F5D] uppercase tracking-wider block mb-1">
                Verified Secondary Listings
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight">
                Secondary & Ready Properties
              </h1>
              <p className="text-sm text-[#6F6F6F] mt-1.5 max-w-xl">
                Browse verified, ready-to-occupy luxury homes in Dubai. Zero off-plan waiting periods, verified title deeds, and direct key handover.
              </p>
            </div>

            {/* Buy / Rent Switch Tab */}
            <div className="flex items-center gap-1.5 bg-[#F7F7F5] p-1 rounded-xl border border-[#EAEAEA] self-start md:self-auto">
              <button
                id="prop-filter-buy"
                onClick={() => setPurpose('buy')}
                className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  purpose === 'buy'
                    ? 'bg-white text-[#171717] shadow-sm'
                    : 'text-[#6F6F6F] hover:text-[#171717]'
                }`}
              >
                For Sale ({properties.filter((p) => p.purpose === 'buy').length})
              </button>
              <button
                id="prop-filter-rent"
                onClick={() => setPurpose('rent')}
                className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  purpose === 'rent'
                    ? 'bg-white text-[#171717] shadow-sm'
                    : 'text-[#6F6F6F] hover:text-[#171717]'
                }`}
              >
                For Rent ({properties.filter((p) => p.purpose === 'rent').length})
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Filter Bar */}
        <div className="bg-[#F7F7F5] rounded-2xl p-4 sm:p-5 border border-[#EAEAEA] mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="relative">
              <label className="block text-[11px] font-semibold text-[#8A8A8A] uppercase mb-1">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Building, project, or keyword..."
                  className="w-full pl-8 pr-3 py-2 bg-white border border-[#EAEAEA] rounded-xl text-xs sm:text-sm text-[#171717] placeholder-[#8A8A8A] focus:outline-none focus:border-[#CF9F5D]"
                />
                <Search className="w-3.5 h-3.5 text-[#8A8A8A] absolute left-2.5 top-3" />
              </div>
            </div>

            {/* Community Area */}
            <div>
              <label className="block text-[11px] font-semibold text-[#8A8A8A] uppercase mb-1">
                Community
              </label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#EAEAEA] rounded-xl text-xs sm:text-sm font-medium text-[#171717] focus:outline-none focus:border-[#CF9F5D] cursor-pointer"
              >
                <option value="">All Dubai Communities</option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-[11px] font-semibold text-[#8A8A8A] uppercase mb-1">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#EAEAEA] rounded-xl text-xs sm:text-sm font-medium text-[#171717] focus:outline-none focus:border-[#CF9F5D] cursor-pointer"
              >
                <option value="">All Residential Types</option>
                <option value="Apartment">Apartment</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Villa">Villa</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Duplex">Duplex</option>
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-[11px] font-semibold text-[#8A8A8A] uppercase mb-1">
                Bedrooms
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#EAEAEA] rounded-xl text-xs sm:text-sm font-medium text-[#171717] focus:outline-none focus:border-[#CF9F5D] cursor-pointer"
              >
                <option value="">Any Bedrooms</option>
                <option value="1">1 Bed</option>
                <option value="2">2 Beds</option>
                <option value="3">3 Beds</option>
                <option value="4">4 Beds</option>
                <option value="5">5+ Beds</option>
              </select>
            </div>

            {/* Price Budget */}
            <div>
              <label className="block text-[11px] font-semibold text-[#8A8A8A] uppercase mb-1">
                Budget (AED)
              </label>
              <select
                value={priceBudget}
                onChange={(e) => setPriceBudget(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#EAEAEA] rounded-xl text-xs sm:text-sm font-medium text-[#171717] focus:outline-none focus:border-[#CF9F5D] cursor-pointer"
              >
                <option value="">Any Budget</option>
                {purpose === 'buy' ? (
                  <>
                    <option value="under-3m">Under AED 3M</option>
                    <option value="3m-7m">AED 3M - 7M</option>
                    <option value="7m-15m">AED 7M - 15M</option>
                    <option value="above-15m">Above AED 15M</option>
                  </>
                ) : (
                  <>
                    <option value="rent-under-200k">Under AED 200k / yr</option>
                    <option value="rent-200k-400k">AED 200k - 400k / yr</option>
                    <option value="rent-above-400k">Above AED 400k / yr</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Results Summary & Sorting Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#EAEAEA] text-xs">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-[#171717]">
                Showing {filteredProperties.length} verified {purpose === 'buy' ? 'sales' : 'rentals'}
              </span>

              {hasActiveFilters && (
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 text-[#CF9F5D] hover:underline font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All Filters</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#8A8A8A] font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-[#EAEAEA] rounded-lg text-xs font-medium text-[#171717] focus:outline-none focus:border-[#CF9F5D] cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="size-desc">Size: Largest First</option>
                <option value="newest">Newest Listed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Property Grid: 3-4 on Desktop, 2 on Tablet, 1 on Mobile */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelect={onSelectProperty}
                isSaved={savedPropertyIds.includes(property.id)}
                onToggleSave={onToggleSaveProperty}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-[#F7F7F5] rounded-3xl border border-[#EAEAEA] p-8 max-w-xl mx-auto">
            <Building className="w-12 h-12 text-[#CF9F5D] mx-auto mb-3 opacity-80" />
            <h3 className="text-lg font-bold text-[#171717]">
              No Ready Properties Found Matching Criteria
            </h3>
            <p className="text-xs sm:text-sm text-[#6F6F6F] mt-1.5 mb-5 max-w-md mx-auto">
              We update our secondary inventory daily with verified title deeds. Try clearing your filters or selecting a different community.
            </p>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-semibold shadow-sm cursor-pointer"
            >
              Reset Filters & View All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
