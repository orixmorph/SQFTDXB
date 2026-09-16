import React, { useState } from 'react';
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
  Clock,
} from 'lucide-react';
import { Property, ViewingRequestData } from '../types';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: (propertyId: string, e: React.MouseEvent) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  isSaved = false,
  onToggleSave,
}) => {
  if (!property) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showViewingForm, setShowViewingForm] = useState(false);
  const [viewingFormSubmitted, setViewingFormSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [viewingData, setViewingData] = useState<ViewingRequestData>({
    propertyId: property.id,
    propertyTitle: property.title,
    fullName: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '10:00 AM - 12:00 PM',
    viewingType: 'In-person',
    notes: '',
  });

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleViewingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setViewingFormSubmitted(true);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="property-detail-modal"
        className="relative w-full max-w-5xl bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col"
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
            {onToggleSave && (
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

            <button
              id="modal-share-btn"
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-[#F7F7F5] text-[#171717] transition-colors relative"
              title="Share Link"
            >
              <Share2 className="w-5 h-5 stroke-[1.75]" />
              {copiedLink && (
                <span className="absolute -bottom-8 right-0 text-[11px] font-semibold bg-[#171717] text-white px-2 py-0.5 rounded shadow whitespace-nowrap">
                  Link Copied!
                </span>
              )}
            </button>

            <button
              id="modal-close-btn"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#F7F7F5] text-[#171717] transition-colors ml-1"
              aria-label="Close details"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-8 flex-1">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-[#F7F7F5]">
              <img
                src={property.images[activeImageIndex]}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Gallery Controls */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/85 backdrop-blur-md text-[#171717] hover:bg-white shadow-md transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/85 backdrop-blur-md text-[#171717] hover:bg-white shadow-md transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium">
                    {activeImageIndex + 1} / {property.images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {property.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative flex-shrink-0 w-20 sm:w-24 aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#CF9F5D] scale-102 shadow-sm'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt="thumbnail"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Core Price & Title Block */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#F0F0EE]">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#CF9F5D] uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  {property.projectName}, {property.area}, Dubai
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight leading-snug">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-xs text-[#8A8A8A]">
                <span>RERA Permit: {property.reraPermit}</span>
                <span>•</span>
                <span>{property.handoverYear}</span>
              </div>
            </div>

            <div className="md:text-right flex-shrink-0 bg-[#F7F7F5] p-4 rounded-2xl md:bg-transparent md:p-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A] block mb-1">
                {property.purpose === 'buy' ? 'Asking Price' : 'Annual Rent'}
              </span>
              <div className="flex items-baseline md:justify-end gap-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
                  {property.priceDisplay}
                </span>
                {property.priceUnit && (
                  <span className="text-sm font-medium text-[#6F6F6F]">
                    {property.priceUnit}
                  </span>
                )}
              </div>
              {property.pricePerSqft && (
                <p className="text-xs text-[#8A8A8A] mt-0.5">
                  AED {property.pricePerSqft.toLocaleString()} per sq.ft
                </p>
              )}
            </div>
          </div>

          {/* Quick Specifications Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-xl bg-[#F7F7F5] border border-[#EAEAEA] text-center">
              <Bed className="w-4 h-4 text-[#CF9F5D] mx-auto mb-1" />
              <span className="text-[11px] text-[#8A8A8A] uppercase font-semibold block">
                Bedrooms
              </span>
              <span className="text-sm font-bold text-[#171717]">
                {property.bedrooms} Beds
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F7F5] border border-[#EAEAEA] text-center">
              <Bath className="w-4 h-4 text-[#CF9F5D] mx-auto mb-1" />
              <span className="text-[11px] text-[#8A8A8A] uppercase font-semibold block">
                Bathrooms
              </span>
              <span className="text-sm font-bold text-[#171717]">
                {property.bathrooms} Baths
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F7F5] border border-[#EAEAEA] text-center">
              <Maximize2 className="w-4 h-4 text-[#CF9F5D] mx-auto mb-1" />
              <span className="text-[11px] text-[#8A8A8A] uppercase font-semibold block">
                Total Area
              </span>
              <span className="text-sm font-bold text-[#171717]">
                {property.sqft.toLocaleString()} sq.ft
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F7F5] border border-[#EAEAEA] text-center">
              <Car className="w-4 h-4 text-[#CF9F5D] mx-auto mb-1" />
              <span className="text-[11px] text-[#8A8A8A] uppercase font-semibold block">
                Parking
              </span>
              <span className="text-sm font-bold text-[#171717]">
                {property.parkingSpaces} Spaces
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F7F5] border border-[#EAEAEA] text-center">
              <Layers className="w-4 h-4 text-[#CF9F5D] mx-auto mb-1" />
              <span className="text-[11px] text-[#8A8A8A] uppercase font-semibold block">
                Furnishing
              </span>
              <span className="text-sm font-bold text-[#171717]">
                {property.furnishedStatus}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F7F5] border border-[#EAEAEA] text-center">
              <Compass className="w-4 h-4 text-[#CF9F5D] mx-auto mb-1" />
              <span className="text-[11px] text-[#8A8A8A] uppercase font-semibold block">
                Exposure
              </span>
              <span className="text-sm font-bold text-[#171717] truncate block">
                {property.viewType}
              </span>
            </div>
          </div>

          {/* Main Content Grid: Description & Secondary Features vs Advisor Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Details, Features, Amenities */}
            <div className="lg:col-span-2 space-y-6">
              {/* Secondary Market Guarantee Box */}
              <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#CF9F5D]/30 flex items-start gap-3.5">
                <ShieldCheck className="w-6 h-6 text-[#CF9F5D] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-[#171717]">
                    SQFT DXB Secondary Verification Guarantee
                  </h4>
                  <p className="text-xs text-[#6F6F6F] mt-0.5 leading-relaxed">
                    This unit has been physically inspected by our licensed Dubai brokers. Title deed, current tenancy status (or vacancy on transfer), and maintenance service charges have been verified with Dubai Land Department (DLD).
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-[#171717] mb-3">
                  Property Overview
                </h3>
                <p className="text-sm text-[#4A4A4A] leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Key Features */}
              <div>
                <h3 className="text-lg font-bold text-[#171717] mb-3">
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

              {/* Amenities */}
              <div>
                <h3 className="text-lg font-bold text-[#171717] mb-3">
                  Building & Community Amenities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#EAEAEA] text-xs font-medium text-[#4A4A4A]"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Assigned Agent & Viewing Request Card */}
            <div className="space-y-6">
              {/* Assigned Agent Box */}
              <div className="p-5 rounded-2xl bg-[#F7F7F5] border border-[#EAEAEA] space-y-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={property.agent.photo}
                    alt={property.agent.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#CF9F5D]"
                  />
                  <div>
                    <h4 className="text-base font-bold text-[#171717]">
                      {property.agent.name}
                    </h4>
                    <p className="text-xs text-[#6F6F6F] font-medium">
                      {property.agent.title}
                    </p>
                    <span className="text-[11px] text-[#CF9F5D] font-semibold">
                      {property.agent.reraNumber} • {property.agent.verifiedDeals} Deals
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#EAEAEA] grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="py-2.5 px-3 rounded-xl bg-white border border-[#EAEAEA] hover:border-[#171717] text-xs font-semibold text-[#171717] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#CF9F5D]" />
                    <span>Call Agent</span>
                  </a>

                  <a
                    href={`https://wa.me/${property.agent.whatsapp.replace(/\+/g, '')}?text=Hello%20${encodeURIComponent(property.agent.name)},%20I%20am%20interested%20in%20${encodeURIComponent(property.title)}%20(${property.referenceNumber})`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-[#171717] hover:bg-[#2A2A2A] text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Main CTA */}
                <button
                  id="request-viewing-modal-btn"
                  onClick={() => setShowViewingForm(true)}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#CF9F5D] hover:bg-[#c08f4c] text-white font-bold text-sm tracking-wide shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Request a Private Viewing</span>
                </button>
              </div>

              {/* Ready Buyer Advisory Tip */}
              <div className="p-4 rounded-xl border border-[#EAEAEA] bg-white text-xs text-[#6F6F6F] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#171717]">
                  <Clock className="w-3.5 h-3.5 text-[#CF9F5D]" />
                  <span>Immediate Viewing Availability</span>
                </div>
                <p>
                  As a ready property, physical viewings can be arranged within 2-4 hours with keys held in escrow or directly through our senior advisor.
                </p>
              </div>
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
                <div className="p-6 rounded-xl bg-white border border-green-200 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
                  <h4 className="text-base font-bold text-[#171717]">
                    Viewing Request Confirmed!
                  </h4>
                  <p className="text-xs text-[#6F6F6F] max-w-md mx-auto">
                    Thank you {viewingData.fullName}. {property.agent.name} will contact you at {viewingData.phone} shortly to confirm access clearance and coordinate building security passes.
                  </p>
                  <button
                    onClick={() => {
                      setShowViewingForm(false);
                      setViewingFormSubmitted(false);
                    }}
                    className="mt-3 px-4 py-2 rounded-lg bg-[#171717] text-white text-xs font-semibold"
                  >
                    Done
                  </button>
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
                        placeholder="e.g. Alexander Wright"
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
                        placeholder="+971 50 123 4567"
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
                        placeholder="alexander@example.com"
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
                      className="px-6 py-2.5 rounded-xl bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs font-bold transition-colors shadow-sm"
                    >
                      Confirm Viewing Request
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
