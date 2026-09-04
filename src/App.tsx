import { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { DestinationsProvider } from './context/DestinationsContext';
import { TestimonialsProvider } from './context/TestimonialsContext';
import { AdminProvider } from './context/AdminContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VisaConsulting } from './components/VisaConsulting';
import { TrustBar } from './components/TrustBar';
import { AboutStory } from './components/AboutStory';
import { DestinationGrid } from './components/DestinationGrid';
import { DestinationModal } from './components/DestinationModal';
import { ReviewsAndFeedback } from './components/ReviewsAndFeedback';
import { TripPlanner } from './components/TripPlanner';
import { WhatsAppFloating } from './components/WhatsAppFloating';
import { AdminFloatingBar } from './components/AdminFloatingBar';
import { AdminCommentsModal } from './components/AdminCommentsModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import Footer from './components/Footer';
import { HERO_SLIDES } from './data/heroSlides';
import type { Destination } from './types';

function MainApp() {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isPlannerOpen, setIsPlannerOpen] = useState<boolean>(false);

  // Precargar imágenes de fondo para evitar parpadeos/glitches
  useEffect(() => {
    HERO_SLIDES.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  // Efectos de scrolling: reveal-on-scroll al entrar al viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleSelectCategoryFromHero = (category: string) => {
    setSelectedCategory(category);
    const destinosEl = document.getElementById('destinos');
    if (destinosEl) {
      destinosEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-900 selection:bg-terracotta-500 selection:text-white relative overflow-x-hidden bg-[#111A14]">
      
      {/* 6 Rotating Background Layers (Smooth Crossfade & Ken Burns Zoom) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#111A14]">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === activeSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
                isActive ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}
              style={{
                backgroundImage: `url(${slide.image})`,
                transitionProperty: 'opacity, transform',
                transitionDuration: '1200ms, 8000ms',
              }}
            />
          );
        })}
        {/* Atmospheric vignette overlay designed for maximum readability across the entire page */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-950/75 to-slate-950/90" />
      </div>

      {/* Main Content wrapper with z-10 over background */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* 1. Top Navbar (Floating Dark Glass Pill) */}
        <Navbar onOpenPlanner={() => setIsPlannerOpen(true)} />

        {/* Main Content Sections */}
        <main className="flex-grow">
          {/* 2. Hero Section with 6 Synchronized Destination Slides */}
          <Hero 
            activeSlide={activeSlide}
            onSelectSlide={setActiveSlide}
            onOpenPlanner={() => setIsPlannerOpen(true)}
            onSelectCategory={handleSelectCategoryFromHero}
          />

          {/* Minimal Section Divider */}
          <div className="w-full h-px bg-white/5 my-1 sm:my-2 pointer-events-none" />

          {/* 3. Section: European / Schengen Visa Consulting (Pure Glassmorphism) */}
          <VisaConsulting />

          {/* Minimal Section Divider */}
          <div className="w-full h-px bg-white/5 my-1 sm:my-2 pointer-events-none" />

          {/* 4. Section: Curated Travel Packages (Pure Glassmorphism Cards) */}
          <DestinationGrid 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectDestination={(dest) => setSelectedDestination(dest)}
          />

          {/* Minimal Section Divider */}
          <div className="w-full h-px bg-white/5 my-1 sm:my-2 pointer-events-none" />

          {/* 5. Section: Why ACA Travel? (Core Values & Differentiation) */}
          <TrustBar />

          {/* Minimal Section Divider */}
          <div className="w-full h-px bg-white/5 my-1 sm:my-2 pointer-events-none" />

          {/* 6. Section: About ACA Travel (Editorial Brand Story) */}
          <AboutStory />

          {/* Minimal Section Divider */}
          <div className="w-full h-px bg-white/5 my-1 sm:my-2 pointer-events-none" />

          {/* 7. Section: Reviews and Feedback (2 Columns: Carousel + Interactive Form) */}
          <ReviewsAndFeedback />
        </main>

        {/* 8. Global Footer */}
        <Footer />

        {/* 9. Floating WhatsApp Widget */}
        <WhatsAppFloating />

        {/* 10. Destination Itinerary Modal */}
        <DestinationModal 
          destination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
        />

        {/* 11. Interactive Trip Planner Modal */}
        <TripPlanner 
          isOpen={isPlannerOpen}
          onClose={() => setIsPlannerOpen(false)}
        />

        {/* 12. Global Floating Admin Bar */}
        <AdminFloatingBar />

        {/* 13. Admin Comments Moderation Modal Window */}
        <AdminCommentsModal />

        {/* 14. Admin Packages & Categories Modal Window */}
        <AdminPanelModal />
      </div>
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <DestinationsProvider>
        <TestimonialsProvider>
          <AdminProvider>
            <MainApp />
          </AdminProvider>
        </TestimonialsProvider>
      </DestinationsProvider>
    </LanguageProvider>
  );
}

export default App;
