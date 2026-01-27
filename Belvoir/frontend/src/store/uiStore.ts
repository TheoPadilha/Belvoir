import { create } from 'zustand';
import type { Toast } from '../types';

interface UIStore {
  toasts: Toast[];
  isMenuOpen: boolean;
  isSearchOpen: boolean;
  isLoading: boolean;
  loadingMessage: string;

  // Toast actions
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Menu actions
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;

  // Search actions
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;

  // Loading actions
  setLoading: (loading: boolean, message?: string) => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  toasts: [],
  isMenuOpen: false,
  isSearchOpen: false,
  isLoading: false,
  loadingMessage: '',

  addToast: (toast) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = { ...toast, id };

    set({ toasts: [...get().toasts, newToast] });

    // Auto-remove após duração
    const duration = toast.duration ?? 4000;
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },

  removeToast: (id) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },

  clearToasts: () => {
    set({ toasts: [] });
  },

  openMenu: () => set({ isMenuOpen: true }),
  closeMenu: () => set({ isMenuOpen: false }),
  toggleMenu: () => set({ isMenuOpen: !get().isMenuOpen }),

  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () => set({ isSearchOpen: !get().isSearchOpen }),

  setLoading: (loading, message = '') => {
    set({ isLoading: loading, loadingMessage: message });
  },
}));

// Helper para mostrar toasts rapidamente
export const toast = {
  success: (message: string) => {
    useUIStore.getState().addToast({ type: 'success', message });
  },
  error: (message: string) => {
    useUIStore.getState().addToast({ type: 'error', message });
  },
  info: (message: string) => {
    useUIStore.getState().addToast({ type: 'info', message });
  },
  warning: (message: string) => {
    useUIStore.getState().addToast({ type: 'warning', message });
  },
};
