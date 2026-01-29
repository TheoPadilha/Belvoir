import { useEffect, useRef } from 'react';
import { animate, stagger, utils } from 'animejs';
import { ProductCard } from '../product/ProductCard';
import { prefersReducedMotion } from '../../utils/animationConfig';
import type { Product } from '../../types';

interface AnimatedProductGridProps {
  products: Product[];
  theme?: 'light' | 'dark';
  columns?: 2 | 3 | 4;
}

export const AnimatedProductGrid = ({
  products,
  theme = 'light',
  columns = 4,
}: AnimatedProductGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!gridRef.current || hasAnimated.current || prefersReducedMotion()) return;

    const cards = gridRef.current.querySelectorAll('.product-card-animated');

    if (cards.length === 0) return;

    // Reset inicial
    utils.set(cards, {
      opacity: 0,
      translateY: 60,
      scale: 0.95,
    });

    // Animação stagger com anime.js v4
    animate(cards, {
      opacity: [0, 1],
      translateY: [60, 0],
      scale: [0.95, 1],
      delay: stagger(100, { start: 200 }),
      duration: 800,
      ease: 'outExpo',
    });

    // Fallback: ensure visibility after animation should complete
    const totalDuration = 200 + (cards.length * 100) + 800 + 500; // start + stagger + duration + buffer
    const fallbackTimeout = setTimeout(() => {
      cards.forEach((card) => {
        if (window.getComputedStyle(card as Element).opacity === '0') {
          utils.set(card, { opacity: 1, translateY: 0, scale: 1 });
        }
      });
    }, totalDuration);

    hasAnimated.current = true;

    return () => clearTimeout(fallbackTimeout);
  }, [products]);

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div ref={gridRef} className={`grid ${gridCols[columns]} gap-6 md:gap-8`}>
      {products.map((product) => (
        <div key={product.id} className="product-card-animated">
          <ProductCard product={product} theme={theme} />
        </div>
      ))}
    </div>
  );
};
