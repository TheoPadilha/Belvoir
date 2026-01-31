import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import type { Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import { StarRating } from '../reviews/StarRating';
import { getReviewSummaryByProductId } from '../../data/reviews';

interface FeaturedProductsProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

// Versão Ultra-Leve: Removido GSAP e ScrollTrigger. Foco em velocidade de carregamento.
export const FeaturedProducts = memo(({
  products,
  title = 'Mais Vendidos',
  subtitle = 'Os relógios favoritos dos nossos clientes',
}: FeaturedProductsProps) => {
  const { addItem, isUpdating } = useCart();

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const variant = product.variants?.[0];
    if (!variant) return;

    await addItem({
      productId: product.id,
      variantId: variant.id,
      title: product.title,
      variantTitle: variant.title || 'Default',
      price: product.price,
      quantity: 1,
      image: product.images[0]?.src || '',
      handle: product.handle,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="py-16 md:py-20 bg-secondary-50">
      <div className="container-custom">
        <div className="text-center mb-10 md:mb-12">
          <span className="text-sm uppercase tracking-[0.2em] text-primary-500 mb-2 block">
            Destaques
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-charcoal mb-3">
            {title}
          </h2>
          <p className="text-base text-secondary-600 mb-6">{subtitle}</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-charcoal hover:text-primary-600 transition-all"
          >
            <span>Ver Todos</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => {
            const discount = product.compareAtPrice
              ? Math.round((1 - product.price / product.compareAtPrice) * 100)
              : 0;
            const reviewSummary = getReviewSummaryByProductId(product.id);

            return (
              <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                <Link to={`/produto/${product.handle}`} className="relative block aspect-square bg-secondary-100">
                  <img
                    src={product.images[0]?.src}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {discount > 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                      -{discount}%
                    </div>
                  )}
                </Link>

                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={reviewSummary.averageRating || 4.8} size="sm" />
                    <span className="text-[10px] text-secondary-500">({reviewSummary.totalReviews || 12})</span>
                  </div>

                  <Link to={`/produto/${product.handle}`} className="flex-1">
                    <h3 className="text-base font-bold text-charcoal mb-2 hover:text-primary-600 line-clamp-1">
                      {product.title}
                    </h3>
                  </Link>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-lg font-bold text-charcoal">{formatPrice(product.price)}</span>
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={isUpdating || !product.available}
                    className="w-full bg-charcoal text-white py-2.5 rounded-lg font-bold hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingBag className="w-4 h-4" />}
                    <span className="text-xs">{product.available ? 'Adicionar' : 'Indisponível'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

FeaturedProducts.displayName = 'FeaturedProducts';
export default FeaturedProducts;
