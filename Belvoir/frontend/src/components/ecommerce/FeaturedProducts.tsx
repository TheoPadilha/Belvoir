import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingBag } from 'lucide-react';
import type { Product } from '../../types';

gsap.registerPlugin(ScrollTrigger);

interface FeaturedProductsProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export const FeaturedProducts = ({
  products,
  title = 'Mais Vendidos',
  subtitle = 'Os relógios favoritos dos nossos clientes',
}: FeaturedProductsProps) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cards = gsap.utils.toArray<HTMLElement>('.product-card-featured');

    gsap.fromTo(
      cards,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      }
    );

    // Fallback timeout
    const fallbackTimeout = setTimeout(() => {
      cards.forEach((card) => {
        if (window.getComputedStyle(card).opacity === '0') {
          gsap.set(card, { y: 0, opacity: 1 });
        }
      });
    }, 3000);

    return () => {
      clearTimeout(fallbackTimeout);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [products]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section ref={sectionRef} className="py-20 md:py-24 bg-secondary-50">
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

            return (
              <div
                key={product.id}
                className="product-card-featured group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-500"
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
                  />

                  {/* Badge */}
                  {product.tags?.includes('destaque') && (
                    <div className="absolute top-4 left-4 bg-charcoal text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                      Best Seller
                    </div>
                  )}

                  {product.tags?.includes('novo') && !product.tags?.includes('destaque') && (
                    <div className="absolute top-4 left-4 bg-primary-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                      Novo
                    </div>
                  )}

                  {/* Discount badge */}
                  {discount > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      -{discount}%
                    </div>
                  )}

                  {/* Quick View button (appears on hover) */}
                  <div className="absolute inset-x-4 bottom-4 flex gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    <span className="flex-1 bg-white text-charcoal py-3 rounded-full font-bold text-center hover:bg-secondary-100 transition-colors">
                      Ver Detalhes
                    </span>
                  </div>
                </Link>

                {/* Info */}
                <div className="p-5 md:p-6">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-secondary-300'}`}
                      />
                    ))}
                    <span className="text-sm text-secondary-600 ml-1">(4.9)</span>
                  </div>

                  {/* Name */}
                  <Link to={`/produto/${product.handle}`}>
                    <h3 className="text-lg font-bold text-charcoal mb-3 hover:text-primary-600 transition-colors line-clamp-1">
                      {product.title}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-xl md:text-2xl font-bold text-charcoal">
                      {formatPrice(product.price)}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-sm text-secondary-500 line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                  </div>

                  {/* Add to cart */}
                  <button className="w-full bg-charcoal text-white py-3 rounded-full font-bold hover:bg-primary-600 transition-colors flex items-center justify-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile - View all button */}
        <div className="md:hidden text-center mt-8">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-charcoal text-white rounded-full font-bold"
          >
            <span>Ver Todos os Produtos</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
