import React from 'react';
import { ArrowRight, Building, Check, Key, TrendingUp, Sparkles, Users } from 'lucide-react';
import { PropertyPurpose } from '../types';

interface SellRentCtaBannerProps {
  onOpenListProperty: (purpose: PropertyPurpose) => void;
}

export const SellRentCtaBanner: React.FC<SellRentCtaBannerProps> = ({ onOpenListProperty }) => {
  return (
    <section className="w-full py-12 md:py-16 bg-white border-b border-[#F0F0EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F7F7F5] rounded-3xl p-6 sm:p-10 border border-[#EAEAEA] relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#CF9F5D]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left Content */}
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-xs font-semibold text-[#171717] border border-[#EAEAEA] mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#CF9F5D]" />
                <span>For Property Owners</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight mb-3">
                Sell or Rent Your Property
              </h2>
              <p className="text-sm sm:text-base text-[#6F6F6F] leading-relaxed mb-6">
                List your secondary or ready-to-move Dubai home with SQFT DXB. Our advisory team pairs verified buyers and premium tenants with transparent valuations, zero upfront fees, and seamless DLD title deed transfers.
              </p>

              {/* Owner Benefits Quick Strip */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-[#4A4A4A] font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#171717] text-[#CF9F5D] flex items-center justify-center text-[10px]">✓</span>
                  <span>Qualified Cash & Pre-Approved Buyers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#171717] text-[#CF9F5D] flex items-center justify-center text-[10px]">✓</span>
                  <span>Professional Photography & Floor Plans</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#171717] text-[#CF9F5D] flex items-center justify-center text-[10px]">✓</span>
                  <span>Dedicated RERA Specialist</span>
                </div>
              </div>
            </div>

            {/* Right Action Cards / Prominent Buttons with Visible Stroke & Button Badge */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              {/* Option 1: Sell My Property */}
              <button
                id="cta-sell-property-btn"
                onClick={() => onOpenListProperty('buy')}
                className="w-full sm:w-64 p-5 rounded-2xl bg-white border-2 border-[#171717] hover:border-[#CF9F5D] hover:shadow-[0_12px_28px_rgba(0,0,0,0.1)] text-left transition-all duration-200 group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#171717] text-[#CF9F5D] flex items-center justify-center shadow-sm">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#CF9F5D] bg-[#CF9F5D]/10 px-2.5 py-1 rounded-full border border-[#CF9F5D]/20">
                      Free Valuation
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#171717] mb-1">
                    Sell My Property
                  </h3>
                  <p className="text-xs text-[#6F6F6F] leading-relaxed">
                    Request an instant secondary valuation & reach vetted pre-approved buyers.
                  </p>
                </div>

                <div className="mt-4 w-full py-2.5 px-4 rounded-xl bg-[#171717] group-hover:bg-[#CF9F5D] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm">
                  <span>List for Sale</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </button>

              {/* Option 2: Rent My Property */}
              <button
                id="cta-rent-property-btn"
                onClick={() => onOpenListProperty('rent')}
                className="w-full sm:w-64 p-5 rounded-2xl bg-white border-2 border-[#171717] hover:border-[#CF9F5D] hover:shadow-[0_12px_28px_rgba(0,0,0,0.1)] text-left transition-all duration-200 group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#171717] text-[#CF9F5D] flex items-center justify-center shadow-sm">
                      <Key className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#171717] bg-[#F7F7F5] px-2.5 py-1 rounded-full border border-[#EAEAEA]">
                      Vetted Tenants
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#171717] mb-1">
                    Rent My Property
                  </h3>
                  <p className="text-xs text-[#6F6F6F] leading-relaxed">
                    Secure verified, corporate or executive tenants swiftly with Ejari compliance.
                  </p>
                </div>

                <div className="mt-4 w-full py-2.5 px-4 rounded-xl bg-[#171717] group-hover:bg-[#CF9F5D] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm">
                  <span>List for Rent</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
