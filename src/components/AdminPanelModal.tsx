import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Lock,
  Plus,
  Trash2,
  Edit3,
  Check,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Search,
  MapPin,
  Clock,
  DollarSign,
  Upload,
  Image as ImageIcon,
  Building2,
  Plane,
  Star,
  MessageSquare
} from 'lucide-react';
import { useDestinations } from '../context/DestinationsContext';
import { useAdmin } from '../context/AdminContext';
import type { Destination, CategoryItem } from '../types';

interface AdminPanelModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const DEFAULT_PIN = '123456';
const PRESET_IMAGES = [
  { label: 'París', url: '/bg-1-paris.jpg' },
  { label: 'Disney / Orlando', url: '/bg-2-disney.jpg' },
  { label: 'Cancún / Playa', url: '/bg-3-cancun.jpg' },
  { label: 'Colombia / Medellín', url: '/bg-4-colombia.jpg' },
  { label: 'Roma / Italia', url: '/bg-5-rome.jpg' },
  { label: 'Crucero Caribe', url: '/bg-6-cruise.jpg' },
  { label: 'Playa Hero', url: '/hero-bg.jpg' },
];

const POPULAR_EMOJIS = ['✈️', '🌴', '🏖️', '🚢', '🏔️', '🕌', '⛩️', '🗽', '🏰', '🏨', '🧭', '🏜️', '🌺', '🇨🇴', '🇩🇴', '🇪🇺', '🇲🇽', '🇯🇵', '🇦🇪', '🇺🇸'];

export function AdminPanelModal({ isOpen: propIsOpen, onClose: propOnClose }: AdminPanelModalProps) {
  const {
    destinations,
    categories,
    addDestination,
    updateDestination,
    deleteDestination,
    deleteCategory,
    resetToDefaults,
  } = useDestinations();

  const {
    isAdmin,
    setIsAdmin,
    isPackagesModalOpen,
    setIsPackagesModalOpen,
    setIsCommentsModalOpen,
    targetEditingDestination,
    setTargetEditingDestination,
  } = useAdmin();

  // Control whether modal is open either via prop or AdminContext
  const isOpen = propIsOpen !== undefined ? propIsOpen : isPackagesModalOpen;
  const handleClose = () => {
    if (propOnClose) propOnClose();
    setIsPackagesModalOpen(false);
    setTargetEditingDestination(null);
  };

  // PIN Authentication State
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);

  // Dashboard Navigation
  const [activeTab, setActiveTab] = useState<'packages' | 'categories'>('packages');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Package Form State (Modal / Drawer inside Admin)
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState<Partial<Destination>>({
    title: '',
    titleEn: '',
    tagline: '',
    category: 'colombia',
    experienceType: 'culture',
    budgetTier: 'under-700',
    priceNumeric: 750,
    priceEstimate: '$750 USD',
    initialPayment: 'Aparta con $150 USD',
    duration: '5 Días / 4 Noches',
    image: '/bg-1-paris.jpg',
    images: ['/bg-1-paris.jpg'],
    isResort: false,
    pricePerNight: '',
    roomType: '',
    badge: '🔥 Destino Destacado',
    departure: '✈️ Vuelos internacionales incluidos',
    visaRequirement: '✅ ¡Sin Visa Requerida!',
    description: '',
    highlights: ['Tour guiado con traslados privados', 'Hotel 4 estrellas con desayuno'],
    includes: ['Boleto aéreo ida y vuelta', 'Hospedaje seleccionado', 'Seguro de viaje'],
    itinerarySummary: [
      { day: 'Día 1', activity: 'Llegada y bienvenida en hotel' },
      { day: 'Día 2', activity: 'Tour por los principales atractivos turísticos' },
      { day: 'Día 3', activity: 'Día libre de compras y gastronomía' },
    ],
  });

  // Multiple File input ref
  const multiFileInputRef = useRef<HTMLInputElement | null>(null);

  // Custom Category Fields
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState<boolean>(false);
  const [newCatName, setNewCatName] = useState<string>('');
  const [newCatEmoji, setNewCatEmoji] = useState<string>('✈️');
  const [newCatFullLabel, setNewCatFullLabel] = useState<string>('');

  // Confirmation Modals
  const [deletingDestId, setDeletingDestId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Check if targetEditingDestination was passed via context
  useEffect(() => {
    if (targetEditingDestination) {
      handleOpenEditForm(targetEditingDestination);
    }
  }, [targetEditingDestination]);

  // Focus and keyboard handler for PIN entry
  useEffect(() => {
    if (!isOpen || isAdmin) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        if (enteredPin.length < 6) {
          handleDigitPress(e.key);
        }
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isAdmin, enteredPin]);

  if (!isOpen) return null;

  // Handle PIN input
  const handleDigitPress = (digit: string) => {
    if (enteredPin.length >= 6) return;
    const newPin = enteredPin + digit;
    setEnteredPin(newPin);
    setPinError(false);

    if (newPin.length === 6) {
      if (newPin === DEFAULT_PIN) {
        setTimeout(() => {
          setIsAdmin(true);
          setEnteredPin('');
        }, 150);
      } else {
        setPinError(true);
        setTimeout(() => {
          setEnteredPin('');
          setPinError(false);
        }, 800);
      }
    }
  };

  const handleBackspace = () => {
    setEnteredPin((prev) => prev.slice(0, -1));
    setPinError(false);
  };

  const handleClearPin = () => {
    setEnteredPin('');
    setPinError(false);
  };

  // Open Form for Create
  const handleOpenCreateForm = () => {
    setEditingId(null);
    setIsCreatingNewCategory(false);
    setNewCatName('');
    setNewCatEmoji('✈️');
    setNewCatFullLabel('');
    setFormData({
      title: '',
      titleEn: '',
      tagline: '',
      category: categories[1]?.id || 'colombia',
      experienceType: 'culture',
      budgetTier: '700-1000',
      priceNumeric: 850,
      priceEstimate: '$850 USD',
      initialPayment: 'Aparta con solo $200 USD',
      duration: '6 Días / 5 Noches',
      image: '/bg-4-colombia.jpg',
      images: ['/bg-4-colombia.jpg'],
      isResort: false,
      pricePerNight: '$180 USD / noche',
      roomType: 'Habitación Deluxe con Vista al Mar',
      badge: '✨ Nuevo Paquete',
      departure: '✈️ Vuelos directos y conexiones',
      visaRequirement: '✅ ¡Sin Visa para la mayoría de países!',
      description: 'Una experiencia inolvidable diseñada por el equipo experto de ACA Travel.',
      highlights: [
        'Alojamiento en hoteles de primera categoría',
        'Tours guiados por expertos locales certificados',
        'Asistencia VIP personalizada 24/7',
      ],
      includes: [
        'Vuelos ida y vuelta con equipaje',
        'Traslados privados aeropuerto - hotel',
        'Desayunos diarios incluidos',
        'Seguro médico internacional',
      ],
      itinerarySummary: [
        { day: 'Día 1', activity: 'Llegada, check-in y cóctel de bienvenida' },
        { day: 'Día 2', activity: 'Tour panorámico y exploración cultural' },
        { day: 'Día 3', activity: 'Excursión especial y gastronomía local' },
        { day: 'Día 4', activity: 'Día libre para actividades opcionales' },
        { day: 'Día 5', activity: 'Regreso triunfal a casa' },
      ],
    });
    setIsFormOpen(true);
  };

  // Open Form for Edit
  const handleOpenEditForm = (dest: Destination) => {
    setEditingId(dest.id);
    setIsCreatingNewCategory(false);
    const existingImages = dest.images && dest.images.length > 0 ? dest.images : [dest.image];
    setFormData({
      ...dest,
      images: [...existingImages],
      highlights: [...dest.highlights],
      includes: [...dest.includes],
      itinerarySummary: dest.itinerarySummary ? dest.itinerarySummary.map((s) => ({ ...s })) : [],
    });
    setIsFormOpen(true);
  };

  // Subir Múltiples Imágenes desde la PC
  const handleMultipleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    let loadedCount = 0;
    const newBase64Images: string[] = [];

    fileList.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          newBase64Images.push(reader.result);
        }
        loadedCount++;
        if (loadedCount === fileList.length) {
          setFormData((prev) => {
            const currentList = prev.images || (prev.image ? [prev.image] : []);
            const updatedImages = [...currentList, ...newBase64Images];
            return {
              ...prev,
              images: updatedImages,
              image: prev.image || updatedImages[0] || '/bg-1-paris.jpg',
            };
          });
          showToast(`📸 ${newBase64Images.length} imagen(es) cargada(s) con éxito`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSetPrimaryImage = (imgUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      image: imgUrl,
    }));
  };

  const handleRemoveImageFromGallery = (indexToRemove: number) => {
    setFormData((prev) => {
      const currentList = prev.images || [];
      const updated = currentList.filter((_, idx) => idx !== indexToRemove);
      const newPrimary =
        prev.image === currentList[indexToRemove]
          ? updated[0] || '/bg-1-paris.jpg'
          : prev.image;
      return {
        ...prev,
        images: updated,
        image: newPrimary,
      };
    });
  };

  // Submit Form
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      alert('Por favor completa el título.');
      return;
    }

    let finalCategory = formData.category || 'colombia';
    let categoryMeta: Partial<CategoryItem> | undefined = undefined;

    if (isCreatingNewCategory && newCatName.trim()) {
      const cleanId = newCatName.trim().toLowerCase().replace(/\s+/g, '-');
      finalCategory = cleanId;
      categoryMeta = {
        id: cleanId,
        label: newCatName.trim(),
        fullLabel: newCatFullLabel.trim() || `${newCatEmoji} ${newCatName.trim()}`,
        emoji: newCatEmoji || '✈️',
      };
    }

    const currentImages =
      formData.images && formData.images.length > 0
        ? formData.images
        : [formData.image || '/bg-1-paris.jpg'];

    const primaryImg = formData.image || currentImages[0] || '/bg-1-paris.jpg';

    // Si es resort, ajustar precios y etiquetas acorde
    const finalPriceEstimate = formData.isResort
      ? (formData.pricePerNight ? `${formData.pricePerNight} (Resort)` : formData.priceEstimate || '$195 USD / noche')
      : (formData.priceEstimate?.trim() || '$750 USD');

    const payload: Destination = {
      id: editingId || `dest-${Date.now()}`,
      title: formData.title.trim(),
      titleEn: formData.titleEn?.trim() || formData.title.trim(),
      tagline: formData.tagline?.trim() || formData.title.trim(),
      taglineEn: formData.taglineEn?.trim() || formData.tagline?.trim() || '',
      category: finalCategory,
      experienceType: formData.experienceType || 'culture',
      budgetTier: formData.budgetTier || 'under-700',
      priceNumeric: Number(formData.priceNumeric) || 750,
      priceEstimate: finalPriceEstimate,
      priceEstimateEn: finalPriceEstimate,
      initialPayment: formData.initialPayment?.trim() || 'Aparta con $150 USD',
      initialPaymentEn: formData.initialPaymentEn?.trim() || 'Reserve with $150 USD',
      duration: formData.duration?.trim() || '5 Días / 4 Noches',
      durationEn: formData.durationEn?.trim() || '5 Days / 4 Nights',
      image: primaryImg,
      images: currentImages,
      isResort: !!formData.isResort,
      pricePerNight: formData.pricePerNight?.trim() || '',
      roomType: formData.roomType?.trim() || '',
      badge: formData.badge?.trim() || (formData.isResort ? '🏨 Resort Todo Incluido' : ''),
      departure: formData.departure?.trim() || '✈️ Vuelos incluidos',
      visaRequirement: formData.visaRequirement?.trim() || '✅ ¡Sin Visa Requerida!',
      description: formData.description?.trim() || '',
      highlights: (formData.highlights || []).filter((h) => h.trim().length > 0),
      includes: (formData.includes || []).filter((i) => i.trim().length > 0),
      occupancy: formData.occupancy?.trim() || (formData.isResort ? '2 Adultos' : 'Por persona en base doble'),
      kidsPolicy: formData.kidsPolicy?.trim() || (formData.isResort ? '¡Hasta 2 Niños GRATIS!' : ''),
      mealPlan: formData.mealPlan?.trim() || (formData.isResort ? 'Todo Incluido 24 Horas' : 'Desayunos incluidos'),
      itinerarySummary: (formData.itinerarySummary || []).filter((it) => it.activity.trim().length > 0),
    };

    if (editingId) {
      updateDestination(payload, categoryMeta);
      showToast('✅ ¡Paquete actualizado con éxito!');
    } else {
      addDestination(payload, categoryMeta);
      showToast('🎉 ¡Nuevo paquete creado e integrado al catálogo!');
    }

    setIsFormOpen(false);
    setTargetEditingDestination(null);
  };

  const handleConfirmDelete = () => {
    if (deletingDestId) {
      deleteDestination(deletingDestId);
      setDeletingDestId(null);
      showToast('🗑️ Paquete eliminado correctamente.');
    }
  };

  const filteredList = destinations.filter((dest) => {
    const matchesSearch =
      dest.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      dest.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
      dest.priceEstimate.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesCategory =
      selectedCategoryFilter === 'all' || dest.category.toLowerCase() === selectedCategoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fadeInScale">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-2xl flex items-center gap-2 animate-slide-right">
          <Check className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MODAL CONTAINER */}
      <div
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-4 text-white flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================= */}
        {/* VIEW 1: PIN AUTHENTICATION SCREEN                         */}
        {/* ========================================================= */}
        {!isAdmin ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-8 min-h-[480px]">
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-sm">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-400">
                Acceso de Administración Oculto
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                Ingrese el PIN de Seguridad
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Digita el código de 6 dígitos para administrar los paquetes, resorts y moderar comentarios.
              </p>
            </div>

            {/* PIN Slots */}
            <div className={`flex items-center gap-3.5 my-2 ${pinError ? 'animate-bounce text-rose-400' : ''}`}>
              {[0, 1, 2, 3, 4, 5].map((idx) => {
                const isFilled = enteredPin.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-11 h-13 sm:w-12 sm:h-14 rounded-xl border flex items-center justify-center text-xl font-mono font-bold transition-all duration-200 ${
                      pinError
                        ? 'border-rose-500 bg-rose-500/10 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                        : isFilled
                        ? 'border-amber-400 bg-amber-400/10 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)] scale-105'
                        : 'border-slate-700 bg-slate-800/60 text-slate-500'
                    }`}
                  >
                    {isFilled ? '●' : ''}
                  </div>
                );
              })}
            </div>

            {pinError && (
              <p className="text-xs font-bold text-rose-400 flex items-center gap-1.5 animate-fadeInScale">
                <AlertCircle className="w-4 h-4" />
                <span>PIN incorrecto. Intente de nuevo.</span>
              </p>
            )}

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2.5 max-w-[280px] w-full pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleDigitPress(digit)}
                  className="h-12 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:bg-amber-400 active:text-slate-950 font-display text-lg font-black transition-all border border-slate-700/60 cursor-pointer shadow-sm"
                >
                  {digit}
                </button>
              ))}
              <button
                onClick={handleClearPin}
                className="h-12 rounded-xl bg-slate-800/50 hover:bg-slate-700 text-xs font-bold text-slate-400 transition-all border border-slate-700/40 cursor-pointer"
              >
                C
              </button>
              <button
                onClick={() => handleDigitPress('0')}
                className="h-12 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:bg-amber-400 active:text-slate-950 font-display text-lg font-black transition-all border border-slate-700/60 cursor-pointer shadow-sm"
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                className="h-12 rounded-xl bg-slate-800/50 hover:bg-slate-700 text-xs font-bold text-slate-400 transition-all border border-slate-700/40 cursor-pointer"
              >
                ⌫
              </button>
            </div>

            <div className="pt-3">
              <span className="text-[11px] text-slate-500 bg-slate-800/40 px-3 py-1.5 rounded-full border border-slate-700/40">
                💡 PIN predeterminado: <strong className="text-amber-400 font-mono">123456</strong>
              </span>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* VIEW 2: AUTHENTICATED ADMIN DASHBOARD                     */
          /* ========================================================= */
          <>
            {/* Header */}
            <div className="p-5 sm:p-7 border-b border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-xl sm:text-2xl font-black text-white">
                      Panel de Administración ACA Travel
                    </h2>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      En Vivo
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Gestiona paquetes, resorts, categorías y modera los comentarios de viajeros.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
                {/* Botón Acceso Rápido a Comentarios */}
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setIsCommentsModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold cursor-pointer transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <span>Moderar Comentarios</span>
                </button>

                <button
                  onClick={handleOpenCreateForm}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Paquete / Resort</span>
                </button>

                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  title="Restablecer datos originales"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleClose}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Cerrar panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-5 sm:px-7 pt-4 pb-1 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900/50">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('packages')}
                  className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${
                    activeTab === 'packages' ? 'text-amber-400 font-black' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Paquetes y Resorts ({destinations.length})</span>
                  {activeTab === 'packages' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('categories')}
                  className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${
                    activeTab === 'categories' ? 'text-amber-400 font-black' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Categorías y Mapa 3D ({categories.length})</span>
                  {activeTab === 'categories' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                  )}
                </button>
              </div>

              {activeTab === 'packages' && (
                <div className="flex items-center gap-2 pb-3 flex-wrap">
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="all">Todas las categorías</option>
                    {categories.filter((c) => c.id !== 'todos').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.emoji} {c.label}
                      </option>
                    ))}
                  </select>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar paquete..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 w-36 sm:w-48"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Tab Contents */}
            <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-4">
              {activeTab === 'packages' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredList.map((dest) => {
                    const catInfo = categories.find((c) => c.id.toLowerCase() === dest.category.toLowerCase());
                    const isResort = dest.isResort;

                    return (
                      <div
                        key={dest.id}
                        className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-4 flex gap-4 hover:border-slate-600 transition-all"
                      >
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0">
                          <img
                            src={dest.image}
                            alt={dest.title}
                            className="w-full h-full object-cover"
                          />
                          {dest.images && dest.images.length > 1 && (
                            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-slate-950/80 text-[9px] font-bold text-white backdrop-blur-xs flex items-center gap-0.5">
                              <ImageIcon className="w-2.5 h-2.5" />
                              {dest.images.length}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                {catInfo?.emoji || '✈️'} {catInfo?.label || dest.category}
                              </span>
                              {isResort && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 flex items-center gap-1">
                                  <Building2 className="w-2.5 h-2.5" /> Resort
                                </span>
                              )}
                            </div>
                            <h4 className="font-display font-black text-sm text-white truncate">{dest.title}</h4>
                            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                              {dest.duration} {dest.roomType ? `• ${dest.roomType}` : ''}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 mt-2">
                            <div>
                              <span className="font-display text-sm font-black text-white">
                                {dest.pricePerNight ? dest.pricePerNight : dest.priceEstimate}
                              </span>
                              <span className="text-[10px] text-emerald-400 block font-medium">
                                {dest.initialPayment}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditForm(dest)}
                                className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white transition-colors cursor-pointer"
                                title="Editar paquete"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeletingDestId(dest.id)}
                                className="p-2 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/50 text-rose-300 hover:text-rose-100 transition-colors cursor-pointer"
                                title="Eliminar paquete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* TAB CONTENT: CATEGORIES */
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                    ℹ️ <strong>Sincronización del Mapa 3D:</strong> Estas categorías aparecen como estaciones orbitales en el mapa interactivo. Cada vez que agregas un paquete con una nueva categoría, se incorpora automáticamente.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {categories.map((cat) => {
                      const count = destinations.filter(
                        (d) => d.category.toLowerCase() === cat.id.toLowerCase()
                      ).length;
                      const isTodos = cat.id === 'todos';

                      return (
                        <div
                          key={cat.id}
                          className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                              {cat.emoji}
                            </span>
                            <div>
                              <p className="font-display font-black text-sm text-white">{cat.label}</p>
                              <p className="text-[11px] text-slate-400">
                                {count} paquete{count === 1 ? '' : 's'} asignado{count === 1 ? '' : 's'}
                              </p>
                            </div>
                          </div>

                          {!isTodos && (
                            <button
                              onClick={() => deleteCategory(cat.id)}
                              className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-700/50 transition-colors cursor-pointer"
                              title="Eliminar del mapa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* SUB-MODAL: PACKAGE / RESORT CREATE & EDIT FORM            */}
        {/* (DISTRIBUCIÓN MEJORADA + RESORT + SUBIDA MÚLTIPLE)         */}
        {/* ========================================================= */}
        {isFormOpen && (
          <div className="absolute inset-0 z-50 bg-slate-950/95 overflow-y-auto p-4 sm:p-8 flex flex-col justify-between animate-fadeInScale">
            <div className="max-w-4xl mx-auto w-full space-y-6">
              
              {/* Form Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-black text-white">
                      {editingId ? '✏️ Editar Paquete Turístico / Resort' : '✨ Crear Nuevo Paquete Turístico o Resort'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Configura el tipo de paquete, tarifas, sube múltiples fotos desde tu PC y asígnalo al mapa interactivo.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveForm} className="space-y-6">
                
                {/* SECCIÓN 1: TIPO DE PAQUETE (TOGGLE RESORT) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-amber-400/30 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${formData.isResort ? 'bg-cyan-500/20 text-cyan-300' : 'bg-amber-400/20 text-amber-300'}`}>
                        {formData.isResort ? <Building2 className="w-5 h-5" /> : <Plane className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-display font-black text-sm sm:text-base text-white">
                          {formData.isResort ? '🏨 Paquete de Tipo: RESORT / HOTEL' : '✈️ Paquete de Tipo: TOUR / CIRCUITO'}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {formData.isResort
                            ? 'Los resorts incluyen estadía, plan Todo Incluido 24h, amenidades y beneficios familiares.'
                            : 'Los tours estándar incluyen vuelos, traslados, itinerario por días y excursiones.'}
                        </p>
                      </div>
                    </div>

                    <label className="inline-flex items-center cursor-pointer select-none gap-3 bg-slate-800 hover:bg-slate-750 px-4 py-2.5 rounded-2xl border border-slate-700/80 transition-all">
                      <span className="text-xs font-bold text-white whitespace-nowrap">
                        {formData.isResort ? '🏨 Modo Resort' : '✈️ Modo Tour'}
                      </span>
                      <div className="relative inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={!!formData.isResort}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isResort: e.target.checked,
                              badge: e.target.checked ? '🏨 Resort Todo Incluido' : formData.badge,
                              mealPlan: e.target.checked ? 'Todo Incluido 24 Horas' : (formData.mealPlan || 'Desayunos diarios'),
                              occupancy: e.target.checked ? '2 Adultos' : (formData.occupancy || 'Base doble'),
                              kidsPolicy: e.target.checked ? '¡2 Niños GRATIS hasta 11 años!' : formData.kidsPolicy,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* SECCIÓN 2: INFORMACIÓN GENERAL */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> 1. Información General del Destino
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Título del Paquete o Nombre del Resort *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Dreams Macao Beach Punta Cana Resort & Spa"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-300 mb-1">Subtítulo / Tagline</label>
                      <input
                        type="text"
                        placeholder="Ej: Suite frente a la playa con plan Todo Incluido 24h y parque acuático"
                        value={formData.tagline || ''}
                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Categoría y Mapa */}
                    <div className="sm:col-span-2 p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-amber-300">
                          Estación del Mapa 3D / Categoría *
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsCreatingNewCategory(!isCreatingNewCategory)}
                          className="text-xs font-bold text-amber-400 hover:underline cursor-pointer"
                        >
                          {isCreatingNewCategory ? '← Elegir existente' : '+ Crear Nueva Estación/Categoría'}
                        </button>
                      </div>

                      {!isCreatingNewCategory ? (
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                        >
                          {categories
                            .filter((c) => c.id !== 'todos')
                            .map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.emoji} {c.label} ({c.fullLabel})
                              </option>
                            ))}
                        </select>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-400 mb-1">
                              Nombre (ej: Punta Cana)
                            </label>
                            <input
                              type="text"
                              placeholder="Punta Cana"
                              value={newCatName}
                              onChange={(e) => setNewCatName(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-amber-400/50 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-400 mb-1">Emoji</label>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                maxLength={4}
                                value={newCatEmoji}
                                onChange={(e) => setNewCatEmoji(e.target.value)}
                                className="w-12 text-center px-2 py-2 rounded-xl bg-slate-900 border border-amber-400/50 text-base text-white"
                              />
                              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                                {POPULAR_EMOJIS.slice(0, 4).map((em) => (
                                  <button
                                    type="button"
                                    key={em}
                                    onClick={() => setNewCatEmoji(em)}
                                    className="text-base p-1 hover:scale-125 transition-transform"
                                  >
                                    {em}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-400 mb-1">
                              Etiqueta Completa
                            </label>
                            <input
                              type="text"
                              placeholder="🏨 Punta Cana Resorts"
                              value={newCatFullLabel}
                              onChange={(e) => setNewCatFullLabel(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-amber-400/50 text-xs text-white"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* SECCIÓN 3: PRECIOS Y ALOJAMIENTO (ADAPTABLE SI ES RESORT) */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" /> 2. Tarifas y Esquema de Pagos
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.isResort ? (
                      <>
                        <div className="sm:col-span-2 md:col-span-1">
                          <label className="block text-xs font-bold text-cyan-300 mb-1">
                            Precio por Habitación por Noche *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ej: $195 USD / noche"
                            value={formData.pricePerNight || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pricePerNight: e.target.value,
                                priceEstimate: e.target.value,
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-cyan-400/50 text-sm text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Tipo de Habitación
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: Suite Deluxe con Balcón"
                            value={formData.roomType || ''}
                            onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Estadía Mínima / Noches
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: 3 Noches / 4 Días"
                            value={formData.duration || ''}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Precio Total por Persona *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ej: $850 USD"
                            value={formData.priceEstimate || ''}
                            onChange={(e) => setFormData({ ...formData, priceEstimate: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Abono Inicial (Separación)
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: Aparta con solo $150 USD"
                            value={formData.initialPayment || ''}
                            onChange={(e) => setFormData({ ...formData, initialPayment: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">Duración del Viaje</label>
                          <input
                            type="text"
                            placeholder="Ej: 6 Días / 5 Noches"
                            value={formData.duration || ''}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Badge o Etiqueta</label>
                      <input
                        type="text"
                        placeholder="Ej: 🔥 Destino Más Cotizado"
                        value={formData.badge || ''}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Vuelos / Transporte</label>
                      <input
                        type="text"
                        placeholder="Ej: ✈️ Vuelos incluidos con maleta"
                        value={formData.departure || ''}
                        onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Requisito de Visa</label>
                      <input
                        type="text"
                        placeholder="Ej: ✅ ¡Sin Visa Requerida!"
                        value={formData.visaRequirement || ''}
                        onChange={(e) => setFormData({ ...formData, visaRequirement: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        {formData.isResort ? 'Ocupación de la Habitación' : 'Pasajeros / Ocupación'}
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: 2 Adultos o Base Doble"
                        value={formData.occupancy || ''}
                        onChange={(e) => setFormData({ ...formData, occupancy: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-300 mb-1">
                        Promoción / Niños Gratis
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: ¡2 Niños GRATIS hasta 11 años!"
                        value={formData.kidsPolicy || ''}
                        onChange={(e) => setFormData({ ...formData, kidsPolicy: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-amber-400/40 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Plan de Alimentación
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Todo Incluido 24h / Desayunos Buffet"
                        value={formData.mealPlan || ''}
                        onChange={(e) => setFormData({ ...formData, mealPlan: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                {/* SECCIÓN 4: GALERÍA DE IMÁGENES (SUBIDA MÚLTIPLE DESDE PC + PREVIEWS) */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4" /> 3. Galería de Fotos del Paquete / Resort
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Sube múltiples imágenes simultáneas desde tu PC. La imagen con la estrella será la portada principal.
                      </p>
                    </div>

                    <span className="text-[11px] font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 self-start sm:self-auto">
                      {(formData.images || []).length} fotos cargadas
                    </span>
                  </div>

                  {/* Multiple file upload trigger */}
                  <input
                    ref={multiFileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleMultipleFilesUpload}
                    className="hidden"
                    id="admin-multi-image-upload"
                  />

                  <div className="flex flex-col sm:flex-row gap-3">
                    <label
                      htmlFor="admin-multi-image-upload"
                      className="flex-1 border-2 border-dashed border-amber-400/40 hover:border-amber-400 bg-slate-800/60 hover:bg-slate-800 rounded-2xl p-4 flex items-center justify-center gap-3 cursor-pointer transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-400/10 group-hover:bg-amber-400 group-hover:text-slate-950 text-amber-300 flex items-center justify-center transition-colors">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">
                          Subir múltiples fotos desde tu PC
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Puedes seleccionar varios archivos a la vez (PNG, JPG, WebP)
                        </p>
                      </div>
                    </label>

                    {/* Presets rápidos */}
                    <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 max-w-sm">
                      <span className="text-[10px] text-slate-400 block w-full">Fotos del servidor:</span>
                      {PRESET_IMAGES.map((img) => (
                        <button
                          type="button"
                          key={img.url}
                          onClick={() => {
                            setFormData((prev) => {
                              const cur = prev.images || [];
                              if (cur.includes(img.url)) return prev;
                              return {
                                ...prev,
                                images: [...cur, img.url],
                                image: prev.image || img.url,
                              };
                            });
                          }}
                          className="text-[10px] px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 cursor-pointer"
                        >
                          + {img.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Visual Preview Grid of Uploaded Images */}
                  {formData.images && formData.images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
                      {formData.images.map((imgUrl, idx) => {
                        const isPrimary = formData.image === imgUrl || (!formData.image && idx === 0);
                        return (
                          <div
                            key={idx}
                            className={`relative rounded-xl overflow-hidden border-2 group transition-all aspect-video bg-slate-950 ${
                              isPrimary
                                ? 'border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.4)] ring-1 ring-amber-400'
                                : 'border-slate-700 hover:border-slate-500'
                            }`}
                          >
                            <img
                              src={imgUrl}
                              alt={`Foto ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />

                            {/* Badge if primary */}
                            {isPrimary ? (
                              <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[9px] font-black flex items-center gap-0.5 shadow-md">
                                <Star className="w-2.5 h-2.5 fill-slate-950" /> Portada
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage(imgUrl)}
                                className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 px-1.5 py-0.5 rounded-md bg-slate-900/80 hover:bg-amber-400 hover:text-slate-950 text-white text-[9px] font-bold transition-all cursor-pointer shadow-md"
                              >
                                Poner portada
                              </button>
                            )}

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveImageFromGallery(idx)}
                              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white transition-all cursor-pointer opacity-80 hover:opacity-100"
                              title="Eliminar foto"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* SECCIÓN 5: DESCRIPCIÓN Y DETALLES */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> 4. Descripción del Viaje o Resort
                  </h4>
                  <textarea
                    rows={3}
                    placeholder="Describe la experiencia, el resort, las amenidades y por qué es una oportunidad imperdible..."
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-lg cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingId ? 'Guardar Cambios' : 'Publicar Paquete / Resort'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingDestId && (
          <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-sm w-full space-y-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
                <Trash2 className="w-6 h-6" />
              </div>
              <h4 className="font-display font-black text-lg text-white">¿Eliminar este paquete?</h4>
              <p className="text-xs text-slate-400">
                Esta acción eliminará el paquete seleccionado. Puedes restaurarlo más tarde con el botón de restablecer.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setDeletingDestId(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white cursor-pointer"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-sm w-full space-y-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h4 className="font-display font-black text-lg text-white">¿Restablecer datos originales?</h4>
              <p className="text-xs text-slate-400">
                Se recargarán los paquetes y categorías por defecto iniciales de la agencia.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    resetToDefaults();
                    setShowResetConfirm(false);
                    showToast('🔄 Datos restablecidos a valores originales');
                  }}
                  className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-xs font-black text-slate-950 cursor-pointer"
                >
                  Restablecer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
