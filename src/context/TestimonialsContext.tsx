import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Testimonial } from '../types';
import { INITIAL_TESTIMONIALS } from '../data/testimonials';
import {
  fetchTestimonialsDb,
  insertTestimonialDb,
  deleteTestimonialDb,
  updateTestimonialStatusDb,
  resetTestimonialsDb,
} from '../services/db';

const STORAGE_KEY_TESTIMONIALS = 'aca_travel_testimonials_v1';

interface TestimonialsContextType {
  testimonials: Testimonial[];
  isLoading: boolean;
  addTestimonial: (testimonial: Testimonial) => Promise<boolean>;
  updateTestimonial: (updated: Testimonial) => Promise<boolean>;
  deleteTestimonial: (id: string) => Promise<boolean>;
  approveTestimonial: (id: string) => Promise<boolean>;
  declineTestimonial: (id: string) => Promise<boolean>;
  resetTestimonials: () => Promise<boolean>;
  reloadFromDb: () => Promise<void>;
}

const TestimonialsContext = createContext<TestimonialsContextType | undefined>(undefined);

export function TestimonialsProvider({ children }: { children: React.ReactNode }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Limpiar cualquier residuo de mock data de localStorage
  useEffect(() => {
    try {
      localStorage.removeItem(STORAGE_KEY_TESTIMONIALS);
    } catch {
      // Ignore
    }
  }, []);

  // Cargar directamente de la base de datos Neon
  useEffect(() => {
    let isMounted = true;

    async function loadTestimonials() {
      setIsLoading(true);
      try {
        const dbList = await fetchTestimonialsDb();
        if (!isMounted) return;
        setTestimonials(dbList || []);
      } catch (err) {
        console.error('Error al inicializar testimonios desde Neon DB:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadTestimonials();

    return () => {
      isMounted = false;
    };
  }, []);

  const reloadFromDb = async () => {
    setIsLoading(true);
    try {
      const dbList = await fetchTestimonialsDb();
      if (dbList) {
        setTestimonials(dbList);
      }
    } catch (err) {
      console.error('Error reloading testimonials from DB:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addTestimonial = async (testimonial: Testimonial): Promise<boolean> => {
    // 1. Guardar primero en Neon DB
    const ok = await insertTestimonialDb(testimonial);
    if (!ok) {
      throw new Error('Error al guardar testimonio en la base de datos');
    }
    // 2. Solo tras confirmación de la BD, actualizar el estado
    setTestimonials((prev) => [testimonial, ...prev.filter(t => t.id !== testimonial.id)]);
    return true;
  };

  const updateTestimonial = async (updated: Testimonial): Promise<boolean> => {
    // 1. Actualizar primero en Neon DB
    const ok = await insertTestimonialDb(updated);
    if (!ok) {
      throw new Error('Error al actualizar testimonio en la base de datos');
    }
    // 2. Solo tras confirmación de la BD, actualizar el estado
    setTestimonials((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    return true;
  };

  const deleteTestimonial = async (id: string): Promise<boolean> => {
    // 1. Eliminar permanentemente de Neon DB
    const ok = await deleteTestimonialDb(id);
    if (!ok) {
      throw new Error('Error al eliminar testimonio de la base de datos');
    }
    // 2. Solo tras confirmación de la BD, actualizar el estado
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    return true;
  };

  const approveTestimonial = async (id: string): Promise<boolean> => {
    const ok = await updateTestimonialStatusDb(id, 'approved');
    if (!ok) {
      throw new Error('Error al aprobar testimonio en la base de datos');
    }
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'approved' } : t))
    );
    return true;
  };

  const declineTestimonial = async (id: string): Promise<boolean> => {
    const ok = await updateTestimonialStatusDb(id, 'declined');
    if (!ok) {
      throw new Error('Error al declinar testimonio en la base de datos');
    }
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'declined' } : t))
    );
    return true;
  };

  const resetTestimonials = async (): Promise<boolean> => {
    try {
      localStorage.removeItem(STORAGE_KEY_TESTIMONIALS);
      await resetTestimonialsDb(INITIAL_TESTIMONIALS);
      const refreshed = await fetchTestimonialsDb();
      setTestimonials(refreshed);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  return (
    <TestimonialsContext.Provider
      value={{
        testimonials,
        isLoading,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        approveTestimonial,
        declineTestimonial,
        resetTestimonials,
        reloadFromDb,
      }}
    >
      {children}
    </TestimonialsContext.Provider>
  );
}

export function useTestimonials() {
  const context = useContext(TestimonialsContext);
  if (!context) {
    throw new Error('useTestimonials must be used within a TestimonialsProvider');
  }
  return context;
}
