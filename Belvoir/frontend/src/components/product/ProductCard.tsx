import { useState } from 'react';
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

export const ProductCard = ({ product, theme = 'light' }: ProductCardProps) => {
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
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary-100 mb-4">
        {/* Main Image */}
        <motion.img
          src={product.images[0]?.src}
          alt={product.title}
          className="w-full h-full object-cover"
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
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-charcoal text-white text-sm font-medium uppercase tracking-wider hover:bg-secondary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="p-3 bg-white text-charcoal hover:bg-secondary-100 transition-colors"
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
};
