/**
 * Cart Context
 *
 * Contexto global para gerenciar o estado do carrinho Shopify
 * compartilhado entre todos os componentes.
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Cart, CartItem } from '../types';
import cartService from '../services/cartService';
import { isShopifyConfigured } from '../services/shopifyClient';
import { useCartStore } from '../store/cartStore';
import { toast } from '../store/uiStore';

// ============================================
// TIPOS
// ============================================

interface CartContextValue {
  // Dados do carrinho
  items: CartItem[];
  subtotal: number;
  total: number;
  itemCount: number;
  checkoutUrl: string;
  isLoading: boolean;
  isUpdating: boolean;

  // UI state
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Ações
  addItem: (item: {
    productId: string;
    variantId: string;
    title: string;
    variantTitle: string;
    price: number;
    quantity: number;
    image: string;
    handle: string;
  }) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  goToCheckout: () => void;
  applyDiscount: (code: string) => Promise<void>;

  // Utilidades
  isShopifyMode: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

// ============================================
// PROVIDER
// ============================================

export function CartProvider({ children }: { children: React.ReactNode }) {
  const isShopify = isShopifyConfigured();

  // Estado do carrinho Shopify
  const [shopifyCart, setShopifyCart] = useState<(Cart & { checkoutUrl: string }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Store local para UI e fallback
  const localStore = useCartStore();

  // Carregar carrinho inicial do Shopify
  useEffect(() => {
    if (!isShopify) {
      setIsLoading(false);
      return;
    }

    const loadCart = async () => {
      try {
        console.log('[CartContext] Loading cart from Shopify...');
        const cart = await cartService.getOrCreateCart();
        console.log('[CartContext] Cart loaded:', cart);
        setShopifyCart(cart);
      } catch (error) {
        console.error('[CartContext] Error loading cart:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [isShopify]);

  // Dados do carrinho - prioriza Shopify quando configurado
  const items: CartItem[] = isShopify
    ? (shopifyCart?.items || [])
    : localStore.items;

  const subtotal = isShopify
    ? (shopifyCart?.subtotal || 0)
    : localStore.getSubtotal();

  const total = isShopify
    ? (shopifyCart?.total || 0)
    : localStore.getSubtotal();

  const itemCount = isShopify
    ? (shopifyCart?.itemCount || 0)
    : localStore.getItemCount();

  const checkoutUrl = isShopify
    ? (shopifyCart?.checkoutUrl || '/checkout')
    : '/checkout';

  // UI state - sempre do store local
  const isOpen = localStore.isOpen;
  const openCart = localStore.openCart;
  const closeCart = localStore.closeCart;
  const toggleCart = localStore.toggleCart;

  // Adicionar item ao carrinho
  const addItem = useCallback(async (item: {
    productId: string;
    variantId: string;
    title: string;
    variantTitle: string;
    price: number;
    quantity: number;
    image: string;
    handle: string;
  }) => {
    console.log('[CartContext] addItem called', { isShopify, variantId: item.variantId });

    if (isShopify) {
      setIsUpdating(true);
      try {
        console.log('[CartContext] Calling cartService.addToCart...');
        const cart = await cartService.addToCart(item.variantId, item.quantity);
        console.log('[CartContext] Cart updated:', cart);
        setShopifyCart(cart);
        localStore.openCart();
        toast.success('Produto adicionado ao carrinho!');
      } catch (error) {
        console.error('[CartContext] Error adding item:', error);
        toast.error('Erro ao adicionar produto');
      } finally {
        setIsUpdating(false);
      }
    } else {
      localStore.addItem(item);
      toast.success('Produto adicionado ao carrinho!');
    }
  }, [isShopify, localStore]);

  // Atualizar quantidade
  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (isShopify) {
      setIsUpdating(true);
      try {
        let cart;
        if (quantity <= 0) {
          cart = await cartService.removeFromCart(itemId);
        } else {
          cart = await cartService.updateCartItem(itemId, quantity);
        }
        setShopifyCart(cart);
      } catch (error) {
        console.error('[CartContext] Error updating item:', error);
        toast.error('Erro ao atualizar quantidade');
      } finally {
        setIsUpdating(false);
      }
    } else {
      localStore.updateQuantity(itemId, quantity);
    }
  }, [isShopify, localStore]);

  // Remover item
  const removeItem = useCallback(async (itemId: string) => {
    if (isShopify) {
      setIsUpdating(true);
      try {
        const cart = await cartService.removeFromCart(itemId);
        setShopifyCart(cart);
      } catch (error) {
        console.error('[CartContext] Error removing item:', error);
        toast.error('Erro ao remover produto');
      } finally {
        setIsUpdating(false);
      }
    } else {
      localStore.removeItem(itemId);
    }
  }, [isShopify, localStore]);

  // Limpar carrinho
  const clearCart = useCallback(async () => {
    if (isShopify) {
      setIsUpdating(true);
      try {
        const cart = await cartService.clearCart();
        setShopifyCart(cart);
      } catch (error) {
        console.error('[CartContext] Error clearing cart:', error);
        toast.error('Erro ao limpar carrinho');
      } finally {
        setIsUpdating(false);
      }
    } else {
      localStore.clearCart();
    }
  }, [isShopify, localStore]);

  // Ir para checkout (usa checkout local com design próprio)
  const goToCheckout = useCallback(() => {
    closeCart();
    window.location.href = '/checkout';
  }, [closeCart]);

  // Aplicar cupom de desconto
  const applyDiscount = useCallback(async (code: string) => {
    if (isShopify) {
      setIsUpdating(true);
      try {
        const cart = await cartService.applyDiscountCode(code);
        setShopifyCart(cart);
        toast.success('Cupom aplicado!');
      } catch (error) {
        console.error('[CartContext] Error applying discount:', error);
        toast.error('Cupom inválido');
        throw error;
      } finally {
        setIsUpdating(false);
      }
    } else {
      toast.error('Cupons disponíveis apenas no checkout');
    }
  }, [isShopify]);

  const value: CartContextValue = {
    items,
    subtotal,
    total,
    itemCount,
    checkoutUrl,
    isLoading,
    isUpdating,
    isOpen,
    openCart,
    closeCart,
    toggleCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    goToCheckout,
    applyDiscount,
    isShopifyMode: isShopify,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
