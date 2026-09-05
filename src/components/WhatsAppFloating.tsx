import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';
import { getWhatsAppUrl } from '../config/whatsapp';

export function WhatsAppFloating() {
  const { language } = useLanguage();
  const { isAdmin } = useAdmin();

  const msg =
    language === 'es'
      ? '¡Hola equipo ACA Travel! Quisiera solicitar información sobre sus paquetes y asesoría de visa.'
      : 'Hello ACA Travel! I would like to request information about your packages and visa services.';
  const whatsappUrl = getWhatsAppUrl(msg);

  return (
    <div className={`fixed ${isAdmin ? 'bottom-20 sm:bottom-6' : 'bottom-4 sm:bottom-6'} right-4 sm:right-6 z-40 transition-all duration-300`}>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
        aria-label="WhatsApp"
        title="WhatsApp ACA Travel"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
      </a>
    </div>
  );
}
