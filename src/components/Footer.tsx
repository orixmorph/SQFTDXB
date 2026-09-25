import React from 'react';
import { ShieldCheck, Plus, ArrowUpRight } from 'lucide-react';
import { PropertyPurpose } from '../types';

interface FooterProps {
  onNavigate: (view: string, filter?: { purpose?: PropertyPurpose; areaId?: string }) => void;
  onOpenListProperty: (purpose?: PropertyPurpose) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenListProperty,
}) => {
  return (
    <footer className="w-full bg-black border-t border-[#222222] text-white pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-[#222222]">
          {/* Col 1 & 2: Brand & Positioning */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col items-start gap-2">
              <img
                src="https://res.cloudinary.com/dy6km7beb/image/upload/v1789980615/Untitled_design_11_ocowpa.png"
                alt="SQFT DXB - WE FIND, YOU MOVE IN"
                className="h-10 sm:h-12 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
              <p className="text-xs font-semibold text-[#CF9F5D] tracking-wider">
                SQFT DXB • <span className="font-bold">WE FIND, YOU MOVE IN</span>
              </p>
              <div className="flex items-center gap-1.5 text-xs text-[#A3A3A3]">
                <span>Powered by</span>
                <a
                  href="https://jamokaproperties.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-white hover:text-[#CF9F5D] underline underline-offset-2 decoration-[#CF9F5D]/60 transition-colors"
                >
                  Jamoka Properties
                </a>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed max-w-sm">
              SQFT DXB is Dubai’s specialized real estate brokerage dedicated to verified secondary-market residences, commercial spaces, and ready-to-move properties. Verified title deeds, transparent pricing, and immediate key handover across Dubai’s prime communities.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#141414] border border-[#2A2A2A] text-[11px] text-[#D4D4D4] font-medium shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-[#CF9F5D]" />
              <span>RERA Registered Secondary & Commercial Broker • ORN 49679 • Powered by Jamoka Properties</span>
            </div>
          </div>

          {/* Col 3: Secondary Properties */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Ready Properties
            </h4>
            <ul className="space-y-2 text-xs text-[#A3A3A3]">
              <li>
                <button
                  onClick={() => onNavigate('properties', { purpose: 'buy' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Buy Secondary Properties
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('properties', { purpose: 'rent' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Rent Ready Homes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('properties')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  All Verified Listings
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenListProperty('buy')}
                  className="text-[#CF9F5D] hover:text-[#e2b77a] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Sell My Property</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenListProperty('rent')}
                  className="text-[#CF9F5D] hover:text-[#e2b77a] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Rent My Property</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Prime Communities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Dubai Communities
            </h4>
            <ul className="space-y-2 text-xs text-[#A3A3A3]">
              <li>
                <button
                  onClick={() => onNavigate('properties', { areaId: 'dubai-marina' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Dubai Marina
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('properties', { areaId: 'palm-jumeirah' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Palm Jumeirah
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('properties', { areaId: 'downtown-dubai' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Downtown Dubai
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('properties', { areaId: 'dubai-hills-estate' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Dubai Hills Estate
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('areas')}
                  className="text-[#CF9F5D] hover:text-[#e2b77a] font-semibold hover:underline cursor-pointer"
                >
                  View All Areas →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Company & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-[#A3A3A3]">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About SQFT DXB
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('blog')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Blog & Market Insights
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact Advisors
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <span className="text-[#737373]">Bayswater Tower, 8th & 11th Floor, Business Bay</span>
              </li>
              <li>
                <a
                  href="tel:+97148123400"
                  className="hover:text-white transition-colors"
                >
                  +971 4 812 3400
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737373]">
          <div>
            © {new Date().getFullYear()} SQFT DXB • Powered by <a href="https://jamokaproperties.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-white hover:text-[#CF9F5D] underline underline-offset-2">Jamoka Properties</a> (RERA ORN: 49679). All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span>•</span>
            <span className="text-[#A3A3A3] font-medium">RERA ORN 49679</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
