/**
 * Hook Unificado de Carrinho
 *
 * Combina o useShopifyCart (para dados do carrinho Shopify) com
 * o useCartStore (para estado da UI como isOpen).
 *
 * Este é o hook principal que deve ser usado em toda a aplicação.
 */

import { useCallback } from 'react';
import { useShopifyCart } from './useShopifyCart';
import { useCartStore } from '../store/cartStore';
import { isShopifyConfigured } from '../services/shopifyClient';
import { toast } from '../store/uiStore';
import type { CartItem } from '../types';

export function useCart() {
  // Hook do Shopify para dados do carrinho
  const shopifyCart = useShopifyCart();

  // Store local para UI e fallback
  const localStore = useCartStore();

  const isShopify = isShopifyConfigured();

  // Dados do carrinho - prioriza Shopify quando configurado
  const items: CartItem[] = isShopify
    ? (shopifyCart.cart?.items || [])
    : localStore.items;

  const subtotal = isShopify
    ? (shopifyCart.cart?.subtotal || 0)
    : localStore.getSubtotal();

  const total = isShopify
    ? (shopifyCart.cart?.total || 0)
    : localStore.getSubtotal(); // Local não tem taxas, então total = subtotal

  const itemCount = isShopify
    ? (shopifyCart.cart?.itemCount || 0)
    : localStore.getItemCount();

  const checkoutUrl = isShopify
    ? (shopifyCart.cart?.checkoutUrl || '/checkout')
    : '/checkout';

  const isLoading = shopifyCart.isLoading;
  const isUpdating = shopifyCart.isUpdating;

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
    if (isShopify) {
      try {
        await shopifyCart.addItem(item.variantId, item.quantity);
        localStore.openCart(); // Abre o drawer
        toast.success('Produto adicionado ao carrinho!');
      } catch (error) {
        console.error('Erro ao adicionar ao carrinho Shopify:', error);
        toast.error('Erro ao adicionar produto');
      }
    } else {
      // Fallback para store local
      localStore.addItem(item);
      toast.success('Produto adicionado ao carrinho!');
    }
  }, [isShopify, shopifyCart, localStore]);

  // Atualizar quantidade
  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (isShopify) {
      try {
        if (quantity <= 0) {
          await shopifyCart.removeItem(itemId);
        } else {
          await shopifyCart.updateItem(itemId, quantity);
        }
      } catch (error) {
        console.error('Erro ao atualizar carrinho:', error);
        toast.error('Erro ao atualizar quantidade');
      }
    } else {
      localStore.updateQuantity(itemId, quantity);
    }
  }, [isShopify, shopifyCart, localStore]);

  // Remover item
  const removeItem = useCallback(async (itemId: string) => {
    if (isShopify) {
      try {
        await shopifyCart.removeItem(itemId);
      } catch (error) {
        console.error('Erro ao remover item:', error);
        toast.error('Erro ao remover produto');
      }
    } else {
      localStore.removeItem(itemId);
    }
  }, [isShopify, shopifyCart, localStore]);

  // Limpar carrinho
  const clearCart = useCallback(async () => {
    if (isShopify) {
      try {
        await shopifyCart.clearCart();
      } catch (error) {
        console.error('Erro ao limpar carrinho:', error);
        toast.error('Erro ao limpar carrinho');
      }
    } else {
      localStore.clearCart();
    }
  }, [isShopify, shopifyCart, localStore]);

  // Ir para checkout
  const goToCheckout = useCallback(() => {
    if (isShopify && shopifyCart.cart?.checkoutUrl) {
      // Redireciona para checkout do Shopify
      window.location.href = shopifyCart.cart.checkoutUrl;
    } else {
      // Fallback para página local de checkout
      window.location.href = '/checkout';
    }
  }, [isShopify, shopifyCart.cart?.checkoutUrl]);

  // Aplicar cupom de desconto
  const applyDiscount = useCallback(async (code: string) => {
    if (isShopify) {
      try {
        await shopifyCart.applyDiscount(code);
        toast.success('Cupom aplicado!');
      } catch (error) {
        console.error('Erro ao aplicar cupom:', error);
        toast.error('Cupom inválido');
        throw error;
      }
    } else {
      toast.error('Cupons disponíveis apenas no checkout');
    }
  }, [isShopify, shopifyCart]);

  return {
    // Dados do carrinho
    items,
    subtotal,
    total,
    itemCount,
    checkoutUrl,
    isLoading,
    isUpdating,

    // UI state
    isOpen,
    openCart,
    closeCart,
    toggleCart,

    // Ações
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    goToCheckout,
    applyDiscount,

    // Utilidades
    isShopifyMode: isShopify,
  };
}

export default useCart;
