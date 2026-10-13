import React, { useState } from 'react';
import {
  ArrowRight,
  Calculator,
  Camera,
  Users,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Banknote,
  Check,
} from 'lucide-react';
import { PropertyPurpose } from '../types';

interface SellRentCtaBannerProps {
  onOpenListProperty: (purpose: PropertyPurpose) => void;
}

interface StepItem {
  id: number;
  stepNumber: string;
  shortLabel: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  highlights: string[];
  badge: string;
  metric: { value: string; label: string };
  actionLabel: string;
}

export const SellRentCtaBanner: React.FC<SellRentCtaBannerProps> = ({ onOpenListProperty }) => {
  const [activeStepId, setActiveStepId] = useState<number>(1);

  const steps: StepItem[] = [
    {
      id: 1,
      stepNumber: '01',
      shortLabel: 'Property evaluation',
      tagline: 'Instant market worth check',
      description:
        'We evaluate your property to find its real market value using verified recent sales in your building. Fast, accurate, and 100% free.',
      icon: Calculator,
      highlights: [
        'Real transaction sales from your building',
        'Free, no-obligation valuation report',
        'Recommended listing price to sell fast',
      ],
      badge: 'Step 1',
      metric: { value: '100% Free', label: 'Valuation & Worth Check' },
      actionLabel: 'Get Free Property Evaluation',
    },
    {
      id: 2,
      stepNumber: '02',
      shortLabel: 'Studio media',
      tagline: 'Visuals that convert to sales',
      description:
        'Professional photography and clean video walkthroughs created to present your home at its finest and convert viewers into serious buyers.',
      icon: Camera,
      highlights: [
        'High-quality professional photography',
        'Professional video walkthroughs that sell',
        'Styled to showcase your home at its best',
      ],
      badge: 'Step 2',
      metric: { value: 'Zero Cost', label: 'Professional Media Included' },
      actionLabel: 'Book Studio Media',
    },
    {
      id: 3,
      stepNumber: '03',
      shortLabel: 'Targeted buyer reach',
      tagline: 'Connecting you with qualified buyers',
      description:
        'We put your property directly in front of pre-qualified buyers, private investors, and top channels for maximum exposure without unnecessary delays.',
      icon: Users,
      highlights: [
        'Direct reach to pre-approved & verified buyers',
        'Featured exposure on top Dubai portals',
        'Instant matching with ready home seekers',
      ],
      badge: 'Step 3',
      metric: { value: '15,000+', label: 'Registered Qualified Buyers' },
      actionLabel: 'Reach Active Buyers',
    },
    {
      id: 4,
      stepNumber: '04',
      shortLabel: 'Seamless sale & closing',
      tagline: 'Best market price & smooth transfer',
      description:
        'Sell your property with serious, qualified buyers ready to proceed. We manage all contracts, Land Department paperwork, and key handover effortlessly.',
      icon: Banknote,
      highlights: [
        'Qualified buyers ready to close smoothly',
        'Best market price with zero stress',
        'We handle all paperwork & DLD transfers',
      ],
      badge: 'Step 4',
      metric: { value: 'Fast Close', label: 'Full Transfer & Conveyance' },
      actionLabel: 'Sell Your Property',
    },
  ];

  const activeStep = steps.find((s) => s.id === activeStepId) || steps[0];
  const ActiveIcon = activeStep.icon;

  const handleNext = () => {
    setActiveStepId((prev) => (prev < steps.length ? prev + 1 : 1));
  };

  const handlePrev = () => {
    setActiveStepId((prev) => (prev > 1 ? prev - 1 : steps.length));
  };

  return (
    <section className="w-full py-12 md:py-16 bg-[#FAFAF9] border-b border-[#EAEAEA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Apple-Inspired Card Container */}
        <div className="relative rounded-3xl bg-white border border-[#E5E5EA] p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
          {/* Subtle Ambient Apple-Style Radial Lights */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#CF9F5D]/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-neutral-100 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header: Minimal, Clean, Meaningful */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#F0F0EE]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F5F3] text-xs font-semibold text-[#171717] border border-[#E5E5EA] mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#CF9F5D]" />
                <span>Simple 4-Step Process for Owners</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#171717] leading-tight">
                Sell or Rent Your Property
              </h2>
              <p className="text-sm sm:text-base text-[#606060] mt-1.5 leading-relaxed">
                A simple, transparent 4-step path to find the right buyer and close with ease. No hidden fees or complicated paperwork.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <button
                id="cta-pipeline-sell-btn"
                onClick={() => onOpenListProperty('buy')}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#171717] hover:bg-[#2A2A2A] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow cursor-pointer group"
              >
                <span>List for Sale</span>
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
              
              {/* Dynamic Active Progress Fill Line */}
              <div
                className="absolute top-5 left-12 h-[2px] bg-[#CF9F5D] transition-all duration-500 ease-out z-0"
                style={{
                  width: `${((activeStepId - 1) / (steps.length - 1)) * 100 * 0.78}%`,
                }}
              />

              {/* Connected Step Markers */}
              <div className="relative z-10 grid grid-cols-4 gap-4 text-center">
                {steps.map((step) => {
                  const isActive = step.id === activeStepId;
                  const isCompleted = step.id < activeStepId;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => setActiveStepId(step.id)}
                      className="group flex flex-col items-center cursor-pointer focus:outline-none"
                    >
                      {/* Step Circle on Line */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                          isActive
                            ? 'bg-[#171717] text-[#CF9F5D] ring-4 ring-[#CF9F5D]/25 shadow-md scale-110'
                            : isCompleted
                            ? 'bg-[#CF9F5D] text-white'
                            : 'bg-white text-[#8A8A8A] border-2 border-[#E5E5EA] group-hover:border-[#CF9F5D]/60 group-hover:text-[#171717]'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : (
                          <span>{step.stepNumber}</span>
                        )}
                      </div>

                      {/* Step Label */}
                      <span
                        className={`mt-2.5 text-xs font-bold tracking-tight transition-colors ${
                          isActive
                            ? 'text-[#171717]'
                            : 'text-[#707070] group-hover:text-[#171717]'
                        }`}
                      >
                        {step.shortLabel}
                      </span>
                      <span className="text-[11px] text-[#9A9A9A] font-normal">
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
                const isActive = step.id === activeStepId;
                const isCompleted = step.id < activeStepId;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStepId(step.id)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all ${
                      isActive
                        ? 'bg-[#171717] text-white shadow-xs'
                        : isCompleted
                        ? 'text-[#CF9F5D] font-bold'
                        : 'text-[#7A7A7A]'
                    }`}
                  >
                    <div className="text-[10px] font-mono font-bold leading-tight">
                      Step {step.stepNumber}
                    </div>
                    <div className="text-[11px] font-semibold truncate leading-tight mt-0.5">
                      {step.shortLabel}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 4 Interactive Apple-Style Step Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
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
                    className={`group relative text-left p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
                      isActive
                        ? 'bg-[#171717] text-white shadow-[0_8px_20px_rgba(0,0,0,0.12)] border border-[#171717] -translate-y-0.5'
                        : 'bg-[#FAFAF9] hover:bg-white text-[#171717] border border-[#EAEAE6] hover:border-[#D5D5CF] hover:shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Top Row: Step Tag + Icon */}
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-[#CF9F5D] text-white'
                              : 'bg-white text-[#6F6F6F] border border-[#E5E5EA]'
                          }`}
                        >
                          Step {step.stepNumber}
                        </span>

                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                            isActive
                              ? 'bg-white/15 text-[#CF9F5D]'
                              : 'bg-white text-[#707070] border border-[#EBEBEA] group-hover:text-[#171717]'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* Step Title */}
                      <h4
                        className={`text-sm sm:text-base font-bold tracking-tight mb-1 transition-colors ${
                          isActive ? 'text-white' : 'text-[#171717] group-hover:text-[#A67C3D]'
                        }`}
                      >
                        {step.shortLabel}
                      </h4>

                      <p
                        className={`text-xs line-clamp-1 ${
                          isActive ? 'text-white/70' : 'text-[#707070]'
                        }`}
                      >
                        {step.tagline}
                      </p>
                    </div>

                    {/* Step Card Bottom Status */}
                    <div
                      className={`pt-3 mt-3 border-t text-[11px] font-medium flex items-center justify-between ${
                        isActive
                          ? 'border-white/15 text-[#CF9F5D]'
                          : 'border-[#EBEBE5] text-[#8A8A8A] group-hover:text-[#171717]'
                      }`}
                    >
                      <span>{isActive ? 'Active Step' : 'Click to view'}</span>
                      <ChevronRight
                        className={`w-3 h-3 transition-transform ${
                          isActive
                            ? 'translate-x-0.5 text-[#CF9F5D]'
                            : 'group-hover:translate-x-1 text-[#8A8A8A]'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Futuristic Apple-Style Showcase Card */}
            <div className="relative rounded-2xl bg-[#F8F8F6] border border-[#E5E5EA] p-5 sm:p-7 lg:p-8 transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left Side: Clean Step Summary */}
                <div className="lg:col-span-8 space-y-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-white text-[#171717] text-xs font-mono font-bold border border-[#E0E0D8]">
                      Step {activeStep.stepNumber} of 04
                    </span>
                    <span className="text-xs text-[#707070] font-medium">
                      {activeStep.tagline}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#171717] tracking-tight flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#171717] text-[#CF9F5D] flex items-center justify-center flex-shrink-0">
                      <ActiveIcon className="w-4 h-4" />
                    </div>
                    <span>{activeStep.shortLabel}</span>
                  </h3>

                  <p className="text-sm sm:text-base text-[#4A4A4A] leading-relaxed max-w-2xl">
                    {activeStep.description}
                  </p>

                  {/* 3 Clean Minimal Points */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    {activeStep.highlights.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E8E8E4]"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#CF9F5D] flex-shrink-0" />
                        <span className="text-xs text-[#202020] font-medium leading-snug">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Step Navigation Controls */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-[#DCDCD5] hover:border-[#171717] text-xs font-semibold text-[#171717] transition-all cursor-pointer shadow-2xs"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-[#DCDCD5] hover:border-[#171717] text-xs font-semibold text-[#171717] transition-all cursor-pointer shadow-2xs"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right Side: Key Value Box */}
                <div className="lg:col-span-4 flex flex-col justify-between p-5 rounded-2xl bg-white border border-[#E2E2D8] shadow-2xs space-y-4">
                  <div>
                    <span className="text-[10px] font-mono text-[#8A8A8A] uppercase tracking-wider block font-bold mb-1">
                      Deliverable
                    </span>
                    <div className="text-2xl font-extrabold text-[#171717]">
                      {activeStep.metric.value}
                    </div>
                    <div className="text-xs text-[#606060] font-medium mt-0.5">
                      {activeStep.metric.label}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F0F0EE] space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs text-[#505050]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#CF9F5D] flex-shrink-0" />
                      <span>Certified Broker Advisory</span>
                    </div>

                    <button
                      id="step-action-trigger-btn"
                      onClick={() => onOpenListProperty('buy')}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#171717] hover:bg-[#2A2A2A] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs group"
                    >
                      <span>{activeStep.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#CF9F5D] transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Minimal Micro-Badges */}
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
