import React from 'react';
import { Heart, ArrowUpRight, Bed, Bath, Maximize2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  isSaved?: boolean;
  onToggleSave?: (propertyId: string, e: React.MouseEvent) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  isSaved = false,
  onToggleSave,
}) => {
  return (
    <div
      id={`property-card-${property.id}`}
      onClick={() => onSelect(property)}
      className="group relative bg-white rounded-2xl overflow-hidden border border-[#EAEAEA] hover:border-[#CF9F5D]/50 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Property Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F7F7F5]">
        <img
          src={property.images[0]}
          alt={property.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Purpose Badge */}
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wider shadow-sm backdrop-blur-md ${
                property.purpose === 'buy'
                  ? 'bg-white/95 text-[#171717]'
                  : 'bg-[#171717]/90 text-white'
              }`}
            >
              {property.purpose === 'buy' ? 'For Sale' : 'For Rent'}
            </span>

            {/* Ready Status Badge */}
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-[#171717]/85 backdrop-blur-md text-[#CF9F5D] flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CF9F5D] animate-pulse"></span>
              {property.readyStatus}
            </span>
          </div>

          {/* Favorite Toggle Button - hidden until login is added */}
          {false && onToggleSave && (
            <button
              id={`fav-btn-${property.id}`}
              onClick={(e) => onToggleSave(property.id, e)}
              className="pointer-events-auto p-2 rounded-full bg-white/90 backdrop-blur-md text-[#171717] hover:text-red-500 hover:bg-white transition-colors duration-200 shadow-sm"
              aria-label={isSaved ? 'Remove from saved' : 'Save property'}
            >
              <Heart
                className={`w-4 h-4 transition-all duration-200 ${
                  isSaved ? 'fill-red-500 text-red-500 scale-110' : 'stroke-[2]'
                }`}
              />
            </button>
          )}
        </div>

        {/* Bottom Left Verified Pill */}
        {property.isVerified && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-sm text-[11px] font-semibold text-[#171717] shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#CF9F5D]" />
            <span>Verified Ready</span>
          </div>
        )}
      </div>

      {/* Card Details Content */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Price Header */}
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold tracking-tight text-[#171717]">
                {property.priceDisplay}
              </span>
              {property.priceUnit && (
                <span className="text-xs text-[#6F6F6F] font-medium">
                  {property.priceUnit}
                </span>
              )}
            </div>

            {property.pricePerSqft && (
              <span className="text-[11px] font-medium text-[#8A8A8A]">
                AED {property.pricePerSqft.toLocaleString()}/sq.ft
              </span>
            )}
          </div>

          {/* Project & Community */}
          <p className="text-xs font-semibold text-[#CF9F5D] uppercase tracking-wider mb-1">
            {property.projectName} • {property.area}
          </p>

          {/* Title */}
          <h3 className="text-base font-semibold text-[#171717] leading-snug line-clamp-1 mb-4 group-hover:text-[#CF9F5D] transition-colors duration-200">
            {property.title}
          </h3>
        </div>

        {/* Specs & Quick Action Footer */}
        <div className="pt-3.5 border-t border-[#F0F0EE] flex items-center justify-between text-xs text-[#6F6F6F]">
          <div className="flex items-center gap-3 font-medium">
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-[#8A8A8A]" />
              {property.bedrooms} Beds
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-[#8A8A8A]" />
              {property.bathrooms} Baths
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-[#8A8A8A]" />
              {property.sqft.toLocaleString()} sq.ft
            </span>
          </div>

          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#F7F7F5] group-hover:bg-[#171717] group-hover:text-white transition-colors duration-200 text-[#171717]">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
};
