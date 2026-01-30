/**
 * Hook para gerenciar carrinho Shopify
 *
 * Este hook sincroniza com o carrinho do Shopify quando configurado.
 * Caso contrário, utiliza o cartStore local (Zustand).
 *
 * NOTA: Use este hook quando quiser integrar diretamente com Shopify.
 * Para funcionalidade básica, continue usando useCartStore do Zustand.
 */

import { useState, useEffect, useCallback } from 'react';
import type { Cart } from '../types';
import cartService from '../services/cartService';
import { isShopifyConfigured } from '../services/shopifyClient';

// ============================================
// TIPOS
// ============================================

interface UseShopifyCartState {
  cart: (Cart & { checkoutUrl: string }) | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

interface UseShopifyCartActions {
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  applyDiscount: (code: string) => Promise<void>;
  clearCart: () => Promise<void>;
  goToCheckout: () => void;
  refetch: () => Promise<void>;
}

// ============================================
// HOOK
// ============================================

export function useShopifyCart(): UseShopifyCartState & UseShopifyCartActions {
  const [state, setState] = useState<UseShopifyCartState>({
    cart: null,
    isLoading: true,
    isUpdating: false,
    error: null,
  });

  // Carregar carrinho inicial
  const fetchCart = useCallback(async () => {
    if (!isShopifyConfigured()) {
      setState({
        cart: {
          id: 'local',
          items: [],
          subtotal: 0,
          total: 0,
          itemCount: 0,
          checkoutUrl: '/checkout',
        },
        isLoading: false,
        isUpdating: false,
        error: null,
      });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const cart = await cartService.getOrCreateCart();
      setState({ cart, isLoading: false, isUpdating: false, error: null });
    } catch (error) {
      setState({
        cart: null,
        isLoading: false,
        isUpdating: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar carrinho',
      });
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Adicionar item
  const addItem = useCallback(async (variantId: string, quantity: number = 1) => {
    if (!isShopifyConfigured()) {
      throw new Error('USE_LOCAL_CART');
    }

    setState((prev) => ({ ...prev, isUpdating: true, error: null }));
    try {
      const cart = await cartService.addToCart(variantId, quantity);
      setState((prev) => ({ ...prev, cart, isUpdating: false }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao adicionar item';
      setState((prev) => ({ ...prev, isUpdating: false, error: message }));
      throw error;
    }
  }, []);

  // Atualizar quantidade
  const updateItem = useCallback(async (lineId: string, quantity: number) => {
    if (!isShopifyConfigured()) {
      throw new Error('USE_LOCAL_CART');
    }

    setState((prev) => ({ ...prev, isUpdating: true, error: null }));
    try {
      const cart = await cartService.updateCartItem(lineId, quantity);
      setState((prev) => ({ ...prev, cart, isUpdating: false }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar item';
      setState((prev) => ({ ...prev, isUpdating: false, error: message }));
      throw error;
    }
  }, []);

  // Remover item
  const removeItem = useCallback(async (lineId: string) => {
    if (!isShopifyConfigured()) {
      throw new Error('USE_LOCAL_CART');
    }

    setState((prev) => ({ ...prev, isUpdating: true, error: null }));
    try {
      const cart = await cartService.removeFromCart(lineId);
      setState((prev) => ({ ...prev, cart, isUpdating: false }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao remover item';
      setState((prev) => ({ ...prev, isUpdating: false, error: message }));
      throw error;
    }
  }, []);

  // Aplicar cupom
  const applyDiscount = useCallback(async (code: string) => {
    if (!isShopifyConfigured()) {
      throw new Error('USE_LOCAL_CART');
    }

    setState((prev) => ({ ...prev, isUpdating: true, error: null }));
    try {
      const cart = await cartService.applyDiscountCode(code);
      setState((prev) => ({ ...prev, cart, isUpdating: false }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Cupom inválido';
      setState((prev) => ({ ...prev, isUpdating: false, error: message }));
      throw error;
    }
  }, []);

  // Limpar carrinho
  const clearCart = useCallback(async () => {
    if (!isShopifyConfigured()) {
      setState((prev) => ({
        ...prev,
        cart: {
          id: 'local',
          items: [],
          subtotal: 0,
          total: 0,
          itemCount: 0,
          checkoutUrl: '/checkout',
        },
      }));
      return;
    }

    setState((prev) => ({ ...prev, isUpdating: true, error: null }));
    try {
      const cart = await cartService.clearCart();
      setState((prev) => ({ ...prev, cart, isUpdating: false }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao limpar carrinho';
      setState((prev) => ({ ...prev, isUpdating: false, error: message }));
      throw error;
    }
  }, []);

  // Ir para checkout
  const goToCheckout = useCallback(() => {
    if (state.cart?.checkoutUrl) {
      window.location.href = state.cart.checkoutUrl;
    }
  }, [state.cart?.checkoutUrl]);

  return {
    ...state,
    addItem,
    updateItem,
    removeItem,
    applyDiscount,
    clearCart,
    goToCheckout,
    refetch: fetchCart,
  };
}

/**
 * Hook simplificado para obter contagem de itens
 */
export function useCartItemCount(): number {
  const { cart } = useShopifyCart();
  return cart?.itemCount || 0;
}

/**
 * Hook simplificado para obter total do carrinho
 */
export function useCartTotal(): number {
  const { cart } = useShopifyCart();
  return cart?.total || 0;
}

export default useShopifyCart;
