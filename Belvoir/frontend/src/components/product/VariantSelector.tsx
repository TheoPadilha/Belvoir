import type { ProductVariant } from '../../types';
import { formatPrice } from '../../data/products';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onSelect: (variant: ProductVariant) => void;
}

export const VariantSelector = ({
  variants,
  selectedVariant,
  onSelect,
}: VariantSelectorProps) => {
  if (variants.length <= 1) return null;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-charcoal">
        Opção: <span className="font-normal text-secondary-600">{selectedVariant?.option1}</span>
      </label>
      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;
          const isAvailable = variant.available;

          return (
            <button
              key={variant.id}
              onClick={() => isAvailable && onSelect(variant)}
              disabled={!isAvailable}
              className={`
                relative px-4 py-3 text-sm font-medium border transition-all
                ${isSelected
                  ? 'border-charcoal bg-charcoal text-white'
                  : isAvailable
                    ? 'border-secondary-200 text-charcoal hover:border-charcoal'
                    : 'border-secondary-100 text-secondary-300 cursor-not-allowed'
                }
              `}
            >
              {variant.option1 || variant.title}
              {!isAvailable && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-full h-[1px] bg-secondary-300 rotate-[-20deg]" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Price difference indicator */}
      {selectedVariant && variants.some(v => v.price !== selectedVariant.price) && (
        <p className="text-sm text-secondary-500">
          {variants.map((v) => {
            if (v.price !== variants[0].price) {
              const diff = v.price - variants[0].price;
              return diff > 0 ? `${v.option1}: +${formatPrice(diff)}` : null;
            }
            return null;
          }).filter(Boolean).join(' | ')}
        </p>
      )}
    </div>
  );
};
