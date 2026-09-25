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

  // Helper to parse coordinate from number or string
  const parseCoord = (val: unknown): number | null => {
    if (val === null || val === undefined || val === '') return null;
    const parsed = typeof val === 'number' ? val : parseFloat(String(val).trim());
    return isNaN(parsed) ? null : parsed;
  };

  // Strictly resolve coordinates from database
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
    : null;

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

  // Embedded map URL with dynamic coordinates
  const mapEmbedUrl = hasCoordinates
    ? `https://maps.google.com/maps?q=${lat},${lng}&t=${
        mapType === 'satellite' ? 'k' : 'm'
      }&z=${zoomLevel}&hl=en&output=embed`
    : null;

  return (
    <div className="rounded-2xl border border-stone-200/90 bg-[#FAFAF9] p-4 sm:p-5 space-y-3.5 shadow-2xs">
      {/* Sleek, Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-stone-200/70">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#A67C3D] uppercase tracking-wider mb-0.5">
            <MapPin className="w-3.5 h-3.5 text-[#CF9F5D]" />
            <span>Location & Neighborhood</span>
          </div>
          <p className="text-sm font-semibold text-stone-900">
            {property.projectName ? `${property.projectName}, ` : ''}
            {property.area}, Dubai
          </p>
        </div>

        {/* Compact Right-Side Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {hasCoordinates && formattedCoordinates ? (
            <div className="flex items-center gap-1 bg-white border border-stone-200/80 rounded-lg px-2.5 py-1 shadow-2xs">
              <Compass className="w-3 h-3 text-[#CF9F5D]" />
              <span className="text-[11px] font-mono text-stone-600">
                {formattedCoordinates}
              </span>
              <button
                type="button"
                onClick={handleCopyCoordinates}
                title="Copy coordinates"
                className="ml-1 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer p-0.5"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 text-[11px] text-stone-500">
              <AlertCircle className="w-3 h-3 text-[#CF9F5D]" />
              <span>Location: {property.area}</span>
            </div>
          )}

          <a
            href={googleMapsSearchUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-700 hover:text-[#171717] text-[11px] font-medium transition-colors shadow-2xs"
            title="Open in Google Maps"
          >
            <span>Google Maps</span>
            <ExternalLink className="w-3 h-3 text-stone-400" />
          </a>
        </div>
      </div>

      {/* Classy, Compact Map Canvas (h-64 sm:h-72) */}
      {hasCoordinates && mapEmbedUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-stone-200/80 bg-stone-100 shadow-inner">
          {/* Subtle Map / Satellite Toggle */}
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center bg-white/90 backdrop-blur-xs p-0.5 rounded-lg border border-stone-200/70 shadow-2xs">
            <button
              type="button"
              onClick={() => setMapType('roadmap')}
              className={`px-2 py-0.5 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                mapType === 'roadmap'
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Map
            </button>
            <button
              type="button"
              onClick={() => setMapType('satellite')}
              className={`px-2 py-0.5 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                mapType === 'satellite'
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Satellite
            </button>
          </div>

          {/* Minimal Zoom Controls */}
          <div className="absolute top-2.5 right-2.5 z-10 flex flex-col items-center bg-white/90 backdrop-blur-xs rounded-lg border border-stone-200/70 shadow-2xs overflow-hidden">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(z + 1, 19))}
              title="Zoom In"
              className="w-6 h-6 flex items-center justify-center text-xs font-bold text-stone-700 hover:bg-stone-100 cursor-pointer"
            >
              +
            </button>
            <div className="w-full h-px bg-stone-200/70" />
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(z - 1, 11))}
              title="Zoom Out"
              className="w-6 h-6 flex items-center justify-center text-xs font-bold text-stone-700 hover:bg-stone-100 cursor-pointer"
            >
              −
            </button>
          </div>

          {/* Proportional, Elegant Height (h-64 sm:h-72) */}
          <div className="relative w-full h-64 sm:h-72">
            <iframe
              title={`Map location of ${property.title}`}
              src={mapEmbedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Non-intrusive Floating Chip on Bottom-Left */}
            <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-stone-200/80 shadow-2xs text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CF9F5D] flex-shrink-0" />
              <span className="font-semibold text-stone-900 truncate max-w-[150px] sm:max-w-[220px]">
                {property.projectName || property.title}
              </span>
              <span className="text-stone-300">|</span>
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-[#A67C3D] hover:text-stone-900 transition-colors"
                title="Get driving directions"
              >
                <Navigation className="w-3 h-3 text-[#CF9F5D]" />
                <span>Directions</span>
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8 px-4 rounded-xl border border-stone-200/80 bg-white text-center space-y-2">
          <div className="w-8 h-8 rounded-full bg-[#F7F5F0] text-[#CF9F5D] mx-auto flex items-center justify-center">
            <MapPin className="w-4 h-4 text-[#CF9F5D]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900">
              {property.area}, Dubai
            </h4>
            <p className="text-[11px] text-stone-500 max-w-sm mx-auto mt-0.5">
              Interactive GPS pin coordinates for this residence are being updated.
            </p>
          </div>
          <div className="pt-1">
            <a
              href={googleMapsSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-900 text-white text-[11px] font-medium hover:bg-stone-800 transition-colors"
            >
              <span>Explore {property.area} on Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Discreet Footer Note */}
      <div className="flex items-center justify-between text-[11px] text-stone-400 pt-0.5 px-0.5">
        <span>
          {hasCoordinates
            ? 'Verified Dubai GPS coordinates'
            : `Community: ${property.area}, Dubai`}
        </span>
        <a
          href={googleMapsDirectionsUrl}
          target="_blank"
          rel="noreferrer"
          className="hover:text-stone-700 transition-colors"
        >
          Get Directions ↗
        </a>
      </div>
    </div>
  );
};
