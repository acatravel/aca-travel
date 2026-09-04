import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Testimonial } from '../types';
import { INITIAL_TESTIMONIALS } from '../data/testimonials';

const STORAGE_KEY_TESTIMONIALS = 'aca_travel_testimonials_v1';

interface TestimonialsContextType {
  testimonials: Testimonial[];
  addTestimonial: (testimonial: Testimonial) => void;
  updateTestimonial: (updated: Testimonial) => void;
  deleteTestimonial: (id: string) => void;
  approveTestimonial: (id: string) => void;
  declineTestimonial: (id: string) => void;
  resetTestimonials: () => void;
}

const TestimonialsContext = createContext<TestimonialsContextType | undefined>(undefined);

export function TestimonialsProvider({ children }: { children: React.ReactNode }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TESTIMONIALS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading testimonials from localStorage:', e);
    }
    return INITIAL_TESTIMONIALS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TESTIMONIALS, JSON.stringify(testimonials));
    } catch (e) {
      console.error('Error saving testimonials to localStorage:', e);
    }
  }, [testimonials]);

  const addTestimonial = (testimonial: Testimonial) => {
    setTestimonials((prev) => [testimonial, ...prev]);
  };

  const updateTestimonial = (updated: Testimonial) => {
    setTestimonials((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  const approveTestimonial = (id: string) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'approved' } : t))
    );
  };

  const declineTestimonial = (id: string) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'declined' } : t))
    );
  };

  const resetTestimonials = () => {
    setTestimonials(INITIAL_TESTIMONIALS);
    try {
      localStorage.removeItem(STORAGE_KEY_TESTIMONIALS);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <TestimonialsContext.Provider
      value={{
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        approveTestimonial,
        declineTestimonial,
        resetTestimonials,
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
