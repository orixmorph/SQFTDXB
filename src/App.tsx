import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SellRentCtaBanner } from './components/SellRentCtaBanner';
import { TrendingAreas } from './components/TrendingAreas';
import { NewSecondaryProjects } from './components/NewSecondaryProjects';
import { PropertyCard } from './components/PropertyCard';
import { BlogPreview } from './components/BlogPreview';
import { BlogView } from './components/BlogView';
import { PropertiesPage } from './components/PropertiesPage';
import { AreasPage } from './components/AreasPage';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { PrivacyPolicyView } from './components/PrivacyPolicyView';
import { TermsOfServiceView } from './components/TermsOfServiceView';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { ListPropertyModal } from './components/ListPropertyModal';
import { SavedPropertiesModal } from './components/SavedPropertiesModal';
import { Footer } from './components/Footer';
import { Property, SearchFilterState, PropertyPurpose } from './types';
import { properties } from './data/mockData';
import { BlogPost } from './data/blogData';
import {
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sqft_dxb_saved');
      return stored ? JSON.parse(stored) : ['prop-1', 'prop-3'];
    } catch {
      return ['prop-1', 'prop-3'];
    }
  });

  const [searchFilters, setSearchFilters] = useState<Partial<SearchFilterState>>({
    purpose: 'buy',
  });

  const [isListPropertyOpen, setIsListPropertyOpen] = useState(false);
  const [listPropertyPurpose, setListPropertyPurpose] = useState<PropertyPurpose>('buy');
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'buy' | 'rent'>('all');

  useEffect(() => {
    try {
      localStorage.setItem('sqft_dxb_saved', JSON.stringify(savedPropertyIds));
    } catch {
      // Ignore storage errors
    }
  }, [savedPropertyIds]);

  // Scroll to top on view change
  const navigateTo = (view: string, filter?: { purpose?: PropertyPurpose; areaId?: string }) => {
    if (filter) {
      setSearchFilters((prev) => ({
        ...prev,
        purpose: filter.purpose || prev.purpose || 'buy',
        area: filter.areaId !== undefined ? filter.areaId : prev.area,
      }));
    }
    if (view === 'blog') {
      setSelectedBlogPost(null);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBlogPost = (post: BlogPost) => {
    setSelectedBlogPost(post);
    setCurrentView('blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeroSearch = (filters: Partial<SearchFilterState>) => {
    setSearchFilters(filters);
    setCurrentView('properties');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArea = (areaId: string) => {
    setSearchFilters({
      purpose: 'buy',
      area: areaId,
    });
    setCurrentView('properties');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSaveProperty = (propertyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedPropertyIds((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleOpenListProperty = (purpose: PropertyPurpose = 'buy') => {
    setListPropertyPurpose(purpose);
    setIsListPropertyOpen(true);
  };

  const savedPropertiesList = properties.filter((p) =>
    savedPropertyIds.includes(p.id)
  );

  const homeFeaturedProperties = properties.filter((p) => {
    if (featuredFilter === 'all') return true;
    return p.purpose === featuredFilter;
  }).slice(0, 6);

  return (
    <div className="min-h-screen bg-white text-[#171717] flex flex-col font-sans selection:bg-[#CF9F5D]/20 selection:text-[#171717]">
      {/* Top Main Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        onOpenListProperty={handleOpenListProperty}
        savedCount={savedPropertyIds.length}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
      />

      {/* Main Views Container */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <div>
            {/* SECTION 01 — HERO with Embedded Search Filter */}
            <Hero
              onSearch={handleHeroSearch}
              onSelectArea={handleSelectArea}
              onOpenListProperty={handleOpenListProperty}
            />

            {/* SECTION 02 — SELL OR RENT YOUR PROPERTY CTA BANNER */}
            <SellRentCtaBanner
              onOpenListProperty={handleOpenListProperty}
            />

            {/* SECTION 03 — TRENDING AREAS IN DUBAI BENTO GRID */}
            <TrendingAreas
              onSelectArea={handleSelectArea}
              onViewAllAreas={() => navigateTo('areas')}
            />

            {/* SECTION 04 — BROWSE NEW PROJECTS IN DUBAI CAROUSEL */}
            <NewSecondaryProjects
              onSelectProperty={(prop) => setSelectedProperty(prop)}
              onViewAllProperties={() => navigateTo('properties')}
            />

            {/* SECTION 05 — FEATURED READY RESIDENCES GRID */}
            <section className="w-full py-16 md:py-24 bg-white border-b border-[#F0F0EE]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F7F5] text-xs font-semibold text-[#171717] mb-2.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#CF9F5D]" />
                      <span>Curated Secondary Selection</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#171717] tracking-tight">
                      Featured Ready Residences
                    </h2>
                    <p className="text-sm sm:text-base text-[#6F6F6F] mt-2 max-w-xl">
                      Handpicked luxury secondary apartments, sky villas, and private homes in Dubai's premier neighborhoods.
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-2 bg-[#F7F7F5] p-1 rounded-xl self-start md:self-auto">
                    <button
                      onClick={() => setFeaturedFilter('all')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        featuredFilter === 'all'
                          ? 'bg-white text-[#171717] shadow-sm'
                          : 'text-[#6F6F6F] hover:text-[#171717]'
                      }`}
                    >
                      All Ready
                    </button>
                    <button
                      onClick={() => setFeaturedFilter('buy')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        featuredFilter === 'buy'
                          ? 'bg-white text-[#171717] shadow-sm'
                          : 'text-[#6F6F6F] hover:text-[#171717]'
                      }`}
                    >
                      For Sale
                    </button>
                    <button
                      onClick={() => setFeaturedFilter('rent')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        featuredFilter === 'rent'
                          ? 'bg-white text-[#171717] shadow-sm'
                          : 'text-[#6F6F6F] hover:text-[#171717]'
                      }`}
                    >
                      For Rent
                    </button>
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {homeFeaturedProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onSelect={(prop) => setSelectedProperty(prop)}
                      isSaved={savedPropertyIds.includes(property.id)}
                      onToggleSave={handleToggleSaveProperty}
                    />
                  ))}
                </div>

                {/* View More Button */}
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={() => navigateTo('properties')}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#171717] hover:bg-[#2A2A2A] text-white font-bold text-sm transition-all shadow-sm hover:shadow"
                  >
                    <span>Browse All Secondary Listings</span>
                    <ArrowRight className="w-4 h-4 text-[#CF9F5D]" />
                  </button>
                </div>
              </div>
            </section>

            {/* SECTION 07 — BLOG & SECONDARY MARKET INSIGHTS */}
            <BlogPreview
              onViewAllBlog={() => navigateTo('blog')}
              onSelectPost={handleSelectBlogPost}
            />
          </div>
        )}

        {/* PROPERTIES VIEW */}
        {currentView === 'properties' && (
          <PropertiesPage
            properties={properties}
            onSelectProperty={(prop) => setSelectedProperty(prop)}
            savedPropertyIds={savedPropertyIds}
            onToggleSaveProperty={handleToggleSaveProperty}
            initialFilters={searchFilters}
          />
        )}

        {/* AREAS VIEW */}
        {currentView === 'areas' && (
          <AreasPage
            onSelectArea={handleSelectArea}
          />
        )}

        {/* BLOG VIEW */}
        {currentView === 'blog' && (
          <BlogView
            onNavigateToProperties={() => navigateTo('properties')}
            onOpenListProperty={() => handleOpenListProperty('buy')}
            initialPost={selectedBlogPost}
          />
        )}

        {/* ABOUT VIEW */}
        {currentView === 'about' && (
          <AboutView
            onNavigateToProperties={() => navigateTo('properties')}
            onOpenListProperty={() => handleOpenListProperty('buy')}
          />
        )}

        {/* CONTACT VIEW */}
        {currentView === 'contact' && <ContactView />}

        {/* PRIVACY POLICY VIEW */}
        {currentView === 'privacy' && (
          <PrivacyPolicyView onBackToHome={() => navigateTo('home')} />
        )}

        {/* TERMS OF SERVICE VIEW */}
        {currentView === 'terms' && (
          <TermsOfServiceView
            onBackToHome={() => navigateTo('home')}
            onNavigateToProperties={() => navigateTo('properties')}
          />
        )}
      </main>

      {/* Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        isSaved={selectedProperty ? savedPropertyIds.includes(selectedProperty.id) : false}
        onToggleSave={handleToggleSaveProperty}
      />

      {/* List Your Property Modal */}
      <ListPropertyModal
        isOpen={isListPropertyOpen}
        onClose={() => setIsListPropertyOpen(false)}
        defaultPurpose={listPropertyPurpose}
      />

      {/* Saved Properties Shortlist Modal */}
      <SavedPropertiesModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedProperties={savedPropertiesList}
        onSelectProperty={(prop) => setSelectedProperty(prop)}
        onRemoveSaved={(id) => setSavedPropertyIds((prev) => prev.filter((item) => item !== id))}
      />

      {/* Footer */}
      <Footer
        onNavigate={navigateTo}
        onOpenListProperty={handleOpenListProperty}
      />
    </div>
  );
}
