import { useState, useEffect } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { HERO_SLIDES } from '../data/heroSlides';

interface HeroProps {
  activeSlide: number;
  onSelectSlide: (index: number) => void;
  onOpenPlanner?: () => void;
  onSelectCategory: (cat: string) => void;
}

export function Hero({ activeSlide, onSelectSlide, onSelectCategory }: HeroProps) {
  const { language } = useLanguage();
  const [query, setQuery] = useState('');

  // Rotación automática de las fotos de fondo cada 5.5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      onSelectSlide((activeSlide + 1) % HERO_SLIDES.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [activeSlide, onSelectSlide]);

  const currentSlide = HERO_SLIDES[activeSlide] || HERO_SLIDES[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      onSelectCategory(currentSlide.category);
    } else {
      const lower = query.toLowerCase();
      if (lower.includes('colombia') || lower.includes('medellin') || lower.includes('cartagena')) {
        onSelectCategory('colombia');
      } else if (lower.includes('cancun') || lower.includes('mexico') || lower.includes('maya')) {
        onSelectCategory('mexico');
      } else if (lower.includes('crucero') || lower.includes('barco') || lower.includes('caribe')) {
        onSelectCategory('cruceros');
      } else if (lower.includes('europa') || lower.includes('madrid') || lower.includes('paris') || lower.includes('roma')) {
        onSelectCategory('europa');
      } else if (lower.includes('disney') || lower.includes('orlando') || lower.includes('magico')) {
        onSelectCategory('escapadas-rd');
      } else {
        onSelectCategory('todos');
      }
    }

    const target = document.getElementById('destinos');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const badgeText = language === 'es' ? currentSlide.badgeEs : currentSlide.badgeEn;
  const headlinePre = language === 'es' ? currentSlide.headlinePreEs : currentSlide.headlinePreEn;
  const keyword = language === 'es' ? currentSlide.keywordEs : currentSlide.keywordEn;
  const subtitle = language === 'es' ? currentSlide.subtitleEs : currentSlide.subtitleEn;

  return (
    <section
      id="inicio"
      className="relative min-h-[78vh] sm:min-h-[84vh] flex flex-col justify-center items-center pt-28 sm:pt-36 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 text-white overflow-hidden"
    >
      {/* Center Dynamic Content */}
      <div className="relative max-w-4xl mx-auto text-center space-y-5 my-auto z-10 reveal-on-scroll">

        {/* Subtle Pill Badge with Active Destination Tag */}
        <div
          key={`badge-${currentSlide.id}`}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/70 backdrop-blur-xl border border-white/25 text-xs font-semibold text-slate-100 shadow-xl transition-all duration-500 animate-fadeInScale"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span className="tracking-wide">{badgeText}</span>
        </div>

        {/* Large Editorial Headline (Animated per slide) */}
        <div key={`headline-${currentSlide.id}`} className="transition-all duration-700 animate-fadeInScale">
          <h1 className="font-display text-4xl sm:text-6xl lg:text-[70px] font-light tracking-tight leading-[1.12] text-white drop-shadow-md">
            {headlinePre}{' '}
            <span className="font-serif italic font-bold text-[#E7C69A] text-glow-warm block sm:inline sm:ml-2">
              {keyword}
            </span>
          </h1>
        </div>

        {/* Dynamic Subheading */}
        <div key={`subtitle-${currentSlide.id}`} className="transition-all duration-700 animate-fadeInScale">
          <p className="text-sm sm:text-lg text-slate-200/95 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-sm">
            {subtitle}
          </p>
        </div>

        {/* Single Minimal Pill Search Bar */}
        <div className="pt-2 max-w-lg mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="glass-pill-search rounded-full p-1.5 pl-5 flex items-center gap-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-white/90 shadow-2xl"
          >
            <Search className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={language === 'es' ? `Explorar ${currentSlide.shortName} o tu destino soñado...` : `Search for ${currentSlide.shortName} or your dream place...`}
              className="w-full bg-transparent text-slate-900 placeholder-slate-500 text-xs sm:text-sm font-medium focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-slate-950 hover:bg-slate-850 active:scale-95 transition-all shadow-md flex-shrink-0 cursor-pointer"
            >
              {language === 'es' ? 'Explorar' : 'Explore'}
            </button>
          </form>
        </div>
      </div>

    </section>
  );
}
