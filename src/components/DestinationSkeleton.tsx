import { Loader2 } from 'lucide-react';

export function DestinationSkeleton() {
  return (
    <div className="space-y-6">
      {/* Loading Indicator Status */}
      <div className="flex items-center justify-center gap-2.5 py-3">
        <Loader2 className="w-5 h-5 text-amber-300 animate-spin" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
          Cargando experiencias seleccionadas...
        </span>
      </div>

      {/* 3 Glassmorphism Shimmering Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((n) => (
          <div 
            key={n} 
            className="glass-card-luxury rounded-3xl overflow-hidden shadow-xl p-0 flex flex-col justify-between"
          >
            {/* Image shimmer */}
            <div className="h-60 w-full skeleton-shimmer" />

            {/* Content shimmer */}
            <div className="p-6 space-y-4">
              <div className="h-4 w-24 skeleton-shimmer rounded-full" />
              <div className="h-6 w-4/5 skeleton-shimmer rounded-xl" />
              
              <div className="space-y-2 pt-1">
                <div className="h-3.5 w-full skeleton-shimmer rounded-md" />
                <div className="h-3.5 w-3/4 skeleton-shimmer rounded-md" />
              </div>

              {/* Price and button shimmer */}
              <div className="pt-4 border-t border-slate-300/40 flex items-center justify-between">
                <div className="space-y-1.5">
                  <div className="h-3 w-16 skeleton-shimmer rounded-md" />
                  <div className="h-7 w-28 skeleton-shimmer rounded-xl" />
                </div>
                <div className="h-10 w-28 skeleton-shimmer rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
