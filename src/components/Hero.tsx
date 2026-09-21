import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Home,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Key,
  Building,
  CheckCircle2,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { PropertyPurpose, SearchFilterState } from '../types';
import { areas } from '../data/mockData';

// Replace this Cloudinary URL with your desired 1st section background image link
export const HERO_SECTION_BG_IMAGE =
  'https://res.cloudinary.com/dy6km7beb/image/upload/v1789983767/ChatGPT_Image_Sep_19_2026_11_20_31_AM_bjcrx2.png';

interface HeroProps {
  onSearch: (filter: Partial<SearchFilterState>) => void;
  onSelectArea: (areaId: string) => void;
  onOpenListProperty?: (purpose: PropertyPurpose) => void;
  backgroundImageUrl?: string;
}

export const Hero: React.FC<HeroProps> = ({
  onSearch,
  onSelectArea,
  onOpenListProperty,
  backgroundImageUrl,
}) => {
  const [purpose, setPurpose] = useState<PropertyPurpose>('buy');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [propertyType, setPropertyType] = useState<string>('');
  const [bedrooms, setBedrooms] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let minPrice: number | null = null;
    let maxPrice: number | null = null;

    if (priceRange === 'under-3m') {
      maxPrice = 3000000;
    } else if (priceRange === '3m-7m') {
      minPrice = 3000000;
      maxPrice = 7000000;
    } else if (priceRange === '7m-15m') {
      minPrice = 7000000;
      maxPrice = 15000000;
    } else if (priceRange === 'above-15m') {
      minPrice = 15000000;
    } else if (priceRange === 'rent-under-200k') {
      maxPrice = 200000;
    } else if (priceRange === 'rent-200k-400k') {
      minPrice = 200000;
      maxPrice = 400000;
    } else if (priceRange === 'rent-above-400k') {
      minPrice = 400000;
    }

    onSearch({
      purpose,
      area: selectedArea,
      propertyType,
      bedrooms,
      minPrice,
      maxPrice,
      searchQuery,
    });
  };

  const handleQuickPill = (text: string, areaId: string, type: string) => {
    setSearchQuery(text);
    setSelectedArea(areaId);
    if (type) setPropertyType(type);
    onSearch({
      purpose: 'buy',
      area: areaId,
      propertyType: type,
      searchQuery: text,
    });
  };

  return (
    <section className="relative w-full pt-8 pb-16 md:pt-12 md:pb-20 overflow-hidden bg-[#FAFAF9] border-b border-[#F0F0EE]">
      {/* Hero Background Architectural Image with Reduced White Transparency */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none transition-opacity duration-300">
        <img
          src={backgroundImageUrl || HERO_SECTION_BG_IMAGE}
          alt="Dubai Secondary Luxury Properties"
          className="w-full h-full object-cover object-center contrast-[1.05]"
          referrerPolicy="no-referrer"
        />
        {/* Soft, minimal top/bottom edge gradient to smoothly blend into navigation and next section */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAF9]/25 via-transparent to-[#FAFAF9]/65" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tag */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#EAEAEA] text-xs font-semibold text-[#171717] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#CF9F5D]"></span>
            <span>Secondary & Ready-to-Move Specialist</span>
            <span className="text-[#8A8A8A] font-normal">•</span>
            <span className="text-[#6F6F6F] font-normal">
              Powered by{' '}
              <a
                href="https://jamokaproperties.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#171717] font-semibold hover:text-[#CF9F5D] underline underline-offset-2 decoration-[#CF9F5D]/50 transition-colors"
              >
                Jamoka Properties
              </a>
            </span>
          </div>
        </div>

        {/* Hero Headline & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-7">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#171717] tracking-tight leading-[1.15] mb-3">
            Real Properties. Real Details. <span className="text-[#CF9F5D]">Dubai.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#4A4A4A] font-medium leading-relaxed max-w-2xl mx-auto">
            Discover verified secondary-market residences and ready homes across Dubai’s most desirable communities. Actual photos, confirmed availability, and immediate key handover.
          </p>
        </div>

        {/* Streamlined Hero Search Box Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-[0_12px_32px_rgba(0,0,0,0.07)] border border-[#EAEAEA]">
          {/* Top Tabs Row */}
          <div className="flex items-center justify-between border-b border-[#F0F0EE] pb-2.5 mb-3.5">
            <div className="flex items-center gap-1.5 bg-[#F7F7F5] p-1 sm:p-1.5 rounded-xl border border-[#EAEAEA]">
              <button
                type="button"
                id="hero-tab-buy"
                onClick={() => setPurpose('buy')}
                className={`px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                  purpose === 'buy'
                    ? 'bg-white text-[#171717] shadow-sm'
                    : 'text-[#6F6F6F] hover:text-[#171717]'
                }`}
              >
                Buy
              </button>
              <button
                type="button"
                id="hero-tab-rent"
                onClick={() => setPurpose('rent')}
                className={`px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                  purpose === 'rent'
                    ? 'bg-white text-[#171717] shadow-sm'
                    : 'text-[#6F6F6F] hover:text-[#171717]'
                }`}
              >
                Rent
              </button>
            </div>
          </div>

          {/* Search and Filters Form */}
          <form onSubmit={handleSearchSubmit} className="space-y-3">
            {/* Unified Search Input + Submit Button Row */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-[#8A8A8A]" />
                </div>
                <input
                  type="text"
                  id="hero-search-query-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search building, project, or area (e.g. Marina Gate, Downtown, Palm Villa)..."
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-[#F9F9F8] border border-[#EAEAEA] rounded-xl text-xs sm:text-sm text-[#171717] placeholder-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#CF9F5D]/30 focus:border-[#CF9F5D] transition-all"
                />
              </div>

              <button
                type="submit"
                id="hero-submit-search-btn"
                className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-[#171717] hover:bg-[#2A2A2A] active:bg-[#000000] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow cursor-pointer flex-shrink-0"
              >
                <Search className="w-4 h-4 text-[#CF9F5D]" />
                <span>Search</span>
              </button>
            </div>

            {/* Filters Grid Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
              {/* Location */}
              <div className="relative">
                <select
                  id="hero-area-select"
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-xs sm:text-sm font-semibold text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#CF9F5D] appearance-none cursor-pointer truncate shadow-2xs"
                  title="Location / Area"
                >
                  <option value="">All Dubai Areas</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
                <MapPin className="w-3.5 h-3.5 text-[#8A8A8A] absolute right-3 top-3.5 pointer-events-none" />
              </div>

              {/* Property Type */}
              <div className="relative">
                <select
                  id="hero-type-select"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-xs sm:text-sm font-semibold text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#CF9F5D] appearance-none cursor-pointer shadow-2xs"
                  title="Property Type"
                >
                  <option value="">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Villa">Villa</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Duplex">Duplex</option>
                </select>
                <Home className="w-3.5 h-3.5 text-[#8A8A8A] absolute right-3 top-3.5 pointer-events-none" />
              </div>

              {/* Bedrooms */}
              <div>
                <select
                  id="hero-beds-select"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-xs sm:text-sm font-semibold text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#CF9F5D] cursor-pointer shadow-2xs"
                  title="Bedrooms"
                >
                  <option value="">Any Beds</option>
                  <option value="1">1 Bed</option>
                  <option value="2">2 Beds</option>
                  <option value="3">3 Beds</option>
                  <option value="4">4 Beds</option>
                  <option value="5">5+ Beds</option>
                </select>
              </div>

              {/* Price Budget */}
              <div>
                <select
                  id="hero-price-select"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-xs sm:text-sm font-semibold text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#CF9F5D] cursor-pointer truncate shadow-2xs"
                  title="Price Range"
                >
                  <option value="">Any Budget</option>
                  {purpose === 'buy' ? (
                    <>
                      <option value="under-3m">&lt; AED 3M</option>
                      <option value="3m-7m">AED 3M - 7M</option>
                      <option value="7m-15m">AED 7M - 15M</option>
                      <option value="above-15m">AED 15M+</option>
                    </>
                  ) : (
                    <>
                      <option value="rent-under-200k">&lt; AED 200k/yr</option>
                      <option value="rent-200k-400k">AED 200k-400k</option>
                      <option value="rent-above-400k">&gt; AED 400k/yr</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Quick Popular Pills */}
            <div className="pt-1.5 flex items-center justify-between gap-2 text-xs text-[#6F6F6F] overflow-x-auto pb-0.5">
              <div className="flex items-center gap-2 flex-nowrap">
                <Sparkles className="w-3.5 h-3.5 text-[#CF9F5D] flex-shrink-0" />
                <span className="text-[#8A8A8A] flex-shrink-0 font-medium">Popular:</span>
                <button
                  type="button"
                  onClick={() => handleQuickPill('Marina Gate', 'dubai-marina', 'Apartment')}
                  className="px-2.5 py-1 rounded-lg bg-[#F7F7F5] hover:bg-[#EAEAEA] text-[#171717] whitespace-nowrap cursor-pointer transition-colors font-medium"
                >
                  Marina Gate
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPill('Burj Khalifa view', 'downtown-dubai', 'Apartment')}
                  className="px-2.5 py-1 rounded-lg bg-[#F7F7F5] hover:bg-[#EAEAEA] text-[#171717] whitespace-nowrap cursor-pointer transition-colors font-medium"
                >
                  Downtown Views
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPill('Beachfront Sky Villa', 'palm-jumeirah', 'Penthouse')}
                  className="px-2.5 py-1 rounded-lg bg-[#F7F7F5] hover:bg-[#EAEAEA] text-[#171717] whitespace-nowrap cursor-pointer transition-colors font-medium"
                >
                  Palm Penthouses
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Property Owner Direct Action Buttons (Prominent button look with stroke) */}
        {onOpenListProperty && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-xl mx-auto">
            <button
              id="hero-sell-property-btn"
              onClick={() => onOpenListProperty('buy')}
              className="w-full sm:w-1/2 flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-white border-2 border-[#171717] hover:bg-[#171717] text-[#171717] hover:text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <TrendingUp className="w-4 h-4 text-[#CF9F5D] group-hover:text-white transition-colors" />
              <span>Sell My Property</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              id="hero-rent-property-btn"
              onClick={() => onOpenListProperty('rent')}
              className="w-full sm:w-1/2 flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-white border-2 border-[#171717] hover:bg-[#171717] text-[#171717] hover:text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <Key className="w-4 h-4 text-[#CF9F5D] group-hover:text-white transition-colors" />
              <span>Rent My Property</span>
              <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>
        )}

        {/* Secondary Market Value Pillars Strip (0% Off-Plan Delay is REMOVED as requested) */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-center max-w-4xl mx-auto">
          <div className="p-3 rounded-xl bg-white border border-[#EAEAEA] shadow-sm">
            <div className="text-sm font-bold text-[#171717] flex items-center justify-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#CF9F5D]" />
              <span>Ready to Move</span>
            </div>
            <p className="text-[11px] text-[#6F6F6F] mt-0.5">Immediate key handover</p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#EAEAEA] shadow-sm">
            <div className="text-sm font-bold text-[#171717] flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#CF9F5D]" />
              <span>Verified Title Deeds</span>
            </div>
            <p className="text-[11px] text-[#6F6F6F] mt-0.5">RERA authenticated records</p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#EAEAEA] shadow-sm">
            <div className="text-sm font-bold text-[#171717] flex items-center justify-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#CF9F5D]" />
              <span>Physical Inspection</span>
            </div>
            <p className="text-[11px] text-[#6F6F6F] mt-0.5">Inspect finishes & views today</p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#EAEAEA] shadow-sm">
            <div className="text-sm font-bold text-[#171717] flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#CF9F5D]" />
              <span>Transparent Pricing</span>
            </div>
            <p className="text-[11px] text-[#6F6F6F] mt-0.5">True market transaction values</p>
          </div>
        </div>
      </div>
    </section>
  );
};
