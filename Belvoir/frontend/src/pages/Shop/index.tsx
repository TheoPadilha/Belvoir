import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Grid, List, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { formatPrice } from '../../data/products';
import { useProducts } from '../../hooks/useProducts';
import { ProductCard } from '../../components/product/ProductCard';
import { Button, Select } from '../../components/ui';
import type { Product } from '../../types';

const heroImages = [
  '/images/baixados.png',
  '/images/baixados2.png',
];

const sortOptions = [
  { value: 'relevance', label: 'Relevância' },
  { value: 'price-asc', label: 'Menor Preço' },
  { value: 'price-desc', label: 'Maior Preço' },
  { value: 'newest', label: 'Mais Recentes' },
];

const priceRanges = [
  { value: 'all', label: 'Todos os Preços' },
  { value: '0-200', label: 'Até R$ 200' },
  { value: '200-300', label: 'R$ 200 - R$ 300' },
  { value: '300-400', label: 'R$ 300 - R$ 400' },
];

// Categorias customizadas com seus filtros de tags/tipos
const customCategories = [
  {
    name: 'Belvoir Lux',
    handle: 'lux',
    tags: ['classic', 'navy', 'prestige', 'luxury', 'lux'],
  },
  {
    name: 'Para Ela',
    handle: 'feminino',
    tags: ['beauty', 'her', 'feminino', 'belvoir-beauty', 'belvoir-her'],
  },
  {
    name: 'Para Ele',
    handle: 'masculino',
    tags: ['classic', 'chronos', 'navy', 'luxury', 'masculino', 'belvoir-classic', 'belvoir-chronos', 'belvoir-navy', 'belvoir-luxury'],
  },
];

const PRODUCTS_PER_PAGE = 12;

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentImage, setCurrentImage] = useState(0);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);

  // Buscar produtos do Shopify
  const { products, isLoading: isLoadingProducts, error: productsError } = useProducts(50);

  // Auto-advance carousel - otimizado
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextImage = useCallback(() => setCurrentImage((prev) => (prev + 1) % heroImages.length), []);
  const prevImage = useCallback(() => setCurrentImage((prev) => (prev - 1 + heroImages.length) % heroImages.length), []);

  // Get filters from URL
  const selectedCategory = searchParams.get('categoria') || '';
  const selectedSort = searchParams.get('ordenar') || 'relevance';
  const selectedPriceRange = searchParams.get('preco') || 'all';

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    let result = [...products];

    // Category filter - usa customCategories para filtrar por tags
    if (selectedCategory) {
      const customCat = customCategories.find(c => c.handle === selectedCategory);
      if (customCat) {
        // Filtra produtos que tenham alguma das tags da categoria
        result = result.filter((p) => {
          const productTags = p.tags?.map(t => t.toLowerCase()) || [];
          const productTitle = p.title?.toLowerCase() || '';
          const productCategory = p.category?.toLowerCase() || '';

          return customCat.tags.some(tag => {
            const tagLower = tag.toLowerCase();
            return productTags.some(pt => pt.includes(tagLower)) ||
                   productTitle.includes(tagLower) ||
                   productCategory.includes(tagLower);
          });
        });
      }
    }

    // Price filter
    if (selectedPriceRange && selectedPriceRange !== 'all') {
      const [minStr, maxStr] = selectedPriceRange.split('-');
      const min = parseInt(minStr) || 0;
      const max = maxStr?.includes('+') ? Infinity : (parseInt(maxStr) || Infinity);
      result = result.filter((p) => p.price >= min && p.price <= max);
    }

    // Sort
    switch (selectedSort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        break;
    }

    return result;
  }, [products, selectedCategory, selectedSort, selectedPriceRange]);

  const updateFilter = useCallback((key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
    setVisibleCount(PRODUCTS_PER_PAGE); // Reset pagination
  }, [searchParams, setSearchParams]);

  const clearFilters = useCallback(() => {
    setSearchParams({});
    setVisibleCount(PRODUCTS_PER_PAGE); // Reset pagination
  }, [setSearchParams]);

  const hasActiveFilters = selectedCategory || selectedPriceRange !== 'all';
  const isLoading = isLoadingProducts;

  return (
    <div>
      {/* Hero Banner with Carousel */}
      <div className="mb-8">
        <div className="relative h-[300px] md:h-[400px] overflow-hidden bg-secondary-100">
          {/* Simple Image Carousel without Framer Motion */}
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
                index === currentImage ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url('${img}')` }}
            />
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
            aria-label="Imagem anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
            aria-label="Próxima imagem"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentImage ? 'bg-white w-6' : 'bg-white/50 w-2'
                }`}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8">
        <div className="container-custom">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-secondary-100">
            {/* Left: Filter Toggle */}
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal size={18} />
                Filtros
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-primary-500 rounded-full" />
                )}
              </Button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-secondary-500 hover:text-charcoal flex items-center gap-1"
                >
                  <X size={14} />
                  Limpar filtros
                </button>
              )}
            </div>

            {/* Right: Sort & View Mode */}
            <div className="flex items-center gap-4">
              <Select
                options={sortOptions}
                value={selectedSort}
                onChange={(e) => updateFilter('ordenar', e.target.value)}
                className="w-40"
              />

              <div className="hidden md:flex border border-secondary-200 rounded">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-secondary-100' : ''}`}
                  aria-label="Visualização em grade"
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-secondary-100' : ''}`}
                  aria-label="Visualização em lista"
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filters - Simple CSS transition */}
            <aside
              className={`hidden lg:block flex-shrink-0 overflow-hidden transition-all duration-300 ${
                isFilterOpen ? 'w-[280px] opacity-100' : 'w-0 opacity-0'
              }`}
            >
              <div className="w-[280px] space-y-8">
                {/* Categories */}
                <div>
                  <h3 className="font-display text-lg mb-4">Categorias</h3>
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => updateFilter('categoria', '')}
                        className={`block w-full text-left py-2 px-3 rounded transition-colors ${
                          !selectedCategory
                            ? 'bg-secondary-100 font-medium'
                            : 'hover:bg-secondary-50'
                        }`}
                      >
                        Todas as Categorias
                      </button>
                    </li>
                    {customCategories.map((cat) => (
                      <li key={cat.handle}>
                        <button
                          onClick={() => updateFilter('categoria', cat.handle)}
                          className={`block w-full text-left py-2 px-3 rounded transition-colors ${
                            selectedCategory === cat.handle
                              ? 'bg-secondary-100 font-medium'
                              : 'hover:bg-secondary-50'
                          }`}
                        >
                          {cat.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-display text-lg mb-4">Faixa de Preço</h3>
                  <ul className="space-y-2">
                    {priceRanges.map((range) => (
                      <li key={range.value}>
                        <button
                          onClick={() => updateFilter('preco', range.value === 'all' ? '' : range.value)}
                          className={`block w-full text-left py-2 px-3 rounded transition-colors ${
                            (selectedPriceRange === range.value || (!selectedPriceRange && range.value === 'all'))
                              ? 'bg-secondary-100 font-medium'
                              : 'hover:bg-secondary-50'
                          }`}
                        >
                          {range.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Loading State */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-12 h-12 animate-spin text-primary-500 mb-4" />
                  <p className="text-secondary-500">Carregando produtos...</p>
                </div>
              ) : productsError ? (
                /* Error State */
                <div className="text-center py-20">
                  <h3 className="font-display text-2xl mb-4 text-red-600">
                    Erro ao carregar produtos
                  </h3>
                  <p className="text-secondary-500 mb-6">
                    {productsError}
                  </p>
                  <Button variant="secondary" onClick={() => window.location.reload()}>
                    Tentar Novamente
                  </Button>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <h3 className="font-display text-2xl mb-4">
                    Nenhum produto encontrado
                  </h3>
                  <p className="text-secondary-500 mb-6">
                    Tente ajustar os filtros ou explorar outras categorias.
                  </p>
                  <Button variant="secondary" onClick={clearFilters}>
                    Limpar Filtros
                  </Button>
                </div>
              ) : (
                <>
                  <div
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'
                        : 'space-y-6'
                    }
                  >
                    {filteredProducts.slice(0, visibleCount).map((product) => (
                      <div key={product.id}>
                        {viewMode === 'grid' ? (
                          <ProductCard product={product} />
                        ) : (
                          <ProductListItem product={product} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Load More Button */}
                  {visibleCount < filteredProducts.length && (
                    <div className="text-center mt-10">
                      <Button
                        variant="secondary"
                        onClick={() => setVisibleCount((prev) => prev + PRODUCTS_PER_PAGE)}
                        className="px-8"
                      >
                        Carregar Mais ({filteredProducts.length - visibleCount} restantes)
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// List view item component
const ProductListItem = ({ product }: { product: Product }) => {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <a
      href={`/produto/${product.handle}`}
      className="flex gap-6 p-4 border border-secondary-100 hover:border-secondary-300 transition-colors group rounded-lg"
    >
      <div className="w-32 h-32 flex-shrink-0 bg-secondary-50 rounded-lg overflow-hidden">
        <img
          src={product.images[0]?.src}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <span className="text-xs uppercase tracking-wider text-secondary-500">
          {product.brand} • {product.category}
        </span>
        <h3 className="font-display text-lg mt-1 group-hover:text-primary-500 transition-colors">
          {product.title}
        </h3>
        <p className="text-secondary-500 text-sm mt-2 line-clamp-2">
          {product.shortDescription}
        </p>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-lg font-display font-semibold">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-secondary-400 line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </div>
    </a>
  );
};

export default ShopPage;
