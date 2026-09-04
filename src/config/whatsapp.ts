// Configuración global de WhatsApp para ACA Travel
// Puedes cambiar este número cuando desees y se actualizará en toda la plataforma.

export const WHATSAPP_CONFIG = {
  // Número internacional sin signos ni espacios (código de país + número)
  // Ej: República Dominicana es 1809XXXXXXX o 1829XXXXXXX
  phoneNumber: '18095550199',
  displayPhone: '+1 (809) 555-0199',
  defaultGreeting: '¡Hola equipo ACA Travel! Me gustaría recibir más información sobre sus servicios turísticos.',
};

/**
 * Genera el enlace oficial de WhatsApp con el número asignado y mensaje codificado.
 */
export function getWhatsAppUrl(message?: string, customPhone?: string): string {
  const phone = customPhone || WHATSAPP_CONFIG.phoneNumber;
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const msg = message ? encodeURIComponent(message) : encodeURIComponent(WHATSAPP_CONFIG.defaultGreeting);
  return `https://wa.me/${cleanPhone}?text=${msg}`;
}
