import React, { useState } from 'react';
import { Heart, ArrowUpRight, Bed, Bath, Maximize2, ShieldCheck, CheckCircle2, MapPin, Share2, Check } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  isSaved?: boolean;
  onToggleSave?: (propertyId: string, e: React.MouseEvent) => void;
  agentListingCount?: number;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  isSaved = false,
  onToggleSave,
  agentListingCount,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shortUrl = `${window.location.origin}/p/${encodeURIComponent(property.id || property.slug)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div
      id={`property-card-${property.id}`}
      onClick={() => onSelect(property)}
      className="group relative bg-white rounded-2xl overflow-hidden border border-[#EAEAEA] hover:border-[#CF9F5D]/50 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Property Image Container with Anti-Download Protection */}
      <div
        className="relative aspect-[16/10] w-full overflow-hidden bg-[#F7F7F5] secure-image-container select-none"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      >
        <img
          src={property.images?.[0] || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85'}
          alt={property.title || 'Dubai Property'}
          referrerPolicy="no-referrer"
          loading="lazy"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85';
          }}
          className="secure-image w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none pointer-events-none"
        />

        {/* Centered 35% Opacity Pure White Watermark Protection (No Text) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
          <img
            src="https://res.cloudinary.com/dy6km7beb/image/upload/c_crop,w_450,h_450,x_25,y_103/v1789980615/Untitled_design_11_ocowpa.png"
            alt="SQFT DXB Watermark"
            draggable={false}
            className="w-16 sm:w-20 h-auto object-contain opacity-35 select-none pointer-events-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] filter brightness-0 invert"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Transparent Click-Protection Overlay to Prevent Image Saving */}
        <div
          className="absolute inset-0 z-[6] select-none pointer-events-none"
          onContextMenu={(e) => e.preventDefault()}
        />

        {/* Top Badges & Actions */}
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

          {/* Top Right Actions: Minimized Share Option */}
          <div className="pointer-events-auto relative">
            <button
              id={`share-btn-${property.id}`}
              onClick={handleShare}
              className="p-2 rounded-full bg-white/90 backdrop-blur-md text-[#171717] hover:bg-[#171717] hover:text-white transition-all duration-200 shadow-sm cursor-pointer"
              title="Share minimized link"
              aria-label="Share property link"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Share2 className="w-3.5 h-3.5 stroke-[2]" />
              )}
            </button>
            {copied && (
              <span className="absolute -bottom-7 right-0 text-[10px] font-bold bg-[#171717] text-white px-2 py-0.5 rounded shadow whitespace-nowrap z-20 animate-in fade-in duration-150">
                Short link copied!
              </span>
            )}
          </div>
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
          <div className="flex items-center gap-1 text-xs font-semibold text-[#CF9F5D] uppercase tracking-wider mb-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{property.projectName} • {property.area}</span>
          </div>

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
              {property.bedrooms ?? property.bedroom ?? '—'} Beds
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-[#8A8A8A]" />
              {property.bathrooms ?? property.bathroom ?? '—'} Baths
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-[#8A8A8A]" />
              {typeof (property.sqft ?? property.totalArea ?? property.total_area) === 'number'
                ? `${(property.sqft ?? property.totalArea ?? property.total_area)?.toLocaleString()} sq.ft`
                : (property.sqft ?? property.totalArea ?? property.total_area ?? '—')}
            </span>
          </div>

          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#F7F7F5] group-hover:bg-[#171717] group-hover:text-white transition-colors duration-200 text-[#171717]">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>

        {/* Agent Card Row on Listing Card: Picture, Name, Designation & Listings Held */}
        {property.agent && (
          <div className="mt-3.5 pt-3 border-t border-[#F0F0EE] flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={property.agent.photo}
                alt={property.agent.name}
                referrerPolicy="no-referrer"
                draggable={false}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(property.agent?.name || 'SQFT Advisor')}&background=CF9F5D&color=fff&size=100`;
                }}
                className="w-8 h-8 rounded-full object-cover object-top border border-[#CF9F5D] flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#171717] truncate leading-tight">
                  {property.agent.name}
                </p>
                <p className="text-[10px] text-[#6F6F6F] truncate leading-tight">
                  {property.agent.title}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#CF9F5D] bg-[#CF9F5D]/10 px-2.5 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap border border-[#CF9F5D]/20">
              {agentListingCount || property.agent.propertyCount || 1} {(agentListingCount || property.agent.propertyCount || 1) === 1 ? 'Listing' : 'Listings'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
