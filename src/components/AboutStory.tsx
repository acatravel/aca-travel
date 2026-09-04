import { useRef } from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';

export function AboutStory() {
  const { language } = useLanguage();
  const { setIsPackagesModalOpen } = useAdmin();
  const clickTimestampsRef = useRef<number[]>([]);

  const handleGorritoClick = () => {
    const now = Date.now();
    const recent = clickTimestampsRef.current.filter((t) => now - t < 1500);
    recent.push(now);
    clickTimestampsRef.current = recent;

    if (recent.length >= 3) {
      clickTimestampsRef.current = [];
      setIsPackagesModalOpen(true);
    }
  };

  return (
    <section id="sobre-nosotros" className="py-10 sm:py-14 lg:py-16 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Editorial Header with High Contrast */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-12 reveal-on-scroll">
          <span className="section-badge-luxury">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'es' ? 'SOBRE NOSOTROS' : 'ABOUT US'}</span>
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md">
            {language === 'es' ? 'Conectando al mundo con experiencias inolvidables' : 'Connecting the world with unforgettable journeys'}
          </h2>
          <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed drop-shadow-sm">
            {language === 'es'
              ? 'En ACA Travel nacimos con una convicción clara: viajar debe ser una experiencia enriquecedora, sin complicaciones burocráticas y con la tranquilidad que solo los verdaderos profesionales pueden ofrecer.'
              : 'At ACA Travel we were founded on a clear belief: traveling should be an enriching adventure, free from bureaucratic stress, backed by genuine hospitality and expertise.'}
          </p>
        </div>

        {/* 2 Column Editorial Layout with Glassmorphism */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* Left Column: Visual Image */}
          <div className="lg:col-span-6 relative reveal-on-scroll">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/30 bg-slate-900">
              <video
                src="/aca.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-[360px] sm:h-[440px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 p-5 sm:p-6 rounded-2xl glass-card-luxury text-slate-900">
                <p className="font-display text-base font-black text-slate-900">
                  ACA Travel Global
                </p>
                <p className="text-xs text-slate-600 mt-1.5 font-normal leading-relaxed">
                  {language === 'es'
                    ? 'Agencia de viajes internacional especializada en paquetes completos, cruceros y asesoría consular para Visa Schengen.'
                    : 'International travel agency specializing in luxury getaways, cruises, and European visa assistance.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Values & Editorial Pillars */}
          <div className="lg:col-span-6 space-y-6 reveal-on-scroll reveal-delay-1">
            <div className="glass-card-luxury p-8 sm:p-10 rounded-3xl space-y-6">
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                <div className="flex justify-center">
                  <img
                    src="/logo.png"
                    alt="ACA Travel"
                    onClick={handleGorritoClick}
                    draggable={false}
                    className="max-h-8 sm:max-h-9 rounded-full select-none cursor-default"
                  />
                </div>
                <p>
                  {language === 'es'
                    ? 'Mi amor por los viajes comenzó en la infancia, entre celebraciones familiares, la riqueza de nuestra gastronomía y la emoción de explorar cada rincón de nuestra isla caribeña.Esa curiosidad sin límites me llevó a cruzar fronteras y descubrir destinos más allá del Caribe. ACA Travel nace del deseo de compartir esa misma emoción.'
                    : 'Ever since I was a child, my favorite times of the year have always been the holidays—partly for the shared food, but mostly for the memories made together. I fondly remember those family trips exploring the breathtaking landscapes of our Caribbean island. While I still marvel at its beauty, my passion drove me to expand my horizons beyond our shores.'}
                </p>
                <p>
                  {language === 'es'
                    ? 'ACA Travel nace del deseo de compartir esa misma emoción. Nos dedicamos a conectar vidas, diseñar experiencias inolvidables y hacer que cada viaje sea un recuerdo único para siempre.'
                    : 'ACA Travel was born from those pure emotions: feelings that connect lives, create unforgettable experiences, and turn trips into unique moments. I want to invite you to discover the beauty of the world with us.'}
                </p>
              </div>

              {/* Checkpoints */}
              <div className="space-y-3 pt-2">
                {[
                  language === 'es' ? '👨‍👩‍👧‍👦Paquetes personalizables aptos para todo publico' : '👨‍👩‍👧‍👦 Customizable packages suitable for everyone',
                  language === 'es' ? '📍🗺️ Itinerarios de viaje diseñados a la medida' : '📍🗺️ Tailor-made travel itineraries',
                  language === 'es' ? '👨‍🏫 Guia de principio a fin durante todo el proceso' : '👨‍🏫 Step-by-step guidance throughout the entire process',
                  language === 'es' ? '🔥Experiencia inigualable,calidad precio' : '🔥 Unmatched experience, best value for money',
                ].map((text, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-terracotta-600 flex-shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
