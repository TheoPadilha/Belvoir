# Códigos Completos Otimizados - Belvoir

Aqui estão os códigos completos para você substituir no seu projeto. Basta copiar o conteúdo abaixo e colar no arquivo correspondente.

---

## 1. ProductCard.tsx
**Caminho:** `src/components/product/ProductCard.tsx`

```tsx
import { useState, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye } from 'lucide-react';
import type { Product } from '../../types';
import { formatPrice } from '../../data/products';
import { getReviewSummaryByProductId } from '../../data/reviews';
import { useCartStore } from '../../store/cartStore';
import { toast } from '../../store/uiStore';
import { Badge } from '../ui/Badge';
import { StarRating } from '../reviews';

interface ProductCardProps {
  product: Product;
  theme?: 'light' | 'dark';
}

// Otimização: Memoização do componente para evitar re-renderizações desnecessárias em listas grandes
export const ProductCard = memo(({ product, theme = 'light' }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCartStore();
  const navigate = useNavigate();

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const textColor = theme === 'dark' ? 'text-white' : 'text-charcoal';
  const subtextColor = theme === 'dark' ? 'text-secondary-300' : 'text-secondary-500';

  // Get review summary for this product
  const reviewSummary = getReviewSummaryByProductId(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const defaultVariant = product.variants[0];
    if (!defaultVariant || !defaultVariant.available) {
      toast.error('Produto indisponível no momento');
      return;
    }

    addItem({
      productId: product.id,
      variantId: defaultVariant.id,
      title: product.title,
      variantTitle: defaultVariant.title,
      price: defaultVariant.price,
      quantity: 1,
      image: product.images[0]?.src || '',
      handle: product.handle,
    });

    toast.success('Produto adicionado ao carrinho!');
  };

  return (
    <Link
      to={`/produto/${product.handle}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary-100 mb-4 rounded-lg">
        {/* Main Image - Otimização: loading="lazy" para imagens fora da dobra */}
        <motion.img
          src={product.images[0]?.src}
          alt={product.title}
          className="w-full h-full object-cover"
          loading="lazy"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        />

        {/* Second Image (on hover) */}
        {product.images[1] && (
          <motion.img
            src={product.images[1].src}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            loading="lazy"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <Badge variant="sale">-{discountPercent}%</Badge>
          )}
          {!product.available && (
            <Badge variant="soldout">Esgotado</Badge>
          )}
        </div>

        {/* Quick Actions */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-4 flex gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={handleQuickAdd}
            disabled={!product.available}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-charcoal text-white text-sm font-medium uppercase tracking-wider hover:bg-secondary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
          >
            <ShoppingBag size={16} />
            Adicionar
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/produto/${product.handle}`);
            }}
            className="p-3 bg-white text-charcoal hover:bg-secondary-100 transition-colors rounded-md shadow-sm"
            aria-label="Ver detalhes do produto"
          >
            <Eye size={16} />
          </button>
        </motion.div>
      </div>

      {/* Product Info */}
      <div>
        <span className={`text-xs uppercase tracking-wider ${subtextColor} mb-1 block`}>
          {product.brand}
        </span>
        <h3 className={`font-medium ${textColor} mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors`}>
          {product.title}
        </h3>

        {/* Star Rating */}
        {reviewSummary.totalReviews > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={reviewSummary.averageRating} size="sm" />
            <span className={`text-xs ${subtextColor}`}>
              ({reviewSummary.totalReviews})
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className={`text-lg font-display font-semibold ${textColor}`}>
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className={`text-sm line-through ${subtextColor}`}>
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';
```

---

## 2. AnimatedProductGrid.tsx
**Caminho:** `src/components/animations/AnimatedProductGrid.tsx`

```tsx
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
```

---

## 3. InteractiveBackground.tsx
**Caminho:** `src/components/premium/InteractiveBackground.tsx`

```tsx
import { useEffect, useRef, memo } from 'react';

interface InteractiveBackgroundProps {
  variant?: 'light' | 'dark';
}

// Otimização: Memoização para evitar re-renderizações já que o componente é fixo e puramente visual
export const InteractiveBackground = memo(({ variant = 'light' }: InteractiveBackgroundProps) => {
  const bgRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 50, y: 50 });
  const targetPos = useRef({ x: 50, y: 50 });
  const animationRef = useRef<number | undefined>(undefined);
  const lastUpdate = useRef(0);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      };
    };

    // Smooth interpolation animation
    const animate = (time: number) => {
      targetPos.current.x += (mousePos.current.x - targetPos.current.x) * 0.03;
      targetPos.current.y += (mousePos.current.y - targetPos.current.y) * 0.03;

      if (bgRef.current && time - lastUpdate.current > 16) { // ~60fps throttle
        const { x, y } = targetPos.current;
        
        if (variant === 'dark') {
          bgRef.current.style.background = `radial-gradient(ellipse 80% 60% at ${x}% ${y}%, rgba(184,115,51,0.08) 0%, rgba(139,92,36,0.04) 30%, transparent 70%)`;
        } else {
          bgRef.current.style.background = `radial-gradient(ellipse 70% 50% at ${x}% ${y}%, rgba(184,115,51,0.06) 0%, rgba(184,115,51,0.02) 40%, transparent 70%)`;
        }
        lastUpdate.current = time;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [variant]);

  return (
    <div
      ref={bgRef}
      className="fixed inset-0 pointer-events-none z-0 will-change-[background]"
      aria-hidden="true"
    />
  );
});

InteractiveBackground.displayName = 'InteractiveBackground';
export default InteractiveBackground;
```

---

## 4. SpotlightCursor.tsx
**Caminho:** `src/components/ultra-premium/SpotlightCursor.tsx`

```tsx
import { useEffect, useRef, useState, memo } from 'react';
import { gsap } from 'gsap';

export const SpotlightCursor = memo(() => {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check for fine pointer and reduced motion
    const hasFinPointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasFinPointer || prefersReducedMotion) return;

    setIsVisible(true);

    const spotlight = spotlightRef.current;
    const trail = trailRef.current;
    if (!spotlight || !trail) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    // Smooth movement using GSAP ticker
    const updatePosition = () => {
      gsap.to(spotlight, {
        x: mousePos.current.x - 150,
        y: mousePos.current.y - 150,
        duration: 0.3,
        overwrite: 'auto',
        ease: 'power2.out'
      });

      gsap.to(trail, {
        x: mousePos.current.x - 250,
        y: mousePos.current.y - 250,
        duration: 0.6,
        overwrite: 'auto',
        ease: 'power2.out'
      });
    };

    // Handle hover states
    const handleLinkEnter = () => {
      gsap.to(spotlight, { scale: 1.5, duration: 0.3, ease: 'power2.out' });
    };

    const handleLinkLeave = () => {
      gsap.to(spotlight, { scale: 1, duration: 0.3, ease: 'power2.out' });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    gsap.ticker.add(updatePosition);

    // Optimized hover detection
    const addListeners = (elements: NodeListOf<Element>) => {
      elements.forEach((el) => {
        el.addEventListener('mouseenter', handleLinkEnter);
        el.addEventListener('mouseleave', handleLinkLeave);
      });
    };

    const interactiveElements = document.querySelectorAll('a, button, [data-cursor-hover]');
    addListeners(interactiveElements);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Element) {
              const elements = node.querySelectorAll('a, button, [data-cursor-hover]');
              if (node.matches('a, button, [data-cursor-hover]')) {
                node.addEventListener('mouseenter', handleLinkEnter);
                node.addEventListener('mouseleave', handleLinkLeave);
              }
              addListeners(elements);
            }
          });
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      gsap.ticker.remove(updatePosition);
      observer.disconnect();
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div
        ref={trailRef}
        className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-[9998] will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(184, 115, 51, 0.08) 0%, transparent 60%)',
          mixBlendMode: 'screen',
        }}
      />
      <div
        ref={spotlightRef}
        className="fixed w-[300px] h-[300px] rounded-full pointer-events-none z-[9999] will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(184, 115, 51, 0.15) 0%, rgba(139, 92, 36, 0.05) 40%, transparent 70%)',
          mixBlendMode: 'screen',
        }}
      />
    </>
  );
});

SpotlightCursor.displayName = 'SpotlightCursor';
export default SpotlightCursor;
```
