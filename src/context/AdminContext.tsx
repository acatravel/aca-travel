import React, { createContext, useContext, useState } from 'react';
import type { Destination, Testimonial } from '../types';

interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  isPackagesModalOpen: boolean;
  setIsPackagesModalOpen: (val: boolean) => void;
  isCommentsModalOpen: boolean;
  setIsCommentsModalOpen: (val: boolean) => void;
  targetEditingDestination: Destination | null;
  setTargetEditingDestination: (dest: Destination | null) => void;
  targetEditingTestimonial: Testimonial | null;
  setTargetEditingTestimonial: (testi: Testimonial | null) => void;
  logoutAdmin: () => void;
}

const STORAGE_KEY_ADMIN = 'aca_travel_admin_session_v1';

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdminState] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_ADMIN) === 'true';
    } catch {
      return false;
    }
  });

  const [isPackagesModalOpen, setIsPackagesModalOpen] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [targetEditingDestination, setTargetEditingDestination] = useState<Destination | null>(null);
  const [targetEditingTestimonial, setTargetEditingTestimonial] = useState<Testimonial | null>(null);

  const setIsAdmin = (val: boolean) => {
    setIsAdminState(val);
    try {
      if (val) {
        sessionStorage.setItem(STORAGE_KEY_ADMIN, 'true');
      } else {
        sessionStorage.removeItem(STORAGE_KEY_ADMIN);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    setIsPackagesModalOpen(false);
    setIsCommentsModalOpen(false);
    setTargetEditingDestination(null);
    setTargetEditingTestimonial(null);
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        setIsAdmin,
        isPackagesModalOpen,
        setIsPackagesModalOpen,
        isCommentsModalOpen,
        setIsCommentsModalOpen,
        targetEditingDestination,
        setTargetEditingDestination,
        targetEditingTestimonial,
        setTargetEditingTestimonial,
        logoutAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
