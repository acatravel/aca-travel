import { useState, useTransition } from 'react';
import type { Destination } from '../types';
import { MessageCircle, ArrowRight, Clock, Sparkles, ChevronLeft, ChevronRight, Edit3, Trash2, Building2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useDestinations } from '../context/DestinationsContext';
import { useAdmin } from '../context/AdminContext';
import { DestinationSkeleton } from './DestinationSkeleton';

interface DestinationGridProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectDestination: (dest: Destination) => void;
}

export function DestinationGrid({
  selectedCategory,
  onSelectCategory,
  onSelectDestination,
}: DestinationGridProps) {
  const { language } = useLanguage();
  const { destinations, categories, deleteDestination } = useDestinations();
  const { isAdmin, setIsPackagesModalOpen, setTargetEditingDestination } = useAdmin();
  const [isPending, startTransition] = useTransition();
  const [isSimulatedLoading, setIsSimulatedLoading] = useState(false);
  const [isSpinningGlobe, setIsSpinningGlobe] = useState(false);
  const [randomToast, setRandomToast] = useState<string | null>(null);

  // Cálculo matemático uniforme y simétrico para cualquier cantidad de categorías en el disco elíptico 3D
  const total = categories.length;
  const rx = total > 7 ? 38.5 : 37;
  const ry = total > 7 ? 43.5 : 42;

  // Estación 0 ("todos") siempre en la cúspide a -90° (12 en punto)
  // Las demás estaciones se distribuyen con ángulos equidistantes a lo largo del perímetro elíptico
  const orbitCategories = categories.map((cat, idx) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * idx) / total;
    const left = `${(50 + rx * Math.cos(angle)).toFixed(2)}%`;
    const top = `${(50 + ry * Math.sin(angle)).toFixed(2)}%`;
    return {
      ...cat,
      pos: { top, left },
    };
  });

  const handleCategoryClick = (catId: string) => {
    if (catId.toLowerCase() === selectedCategory.toLowerCase()) return;
    setIsSimulatedLoading(true);
    startTransition(() => {
      onSelectCategory(catId);
      setTimeout(() => setIsSimulatedLoading(false), 300);
    });
  };

  const handleNextCategory = () => {
    const currentIdx = categories.findIndex((c) => c.id.toLowerCase() === selectedCategory.toLowerCase());
    const nextIdx = (currentIdx + 1) % categories.length;
    handleCategoryClick(categories[nextIdx].id);
  };

  const handlePrevCategory = () => {
    const currentIdx = categories.findIndex((c) => c.id.toLowerCase() === selectedCategory.toLowerCase());
    const prevIdx = (currentIdx - 1 + categories.length) % categories.length;
    handleCategoryClick(categories[prevIdx].id);
  };

  // Giro dinámico del Globo Terráqueo y selección al azar
  const handleSpinRandomDestination = () => {
    if (isSpinningGlobe) return;
    setIsSpinningGlobe(true);
    setRandomToast(language === 'es' ? '¡Girando el globo...!' : 'Spinning the globe...!');

    const specificCats = categories.filter((c) => c.id !== 'todos').map((c) => c.id);
    const candidates = specificCats.filter((c) => c.toLowerCase() !== selectedCategory.toLowerCase());
    const chosenCat = candidates.length > 0
      ? candidates[Math.floor(Math.random() * candidates.length)]
      : specificCats[0] || 'todos';

    setTimeout(() => {
      handleCategoryClick(chosenCat);
      setIsSpinningGlobe(false);
      const chosenObj = categories.find((c) => c.id.toLowerCase() === chosenCat.toLowerCase());
      setRandomToast(
        language === 'es'
          ? `✨ ¡Destino elegido: ${chosenObj?.fullLabel || chosenCat}!`
          : `✨ Selected: ${chosenObj?.fullLabel || chosenCat}!`
      );
      setTimeout(() => setRandomToast(null), 3200);
    }, 1100);
  };

  const filtered = selectedCategory.toLowerCase() === 'todos'
    ? destinations
    : destinations.filter((d) => d.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="destinos" className="py-10 sm:py-14 lg:py-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6 mb-12 sm:mb-14 reveal-on-scroll">
          <div className="space-y-3">
            <span className="section-badge-luxury">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'es' ? 'COLECCIÓN EXCLUSIVA 2026' : 'EXCLUSIVE 2026 COLLECTION'}</span>
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md">
              {language === 'es' ? 'Paquetes de Viaje Seleccionados' : 'Curated Travel Packages'}
            </h2>
            <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed max-w-xl mx-auto drop-shadow-sm">
              {language === 'es'
                ? 'Experiencias de viaje completas con hoteles de calidad verificada y facilidades de pago.'
                : 'Complete luxury itineraries with verified hotels, seamless transfers, and flexible payment plans.'}
            </p>
          </div>

          {/* Interactive 3D Clear Glass Disc with Interactive Globe Core */}
          <div className="relative w-full max-w-[380px] h-[350px] sm:max-w-[480px] sm:h-[390px] flex items-center justify-center select-none pt-2 disc-3d-stage">

            {/* 3D Tilted Ring (Disco Inclinado en perspectiva 3D) */}
            <div className="absolute inset-0 flex items-center justify-center disc-3d-ring">
              {/* Outer Ring Body (Clear Transparent Glassmorphism) */}
              <div className="absolute inset-2 sm:inset-3 rounded-full disc-clear-glass pointer-events-none" />

              {/* Concentric Disc Grooves (Clear Glass subtle ripples) */}
              <div className="absolute inset-8 sm:inset-10 rounded-full border border-white/20 pointer-events-none" />
              <div className="absolute inset-16 sm:inset-18 rounded-full border border-white/10 pointer-events-none" />

              {/* Circular Stations around the 3D Disc (Posicionamiento dinámico uniforme) */}
              {orbitCategories.map((cat) => {
                const isActive = selectedCategory.toLowerCase() === cat.id.toLowerCase();
                const isDense = categories.length > 6;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    style={{
                      top: cat.pos.top,
                      left: cat.pos.left,
                    }}
                    className={`absolute disc-3d-station ${
                      isDense
                        ? 'px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs max-w-[120px] sm:max-w-[145px]'
                        : 'px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-[13px] max-w-[135px] sm:max-w-[160px]'
                    } rounded-full font-bold transition-all duration-300 cursor-pointer whitespace-nowrap z-20 flex items-center gap-1.5 truncate ${
                      isActive
                        ? 'bg-white text-slate-950 font-black shadow-[0_0_25px_rgba(255,255,255,0.8)] ring-2 ring-white scale-110'
                        : 'bg-slate-950/85 backdrop-blur-xl text-white hover:bg-white/20 hover:border-white/60 border border-white/35 shadow-xl'
                    }`}
                  >
                    <span className="text-sm flex-shrink-0">{cat.emoji}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Left/Right Rotary Flank Arrows in Clear Glass */}
            <button
              onClick={handlePrevCategory}
              className="absolute -left-1 sm:-left-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-xl border border-white/35 text-white flex items-center justify-center shadow-xl transition-all cursor-pointer z-30 active:scale-95"
              aria-label="Destino anterior"
              title="Anterior"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={handleNextCategory}
              className="absolute -right-1 sm:-right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-xl border border-white/35 text-white flex items-center justify-center shadow-xl transition-all cursor-pointer z-30 active:scale-95"
              aria-label="Siguiente destino"
              title="Siguiente"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Central Elevated Interactive Globe: Click to Spin & Choose Random Destination */}
            <div className="relative z-30 flex flex-col items-center justify-center pointer-events-auto">
              <button
                type="button"
                onClick={handleSpinRandomDestination}
                disabled={isSpinningGlobe}
                className="group relative cursor-pointer focus:outline-none flex flex-col items-center"
                aria-label="Elegir destino al azar"
                title={language === 'es' ? '¡Haz clic en el globo para elegir un destino al azar!' : 'Click the globe to pick a random destination!'}
              >
                {/* Atmospheric Glow */}
                <div className={`absolute -inset-2 rounded-full blur-md transition-all duration-500 pointer-events-none ${isSpinningGlobe ? 'bg-amber-400/45 scale-125 animate-pulse' : 'bg-sky-400/25 group-hover:bg-sky-400/45'
                  }`} />

                {/* 3D Realistic Globe Sphere */}
                <div className={`w-20 h-20 sm:w-22 sm:h-22 rounded-full globe-sphere relative flex items-center justify-center transition-transform duration-300 shadow-2xl ${isSpinningGlobe ? 'globe-spinning-fast scale-110 shadow-[0_0_35px_rgba(251,191,36,0.6)]' : 'globe-spinning-slow group-hover:scale-105'
                  }`}>
                  {/* Floating sparkles when spinning */}
                  {isSpinningGlobe && (
                    <Sparkles className="w-8 h-8 text-amber-300 animate-spin absolute" />
                  )}
                </div>

                {/* Mini Call-to-action Pill below the globe */}
                <div className="mt-2 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/35 text-[10px] sm:text-[11px] font-bold text-white group-hover:border-amber-300/80 shadow-xl flex items-center gap-1.5 transition-all">
                  <span>🎲</span>
                  <span>{language === 'es' ? 'Destino al Azar' : 'Random Pick'}</span>
                </div>
              </button>

              {/* Floating Toast Notification when spinning */}
              {randomToast && (
                <div className="absolute -bottom-8 whitespace-nowrap px-3.5 py-1 rounded-full bg-slate-950/95 border border-amber-400/70 text-amber-300 text-[11px] font-black shadow-2xl animate-fadeInScale z-40">
                  {randomToast}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Dynamic Grid of Clean Glassmorphism Cards with Loading Effect */}
        {isSimulatedLoading || isPending ? (
          <DestinationSkeleton />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 px-6 glass-card-luxury rounded-3xl max-w-lg mx-auto space-y-4 animate-fadeInScale">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center text-3xl shadow-inner">
              ✈️
            </div>
            <h3 className="font-display font-black text-xl text-slate-900">
              {language === 'es' ? 'Próximamente más paquetes para este destino' : 'More packages coming soon for this destination'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              {language === 'es'
                ? 'Estamos diseñando itinerarios exclusivos para esta categoría. Si deseas una cotización personalizada o viaje a la medida, contáctanos directamente.'
                : 'We are designing exclusive itineraries for this category. Contact us for custom quotes.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => handleCategoryClick('todos')}
                className="px-6 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                {language === 'es' ? 'Ver Todos los Paquetes Disponibles' : 'View All Available Packages'}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filtered.map((destination) => {
              const title = language === 'en' && destination.titleEn ? destination.titleEn : destination.title;
              const duration = language === 'en' && destination.durationEn ? destination.durationEn : destination.duration;
              const price = language === 'en' && destination.priceEstimateEn ? destination.priceEstimateEn : destination.priceEstimate;
              const initialPay = language === 'en' && destination.initialPaymentEn ? destination.initialPaymentEn : destination.initialPayment;

              const whatsappMessage = encodeURIComponent(
                language === 'es'
                  ? `¡Hola equipo ACA Travel! Me interesa el paquete de "${title}" (${duration} - ${price}). ¿Cuáles son las fechas disponibles y los pasos para el abono inicial?`
                  : `Hello ACA Travel! I am interested in "${title}" (${duration} - ${price}). What are the available dates and initial payment steps?`
              );
              const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`;

              return (
                <div
                  key={destination.id}
                  className="group glass-card-luxury rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:-translate-y-2 animate-fadeInScale"
                >
                  {/* Photo Container */}
                  <div className="relative h-60 w-full overflow-hidden bg-slate-900">
                    <img
                      src={destination.image}
                      alt={title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Admin Quick Controls */}
                    {isAdmin && (
                      <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-400/50 shadow-lg">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTargetEditingDestination(destination);
                            setIsPackagesModalOpen(true);
                          }}
                          className="text-[10px] font-bold text-amber-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                          title="Editar este paquete"
                        >
                          <Edit3 className="w-3 h-3 text-amber-400" />
                          <span>Editar</span>
                        </button>
                        <span className="text-slate-600">|</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`¿Eliminar paquete "${destination.title}"?`)) {
                              deleteDestination(destination.id);
                            }
                          }}
                          className="text-[10px] font-bold text-rose-400 hover:text-rose-200 flex items-center gap-1 cursor-pointer transition-colors"
                          title="Eliminar este paquete"
                        >
                          <Trash2 className="w-3 h-3 text-rose-400" />
                        </button>
                      </div>
                    )}

                    {/* Duration or Resort Badge */}
                    <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
                      {destination.isResort && (
                        <span className="px-2.5 py-1 rounded-full bg-cyan-500/90 backdrop-blur-md text-[10px] font-black text-slate-950 flex items-center gap-1 shadow-md">
                          <Building2 className="w-3 h-3" /> Resort
                        </span>
                      )}
                      <div className="px-3 py-1 rounded-full bg-slate-950/75 backdrop-blur-md text-[11px] font-bold text-white flex items-center gap-1 shadow-md border border-white/10">
                        <Clock className="w-3 h-3 text-amber-300" />
                        <span>{duration}</span>
                      </div>
                    </div>

                    {/* Visa / Flexibility Tag */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                      <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-950/85 text-white backdrop-blur-md shadow-md border border-white/10 truncate">
                        {language === 'en' && destination.visaRequirementEn ? destination.visaRequirementEn : destination.visaRequirement}
                      </span>
                      {destination.roomType && (
                        <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-lg bg-cyan-950/85 text-cyan-200 backdrop-blur-md shadow-md border border-cyan-400/20 truncate">
                          {destination.roomType}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content with Clean Typography & High Contrast */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-display text-xl font-black text-slate-900 tracking-tight leading-snug group-hover:text-terracotta-600 transition-colors">
                        {title}
                      </h3>
                      <p className="text-xs text-slate-600 font-normal leading-relaxed mt-2 line-clamp-2">
                        {language === 'en' && destination.descriptionEn ? destination.descriptionEn : destination.description}
                      </p>
                    </div>

                    {/* Price Block and Actions */}
                    <div className="pt-4 border-t border-slate-200/80 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-widest">
                            {destination.isResort
                              ? (language === 'es' ? 'PRECIO POR HABITACIÓN / NOCHE' : 'PRICE PER ROOM / NIGHT')
                              : (language === 'es' ? 'PRECIO POR PERSONA' : 'PRICE PER PERSON')}
                          </span>
                          <span className="font-display text-2xl font-black text-slate-900">
                            {destination.isResort && destination.pricePerNight ? destination.pricePerNight : price}
                          </span>
                        </div>

                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          {initialPay}
                        </span>
                      </div>

                      {/* Buttons: Clean Dark pill Cotizar + subtle Itinerario */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => onSelectDestination(destination)}
                          className="flex-1 py-2.5 px-3 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>{language === 'es' ? 'Itinerario' : 'Itinerary'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full text-xs font-black text-white bg-slate-950 hover:bg-slate-850 shadow-md transition-all"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{language === 'es' ? 'Cotizar' : 'Quote'}</span>
                        </a>
                      </div>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
