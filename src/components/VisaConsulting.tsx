import { useState } from 'react';
import { FileText, CheckCircle, ArrowRight, X, Send, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function VisaConsulting() {
  const { language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    nationality: '',
    destinations: 'España, Francia & Italia',
    phone: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const msg = encodeURIComponent(
      `¡Hola ACA Travel! Solicito Asesoría para Visa Europea / Schengen:\n\n` +
      `👤 *Nombre:* ${formData.fullName}\n` +
      `🌍 *Nacionalidad/Residencia:* ${formData.nationality}\n` +
      `📍 *Destinos europeos:* ${formData.destinations}\n` +
      `📱 *Teléfono:* ${formData.phone}\n\n` +
      `Deseo agendar la evaluación de mi perfil consular. ¡Gracias!`
    );

    setTimeout(() => {
      window.open(`https://wa.me/?text=${msg}`, '_blank');
      setIsModalOpen(false);
      setSubmitted(false);
    }, 1000);
  };

  return (
    <section id="visa-europea" className="py-10 sm:py-14 lg:py-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Two Spacious Clean Cards with Pure Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 items-stretch">

          {/* Card 1: Asesoría Visa Europea */}
          <div className="glass-card-luxury p-6 sm:p-10 rounded-3xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 reveal-on-scroll">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/80 border border-white/80 text-terracotta-600 flex items-center justify-center shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {language === 'es' ? 'Asesoría Visa Europea' : 'European Visa Consulting'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 font-normal leading-relaxed">
                {language === 'es'
                  ? 'Análisis minucioso de arraigo económico y laboral para presentar un expediente blindado ante el consulado. Incluimos póliza médica internacional obligatoria Schengen (€30,000) y reservas aéreas y hoteleras reales sin compras anticipadas.'
                  : 'Detailed review of economic ties and occupational profile to build an airtight consular dossier. Includes official Schengen travel insurance (€30,000) and verified reservations.'}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-300/40 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>98% {language === 'es' ? 'Tasa de Aprobación' : 'Approval Success Rate'}</span>
              </span>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-bold text-slate-900 hover:text-terracotta-600 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>{language === 'es' ? 'Solicitar Asesoría' : 'Request Advice'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Metodología Probada */}
          <div className="glass-card-luxury p-6 sm:p-10 rounded-3xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 reveal-on-scroll reveal-delay-1">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/80 border border-white/80 text-terracotta-600 flex items-center justify-center shadow-sm">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl font-black text-slate-900 tracking-tight">
                {language === 'es' ? 'Metodología Probada' : 'Proven Methodology'}
              </h3>
              <p className="text-sm text-slate-700 font-normal leading-relaxed">
                {language === 'es'
                  ? 'Organizamos cartas, estados bancarios, traducciones juradas, itinerario estructurado y simulacro de entrevista consular para que tú solo disfrutes con la máxima probabilidad de éxito.'
                  : 'We structure letters, financial statements, certified translations, itineraries, and mock consular interviews for a peaceful and successful experience.'}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-300/40 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{language === 'es' ? 'Acompañamiento 1 a 1' : '1-on-1 Dedicated Specialist'}</span>
              </span>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-bold text-slate-900 hover:text-terracotta-600 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>{language === 'es' ? 'Conocer Proceso' : 'Learn Process'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          {/* Card 3: Itinerarios de viajes */}
          <div className="glass-card-luxury p-6 sm:p-10 rounded-3xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 reveal-on-scroll reveal-delay-1">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/80 border border-white/80 text-terracotta-600 flex items-center justify-center shadow-sm">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl font-black text-slate-900 tracking-tight">
                {language === 'es' ? 'Itinerarios de Viaje' : 'Travel Itineraries'}
              </h3>
              <p className="text-sm text-slate-700 font-normal leading-relaxed">
                {language === 'es'
                  ? 'Diseñamos itinerarios turísticos a la medida, adaptados al propósito de tu viaje y totalmente válidos para tu trámite consular. Planificamos cada día con rutas reales y reservas confirmadas sin necesidad de compras anticipadas.'
                  : 'We design custom travel itineraries tailored to the purpose of your trip and fully valid for your consular application. We plan every day with real routes and confirmed reservations without the need for advance purchases.'}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-300/40 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className='max-w-10'>{language === 'es' ? 'Diseñado a la Medida' : 'Tailored Itineraries'}</span>
              </span>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-bold text-slate-900 hover:text-terracotta-600 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span className='max-w-10'>{language === 'es' ? 'Crear Itinerario' : 'Get Itinerary'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Glassmorphism Visa Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className="relative w-full max-w-lg glass-card-luxury rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-900 animate-fadeInScale my-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/60 hover:bg-white text-slate-600 transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-black uppercase tracking-wider text-terracotta-600 bg-white/80 px-2.5 py-1 rounded-full border border-white/60">
              {language === 'es' ? 'EVALUACIÓN CONFIDENCIAL' : 'CONFIDENTIAL ASSESSMENT'}
            </span>

            <h3 className="font-display text-2xl font-black text-slate-900 mt-2">
              {language === 'es' ? 'Solicitud de Asesoría Visa Europea' : 'European Visa Guidance Request'}
            </h3>
            <p className="text-xs text-slate-600 mt-1 mb-6">
              {language === 'es'
                ? 'Un especialista consular de ACA Travel evaluará tu perfil para garantizar la máxima probabilidad de aprobación.'
                : 'An ACA Travel consular specialist will evaluate your profile to ensure the highest approval probability.'}
            </p>

            {submitted ? (
              <div className="p-6 text-center space-y-2 bg-emerald-500/20 rounded-2xl border border-emerald-500/40">
                <CheckCircle className="w-10 h-10 text-emerald-700 mx-auto" />
                <h4 className="font-display text-base font-bold text-slate-900">
                  {language === 'es' ? '¡Conectando con tu Asesor!' : 'Connecting with your Advisor!'}
                </h4>
                <p className="text-xs text-slate-700">
                  {language === 'es' ? 'Redirigiendo a WhatsApp...' : 'Redirecting to WhatsApp...'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    {language === 'es' ? 'Nombre completo:' : 'Full name:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Ej. Carmen Ortiz"
                    className="w-full p-3 rounded-xl bg-white/80 border border-white/80 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-800 font-bold mb-1">
                      {language === 'es' ? 'Nacionalidad / Residencia:' : 'Nationality / Country:'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                      placeholder="Ej. Dominicana, Colombiana..."
                      className="w-full p-3 rounded-xl bg-white/80 border border-white/80 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1">
                      {language === 'es' ? 'WhatsApp de contacto:' : 'WhatsApp phone:'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (809) 000-0000"
                      className="w-full p-3 rounded-xl bg-white/80 border border-white/80 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    {language === 'es' ? 'Destinos que deseas visitar en Europa:' : 'European destinations:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.destinations}
                    onChange={(e) => setFormData({ ...formData, destinations: e.target.value })}
                    placeholder="Ej. España, Francia, Italia..."
                    className="w-full p-3 rounded-xl bg-white/80 border border-white/80 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{language === 'es' ? 'Enviar y Recibir Diagnóstico' : 'Send & Receive Assessment'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </section>
  );
}
