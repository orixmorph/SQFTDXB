import React, { useState } from 'react';
import { MapPin, ArrowRight, ArrowUpRight, Search, Building2 } from 'lucide-react';
import { Area } from '../types';
import { areas } from '../data/mockData';

interface AreasPageProps {
  onSelectArea: (areaId: string) => void;
}

export const AreasPage: React.FC<AreasPageProps> = ({ onSelectArea }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAreas = areas.filter((area) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      area.name.toLowerCase().includes(q) ||
      area.description.toLowerCase().includes(q) ||
      area.landmark.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full min-h-screen bg-white py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-semibold text-[#CF9F5D] uppercase tracking-wider block mb-1">
            Dubai Neighborhood Directory
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#171717] tracking-tight">
            Explore Dubai Communities
          </h1>
          <p className="text-base text-[#6F6F6F] mt-3 leading-relaxed">
            Discover established ready-property communities across Dubai. From iconic beachfront islands to tranquil championship golf estates, find the neighborhood that suits your lifestyle.
          </p>

          {/* Area Search Input */}
          <div className="mt-6 relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search community or landmark..."
              className="w-full pl-10 pr-4 py-3 bg-[#F7F7F5] border border-[#EAEAEA] rounded-xl text-sm text-[#171717] focus:outline-none focus:border-[#CF9F5D]"
            />
            <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3.5 top-3.5" />
          </div>
        </div>

        {/* Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAreas.map((area) => (
            <div
              key={area.id}
              id={`area-directory-card-${area.id}`}
              onClick={() => onSelectArea(area.id)}
              className="group bg-white rounded-3xl overflow-hidden border border-[#EAEAEA] hover:border-[#CF9F5D]/60 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Image Banner */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F7F7F5]">
                <img
                  src={area.image}
                  alt={area.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#171717] transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>

                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/25 backdrop-blur-md text-[11px] font-semibold text-white inline-block mb-1">
                    {area.readyCount} Ready Properties
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                    {area.name}
                  </h3>
                </div>
              </div>

              {/* Area Details */}
              <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                <p className="text-xs sm:text-sm text-[#6F6F6F] leading-relaxed">
                  {area.description}
                </p>

                <div className="pt-3 border-t border-[#F0F0EE] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8A8A8A]">Avg. Secondary Rate:</span>
                    <span className="font-bold text-[#171717]">
                      AED {area.avgPriceSqft.toLocaleString()} / sq.ft
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8A8A8A]">Key Landmark:</span>
                    <span className="font-medium text-[#171717] truncate max-w-[180px]">
                      {area.landmark}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[#8A8A8A]">Property Types:</span>
                    <div className="flex gap-1 flex-wrap justify-end">
                      {area.popularTypes.map((type, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-[#F7F7F5] text-[10px] font-semibold text-[#171717]"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button className="w-full py-2.5 rounded-xl bg-[#F7F7F5] group-hover:bg-[#171717] group-hover:text-white text-xs font-bold text-[#171717] transition-colors flex items-center justify-center gap-1.5">
                    <span>View Available Properties</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#CF9F5D]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
