import { useEffect, useRef, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import type { Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import { StarRating } from '../reviews/StarRating';
import { getReviewSummaryByProductId } from '../../data/reviews';

gsap.registerPlugin(ScrollTrigger);

interface FeaturedProductsProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

// Otimização: Memoização para evitar re-renderizações desnecessárias
export const FeaturedProducts = memo(({
  products,
  title = 'Mais Vendidos',
  subtitle = 'Os relógios favoritos dos nossos clientes',
}: FeaturedProductsProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { addItem, isUpdating } = useCart();

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const variant = product.variants?.[0];
    if (!variant) {
      console.error('Product has no variants');
      return;
    }

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

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set('.product-card-featured', { opacity: 1, y: 0 });
      return;
    }

    const cards = gsap.utils.toArray<HTMLElement>('.product-card-featured');

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [products]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section ref={sectionRef} className="py-20 md:py-24 bg-secondary-50 overflow-hidden">
      <div className="container-custom">
        {/* Header - Centered */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-sm uppercase tracking-[0.3em] text-primary-500 mb-4 block">
            Destaques
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal mb-3">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-secondary-600 mb-6">{subtitle}</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-lg font-medium text-charcoal hover:text-primary-600 hover:gap-4 transition-all"
          >
            <span>Ver Todos</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => {
            const discount = product.compareAtPrice
              ? Math.round((1 - product.price / product.compareAtPrice) * 100)
              : 0;
            const reviewSummary = getReviewSummaryByProductId(product.id);

            return (
              <div
                key={product.id}
                className="product-card-featured group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
              >
                {/* Image */}
                <Link
                  to={`/produto/${product.handle}`}
                  className="relative block aspect-square overflow-hidden bg-secondary-100"
                >
                  <img
                    src={product.images[0]?.src}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.tags?.includes('destaque') && (
                      <div className="bg-charcoal text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                        Best Seller
                      </div>
                    )}
                    {product.tags?.includes('novo') && !product.tags?.includes('destaque') && (
                      <div className="bg-primary-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                        Novo
                      </div>
                    )}
                  </div>

                  {/* Discount badge */}
                  {discount > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
                      -{discount}%
                    </div>
                  )}

                  {/* Quick View overlay */}
                  <div className="absolute inset-0 bg-charcoal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-white text-charcoal px-6 py-2 rounded-full font-bold text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      Ver Detalhes
                    </span>
                  </div>
                </Link>

                {/* Info */}
                <div className="p-5 md:p-6 flex flex-col flex-1">
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={reviewSummary.averageRating || 4.8} size="sm" />
                    <span className="text-xs text-secondary-500">({reviewSummary.totalReviews || 12})</span>
                  </div>

                  {/* Name */}
                  <Link to={`/produto/${product.handle}`} className="flex-1">
                    <h3 className="text-lg font-bold text-charcoal mb-2 hover:text-primary-600 transition-colors line-clamp-1">
                      {product.title}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-xl font-bold text-charcoal">
                      {formatPrice(product.price)}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-sm text-secondary-400 line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                  </div>

                  {/* Add to cart */}
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={isUpdating || !product.available}
                    className="w-full bg-charcoal text-white py-3 rounded-xl font-bold hover:bg-primary-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShoppingBag className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    )}
                    <span className="text-sm">{product.available ? 'Adicionar ao Carrinho' : 'Indisponível'}</span>
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
