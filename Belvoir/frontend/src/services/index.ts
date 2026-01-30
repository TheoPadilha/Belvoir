/**
 * Services Index
 *
 * Ponto central de exportação de todos os serviços Shopify.
 *
 * CONFIGURAÇÃO:
 * 1. Adicione ao arquivo .env.local:
 *    VITE_SHOPIFY_STORE_DOMAIN=sua-loja.myshopify.com
 *    VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=seu_token
 *
 * 2. Para obter as credenciais:
 *    - Acesse seu Shopify Admin
 *    - Vá em Settings > Apps and sales channels > Develop apps
 *    - Crie um app privado
 *    - Ative Storefront API access
 *    - Gere o Storefront access token
 *
 * USO:
 * import { productService, cartService, customerService } from '@/services';
 *
 * // Buscar produtos
 * const products = await productService.getAllProducts();
 *
 * // Adicionar ao carrinho
 * await cartService.addToCart(variantId, 1);
 *
 * // Login
 * await customerService.login(email, password);
 */

// Shopify Client - importar para uso local
import { isShopifyConfigured as checkShopifyConfig } from './shopifyClient';

// Re-exportar Shopify Client
export {
  shopifyConfig,
  isShopifyConfigured,
  shopifyFetch,
  ShopifyError,
  extractShopifyId,
  createShopifyGid,
  formatShopifyPrice,
  SHOPIFY_API_VERSION,
} from './shopifyClient';

// Product Service
export { default as productService } from './productService';
export {
  getAllProducts,
  getProductByHandle,
  getProductsByCollection,
  getAllCollections,
  searchProducts,
  getFeaturedProducts,
  getRelatedProducts,
} from './productService';

// Cart Service
export { default as cartService } from './cartService';
export {
  createCart,
  getOrCreateCart,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  applyDiscountCode,
  clearCart,
  getCheckoutUrl,
} from './cartService';

// Checkout Service
export { default as checkoutService } from './checkoutService';
export {
  updateBuyerIdentity,
  updateCartAttributes,
  updateCartNote,
  redirectToCheckout,
  getAvailableShippingMethods,
  calculateShipping,
} from './checkoutService';

// Customer Service
export { default as customerService } from './customerService';
export {
  createCustomer,
  login,
  logout,
  getCustomer,
  isLoggedIn,
  getAccessToken,
  updateCustomer,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  recoverPassword,
  resetPassword,
} from './customerService';

// Order Service
export { default as orderService } from './orderService';
export {
  getCustomerOrders,
  getOrderById,
  getOrderByNumber,
  getRecentOrders,
  getOrdersByStatus,
  getOrdersSummary,
  formatOrderStatus,
  formatFinancialStatus,
  getStatusColor,
} from './orderService';

/**
 * Status da configuração do Shopify
 * Útil para debug e verificação
 */
export function getShopifyStatus() {
  const configured = checkShopifyConfig();

  return {
    configured,
    mode: configured ? 'production' : 'demo',
    message: configured
      ? 'Shopify configurado e pronto para uso'
      : 'Modo demonstração - adicione credenciais ao .env.local para conectar ao Shopify',
  };
}
