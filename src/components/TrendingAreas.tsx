import React from 'react';
import { ArrowRight, ArrowUpRight, Building2, MapPin } from 'lucide-react';
import { Area } from '../types';
import { areas } from '../data/mockData';

interface TrendingAreasProps {
  onSelectArea: (areaId: string) => void;
  onViewAllAreas: () => void;
}

export const TrendingAreas: React.FC<TrendingAreasProps> = ({
  onSelectArea,
  onViewAllAreas,
}) => {
  // Take top 8 areas
  const displayAreas = areas.slice(0, 8);

  const marina = displayAreas[0];
  const palm = displayAreas[1];
  const downtown = displayAreas[2];
  const businessBay = displayAreas[3];
  const jbr = displayAreas[4];
  const dubaiHills = displayAreas[5];
  const arabianRanches = displayAreas[6];
  const jumeirah = displayAreas[7];

  return (
    <section className="w-full py-16 md:py-24 bg-white border-b border-[#F0F0EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F7F5] text-xs font-semibold text-[#171717] mb-2.5">
              <MapPin className="w-3.5 h-3.5 text-[#CF9F5D]" />
              <span>Prime Dubai Neighborhoods</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#171717] tracking-tight">
              Trending Areas in Dubai
            </h2>
            <p className="text-sm sm:text-base text-[#6F6F6F] mt-2 max-w-2xl">
              Explore verified secondary-market apartments, penthouses, and private estates across Dubai's most sought-after ready communities.
            </p>
          </div>

          <button
            id="view-all-areas-header-btn"
            onClick={onViewAllAreas}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#171717] hover:text-[#CF9F5D] transition-colors group cursor-pointer self-start md:self-auto"
          >
            <span>View All Areas</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Asymmetric Bento Grid (Layout inspired by reference image 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* 1. Dubai Marina - Large Left Feature Card (lg:col-span-5) */}
          {marina && (
            <div
              id={`area-card-${marina.id}`}
              onClick={() => onSelectArea(marina.id)}
              className="group relative rounded-3xl overflow-hidden cursor-pointer lg:col-span-5 h-[360px] sm:h-[420px] lg:h-[500px] border border-[#EAEAEA] shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img
                src={marina.image}
                alt={marina.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#171717] transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium text-white mb-2 inline-block">
                  {marina.readyCount} Ready Properties
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {marina.name}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 line-clamp-1 mt-1 font-light">
                  {marina.description}
                </p>
              </div>
            </div>
          )}

          {/* Right Column Stack (lg:col-span-7) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* 2. Palm Jumeirah (sm:col-span-1) */}
            {palm && (
              <div
                id={`area-card-${palm.id}`}
                onClick={() => onSelectArea(palm.id)}
                className="group relative rounded-3xl overflow-hidden cursor-pointer h-[230px] border border-[#EAEAEA] shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={palm.image}
                  alt={palm.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#171717] transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>

                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                    {palm.name}
                  </h3>
                  <p className="text-xs text-white/80 font-medium mt-0.5">
                    {palm.readyCount} properties • Avg AED {palm.avgPriceSqft}/sqft
                  </p>
                </div>
              </div>
            )}

            {/* 3. Downtown Dubai (sm:col-span-1) */}
            {downtown && (
              <div
                id={`area-card-${downtown.id}`}
                onClick={() => onSelectArea(downtown.id)}
                className="group relative rounded-3xl overflow-hidden cursor-pointer h-[230px] border border-[#EAEAEA] shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={downtown.image}
                  alt={downtown.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#171717] transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>

                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                    {downtown.name}
                  </h3>
                  <p className="text-xs text-white/80 font-medium mt-0.5">
                    {downtown.readyCount} properties • Center of Dubai
                  </p>
                </div>
              </div>
            )}

            {/* 4. Business Bay - Wide Card across 2 cols */}
            {businessBay && (
              <div
                id={`area-card-${businessBay.id}`}
                onClick={() => onSelectArea(businessBay.id)}
                className="group relative rounded-3xl overflow-hidden cursor-pointer sm:col-span-2 h-[230px] border border-[#EAEAEA] shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={businessBay.image}
                  alt={businessBay.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#171717] transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>

                <div className="absolute bottom-4 left-5 right-5 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-[#CF9F5D] transition-colors">
                      {businessBay.name}
                    </h3>
                    <p className="text-xs text-white/80 font-medium mt-0.5">
                      {businessBay.readyCount} properties • Water canal & financial hub
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#CF9F5D] bg-black/40 backdrop-blur-md px-3 py-1 rounded-full self-start sm:self-auto">
                    Explore Ready Units
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom 4 Areas Grid (lg:col-span-12) */}
          <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
            {[jbr, dubaiHills, arabianRanches, jumeirah].map((area) => {
              if (!area) return null;
              return (
                <div
                  key={area.id}
                  id={`area-card-${area.id}`}
                  onClick={() => onSelectArea(area.id)}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer h-[200px] border border-[#EAEAEA] shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <img
                    src={area.image}
                    alt={area.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#171717] transition-colors">
                    <ArrowUpRight className="w-3 h-3" />
                  </div>

                  <div className="absolute bottom-3.5 left-4 right-4 text-white">
                    <h4 className="text-base font-bold tracking-tight">
                      {area.name}
                    </h4>
                    <p className="text-xs text-white/80 font-medium mt-0.5">
                      {area.readyCount} properties
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* View All Areas Footer Button - High Visibility */}
        <div className="mt-12 flex justify-center">
          <button
            id="view-all-areas-bottom-btn"
            onClick={onViewAllAreas}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#171717] hover:bg-[#2A2A2A] active:bg-black text-white font-bold text-sm tracking-wide transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl group border-2 border-[#171717]"
          >
            <span>Explore All Dubai Communities</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#CF9F5D]"></span>
            <span className="text-xs text-[#CF9F5D] font-medium">8 Prime Districts</span>
            <ArrowRight className="w-4 h-4 text-[#CF9F5D] group-hover:translate-x-1 transition-transform ml-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
