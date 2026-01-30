import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2, Loader2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../data/products';
import { Button } from '../ui/Button';

export const CartDrawer = () => {
  const {
    items,
    subtotal,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    goToCheckout,
    isLoading,
    isUpdating,
  } = useCart();

  // Prevenir scroll quando drawer está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-secondary-100">
              <div className="flex items-center gap-3">
                <ShoppingBag size={24} className="text-charcoal" />
                <h2 className="font-display text-xl font-semibold">
                  Carrinho ({items.length})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 -mr-2 text-secondary-400 hover:text-charcoal transition-colors"
                aria-label="Fechar carrinho"
              >
                <X size={24} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <Loader2 size={48} className="text-primary-500 animate-spin mb-4" />
                  <p className="text-secondary-500">Carregando carrinho...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <ShoppingBag size={64} className="text-secondary-200 mb-4" />
                  <h3 className="font-display text-xl mb-2">Carrinho vazio</h3>
                  <p className="text-secondary-500 mb-6">
                    Explore nossa coleção e encontre o relógio perfeito para você.
                  </p>
                  <Button onClick={closeCart} variant="secondary">
                    Continuar Comprando
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-secondary-100">
                  {items.map((item) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="p-4"
                    >
                      <div className="flex gap-4">
                        {/* Image */}
                        <Link
                          to={`/produto/${item.handle}`}
                          onClick={closeCart}
                          className="flex-shrink-0"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-24 h-24 object-cover bg-secondary-100"
                          />
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/produto/${item.handle}`}
                            onClick={closeCart}
                            className="font-medium text-charcoal hover:text-primary-500 transition-colors line-clamp-2"
                          >
                            {item.title}
                          </Link>
                          {item.variantTitle && (
                            <p className="text-sm text-secondary-500 mt-1">
                              {item.variantTitle}
                            </p>
                          )}
                          <p className="text-primary-600 font-medium mt-2">
                            {formatPrice(item.price)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-3">
                            <div className={`flex items-center border border-secondary-200 ${isUpdating ? 'opacity-50' : ''}`}>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-2 hover:bg-secondary-50 transition-colors disabled:opacity-50"
                                aria-label="Diminuir quantidade"
                                disabled={isUpdating}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="px-4 py-2 text-sm font-medium min-w-[40px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-2 hover:bg-secondary-50 transition-colors disabled:opacity-50"
                                aria-label="Aumentar quantidade"
                                disabled={isUpdating}
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-secondary-400 hover:text-red-500 transition-colors"
                              aria-label="Remover item"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-secondary-100 p-6 space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-secondary-600">Subtotal</span>
                  <span className="text-xl font-display font-semibold">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <p className="text-sm text-secondary-500">
                  Frete e impostos calculados no checkout
                </p>

                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    fullWidth
                    variant="primary"
                    onClick={goToCheckout}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 size={18} className="animate-spin" />
                        Processando...
                      </span>
                    ) : (
                      'Finalizar Compra'
                    )}
                  </Button>
                  <Button
                    fullWidth
                    variant="secondary"
                    onClick={closeCart}
                  >
                    Continuar Comprando
                  </Button>
                </div>

                {/* Clear Cart */}
                <button
                  onClick={clearCart}
                  className="w-full text-sm text-secondary-500 hover:text-red-500 transition-colors"
                >
                  Limpar carrinho
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
