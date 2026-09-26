import React, { useState, useMemo } from 'react';
import {
  X,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Car,
  Layers,
  Sparkles,
  Compass,
  FileText,
  Building2,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import { Property, ViewingRequestData } from '../types';
import { PropertyMapSection } from './PropertyMapSection';
import { submitScheduleViewingForm } from '../services/googleSheets';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: (propertyId: string, e: React.MouseEvent) => void;
  allProperties?: Property[];
  onSelectProperty?: (property: Property) => void;
}

/**
 * Renders structured markdown, bullet points, and paragraphs cleanly
 */
function FormattedDescription({ content }: { content: string }) {
  if (!content) return null;

  const cleanContent = content.replace(/&amp;/g, '&').replace(/\\_/g, '_');
  const lines = cleanContent.split('\n');
  const sections: { title?: string; items: string[]; type: 'list' | 'paragraph' }[] = [];

  let currentTitle: string | undefined;
  let currentItems: string[] = [];
  let currentType: 'list' | 'paragraph' = 'paragraph';

  const flush = () => {
    if (currentItems.length > 0) {
      sections.push({
        title: currentTitle,
        items: currentItems,
        type: currentType,
      });
      currentItems = [];
      currentTitle = undefined;
      currentType = 'paragraph';
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const isHeader =
      /^(Property Details|Community Amenities|Location Highlights|Property Features|Key Features|Amenities|Overview|Highlights|Key Points)[:*]*$/i.test(line) ||
      (/^\*\*.*\*\*$/.test(line) && line.length < 55) ||
      (line.endsWith(':') && line.length < 40 && !line.startsWith('-') && !line.startsWith('•'));

    if (isHeader) {
      flush();
      currentTitle = line.replace(/[*#:]/g, '').trim();
      currentType = 'list';
      continue;
    }

    const isBullet = /^[-•*]\s+/.test(line);
    if (isBullet) {
      const cleanBullet = line.replace(/^[-•*]\s+/, '').trim();
      if (currentType !== 'list') {
        flush();
        currentType = 'list';
      }
      currentItems.push(cleanBullet);
    } else {
      if (currentType === 'list' && currentItems.length > 0 && !currentTitle) {
        flush();
      }
      currentItems.push(line);
    }
  }
  flush();

  return (
    <div className="space-y-4 text-sm leading-relaxed text-[#383838]">
      {sections.map((sec, idx) => (
        <div key={idx} className="space-y-2.5">
          {sec.title && (
            <h4 className="text-sm font-bold text-[#171717] tracking-tight flex items-center gap-2 pt-2 border-t border-[#F0F0EE] first:border-t-0 first:pt-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CF9F5D]" />
              <span>{sec.title}</span>
            </h4>
          )}
          {sec.type === 'list' ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {sec.items.map((item, iIdx) => (
                <li key={iIdx} className="flex items-start gap-2 bg-[#F9F9F8] p-2.5 rounded-xl border border-[#EFEFEA]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#CF9F5D] flex-shrink-0 mt-0.5" />
                  <span className="text-[#2C2C2C] font-medium leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-2">
              {sec.items.map((p, pIdx) => (
                <p key={pIdx} className="text-sm text-[#4A4A4A] leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  isSaved = false,
  onToggleSave,
  allProperties = [],
  onSelectProperty,
}) => {
  if (!property) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showViewingForm, setShowViewingForm] = useState(false);
  const [viewingFormSubmitted, setViewingFormSubmitted] = useState(false);
  const [showSharePopover, setShowSharePopover] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Minimized share link: e.g. https://.../p/SQFT-1 or ?property=...
  const shortShareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/p/${encodeURIComponent(property.id || property.slug)}`
    : '';

  const handleCopyShortUrl = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (navigator.clipboard && shortShareUrl) {
      navigator.clipboard.writeText(shortShareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  const handleWhatsAppShare = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const text = `Take a look at this verified luxury listing on SQFT DXB: ${property.title} in ${property.area} - ${shortShareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Find all properties represented by this specific agent in the database
  const agentProperties = useMemo(() => {
    if (!property?.agent?.name || !allProperties || allProperties.length === 0) return [];
    const targetAgentName = property.agent.name.trim().toLowerCase();
    return allProperties.filter((p) => {
      const pName = (p.agent?.name || '').trim().toLowerCase();
      return pName === targetAgentName;
    });
  }, [property, allProperties]);

  const agentListingCount = agentProperties.length > 0
    ? agentProperties.length
    : (property.agent?.propertyCount || 1);

  const [viewingData, setViewingData] = useState<ViewingRequestData>({
    propertyId: property.id,
    propertyTitle: property.title,
    fullName: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    viewingType: 'In-person',
    notes: '',
  });

  const propertyImages =
    property.images && property.images.length > 0
      ? property.images
      : ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85'];

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
  };

  // Baserow Database Compatibility Resolvers (accepts standard or custom column keys)
  const displayBedrooms = (() => {
    const val =
      property.bedrooms ??
      property.bedroom ??
      property.Bedrooms ??
      property.Bedroom ??
      property.beds ??
      property.Beds;
    if (val === null || val === undefined || val === '') return '—';
    if (typeof val === 'number') return `${val} Beds`;
    const str = String(val).trim();
    return /bed|studio/i.test(str) ? str : `${str} Beds`;
  })();

  const displayBathrooms = (() => {
    const val =
      property.bathrooms ??
      property.bathroom ??
      property.Bathrooms ??
      property.Bathroom ??
      property.baths ??
      property.Baths;
    if (val === null || val === undefined || val === '') return '—';
    if (typeof val === 'number') return `${val} Baths`;
    const str = String(val).trim();
    return /bath/i.test(str) ? str : `${str} Baths`;
  })();

  const displayTotalArea = (() => {
    const val =
      property.sqft ??
      property.totalArea ??
      property.total_area ??
      property.TotalArea ??
      property.areaSqFt ??
      property.area_sqft ??
      property.area;
    if (val === null || val === undefined || val === '') return '—';
    if (typeof val === 'number') return `${val.toLocaleString()} sq.ft`;
    const cleaned = String(val).replace(/,/g, '').trim();
    const num = parseFloat(cleaned);
    if (!isNaN(num)) return `${num.toLocaleString()} sq.ft`;
    return String(val);
  })();

  const displayFurniture = (() => {
    const val =
      property.furnishedStatus ||
      property.furniture ||
      property.Furniture ||
      property.furnishing ||
      property.Furnishing ||
      property.furnished;
    if (val === true) return 'Furnished';
    if (val === false) return 'Unfurnished';
    if (typeof val === 'string' && val.trim()) return val.trim();
    return 'Unfurnished';
  })();

  const displayParking = (() => {
    const val =
      property.parkingSpaces ??
      property.parking ??
      property.Parking ??
      property.parking_spaces;
    if (val === null || val === undefined || val === '') return '1 Space';
    if (typeof val === 'number') return `${val} Spaces`;
    const str = String(val).trim();
    return /space|bay/i.test(str) ? str : `${str} Spaces`;
  })();

  const displayExposure = (() => {
    const val =
      property.viewType ||
      property.view ||
      property.View ||
      property.exposure ||
      property.Exposure;
    return val ? String(val) : 'Prime Dubai View';
  })();

  const displayDeveloper =
    property.developer ||
    property.Developer ||
    property.developerName ||
    '';

  const displayBuilding =
    property.buildingName ||
    property.building ||
    property.Building ||
    property.projectName ||
    '';

  const displayFloor =
    property.floor ||
    property.Floor ||
    property.floorNumber ||
    '';

  const displayEmirate =
    property.emirate ||
    property.Emirate ||
    property.city ||
    'Dubai';

  const displayReference =
    property.referenceNumber ||
    property.property_id ||
    property.id ||
    '';

  const validAmenities = (property.amenities || []).filter(
    (a): a is string => Boolean(a && typeof a === 'string' && a.trim().length > 0)
  );

  const WHATSAPP_NUMBER = '971588648093';
  const CALL_NUMBER = '+971588648093';

  // User-specified WhatsApp pre-filled message:
  // "Hi, I'm interested in Property [PROPERTY_REFERENCE] in [AREA]."
  const propertyRef = property.referenceNumber || property.property_id || property.id;
  const propertyArea = property.area || 'Dubai';
  const whatsAppMessage = `Hi, I'm interested in Property ${propertyRef} in ${propertyArea}.`;

  const rawAgentWhatsApp = property.agent?.whatsapp || property.agent?.phone || WHATSAPP_NUMBER;
  const targetWhatsApp = rawAgentWhatsApp.replace(/[^0-9]/g, '') || WHATSAPP_NUMBER;

  const viewingWhatsAppUrl = `https://wa.me/${targetWhatsApp}?text=${encodeURIComponent(whatsAppMessage)}`;
  const inquiryWhatsAppUrl = `https://wa.me/${targetWhatsApp}?text=${encodeURIComponent(whatsAppMessage)}`;

  const [submittingViewing, setSubmittingViewing] = useState(false);

  const handleViewingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingViewing(true);
    try {
      await submitScheduleViewingForm({
        propertyId: String(propertyRef || property.id),
        propertyTitle: property.title,
        propertyPrice: property.price,
        propertyArea: property.area,
        fullName: viewingData.fullName,
        phone: viewingData.phone,
        email: viewingData.email,
        date: viewingData.date,
        timeSlot: viewingData.preferredTime || viewingData.viewingType,
        message: `${viewingData.viewingType || 'In-person'} viewing tour requested for ${property.title}.`,
      });
    } catch (err) {
      console.error('Error submitting viewing request to Google Sheets:', err);
    } finally {
      setSubmittingViewing(false);
      setViewingFormSubmitted(true);
      window.open(viewingWhatsAppUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="property-detail-modal"
        className="relative w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1540px] bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col"
      >
        {/* Sticky Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAEAEA] bg-white sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#171717] text-white">
              {property.purpose === 'buy' ? 'For Sale' : 'For Rent'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F7F7F5] text-[#CF9F5D] border border-[#EAEAEA]">
              {property.readyStatus}
            </span>
            <span className="hidden sm:inline-block text-xs text-[#8A8A8A]">
              Ref: {property.referenceNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Heart save button - hidden until login is added */}
            {false && onToggleSave && (
              <button
                id="modal-save-btn"
                onClick={(e) => onToggleSave(property.id, e)}
                className="p-2 rounded-full hover:bg-[#F7F7F5] text-[#171717] transition-colors"
                title="Save Property"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isSaved ? 'fill-red-500 text-red-500' : 'stroke-[1.75]'
                  }`}
                />
              </button>
            )}

            {/* Minimized Share Option */}
            <div className="relative">
              <button
                id="modal-share-btn"
                onClick={() => setShowSharePopover(!showSharePopover)}
                className="p-2 rounded-full hover:bg-[#F7F7F5] text-[#171717] transition-colors relative cursor-pointer"
                title="Share Minimized Link"
                aria-label="Share property link"
              >
                <Share2 className="w-5 h-5 stroke-[1.75]" />
                {copiedLink && !showSharePopover && (
                  <span className="absolute -bottom-8 right-0 text-[11px] font-semibold bg-[#171717] text-white px-2.5 py-0.5 rounded-full shadow whitespace-nowrap z-30">
                    Short Link Copied!
                  </span>
                )}
              </button>

              {/* Share Popover */}
              {showSharePopover && (
                <div className="absolute right-0 top-12 z-50 w-72 sm:w-80 p-4 bg-white rounded-2xl border border-[#EAEAEA] shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F0F0EE]">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#171717]">
                      <Share2 className="w-3.5 h-3.5 text-[#CF9F5D]" />
                      <span>Share Minimized Listing</span>
                    </div>
                    <button
                      onClick={() => setShowSharePopover(false)}
                      className="text-[#8A8A8A] hover:text-[#171717] p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#8A8A8A] uppercase tracking-wider mb-1">
                      Short Link
                    </label>
                    <div className="flex items-center gap-1.5 p-1.5 bg-[#F7F7F5] border border-[#EAEAEA] rounded-xl">
                      <input
                        type="text"
                        readOnly
                        value={shortShareUrl}
                        className="bg-transparent text-xs text-[#171717] flex-1 px-1 outline-none select-all font-mono"
                      />
                      <button
                        onClick={handleCopyShortUrl}
                        className="px-2.5 py-1 rounded-lg bg-[#171717] hover:bg-[#CF9F5D] text-white text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0"
                      >
                        {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={handleWhatsAppShare}
                      className="py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      onClick={handleCopyShortUrl}
                      className="py-2 px-3 rounded-xl bg-[#F7F7F5] hover:bg-[#EAEAEA] text-[#171717] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 text-[#CF9F5D]" />
                      <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              id="modal-close-btn"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#F7F7F5] text-[#171717] transition-colors ml-1 cursor-pointer"
              aria-label="Close details"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div id="property-detail-modal-body" className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8 flex-1">
          {/* Top Section: Split Hero on Desktop, Stacked on Mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start pb-8 border-b border-[#F0F0EE]">
            {/* Left: Gallery Showcase (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-3">
              <div
                className="relative aspect-[16/10] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#F7F7F5] secure-image-container select-none shadow-xs"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              >
                <img
                  src={propertyImages[activeImageIndex] || propertyImages[0]}
                  alt={property.title || 'Property View'}
                  referrerPolicy="no-referrer"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85';
                  }}
                  className="secure-image w-full h-full object-cover transition-all duration-300 select-none pointer-events-none"
                />

                {/* Centered 35% Opacity Pure White Watermark Protection (No Text) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
                  <img
                    src="https://res.cloudinary.com/dy6km7beb/image/upload/c_crop,w_450,h_450,x_25,y_103/v1789980615/Untitled_design_11_ocowpa.png"
                    alt="SQFT DXB Watermark"
                    draggable={false}
                    className="w-24 sm:w-32 md:w-36 h-auto object-contain opacity-35 select-none pointer-events-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)] filter brightness-0 invert"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Transparent Click-Protection Overlay to Prevent Image Saving */}
                <div
                  className="absolute inset-0 z-[6] select-none pointer-events-none"
                  onContextMenu={(e) => e.preventDefault()}
                />

                {/* Gallery Controls */}
                {propertyImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/85 backdrop-blur-md text-[#171717] hover:bg-white shadow-md transition-all cursor-pointer z-20"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/85 backdrop-blur-md text-[#171717] hover:bg-white shadow-md transition-all cursor-pointer z-20"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium z-20">
                      {activeImageIndex + 1} / {propertyImages.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {propertyImages.length > 1 && (
                <div
                  className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar select-none"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  {propertyImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative flex-shrink-0 w-16 sm:w-20 aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all cursor-pointer select-none ${
                        activeImageIndex === idx
                          ? 'border-[#CF9F5D] scale-102 shadow-sm'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt="thumbnail"
                        referrerPolicy="no-referrer"
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85';
                        }}
                        className="secure-image w-full h-full object-cover select-none pointer-events-none"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Key Info & Short Description (lg:col-span-5) */}
            <div className="lg:col-span-5 flex flex-col justify-start space-y-4">
              {/* Location & Map Jump */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#171717] tracking-wide">
                  <MapPin className="w-3.5 h-3.5 text-[#CF9F5D] flex-shrink-0" />
                  <span>{property.projectName ? `${property.projectName}, ` : ''}{property.area}, Dubai</span>
                </span>

                <button
                  type="button"
                  id="jump-to-map-pin-btn"
                  onClick={() => {
                    const el = document.getElementById('property-map-section');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      el.classList.add('ring-2', 'ring-[#CF9F5D]/60', 'ring-offset-2');
                      setTimeout(() => el.classList.remove('ring-2', 'ring-[#CF9F5D]/60', 'ring-offset-2'), 2500);
                    }
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 hover:bg-[#CF9F5D]/10 text-stone-600 hover:text-[#171717] border border-stone-200 hover:border-[#CF9F5D]/40 text-xs font-medium transition-all cursor-pointer shadow-2xs group"
                  title="Scroll to view property map & neighborhood"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#CF9F5D] group-hover:scale-110 transition-transform" />
                  <span>Map Pin ↓</span>
                </button>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#171717] tracking-tight leading-snug">
                {property.title}
              </h1>

              {/* Price & Reference Row */}
              <div className="flex items-baseline justify-between gap-2 pb-2 border-b border-[#F0F0EE]">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
                    {property.priceDisplay}
                  </span>
                  {property.priceUnit && (
                    <span className="text-xs font-medium text-[#6F6F6F]">
                      {property.priceUnit}
                    </span>
                  )}
                  {property.pricePerSqft && (
                    <span className="text-xs text-[#8A8A8A] font-medium ml-1.5">
                      • AED {property.pricePerSqft.toLocaleString()}/sq.ft
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#8A8A8A] font-mono">
                  {property.referenceNumber ? `Ref: ${property.referenceNumber}` : ''}
                </span>
              </div>

              {/* Description (Underneath Title as requested) */}
              {(property.shortDescription || property.description) && (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#FBF9F5] border border-[#CF9F5D]/30 space-y-2 shadow-2xs flex-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#CF9F5D]">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Description</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#2C2C2C] leading-relaxed whitespace-pre-line">
                    {property.shortDescription || property.description.split('\n\n')[0]}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Grid: 70% Left (Specs, Amenities, Overview, Building Specs, Map) vs 30% Right (Agent Card) */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 lg:gap-8 pt-2">
            {/* Left 70% (lg:col-span-7): Specs, Amenities, Overview, Building Specs, Map */}
            <div className="lg:col-span-7 space-y-5">
              {/* Key Specifications (Icon on Top, Full Visibility without Truncation) */}
              <div className="rounded-2xl bg-[#F7F7F5] border border-[#EAEAEA] p-3 sm:p-4 shadow-2xs">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-3">
                  {/* Bedrooms */}
                  <div className="bg-white rounded-xl p-3 border border-[#EAEAEA] flex flex-col items-center text-center justify-between shadow-2xs hover:border-[#CF9F5D]/40 transition-colors min-h-[84px]">
                    <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#CF9F5D]/25 flex items-center justify-center mb-1.5 flex-shrink-0">
                      <Bed className="w-4 h-4 text-[#CF9F5D]" />
                    </div>
                    <span className="text-[10px] text-[#8A8A8A] uppercase font-bold tracking-wider mb-1">
                      Bedrooms
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#171717] leading-snug break-words">
                      {displayBedrooms}
                    </span>
                  </div>

                  {/* Bathrooms */}
                  <div className="bg-white rounded-xl p-3 border border-[#EAEAEA] flex flex-col items-center text-center justify-between shadow-2xs hover:border-[#CF9F5D]/40 transition-colors min-h-[84px]">
                    <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#CF9F5D]/25 flex items-center justify-center mb-1.5 flex-shrink-0">
                      <Bath className="w-4 h-4 text-[#CF9F5D]" />
                    </div>
                    <span className="text-[10px] text-[#8A8A8A] uppercase font-bold tracking-wider mb-1">
                      Bathrooms
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#171717] leading-snug break-words">
                      {displayBathrooms}
                    </span>
                  </div>

                  {/* Area Sq.Ft */}
                  <div className="bg-white rounded-xl p-3 border border-[#EAEAEA] flex flex-col items-center text-center justify-between shadow-2xs hover:border-[#CF9F5D]/40 transition-colors min-h-[84px]">
                    <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#CF9F5D]/25 flex items-center justify-center mb-1.5 flex-shrink-0">
                      <Maximize2 className="w-4 h-4 text-[#CF9F5D]" />
                    </div>
                    <span className="text-[10px] text-[#8A8A8A] uppercase font-bold tracking-wider mb-1">
                      Area
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#171717] leading-snug break-words">
                      {displayTotalArea}
                    </span>
                  </div>

                  {/* Parking */}
                  <div className="bg-white rounded-xl p-3 border border-[#EAEAEA] flex flex-col items-center text-center justify-between shadow-2xs hover:border-[#CF9F5D]/40 transition-colors min-h-[84px]">
                    <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#CF9F5D]/25 flex items-center justify-center mb-1.5 flex-shrink-0">
                      <Car className="w-4 h-4 text-[#CF9F5D]" />
                    </div>
                    <span className="text-[10px] text-[#8A8A8A] uppercase font-bold tracking-wider mb-1">
                      Parking
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#171717] leading-snug break-words">
                      {displayParking}
                    </span>
                  </div>

                  {/* Furnishing */}
                  <div className="bg-white rounded-xl p-3 border border-[#EAEAEA] flex flex-col items-center text-center justify-between shadow-2xs hover:border-[#CF9F5D]/40 transition-colors min-h-[84px]">
                    <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#CF9F5D]/25 flex items-center justify-center mb-1.5 flex-shrink-0">
                      <Layers className="w-4 h-4 text-[#CF9F5D]" />
                    </div>
                    <span className="text-[10px] text-[#8A8A8A] uppercase font-bold tracking-wider mb-1">
                      Furnishing
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#171717] leading-snug break-words">
                      {displayFurniture}
                    </span>
                  </div>

                  {/* View */}
                  <div className="bg-white rounded-xl p-3 border border-[#EAEAEA] flex flex-col items-center text-center justify-between shadow-2xs hover:border-[#CF9F5D]/40 transition-colors min-h-[84px]">
                    <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#CF9F5D]/25 flex items-center justify-center mb-1.5 flex-shrink-0">
                      <Compass className="w-4 h-4 text-[#CF9F5D]" />
                    </div>
                    <span className="text-[10px] text-[#8A8A8A] uppercase font-bold tracking-wider mb-1">
                      View
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#171717] leading-snug break-words" title={displayExposure}>
                      {displayExposure}
                    </span>
                  </div>
                </div>
              </div>

              {/* Property & Community Amenities (Left Side, 70% Width) */}
              {validAmenities.length > 0 && (
                <div id="all-amenities-section" className="p-4 rounded-2xl bg-white border border-[#EAEAEA] shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A8A8A] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#CF9F5D]" />
                      <span>Property & Community Amenities</span>
                    </h4>
                    <span className="text-[11px] font-semibold text-[#8A8A8A]">
                      {validAmenities.length} Verified Features
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {validAmenities.map((amenity, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F7F7F5] hover:bg-[#F2EFE9] border border-[#EAEAEA] text-xs font-medium text-[#171717] transition-colors"
                      >
                        <CheckCircle2 className="w-3 h-3 text-[#CF9F5D] flex-shrink-0" />
                        <span>{amenity}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Secondary Market Guarantee Box */}
              <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#CF9F5D]/30 flex items-start gap-3.5">
                <ShieldCheck className="w-5 h-5 text-[#CF9F5D] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#171717]">
                    SQFT DXB Secondary Verification Guarantee
                  </h4>
                  <p className="text-xs text-[#6F6F6F] mt-0.5 leading-relaxed">
                    This unit has been physically inspected by our licensed Dubai brokers. Title deed, current tenancy status (or vacancy on transfer), and maintenance service charges have been verified with Dubai Land Department (DLD).
                  </p>
                </div>
              </div>

              {/* Full Description & Overview */}
              <div id="full-overview-section" className="space-y-3 pt-1">
                <div className="flex items-center justify-between pb-1 border-b border-[#F0F0EE]">
                  <h3 className="text-base sm:text-lg font-bold text-[#171717]">
                    Detailed Property Overview
                  </h3>
                  <span className="text-xs text-[#8A8A8A] font-medium">
                    Verified Secondary Market
                  </span>
                </div>
                <FormattedDescription
                  content={
                    property.fullDescription ||
                    property.description ||
                    property.shortDescription ||
                    ''
                  }
                />
              </div>

              {/* Key Features */}
              {property.features && property.features.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-[#171717]">
                    Key Secondary Highlights
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {property.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F7F7F5] text-xs font-medium text-[#171717]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#CF9F5D] flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Property & Building Specifications (Section 7) */}
              <div className="p-5 rounded-2xl bg-[#FAFAF9] border border-[#EAEAEA] space-y-3.5">
                <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-2.5">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#CF9F5D]" />
                    <h3 className="text-sm font-bold text-[#171717] uppercase tracking-wider">
                      Building & Property Specifications
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-[#8A8A8A] bg-white px-2 py-0.5 rounded border border-[#EAEAEA]">
                    Verified
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {displayBuilding && (
                    <div className="bg-white p-2.5 rounded-xl border border-[#EAEAEA]">
                      <span className="text-[10px] uppercase font-semibold text-[#8A8A8A] block">
                        Building / Project
                      </span>
                      <span className="font-bold text-[#171717] truncate block">
                        {displayBuilding}
                      </span>
                    </div>
                  )}

                  {displayDeveloper && (
                    <div className="bg-white p-2.5 rounded-xl border border-[#EAEAEA]">
                      <span className="text-[10px] uppercase font-semibold text-[#8A8A8A] block">
                        Developer
                      </span>
                      <span className="font-bold text-[#171717] truncate block">
                        {displayDeveloper}
                      </span>
                    </div>
                  )}

                  {displayFloor && (
                    <div className="bg-white p-2.5 rounded-xl border border-[#EAEAEA]">
                      <span className="text-[10px] uppercase font-semibold text-[#8A8A8A] block">
                        Floor Level
                      </span>
                      <span className="font-bold text-[#171717] truncate block">
                        {displayFloor}
                      </span>
                    </div>
                  )}

                  <div className="bg-white p-2.5 rounded-xl border border-[#EAEAEA]">
                    <span className="text-[10px] uppercase font-semibold text-[#8A8A8A] block">
                      Furnishing
                    </span>
                    <span className="font-bold text-[#171717] truncate block">
                      {displayFurniture}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-[#EAEAEA]">
                    <span className="text-[10px] uppercase font-semibold text-[#8A8A8A] block">
                      Parking
                    </span>
                    <span className="font-bold text-[#171717] truncate block">
                      {displayParking}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-[#EAEAEA]">
                    <span className="text-[10px] uppercase font-semibold text-[#8A8A8A] block">
                      View Orientation
                    </span>
                    <span className="font-bold text-[#171717] truncate block">
                      {displayExposure}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-[#EAEAEA]">
                    <span className="text-[10px] uppercase font-semibold text-[#8A8A8A] block">
                      Emirate & Area
                    </span>
                    <span className="font-bold text-[#171717] truncate block">
                      {property.area}, {displayEmirate}
                    </span>
                  </div>

                  {displayReference && (
                    <div className="bg-white p-2.5 rounded-xl border border-[#EAEAEA]">
                      <span className="text-[10px] uppercase font-semibold text-[#8A8A8A] block">
                        Listing Reference
                      </span>
                      <span className="font-bold text-[#171717] font-mono truncate block">
                        {displayReference}
                      </span>
                    </div>
                  )}

                  {property.reraPermit && (
                    <div className="bg-white p-2.5 rounded-xl border border-[#EAEAEA]">
                      <span className="text-[10px] uppercase font-semibold text-[#8A8A8A] block">
                        RERA Permit
                      </span>
                      <span className="font-bold text-[#171717] font-mono truncate block">
                        {property.reraPermit}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* Map & Neighborhood Pin Section */}
              <div id="property-map-section" className="pt-2">
                <PropertyMapSection property={property} />
              </div>
            </div>

            {/* Right 30% (lg:col-span-3): Assigned Agent & Viewing Request Card (Sticky on scroll) */}
            <div id="viewing-booking-section" className="lg:col-span-3 space-y-6 lg:sticky lg:top-6 self-start">
              {/* Assigned Agent Box */}
              <div className="p-5 rounded-2xl bg-[#F7F7F5] border border-[#EAEAEA] space-y-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={property.agent.photo}
                    alt={property.agent.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-full object-cover object-top border-2 border-[#CF9F5D] shadow-sm flex-shrink-0"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(property.agent?.name || 'SQFT Advisor')}&background=CF9F5D&color=fff&size=150`;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold text-[#171717] truncate">
                      {property.agent.name}
                    </h4>
                    <p className="text-xs text-[#6F6F6F] font-medium truncate">
                      {property.agent.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#CF9F5D] bg-[#CF9F5D]/10 px-2 py-0.5 rounded-md border border-[#CF9F5D]/20">
                        <Building2 className="w-3 h-3 text-[#CF9F5D]" />
                        <span>{agentListingCount} {agentListingCount === 1 ? 'Listing' : 'Listings'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#EAEAEA] grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${CALL_NUMBER}`}
                    className="py-2.5 px-3 rounded-xl bg-white border border-[#EAEAEA] hover:border-[#171717] text-xs font-semibold text-[#171717] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#CF9F5D]" />
                    <span>Call Agent</span>
                  </a>

                  <a
                    href={inquiryWhatsAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-[#171717] hover:bg-[#2A2A2A] text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Main CTA: Request Private Viewing redirected to WhatsApp with pre-written property details */}
                <a
                  id="request-viewing-modal-btn"
                  href={viewingWhatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm tracking-wide shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Request a Private Viewing</span>
                </a>

                <div className="flex items-center justify-center pt-0.5">
                  <button
                    type="button"
                    onClick={() => setShowViewingForm(!showViewingForm)}
                    className="text-[11px] text-[#8A8A8A] hover:text-[#171717] underline underline-offset-2 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Calendar className="w-3 h-3 text-[#CF9F5D]" />
                    <span>{showViewingForm ? 'Hide schedule form' : 'Or choose specific inspection date & time slot'}</span>
                  </button>
                </div>
              </div>


              {/* Properties Represented by this Advisor (2, 3, or whatever properties they have) */}
              {agentProperties.length > 0 && (
                <div className="p-5 rounded-2xl bg-[#F7F7F5] border border-[#EAEAEA] space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-[#EAEAEA]">
                    <div>
                      <h4 className="text-sm font-bold text-[#171717]">
                        {property.agent?.name}&apos;s Portfolio
                      </h4>
                      <p className="text-[11px] text-[#6F6F6F]">
                        {agentProperties.length} verified {agentProperties.length === 1 ? 'property' : 'properties'} assigned in database
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#CF9F5D]/15 text-[#CF9F5D]">
                      {agentProperties.length} {agentProperties.length === 1 ? 'Listing' : 'Listings'}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {agentProperties.map((p) => {
                      const isCurrent = p.id === property.id || p.slug === property.slug;
                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            if (!isCurrent && onSelectProperty) {
                              onSelectProperty(p);
                              const modalBody = document.getElementById('property-detail-modal-body');
                              if (modalBody) modalBody.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }}
                          className={`p-2.5 rounded-xl border transition-all flex items-center gap-3 ${
                            isCurrent
                              ? 'bg-white border-[#CF9F5D] ring-1 ring-[#CF9F5D]/30 shadow-xs cursor-default'
                              : 'bg-white border-[#EAEAEA] hover:border-[#CF9F5D]/70 hover:shadow-sm cursor-pointer group/prop'
                          }`}
                        >
                          <div
                            className="relative w-16 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100 secure-image-container select-none"
                            onContextMenu={(e) => e.preventDefault()}
                          >
                            <img
                              src={p.images?.[0] || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=300&q=80'}
                              alt={p.title}
                              referrerPolicy="no-referrer"
                              draggable={false}
                              onContextMenu={(e) => e.preventDefault()}
                              className="secure-image w-full h-full object-cover transition-transform duration-300 group-hover/prop:scale-105 select-none pointer-events-none"
                            />
                            {/* Centered White Logo Watermark */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
                              <img
                                src="https://res.cloudinary.com/dy6km7beb/image/upload/c_crop,w_450,h_450,x_25,y_103/v1789980615/Untitled_design_11_ocowpa.png"
                                alt="SQFT"
                                draggable={false}
                                className="w-6 h-auto object-contain opacity-35 select-none pointer-events-none drop-shadow filter brightness-0 invert"
                              />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold text-[#171717] truncate">
                                {p.priceDisplay}
                              </span>
                              {isCurrent ? (
                                <span className="text-[9px] font-bold text-[#CF9F5D] bg-[#CF9F5D]/10 px-1.5 py-0.5 rounded">
                                  Current
                                </span>
                              ) : (
                                <span className="text-[10px] font-medium text-[#CF9F5D] group-hover/prop:translate-x-0.5 transition-transform">
                                  View →
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] font-medium text-[#171717] truncate leading-tight mt-0.5">
                              {p.title}
                            </p>
                            <div className="flex items-center gap-1.5 text-[10px] text-[#8A8A8A] mt-1 truncate">
                              <span className="truncate">{p.projectName || p.area}</span>
                              <span>•</span>
                              <span className="flex-shrink-0">{p.bedrooms ?? p.bedroom ?? '—'} Beds</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Viewing Form Modal / Sheet (if toggled) */}
          {showViewingForm && (
            <div className="p-6 rounded-2xl bg-[#F7F7F5] border border-[#CF9F5D]/50 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#171717]">
                    Schedule a Private Viewing
                  </h3>
                  <p className="text-xs text-[#6F6F6F]">
                    Choose your preferred inspection slot for {property.title}
                  </p>
                </div>
                <button
                  onClick={() => setShowViewingForm(false)}
                  className="p-1.5 rounded-full hover:bg-white text-[#8A8A8A]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {viewingFormSubmitted ? (
                <div className="p-6 rounded-xl bg-white border border-green-200 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
                  <h4 className="text-base font-bold text-[#171717]">
                    Viewing Request Forwarded!
                  </h4>
                  <p className="text-xs text-[#6F6F6F] max-w-md mx-auto">
                    Thank you {viewingData.fullName}. Your viewing request for {property.title} has been logged and forwarded to WhatsApp.
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F4EA] text-[11px] font-semibold text-[#0F9D58] border border-[#CEEAD6]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Viewing Request Securely Received & Logged</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <a
                      href={viewingWhatsAppUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat on WhatsApp</span>
                    </a>
                    <button
                      onClick={() => {
                        setShowViewingForm(false);
                        setViewingFormSubmitted(false);
                      }}
                      className="px-4 py-2 rounded-lg bg-[#F7F7F5] border border-[#EAEAEA] text-[#171717] text-xs font-semibold hover:bg-white cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleViewingSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#8A8A8A] uppercase mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={viewingData.fullName}
                        onChange={(e) =>
                          setViewingData({ ...viewingData, fullName: e.target.value })
                        }
                        placeholder="Full Name"
                        className="w-full px-3 py-2 bg-white border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:border-[#CF9F5D]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#8A8A8A] uppercase mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={viewingData.phone}
                        onChange={(e) =>
                          setViewingData({ ...viewingData, phone: e.target.value })
                        }
                        placeholder="Phone Number"
                        className="w-full px-3 py-2 bg-white border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:border-[#CF9F5D]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#8A8A8A] uppercase mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={viewingData.email}
                        onChange={(e) =>
                          setViewingData({ ...viewingData, email: e.target.value })
                        }
                        placeholder="Email Address"
                        className="w-full px-3 py-2 bg-white border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:border-[#CF9F5D]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#8A8A8A] uppercase mb-1">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={viewingData.preferredDate}
                        onChange={(e) =>
                          setViewingData({ ...viewingData, preferredDate: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:border-[#CF9F5D]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#8A8A8A] uppercase mb-1">
                        Viewing Type
                      </label>
                      <select
                        value={viewingData.viewingType}
                        onChange={(e) =>
                          setViewingData({
                            ...viewingData,
                            viewingType: e.target.value as any,
                          })
                        }
                        className="w-full px-3 py-2 bg-white border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:border-[#CF9F5D]"
                      >
                        <option value="In-person">In-person Physical Viewing</option>
                        <option value="Virtual Video Tour">Live Virtual Video Tour</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#8A8A8A] uppercase mb-1">
                        Preferred Time Slot
                      </label>
                      <select
                        value={viewingData.preferredTime}
                        onChange={(e) =>
                          setViewingData({ ...viewingData, preferredTime: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:border-[#CF9F5D]"
                      >
                        <option value="">Select Time Slot</option>
                        <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                        <option value="Afternoon (12:00 PM - 03:00 PM)">Afternoon (12:00 PM - 03:00 PM)</option>
                        <option value="Late Afternoon (03:00 PM - 06:00 PM)">Late Afternoon (03:00 PM - 06:00 PM)</option>
                        <option value="Evening (06:00 PM - 08:00 PM)">Evening (06:00 PM - 08:00 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowViewingForm(false)}
                      className="px-4 py-2 text-xs font-semibold text-[#6F6F6F] hover:text-[#171717]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingViewing}
                      className="px-6 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition-colors shadow-sm inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
                    >
                      {submittingViewing ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <MessageSquare className="w-3.5 h-3.5" />
                      )}
                      <span>{submittingViewing ? 'Saving...' : 'Confirm & Open WhatsApp'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
