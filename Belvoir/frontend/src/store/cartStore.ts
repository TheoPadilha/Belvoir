import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import CryptoJS from 'crypto-js';
import type { CartItem } from '../types';

const ENCRYPTION_KEY = 'belvoir-cart-2024';

// Funções de criptografia para localStorage
const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
};

const decryptData = (encryptedData: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Computed
  getSubtotal: () => number;
  getItemCount: () => number;
  getItem: (productId: string, variantId: string) => CartItem | undefined;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === existingItem.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          const newItem: CartItem = {
            ...item,
            id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          };
          set({ items: [...items, newItem] });
        }

        // Abrir carrinho automaticamente ao adicionar item
        set({ isOpen: true });
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      getItem: (productId, variantId) => {
        return get().items.find(
          (item) => item.productId === productId && item.variantId === variantId
        );
      },
    }),
    {
      name: 'belvoir-cart',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            const decrypted = decryptData(str);
            return JSON.parse(decrypted);
          } catch {
            // Se falhar a descriptografia, limpar dados corrompidos
            localStorage.removeItem(name);
            return null;
          }
        },
        setItem: (name, value) => {
          const encrypted = encryptData(JSON.stringify(value));
          localStorage.setItem(name, encrypted);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
      partialize: (state) => ({ items: state.items }) as CartStore,
    }
  )
);
