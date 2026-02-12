import { create } from 'zustand';

interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}

interface ToastState {
    toasts: Toast[];
    addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    removeToast: (id: number) => void;
}

export const useToastStore = create<ToastState>((set) => ({
    toasts: [],
    addToast: (message, type = 'success') => {
        const id = Date.now();
        set((state) => ({
            toasts: [...state.toasts, { id, message, type }]
        }));
        // Auto-suppression après 4 secondes
        setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter(t => t.id !== id)
            }));
        }, 4000);
    },
    removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
    })),
}));