/**
 * Checkout Service - Shopify Storefront API
 *
 * O Shopify usa checkout hospedado (hosted checkout), então este serviço
 * principalmente prepara os dados e redireciona para o checkout do Shopify.
 *
 * Para checkout customizado completo, seria necessário usar a Checkout API
 * (disponível apenas para Shopify Plus) ou implementar com Shopify Functions.
 */

import shopifyFetch, { isShopifyConfigured } from './shopifyClient';
import { getOrCreateCart } from './cartService';
import type { Address, ShippingMethod } from '../types';

// ============================================
// TIPOS
// ============================================

interface ShopifyAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string | null;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone: string | null;
}

// ============================================
// GRAPHQL MUTATIONS
// ============================================

const UPDATE_CART_BUYER_IDENTITY_MUTATION = `
  mutation UpdateCartBuyerIdentity($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        id
        checkoutUrl
        buyerIdentity {
          email
          phone
          customer {
            id
            email
          }
          deliveryAddressPreferences {
            ... on MailingAddress {
              address1
              city
              country
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const UPDATE_CART_ATTRIBUTES_MUTATION = `
  mutation UpdateCartAttributes($cartId: ID!, $attributes: [AttributeInput!]!) {
    cartAttributesUpdate(cartId: $cartId, attributes: $attributes) {
      cart {
        id
        attributes {
          key
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const UPDATE_CART_NOTE_MUTATION = `
  mutation UpdateCartNote($cartId: ID!, $note: String!) {
    cartNoteUpdate(cartId: $cartId, note: $note) {
      cart {
        id
        note
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Mapeia endereço local para formato Shopify
 */
function mapAddressToShopify(address: Address): Partial<ShopifyAddress> {
  return {
    firstName: address.firstName,
    lastName: address.lastName,
    address1: address.address1,
    address2: address.address2 || null,
    city: address.city,
    province: address.state,
    country: address.country || 'BR',
    zip: address.zipCode,
    phone: address.phone || null,
  };
}

// ============================================
// FUNÇÕES PÚBLICAS (API DO SERVIÇO)
// ============================================

/**
 * Atualizar informações do comprador no carrinho
 * Isso pré-preenche dados no checkout do Shopify
 */
export async function updateBuyerIdentity(
  email: string,
  phone?: string,
  shippingAddress?: Address
): Promise<{ success: boolean; checkoutUrl: string }> {
  if (!isShopifyConfigured()) {
    return { success: true, checkoutUrl: '/checkout' };
  }

  const cart = await getOrCreateCart();

  const buyerIdentity: Record<string, unknown> = {
    email,
  };

  if (phone) {
    buyerIdentity.phone = phone;
  }

  if (shippingAddress) {
    buyerIdentity.deliveryAddressPreferences = [
      {
        deliveryAddress: mapAddressToShopify(shippingAddress),
      },
    ];
  }

  const data = await shopifyFetch<{
    cartBuyerIdentityUpdate: {
      cart: { id: string; checkoutUrl: string };
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(UPDATE_CART_BUYER_IDENTITY_MUTATION, {
    cartId: cart.id,
    buyerIdentity,
  });

  if (data.cartBuyerIdentityUpdate.userErrors.length > 0) {
    throw new Error(data.cartBuyerIdentityUpdate.userErrors[0].message);
  }

  return {
    success: true,
    checkoutUrl: data.cartBuyerIdentityUpdate.cart.checkoutUrl,
  };
}

/**
 * Adicionar atributos customizados ao carrinho
 * Útil para tracking, notas internas, etc.
 */
export async function updateCartAttributes(
  attributes: Array<{ key: string; value: string }>
): Promise<boolean> {
  if (!isShopifyConfigured()) {
    return true;
  }

  const cart = await getOrCreateCart();

  const data = await shopifyFetch<{
    cartAttributesUpdate: {
      cart: { id: string };
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(UPDATE_CART_ATTRIBUTES_MUTATION, {
    cartId: cart.id,
    attributes,
  });

  if (data.cartAttributesUpdate.userErrors.length > 0) {
    throw new Error(data.cartAttributesUpdate.userErrors[0].message);
  }

  return true;
}

/**
 * Adicionar nota ao pedido
 */
export async function updateCartNote(note: string): Promise<boolean> {
  if (!isShopifyConfigured()) {
    return true;
  }

  const cart = await getOrCreateCart();

  const data = await shopifyFetch<{
    cartNoteUpdate: {
      cart: { id: string };
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(UPDATE_CART_NOTE_MUTATION, {
    cartId: cart.id,
    note,
  });

  if (data.cartNoteUpdate.userErrors.length > 0) {
    throw new Error(data.cartNoteUpdate.userErrors[0].message);
  }

  return true;
}

/**
 * Obter URL do checkout com dados pré-preenchidos
 */
export async function getCheckoutUrl(options?: {
  email?: string;
  phone?: string;
  shippingAddress?: Address;
  note?: string;
}): Promise<string> {
  if (!isShopifyConfigured()) {
    return '/checkout';
  }

  const cart = await getOrCreateCart();
  let checkoutUrl = cart.checkoutUrl;

  // Atualizar buyer identity se fornecido
  if (options?.email || options?.shippingAddress) {
    const result = await updateBuyerIdentity(
      options.email || '',
      options.phone,
      options.shippingAddress
    );
    checkoutUrl = result.checkoutUrl;
  }

  // Adicionar nota se fornecida
  if (options?.note) {
    await updateCartNote(options.note);
  }

  return checkoutUrl;
}

/**
 * Redirecionar para o checkout do Shopify
 */
export async function redirectToCheckout(options?: {
  email?: string;
  phone?: string;
  shippingAddress?: Address;
  note?: string;
}): Promise<void> {
  const checkoutUrl = await getCheckoutUrl(options);

  if (checkoutUrl.startsWith('http')) {
    window.location.href = checkoutUrl;
  } else {
    // Checkout local (modo demo)
    window.location.href = checkoutUrl;
  }
}

/**
 * Métodos de envio disponíveis (mock para modo demo)
 * No Shopify real, isso é calculado automaticamente no checkout
 */
export function getAvailableShippingMethods(): ShippingMethod[] {
  return [
    {
      id: 'standard',
      title: 'Entrega Padrão',
      price: 0,
      estimatedDays: '7-10 dias úteis',
    },
    {
      id: 'express',
      title: 'Entrega Expressa',
      price: 4999, // R$ 49,99
      estimatedDays: '2-3 dias úteis',
    },
    {
      id: 'same-day',
      title: 'Entrega no Mesmo Dia',
      price: 9999, // R$ 99,99
      estimatedDays: 'Hoje (pedidos até 12h)',
    },
  ];
}

/**
 * Calcular frete por CEP (mock - no Shopify real é automático)
 */
export async function calculateShipping(
  zipCode: string
): Promise<ShippingMethod[]> {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500));

  // No modo real do Shopify, o frete é calculado no checkout
  // Este é apenas um mock para demonstração
  const methods = getAvailableShippingMethods();

  // Lógica simples baseada no CEP
  const region = zipCode.substring(0, 2);

  // CEPs de SP (01-19) têm entrega no mesmo dia
  if (parseInt(region) >= 1 && parseInt(region) <= 19) {
    return methods;
  }

  // Outras regiões não têm entrega no mesmo dia
  return methods.filter((m) => m.id !== 'same-day');
}

// Export default
export default {
  updateBuyerIdentity,
  updateCartAttributes,
  updateCartNote,
  getCheckoutUrl,
  redirectToCheckout,
  getAvailableShippingMethods,
  calculateShipping,
};
