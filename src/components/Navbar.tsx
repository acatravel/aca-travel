import { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  onOpenPlanner: () => void;
}

export function Navbar({ onOpenPlanner }: NavbarProps) {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('inicio');

  useEffect(() => {
    const handleScroll = () => {
      // Orden exacto vertical en el DOM
      const sectionIds = ['inicio', 'visa-europea', 'destinos', 'sobre-nosotros'];
      
      // Si estamos casi al final de la página, activar la última sección
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 150) {
        setActiveSection('sobre-nosotros');
        return;
      }

      const offsetThreshold = window.innerHeight * 0.35;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offsetThreshold) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'inicio', label: t.nav.home },
    { id: 'visa-europea', label: language === 'es' ? 'Visas' : 'Visas' },
    { id: 'destinos', label: language === 'es' ? 'Paquetes' : 'Packages' },
    { id: 'sobre-nosotros', label: language === 'es' ? 'Nosotros' : 'About' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-3 sm:pt-4 px-3 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="mx-auto max-w-6xl">
        <div className="glass-pill-nav rounded-2xl sm:rounded-full px-4 sm:px-7 py-2.5 sm:py-3 flex items-center justify-between shadow-2xl transition-all duration-300">

          {/* Logo & Brand */}
          <a href="#inicio" className="flex items-center gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-white/95 p-1 border border-white/20 shadow-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <img
                src="/logo.png"
                alt="ACA Travel"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-base sm:text-lg font-black tracking-tight text-white">
                  ACA TRAVEL
                </span>
              </div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-200">

            {/* Language Switcher */}
            <div className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer border-r border-white/15 pr-5">
              <Globe className="w-3.5 h-3.5 text-terracotta-400" />
              <button
                onClick={() => setLanguage('es')}
                className={`transition-colors cursor-pointer ${language === 'es' ? 'text-white font-black' : 'text-slate-400 hover:text-white'}`}
              >
                ES
              </button>
              <span className="text-slate-500 text-[10px]">|</span>
              <button
                onClick={() => setLanguage('en')}
                className={`transition-colors cursor-pointer ${language === 'en' ? 'text-white font-black' : 'text-slate-400 hover:text-white'}`}
              >
                EN
              </button>
            </div>

            {/* Links with clean active indicator */}
            <nav className="flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    className={`relative py-1 transition-colors duration-200 ${isActive ? 'text-white font-bold' : 'text-slate-300 hover:text-white'
                      }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-terracotta-500 rounded-full" />
                    )}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Right Action CTA */}
          <div className="hidden md:flex items-center">
            <button
              onClick={onOpenPlanner}
              className="px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-terracotta-500 hover:bg-terracotta-600 active:scale-95 shadow-lg transition-all duration-200 cursor-pointer"
            >
              {language === 'es' ? 'Cotizar' : 'Get Quote'}
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="px-2 py-1 rounded-lg bg-white/10 text-white text-[11px] font-bold"
            >
              {language === 'es' ? 'EN' : 'ES'}
            </button>
            <button
              onClick={onOpenPlanner}
              className="px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase text-white bg-terracotta-500"
            >
              Cotizar
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-white focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 p-3 glass-pill-nav rounded-2xl shadow-2xl flex flex-col gap-1.5 text-xs font-semibold animate-fadeInScale border border-white/20">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2.5 px-3.5 rounded-xl transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-white/20 text-white font-bold border border-white/25 shadow-sm'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500 shadow-sm" />
                  )}
                </a>
              );
            })}
          </div>
        )}

      </div>
    </header>
  );
}

export default Navbar;
