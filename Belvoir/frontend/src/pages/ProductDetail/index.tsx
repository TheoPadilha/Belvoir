import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Heart, Share2, Truck, Shield, RotateCcw, ChevronRight } from 'lucide-react';
import { getProductByHandle, formatPrice, products } from '../../data/products';
import { getReviewSummaryByProductId } from '../../data/reviews';
import { ProductGallery, VariantSelector, ProductCard } from '../../components/product';
import { Button } from '../../components/ui';
import { FadeIn, PageTransition } from '../../components/animations';
import { StarRating, ProductReviews } from '../../components/reviews';
import { useCartStore } from '../../store/cartStore';
import { toast } from '../../store/uiStore';
import type { ProductVariant } from '../../types';

export const ProductDetailPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const product = getProductByHandle(handle || '');
  const { addItem } = useCartStore();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'shipping'>('description');

  // Set default variant
  useEffect(() => {
    if (product?.variants.length) {
      const availableVariant = product.variants.find((v) => v.available) || product.variants[0];
      setSelectedVariant(availableVariant);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl mb-4">Produto não encontrado</h1>
          <Link to="/shop" className="text-primary-500 hover:underline">
            Voltar para a loja
          </Link>
        </div>
      </div>
    );
  }

  const currentPrice = selectedVariant?.price || product.price;
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > currentPrice;
  const reviewSummary = getReviewSummaryByProductId(product.id);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error('Selecione uma opção');
      return;
    }
    if (!selectedVariant.available) {
      toast.error('Produto indisponível no momento');
      return;
    }

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      title: product.title,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      image: product.images[0]?.src || '',
      handle: product.handle,
    });

    toast.success('Produto adicionado ao carrinho!');
  };

  // Related products (same category, excluding current)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <PageTransition>
      {/* Breadcrumb */}
      <div className="bg-secondary-50 py-4">
        <div className="container-custom">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-secondary-500 hover:text-charcoal">
              Home
            </Link>
            <ChevronRight size={14} className="text-secondary-400" />
            <Link to="/shop" className="text-secondary-500 hover:text-charcoal">
              Coleção
            </Link>
            <ChevronRight size={14} className="text-secondary-400" />
            <Link
              to={`/shop?categoria=${product.category.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-secondary-500 hover:text-charcoal"
            >
              {product.category}
            </Link>
            <ChevronRight size={14} className="text-secondary-400" />
            <span className="text-charcoal font-medium truncate">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Gallery */}
            <FadeIn direction="left">
              <ProductGallery images={product.images} productTitle={product.title} />
            </FadeIn>

            {/* Product Info */}
            <div className="lg:pl-8">
              <FadeIn>
                <span className="text-sm uppercase tracking-widest text-primary-500 mb-2 block">
                  {product.brand}
                </span>
                <h1 className="font-display text-3xl md:text-4xl text-charcoal mb-3">
                  {product.title}
                </h1>
                {/* Star Rating */}
                {reviewSummary.totalReviews > 0 && (
                  <div className="flex items-center gap-3 mb-4">
                    <StarRating rating={reviewSummary.averageRating} size="md" />
                    <a
                      href="#avaliacoes"
                      className="text-sm text-secondary-500 hover:text-primary-500 transition-colors"
                    >
                      {reviewSummary.totalReviews} {reviewSummary.totalReviews === 1 ? 'avaliação' : 'avaliações'}
                    </a>
                  </div>
                )}
              </FadeIn>

              {/* Price */}
              <FadeIn delay={0.1}>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl font-display font-semibold text-charcoal">
                    {formatPrice(currentPrice)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-xl text-secondary-400 line-through">
                        {formatPrice(product.compareAtPrice!)}
                      </span>
                      <span className="px-2 py-1 bg-red-500 text-white text-sm font-medium">
                        -{Math.round(((product.compareAtPrice! - currentPrice) / product.compareAtPrice!) * 100)}%
                      </span>
                    </>
                  )}
                </div>
              </FadeIn>

              {/* Short Description */}
              <FadeIn delay={0.15}>
                <p className="text-secondary-600 mb-6">
                  {product.shortDescription}
                </p>
              </FadeIn>

              {/* Variants */}
              <FadeIn delay={0.2}>
                <div className="mb-6">
                  <VariantSelector
                    variants={product.variants}
                    selectedVariant={selectedVariant}
                    onSelect={setSelectedVariant}
                  />
                </div>
              </FadeIn>

              {/* Quantity */}
              <FadeIn delay={0.25}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-charcoal mb-3">
                    Quantidade
                  </label>
                  <div className="flex items-center border border-secondary-200 w-fit">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-secondary-50 transition-colors"
                      aria-label="Diminuir quantidade"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="px-6 py-3 font-medium min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-secondary-50 transition-colors"
                      aria-label="Aumentar quantidade"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </FadeIn>

              {/* Add to Cart */}
              <FadeIn delay={0.3}>
                <div className="flex gap-4 mb-8">
                  <Button
                    onClick={handleAddToCart}
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    disabled={!selectedVariant?.available}
                  >
                    {selectedVariant?.available ? 'Adicionar ao Carrinho' : 'Indisponível'}
                  </Button>
                  <Button variant="secondary" size="lg" aria-label="Adicionar aos favoritos">
                    <Heart size={20} />
                  </Button>
                  <Button variant="secondary" size="lg" aria-label="Compartilhar">
                    <Share2 size={20} />
                  </Button>
                </div>
              </FadeIn>

              {/* Benefits */}
              <FadeIn delay={0.35}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-b border-secondary-100">
                  <div className="flex items-center gap-3">
                    <Truck size={20} className="text-primary-500" />
                    <span className="text-sm">Frete Grátis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield size={20} className="text-primary-500" />
                    <span className="text-sm">Garantia 5 Anos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <RotateCcw size={20} className="text-primary-500" />
                    <span className="text-sm">Troca em 30 dias</span>
                  </div>
                </div>
              </FadeIn>

              {/* Tabs */}
              <FadeIn delay={0.4}>
                <div className="mt-8">
                  <div className="flex border-b border-secondary-100">
                    {[
                      { id: 'description', label: 'Descrição' },
                      { id: 'details', label: 'Especificações' },
                      { id: 'shipping', label: 'Entrega' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`
                          px-6 py-4 text-sm font-medium transition-colors relative
                          ${activeTab === tab.id ? 'text-charcoal' : 'text-secondary-500 hover:text-charcoal'}
                        `}
                      >
                        {tab.label}
                        {activeTab === tab.id && (
                          <motion.span
                            layoutId="tab-indicator"
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-500"
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="py-6">
                    {activeTab === 'description' && (
                      <div className="prose prose-sm max-w-none text-secondary-600">
                        {product.description.split('\n\n').map((paragraph, i) => (
                          <p key={i} className="mb-4">{paragraph}</p>
                        ))}
                      </div>
                    )}

                    {activeTab === 'details' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="py-3 border-b border-secondary-100">
                            <span className="text-secondary-500">Marca</span>
                            <p className="font-medium mt-1">{product.brand}</p>
                          </div>
                          <div className="py-3 border-b border-secondary-100">
                            <span className="text-secondary-500">Material</span>
                            <p className="font-medium mt-1">{product.material}</p>
                          </div>
                          <div className="py-3 border-b border-secondary-100">
                            <span className="text-secondary-500">Movimento</span>
                            <p className="font-medium mt-1">{product.movement}</p>
                          </div>
                          <div className="py-3 border-b border-secondary-100">
                            <span className="text-secondary-500">Diâmetro</span>
                            <p className="font-medium mt-1">{product.caseDiameter}</p>
                          </div>
                          <div className="py-3 border-b border-secondary-100">
                            <span className="text-secondary-500">Resistência à Água</span>
                            <p className="font-medium mt-1">{product.waterResistance}</p>
                          </div>
                          <div className="py-3 border-b border-secondary-100">
                            <span className="text-secondary-500">Categoria</span>
                            <p className="font-medium mt-1">{product.category}</p>
                          </div>
                        </div>
                        <div className="py-3">
                          <span className="text-secondary-500 text-sm">Características</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {product.features.map((feature) => (
                              <span
                                key={feature}
                                className="px-3 py-1 bg-secondary-100 text-sm"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'shipping' && (
                      <div className="space-y-4 text-secondary-600">
                        <div>
                          <h4 className="font-medium text-charcoal mb-2">Entrega Expressa</h4>
                          <p className="text-sm">
                            Frete grátis para todo o Brasil em compras acima de R$ 5.000.
                            Prazo de 2-3 dias úteis para capitais e 5-7 dias úteis para outras regiões.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-charcoal mb-2">Entrega Premium</h4>
                          <p className="text-sm">
                            Entrega no mesmo dia disponível para São Paulo capital (pedidos até 12h).
                            Taxa adicional de R$ 150.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-charcoal mb-2">Retirada na Boutique</h4>
                          <p className="text-sm">
                            Retire gratuitamente em nossa boutique na Rua Oscar Freire, 123 - Jardins.
                            Disponível em até 24h após a confirmação do pedido.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="avaliacoes" className="border-t border-secondary-100">
        <div className="container-custom">
          <ProductReviews productId={product.id} productName={product.title} />
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-secondary-50">
          <div className="container-custom">
            <h2 className="font-display text-3xl text-center mb-12">
              Talvez Você Também Goste
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct, index) => (
                <FadeIn key={relProduct.id} delay={index * 0.1}>
                  <ProductCard product={relProduct} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageTransition>
  );
};

export default ProductDetailPage;
