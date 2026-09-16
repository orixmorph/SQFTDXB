import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Key,
  Clock,
  Building,
  Target,
  Users,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { agents } from '../data/mockData';

interface AboutViewProps {
  onNavigateToProperties: () => void;
  onOpenListProperty: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onNavigateToProperties,
  onOpenListProperty,
}) => {
  return (
    <div className="w-full min-h-screen bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F7F5] border border-[#EAEAEA] text-xs font-semibold text-[#171717] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#CF9F5D]" />
            <span>Our Mission & Secondary Philosophy</span>
            <span className="text-[#8A8A8A] font-normal">• Powered by Jamoka Properties (RERA ORN 49679)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#171717] tracking-tight leading-tight">
            Real Properties. Real Details. Zero Speculation.
          </h1>
          <p className="text-base sm:text-lg text-[#6F6F6F] mt-4 leading-relaxed">
            SQFT DXB was founded to cut through the noise of off-plan brochures and promotional launches. Powered by <a href="https://jamokaproperties.com" target="_blank" rel="noopener noreferrer" className="font-bold text-[#171717] hover:text-[#CF9F5D] underline underline-offset-4 decoration-[#CF9F5D]/50 transition-colors">Jamoka Properties</a>, we are Dubai’s modern PropTech advisory dedicated exclusively to secondary-market and ready-to-move residential properties.
          </p>
        </div>

        {/* The 4 Principles of SQFT DXB */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="p-8 rounded-3xl bg-[#F7F7F5] border border-[#EAEAEA] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#EAEAEA] flex items-center justify-center text-[#CF9F5D]">
              <Key className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#171717]">
              Ready to Move Today
            </h3>
            <p className="text-xs sm:text-sm text-[#6F6F6F] leading-relaxed">
              Every home on SQFT DXB is physically built. No 3D renderings, no 4-year construction waiting lists, and zero handover delay risk. What you inspect is what you own.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#F7F7F5] border border-[#EAEAEA] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#EAEAEA] flex items-center justify-center text-[#CF9F5D]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#171717]">
              Verified Title Deeds
            </h3>
            <p className="text-xs sm:text-sm text-[#6F6F6F] leading-relaxed">
              We audit every property against the Dubai Land Department (DLD) registry. Ownership authenticity, clear title deeds, and exact service charge histories are confirmed before listing.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#F7F7F5] border border-[#EAEAEA] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#EAEAEA] flex items-center justify-center text-[#CF9F5D]">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#171717]">
              Actual Yields & Valuations
            </h3>
            <p className="text-xs sm:text-sm text-[#6F6F6F] leading-relaxed">
              We value secondary assets using verified transaction comps, real rental contracts (Ejari), and genuine capital appreciation data—not optimistic developer marketing promises.
            </p>
          </div>
        </div>

        {/* Advisory Team */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold text-[#CF9F5D] uppercase tracking-wider block mb-1">
              RERA Licensed Advisors
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
              Meet the SQFT DXB Advisory Team
            </h2>
            <p className="text-sm text-[#6F6F6F] mt-2">
              Our specialists hold decades of combined expertise in Dubai's premier residential secondary market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="p-6 rounded-3xl bg-white border border-[#EAEAEA] hover:border-[#CF9F5D]/50 hover:shadow-lg transition-all text-center"
              >
                <img
                  src={agent.photo}
                  alt={agent.name}
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-[#CF9F5D]"
                />
                <h3 className="text-lg font-bold text-[#171717]">{agent.name}</h3>
                <p className="text-xs text-[#6F6F6F] font-medium">{agent.title}</p>
                <div className="mt-3 pt-3 border-t border-[#F0F0EE] flex items-center justify-center gap-3 text-xs text-[#8A8A8A]">
                  <span className="font-semibold text-[#171717]">{agent.reraNumber}</span>
                  <span>•</span>
                  <span>{agent.verifiedDeals} Verified Deals</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#171717] text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Ready to find your verified Dubai home?
            </h3>
            <p className="text-sm text-[#A8A8A8] mt-1.5 max-w-xl">
              Browse ready-to-move secondary listings or connect with an advisor for a confidential consultation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={onNavigateToProperties}
              className="px-6 py-3 rounded-xl bg-white text-[#171717] hover:bg-[#F7F7F5] font-bold text-xs transition-colors"
            >
              Browse Properties
            </button>
            <button
              onClick={onOpenListProperty}
              className="px-6 py-3 rounded-xl bg-[#CF9F5D] hover:bg-[#c08f4c] text-white font-bold text-xs transition-colors"
            >
              List Your Property
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
