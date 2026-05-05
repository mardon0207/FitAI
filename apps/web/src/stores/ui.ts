import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface UIStore {
  toasts: Toast[];
  toast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

export const useUI = create<UIStore>((set) => ({
  toasts: [],
  toast: (message, type = 'info') => {
    const id = Math.random().toString(36).substring(7);
    set((s) => ({
      toasts: [...s.toasts, { id, message, type }],
    }));
    
    // Auto remove after 3s
    setTimeout(() => {
      set((s) => ({
        toasts: s.toasts.filter((t) => t.id !== id),
      }));
    }, 3000);
  },
  removeToast: (id) => {
    set((s) => ({
      toasts: s.toasts.filter((t) => t.id !== id),
    }));
  },
}));
