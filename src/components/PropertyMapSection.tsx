import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  ExternalLink,
  Copy,
  Check,
  Compass,
  AlertCircle,
} from 'lucide-react';
import { Property } from '../types';

interface PropertyMapSectionProps {
  property: Property;
}

export const PropertyMapSection: React.FC<PropertyMapSectionProps> = ({ property }) => {
  const [copied, setCopied] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(15);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  // Helper to parse coordinate from number or string (from Baserow or other APIs)
  const parseCoord = (val: unknown): number | null => {
    if (val === null || val === undefined || val === '') return null;
    const parsed = typeof val === 'number' ? val : parseFloat(String(val).trim());
    return isNaN(parsed) ? null : parsed;
  };

  // Strictly resolve coordinates from database; do not invent coordinates if missing
  const lat =
    parseCoord(property.latitude) ??
    parseCoord(property.Latitude) ??
    parseCoord(property.lat) ??
    parseCoord(property.location?.lat);

  const lng =
    parseCoord(property.longitude) ??
    parseCoord(property.Longitude) ??
    parseCoord(property.lng) ??
    parseCoord(property.location?.lng);

  const hasCoordinates = lat !== null && lng !== null;

  const formattedCoordinates = hasCoordinates
    ? `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`
    : 'Pending Database Entry';

  const handleCopyCoordinates = () => {
    if (!hasCoordinates) return;
    navigator.clipboard.writeText(`${lat}, ${lng}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const googleMapsSearchUrl = hasCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${property.projectName || property.buildingName || ''} ${property.area} Dubai`
      )}`;

  const googleMapsDirectionsUrl = hasCoordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        `${property.projectName || property.buildingName || ''} ${property.area} Dubai`
      )}`;

  // Embedded map URL with dynamic coordinates from Baserow
  const mapEmbedUrl = hasCoordinates
    ? `https://maps.google.com/maps?q=${lat},${lng}&t=${
        mapType === 'satellite' ? 'k' : 'm'
      }&z=${zoomLevel}&hl=en&output=embed`
    : null;

  const propertyThumbnail = property.images && property.images.length > 0 ? property.images[0] : null;

  return (
    <div className="rounded-2xl border border-[#EAEAEA] bg-white p-5 sm:p-6 space-y-5 shadow-xs">
      {/* Header with Title, Coordinates, and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0F0EE]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F7F5F0] text-[#CF9F5D] flex items-center justify-center">
              <MapPin className="w-4 h-4 text-[#CF9F5D]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#171717]">
                Location & Map Pin
              </h3>
              <p className="text-xs text-[#6F6F6F]">
                {property.projectName ? `${property.projectName}, ` : ''}
                {property.area}, Dubai, UAE
              </p>
            </div>
          </div>
        </div>

        {/* GPS Coordinates Badge & Copy Button */}
        {hasCoordinates ? (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="px-3 py-1.5 rounded-lg bg-[#F7F7F5] border border-[#EAEAEA] text-xs font-mono font-semibold text-[#171717] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#CF9F5D]" />
              <span>{formattedCoordinates}</span>
            </div>

            <button
              type="button"
              onClick={handleCopyCoordinates}
              title="Copy Latitude & Longitude"
              className="p-1.5 rounded-lg border border-[#EAEAEA] bg-white hover:bg-[#F7F7F5] text-[#171717] transition-all cursor-pointer"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4 text-[#707070]" />
              )}
            </button>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FDF8F0] border border-[#CF9F5D]/30 text-xs font-medium text-[#A67C3D]">
            <AlertCircle className="w-3.5 h-3.5 text-[#CF9F5D]" />
            <span>Coordinates pending in Baserow</span>
          </div>
        )}
      </div>

      {/* Map Display Container */}
      {hasCoordinates && mapEmbedUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-[#E2E2DC] bg-[#F2F2EC] shadow-inner">
          {/* Floating Controls Bar over Map */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-[#E2E2DC] shadow-sm">
            <button
              type="button"
              onClick={() => setMapType('roadmap')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                mapType === 'roadmap'
                  ? 'bg-[#171717] text-white'
                  : 'text-[#6F6F6F] hover:text-[#171717]'
              }`}
            >
              Map View
            </button>
            <button
              type="button"
              onClick={() => setMapType('satellite')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                mapType === 'satellite'
                  ? 'bg-[#171717] text-white'
                  : 'text-[#6F6F6F] hover:text-[#171717]'
              }`}
            >
              Satellite
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="absolute top-3 right-3 z-10 flex flex-col items-center bg-white/95 backdrop-blur-md rounded-xl border border-[#E2E2DC] shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(z + 1, 19))}
              title="Zoom In"
              className="px-2.5 py-1 text-sm font-bold text-[#171717] hover:bg-[#F7F7F5] cursor-pointer"
            >
              +
            </button>
            <div className="w-full h-px bg-[#EAEAEA]" />
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(z - 1, 11))}
              title="Zoom Out"
              className="px-2.5 py-1 text-sm font-bold text-[#171717] hover:bg-[#F7F7F5] cursor-pointer"
            >
              −
            </button>
          </div>

          {/* Embedded Map Frame */}
          <div className="relative w-full h-80 sm:h-96">
            <iframe
              title={`Map location of ${property.title}`}
              src={mapEmbedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Floating Property Pin & Portrait Card on Bottom Left */}
            <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-10 max-w-md bg-white/95 backdrop-blur-md p-3 rounded-xl border border-[#E0E0D8] shadow-md pointer-events-auto">
              <div className="flex items-center gap-3">
                {propertyThumbnail && (
                  <img
                    src={propertyThumbnail}
                    alt={property.title}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-lg object-cover border border-[#EAEAEA] flex-shrink-0"
                  />
                )}

                <div className="min-w-0 flex-1">
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#A67C3D] uppercase tracking-wider mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#CF9F5D] animate-pulse" />
                    <span>Baserow GPS Pin</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#171717] truncate">
                    {property.projectName || property.title}
                  </h4>
                  <p className="text-[11px] text-[#606060] truncate">
                    {property.area} • {property.priceDisplay}
                  </p>
                </div>

                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#171717] text-white text-[11px] font-bold hover:bg-[#2A2A2A] transition-colors cursor-pointer"
                >
                  <Navigation className="w-3 h-3 text-[#CF9F5D]" />
                  <span>Directions</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-xl border border-dashed border-[#E0E0D8] bg-[#FBFBF9] text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#F7F5F0] text-[#CF9F5D] mx-auto flex items-center justify-center">
            <Compass className="w-5 h-5 text-[#CF9F5D]" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h4 className="text-sm font-bold text-[#171717]">
              Community Location: {property.area}, Dubai
            </h4>
            <p className="text-xs text-[#6F6F6F]">
              Precise pin coordinates will render automatically once Latitude and Longitude are populated in the Baserow record by property management.
            </p>
          </div>
          <div className="pt-2">
            <a
              href={googleMapsSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#171717] text-white text-xs font-semibold hover:bg-[#2A2A2A] transition-colors"
            >
              <span>Search {property.area} on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* External Map Direct Links */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-[#6F6F6F]">
        <span className="text-[11px] text-[#8A8A8A]">
          {hasCoordinates
            ? `* GPS coordinates mapped from Baserow: ${formattedCoordinates}`
            : `* District: ${property.area}, Dubai`}
        </span>

        <div className="flex items-center gap-3">
          <a
            href={googleMapsSearchUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-bold text-[#171717] hover:text-[#A67C3D] transition-colors"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
