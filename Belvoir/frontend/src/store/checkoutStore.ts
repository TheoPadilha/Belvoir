import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Address, ShippingMethod, CheckoutState } from '../types';

interface CheckoutStore extends CheckoutState {
  // Actions
  setStep: (step: 1 | 2 | 3) => void;
  setEmail: (email: string) => void;
  setShippingAddress: (address: Address) => void;
  setBillingAddress: (address: Address | null) => void;
  setSameAsShipping: (same: boolean) => void;
  setShippingMethod: (method: ShippingMethod) => void;
  setPaymentMethod: (method: string) => void;
  setNotes: (notes: string) => void;
  resetCheckout: () => void;
  canProceedToStep: (step: 2 | 3) => boolean;
}

const initialState: CheckoutState = {
  step: 1,
  email: '',
  shippingAddress: null,
  billingAddress: null,
  sameAsShipping: true,
  shippingMethod: null,
  paymentMethod: '',
  notes: '',
};

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) => {
        if (step === 1 || get().canProceedToStep(step)) {
          set({ step });
        }
      },

      setEmail: (email) => set({ email }),

      setShippingAddress: (address) => set({ shippingAddress: address }),

      setBillingAddress: (address) => set({ billingAddress: address }),

      setSameAsShipping: (same) => {
        set({ sameAsShipping: same });
        if (same) {
          set({ billingAddress: null });
        }
      },

      setShippingMethod: (method) => set({ shippingMethod: method }),

      setPaymentMethod: (method) => set({ paymentMethod: method }),

      setNotes: (notes) => set({ notes }),

      resetCheckout: () => set(initialState),

      canProceedToStep: (step) => {
        const state = get();

        if (step === 2) {
          // Para ir ao step 2, precisa ter email e endereço de entrega
          return !!(
            state.email &&
            state.shippingAddress &&
            state.shippingAddress.firstName &&
            state.shippingAddress.lastName &&
            state.shippingAddress.address1 &&
            state.shippingAddress.city &&
            state.shippingAddress.state &&
            state.shippingAddress.zipCode &&
            state.shippingAddress.phone
          );
        }

        if (step === 3) {
          // Para ir ao step 3, precisa ter método de envio selecionado
          return !!(state.shippingMethod);
        }

        return false;
      },
    }),
    {
      name: 'belvoir-checkout',
      partialize: (state) => ({
        email: state.email,
        shippingAddress: state.shippingAddress,
        billingAddress: state.billingAddress,
        sameAsShipping: state.sameAsShipping,
        // Não persistir step, método de envio ou pagamento por segurança
      }),
    }
  )
);
