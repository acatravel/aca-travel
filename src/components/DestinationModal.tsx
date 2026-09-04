import { useState } from 'react';
import type { Destination } from '../types';
import { X, Check, Plane, Clock, ShieldCheck, MessageCircle, Calendar, ChevronLeft, ChevronRight, Building2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface DestinationModalProps {
  destination: Destination | null;
  onClose: () => void;
}

export function DestinationModal({ destination, onClose }: DestinationModalProps) {
  const { language } = useLanguage();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);

  if (!destination) return null;

  const imagesList =
    destination.images && destination.images.length > 0
      ? destination.images
      : [destination.image];

  const currentPhoto = imagesList[selectedPhotoIndex] || destination.image;

  const displayPrice = destination.isResort && destination.pricePerNight
    ? destination.pricePerNight
    : destination.priceEstimate;

  const whatsappModalMessage = encodeURIComponent(
    language === 'es'
      ? `¡Hola equipo ACA Travel! Quiero apartar mi lugar para ${destination.isResort ? 'el resort' : 'el paquete'} "${destination.title}" (${destination.duration} - ${displayPrice}). ¿Cuáles son las próximas fechas de salida y los pasos para el abono inicial?`
      : `Hello ACA Travel! I would like to book my place for "${destination.titleEn || destination.title}" (${destination.durationEn || destination.duration} - ${displayPrice}). What are the upcoming departure dates and booking steps?`
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappModalMessage}`;

  const title = language === 'en' && destination.titleEn ? destination.titleEn : destination.title;
  const duration = language === 'en' && destination.durationEn ? destination.durationEn : destination.duration;
  const tagline = language === 'en' && destination.taglineEn ? destination.taglineEn : destination.tagline;
  const departure = language === 'en' && destination.departureEn ? destination.departureEn : destination.departure;
  const description = language === 'en' && destination.descriptionEn ? destination.descriptionEn : destination.description;
  const visaReq = language === 'en' && destination.visaRequirementEn ? destination.visaRequirementEn : destination.visaRequirement;
  const highlights = language === 'en' && destination.highlightsEn ? destination.highlightsEn : destination.highlights;
  const includes = language === 'en' && destination.includesEn ? destination.includesEn : destination.includes;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeInScale">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-colors cursor-pointer shadow-md"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Hero Image with Gallery Controls */}
        <div className="relative h-72 sm:h-84 w-full overflow-hidden bg-slate-900">
          <img
            key={currentPhoto}
            src={currentPhoto}
            alt={title}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Badges */}
          <div className="absolute top-5 left-5 flex flex-wrap gap-2 z-10">
            {destination.badge && (
              <span className="px-3 py-1 rounded-lg bg-brandOrange-500 text-white text-xs font-black uppercase tracking-wider shadow-md">
                {language === 'en' && destination.badgeEn ? destination.badgeEn : destination.badge}
              </span>
            )}
            {destination.isResort && (
              <span className="px-3 py-1 rounded-lg bg-cyan-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> Resort
              </span>
            )}
            <span className="px-3 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brandOrange-400" />
              <span>{duration}</span>
            </span>
          </div>

          {/* Gallery navigation buttons if multiple images */}
          {imagesList.length > 1 && (
            <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
              <button
                type="button"
                onClick={() =>
                  setSelectedPhotoIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length)
                }
                className="pointer-events-auto p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-all cursor-pointer shadow-md"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setSelectedPhotoIndex((prev) => (prev + 1) % imagesList.length)
                }
                className="pointer-events-auto p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-all cursor-pointer shadow-md"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Hero text */}
          <div className="absolute bottom-5 left-5 right-5 z-10">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-500 text-white shadow-xs">
                {visaReq}
              </span>
              {destination.roomType && (
                <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded bg-cyan-400 text-slate-950 shadow-xs">
                  {destination.roomType}
                </span>
              )}
            </div>

            <h2 className="font-display text-2xl sm:text-4xl font-black text-white leading-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 line-clamp-1">
              {tagline}
            </p>

            {/* Thumbnail switcher */}
            {imagesList.length > 1 && (
              <div className="flex items-center gap-2 pt-3 overflow-x-auto no-scrollbar">
                {imagesList.map((img, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`w-12 h-8 rounded-lg overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 ${
                      selectedPhotoIndex === idx ? 'border-amber-400 scale-105 shadow-md' : 'border-white/50 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[55vh] overflow-y-auto">
          
          {/* Departure & Price Strip */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800">
              <Plane className="w-4 h-4 text-brandBlue-600" />
              <span>{departure}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-bold">
                {language === 'es' ? 'Aparta desde:' : 'Reserve from:'}
              </span>
              <span className="font-display text-lg font-black text-emerald-600">
                {language === 'en' && destination.initialPaymentEn ? destination.initialPaymentEn : destination.initialPayment}
              </span>
            </div>
          </div>

          {/* Detailed Description */}
          <div>
            <h3 className="font-display text-base font-black text-slate-900 mb-2">
              {language === 'es' ? 'Descripción de la Experiencia' : 'Experience Overview'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {description}
            </p>
          </div>

          {/* Highlights & Inclusions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Highlights */}
            <div className="space-y-3">
              <h4 className="font-display text-sm font-black text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brandOrange-500" />
                <span>{language === 'es' ? 'Puntos Clave del Viaje' : 'Key Trip Highlights'}</span>
              </h4>
              <ul className="space-y-2">
                {highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Inclusions */}
            <div className="space-y-3">
              <h4 className="font-display text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>{language === 'es' ? 'El Paquete Completo Incluye' : 'The Complete Package Includes'}</span>
              </h4>
              <ul className="space-y-2">
                {includes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Day by Day Itinerary */}
          {destination.itinerarySummary && destination.itinerarySummary.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <h4 className="font-display text-sm font-black text-slate-900 flex items-center gap-1.5 mb-3">
                <Calendar className="w-4 h-4 text-brandBlue-600" />
                <span>{language === 'es' ? 'Itinerario Resumido Día por Día' : 'Day-by-Day Itinerary Outline'}</span>
              </h4>
              <div className="space-y-2">
                {destination.itinerarySummary.map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <span className="text-xs font-black text-brandOrange-600 flex-shrink-0 px-2 py-0.5 bg-brandOrange-50 rounded-md">
                      {item.day}
                    </span>
                    <span className="text-xs text-slate-700 font-medium">
                      {item.activity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Action Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {destination.isResort
                ? (language === 'es' ? 'Tarifa por Habitación / Noche' : 'Rate per Room / Night')
                : (language === 'es' ? 'Tarifa Total por Pasajero' : 'Total Rate per Traveler')}
            </p>
            <p className="font-display text-3xl font-black text-slate-900">
              {displayPrice}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none py-3.5 px-5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-colors cursor-pointer"
            >
              {language === 'es' ? 'Cerrar' : 'Close'}
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-brandOrange-500 to-amber-500 hover:from-brandOrange-600 hover:to-amber-600 shadow-glow-orange hover:shadow-xl transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{language === 'es' ? 'Cotizar en WhatsApp' : 'Get WhatsApp Quote'}</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
