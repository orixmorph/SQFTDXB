import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Sparkles,
  Building2,
  Waves,
  Compass,
} from 'lucide-react';
import { Area } from '../types';
import { areas as defaultAreas } from '../data/mockData';

interface TrendingAreasProps {
  onSelectArea: (areaId: string) => void;
  onViewAllAreas: () => void;
  areas?: Area[];
}

type AreaCategory = 'all' | 'waterfront' | 'urban' | 'estates';

export const TrendingAreas: React.FC<TrendingAreasProps> = ({
  onSelectArea,
  onViewAllAreas,
  areas = defaultAreas,
}) => {
  const [activeCategory, setActiveCategory] = useState<AreaCategory>('all');

  const categories = [
    { id: 'all' as AreaCategory, label: 'All Prime Districts' },
    { id: 'waterfront' as AreaCategory, label: 'Waterfront & Island' },
    { id: 'urban' as AreaCategory, label: 'Downtown & Financial' },
    { id: 'estates' as AreaCategory, label: 'Golf & Private Estates' },
  ];

  // Tag areas by category
  const filteredAreas = areas.filter((area) => {
    const id = area.id.toLowerCase();
    if (activeCategory === 'waterfront') {
      return ['dubai-marina', 'palm-jumeirah', 'jbr', 'jumeirah', 'tilal-al-ghaf'].some((k) => id.includes(k));
    }
    if (activeCategory === 'urban') {
      return ['downtown', 'business-bay', 'difc', 'mohammed-bin-rashid', 'district-11'].some((k) => id.includes(k));
    }
    if (activeCategory === 'estates') {
      return ['dubai-hills', 'arabian-ranches', 'sheba', 'emirates-hills'].some((k) => id.includes(k));
    }
    return true;
  }).slice(0, 8);

  return (
    <section className="w-full py-16 md:py-24 bg-[#FAFAF9] border-b border-[#F0F0EE] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-xs font-semibold text-[#171717] border border-[#EAEAEA] mb-3 shadow-xs">
              <Compass className="w-3.5 h-3.5 text-[#CF9F5D]" />
              <span>Verified Secondary Neighborhoods</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#171717] tracking-tight">
              Trending Areas in Dubai
            </h2>
            <p className="text-sm sm:text-base text-[#6F6F6F] mt-2 max-w-2xl leading-relaxed">
              Discover ready-to-move communities with verified title deeds, high rental yields, and confirmed handover status.
            </p>
          </div>

          <button
            id="view-all-areas-header-btn"
            onClick={onViewAllAreas}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#171717] hover:text-white border border-[#EAEAEA] text-xs sm:text-sm font-bold text-[#171717] transition-all group cursor-pointer shadow-xs self-start md:self-auto"
          >
            <span>View All Districts</span>
            <ArrowRight className="w-4 h-4 text-[#CF9F5D] transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Futuristic Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`area-cat-btn-${cat.id}`}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#171717] text-white shadow-md'
                  : 'bg-white text-[#6F6F6F] hover:text-[#171717] border border-[#EAEAEA] hover:border-[#CF9F5D]/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Futuristic Bento & Pop-up Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5">
          {filteredAreas.map((area, index) => {
            // Give 1st and 2nd tiles prominent spans for an asymmetric futuristic bento flow
            const isFeaturedLarge = index === 0;
            const isMedium = index === 1;

            const colSpanClass = isFeaturedLarge
              ? 'lg:col-span-7 h-[360px] sm:h-[420px]'
              : isMedium
              ? 'lg:col-span-5 h-[360px] sm:h-[420px]'
              : 'lg:col-span-4 h-[280px] sm:h-[300px]';

            return (
              <motion.div
                key={area.id}
                id={`area-card-${area.id}`}
                onClick={() => onSelectArea(area.id)}
                initial={{ opacity: 0, y: 32, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.45,
                  delay: (index % 4) * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className={`group relative rounded-3xl overflow-hidden cursor-pointer border border-[#E8E8E6] bg-[#121214] shadow-sm hover:shadow-[0_16px_36px_rgba(0,0,0,0.14)] transition-all ${colSpanClass}`}
              >
                {/* Image */}
                <img
                  src={area.image}
                  alt={area.name}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 filter brightness-[0.9] group-hover:brightness-100"
                />

                {/* Ambient Cinematic Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />

                {/* Top Corner Action Indicator */}
                <div className="absolute top-4 right-4 pointer-events-none">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#CF9F5D] group-hover:border-[#CF9F5D] group-hover:text-white transition-all shadow-md group-hover:rotate-12">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom Details Overlay */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white pointer-events-none">
                  <div className="text-[11px] font-mono text-[#CF9F5D] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#CF9F5D]" />
                    <span>Dubai Prime Secondary</span>
                  </div>

                  <h3
                    className={`font-extrabold tracking-tight text-white group-hover:text-[#F3D7A0] transition-colors line-clamp-1 ${
                      isFeaturedLarge
                        ? 'text-2xl sm:text-3xl'
                        : isMedium
                        ? 'text-xl sm:text-2xl'
                        : 'text-lg sm:text-xl'
                    }`}
                  >
                    {area.name}
                  </h3>

                  <p className="text-xs text-white/80 line-clamp-2 mt-1 font-light leading-relaxed">
                    {area.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Explore Button */}
        <div className="mt-12 flex justify-center">
          <button
            id="view-all-areas-bottom-btn"
            onClick={onViewAllAreas}
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl bg-[#171717] hover:bg-[#2A2A2A] text-white font-bold text-sm tracking-wide transition-all shadow-sm hover:shadow-lg cursor-pointer group"
          >
            <span>Explore All Dubai Neighborhoods</span>
            <ArrowRight className="w-4 h-4 text-[#CF9F5D] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
