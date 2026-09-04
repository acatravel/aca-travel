import { useAdmin } from '../context/AdminContext';
import { ShieldCheck, Package, MessageSquare, LogOut } from 'lucide-react';

export function AdminFloatingBar() {
  const {
    isAdmin,
    setIsPackagesModalOpen,
    setIsCommentsModalOpen,
    logoutAdmin,
  } = useAdmin();

  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-slate-950/90 backdrop-blur-xl border border-amber-400/40 shadow-[0_10px_35px_rgba(0,0,0,0.6)] flex items-center gap-2 sm:gap-3 text-white animate-fadeInScale">
      <div className="flex items-center gap-1.5 pr-2 border-r border-slate-800">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Modo Admin</span>
        </span>
      </div>

      <button
        type="button"
        onClick={() => setIsPackagesModalOpen(true)}
        className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer hover:border hover:border-amber-400/30"
      >
        <Package className="w-3.5 h-3.5 text-amber-400" />
        <span>Paquetes</span>
      </button>

      <button
        type="button"
        onClick={() => setIsCommentsModalOpen(true)}
        className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer hover:border hover:border-amber-400/30"
      >
        <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
        <span>Comentarios</span>
      </button>

      <button
        type="button"
        onClick={logoutAdmin}
        className="p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-rose-950/70 hover:bg-rose-900 active:scale-95 text-xs font-bold text-rose-300 transition-all flex items-center gap-1 cursor-pointer border border-rose-800/40"
        title="Cerrar sesión de administrador"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Salir</span>
      </button>
    </div>
  );
}
