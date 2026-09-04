import { ShieldCheck, HeartHandshake, CreditCard, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function TrustBar() {
  const { language } = useLanguage();

  const values = [
    {
      icon: ShieldCheck,
      title: language === 'es' ? 'Transparencia Total' : 'Total Transparency',
      desc: language === 'es' ? 'Precios cerrados desde el primer contacto. Sin cargos ocultos, sin letras pequeñas ni sorpresas.' : 'Fixed and clear rates from day one. No hidden fees or unpleasant surprises.',
    },
    {
      icon: HeartHandshake,
      title: language === 'es' ? 'Atención Personalizada 24/7' : '24/7 Personal Care',
      desc: language === 'es' ? 'Un asesor asignado te acompaña antes, durante y después de tu vuelo para resolver cualquier detalle.' : 'A dedicated specialist is available around the clock before, during, and after your trip.',
    },
    {
      icon: CreditCard,
      title: language === 'es' ? 'Planes de Pago Flexibles' : 'Flexible Payment Plans',
      desc: language === 'es' ? 'Aparta tu viaje con un abono inicial accesible y salda el resto en cómodas cuotas sin intereses.' : 'Reserve your vacation with a modest deposit and spread the rest into interest-free installments.',
    },
    {
      icon: Sparkles,
      title: language === 'es' ? 'Hoteles Verificados' : 'Verified Luxury Stays',
      desc: language === 'es' ? 'Alianzas directas con cadenas 4 y 5 estrellas en ubicaciones privilegiadas y seguras.' : 'Direct partnerships with inspected 4 and 5-star hotels in prime, secure destinations.',
    },
  ];

  return (
    <section id="por-que-aca" className="py-10 sm:py-14 lg:py-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Clean Centered Header with High Contrast */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-8 sm:mb-12 reveal-on-scroll">
          <span className="section-badge-luxury">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'es' ? 'VALORES FUNDAMENTALES' : 'CORE VALUES'}</span>
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md">
            {language === 'es' ? 'Por qué elegir ACA Travel' : 'Why Choose ACA Travel'}
          </h2>
          <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed drop-shadow-sm">
            {language === 'es'
              ? 'Combinamos experiencia turística, convenios internacionales y honestidad para que tu única preocupación sea disfrutar.'
              : 'We combine tourism expertise, international partnerships, and honesty so your only focus is relaxation.'}
          </p>
        </div>

        {/* 4 Glassmorphism Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className={`glass-card-luxury p-7 sm:p-8 rounded-3xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-2 reveal-on-scroll ${
                  i === 1 ? 'reveal-delay-1' : i === 2 ? 'reveal-delay-2' : i === 3 ? 'reveal-delay-3' : ''
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-terracotta-600 flex items-center justify-center mb-6 shadow-sm border border-slate-200/60">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg font-black text-slate-900 mb-2">
                    {v.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {v.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
