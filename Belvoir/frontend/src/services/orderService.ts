/**
 * Order Service - Shopify Storefront API
 *
 * Serviço para buscar histórico de pedidos do cliente.
 * Requer cliente autenticado.
 */

import shopifyFetch, { extractShopifyId, isShopifyConfigured } from './shopifyClient';
import { getAccessToken } from './customerService';
import type { Order, OrderItem, Address } from '../types';

// ============================================
// TIPOS SHOPIFY
// ============================================

interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

interface ShopifyOrderLineItem {
  title: string;
  quantity: number;
  variant: {
    id: string;
    title: string;
    price: ShopifyMoney;
    image: {
      url: string;
      altText: string | null;
    } | null;
    product: {
      id: string;
    };
  } | null;
}

interface ShopifyOrder {
  id: string;
  orderNumber: number;
  processedAt: string;
  fulfillmentStatus: string;
  financialStatus: string;
  currentSubtotalPrice: ShopifyMoney;
  currentTotalPrice: ShopifyMoney;
  totalShippingPrice: ShopifyMoney;
  shippingAddress: {
    firstName: string | null;
    lastName: string | null;
    address1: string | null;
    address2: string | null;
    city: string | null;
    province: string | null;
    country: string | null;
    zip: string | null;
    phone: string | null;
  } | null;
  lineItems: {
    edges: Array<{
      node: ShopifyOrderLineItem;
    }>;
  };
  successfulFulfillments: Array<{
    trackingCompany: string | null;
    trackingInfo: Array<{
      number: string | null;
      url: string | null;
    }>;
  }>;
}

// ============================================
// GRAPHQL QUERIES
// ============================================

const ORDER_FRAGMENT = `
  fragment OrderFields on Order {
    id
    orderNumber
    processedAt
    fulfillmentStatus
    financialStatus
    currentSubtotalPrice {
      amount
      currencyCode
    }
    currentTotalPrice {
      amount
      currencyCode
    }
    totalShippingPrice {
      amount
      currencyCode
    }
    shippingAddress {
      firstName
      lastName
      address1
      address2
      city
      province
      country
      zip
      phone
    }
    lineItems(first: 50) {
      edges {
        node {
          title
          quantity
          variant {
            id
            title
            price {
              amount
              currencyCode
            }
            image {
              url
              altText
            }
            product {
              id
            }
          }
        }
      }
    }
    successfulFulfillments(first: 5) {
      trackingCompany
      trackingInfo(first: 1) {
        number
        url
      }
    }
  }
`;

const GET_CUSTOMER_ORDERS_QUERY = `
  ${ORDER_FRAGMENT}
  query GetCustomerOrders($customerAccessToken: String!, $first: Int!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            ...OrderFields
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

// Query reservada para uso futuro com Shopify Admin API
// A Storefront API não permite busca direta por ID de pedido
const _GET_ORDER_BY_ID_QUERY = `
  ${ORDER_FRAGMENT}
  query GetOrderById($customerAccessToken: String!, $orderId: ID!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: 1, query: $orderId) {
        edges {
          node {
            ...OrderFields
          }
        }
      }
    }
  }
`;
void _GET_ORDER_BY_ID_QUERY; // Evitar erro de variável não utilizada

// ============================================
// FUNÇÕES DE MAPEAMENTO
// ============================================

/**
 * Mapeia status de fulfillment do Shopify para tipo local
 */
function mapFulfillmentStatus(
  status: string
): Order['status'] {
  switch (status.toUpperCase()) {
    case 'FULFILLED':
      return 'delivered';
    case 'PARTIALLY_FULFILLED':
    case 'IN_PROGRESS':
      return 'shipped';
    case 'UNFULFILLED':
    case 'SCHEDULED':
      return 'processing';
    case 'ON_HOLD':
      return 'pending';
    default:
      return 'processing';
  }
}

/**
 * Mapeia status financeiro do Shopify para tipo local
 */
function mapFinancialStatus(
  status: string
): Order['financialStatus'] {
  switch (status.toUpperCase()) {
    case 'PAID':
      return 'paid';
    case 'REFUNDED':
      return 'refunded';
    case 'PARTIALLY_REFUNDED':
      return 'partially_refunded';
    case 'PENDING':
    case 'AUTHORIZED':
    default:
      return 'pending';
  }
}

/**
 * Mapeia item de pedido Shopify para tipo local
 */
function mapShopifyOrderItem(item: ShopifyOrderLineItem): OrderItem {
  return {
    id: item.variant?.id ? extractShopifyId(item.variant.id) : `item_${Date.now()}`,
    productId: item.variant?.product?.id ? extractShopifyId(item.variant.product.id) : '',
    title: item.title,
    variantTitle: item.variant?.title || '',
    quantity: item.quantity,
    price: item.variant?.price ? parseFloat(item.variant.price.amount) : 0,
    image: item.variant?.image?.url || '',
  };
}

/**
 * Mapeia endereço de envio Shopify para tipo local
 */
function mapShopifyShippingAddress(
  address: ShopifyOrder['shippingAddress']
): Address {
  return {
    firstName: address?.firstName || '',
    lastName: address?.lastName || '',
    address1: address?.address1 || '',
    address2: address?.address2 || undefined,
    city: address?.city || '',
    state: address?.province || '',
    zipCode: address?.zip || '',
    country: address?.country || 'Brasil',
    phone: address?.phone || '',
  };
}

/**
 * Mapeia pedido Shopify para tipo local
 */
function mapShopifyOrder(order: ShopifyOrder): Order {
  const items = order.lineItems.edges.map((e) => mapShopifyOrderItem(e.node));

  // Buscar tracking do primeiro fulfillment
  const fulfillment = order.successfulFulfillments[0];
  const trackingInfo = fulfillment?.trackingInfo[0];

  return {
    id: extractShopifyId(order.id),
    orderNumber: `#${order.orderNumber}`,
    createdAt: order.processedAt,
    status: mapFulfillmentStatus(order.fulfillmentStatus),
    financialStatus: mapFinancialStatus(order.financialStatus),
    items,
    subtotal: parseFloat(order.currentSubtotalPrice.amount),
    shipping: parseFloat(order.totalShippingPrice.amount),
    total: parseFloat(order.currentTotalPrice.amount),
    shippingAddress: mapShopifyShippingAddress(order.shippingAddress),
    trackingNumber: trackingInfo?.number || undefined,
    trackingUrl: trackingInfo?.url || undefined,
  };
}

// ============================================
// MOCK DATA (para modo demo)
// ============================================

const mockOrders: Order[] = [
  {
    id: 'mock_1',
    orderNumber: '#1001',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias atrás
    status: 'delivered',
    financialStatus: 'paid',
    items: [
      {
        id: '1',
        productId: '1',
        title: 'Relógio Classic Gold',
        variantTitle: 'Dourado / 42mm',
        quantity: 1,
        price: 24990,
        image: '/images/products/watch-1.jpg',
      },
    ],
    subtotal: 24990,
    shipping: 0,
    total: 24990,
    shippingAddress: {
      firstName: 'João',
      lastName: 'Silva',
      address1: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      country: 'Brasil',
      phone: '(11) 99999-9999',
    },
    trackingNumber: 'BR123456789',
    trackingUrl: 'https://rastreamento.correios.com.br/',
  },
  {
    id: 'mock_2',
    orderNumber: '#1002',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias atrás
    status: 'shipped',
    financialStatus: 'paid',
    items: [
      {
        id: '2',
        productId: '2',
        title: 'Relógio Sport Carbon',
        variantTitle: 'Preto / 44mm',
        quantity: 1,
        price: 18990,
        image: '/images/products/watch-2.jpg',
      },
      {
        id: '3',
        productId: '3',
        title: 'Pulseira Extra',
        variantTitle: 'Couro Marrom',
        quantity: 2,
        price: 599,
        image: '/images/products/strap-1.jpg',
      },
    ],
    subtotal: 20188,
    shipping: 4999,
    total: 25187,
    shippingAddress: {
      firstName: 'João',
      lastName: 'Silva',
      address1: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      country: 'Brasil',
      phone: '(11) 99999-9999',
    },
    trackingNumber: 'BR987654321',
    trackingUrl: 'https://rastreamento.correios.com.br/',
  },
];

// ============================================
// FUNÇÕES PÚBLICAS (API DO SERVIÇO)
// ============================================

/**
 * Buscar pedidos do cliente
 */
export async function getCustomerOrders(limit: number = 20): Promise<Order[]> {
  const token = getAccessToken();

  // Se não está logado ou Shopify não está configurado, retorna mock
  if (!token || !isShopifyConfigured()) {
    console.log('[OrderService] Usando pedidos mock');
    return mockOrders;
  }

  const data = await shopifyFetch<{
    customer: {
      orders: {
        edges: Array<{ node: ShopifyOrder }>;
      };
    } | null;
  }>(GET_CUSTOMER_ORDERS_QUERY, {
    customerAccessToken: token,
    first: limit,
  });

  if (!data.customer) {
    return [];
  }

  return data.customer.orders.edges.map((e) => mapShopifyOrder(e.node));
}

/**
 * Buscar pedido específico por ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  const token = getAccessToken();

  // Se não está logado ou Shopify não está configurado, busca no mock
  if (!token || !isShopifyConfigured()) {
    return mockOrders.find((o) => o.id === orderId) || null;
  }

  // Na API Storefront, não podemos buscar diretamente por ID
  // Buscamos todos e filtramos (não ideal para produção com muitos pedidos)
  const orders = await getCustomerOrders(100);
  return orders.find((o) => o.id === orderId) || null;
}

/**
 * Buscar pedido por número
 */
export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const orders = await getCustomerOrders(100);
  const normalizedNumber = orderNumber.replace('#', '');
  return orders.find((o) => o.orderNumber.replace('#', '') === normalizedNumber) || null;
}

/**
 * Buscar pedidos recentes (últimos X dias)
 */
export async function getRecentOrders(days: number = 30): Promise<Order[]> {
  const orders = await getCustomerOrders(50);
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  return orders.filter((o) => new Date(o.createdAt) > cutoffDate);
}

/**
 * Buscar pedidos por status
 */
export async function getOrdersByStatus(status: Order['status']): Promise<Order[]> {
  const orders = await getCustomerOrders(100);
  return orders.filter((o) => o.status === status);
}

/**
 * Obter resumo dos pedidos (para dashboard)
 */
export async function getOrdersSummary(): Promise<{
  total: number;
  pending: number;
  shipped: number;
  delivered: number;
  totalSpent: number;
}> {
  const orders = await getCustomerOrders(100);

  return {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending' || o.status === 'processing').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    totalSpent: orders.reduce((sum, o) => sum + o.total, 0),
  };
}

/**
 * Formatar status para exibição
 */
export function formatOrderStatus(status: Order['status']): string {
  const statusMap: Record<Order['status'], string> = {
    pending: 'Pendente',
    processing: 'Processando',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  };
  return statusMap[status] || status;
}

/**
 * Formatar status financeiro para exibição
 */
export function formatFinancialStatus(status: Order['financialStatus']): string {
  const statusMap: Record<Order['financialStatus'], string> = {
    pending: 'Aguardando Pagamento',
    paid: 'Pago',
    refunded: 'Reembolsado',
    partially_refunded: 'Parcialmente Reembolsado',
  };
  return statusMap[status] || status;
}

/**
 * Obter cor do badge para status
 */
export function getStatusColor(status: Order['status']): string {
  const colorMap: Record<Order['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
}

// Export default
export default {
  getCustomerOrders,
  getOrderById,
  getOrderByNumber,
  getRecentOrders,
  getOrdersByStatus,
  getOrdersSummary,
  formatOrderStatus,
  formatFinancialStatus,
  getStatusColor,
};
