import React, { useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Building2,
  Bed,
  Maximize2,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { Property } from '../types';
import { properties } from '../data/mockData';

interface NewSecondaryProjectsProps {
  onSelectProperty: (property: Property) => void;
  onViewAllProperties: () => void;
}

export const NewSecondaryProjects: React.FC<NewSecondaryProjectsProps> = ({
  onSelectProperty,
  onViewAllProperties,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filterTabs = [
    { id: 'all', label: 'All Ready' },
    { id: 'dubai-marina', label: 'Dubai Marina' },
    { id: 'palm-jumeirah', label: 'Palm Jumeirah' },
    { id: 'downtown-dubai', label: 'Downtown Dubai' },
    { id: 'dubai-hills-estate', label: 'Dubai Hills' },
    { id: 'business-bay', label: 'Business Bay' },
  ];

  const filteredProperties = properties.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.areaId === activeFilter;
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full py-16 md:py-24 bg-[#FAFAF9] border-b border-[#F0F0EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-xs font-semibold text-[#171717] border border-[#EAEAEA] mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#CF9F5D]" />
              <span>Secondary Market Additions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#171717] tracking-tight">
              Browse New Projects in Dubai
            </h2>
            <p className="text-sm sm:text-base text-[#6F6F6F] mt-2 max-w-2xl">
              Newly listed secondary residences and completed projects ready for immediate occupancy. No construction waiting times, fully verified title deeds.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              id="carousel-prev-btn"
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full bg-white border border-[#EAEAEA] hover:border-[#CF9F5D] hover:bg-[#171717] hover:text-white flex items-center justify-center text-[#171717] transition-all cursor-pointer shadow-sm"
              aria-label="Previous Properties"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              id="carousel-next-btn"
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full bg-white border border-[#EAEAEA] hover:border-[#CF9F5D] hover:bg-[#171717] hover:text-white flex items-center justify-center text-[#171717] transition-all cursor-pointer shadow-sm"
              aria-label="Next Properties"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              id={`filter-tab-${tab.id}`}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-[#171717] text-white shadow-sm'
                  : 'bg-white text-[#6F6F6F] hover:text-[#171717] border border-[#EAEAEA]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Horizontal Carousel Track */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-6 pt-2 scroll-smooth no-scrollbar snap-x snap-mandatory"
        >
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              id={`carousel-item-${property.id}`}
              onClick={() => onSelectProperty(property)}
              className="flex-shrink-0 w-[290px] sm:w-[340px] md:w-[370px] bg-white rounded-2xl border border-[#EAEAEA] overflow-hidden hover:border-[#CF9F5D]/50 hover:shadow-lg transition-all duration-300 group snap-start cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#F7F7F5]">
                  <img
                    src={property.images[0]}
                    alt={property.projectName}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-white/95 text-[#171717] shadow-sm uppercase tracking-wider">
                      {property.purpose === 'buy' ? 'For Sale' : 'For Rent'}
                    </span>
                    <span className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-[#171717]/85 text-[#CF9F5D] backdrop-blur-sm shadow-sm">
                      {property.readyStatus}
                    </span>
                  </div>

                  {property.isVerified && (
                    <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-[#171717] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#CF9F5D]" />
                      <span>Verified Title</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-[#CF9F5D] font-semibold uppercase tracking-wider mb-1">
                    <span>{property.area}</span>
                    <span className="text-[#8A8A8A] font-normal normal-case">
                      {property.handoverYear}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#171717] group-hover:text-[#CF9F5D] transition-colors line-clamp-1 mb-1">
                    {property.projectName}
                  </h3>

                  <p className="text-xs text-[#6F6F6F] mb-4 line-clamp-1">
                    {property.bedrooms} Bed {property.propertyType} • {property.viewType}
                  </p>

                  <div className="grid grid-cols-2 gap-2 py-2 px-3 bg-[#F9F9F8] rounded-xl border border-[#F0F0EE] mb-4 text-xs">
                    <div>
                      <span className="text-[#8A8A8A] block text-[10px] uppercase font-semibold">
                        Property Size
                      </span>
                      <span className="font-bold text-[#171717]">
                        {property.sqft.toLocaleString()} sq.ft
                      </span>
                    </div>
                    <div>
                      <span className="text-[#8A8A8A] block text-[10px] uppercase font-semibold">
                        Asking Price
                      </span>
                      <span className="font-bold text-[#171717]">
                        {property.priceDisplay}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="px-5 pb-5 pt-0">
                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl bg-[#F7F7F5] group-hover:bg-[#171717] group-hover:text-white text-xs font-semibold text-[#171717] transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>View Property Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#CF9F5D]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Properties Bottom Link */}
        <div className="mt-8 flex justify-center">
          <button
            id="view-all-properties-carousel-btn"
            onClick={onViewAllProperties}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-[#EAEAEA] hover:border-[#CF9F5D] text-[#171717] font-semibold text-sm transition-all shadow-sm hover:shadow"
          >
            <span>View All Verified Properties</span>
            <ArrowRight className="w-4 h-4 text-[#CF9F5D]" />
          </button>
        </div>
      </div>
    </section>
  );
};
