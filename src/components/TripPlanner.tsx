import { useState } from 'react';
import { X, Send, Compass, Users, Calendar, Coins, Plane, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TripPlannerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TripPlanner({ isOpen, onClose }: TripPlannerProps) {
  const { language } = useLanguage();
  const [destination, setDestination] = useState('Colombia (Medellín & Cartagena)');
  const [departure, setDeparture] = useState('Salida Internacional Flexible');
  const [travelers, setTravelers] = useState('En Pareja');
  const [timeline, setTimeline] = useState('En 2 a 3 meses');
  const [paymentPlan, setPaymentPlan] = useState('Quiero pagar en cuotas mensuales');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSendToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const message = encodeURIComponent(
      `¡Hola equipo ACA Travel! Acabo de armar mi cotización de viaje en su web:\n\n` +
      `📍 *Destino deseado:* ${destination}\n` +
      `✈️ *Salida / Ciudad origen:* ${departure}\n` +
      `👥 *Viajamos:* ${travelers}\n` +
      `📅 *Fecha aproximada:* ${timeline}\n` +
      `💳 *Preferencia de pago:* ${paymentPlan}\n` +
      (notes ? `📝 *Detalles/Deseos:* ${notes}\n\n` : '\n') +
      `¿Me pueden enviar disponibilidad de vuelos y cotización detallada? ¡Muchas gracias!`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeInScale">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors shadow-sm cursor-pointer"
          aria-label="Cerrar planificador"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-darkNavy-950 text-white border-b border-slate-700">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brandOrange-500/20 border border-brandOrange-500/30 text-xs font-bold text-brandOrange-400 mb-2">
            <Zap className="w-3.5 h-3.5" />
            {language === 'es' ? 'Cotizador Rápido en 60 Segundos' : 'Fast 60-Second Trip Quote'}
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-black text-white">
            {language === 'es' ? 'Diseñemos tu Viaje Soñado con ACA Travel' : 'Design Your Dream Journey with ACA Travel'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-normal">
            {language === 'es'
              ? 'Responde estas preguntas y un asesor de ACA Travel te enviará una propuesta a la medida con vuelos, hoteles y facilidades de pago.'
              : 'Answer these questions and an ACA Travel specialist will send a custom proposal with flights, hotels, and payment plans.'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSendToWhatsApp} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Field 1: Destination */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-brandOrange-500" />
                <span>{language === 'es' ? '1. ¿Qué destino quieres visitar?' : '1. Where do you want to travel?'}</span>
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brandOrange-500"
              >
                <option value="Colombia (Medellín & Cartagena)">🇨🇴 Colombia (Medellín & Cartagena)</option>
                <option value="Cancún & Riviera Maya All-Inclusive">🇲🇽 Cancún All-Inclusive</option>
                <option value="Orlando & Mundo Mágico">🏰 Orlando & Mundo Mágico</option>
                <option value="Crucero por el Caribe Sur (Sin Visa)">🚢 Crucero Caribe Sur (Sin Visa USA)</option>
                <option value="Europa Soñada (Madrid, Roma & París)">🇪🇺 Europa Soñada (Madrid, Roma & París)</option>
                <option value="Samaná VIP (Caribe & Ballenas)">🌴 Samaná VIP & Cayo Levantado</option>
                <option value="Otro Destino Personalizado">✨ Otro Destino en Mente</option>
              </select>
            </div>

            {/* Field 2: Departure City */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Plane className="w-4 h-4 text-brandBlue-600" />
                <span>{language === 'es' ? '2. ¿Desde qué ciudad sales?' : '2. Departure City / Airport:'}</span>
              </label>
              <input
                type="text"
                required
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                placeholder="Ej. Santo Domingo, Miami, Bogotá, Madrid..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brandOrange-500"
              />
            </div>

            {/* Field 3: Travelers */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>{language === 'es' ? '3. ¿Quiénes viajan?' : '3. Who is traveling?'}</span>
              </label>
              <select
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brandOrange-500"
              >
                <option value="En Pareja">En Pareja</option>
                <option value="Viajero Solo">Solo / Mochilero VIP</option>
                <option value="Familia con Niños">Familia con Niños</option>
                <option value="Grupo de Amigos (4+)">Grupo de Amigos (4+)</option>
                <option value="Corporativo / Empresa">Viaje de Negocios / Empresa</option>
              </select>
            </div>

            {/* Field 4: Timeline */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>{language === 'es' ? '4. ¿Cuándo planeas viajar?' : '4. Estimated timeframe:'}</span>
              </label>
              <select
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brandOrange-500"
              >
                <option value="Próximos 30 días">Próximos 30 días</option>
                <option value="En 2 a 3 meses">En 2 a 3 meses</option>
                <option value="En 4 a 6 meses">En 4 a 6 meses</option>
                <option value="Fin de año / Vacaciones">Fin de Año / Festivos</option>
                <option value="Solo explorando opciones">Solo explorando opciones</option>
              </select>
            </div>

          </div>

          {/* Payment Preference */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>{language === 'es' ? '¿Cómo prefieres pagar tu viaje?' : 'Preferred payment option:'}</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Apartar con inicial y pagar en cuotas mensuales',
                'Pago completo en una sola exhibición',
              ].map((plan, idx) => (
                <label 
                  key={idx} 
                  className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    paymentPlan === plan ? 'border-brandOrange-500 bg-brandOrange-50 text-slate-900 font-bold' : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentPlan"
                    checked={paymentPlan === plan}
                    onChange={() => setPaymentPlan(plan)}
                    className="accent-brandOrange-500"
                  />
                  <span className="text-xs">{plan}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
              {language === 'es' ? 'Deseos especiales o notas adicionales (opcional):' : 'Special requests or notes (optional):'}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Aniversario, hotel con vista al mar, requerimos asistencia para visa..."
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brandOrange-500 resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-brandOrange-500 to-amber-500 hover:from-brandOrange-600 hover:to-amber-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow-orange hover:shadow-xl transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{language === 'es' ? 'Recibir Cotización por WhatsApp con ACA Travel' : 'Get Quote on WhatsApp with ACA Travel'}</span>
          </button>
        </form>

      </div>
    </div>
  );
}
