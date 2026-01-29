import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Product } from '../../types';

gsap.registerPlugin(ScrollTrigger);

interface ProductGalleryParallaxProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export const ProductGalleryParallax = ({
  products,
  title = 'Coleção Premium',
  subtitle = 'Peças que definem elegância',
}: ProductGalleryParallaxProps) => {
  const galleryRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  // Start visible by default to ensure content is never hidden
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    // 3D hover effects for cards
    const cards = gallery.querySelectorAll('.product-card-parallax');
    cards.forEach((card) => {
      const handleMouseMove = (e: Event) => {
        const mouseEvent = e as MouseEvent;
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = mouseEvent.clientX - rect.left;
        const y = mouseEvent.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;

        gsap.to(card, {
          rotationX: rotateX,
          rotationY: rotateY,
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out',
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out',
        });
      };

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      // Cleanup mouse event listeners
      cards.forEach((card) => {
        card.replaceWith(card.cloneNode(true));
      });
    };
  }, [products]);

  return (
    <section
      ref={galleryRef}
      className="relative py-24 md:py-32 bg-cream overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative">
        {/* Section Header */}
        <div className={`text-center mb-16 md:mb-24 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <span className="text-sm uppercase tracking-[0.3em] text-primary-500 mb-4 block">
            Destaques
          </span>
          <h2
            ref={titleRef}
            className="font-display text-5xl md:text-6xl lg:text-7xl text-charcoal mb-4"
          >
            {title}
          </h2>
          <p className="text-secondary-500 text-lg max-w-xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {products.slice(0, 6).map((product, index) => (
            <Link
              key={product.id}
              to={`/produto/${product.handle}`}
              className={`product-card-parallax group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'center center',
                transitionDelay: `${index * 100}ms`,
              }}
            >
              {/* Image container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-secondary-50">
                <img
                  src={product.images[0]?.src}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Quick view button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="px-6 py-3 bg-white text-charcoal rounded-full font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    Ver Detalhes
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>

                {/* Badge for new products */}
                {product.tags?.includes('novo') && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-charcoal text-white text-xs uppercase tracking-wider rounded-full">
                    Novo
                  </span>
                )}
              </div>

              {/* Product info */}
              <div className="p-6">
                <h3 className="font-display text-xl text-charcoal mb-2 group-hover:text-primary-600 transition-colors">
                  {product.title}
                </h3>
                <p className="text-secondary-500 text-sm mb-3 line-clamp-2">
                  {product.shortDescription}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-charcoal">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(product.price)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-sm text-secondary-400 line-through">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(product.compareAtPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Shine effect on hover */}
              <div
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ transform: 'rotate(45deg) translateX(-100%)' }}
              />
            </Link>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-16">
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 px-8 py-4 border-2 border-charcoal text-charcoal rounded-full font-medium hover:bg-charcoal hover:text-white transition-all duration-300 group"
          >
            Ver Toda a Coleção
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGalleryParallax;
