/**
 * Hook para autenticação com Shopify
 *
 * Este hook gerencia login/logout de clientes usando a Customer API do Shopify.
 *
 * NOTA: Use este hook quando quiser integrar diretamente com Shopify.
 * Para funcionalidade básica, continue usando useAuthStore do Zustand.
 */

import { useState, useEffect, useCallback } from 'react';
import type { Customer, Address } from '../types';
import customerService from '../services/customerService';
import { isShopifyConfigured } from '../services/shopifyClient';

// ============================================
// TIPOS
// ============================================

interface UseShopifyAuthState {
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UseShopifyAuthActions {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    acceptsMarketing?: boolean
  ) => Promise<boolean>;
  updateProfile: (updates: Partial<Customer>) => Promise<boolean>;
  addAddress: (address: Address) => Promise<boolean>;
  updateAddress: (addressId: string, address: Address) => Promise<boolean>;
  deleteAddress: (addressId: string) => Promise<boolean>;
  setDefaultAddress: (addressId: string) => Promise<boolean>;
  recoverPassword: (email: string) => Promise<boolean>;
  resetPassword: (customerId: string, token: string, newPassword: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

// ============================================
// HOOK
// ============================================

export function useShopifyAuth(): UseShopifyAuthState & UseShopifyAuthActions {
  const [state, setState] = useState<UseShopifyAuthState>({
    customer: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Verificar sessão ao carregar
  const checkSession = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      if (!isShopifyConfigured()) {
        // Modo demo - verificar localStorage
        const storedCustomer = localStorage.getItem('belvoir_demo_customer');
        if (storedCustomer) {
          const customer = JSON.parse(storedCustomer);
          setState({ customer, isAuthenticated: true, isLoading: false, error: null });
        } else {
          setState({ customer: null, isAuthenticated: false, isLoading: false, error: null });
        }
        return;
      }

      const customer = await customerService.getCustomer();
      setState({
        customer,
        isAuthenticated: customer !== null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState({
        customer: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao verificar sessão',
      });
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Login
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      if (!isShopifyConfigured()) {
        // Modo demo
        const mockCustomer: Customer = {
          id: 'demo_' + Date.now(),
          email,
          firstName: email.split('@')[0],
          lastName: '',
          addresses: [],
          createdAt: new Date().toISOString(),
          acceptsMarketing: false,
        };
        localStorage.setItem('belvoir_demo_customer', JSON.stringify(mockCustomer));
        setState({ customer: mockCustomer, isAuthenticated: true, isLoading: false, error: null });
        return true;
      }

      const result = await customerService.login(email, password);
      if (result.success && result.customer) {
        setState({
          customer: result.customer,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: result.message || 'Erro ao fazer login',
        }));
        return false;
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao fazer login',
      }));
      return false;
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      if (!isShopifyConfigured()) {
        localStorage.removeItem('belvoir_demo_customer');
      } else {
        await customerService.logout();
      }

      setState({ customer: null, isAuthenticated: false, isLoading: false, error: null });
    } catch (error) {
      // Mesmo com erro, limpar estado local
      localStorage.removeItem('belvoir_demo_customer');
      setState({ customer: null, isAuthenticated: false, isLoading: false, error: null });
    }
  }, []);

  // Registro
  const register = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string,
      acceptsMarketing: boolean = false
    ): Promise<boolean> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        if (!isShopifyConfigured()) {
          // Modo demo - criar e logar automaticamente
          const mockCustomer: Customer = {
            id: 'demo_' + Date.now(),
            email,
            firstName,
            lastName,
            addresses: [],
            createdAt: new Date().toISOString(),
            acceptsMarketing,
          };
          localStorage.setItem('belvoir_demo_customer', JSON.stringify(mockCustomer));
          setState({
            customer: mockCustomer,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        }

        const result = await customerService.createCustomer(
          email,
          password,
          firstName,
          lastName,
          acceptsMarketing
        );

        if (result.success) {
          // Fazer login automaticamente após registro
          return await login(email, password);
        } else {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: result.message || 'Erro ao criar conta',
          }));
          return false;
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Erro ao criar conta',
        }));
        return false;
      }
    },
    [login]
  );

  // Atualizar perfil
  const updateProfile = useCallback(
    async (updates: Partial<Customer>): Promise<boolean> => {
      if (!state.isAuthenticated) return false;

      try {
        if (!isShopifyConfigured()) {
          // Modo demo
          const updatedCustomer = { ...state.customer!, ...updates };
          localStorage.setItem('belvoir_demo_customer', JSON.stringify(updatedCustomer));
          setState((prev) => ({ ...prev, customer: updatedCustomer }));
          return true;
        }

        const result = await customerService.updateCustomer(updates);
        if (result.success && result.customer) {
          setState((prev) => ({ ...prev, customer: result.customer! }));
          return true;
        }
        setState((prev) => ({ ...prev, error: result.message || 'Erro ao atualizar' }));
        return false;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Erro ao atualizar',
        }));
        return false;
      }
    },
    [state.isAuthenticated, state.customer]
  );

  // Adicionar endereço
  const addAddress = useCallback(
    async (address: Address): Promise<boolean> => {
      if (!state.isAuthenticated) return false;

      try {
        const result = await customerService.addAddress(address);
        if (result.success) {
          await checkSession(); // Recarregar dados
          return true;
        }
        setState((prev) => ({ ...prev, error: result.message || 'Erro ao adicionar endereço' }));
        return false;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Erro ao adicionar endereço',
        }));
        return false;
      }
    },
    [state.isAuthenticated, checkSession]
  );

  // Atualizar endereço
  const updateAddress = useCallback(
    async (addressId: string, address: Address): Promise<boolean> => {
      if (!state.isAuthenticated) return false;

      try {
        const result = await customerService.updateAddress(addressId, address);
        if (result.success) {
          await checkSession();
          return true;
        }
        setState((prev) => ({ ...prev, error: result.message || 'Erro ao atualizar endereço' }));
        return false;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Erro ao atualizar endereço',
        }));
        return false;
      }
    },
    [state.isAuthenticated, checkSession]
  );

  // Deletar endereço
  const deleteAddress = useCallback(
    async (addressId: string): Promise<boolean> => {
      if (!state.isAuthenticated) return false;

      try {
        const result = await customerService.deleteAddress(addressId);
        if (result.success) {
          await checkSession();
          return true;
        }
        setState((prev) => ({ ...prev, error: result.message || 'Erro ao remover endereço' }));
        return false;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Erro ao remover endereço',
        }));
        return false;
      }
    },
    [state.isAuthenticated, checkSession]
  );

  // Definir endereço padrão
  const setDefaultAddress = useCallback(
    async (addressId: string): Promise<boolean> => {
      if (!state.isAuthenticated) return false;

      try {
        const result = await customerService.setDefaultAddress(addressId);
        if (result.success) {
          await checkSession();
          return true;
        }
        setState((prev) => ({ ...prev, error: result.message || 'Erro ao definir endereço padrão' }));
        return false;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Erro ao definir endereço padrão',
        }));
        return false;
      }
    },
    [state.isAuthenticated, checkSession]
  );

  // Recuperar senha
  const recoverPassword = useCallback(async (email: string): Promise<boolean> => {
    try {
      const result = await customerService.recoverPassword(email);
      if (!result.success) {
        setState((prev) => ({ ...prev, error: result.message || 'Erro ao enviar email' }));
      }
      return result.success;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erro ao enviar email',
      }));
      return false;
    }
  }, []);

  // Resetar senha
  const resetPassword = useCallback(
    async (customerId: string, token: string, newPassword: string): Promise<boolean> => {
      try {
        const result = await customerService.resetPassword(customerId, token, newPassword);
        if (result.success && result.customer) {
          setState({
            customer: result.customer,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        }
        setState((prev) => ({ ...prev, error: result.message || 'Erro ao resetar senha' }));
        return false;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Erro ao resetar senha',
        }));
        return false;
      }
    },
    []
  );

  return {
    ...state,
    login,
    logout,
    register,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    recoverPassword,
    resetPassword,
    refetch: checkSession,
  };
}

export default useShopifyAuth;
