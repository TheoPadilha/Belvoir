import { useState, useRef, useEffect, memo } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  placeholderColor?: string;
}

/**
 * Componente de imagem otimizada com lazy loading e placeholder
 * - Usa IntersectionObserver para carregar apenas quando visível
 * - Mostra placeholder animado enquanto carrega
 * - Fade-in suave quando a imagem carrega
 * - Usa decoding="async" para não bloquear a main thread
 */
export const OptimizedImage = memo(({
  src,
  alt,
  className = '',
  containerClassName = '',
  placeholderColor = 'bg-secondary-200',
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // Verificar preferência de movimento reduzido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0,
        rootMargin: '200px', // Começa a carregar 200px antes de entrar na viewport
      }
    );

    observer.observe(element);

    // Se prefere movimento reduzido, mostra a imagem imediatamente sem animação
    if (prefersReducedMotion) {
      setIsInView(true);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${containerClassName}`}>
      {/* Placeholder/Skeleton */}
      <div
        className={`absolute inset-0 ${placeholderColor} transition-opacity duration-300 ${
          isLoaded ? 'opacity-0' : 'opacity-100 animate-pulse'
        }`}
      />

      {/* Imagem real - só carrega quando isInView é true */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          className={`${className} transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          decoding="async"
          loading="lazy"
        />
      )}

      {/* Fallback para erro de carregamento */}
      {hasError && (
        <div className={`absolute inset-0 ${placeholderColor} flex items-center justify-center`}>
          <span className="text-secondary-400 text-sm">Imagem indisponível</span>
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
