import { memo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Eye } from "lucide-react";
import type { Product } from "../../types";
import { formatPrice } from "../../data/products";
import { useCartStore } from "../../store/cartStore";
import { toast } from "../../store/uiStore";
import { Badge } from "../ui/Badge";

interface ProductCardProps {
  product: Product;
  theme?: "light" | "dark";
}

// Otimização: Memoização do componente para evitar re-renderizações desnecessárias em listas grandes
export const ProductCard = memo(
  ({ product, theme = "light" }: ProductCardProps) => {
    const { addItem } = useCartStore();
    const navigate = useNavigate();

    const hasDiscount =
      product.compareAtPrice && product.compareAtPrice > product.price;
    const discountPercent = hasDiscount
      ? Math.round(
          ((product.compareAtPrice! - product.price) /
            product.compareAtPrice!) *
            100,
        )
      : 0;

    const textColor = theme === "dark" ? "text-white" : "text-charcoal";
    const subtextColor =
      theme === "dark" ? "text-secondary-300" : "text-secondary-500";

    const handleQuickAdd = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const defaultVariant = product.variants[0];
      if (!defaultVariant || !defaultVariant.available) {
        toast.error("Produto indisponível no momento");
        return;
      }

      addItem({
        productId: product.id,
        variantId: defaultVariant.id,
        title: product.title,
        variantTitle: defaultVariant.title,
        price: defaultVariant.price,
        quantity: 1,
        image: product.images[0]?.src || "",
        handle: product.handle,
      });

      toast.success("Produto adicionado ao carrinho!");
    }, [product, addItem]);

    const handleViewDetails = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      navigate(`/produto/${product.handle}`);
    }, [navigate, product.handle]);

    return (
      <Link
        to={`/produto/${product.handle}`}
        className="group block"
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary-100 mb-4 rounded-lg">
          {/* Main Image - CSS transition em vez de Framer Motion */}
          <img
            src={product.images[0]?.src}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Second Image (on hover) - CSS transition */}
          {product.images[1] && (
            <img
              src={product.images[1].src}
              alt={product.title}
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              loading="lazy"
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {hasDiscount && <Badge variant="sale">-{discountPercent}%</Badge>}
            {!product.available && <Badge variant="soldout">Esgotado</Badge>}
          </div>

          {/* Quick Actions - CSS transition em vez de Framer Motion */}
          <div
            className="absolute bottom-0 left-0 right-0 p-4 flex gap-2 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
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
              onClick={handleViewDetails}
              className="p-3 bg-white text-charcoal hover:bg-secondary-100 transition-colors rounded-md shadow-sm"
              aria-label="Ver detalhes do produto"
            >
              <Eye size={16} />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div>
          <span
            className={`text-xs uppercase tracking-wider ${subtextColor} mb-1 block`}
          >
            {product.brand}
          </span>
          <h3
            className={`font-medium ${textColor} mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors`}
          >
            {product.title}
          </h3>

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
  },
);

ProductCard.displayName = "ProductCard";
