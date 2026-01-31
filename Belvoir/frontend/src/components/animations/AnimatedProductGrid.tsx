import { useEffect, useRef, memo } from 'react';
import { animate, stagger, utils } from 'animejs';
import { ProductCard } from '../product/ProductCard';
import { prefersReducedMotion } from '../../utils/animationConfig';
import type { Product } from '../../types';

interface AnimatedProductGridProps {
  products: Product[];
  theme?: 'light' | 'dark';
  columns?: 2 | 3 | 4;
}

// Otimização: Memoização para evitar re-animação em re-renderizações que não alteram os produtos
export const AnimatedProductGrid = memo(({
  products,
  theme = 'light',
  columns = 4,
}: AnimatedProductGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!gridRef.current || hasAnimated.current || prefersReducedMotion()) {
      // Garantir que os cards fiquem visíveis se não houver animação
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.product-card-animated');
        cards.forEach(card => (card as HTMLElement).style.opacity = '1');
      }
      return;
    }

    const cards = gridRef.current.querySelectorAll('.product-card-animated');

    if (cards.length === 0) return;

    // Reset inicial
    utils.set(cards, {
      opacity: 0,
      translateY: 40, // Reduzido de 60 para 40 para uma sensação mais leve
      scale: 0.98, // Reduzido o scale inicial para ser menos agressivo
    });

    // Animação stagger otimizada
    animate(cards, {
      opacity: [0, 1],
      translateY: [40, 0],
      scale: [0.98, 1],
      delay: stagger(80, { start: 100 }), // Reduzido delay e start para maior rapidez
      duration: 600, // Reduzido de 800 para 600
      ease: 'outExpo',
    });

    hasAnimated.current = true;
  }, [products]);

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div ref={gridRef} className={`grid ${gridCols[columns]} gap-6 md:gap-8`}>
      {products.map((product) => (
        <div key={product.id} className="product-card-animated" style={{ opacity: 0 }}>
          <ProductCard product={product} theme={theme} />
        </div>
      ))}
    </div>
  );
});

AnimatedProductGrid.displayName = 'AnimatedProductGrid';
