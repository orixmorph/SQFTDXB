import React from 'react';
import { ShieldCheck, Plus, ArrowUpRight } from 'lucide-react';
import { PropertyPurpose } from '../types';

interface FooterProps {
  onNavigate: (view: string, filter?: { purpose?: PropertyPurpose; areaId?: string }) => void;
  onOpenListProperty: (purpose?: PropertyPurpose) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenListProperty }) => {
  return (
    <footer className="w-full bg-[#F7F7F5] border-t border-[#EAEAEA] text-[#171717] pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-[#EAEAEA]">
          {/* Col 1 & 2: Brand & Positioning */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col items-start gap-2">
              <img
                src="https://res.cloudinary.com/dy6km7beb/image/upload/v1787668456/Screenshot_2026-08-25_at_6.34.07_pm_mfn070.png"
                alt="SQFT DXB - Real Estate"
                className="h-12 w-auto object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
              <div className="flex items-center gap-1.5 text-xs text-[#6F6F6F] mt-1">
                <span>Powered by</span>
                <a
                  href="https://jamokaproperties.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#171717] hover:text-[#CF9F5D] underline underline-offset-2 decoration-[#CF9F5D]/50 transition-colors"
                >
                  Jamoka Properties
                </a>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#6F6F6F] leading-relaxed max-w-sm">
              SQFT DXB is Dubai’s specialized real estate brand dedicated solely to secondary-market and ready-to-move properties. Verified title deeds, real photography, transparent pricing, and immediate key handover across Dubai’s prime communities.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-[#EAEAEA] text-[11px] text-[#4A4A4A] font-medium shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-[#CF9F5D]" />
              <span>RERA Registered Secondary Broker • ORN 49679 • Powered by Jamoka Properties</span>
            </div>
          </div>

          {/* Col 3: Secondary Properties */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wider">
              Ready Properties
            </h4>
            <ul className="space-y-2 text-xs text-[#6F6F6F]">
              <li>
                <button
                  onClick={() => onNavigate('properties', { purpose: 'buy' })}
                  className="hover:text-[#171717] transition-colors"
                >
                  Buy Secondary Properties
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('properties', { purpose: 'rent' })}
                  className="hover:text-[#171717] transition-colors"
                >
                  Rent Ready Homes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('properties')}
                  className="hover:text-[#171717] transition-colors"
                >
                  All Verified Listings
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenListProperty('buy')}
                  className="hover:text-[#CF9F5D] font-semibold transition-colors flex items-center gap-1"
                >
                  <span>Sell My Property</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenListProperty('rent')}
                  className="hover:text-[#CF9F5D] font-semibold transition-colors flex items-center gap-1"
                >
                  <span>Rent My Property</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Prime Communities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wider">
              Dubai Communities
            </h4>
            <ul className="space-y-2 text-xs text-[#6F6F6F]">
              <li>
                <button
                  onClick={() => onNavigate('properties', { areaId: 'dubai-marina' })}
                  className="hover:text-[#171717] transition-colors"
                >
                  Dubai Marina
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('properties', { areaId: 'palm-jumeirah' })}
                  className="hover:text-[#171717] transition-colors"
                >
                  Palm Jumeirah
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('properties', { areaId: 'downtown-dubai' })}
                  className="hover:text-[#171717] transition-colors"
                >
                  Downtown Dubai
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('properties', { areaId: 'dubai-hills-estate' })}
                  className="hover:text-[#171717] transition-colors"
                >
                  Dubai Hills Estate
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('areas')}
                  className="text-[#CF9F5D] font-semibold hover:underline"
                >
                  View All Areas →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Company & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#171717] uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-[#6F6F6F]">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#171717] transition-colors"
                >
                  About SQFT DXB
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('blog')}
                  className="hover:text-[#171717] transition-colors"
                >
                  Blog & Market Insights
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#171717] transition-colors"
                >
                  Contact Advisors
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-[#171717] transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-[#171717] transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <span className="text-[#8A8A8A]">Boulevard Plaza, Downtown Dubai</span>
              </li>
              <li>
                <a
                  href="tel:+97148123400"
                  className="hover:text-[#171717] transition-colors"
                >
                  +971 4 812 3400
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A8A8A]">
          <div>
            © {new Date().getFullYear()} SQFT DXB • Powered by <a href="https://jamokaproperties.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#171717] hover:text-[#CF9F5D] underline underline-offset-2">Jamoka Properties</a> (RERA ORN: 49679). All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-[#171717] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate('terms')}
              className="hover:text-[#171717] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span>•</span>
            <span className="text-[#6F6F6F] font-medium">RERA ORN 49679</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
