import React, { useState, useEffect, useMemo } from 'react';
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
import { Property, SearchFilterState, PropertyPurpose, Area, Agent } from './types';
import { properties as fallbackProperties, areas as fallbackAreas, agents as fallbackAgents } from './data/mockData';
import { BlogPost } from './data/blogData';
import {
  fetchLiveProperties,
  fetchPropertyById,
  fetchLiveAgents,
  fetchLiveAreas,
  computeDynamicAreas,
} from './services/propertyService';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [propertiesList, setPropertiesList] = useState<Property[]>([]);
  const [areasList, setAreasList] = useState<Area[]>(fallbackAreas);
  const [agentsList, setAgentsList] = useState<Agent[]>(fallbackAgents);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sqft_dxb_saved');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [searchFilters, setSearchFilters] = useState<Partial<SearchFilterState>>({
    purpose: 'buy',
  });

  const [isListPropertyOpen, setIsListPropertyOpen] = useState(false);
  const [listPropertyPurpose, setListPropertyPurpose] = useState<PropertyPurpose>('buy');
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  // Dynamically computed areas based on database properties & fetched communities
  const dynamicAreas = useMemo(() => {
    return computeDynamicAreas(propertiesList, areasList);
  }, [propertiesList, areasList]);

  // Fetch LIVE properties, areas, and agents from Baserow on initial mount
  useEffect(() => {
    let isMounted = true;

    // 1. Fetch live properties
    fetchLiveProperties()
      .then((res) => {
        if (isMounted && res.properties && res.properties.length > 0) {
          setPropertiesList(res.properties);
        }
      })
      .catch((err) => {
        console.warn('[App] Could not fetch live Baserow properties:', err);
      });

    // 2. Fetch live agents with exact database property counts
    fetchLiveAgents()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setAgentsList(data);
        }
      })
      .catch((err) => {
        console.warn('[App] Could not fetch live agents:', err);
      });

    // 3. Fetch live areas
    fetchLiveAreas()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setAreasList(data);
        }
      })
      .catch((err) => {
        console.warn('[App] Could not fetch live areas:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Support direct deep link to property by URL hash or search param
  useEffect(() => {
    const handleUrlCheck = () => {
      const hash = window.location.hash.replace('#', '');
      const params = new URLSearchParams(window.location.search);
      const propId = params.get('property') || (hash.startsWith('property-') ? hash.replace('property-', '') : null);

      if (propId) {
        const found = propertiesList.find((p) => p.id === propId || p.slug === propId);
        if (found) {
          setSelectedProperty(found);
        } else {
          fetchPropertyById(propId).then((p) => {
            if (p) setSelectedProperty(p);
          });
        }
      }
    };

    handleUrlCheck();
    window.addEventListener('hashchange', handleUrlCheck);
    return () => window.removeEventListener('hashchange', handleUrlCheck);
  }, [propertiesList]);

  useEffect(() => {
    try {
      localStorage.setItem('sqft_dxb_saved', JSON.stringify(savedPropertyIds));
    } catch {
      // Ignore storage errors
    }
  }, [savedPropertyIds]);

  const handleSelectProperty = (prop: Property) => {
    setSelectedProperty(prop);
    // Asynchronously retrieve full property record if updated
    if (prop.id) {
      fetchPropertyById(prop.id).then((fullProp) => {
        if (fullProp) {
          setSelectedProperty(fullProp);
        }
      });
    }
  };

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

  const handleAgentNavigateToProperties = (agentName?: string) => {
    if (agentName) {
      setSearchFilters({
        purpose: 'buy',
        searchQuery: agentName,
      });
    }
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

  const savedPropertiesList = propertiesList.filter((p) =>
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
              areas={dynamicAreas}
            />

            {/* SECTION 02 — SELL OR RENT YOUR PROPERTY CTA BANNER */}
            <SellRentCtaBanner
              onOpenListProperty={handleOpenListProperty}
            />

            {/* SECTION 03 — TRENDING AREAS IN DUBAI BENTO GRID */}
            <TrendingAreas
              onSelectArea={handleSelectArea}
              onViewAllAreas={() => navigateTo('areas')}
              areas={dynamicAreas}
            />

            {/* SECTION 04 — HOT LISTINGS OF THE WEEK CAROUSEL */}
            <NewSecondaryProjects
              properties={propertiesList}
              onSelectProperty={handleSelectProperty}
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
            properties={propertiesList}
            onSelectProperty={handleSelectProperty}
            savedPropertyIds={savedPropertyIds}
            onToggleSaveProperty={handleToggleSaveProperty}
            initialFilters={searchFilters}
            areas={dynamicAreas}
          />
        )}

        {/* AREAS VIEW */}
        {currentView === 'areas' && (
          <AreasPage
            onSelectArea={handleSelectArea}
            areas={dynamicAreas}
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
            onNavigateToProperties={handleAgentNavigateToProperties}
            onOpenListProperty={() => handleOpenListProperty('buy')}
            agents={agentsList}
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
        onSelectProperty={handleSelectProperty}
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
