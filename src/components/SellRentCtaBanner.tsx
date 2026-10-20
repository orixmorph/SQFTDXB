import React from 'react';
import {
  ArrowRight,
  Calculator,
  Camera,
  Users,
  Banknote,
  Check,
  Sparkles,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { PropertyPurpose } from '../types';

interface SellRentCtaBannerProps {
  onOpenListProperty: (purpose: PropertyPurpose) => void;
  title?: string;
  subtitle?: string;
  ctaText?: string;
}

interface StepItem {
  id: number;
  stepNumber: string;
  shortLabel: string;
  tagline: string;
  icon: React.ElementType;
  badge: string;
}

export const SellRentCtaBanner: React.FC<SellRentCtaBannerProps> = ({
  onOpenListProperty,
  title,
  subtitle,
  ctaText,
}) => {
  const steps: StepItem[] = [
    {
      id: 1,
      stepNumber: '01',
      shortLabel: 'Property evaluation',
      tagline: 'Instant market worth check',
      icon: Calculator,
      badge: 'Step 1',
    },
    {
      id: 2,
      stepNumber: '02',
      shortLabel: 'Studio media',
      tagline: 'Visuals that convert to sales',
      icon: Camera,
      badge: 'Step 2',
    },
    {
      id: 3,
      stepNumber: '03',
      shortLabel: 'Targeted buyer reach',
      tagline: 'Connecting with qualified buyers',
      icon: Users,
      badge: 'Step 3',
    },
    {
      id: 4,
      stepNumber: '04',
      shortLabel: 'Seamless sale & closing',
      tagline: 'Best market price & smooth transfer',
      icon: Banknote,
      badge: 'Step 4',
    },
  ];

  return (
    <section className="w-full py-12 md:py-16 bg-[#FAFAF9] border-b border-[#EAEAEA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Card Container */}
        <div className="relative rounded-3xl bg-white border border-[#E5E5EA] p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
          {/* Subtle Ambient Radial Lights */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#CF9F5D]/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-neutral-100 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#F0F0EE]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F5F3] text-xs font-semibold text-[#171717] border border-[#E5E5EA] mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#CF9F5D]" />
                <span>Simple 4-Step Process for Owners</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#171717] leading-tight">
                {title || "Sell or Rent Your Property"}
              </h2>
              <p className="text-sm sm:text-base text-[#606060] mt-1.5 leading-relaxed">
                {subtitle || "A simple, transparent 4-step path to find the right buyer and close with ease. No hidden fees or complicated paperwork."}
              </p>
            </div>

            {/* Quick Actions in Header */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <button
                id="cta-pipeline-sell-btn"
                onClick={() => onOpenListProperty('buy')}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow cursor-pointer group"
              >
                <span>{ctaText || "List for Sale"}</span>
                <ArrowRight className="w-4 h-4 text-[#CF9F5D] transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                id="cta-pipeline-rent-btn"
                onClick={() => onOpenListProperty('rent')}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#F7F7F5] text-[#171717] border border-[#D5D5D0] text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs"
              >
                <span>List for Rent</span>
              </button>
            </div>
          </div>

          {/* Connected Process Track: Step 1 -> 2 -> 3 -> 4 */}
          <div className="relative z-10 mt-8">
            {/* Visual Process Line for Desktop & Tablet */}
            <div className="hidden md:block relative mb-8 px-4">
              {/* Background Connecting Line */}
              <div className="absolute top-5 left-12 right-12 h-[2px] bg-[#E5E5EA] z-0" />
              <div className="absolute top-5 left-12 right-12 h-[2px] bg-[#CF9F5D]/30 z-0" />

              {/* Connected Step Markers */}
              <div className="relative z-10 grid grid-cols-4 gap-4 text-center">
                {steps.map((step) => {
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => onOpenListProperty('buy')}
                      className="group flex flex-col items-center cursor-pointer focus:outline-none"
                    >
                      {/* Step Circle on Line */}
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 bg-white text-[#171717] border-2 border-[#CF9F5D] group-hover:bg-[#171717] group-hover:text-white shadow-xs group-hover:scale-110">
                        <span>{step.stepNumber}</span>
                      </div>

                      {/* Step Label */}
                      <span className="mt-2.5 text-xs font-bold tracking-tight text-[#171717] group-hover:text-[#CF9F5D] transition-colors">
                        {step.shortLabel}
                      </span>
                      <span className="text-[11px] text-[#808080] font-normal">
                        {step.tagline}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Process Flow Indicator */}
            <div className="md:hidden flex items-center justify-between gap-1 mb-4 p-2 bg-[#F7F7F5] rounded-xl border border-[#EBEBEA]">
              {steps.map((step) => {
                return (
                  <button
                    key={step.id}
                    onClick={() => onOpenListProperty('buy')}
                    className="flex-1 py-1.5 px-2 rounded-lg text-center transition-all bg-white border border-[#EAEAE6] text-[#171717] hover:border-[#CF9F5D]"
                  >
                    <div className="text-[10px] font-mono font-bold leading-tight text-[#CF9F5D]">
                      Step {step.stepNumber}
                    </div>
                    <div className="text-[11px] font-semibold truncate leading-tight mt-0.5">
                      {step.shortLabel}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 4 Minimized Step Cards with Direct Form Action */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
              {steps.map((step) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.id}
                    id={`flow-step-card-${step.id}`}
                    onClick={() => onOpenListProperty('buy')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onOpenListProperty('buy');
                      }
                    }}
                    className="group relative text-left p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between select-none bg-[#FAFAF9] hover:bg-white text-[#171717] border border-[#EAEAE6] hover:border-[#CF9F5D]/70 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div>
                      {/* Top Row: Step Tag + Icon */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-white text-[#171717] border border-[#E5E5EA] group-hover:border-[#CF9F5D]/50 group-hover:bg-[#CF9F5D]/10">
                          Step {step.stepNumber}
                        </span>

                        <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors bg-white text-[#707070] border border-[#EBEBEA] group-hover:bg-[#171717] group-hover:text-[#CF9F5D]">
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Step Title */}
                      <h4 className="text-sm sm:text-base font-bold tracking-tight mb-1 text-[#171717] group-hover:text-[#A67C3D] transition-colors">
                        {step.shortLabel}
                      </h4>

                      <p className="text-xs text-[#707070] leading-relaxed">
                        {step.tagline}
                      </p>
                    </div>

                    {/* Step Card Form Action Button */}
                    <div className="pt-3 mt-4 border-t border-[#EBEBE5] flex items-center justify-between text-xs font-semibold text-[#171717] group-hover:text-[#CF9F5D]">
                      <span>List Property</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-[#CF9F5D]" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Minimized Action & Form Bar (No expanded section underneath) */}
            <div className="p-4 sm:p-6 rounded-2xl bg-[#F8F8F6] border border-[#E5E5EA] flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#171717] text-[#CF9F5D] flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-[#171717]">
                    Ready to list your property?
                  </h4>
                  <p className="text-xs text-[#6F6F6F]">
                    Get instant valuation, complimentary 4K studio media, and direct reach to active buyers.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
                <button
                  id="minimized-form-sell-btn"
                  onClick={() => onOpenListProperty('buy')}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer group"
                >
                  <span>List for Sale</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#CF9F5D] transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  id="minimized-form-rent-btn"
                  onClick={() => onOpenListProperty('rent')}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F0F0EE] text-[#171717] border border-[#D5D5D0] text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs"
                >
                  <span>List for Rent</span>
                </button>
                <a
                  href={`https://wa.me/971559419262?text=${encodeURIComponent('Hello SQFT DXB, I would like to list my property for sale/rent.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
                  title="Chat directly on WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Minimal Trust Badges */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-6 text-xs text-[#707070] font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#CF9F5D]" />
                <span>Zero upfront fees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#CF9F5D]" />
                <span>Verified qualified buyers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#CF9F5D]" />
                <span>Full DLD transfer support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
