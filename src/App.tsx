import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SellRentCtaBanner } from './components/SellRentCtaBanner';
import { TrendingAreas } from './components/TrendingAreas';
import { NewSecondaryProjects } from './components/NewSecondaryProjects';
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

            {/* SECTION 04 — HOT LISTINGS OF THE WEEK CAROUSEL */}
            <NewSecondaryProjects
              onSelectProperty={(prop) => setSelectedProperty(prop)}
              onViewAllProperties={() => navigateTo('properties')}
            />

            {/* SECTION 05 — BLOG & SECONDARY MARKET INSIGHTS */}
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
