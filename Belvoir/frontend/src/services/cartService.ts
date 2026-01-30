/**
 * Cart Service - Shopify Storefront API
 *
 * Serviço para gerenciar o carrinho de compras usando a Cart API do Shopify.
 * Usa localStorage para persistir o cartId entre sessões.
 */

import shopifyFetch, {
  createShopifyGid,
  extractShopifyId,
  isShopifyConfigured,
} from './shopifyClient';
import type { Cart, CartItem } from '../types';

// ============================================
// TIPOS SHOPIFY (Respostas da API)
// ============================================

interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      id: string;
      title: string;
      handle: string;
      featuredImage: {
        url: string;
        altText: string | null;
      } | null;
    };
    price: ShopifyMoney;
    compareAtPrice: ShopifyMoney | null;
  };
}

interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyMoney;
    totalAmount: ShopifyMoney;
    totalTaxAmount: ShopifyMoney | null;
  };
  lines: {
    edges: Array<{
      node: ShopifyCartLine;
    }>;
  };
}

// ============================================
// GRAPHQL FRAGMENTS
// ============================================

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              product {
                id
                title
                handle
                featuredImage {
                  url
                  altText
                }
              }
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

// ============================================
// GRAPHQL MUTATIONS
// ============================================

const CREATE_CART_MUTATION = `
  ${CART_FRAGMENT}
  mutation CreateCart($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const GET_CART_QUERY = `
  ${CART_FRAGMENT}
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
`;

const ADD_TO_CART_MUTATION = `
  ${CART_FRAGMENT}
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const UPDATE_CART_LINE_MUTATION = `
  ${CART_FRAGMENT}
  mutation UpdateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const REMOVE_FROM_CART_MUTATION = `
  ${CART_FRAGMENT}
  mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const APPLY_DISCOUNT_MUTATION = `
  ${CART_FRAGMENT}
  mutation ApplyDiscount($cartId: ID!, $discountCodes: [String!]!) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// ============================================
// STORAGE KEYS
// ============================================

const CART_ID_KEY = 'belvoir_cart_id';
const CART_CACHE_KEY = 'belvoir_cart_cache';

// ============================================
// FUNÇÕES DE MAPEAMENTO
// ============================================

/**
 * Mapeia item do carrinho Shopify para tipo local
 */
function mapShopifyCartLine(line: ShopifyCartLine): CartItem {
  return {
    id: line.id,
    productId: extractShopifyId(line.merchandise.product.id),
    variantId: extractShopifyId(line.merchandise.id),
    title: line.merchandise.product.title,
    variantTitle: line.merchandise.title,
    price: parseFloat(line.merchandise.price.amount),
    quantity: line.quantity,
    image: line.merchandise.product.featuredImage?.url || '',
    handle: line.merchandise.product.handle,
  };
}

/**
 * Mapeia carrinho Shopify para tipo local
 */
function mapShopifyCart(cart: ShopifyCart): Cart & { checkoutUrl: string } {
  const items = cart.lines.edges.map((e) => mapShopifyCartLine(e.node));
  return {
    id: cart.id,
    items,
    subtotal: parseFloat(cart.cost.subtotalAmount.amount),
    total: parseFloat(cart.cost.totalAmount.amount),
    itemCount: cart.totalQuantity,
    checkoutUrl: cart.checkoutUrl,
  };
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Salvar cartId no localStorage
 */
function saveCartId(cartId: string): void {
  try {
    localStorage.setItem(CART_ID_KEY, cartId);
  } catch (error) {
    console.warn('Erro ao salvar cartId:', error);
  }
}

/**
 * Recuperar cartId do localStorage
 */
function getStoredCartId(): string | null {
  try {
    return localStorage.getItem(CART_ID_KEY);
  } catch {
    return null;
  }
}

/**
 * Limpar cartId do localStorage
 */
function clearCartId(): void {
  try {
    localStorage.removeItem(CART_ID_KEY);
    localStorage.removeItem(CART_CACHE_KEY);
  } catch (error) {
    console.warn('Erro ao limpar cartId:', error);
  }
}

// ============================================
// FUNÇÕES PÚBLICAS (API DO SERVIÇO)
// ============================================

/**
 * Criar um novo carrinho
 */
export async function createCart(
  lines?: Array<{ merchandiseId: string; quantity: number }>
): Promise<Cart & { checkoutUrl: string }> {
  // Se Shopify não está configurado, retorna cart vazio
  if (!isShopifyConfigured()) {
    console.log('[CartService] Shopify não configurado, usando cart local');
    return {
      id: `local_${Date.now()}`,
      items: [],
      subtotal: 0,
      total: 0,
      itemCount: 0,
      checkoutUrl: '/checkout',
    };
  }

  const formattedLines = lines?.map((line) => ({
    merchandiseId: line.merchandiseId.startsWith('gid://')
      ? line.merchandiseId
      : createShopifyGid('ProductVariant', line.merchandiseId),
    quantity: line.quantity,
  }));

  const data = await shopifyFetch<{
    cartCreate: {
      cart: ShopifyCart;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(CREATE_CART_MUTATION, { lines: formattedLines });

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  const cart = mapShopifyCart(data.cartCreate.cart);
  saveCartId(cart.id);
  return cart;
}

/**
 * Buscar carrinho existente ou criar novo
 */
export async function getOrCreateCart(): Promise<Cart & { checkoutUrl: string }> {
  // Se Shopify não está configurado, retorna cart local vazio
  if (!isShopifyConfigured()) {
    return {
      id: `local_${Date.now()}`,
      items: [],
      subtotal: 0,
      total: 0,
      itemCount: 0,
      checkoutUrl: '/checkout',
    };
  }

  const storedCartId = getStoredCartId();

  if (storedCartId) {
    try {
      const cart = await getCart(storedCartId);
      if (cart) return cart;
    } catch {
      // Cart expirou ou não existe mais
      clearCartId();
    }
  }

  return createCart();
}

/**
 * Buscar carrinho por ID
 */
export async function getCart(cartId: string): Promise<(Cart & { checkoutUrl: string }) | null> {
  if (!isShopifyConfigured()) {
    return null;
  }

  const data = await shopifyFetch<{
    cart: ShopifyCart | null;
  }>(GET_CART_QUERY, { cartId });

  if (!data.cart) return null;
  return mapShopifyCart(data.cart);
}

/**
 * Adicionar item ao carrinho
 */
export async function addToCart(
  variantId: string,
  quantity: number = 1
): Promise<Cart & { checkoutUrl: string }> {
  // Se Shopify não está configurado, retorna indicando que deve usar store local
  if (!isShopifyConfigured()) {
    throw new Error('USE_LOCAL_CART');
  }

  const cart = await getOrCreateCart();

  const data = await shopifyFetch<{
    cartLinesAdd: {
      cart: ShopifyCart;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(ADD_TO_CART_MUTATION, {
    cartId: cart.id,
    lines: [
      {
        merchandiseId: variantId.startsWith('gid://')
          ? variantId
          : createShopifyGid('ProductVariant', variantId),
        quantity,
      },
    ],
  });

  if (data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(data.cartLinesAdd.userErrors[0].message);
  }

  return mapShopifyCart(data.cartLinesAdd.cart);
}

/**
 * Atualizar quantidade de um item
 */
export async function updateCartItem(
  lineId: string,
  quantity: number
): Promise<Cart & { checkoutUrl: string }> {
  if (!isShopifyConfigured()) {
    throw new Error('USE_LOCAL_CART');
  }

  const storedCartId = getStoredCartId();
  if (!storedCartId) {
    throw new Error('Carrinho não encontrado');
  }

  const data = await shopifyFetch<{
    cartLinesUpdate: {
      cart: ShopifyCart;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(UPDATE_CART_LINE_MUTATION, {
    cartId: storedCartId,
    lines: [
      {
        id: lineId,
        quantity,
      },
    ],
  });

  if (data.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(data.cartLinesUpdate.userErrors[0].message);
  }

  return mapShopifyCart(data.cartLinesUpdate.cart);
}

/**
 * Remover item do carrinho
 */
export async function removeFromCart(
  lineId: string
): Promise<Cart & { checkoutUrl: string }> {
  if (!isShopifyConfigured()) {
    throw new Error('USE_LOCAL_CART');
  }

  const storedCartId = getStoredCartId();
  if (!storedCartId) {
    throw new Error('Carrinho não encontrado');
  }

  const data = await shopifyFetch<{
    cartLinesRemove: {
      cart: ShopifyCart;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(REMOVE_FROM_CART_MUTATION, {
    cartId: storedCartId,
    lineIds: [lineId],
  });

  if (data.cartLinesRemove.userErrors.length > 0) {
    throw new Error(data.cartLinesRemove.userErrors[0].message);
  }

  return mapShopifyCart(data.cartLinesRemove.cart);
}

/**
 * Aplicar código de desconto
 */
export async function applyDiscountCode(
  code: string
): Promise<Cart & { checkoutUrl: string }> {
  if (!isShopifyConfigured()) {
    throw new Error('USE_LOCAL_CART');
  }

  const storedCartId = getStoredCartId();
  if (!storedCartId) {
    throw new Error('Carrinho não encontrado');
  }

  const data = await shopifyFetch<{
    cartDiscountCodesUpdate: {
      cart: ShopifyCart;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>(APPLY_DISCOUNT_MUTATION, {
    cartId: storedCartId,
    discountCodes: [code],
  });

  if (data.cartDiscountCodesUpdate.userErrors.length > 0) {
    throw new Error(data.cartDiscountCodesUpdate.userErrors[0].message);
  }

  return mapShopifyCart(data.cartDiscountCodesUpdate.cart);
}

/**
 * Limpar carrinho (criar um novo vazio)
 */
export async function clearCart(): Promise<Cart & { checkoutUrl: string }> {
  clearCartId();
  return createCart();
}

/**
 * Obter URL do checkout
 */
export async function getCheckoutUrl(): Promise<string> {
  if (!isShopifyConfigured()) {
    return '/checkout';
  }

  const cart = await getOrCreateCart();
  return cart.checkoutUrl;
}

// Export default
export default {
  createCart,
  getOrCreateCart,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  applyDiscountCode,
  clearCart,
  getCheckoutUrl,
};
