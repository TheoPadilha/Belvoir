/**
 * Hook Unificado de Carrinho
 *
 * Re-exporta o useCart do CartContext para manter compatibilidade
 * com imports existentes.
 */

export { useCart, CartProvider } from '../contexts/CartContext';
export { useCart as default } from '../contexts/CartContext';
