import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Destination, CategoryItem } from '../types';
import { DESTINATIONS } from '../data/destinations';
import {
  fetchDestinationsDb,
  saveDestinationDb,
  deleteDestinationDb,
  fetchCategoriesDb,
  saveCategoryDb,
  deleteCategoryDb,
  seedCategoriesIfEmpty,
  resetDestinationsDb,
} from '../services/db';

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
  isLoading: boolean;
  addDestination: (dest: Destination, categoryMeta?: Partial<CategoryItem>) => Promise<boolean>;
  updateDestination: (dest: Destination, categoryMeta?: Partial<CategoryItem>) => Promise<boolean>;
  deleteDestination: (id: string) => Promise<boolean>;
  addCategory: (cat: CategoryItem) => Promise<boolean>;
  updateCategory: (cat: CategoryItem) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  resetToDefaults: () => Promise<boolean>;
  reloadFromDb: () => Promise<void>;
}

const DestinationsContext = createContext<DestinationsContextType | undefined>(undefined);

export function DestinationsProvider({ children }: { children: React.ReactNode }) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Limpiar cualquier residuo de mock data de localStorage
  useEffect(() => {
    try {
      localStorage.removeItem(STORAGE_KEY_DESTINATIONS);
      localStorage.removeItem(STORAGE_KEY_CATEGORIES);
    } catch {
      // Ignore
    }
  }, []);

  // Cargar destinos y categorías directamente desde Neon PostgreSQL
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      try {
        const [dbDests, dbCats] = await Promise.all([
          fetchDestinationsDb(),
          fetchCategoriesDb(),
        ]);

        if (!isMounted) return;

        setDestinations(dbDests || []);
        if (dbCats && dbCats.length > 0) {
          setCategories(dbCats);
        }
      } catch (err) {
        console.error('Error al inicializar datos desde Neon DB:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const reloadFromDb = async () => {
    setIsLoading(true);
    try {
      const [dbDests, dbCats] = await Promise.all([fetchDestinationsDb(), fetchCategoriesDb()]);
      if (dbDests) setDestinations(dbDests);
      if (dbCats && dbCats.length > 0) setCategories(dbCats);
    } catch (err) {
      console.error('Error reloading from DB:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Asegurar que cualquier categoría existente en un destino esté registrada en la BD
  const ensureCategoryExists = async (catId: string, meta?: Partial<CategoryItem>) => {
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

      const ok = await saveCategoryDb(newCat, categories.length);
      if (ok) {
        setCategories((prev) => [...prev, newCat]);
      }
    }
  };

  const addDestination = async (dest: Destination, categoryMeta?: Partial<CategoryItem>): Promise<boolean> => {
    await ensureCategoryExists(dest.category, categoryMeta);
    // 1. Guardar primero en Neon DB
    const ok = await saveDestinationDb(dest);
    if (!ok) {
      throw new Error('Error al guardar el nuevo paquete en la base de datos');
    }
    // 2. Solo tras confirmación de la BD, actualizar el estado
    setDestinations((prev) => [dest, ...prev.filter((d) => d.id !== dest.id)]);
    return true;
  };

  const updateDestination = async (updatedDest: Destination, categoryMeta?: Partial<CategoryItem>): Promise<boolean> => {
    await ensureCategoryExists(updatedDest.category, categoryMeta);
    // 1. Actualizar primero en Neon DB
    const ok = await saveDestinationDb(updatedDest);
    if (!ok) {
      throw new Error('Error al actualizar el paquete en la base de datos');
    }
    // 2. Solo tras confirmación de la BD, actualizar el estado
    setDestinations((prev) =>
      prev.map((d) => (d.id === updatedDest.id ? updatedDest : d))
    );
    return true;
  };

  const deleteDestination = async (id: string): Promise<boolean> => {
    // 1. Eliminar primero de la base de datos
    const ok = await deleteDestinationDb(id);
    if (!ok) {
      throw new Error('Error al eliminar el paquete de la base de datos');
    }
    // 2. Solo tras confirmación de la BD, actualizar el estado
    setDestinations((prev) => prev.filter((d) => d.id !== id));
    return true;
  };

  const addCategory = async (cat: CategoryItem): Promise<boolean> => {
    if (categories.some((c) => c.id.toLowerCase() === cat.id.toLowerCase())) return true;
    const ok = await saveCategoryDb(cat, categories.length);
    if (!ok) {
      throw new Error('Error al guardar categoría en la base de datos');
    }
    setCategories((prev) => [...prev, cat]);
    return true;
  };

  const updateCategory = async (updatedCat: CategoryItem): Promise<boolean> => {
    const ok = await saveCategoryDb(updatedCat);
    if (!ok) {
      throw new Error('Error al actualizar categoría en la base de datos');
    }
    setCategories((prev) =>
      prev.map((c) => (c.id === updatedCat.id ? updatedCat : c))
    );
    return true;
  };

  const deleteCategory = async (catId: string): Promise<boolean> => {
    if (catId === 'todos') return false;
    const ok = await deleteCategoryDb(catId);
    if (!ok) {
      throw new Error('Error al eliminar categoría de la base de datos');
    }
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    return true;
  };

  const resetToDefaults = async (): Promise<boolean> => {
    try {
      localStorage.removeItem(STORAGE_KEY_DESTINATIONS);
      localStorage.removeItem(STORAGE_KEY_CATEGORIES);
      await resetDestinationsDb(DESTINATIONS);
      await seedCategoriesIfEmpty(INITIAL_CATEGORIES);
      const [refreshedDests, refreshedCats] = await Promise.all([
        fetchDestinationsDb(),
        fetchCategoriesDb(),
      ]);
      setDestinations(refreshedDests);
      if (refreshedCats && refreshedCats.length > 0) setCategories(refreshedCats);
      return true;
    } catch (e) {
      console.error('Error resetting to defaults in DB:', e);
      return false;
    }
  };

  return (
    <DestinationsContext.Provider
      value={{
        destinations,
        categories,
        isLoading,
        addDestination,
        updateDestination,
        deleteDestination,
        addCategory,
        updateCategory,
        deleteCategory,
        resetToDefaults,
        reloadFromDb,
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
