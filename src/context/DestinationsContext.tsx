import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Destination, CategoryItem } from '../types';
import { DESTINATIONS } from '../data/destinations';

const STORAGE_KEY_DESTINATIONS = 'aca_travel_destinations_v1';
const STORAGE_KEY_CATEGORIES = 'aca_travel_categories_v1';

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'todos',
    label: 'Todos',
    labelEn: 'All',
    fullLabel: 'Todos los Destinos',
    emoji: '🌐',
  },
  {
    id: 'colombia',
    label: 'Colombia',
    fullLabel: '🇨🇴 Colombia Mágica',
    emoji: '🇨🇴',
  },
  {
    id: 'japon',
    label: 'Japon',
    fullLabel: '⛩️ Japon',
    emoji: '⛩️',
  },
  {
    id: 'conocerRD',
    label: 'conocerRD',
    fullLabel: '🇩🇴 conocerRD',
    emoji: '🇩🇴',
  },
  {
    id: 'europa',
    label: 'Europa',
    fullLabel: '🇪🇺 Europa Soñada',
    emoji: '🇪🇺',
  },
  {
    id: 'escapadas-rd',
    label: 'Resorts/RD',
    fullLabel: '🏨 Orlando & Samaná',
    emoji: '🏨',
  },
  {
    id: 'mexico',
    label: 'México',
    fullLabel: '🇲🇽 México All-Inclusive',
    emoji: '🇲🇽',
  },
  {
    id: 'cruceros',
    label: 'Cruceros',
    fullLabel: '🚢 Cruceros del Caribe',
    emoji: '🚢',
  },
];

interface DestinationsContextType {
  destinations: Destination[];
  categories: CategoryItem[];
  addDestination: (dest: Destination, categoryMeta?: Partial<CategoryItem>) => void;
  updateDestination: (dest: Destination, categoryMeta?: Partial<CategoryItem>) => void;
  deleteDestination: (id: string) => void;
  addCategory: (cat: CategoryItem) => void;
  updateCategory: (cat: CategoryItem) => void;
  deleteCategory: (id: string) => void;
  resetToDefaults: () => void;
}

const DestinationsContext = createContext<DestinationsContextType | undefined>(undefined);

export function DestinationsProvider({ children }: { children: React.ReactNode }) {
  const [destinations, setDestinations] = useState<Destination[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DESTINATIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading destinations from localStorage:', e);
    }
    return DESTINATIONS;
  });

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading categories from localStorage:', e);
    }
    return INITIAL_CATEGORIES;
  });

  // Guardar en localStorage ante cualquier cambio
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DESTINATIONS, JSON.stringify(destinations));
    } catch (e) {
      console.error('Error saving destinations:', e);
    }
  }, [destinations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Error saving categories:', e);
    }
  }, [categories]);

  // Asegurar que cualquier categoría existente en un destino esté registrada
  const ensureCategoryExists = (catId: string, meta?: Partial<CategoryItem>) => {
    if (!catId) return;
    const cleanId = catId.trim();
    const exists = categories.some((c) => c.id.toLowerCase() === cleanId.toLowerCase());

    if (!exists) {
      const formattedLabel = meta?.label || cleanId.charAt(0).toUpperCase() + cleanId.slice(1);
      const emoji = meta?.emoji || '✈️';
      const fullLabel = meta?.fullLabel || `${emoji} ${formattedLabel}`;

      const newCat: CategoryItem = {
        id: cleanId,
        label: formattedLabel,
        fullLabel,
        emoji,
      };

      setCategories((prev) => [...prev, newCat]);
    }
  };

  const addDestination = (dest: Destination, categoryMeta?: Partial<CategoryItem>) => {
    ensureCategoryExists(dest.category, categoryMeta);
    setDestinations((prev) => [dest, ...prev]);
  };

  const updateDestination = (updatedDest: Destination, categoryMeta?: Partial<CategoryItem>) => {
    ensureCategoryExists(updatedDest.category, categoryMeta);
    setDestinations((prev) =>
      prev.map((d) => (d.id === updatedDest.id ? updatedDest : d))
    );
  };

  const deleteDestination = (id: string) => {
    setDestinations((prev) => prev.filter((d) => d.id !== id));
  };

  const addCategory = (cat: CategoryItem) => {
    if (categories.some((c) => c.id.toLowerCase() === cat.id.toLowerCase())) return;
    setCategories((prev) => [...prev, cat]);
  };

  const updateCategory = (updatedCat: CategoryItem) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === updatedCat.id ? updatedCat : c))
    );
  };

  const deleteCategory = (catId: string) => {
    if (catId === 'todos') return;
    setCategories((prev) => prev.filter((c) => c.id !== catId));
  };

  const resetToDefaults = () => {
    setDestinations(DESTINATIONS);
    setCategories(INITIAL_CATEGORIES);
    try {
      localStorage.removeItem(STORAGE_KEY_DESTINATIONS);
      localStorage.removeItem(STORAGE_KEY_CATEGORIES);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DestinationsContext.Provider
      value={{
        destinations,
        categories,
        addDestination,
        updateDestination,
        deleteDestination,
        addCategory,
        updateCategory,
        deleteCategory,
        resetToDefaults,
      }}
    >
      {children}
    </DestinationsContext.Provider>
  );
}

export function useDestinations() {
  const context = useContext(DestinationsContext);
  if (!context) {
    throw new Error('useDestinations must be used within a DestinationsProvider');
  }
  return context;
}
