import React, { useState, useEffect, useRef } from 'react';
import type { Testimonial, ReviewSubmission } from '../types';
import {
  Star,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Send,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Upload,
  Camera,
  Edit3,
  Trash2,
  X,
  UserRound,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTestimonials } from '../context/TestimonialsContext';
import { useAdmin } from '../context/AdminContext';

const QUICK_TAGS = [
  'Reserva con Cuotas',
  'Resort All-Inclusive',
  'Viaje Familiar',
  'Luna de Miel',
  'Crucero Caribe',
  'Asesoría Visa Exitosa',
  'Viaje en Grupo',
];

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';

export function ReviewsAndFeedback() {
  const { language } = useLanguage();
  const { testimonials, addTestimonial, deleteTestimonial } = useTestimonials();
  const { isAdmin, setIsCommentsModalOpen, setTargetEditingTestimonial } = useAdmin();

  // Filtrar testimonios visibles: solo aprobados si no es admin
  const visibleTestimonials = testimonials.filter((t) => {
    if (isAdmin) return true;
    return !t.status || t.status === 'approved';
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const [avatarLoaded, setAvatarLoaded] = useState(true);
  const [selectedVacationPhotoPreview, setSelectedVacationPhotoPreview] = useState<string | null>(null);

  // Precargar avatares en memoria
  useEffect(() => {
    visibleTestimonials.forEach((item) => {
      if (item.avatar) {
        const img = new Image();
        img.src = item.avatar;
      }
      if (item.vacationPhoto) {
        const img = new Image();
        img.src = item.vacationPhoto;
      }
    });
  }, [visibleTestimonials]);

  // Formulario Multi-Paso (Paso 1: Datos, Paso 2: Foto de Vacaciones, Paso 3: Reseña)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const [formData, setFormData] = useState<ReviewSubmission>({
    name: '',
    lastname: '',
    origin: '',
    destination: '',
    highlightTag: 'Reserva con Cuotas',
    quote: '',
    comment: '',
    rating: 5,
    avatar: DEFAULT_AVATAR,
    vacationPhoto: '',
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [customTagActive, setCustomTagActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const avatarFileInputRef = useRef<HTMLInputElement | null>(null);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const hasCustomAvatar = !!formData.avatar && formData.avatar !== DEFAULT_AVATAR;

  const safeIndex =
    visibleTestimonials.length > 0 ? Math.min(currentIndex, visibleTestimonials.length - 1) : 0;
  const current = visibleTestimonials[safeIndex];

  const goToSlide = (newIndex: number, direction: 'next' | 'prev') => {
    if (isTransitioning || newIndex === safeIndex || visibleTestimonials.length <= 1) return;
    setSlideDirection(direction);
    setIsTransitioning(true);
    setAvatarLoaded(false);

    setTimeout(() => {
      setCurrentIndex(newIndex);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 180);
  };

  const nextTestimonial = () => {
    if (visibleTestimonials.length <= 1) return;
    const nextIdx = (safeIndex + 1) % visibleTestimonials.length;
    goToSlide(nextIdx, 'next');
  };

  const prevTestimonial = () => {
    if (visibleTestimonials.length <= 1) return;
    const prevIdx = (safeIndex - 1 + visibleTestimonials.length) % visibleTestimonials.length;
    goToSlide(prevIdx, 'prev');
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance > 45) {
      nextTestimonial();
    } else if (distance < -45) {
      prevTestimonial();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Subida de la FOTO DE PERFIL del comentador (Paso 1)
  const handleAvatarPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setFormData((prev) => ({
        ...prev,
        avatar: base64,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatarPhoto = () => {
    setFormData((prev) => ({
      ...prev,
      avatar: DEFAULT_AVATAR,
    }));
    if (avatarFileInputRef.current) {
      avatarFileInputRef.current.value = '';
    }
  };

  // Subida de foto de vacaciones desde la PC (Paso 2) — independiente del avatar
  const handleVacationPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setFormData((prev) => ({
        ...prev,
        vacationPhoto: base64,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveVacationPhoto = () => {
    setFormData((prev) => ({
      ...prev,
      vacationPhoto: '',
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.destination.trim()) {
      alert('Por favor completa tu nombre y destino visitado.');
      return;
    }
    setCurrentStep(2);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.comment.trim()) {
      alert('Por favor escribe tu comentario o experiencia.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const fallbackQuote =
        formData.quote.trim() ||
        formData.comment.slice(0, 70) + (formData.comment.length > 70 ? '...' : '');

      const newReview: Testimonial = {
        id: `rev-${Date.now()}`,
        name: formData.name.trim(),
        lastname: formData.lastname.trim(),
        city: formData.origin.trim() || 'Viajero Internacional',
        destination: formData.destination.trim(),
        date: language === 'es' ? 'Reciente' : 'Recent',
        quote: fallbackQuote,
        story: formData.comment.trim(),
        avatar: formData.avatar || DEFAULT_AVATAR,
        vacationPhoto: formData.vacationPhoto || undefined,
        rating: formData.rating,
        highlightTag: formData.highlightTag || 'Viajero Verificado',
        status: 'approved', // Aprobado para visibilidad inmediata
        createdAt: Date.now(),
      };

      addTestimonial(newReview);
      setCurrentIndex(0);
      setIsSubmitting(false);
      setShowSuccessToast(true);
      setCurrentStep(1);

      setFormData({
        name: '',
        lastname: '',
        origin: '',
        destination: '',
        highlightTag: 'Reserva con Cuotas',
        quote: '',
        comment: '',
        rating: 5,
        avatar: DEFAULT_AVATAR,
        vacationPhoto: '',
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (avatarFileInputRef.current) {
        avatarFileInputRef.current.value = '';
      }

      setTimeout(() => setShowSuccessToast(false), 4000);
    }, 450);
  };

  return (
    <section id="resenas" className="py-10 sm:py-14 lg:py-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with High Contrast */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-8 sm:mb-12 reveal-on-scroll">
          <span className="section-badge-luxury">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'es' ? 'TESTIMONIOS REALES' : 'CLIENT REVIEWS'}</span>
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md">
            {language === 'es' ? 'Experiencias de Nuestros Viajeros' : 'Stories from Our Travelers'}
          </h2>
          <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed drop-shadow-sm">
            {language === 'es'
              ? 'Conoce las opiniones de quienes ya han confiado en nosotros y comparte tu valoración.'
              : 'Read verified experiences from travelers who trusted ACA Travel and share your own feedback.'}
          </p>
        </div>

        {/* 2 Column Glassmorphism Grid - Both cards share identical height */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch reveal-on-scroll">
          {/* Column 1: Carousel Card (7 cols) */}
          <div className="lg:col-span-7 flex flex-col h-full min-h-[460px]">
            {current ? (
              <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="glass-card-luxury p-7 sm:p-9 rounded-3xl flex flex-col justify-between h-full shadow-2xl relative transition-all duration-300 select-none"
              >
                <div className="space-y-4">
                  {/* Top Bar inside card: Rating, Highlight Tag and Slide controls (izq, der) */}
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(current.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-500" />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {current.highlightTag}
                      </span>

                      {/* Admin Controls on active card */}
                      {isAdmin && (
                        <div className="flex items-center gap-1 ml-1 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/40">
                          <button
                            type="button"
                            onClick={() => {
                              setTargetEditingTestimonial(current);
                              setIsCommentsModalOpen(true);
                            }}
                            className="text-[10px] font-black text-amber-900 hover:text-amber-950 flex items-center gap-0.5 cursor-pointer"
                            title="Editar este testimonio en el panel admin"
                          >
                            <Edit3 className="w-3 h-3 text-amber-600" />
                            <span>Editar</span>
                          </button>
                          <span className="text-slate-400">|</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('¿Deseas eliminar este comentario?')) {
                                deleteTestimonial(current.id);
                              }
                            }}
                            className="text-[10px] font-black text-rose-700 hover:text-rose-900 flex items-center gap-0.5 cursor-pointer"
                            title="Eliminar este testimonio"
                          >
                            <Trash2 className="w-3 h-3 text-rose-600" />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Deslizamiento (izq, der) dentro del card */}
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full border border-slate-200 shadow-sm">
                      <button
                        type="button"
                        disabled={isTransitioning}
                        onClick={prevTestimonial}
                        className={`p-1.5 rounded-full hover:bg-white text-slate-700 hover:text-slate-950 transition-all cursor-pointer shadow-none hover:shadow-sm active:scale-90 ${isTransitioning ? 'opacity-40 cursor-not-allowed' : ''
                          }`}
                        aria-label={language === 'es' ? 'Testimonio anterior' : 'Previous review'}
                        title={language === 'es' ? 'Anterior' : 'Previous'}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={isTransitioning}
                        onClick={nextTestimonial}
                        className={`p-1.5 rounded-full hover:bg-white text-slate-700 hover:text-slate-950 transition-all cursor-pointer shadow-none hover:shadow-sm active:scale-90 ${isTransitioning ? 'opacity-40 cursor-not-allowed' : ''
                          }`}
                        aria-label={language === 'es' ? 'Siguiente testimonio' : 'Next review'}
                        title={language === 'es' ? 'Siguiente' : 'Next'}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Testimonial Content with Skeleton Loading Effect */}
                  {isTransitioning ? (
                    <div className="space-y-4 py-1 min-h-[145px] flex flex-col justify-center animate-pulse">
                      <div className="space-y-2">
                        <div className="h-6 sm:h-7 bg-slate-200/80 rounded-xl skeleton-shimmer w-11/12" />
                        <div className="h-6 sm:h-7 bg-slate-200/60 rounded-xl skeleton-shimmer w-4/5" />
                      </div>
                      <div className="space-y-2 pt-2">
                        <div className="h-3.5 bg-slate-200/50 rounded-md skeleton-shimmer w-full" />
                        <div className="h-3.5 bg-slate-200/50 rounded-md skeleton-shimmer w-11/12" />
                      </div>
                    </div>
                  ) : (
                    <div
                      key={`testi-${current.id}`}
                      className={`space-y-3 min-h-[145px] flex flex-col justify-center ${slideDirection === 'next' ? 'animate-slide-right' : 'animate-slide-left'
                        }`}
                    >
                      {/* Quote */}
                      <p className="font-display text-lg sm:text-xl font-black text-slate-900 leading-snug">
                        "{current.quote}"
                      </p>

                      {/* Story */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {current.story}
                      </p>

                      {/* Vacation Photo Attachment Preview (if uploaded) */}
                      {current.vacationPhoto && (
                        <div className="pt-2">
                          <div
                            onClick={() => setSelectedVacationPhotoPreview(current.vacationPhoto || null)}
                            className="group/vphoto relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer bg-slate-950"
                            title="Clic para ampliar foto de vacaciones"
                          >
                            <img
                              src={current.vacationPhoto}
                              alt={`Vacaciones de ${current.name} en ${current.destination}`}
                              className="w-full h-32 sm:h-36 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-between p-2.5">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold">
                                <Camera className="w-3 h-3 text-amber-300" />
                                <span>Foto de sus vacaciones en {current.destination}</span>
                              </span>
                              <span className="text-[10px] font-bold text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded-md border border-amber-300/30 backdrop-blur-xs">
                                🔍 Ver grande
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Author Info & Slide Indicators */}
                <div className="pt-5 mt-5 border-t border-slate-200/80 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-md bg-slate-200">
                      {(!avatarLoaded || isTransitioning) && (
                        <div className="absolute inset-0 skeleton-shimmer z-10" />
                      )}
                      <img
                        key={current.avatar}
                        src={current.avatar}
                        alt={current.name}
                        onLoad={() => setAvatarLoaded(true)}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${avatarLoaded && !isTransitioning ? 'opacity-100' : 'opacity-0'
                          }`}
                      />
                    </div>
                    <div className="truncate">
                      {isTransitioning ? (
                        <div className="space-y-1.5 py-0.5 animate-pulse">
                          <div className="h-4 w-28 bg-slate-200/80 rounded skeleton-shimmer" />
                          <div className="h-3 w-36 bg-slate-200/60 rounded skeleton-shimmer" />
                        </div>
                      ) : (
                        <div className={slideDirection === 'next' ? 'animate-slide-right' : 'animate-slide-left'}>
                          <h4 className="font-display text-sm font-black text-slate-900 truncate">
                            {current.name} {current.lastname ? (current.lastname.endsWith('.') ? current.lastname : `${current.lastname}.`) : ''}
                          </h4>
                          <p className="text-[11px] text-terracotta-600 font-semibold truncate">
                            {current.destination} • {current.city}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Slide dots */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {visibleTestimonials.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        disabled={isTransitioning}
                        onClick={() => goToSlide(dotIdx, dotIdx > safeIndex ? 'next' : 'prev')}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${dotIdx === safeIndex
                          ? 'w-6 bg-slate-950'
                          : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                          }`}
                        aria-label={`Testimonio ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card-luxury p-8 rounded-3xl flex items-center justify-center h-full text-center text-slate-500 text-xs">
                No hay comentarios disponibles por el momento.
              </div>
            )}
          </div>

          {/* Column 2: Multi-Step Luxury Form (5 cols) - Exact Equal Height */}
          <div className="lg:col-span-5 flex flex-col h-full min-h-[460px]">
            <div className="glass-card-luxury rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full shadow-2xl relative overflow-hidden">

              {/* Card Header & Step Progress Bar */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-display text-lg sm:text-xl font-black text-slate-900">
                    {language === 'es' ? 'Comparte tu Experiencia' : 'Leave a Review'}
                  </h3>
                  {/* Step Indicator */}
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                    <span>Paso {currentStep} de 3</span>
                  </div>
                </div>

                {/* Progress Mini Bar */}
                <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-slate-950 transition-all duration-300"
                    style={{
                      width: currentStep === 1 ? '33%' : currentStep === 2 ? '66%' : '100%',
                    }}
                  />
                </div>

                {showSuccessToast && (
                  <div className="mb-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeInScale">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>
                      {language === 'es'
                        ? '¡Gracias! Tu reseña ha sido publicada con éxito.'
                        : 'Thank you! Your review has been successfully posted.'}
                    </span>
                  </div>
                )}
              </div>

              {/* STEP 1: Datos del Viajero y Destino */}
              {currentStep === 1 && (
                <form
                  onSubmit={handleNextFromStep1}
                  className="flex-1 flex flex-col justify-between space-y-3 text-xs font-medium animate-fadeInScale"
                >
                  <div className="space-y-2.5">
                    <div className='flex gap-4'>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Nombre *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Ej: Carlos"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Inicial apellido
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.lastname}
                          onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                          placeholder="Ej: S."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          País de residencia
                        </label>
                        <input
                          type="text"
                          value={formData.origin}
                          onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                          placeholder="Miami, USA"
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Destino Visitado *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.destination}
                          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                          placeholder="Medellín / Cancún"
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>
                    </div>

                    {/* Foto de Perfil del Comentador (independiente de la foto de vacaciones del Paso 2) */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                        Tu Foto de Perfil (Opcional)
                      </label>
                      <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm bg-slate-200">
                          {hasCustomAvatar ? (
                            <img
                              src={formData.avatar}
                              alt="Tu foto de perfil"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <UserRound className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <label
                            htmlFor="avatar-photo-upload"
                            className="cursor-pointer text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center gap-1 flex-shrink-0"
                          >
                            <Camera className="w-3 h-3" />
                            <span>{hasCustomAvatar ? 'Cambiar' : 'Subir foto'}</span>
                          </label>
                          {hasCustomAvatar && (
                            <button
                              type="button"
                              onClick={handleRemoveAvatarPhoto}
                              className="text-[10px] font-bold text-rose-600 hover:text-rose-800 cursor-pointer flex-shrink-0"
                            >
                              Quitar
                            </button>
                          )}
                          <span className="text-[10px] text-slate-400 truncate">
                            Así te verán en tu reseña
                          </span>
                        </div>
                        <input
                          ref={avatarFileInputRef}
                          id="avatar-photo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarPhotoUpload}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {/* Highlight Tag Chips */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                        Tipo de Viaje o Etiqueta:
                      </label>
                      <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto no-scrollbar">
                        {QUICK_TAGS.map((tag) => (
                          <button
                            type="button"
                            key={tag}
                            onClick={() => {
                              setFormData({ ...formData, highlightTag: tag });
                              setCustomTagActive(false);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${formData.highlightTag === tag && !customTagActive
                              ? 'bg-slate-950 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                          >
                            {tag}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setCustomTagActive(true)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${customTagActive
                            ? 'bg-slate-950 text-white'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                        >
                          + Otra
                        </button>
                      </div>

                      {customTagActive && (
                        <input
                          type="text"
                          placeholder="Escribe tu etiqueta (ej: Aniversario)"
                          value={formData.highlightTag}
                          onChange={(e) => setFormData({ ...formData, highlightTag: e.target.value })}
                          className="w-full mt-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none"
                        />
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-slate-950 hover:bg-slate-850 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md mt-2"
                  >
                    <span>Siguiente: Foto de Vacaciones</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}

              {/* STEP 2: Foto de Vacaciones (Toque Único) */}
              {currentStep === 2 && (
                <div className="flex-1 flex flex-col justify-between space-y-3 text-xs font-medium animate-fadeInScale">
                  <div className="space-y-3 text-center">

                    {/* ACA Travel Logo (2cm más grande que en About: ~54px de alto) */}
                    <div className="flex justify-center pt-1">
                      <div className="p-2 rounded-2xl bg-white/80 shadow-md border border-slate-200/80 inline-flex items-center justify-center">
                        <img
                          src="/logo.png"
                          alt="ACA Travel"
                          className="h-13 sm:h-14 w-auto object-contain select-none"
                          draggable={false}
                        />
                      </div>
                    </div>

                    {/* Inspiring Headline and Message */}
                    <div className="space-y-1 max-w-xs mx-auto">
                      <h4 className="font-display text-sm sm:text-base font-black text-slate-900 leading-tight">
                        ¡La felicidad se hizo para compartirse!
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Inspira a los demás con lo maravillosas que fueron tus vacaciones.
                      </p>
                    </div>

                    {/* Single Photo Rule Notice */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-bold">
                      <Camera className="w-3.5 h-3.5 text-amber-600" />
                      <span>📷 Puedes compartir una sola foto, ¡elige tu mejor recuerdo!</span>
                    </div>

                    {/* Upload Box / Preview Box */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleVacationPhotoUpload}
                      className="hidden"
                      id="vacation-photo-upload"
                    />

                    {!formData.vacationPhoto ? (
                      <label
                        htmlFor="vacation-photo-upload"
                        className="border-2 border-dashed border-slate-300 hover:border-slate-900 bg-slate-50/80 hover:bg-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all group"
                      >
                        <div className="w-9 h-9 rounded-full bg-slate-200 group-hover:bg-slate-950 group-hover:text-white flex items-center justify-center text-slate-600 transition-colors">
                          <Upload className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">
                          Haz clic para subir tu foto favorita
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Desde tu PC o galería del celular (PNG, JPG, WebP)
                        </span>
                      </label>
                    ) : (
                      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 p-2 flex items-center gap-3">
                        <img
                          src={formData.vacationPhoto}
                          alt="Previsualización de vacaciones"
                          className="w-16 h-16 rounded-xl object-cover border border-white shadow-xs"
                        />
                        <div className="text-left flex-1 min-w-0">
                          <p className="text-xs font-black text-slate-900 truncate">
                            ¡Foto cargada con éxito!
                          </p>
                          <p className="text-[10px] text-emerald-600 font-bold">
                            ✓ Lista para acompañar tu testimonio
                          </p>
                          <label
                            htmlFor="vacation-photo-upload"
                            className="text-[10px] text-slate-500 hover:text-slate-900 underline cursor-pointer inline-block mt-0.5"
                          >
                            Cambiar foto
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveVacationPhoto}
                          className="p-1.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-700 cursor-pointer"
                          title="Eliminar foto"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="py-3 px-4 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Atrás</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="flex-1 py-3 px-5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-slate-950 hover:bg-slate-850 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                    >
                      <span>{formData.vacationPhoto ? 'Siguiente: Tu Opinión' : 'Continuar (Omitir foto)'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Tu Calificación y Testimonio */}
              {currentStep === 3 && (
                <form
                  onSubmit={handleSubmitReview}
                  className="flex-1 flex flex-col justify-between space-y-3 text-xs font-medium animate-fadeInScale"
                >
                  <div className="space-y-3">
                    {/* Stars Rating */}
                    <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[11px] text-slate-700 font-bold">
                        Tu Calificación del Viaje:
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setFormData({ ...formData, rating: star })}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="text-slate-300 hover:text-amber-500 cursor-pointer transition-colors p-0.5"
                          >
                            <Star
                              className={`w-5 h-5 ${star <= (hoverRating || formData.rating)
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-slate-300'
                                }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quote Headline */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Frase que resuma tu viaje (Título)
                      </label>
                      <input
                        type="text"
                        value={formData.quote}
                        onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                        placeholder='Ej: "¡La mejor experiencia familiar de nuestras vidas!"'
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>

                    {/* Full Comment */}
                    <div className="flex-1 flex flex-col">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Cuéntanos tu experiencia con el servicio *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={formData.comment}
                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                        placeholder="Relata cómo fue la atención, los hoteles, los vuelos y el acompañamiento..."
                        className="w-full flex-1 min-h-[75px] p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit / Back Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="py-3 px-4 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Atrás</span>
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 px-5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-slate-950 hover:bg-slate-850 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Publicando...' : 'Publicar Reseña'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal to Preview Vacation Photo from Testimonial */}
      {selectedVacationPhotoPreview && (
        <div
          className="fixed inset-0 z-60 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeInScale"
          onClick={() => setSelectedVacationPhotoPreview(null)}
        >
          <div className="relative max-w-2xl max-h-[85vh] overflow-hidden rounded-3xl border border-white/20 shadow-2xl bg-slate-900">
            <button
              onClick={() => setSelectedVacationPhotoPreview(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedVacationPhotoPreview}
              alt="Foto de vacaciones"
              className="max-h-[80vh] w-auto object-contain rounded-3xl"
            />
          </div>
        </div>
      )}
    </section>
  );
}