import React, { useState, useEffect } from 'react';
import { Menu, X, Heart, Plus, Building2, ChevronRight, PhoneCall } from 'lucide-react';
import { PropertyPurpose } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, filter?: { purpose?: PropertyPurpose; areaId?: string }) => void;
  onOpenListProperty: (purpose?: PropertyPurpose) => void;
  savedCount: number;
  onOpenSavedModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenListProperty,
  savedCount,
  onOpenSavedModal,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Buy', action: () => onNavigate('properties', { purpose: 'buy' }), active: currentView === 'properties-buy' },
    { label: 'Rent', action: () => onNavigate('properties', { purpose: 'rent' }), active: currentView === 'properties-rent' },
    { label: 'Areas', action: () => onNavigate('areas'), active: currentView === 'areas' },
    { label: 'Properties', action: () => onNavigate('properties'), active: currentView === 'properties' },
    { label: 'Blog', action: () => onNavigate('blog'), active: currentView === 'blog' },
    { label: 'About', action: () => onNavigate('about'), active: currentView === 'about' },
    { label: 'Contact', action: () => onNavigate('contact'), active: currentView === 'contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-b border-[#EAEAEA]'
          : 'bg-white border-b border-[#F0F0EE]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo with Cloudinary Official Image */}
          <div className="flex items-center gap-3">
            <button
              id="nav-logo-btn"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
              aria-label="SQFT DXB Home"
            >
              <img
                src="https://res.cloudinary.com/dy6km7beb/image/upload/v1787668456/Screenshot_2026-08-25_at_6.34.07_pm_mfn070.png"
                alt="SQFT DXB - Real Estate"
                className="h-7 sm:h-8.5 w-auto object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                id={`nav-link-${item.label.toLowerCase()}`}
                onClick={item.action}
                className={`px-3.5 py-2 text-sm font-medium rounded-md transition-colors duration-200 cursor-pointer ${
                  item.active
                    ? 'text-[#171717] bg-[#F7F7F5] font-semibold'
                    : 'text-[#4A4A4A] hover:text-[#171717] hover:bg-[#FAFAF9]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Saved Properties counter button - temporarily hidden until login is added */}
            {false && (
              <button
                id="nav-saved-btn"
                onClick={onOpenSavedModal}
                className="relative p-2.5 rounded-full text-[#4A4A4A] hover:text-[#171717] hover:bg-[#F7F7F5] transition-colors cursor-pointer"
                title="Saved Properties"
                aria-label="View Saved Properties"
              >
                <Heart className="w-5 h-5 stroke-[1.75]" />
                {savedCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#CF9F5D] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {savedCount}
                  </span>
                )}
              </button>
            )}

            {/* List Your Property CTA */}
            <button
              id="nav-list-property-btn"
              onClick={() => onOpenListProperty('buy')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#171717] hover:bg-[#2A2A2A] active:bg-[#0A0A0A] transition-all duration-200 shadow-sm hover:shadow cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#CF9F5D]" />
              <span>List Your Property</span>
            </button>
          </div>

          {/* Mobile Menu & Saved Button */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Saved Button - temporarily hidden until login is added */}
            {false && (
              <button
                id="mobile-saved-btn"
                onClick={onOpenSavedModal}
                className="relative p-2 rounded-lg text-[#4A4A4A] hover:bg-[#F7F7F5]"
                aria-label="Saved properties"
              >
                <Heart className="w-5 h-5 stroke-[1.75]" />
                {savedCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#CF9F5D] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {savedCount}
                  </span>
                )}
              </button>
            )}

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#171717] hover:bg-[#F7F7F5] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EAEAEA] bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              id="mobile-nav-buy"
              onClick={() => {
                onNavigate('properties', { purpose: 'buy' });
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-lg bg-[#F7F7F5] text-sm font-semibold text-[#171717]"
            >
              <span>Ready for Sale</span>
            </button>
            <button
              id="mobile-nav-rent"
              onClick={() => {
                onNavigate('properties', { purpose: 'rent' });
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-lg bg-[#F7F7F5] text-sm font-semibold text-[#171717]"
            >
              <span>Ready for Rent</span>
            </button>
          </div>

          <div className="space-y-1">
            <button
              id="mobile-nav-properties"
              onClick={() => {
                onNavigate('properties');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-[#171717] hover:bg-[#F7F7F5]"
            >
              <span>All Secondary Properties</span>
              <ChevronRight className="w-4 h-4 text-[#8A8A8A]" />
            </button>

            <button
              id="mobile-nav-areas"
              onClick={() => {
                onNavigate('areas');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-[#171717] hover:bg-[#F7F7F5]"
            >
              <span>Trending Dubai Areas</span>
              <ChevronRight className="w-4 h-4 text-[#8A8A8A]" />
            </button>

            <button
              id="mobile-nav-blog"
              onClick={() => {
                onNavigate('blog');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-[#171717] hover:bg-[#F7F7F5]"
            >
              <span>Blog & Insights</span>
              <ChevronRight className="w-4 h-4 text-[#8A8A8A]" />
            </button>

            <button
              id="mobile-nav-about"
              onClick={() => {
                onNavigate('about');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-[#171717] hover:bg-[#F7F7F5]"
            >
              <span>About SQFT DXB</span>
              <ChevronRight className="w-4 h-4 text-[#8A8A8A]" />
            </button>

            <button
              id="mobile-nav-contact"
              onClick={() => {
                onNavigate('contact');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-[#171717] hover:bg-[#F7F7F5]"
            >
              <span>Contact Advisors</span>
              <ChevronRight className="w-4 h-4 text-[#8A8A8A]" />
            </button>
          </div>

          <div className="pt-2 border-t border-[#F0F0EE] space-y-3">
            <button
              id="mobile-nav-list-btn"
              onClick={() => {
                onOpenListProperty('buy');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 px-4 rounded-lg bg-[#171717] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#CF9F5D]" />
              <span>List Your Property</span>
            </button>

            <div className="text-center text-[11px] text-[#8A8A8A] pt-1">
              Powered by{' '}
              <a
                href="https://jamokaproperties.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#171717] font-semibold underline underline-offset-2 decoration-[#CF9F5D]/50"
              >
                Jamoka Properties
              </a>
              <span className="block text-[10px] text-[#9A9A9A] mt-0.5">RERA ORN: 49679</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
