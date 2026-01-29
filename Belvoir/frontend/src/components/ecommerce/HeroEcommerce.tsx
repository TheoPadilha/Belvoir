import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import type { Product } from '../../types';

interface HeroEcommerceProps {
  product?: Product;
}

export const HeroEcommerce = ({ product }: HeroEcommerceProps) => {
  const mainRef = useRef<HTMLElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isAnimated, setIsAnimated] = useState(true); // Start visible by default
  const [imageLoaded, setImageLoaded] = useState(false);

  // Default product data if none provided - using a reliable watch image
  const heroProduct = product || {
    id: 'hero-product',
    handle: 'belvoir-premium-2026',
    title: 'Belvoir Premium 2026',
    price: 24900,
    compareAtPrice: 32500,
    images: [{ src: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&q=80', alt: 'Relógio Premium' }],
    shortDescription: 'Onde o design encontra a precisão. Cada relógio é uma obra de arte que transcende o tempo.',
    tags: ['novo', 'destaque'],
  };

  const discount = heroProduct.compareAtPrice
    ? Math.round((1 - heroProduct.price / heroProduct.compareAtPrice) * 100)
    : 0;

  useEffect(() => {
    const main = mainRef.current;
    const outer = outerRef.current;
    const inner = innerRef.current;

    if (!main || !outer || !inner) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsAnimated(true);
      return;
    }

    gsap.set(main, { perspective: 650 });

    const outerRX = gsap.quickTo(outer, 'rotationX', { duration: 0.8, ease: 'power3.out' });
    const outerRY = gsap.quickTo(outer, 'rotationY', { duration: 0.8, ease: 'power3.out' });
    const innerX = gsap.quickTo(inner, 'x', { duration: 0.8, ease: 'power3.out' });
    const innerY = gsap.quickTo(inner, 'y', { duration: 0.8, ease: 'power3.out' });

    const handlePointerMove = (e: PointerEvent) => {
      const xPercent = e.clientX / window.innerWidth;
      const yPercent = e.clientY / window.innerHeight;

      outerRX(gsap.utils.interpolate(15, -15, yPercent));
      outerRY(gsap.utils.interpolate(-15, 15, xPercent));
      innerX(gsap.utils.interpolate(-30, 30, xPercent));
      innerY(gsap.utils.interpolate(-30, 30, yPercent));
    };

    const handlePointerLeave = () => {
      outerRX(0);
      outerRY(0);
      innerX(0);
      innerY(0);
    };

    main.addEventListener('pointermove', handlePointerMove);
    main.addEventListener('pointerleave', handlePointerLeave);

    // Entry animation
    gsap.from(outer, {
      scale: 0,
      opacity: 0,
      duration: 1.5,
      ease: 'back.out(1.7)',
      delay: 0.3,
    });

    requestAnimationFrame(() => {
      setIsAnimated(true);
    });

    return () => {
      main.removeEventListener('pointermove', handlePointerMove);
      main.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section
      ref={mainRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-charcoal via-secondary-900 to-charcoal -mt-32 lg:-mt-36 pt-32 lg:pt-36"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(184,115,51,0.3),transparent_50%)]" />
      </div>

      <div className="container-custom py-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - 3D Product */}
          <div
            ref={outerRef}
            className={`relative order-2 lg:order-1 transition-all duration-1000 ${
              isAnimated ? 'opacity-100 scale-100' : 'opacity-100 scale-100'
            }`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div ref={innerRef} className="relative">
              <img
                src={heroProduct.images[0]?.src}
                alt={heroProduct.title}
                onLoad={() => setImageLoaded(true)}
                className={`w-full max-w-md lg:max-w-lg mx-auto drop-shadow-2xl rounded-2xl transition-opacity duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  filter: 'drop-shadow(0 50px 100px rgba(184, 115, 51, 0.4))',
                  transformStyle: 'preserve-3d',
                }}
              />

              {/* Fallback loading placeholder */}
              {!imageLoaded && (
                <div className="w-full max-w-md lg:max-w-lg mx-auto aspect-square bg-secondary-800/50 rounded-2xl flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Glow effect */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-primary-600/20 blur-3xl -z-10"
                style={{ transform: 'translateZ(-100px)' }}
              />
            </div>
          </div>

          {/* Right Column - Copy + CTA */}
          <div className="text-center lg:text-left order-1 lg:order-2">
            {/* Badge/Tag */}
            {heroProduct.tags?.includes('novo') && (
              <div
                className={`inline-flex items-center gap-2 bg-primary-500/20 border border-primary-500/30 rounded-full px-4 py-2 mb-6 transition-all duration-700 ${
                  isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                <span className="text-primary-300 text-sm font-medium">Novo Lançamento</span>
              </div>
            )}

            {/* Title */}
            <h1
              className={`text-5xl md:text-6xl lg:text-7xl font-display text-white mb-6 leading-tight transition-all duration-700 delay-100 ${
                isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Elegância
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-500">
                Atemporal
              </span>
            </h1>

            {/* Description */}
            <p
              className={`text-xl text-secondary-300 mb-4 transition-all duration-700 delay-200 ${
                isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              Coleção Premium 2026
            </p>
            <p
              className={`text-lg text-secondary-400 mb-8 max-w-md mx-auto lg:mx-0 transition-all duration-700 delay-300 ${
                isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {heroProduct.shortDescription}
            </p>

            {/* Price */}
            <div
              className={`flex items-baseline gap-3 mb-8 justify-center lg:justify-start transition-all duration-700 delay-400 ${
                isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="text-4xl md:text-5xl font-bold text-white">
                {formatPrice(heroProduct.price)}
              </span>
              {heroProduct.compareAtPrice && (
                <>
                  <span className="text-xl md:text-2xl text-secondary-500 line-through">
                    {formatPrice(heroProduct.compareAtPrice)}
                  </span>
                  <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* CTAs */}
            <div
              className={`flex flex-col sm:flex-row gap-4 mb-8 justify-center lg:justify-start transition-all duration-700 delay-500 ${
                isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Link
                to={`/produto/${heroProduct.handle}`}
                className="group relative px-8 py-4 bg-white text-charcoal rounded-full text-lg font-bold overflow-hidden hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Comprar Agora
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute inset-0 z-10 flex items-center justify-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Comprar Agora
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Link>

              <Link
                to="/shop"
                className="px-8 py-4 border-2 border-white/20 text-white rounded-full text-lg font-bold hover:bg-white/10 hover:border-white/40 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Ver Coleção
              </Link>
            </div>

            {/* Trust badges */}
            <div
              className={`flex flex-wrap gap-4 md:gap-6 text-sm text-secondary-400 justify-center lg:justify-start transition-all duration-700 delay-600 ${
                isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Frete Grátis</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Garantia 2 Anos</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>12x sem juros</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default HeroEcommerce;
