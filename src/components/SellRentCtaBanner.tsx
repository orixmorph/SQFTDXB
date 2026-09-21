import React, { useState } from 'react';
import {
  ArrowRight,
  TrendingUp,
  Camera,
  Share2,
  Award,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  ShieldCheck,
  MousePointerClick,
  FileCheck2,
} from 'lucide-react';
import { PropertyPurpose } from '../types';

interface SellRentCtaBannerProps {
  onOpenListProperty: (purpose: PropertyPurpose) => void;
}

interface FlowStep {
  id: number;
  stepNumber: string;
  shortLabel: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  metric: { value: string; label: string };
  actionLabel: string;
}

export const SellRentCtaBanner: React.FC<SellRentCtaBannerProps> = ({ onOpenListProperty }) => {
  const [activeStepId, setActiveStepId] = useState<number>(1);

  const steps: FlowStep[] = [
    {
      id: 1,
      stepNumber: '01',
      shortLabel: 'Property Valuation',
      title: 'Property Evaluation & Worth Check',
      tagline: 'Algorithmic & RERA-Certified Market Assessment',
      description:
        'We evaluate your property and determine its real-time market worth by cross-referencing official Dubai Land Department transaction records, recent building sales, and verified yield benchmarks.',
      icon: TrendingUp,
      features: [
        'Accurate Worth Check & Capital Equity Appraisal',
        'Recent Verified Building Comps & Absorption Velocity',
        'Rental Yield Maximization & Optimal Listing Price Plan',
      ],
      metric: { value: '100% Free', label: 'No-Obligation Valuation Report' },
      actionLabel: 'Request Free Valuation',
    },
    {
      id: 2,
      stepNumber: '02',
      shortLabel: 'Studio Media',
      title: 'Professional Photo & 4K Videography',
      tagline: 'High-Definition Architectural Production',
      description:
        'We provide dedicated professional photography and videography for your property. Our media team crafts magazine-grade HDR stills, 4K video walkthroughs, and twilight drone footage to captivate serious buyers.',
      icon: Camera,
      features: [
        'HDR Architectural Photography & Detail Shots',
        'Cinematic 4K Video Walkthrough Reels',
        'Licensed Twilight Drone & Aerial Elevation Views',
      ],
      metric: { value: '4K Ultra HD', label: 'Complimentary Media Production' },
      actionLabel: 'Book Media Production',
    },
    {
      id: 3,
      stepNumber: '03',
      shortLabel: 'Omni Marketing',
      title: 'Targeted Marketing & Private Network',
      tagline: 'Premier Portals & Exclusive Off-Market Circle',
      description:
        'We do high-impact marketing for your property and promote it directly across our private network of pre-screened cash buyers, family offices, and verified international investors for swift off-market matching.',
      icon: Share2,
      features: [
        'Exclusive Promotion to Our Private VIP Network',
        'Premium Featured Placement Across Dubai Portals',
        'Targeted International & GCC Buyer Syndication',
      ],
      metric: { value: '15,000+', label: 'Verified HNWI & Cash Buyers' },
      actionLabel: 'Market My Property',
    },
    {
      id: 4,
      stepNumber: '04',
      shortLabel: 'Best Offer Closing',
      title: 'Highest Market Offer & Fast Closing',
      tagline: 'Strategic Price Negotiation & DLD Conveyancing',
      description:
        'We advocate tirelessly on your behalf to secure the best offer possible in the market. Once an agreement is reached, our conveyancing experts manage all contracts, Trustee registrations, and title deed transfers.',
      icon: Award,
      features: [
        'Tenacious Negotiation to Secure Peak Market Value',
        'Pre-Screened Cash Buyers & Verified Financial Proof',
        'Full Dubai Land Department & Ejari Conveyance Support',
      ],
      metric: { value: 'Top 1%', label: 'Offer-to-Asking Realization Rate' },
      actionLabel: 'Connect With a Specialist',
    },
  ];

  const activeStep = steps.find((s) => s.id === activeStepId) || steps[0];
  const ActiveIcon = activeStep.icon;

  const handleNextStep = () => {
    setActiveStepId((prev) => (prev < steps.length ? prev + 1 : 1));
  };

  const handlePrevStep = () => {
    setActiveStepId((prev) => (prev > 1 ? prev - 1 : steps.length));
  };

  return (
    <section className="w-full py-14 md:py-20 bg-[#FBFBFA] border-b border-[#EAEAEA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Light Themed Main Container Card */}
        <div className="relative rounded-3xl bg-white border border-[#E4E4DE] p-6 sm:p-10 lg:p-12 shadow-[0_10px_35px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Subtle Ambient Light Accents */}
          <div className="absolute -top-28 -right-28 w-96 h-96 bg-[#CF9F5D]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-28 -left-28 w-80 h-80 bg-[#171717]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 pb-8 border-b border-[#EAEAE6]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F5F0] text-xs font-semibold text-[#171717] border border-[#E0E0D8] mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#CF9F5D]" />
                <span>For Property Owners & Landlords</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#171717] leading-tight">
                Sell or Rent Your Property
              </h2>
              <p className="text-sm sm:text-base text-[#606060] mt-2.5 leading-relaxed">
                Unlock your property's highest secondary market value with SQFT DXB. Discover our transparent 4-stage advisory workflow designed for rapid closing and zero upfront costs.
              </p>
            </div>

            {/* Header Direct Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                id="cta-pipeline-sell-btn"
                onClick={() => onOpenListProperty('buy')}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#171717] hover:bg-[#2A2A2A] active:bg-black text-white text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow-md cursor-pointer group"
              >
                <span>List for Sale</span>
                <ArrowRight className="w-4 h-4 text-[#CF9F5D] transition-transform group-hover:translate-x-1" />
              </button>
              <button
                id="cta-pipeline-rent-btn"
                onClick={() => onOpenListProperty('rent')}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-[#F7F7F5] text-[#171717] border-2 border-[#171717] text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs"
              >
                <span>List for Rent</span>
              </button>
            </div>
          </div>

          {/* Interactive Flowchart Menu Section */}
          <div className="relative z-10 mt-8">
            {/* Clear Clickable Instruction Cue Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#171717] bg-[#F4F4EE] px-3.5 py-1.5 rounded-full border border-[#E2E2D8]">
                <MousePointerClick className="w-4 h-4 text-[#CF9F5D] animate-bounce" />
                <span>Interactive Menu — Click on any of the 4 stage buttons to view details</span>
              </div>
              <span className="text-[11px] font-semibold text-[#808080]">
                Step {activeStep.id} of 4: {activeStep.shortLabel}
              </span>
            </div>

            {/* The 4 Clearly Styled Interactive Buttons */}
            <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = step.id === activeStepId;
                return (
                  <button
                    key={step.id}
                    id={`flow-step-btn-${step.id}`}
                    onClick={() => setActiveStepId(step.id)}
                    type="button"
                    aria-selected={isActive}
                    role="tab"
                    className={`group relative text-left p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer border-2 flex flex-col justify-between select-none ${
                      isActive
                        ? 'bg-[#171717] text-white border-[#CF9F5D] shadow-[0_12px_28px_rgba(0,0,0,0.18)] -translate-y-1 ring-4 ring-[#CF9F5D]/20'
                        : 'bg-white hover:bg-[#FAF9F6] text-[#171717] border-[#DFDFD8] hover:border-[#CF9F5D] shadow-xs hover:shadow-md hover:-translate-y-0.5'
                    }`}
                  >
                    {/* Top Row: Step Tag + Status Indicator */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`text-[11px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                            isActive
                              ? 'bg-[#CF9F5D] text-white border-[#CF9F5D]'
                              : 'bg-[#F2F2EC] text-[#555555] border-[#E0E0D8]'
                          }`}
                        >
                          Step {step.stepNumber}
                        </span>

                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                            isActive
                              ? 'bg-white/15 text-[#CF9F5D]'
                              : 'bg-[#F4F4EE] text-[#707070] group-hover:text-[#171717] group-hover:bg-[#EAEAE4]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Button Main Title */}
                      <h4
                        className={`text-base font-extrabold tracking-tight mb-1 transition-colors ${
                          isActive ? 'text-white' : 'text-[#171717] group-hover:text-[#A67C3D]'
                        }`}
                      >
                        {step.shortLabel}
                      </h4>

                      <p
                        className={`text-xs line-clamp-1 mb-3 ${
                          isActive ? 'text-white/70' : 'text-[#6F6F6F]'
                        }`}
                      >
                        {step.tagline}
                      </p>
                    </div>

                    {/* Button Bottom Interaction Hint */}
                    <div
                      className={`pt-2.5 border-t text-[11px] font-bold flex items-center justify-between ${
                        isActive
                          ? 'border-white/20 text-[#CF9F5D]'
                          : 'border-[#EFEFEA] text-[#8A8A8A] group-hover:text-[#171717]'
                      }`}
                    >
                      <span>{isActive ? '● Currently Selected' : 'Click to View →'}</span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isActive
                            ? 'rotate-90 text-[#CF9F5D]'
                            : 'group-hover:translate-x-1 text-[#8A8A8A]'
                        }`}
                      />
                    </div>

                    {/* Downward Pointer Caret on Active Button connecting to container */}
                    {isActive && (
                      <div className="hidden lg:block absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#171717] rotate-45 border-r-2 border-b-2 border-[#CF9F5D] z-20" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Detailed Stage Showcase Box (Light-Themed & High-Contrast) */}
            <div className="relative rounded-3xl bg-[#F9F9F7] border-2 border-[#E5E5DD] p-6 sm:p-8 lg:p-10 shadow-sm transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Side: Stage Content Breakdown */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-white text-[#A67C3D] text-xs font-mono font-extrabold border border-[#E5D7C3] shadow-xs">
                      Active Stage {activeStep.stepNumber} of 04
                    </span>
                    <span className="text-xs text-[#707070] font-semibold">
                      {activeStep.tagline}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#171717] tracking-tight flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#171717] text-[#CF9F5D] flex items-center justify-center flex-shrink-0 shadow-xs">
                      <ActiveIcon className="w-5 h-5" />
                    </div>
                    <span>{activeStep.title}</span>
                  </h3>

                  <p className="text-sm sm:text-base text-[#4A4A4A] leading-relaxed max-w-2xl">
                    {activeStep.description}
                  </p>

                  {/* Highlights Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {activeStep.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-[#E2E2D8] shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#CF9F5D] flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-[#202020] font-semibold leading-snug">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Step Navigation Controls */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-[#DCDCD5] hover:border-[#171717] text-xs font-bold text-[#171717] transition-all cursor-pointer shadow-xs"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Previous Step</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-[#DCDCD5] hover:border-[#171717] text-xs font-bold text-[#171717] transition-all cursor-pointer shadow-xs"
                    >
                      <span>Next Step</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right Side: Performance Metric & Action Box */}
                <div className="lg:col-span-4 flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white border-2 border-[#E2E2D8] shadow-sm space-y-6">
                  <div>
                    <span className="text-[11px] font-mono text-[#808080] uppercase tracking-wider block font-bold mb-1">
                      Our Deliverable Standard
                    </span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
                      {activeStep.metric.value}
                    </div>
                    <div className="text-xs text-[#606060] font-medium mt-0.5">
                      {activeStep.metric.label}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#EAEAE4] space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#404040] font-medium">
                      <ShieldCheck className="w-4 h-4 text-[#CF9F5D] flex-shrink-0" />
                      <span>RERA-Certified Broker Advisory</span>
                    </div>

                    <button
                      id="step-action-trigger-btn"
                      onClick={() => onOpenListProperty('buy')}
                      className="w-full py-3.5 px-4 rounded-xl bg-[#171717] hover:bg-[#2A2A2A] active:bg-black text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm group"
                    >
                      <span>{activeStep.actionLabel}</span>
                      <ArrowRight className="w-4 h-4 text-[#CF9F5D] transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Guarantee Micro-Badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-[#606060] font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#CF9F5D]"></span>
                <span>Zero Upfront Listing Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#CF9F5D]"></span>
                <span>Direct Access to Vetted Cash Buyers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#CF9F5D]"></span>
                <span>Seamless DLD Title Deed Conveyance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
