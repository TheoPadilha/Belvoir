import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Customer, Address, Order } from '../types';

// Dados mockados para demonstração
const mockOrders: Order[] = [
  {
    id: 'order_1',
    orderNumber: '#BV-2024-001',
    createdAt: '2024-01-15T10:30:00Z',
    status: 'delivered',
    financialStatus: 'paid',
    items: [
      {
        id: 'item_1',
        productId: '1',
        title: 'Belvoir Heritage Automatic',
        variantTitle: 'Ouro Rosa / Couro Marrom',
        quantity: 1,
        price: 24900,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
      },
    ],
    subtotal: 24900,
    shipping: 0,
    total: 24900,
    shippingAddress: {
      firstName: 'João',
      lastName: 'Silva',
      address1: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      country: 'Brasil',
      phone: '(11) 99999-9999',
    },
    trackingNumber: 'BR123456789',
    trackingUrl: 'https://rastreamento.correios.com.br',
  },
];

interface AuthStore {
  // State
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  orders: Order[];

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (googleToken: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<Customer>) => Promise<boolean>;
  addAddress: (address: Address) => Promise<boolean>;
  updateAddress: (index: number, address: Address) => Promise<boolean>;
  deleteAddress: (index: number) => Promise<boolean>;
  setDefaultAddress: (index: number) => Promise<boolean>;
  fetchOrders: () => Promise<void>;
  recoverPassword: (email: string) => Promise<boolean>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  acceptsMarketing?: boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      customer: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      orders: [],

      login: async (email: string, _password: string) => {
        set({ isLoading: true });

        // Simular delay de API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock login - em produção, chamar Shopify Customer API
        // customerAccessTokenCreate mutation
        const mockCustomer: Customer = {
          id: 'cust_' + Date.now(),
          email,
          firstName: 'Cliente',
          lastName: 'Belvoir',
          phone: '(11) 99999-9999',
          addresses: [],
          createdAt: new Date().toISOString(),
          acceptsMarketing: true,
        };

        set({
          customer: mockCustomer,
          isAuthenticated: true,
          isLoading: false,
          accessToken: 'mock_token_' + Date.now(),
          orders: mockOrders,
        });

        return true;
      },

      loginWithGoogle: async (_googleToken: string) => {
        set({ isLoading: true });

        // Simular delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock - em produção:
        // 1. Validar token do Google
        // 2. Criar/buscar cliente na Shopify com o email do Google
        // 3. Gerar accessToken da Shopify
        const mockCustomer: Customer = {
          id: 'cust_google_' + Date.now(),
          email: 'usuario@gmail.com',
          firstName: 'Usuário',
          lastName: 'Google',
          addresses: [],
          createdAt: new Date().toISOString(),
          acceptsMarketing: false,
        };

        set({
          customer: mockCustomer,
          isAuthenticated: true,
          isLoading: false,
          accessToken: 'mock_google_token_' + Date.now(),
          orders: mockOrders,
        });

        return true;
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });

        // Simular delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock - em produção, chamar Shopify customerCreate mutation
        const newCustomer: Customer = {
          id: 'cust_' + Date.now(),
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          addresses: [],
          createdAt: new Date().toISOString(),
          acceptsMarketing: data.acceptsMarketing || false,
        };

        set({
          customer: newCustomer,
          isAuthenticated: true,
          isLoading: false,
          accessToken: 'mock_token_' + Date.now(),
          orders: [],
        });

        return true;
      },

      logout: () => {
        // Em produção, chamar customerAccessTokenDelete mutation
        set({
          customer: null,
          isAuthenticated: false,
          accessToken: null,
          orders: [],
        });
      },

      updateProfile: async (data: Partial<Customer>) => {
        set({ isLoading: true });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const currentCustomer = get().customer;
        if (!currentCustomer) return false;

        // Em produção, chamar customerUpdate mutation
        set({
          customer: { ...currentCustomer, ...data },
          isLoading: false,
        });

        return true;
      },

      addAddress: async (address: Address) => {
        set({ isLoading: true });

        await new Promise((resolve) => setTimeout(resolve, 500));

        const currentCustomer = get().customer;
        if (!currentCustomer) return false;

        // Em produção, chamar customerAddressCreate mutation
        const updatedAddresses = [...currentCustomer.addresses, address];

        set({
          customer: {
            ...currentCustomer,
            addresses: updatedAddresses,
            defaultAddress: currentCustomer.defaultAddress || address,
          },
          isLoading: false,
        });

        return true;
      },

      updateAddress: async (index: number, address: Address) => {
        set({ isLoading: true });

        await new Promise((resolve) => setTimeout(resolve, 500));

        const currentCustomer = get().customer;
        if (!currentCustomer) return false;

        // Em produção, chamar customerAddressUpdate mutation
        const updatedAddresses = [...currentCustomer.addresses];
        updatedAddresses[index] = address;

        set({
          customer: {
            ...currentCustomer,
            addresses: updatedAddresses,
          },
          isLoading: false,
        });

        return true;
      },

      deleteAddress: async (index: number) => {
        set({ isLoading: true });

        await new Promise((resolve) => setTimeout(resolve, 500));

        const currentCustomer = get().customer;
        if (!currentCustomer) return false;

        // Em produção, chamar customerAddressDelete mutation
        const updatedAddresses = currentCustomer.addresses.filter((_, i) => i !== index);

        set({
          customer: {
            ...currentCustomer,
            addresses: updatedAddresses,
          },
          isLoading: false,
        });

        return true;
      },

      setDefaultAddress: async (index: number) => {
        set({ isLoading: true });

        await new Promise((resolve) => setTimeout(resolve, 500));

        const currentCustomer = get().customer;
        if (!currentCustomer) return false;

        // Em produção, chamar customerDefaultAddressUpdate mutation
        set({
          customer: {
            ...currentCustomer,
            defaultAddress: currentCustomer.addresses[index],
          },
          isLoading: false,
        });

        return true;
      },

      fetchOrders: async () => {
        set({ isLoading: true });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Em produção, chamar customer query com orders
        set({
          orders: mockOrders,
          isLoading: false,
        });
      },

      recoverPassword: async (_email: string) => {
        set({ isLoading: true });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Em produção, chamar customerRecover mutation
        set({ isLoading: false });

        return true;
      },
    }),
    {
      name: 'belvoir-auth',
      partialize: (state) => ({
        customer: state.customer,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
      }),
    }
  )
);
