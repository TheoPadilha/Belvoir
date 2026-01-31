import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

// Versão Ultra-Leve: Removido Framer Motion para renderização instantânea
export const ProductCard = memo(({ product, theme = 'light' }: ProductCardProps) => {
  const { addItem } = useCartStore();
  const navigate = useNavigate();

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const textColor = theme === 'dark' ? 'text-white' : 'text-charcoal';
  const subtextColor = theme === 'dark' ? 'text-secondary-300' : 'text-secondary-500';
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
    <Link to={`/produto/${product.handle}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary-100 mb-4 rounded-lg">
        {/* Imagem estática com hover via CSS simples (muito mais leve que JS) */}
        <img
          src={product.images[0]?.src}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && <Badge variant="sale">-{discountPercent}%</Badge>}
          {!product.available && <Badge variant="soldout">Esgotado</Badge>}
        </div>

        {/* Botões de ação simples */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={handleQuickAdd}
            disabled={!product.available}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-charcoal text-white text-sm font-medium uppercase hover:bg-secondary-800 disabled:opacity-50 rounded-md"
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
            className="p-3 bg-white text-charcoal hover:bg-secondary-100 rounded-md shadow-sm"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      <div>
        <span className={`text-xs uppercase tracking-wider ${subtextColor} mb-1 block`}>
          {product.brand}
        </span>
        <h3 className={`font-medium ${textColor} mb-2 line-clamp-2`}>
          {product.title}
        </h3>

        {reviewSummary.totalReviews > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={reviewSummary.averageRating} size="sm" />
            <span className={`text-xs ${subtextColor}`}>({reviewSummary.totalReviews})</span>
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
