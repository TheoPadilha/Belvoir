/**
 * Hooks Index
 *
 * Exporta todos os hooks customizados para facilitar importações.
 *
 * Uso:
 * import { useProducts, useShopifyCart, useShopifyAuth } from '@/hooks';
 */

// Product Hooks
export {
  useProducts,
  useProduct,
  useCollection,
  useFeaturedProducts,
  useRelatedProducts,
  useProductSearch,
  useCategories,
} from './useProducts';

// Shopify Cart Hook
export {
  useShopifyCart,
  useCartItemCount,
  useCartTotal,
} from './useShopifyCart';

// Shopify Auth Hook
export { useShopifyAuth } from './useShopifyAuth';

// Re-export default hooks para conveniência
import useProductsHook from './useProducts';
import useShopifyCartHook from './useShopifyCart';
import useShopifyAuthHook from './useShopifyAuth';

export default {
  ...useProductsHook,
  useShopifyCart: useShopifyCartHook,
  useShopifyAuth: useShopifyAuthHook,
};
