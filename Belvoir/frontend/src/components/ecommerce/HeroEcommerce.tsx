import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import type { Product } from '../../types';

interface HeroEcommerceProps {
  product?: Product;
  isLoading?: boolean;
}

export const HeroEcommerce = ({ product, isLoading = false }: HeroEcommerceProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Se está carregando ou não tem produto, mostrar loading
  if (isLoading || !product) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-charcoal via-secondary-900 to-charcoal -mt-32 lg:-mt-36 pt-32 lg:pt-36">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
          <p className="text-white/70 text-lg">Carregando...</p>
        </div>
      </section>
    );
  }

  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-charcoal via-secondary-900 to-charcoal -mt-32 lg:-mt-36 pt-32 lg:pt-36">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(184,115,51,0.3),transparent_50%)]" />
      </div>

      <div className="container-custom py-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Product Image (Mobile: aparece depois do texto) */}
          <div className="relative order-2 lg:order-1">
            <div className="relative">
              {/* Main product image */}
              <img
                src={product.images[0]?.src}
                alt={product.title}
                onLoad={() => setImageLoaded(true)}
                className={`w-full max-w-md lg:max-w-lg mx-auto rounded-2xl transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  filter: 'drop-shadow(0 30px 60px rgba(184, 115, 51, 0.3))',
                }}
              />

              {/* Loading placeholder */}
              {!imageLoaded && (
                <div className="w-full max-w-md lg:max-w-lg mx-auto aspect-square bg-secondary-800/50 rounded-2xl flex items-center justify-center absolute inset-0">
                  <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-primary-600/10 blur-2xl -z-10 rounded-full scale-75" />
            </div>
          </div>

          {/* Right Column - Copy + CTA (Mobile: aparece primeiro) */}
          <div className="text-center lg:text-left order-1 lg:order-2">
            {/* Badge/Tag */}
            {product.tags?.includes('novo') && (
              <div className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-500/30 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                <span className="text-primary-300 text-sm font-medium">Novo Lançamento</span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display text-white mb-6 leading-tight">
              Elegância
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-500">
                Atemporal
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-secondary-300 mb-4">
              Coleção Premium 2026
            </p>
            <p className="text-lg text-secondary-400 mb-8 max-w-md mx-auto lg:mx-0">
              {product.shortDescription || product.description?.slice(0, 150)}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8 justify-center lg:justify-start">
              <span className="text-4xl md:text-5xl font-bold text-white">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <>
                  <span className="text-xl md:text-2xl text-secondary-500 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                  <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center lg:justify-start">
              <Link
                to={`/produto/${product.handle}`}
                className="group px-8 py-4 bg-white text-charcoal rounded-full text-lg font-bold hover:bg-primary-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                Comprar Agora
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/shop"
                className="px-8 py-4 border-2 border-white/20 text-white rounded-full text-lg font-bold hover:bg-white/10 hover:border-white/40 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Ver Coleção
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 md:gap-6 text-sm text-secondary-400 justify-center lg:justify-start">
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
