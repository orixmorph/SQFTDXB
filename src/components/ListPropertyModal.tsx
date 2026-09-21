import React, { useState } from 'react';
import { X, CheckCircle2, Building2, Upload, TrendingUp, Key, ShieldCheck } from 'lucide-react';
import { PropertyPurpose, PropertyType, PropertyListingSubmission } from '../types';
import { areas } from '../data/mockData';

interface ListPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPurpose?: PropertyPurpose;
}

export const ListPropertyModal: React.FC<ListPropertyModalProps> = ({
  isOpen,
  onClose,
  defaultPurpose = 'buy',
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState<PropertyListingSubmission>({
    purpose: defaultPurpose,
    propertyType: 'Apartment',
    area: 'dubai-marina',
    buildingName: '',
    bedrooms: 2,
    expectedPrice: '',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    currentStatus: 'Vacant',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div
        id="list-property-modal-box"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 my-auto overflow-hidden"
      >
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#F7F7F5] text-[#8A8A8A] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FBF9F5] border-2 border-[#CF9F5D] flex items-center justify-center mx-auto text-[#CF9F5D]">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#171717]">
              Property Submission Received!
            </h3>
            <p className="text-sm text-[#6F6F6F] max-w-md mx-auto leading-relaxed">
              Thank you {formData.ownerName}. A senior SQFT DXB secondary specialist will review your property details and contact you at <span className="font-semibold text-[#171717]">{formData.ownerPhone}</span> within 2 business hours for a complimentary comparative market evaluation.
            </p>
            <div className="pt-4">
              <button
                onClick={handleResetAndClose}
                className="px-6 py-2.5 rounded-xl bg-[#171717] text-white text-xs font-semibold hover:bg-[#2A2A2A]"
              >
                Back to SQFT DXB
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6">
              <span className="text-xs font-semibold text-[#CF9F5D] uppercase tracking-wider block mb-1">
                Owner Concierge • Powered by Jamoka Properties (RERA ORN 49679)
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
                List Your Secondary Property
              </h2>
              <p className="text-xs sm:text-sm text-[#6F6F6F] mt-1">
                Connect directly with pre-screened cash buyers and vetted corporate tenants with verified Form A authorization.
              </p>
            </div>

            {/* Step Progress Indicators */}
            <div className="flex items-center gap-2 mb-6">
              <div
                className={`h-1.5 flex-1 rounded-full ${
                  step >= 1 ? 'bg-[#CF9F5D]' : 'bg-[#EAEAEA]'
                }`}
              />
              <div
                className={`h-1.5 flex-1 rounded-full ${
                  step >= 2 ? 'bg-[#CF9F5D]' : 'bg-[#EAEAEA]'
                }`}
              />
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                <div className="space-y-4">
                  {/* Purpose Toggle */}
                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                      I want to:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, purpose: 'buy' })}
                        className={`p-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          formData.purpose === 'buy'
                            ? 'border-[#CF9F5D] bg-[#FBF9F5] text-[#171717]'
                            : 'border-[#EAEAEA] bg-white text-[#6F6F6F]'
                        }`}
                      >
                        <TrendingUp className="w-4 h-4 text-[#CF9F5D]" />
                        <span>Sell My Property</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, purpose: 'rent' })}
                        className={`p-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          formData.purpose === 'rent'
                            ? 'border-[#CF9F5D] bg-[#FBF9F5] text-[#171717]'
                            : 'border-[#EAEAEA] bg-white text-[#6F6F6F]'
                        }`}
                      >
                        <Key className="w-4 h-4 text-[#CF9F5D]" />
                        <span>Rent My Property</span>
                      </button>
                    </div>
                  </div>

                  {/* Property Type */}
                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1.5">
                      Property Type:
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {(['Apartment', 'Villa', 'Penthouse', 'Townhouse', 'Duplex'] as PropertyType[]).map(
                        (type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({ ...formData, propertyType: type })}
                            className={`p-2 rounded-xl border text-xs font-medium transition-all ${
                              formData.propertyType === type
                                ? 'border-[#CF9F5D] bg-[#171717] text-white'
                                : 'border-[#EAEAEA] bg-white text-[#6F6F6F] hover:border-[#CF9F5D]'
                            }`}
                          >
                            {type}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Community & Building */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#171717] mb-1">
                        Community / Area *
                      </label>
                      <select
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        className="w-full px-3 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:border-[#CF9F5D]"
                      >
                        {areas.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#171717] mb-1">
                        Building or Project Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Marina Gate, Address Downtown"
                        value={formData.buildingName}
                        onChange={(e) => setFormData({ ...formData, buildingName: e.target.value })}
                        className="w-full px-3 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:border-[#CF9F5D]"
                      />
                    </div>
                  </div>

                  {/* Bedrooms & Expected Price */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#171717] mb-1">
                        Bedrooms
                      </label>
                      <select
                        value={formData.bedrooms}
                        onChange={(e) =>
                          setFormData({ ...formData, bedrooms: parseInt(e.target.value, 10) })
                        }
                        className="w-full px-3 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:border-[#CF9F5D]"
                      >
                        <option value={1}>1 Bedroom</option>
                        <option value={2}>2 Bedrooms</option>
                        <option value={3}>3 Bedrooms</option>
                        <option value={4}>4 Bedrooms</option>
                        <option value={5}>5+ Bedrooms</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#171717] mb-1">
                        Expected Asking Price (AED)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 3,500,000"
                        value={formData.expectedPrice}
                        onChange={(e) => setFormData({ ...formData, expectedPrice: e.target.value })}
                        className="w-full px-3 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:border-[#CF9F5D]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-2.5 rounded-xl bg-[#CF9F5D] hover:bg-[#BE8E4D] active:bg-[#AB7E3F] text-white text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs hover:shadow-sm"
                    >
                      Continue to Contact Info →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Step 2: Contact Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#171717] mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rashid Al-Husseini"
                        value={formData.ownerName}
                        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                        className="w-full px-3 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:border-[#CF9F5D]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#171717] mb-1">
                        Mobile Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+971 50 123 4567"
                        value={formData.ownerPhone}
                        onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                        className="w-full px-3 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:border-[#CF9F5D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="owner@example.com"
                      value={formData.ownerEmail}
                      onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:border-[#CF9F5D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Current Occupancy Status
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Vacant', 'Rented', 'Owner Occupied'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setFormData({ ...formData, currentStatus: st })}
                          className={`p-2 rounded-xl border text-xs font-medium transition-all ${
                            formData.currentStatus === st
                              ? 'border-[#CF9F5D] bg-[#171717] text-white'
                              : 'border-[#EAEAEA] bg-white text-[#6F6F6F]'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="High floor, upgraded kitchen, ready title deed in hand..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:border-[#CF9F5D]"
                    />
                  </div>

                  <div className="pt-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-semibold text-[#6F6F6F] hover:text-[#171717]"
                    >
                      ← Back
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#CF9F5D] hover:bg-[#BE8E4D] active:bg-[#AB7E3F] text-white text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_4px_14px_rgba(207,159,93,0.35)]"
                    >
                      Submit Listing Request
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
