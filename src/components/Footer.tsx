import { Music2, MessageCircle, ShieldCheck } from 'lucide-react';
import { InstagramIcon } from './Icons';
import { useLanguage } from '../context/LanguageContext';
import { getWhatsAppUrl } from '../config/whatsapp';

export function Footer() {
  const { language } = useLanguage();

  const msg =
    language === 'es'
      ? '¡Hola equipo ACA Travel! Quisiera solicitar información sobre sus paquetes y viajes.'
      : 'Hello ACA Travel team! I would like to inquire about your travel packages.';
  const whatsappUrl = getWhatsAppUrl(msg);

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-12 sm:pt-16 pb-32 sm:pb-14 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-slate-800/80">

          {/* Brand */}
          <div className="space-y-3.5 max-w-md">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-white p-1 border border-slate-700 shadow-sm flex items-center justify-center flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="ACA Travel"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-display text-lg font-black text-white tracking-tight flex items-center gap-1.5">
                  ACA TRAVEL
                </span>
                <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                  Un pasaporte, Múltiples destinos
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              {language === 'es'
                ? 'Experiencias de viaje exclusivas, paquetes completos con hoteles verificados y asesoría especializada para Visa Europea / Schengen.'
                : 'Bespoke travel experiences, complete packages with verified stays, and expert European / Schengen visa guidance.'}
            </p>
          </div>

          {/* Official Channels */}
          <div className="flex flex-col space-y-3">
            <h4 className="font-display text-xs font-black text-white uppercase tracking-wider">
              {language === 'es' ? 'Canales Oficiales' : 'Official Channels'}
            </h4>

            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/axeldavidtravel/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-700/60 shadow-sm hover:scale-105 active:scale-95"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-5 h-5 text-pink-400" />
              </a>

              <a
                href="https://www.tiktok.com/@aca.travel3"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-700/60 shadow-sm hover:scale-105 active:scale-95"
                aria-label="TikTok"
              >
                <Music2 className="w-5 h-5 text-cyan-400" />
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-700/60 shadow-sm hover:scale-105 active:scale-95"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-slate-400 text-[11px]">
          <p>© {new Date().getFullYear()} ACA Travel. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}</p>
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{language === 'es' ? 'Garantía y Reservas Oficiales' : 'Official Travel Assurance'}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
