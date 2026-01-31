import { memo } from 'react';
import { ProductCard } from '../product/ProductCard';
import type { Product } from '../../types';

interface AnimatedProductGridProps {
  products: Product[];
  theme?: 'light' | 'dark';
  columns?: 2 | 3 | 4;
}

// Versão Ultra-Leve: Removido animejs. Usa apenas CSS Grid padrão.
export const AnimatedProductGrid = memo(({
  products,
  theme = 'light',
  columns = 4,
}: AnimatedProductGridProps) => {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6 md:gap-8`}>
      {products.map((product) => (
        <div key={product.id} className="opacity-100">
          <ProductCard product={product} theme={theme} />
        </div>
      ))}
    </div>
  );
});

AnimatedProductGrid.displayName = 'AnimatedProductGrid';
