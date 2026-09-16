import React from 'react';
import { X, Heart, Trash2, ArrowUpRight, Building } from 'lucide-react';
import { Property } from '../types';

interface SavedPropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedProperties: Property[];
  onSelectProperty: (property: Property) => void;
  onRemoveSaved: (propertyId: string) => void;
}

export const SavedPropertiesModal: React.FC<SavedPropertiesModalProps> = ({
  isOpen,
  onClose,
  savedProperties,
  onSelectProperty,
  onRemoveSaved,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div
        id="saved-properties-modal-box"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 my-auto max-h-[85vh] flex flex-col"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#EAEAEA]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FBF9F5] flex items-center justify-center text-[#CF9F5D]">
              <Heart className="w-4 h-4 fill-[#CF9F5D]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#171717]">
                Saved Properties ({savedProperties.length})
              </h3>
              <p className="text-xs text-[#8A8A8A]">
                Your shortlisted secondary & ready properties
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F7F7F5] text-[#8A8A8A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto py-4 space-y-3 flex-1">
          {savedProperties.length > 0 ? (
            savedProperties.map((property) => (
              <div
                key={property.id}
                className="flex items-center gap-4 p-3.5 rounded-2xl border border-[#EAEAEA] hover:border-[#CF9F5D]/50 transition-colors bg-white group"
              >
                <img
                  src={property.images[0]}
                  alt={property.title}
                  referrerPolicy="no-referrer"
                  className="w-20 h-16 rounded-xl object-cover flex-shrink-0"
                />

                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => {
                    onSelectProperty(property);
                    onClose();
                  }}
                >
                  <span className="text-[10px] font-bold text-[#CF9F5D] uppercase tracking-wider block">
                    {property.area} • {property.readyStatus}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-[#171717] truncate group-hover:text-[#CF9F5D] transition-colors">
                    {property.title}
                  </h4>
                  <div className="text-xs font-extrabold text-[#171717] mt-0.5">
                    {property.priceDisplay}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      onSelectProperty(property);
                      onClose();
                    }}
                    className="p-2 rounded-lg text-xs font-semibold text-[#171717] hover:bg-[#F7F7F5]"
                    title="View Property"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onRemoveSaved(property.id)}
                    className="p-2 rounded-lg text-[#8A8A8A] hover:text-red-500 hover:bg-[#F7F7F5]"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-[#8A8A8A]">
              <Building className="w-10 h-10 mx-auto mb-2 text-[#D8D8D3]" />
              <p className="text-sm font-semibold text-[#171717]">No saved properties yet</p>
              <p className="text-xs text-[#6F6F6F] mt-1">
                Tap the heart icon on any property to save it to your shortlist.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
