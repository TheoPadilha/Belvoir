import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { products, categories, formatPrice } from '../../data/products';
import { ProductCard } from '../../components/product/ProductCard';
import { Button, Select } from '../../components/ui';
import { FadeIn, AnimatedText, PageTransition } from '../../components/animations';
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
  { value: '0-10000', label: 'Até R$ 10.000' },
  { value: '10000-20000', label: 'R$ 10.000 - R$ 20.000' },
  { value: '20000-50000', label: 'R$ 20.000 - R$ 50.000' },
  { value: '50000+', label: 'Acima de R$ 50.000' },
];

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentImage, setCurrentImage] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % heroImages.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  // Get filters from URL
  const selectedCategory = searchParams.get('categoria') || '';
  const selectedSort = searchParams.get('ordenar') || 'relevance';
  const selectedPriceRange = searchParams.get('preco') || 'all';

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory) {
      const categoryName = categories.find(
        (c) => c.toLowerCase().replace(/\s+/g, '-') === selectedCategory
      );
      if (categoryName) {
        result = result.filter((p) => p.category === categoryName);
      }
    }

    // Price filter
    if (selectedPriceRange !== 'all') {
      const [min, max] = selectedPriceRange.split('-').map((v) => {
        if (v.includes('+')) return Infinity;
        return parseInt(v);
      });
      result = result.filter((p) => p.price >= min && p.price <= (max || Infinity));
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
        // relevance - keep original order
        break;
    }

    return result;
  }, [selectedCategory, selectedSort, selectedPriceRange]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = selectedCategory || selectedPriceRange !== 'all';

  return (
    <PageTransition>
      {/* Hero Banner with Carousel */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        {/* Carousel Images */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${heroImages[currentImage]}')`,
            }}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-black/40" />

        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
          aria-label="Imagem anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
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

        <div className="relative text-center text-white z-10">
          <AnimatedText
            as="h1"
            className="font-display text-4xl md:text-5xl lg:text-6xl mb-4"
            animation="fadeUp"
          >
            Nossa Coleção
          </AnimatedText>
          <FadeIn delay={0.2}>
            <p className="text-white/80 text-lg">
              {filteredProducts.length} relógios disponíveis
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container-custom">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-secondary-100">
            {/* Left: Filter Toggle & Active Filters */}
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
            {/* Sidebar Filters */}
            <motion.aside
              initial={false}
              animate={{
                width: isFilterOpen ? 280 : 0,
                opacity: isFilterOpen ? 1 : 0,
              }}
              className="hidden lg:block flex-shrink-0 overflow-hidden"
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
                    {categories.map((category) => {
                      const handle = category.toLowerCase().replace(/\s+/g, '-');
                      return (
                        <li key={category}>
                          <button
                            onClick={() => updateFilter('categoria', handle)}
                            className={`block w-full text-left py-2 px-3 rounded transition-colors ${
                              selectedCategory === handle
                                ? 'bg-secondary-100 font-medium'
                                : 'hover:bg-secondary-50'
                            }`}
                          >
                            {category}
                          </button>
                        </li>
                      );
                    })}
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
            </motion.aside>

            {/* Products Grid */}
            <div className="flex-1">
              {filteredProducts.length === 0 ? (
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
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'
                      : 'space-y-6'
                  }
                >
                  {filteredProducts.map((product, index) => (
                    <FadeIn key={product.id} delay={index * 0.05}>
                      {viewMode === 'grid' ? (
                        <ProductCard product={product} />
                      ) : (
                        <ProductListItem product={product} />
                      )}
                    </FadeIn>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

// List view item component
const ProductListItem = ({ product }: { product: Product }) => {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <a
      href={`/produto/${product.handle}`}
      className="flex gap-6 p-4 border border-secondary-100 hover:border-secondary-300 transition-colors group"
    >
      <div className="w-32 h-32 flex-shrink-0 bg-secondary-50">
        <img
          src={product.images[0]?.src}
          alt={product.title}
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
