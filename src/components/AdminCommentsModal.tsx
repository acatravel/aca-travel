import React, { useState } from 'react';
import {
  X,
  Check,
  XCircle,
  Edit3,
  Trash2,
  Star,
  Search,
  MessageSquare,
  ShieldCheck,
  Calendar,
  MapPin,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useTestimonials } from '../context/TestimonialsContext';
import { useAdmin } from '../context/AdminContext';
import type { Testimonial } from '../types';

export function AdminCommentsModal() {
  const {
    isCommentsModalOpen,
    setIsCommentsModalOpen,
    targetEditingTestimonial,
    setTargetEditingTestimonial,
  } = useAdmin();

  const {
    testimonials,
    updateTestimonial,
    deleteTestimonial,
    approveTestimonial,
    declineTestimonial,
  } = useTestimonials();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'declined'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // If there's a targetEditingTestimonial triggered from outside (e.g. from the carousel)
  React.useEffect(() => {
    if (targetEditingTestimonial) {
      setEditingItem({ ...targetEditingTestimonial });
    }
  }, [targetEditingTestimonial]);

  if (!isCommentsModalOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApprove = (id: string) => {
    approveTestimonial(id);
    showToast('✅ Comentario aprobado y publicado en el sitio');
  };

  const handleDecline = (id: string) => {
    declineTestimonial(id);
    showToast('⚠️ Comentario declinado (oculto para visitantes)');
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteTestimonial(deletingId);
      setDeletingId(null);
      showToast('🗑️ Comentario eliminado permanentemente');
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    updateTestimonial(editingItem);
    setEditingItem(null);
    setTargetEditingTestimonial(null);
    showToast('💾 Comentario actualizado exitosamente');
  };

  const filteredTestimonials = testimonials.filter((t) => {
    const status = t.status || 'approved';
    const matchesFilter =
      activeFilter === 'all' ? true : status === activeFilter;

    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.story.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.quote.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.city && t.city.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const countPending = testimonials.filter((t) => t.status === 'pending').length;
  const countApproved = testimonials.filter((t) => !t.status || t.status === 'approved').length;
  const countDeclined = testimonials.filter((t) => t.status === 'declined').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fadeInScale">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-2xl flex items-center gap-2 animate-slide-right">
          <Check className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl sm:text-2xl font-black text-white">
                  Moderación de Comentarios
                </h2>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Admin
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Aprueba, declina, edita o elimina las opiniones y fotos de los viajeros.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsCommentsModalOpen(false);
              setTargetEditingTestimonial(null);
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer self-end sm:self-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar & Search */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/90 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'all'
                  ? 'bg-white text-slate-950 font-black shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>Todos</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-700/50">
                {testimonials.length}
              </span>
            </button>

            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'pending'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
              }`}
            >
              <span>Pendientes</span>
              {countPending > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-300 font-black">
                  {countPending}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveFilter('approved')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'approved'
                  ? 'bg-emerald-500 text-white font-black shadow-md'
                  : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
              }`}
            >
              <span>Aprobados</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-700/50">
                {countApproved}
              </span>
            </button>

            <button
              onClick={() => setActiveFilter('declined')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'declined'
                  ? 'bg-rose-500 text-white font-black shadow-md'
                  : 'bg-slate-800 text-rose-400 hover:bg-slate-700'
              }`}
            >
              <span>Declinados</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-700/50">
                {countDeclined}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por viajero o texto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Content List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {filteredTestimonials.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <MessageSquare className="w-10 h-10 mx-auto text-slate-600" />
              <p className="text-sm font-bold">No hay comentarios en esta categoría.</p>
              <p className="text-xs text-slate-500">Prueba con otro filtro o término de búsqueda.</p>
            </div>
          ) : (
            filteredTestimonials.map((item) => {
              const status = item.status || 'approved';
              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-slate-800/80 border border-slate-700/70 p-4 sm:p-5 flex flex-col gap-4 hover:border-slate-600 transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/60">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                        alt={item.name}
                        className="w-11 h-11 rounded-full object-cover border-2 border-white/20 shadow-md bg-slate-900 flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-display font-black text-sm text-white">{item.name}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-semibold">
                            {item.highlightTag || 'Viajero'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-terracotta-400" />
                            {item.destination} ({item.city})
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            {item.date}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {status === 'pending' && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Pendiente
                        </span>
                      )}
                      {status === 'approved' && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Aprobado
                        </span>
                      )}
                      {status === 'declined' && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Declinado
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rating & Quote & Story */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>

                    <p className="font-display text-sm font-black text-white italic">
                      "{item.quote}"
                    </p>

                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {item.story}
                    </p>
                  </div>

                  {/* Vacation Photo (if uploaded) */}
                  {item.vacationPhoto && (
                    <div className="pt-2">
                      <div className="flex items-center gap-2 mb-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-[11px] font-bold text-slate-300">
                          Foto de vacaciones compartida por el viajero:
                        </span>
                      </div>
                      <img
                        src={item.vacationPhoto}
                        alt="Vacaciones"
                        onClick={() => setPreviewPhotoUrl(item.vacationPhoto || null)}
                        className="w-28 h-20 sm:w-36 sm:h-24 rounded-xl object-cover border border-slate-700 hover:border-cyan-400 cursor-pointer transition-all shadow-md hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {status !== 'approved' && (
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Aprobar</span>
                        </button>
                      )}

                      {status !== 'declined' && (
                        <button
                          onClick={() => handleDecline(item.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Declinar</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingItem({ ...item })}
                        className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>

                      <button
                        onClick={() => setDeletingId(item.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/50 text-rose-300 hover:text-rose-100 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Submodal: Edit Comment */}
      {editingItem && (
        <div className="fixed inset-0 z-60 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-display font-black text-lg text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-cyan-400" />
                <span>Editar Comentario</span>
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Nombre del Viajero</label>
                  <input
                    type="text"
                    required
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Origen (Ciudad / País)</label>
                  <input
                    type="text"
                    value={editingItem.city}
                    onChange={(e) => setEditingItem({ ...editingItem, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Destino Visitado</label>
                  <input
                    type="text"
                    required
                    value={editingItem.destination}
                    onChange={(e) => setEditingItem({ ...editingItem, destination: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Etiqueta Destacada</label>
                  <input
                    type="text"
                    value={editingItem.highlightTag}
                    onChange={(e) => setEditingItem({ ...editingItem, highlightTag: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">Calificación (Estrellas)</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setEditingItem({ ...editingItem, rating: star })}
                      className="cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= editingItem.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Frase / Cita Destacada (Quote)</label>
                <input
                  type="text"
                  required
                  value={editingItem.quote}
                  onChange={(e) => setEditingItem({ ...editingItem, quote: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Relato Completo (Story)</label>
                <textarea
                  rows={4}
                  required
                  value={editingItem.story}
                  onChange={(e) => setEditingItem({ ...editingItem, story: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Foto de Perfil / Avatar (URL)</label>
                  <input
                    type="text"
                    value={editingItem.avatar}
                    onChange={(e) => setEditingItem({ ...editingItem, avatar: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Foto de Vacaciones (URL)</label>
                  <input
                    type="text"
                    value={editingItem.vacationPhoto || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, vacationPhoto: e.target.value })}
                    placeholder="URL de foto o vacía"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deletingId && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-sm w-full space-y-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-display font-black text-lg text-white">¿Eliminar este comentario?</h4>
            <p className="text-xs text-slate-400">
              Esta acción no se puede deshacer y el comentario se borrará de forma permanente.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white cursor-pointer"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Full Vacation Photo */}
      {previewPhotoUrl && (
        <div
          className="fixed inset-0 z-60 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewPhotoUrl(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-3xl border border-white/20 shadow-2xl">
            <button
              onClick={() => setPreviewPhotoUrl(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewPhotoUrl}
              alt="Foto de vacaciones ampliada"
              className="max-h-[80vh] w-auto object-contain rounded-3xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
