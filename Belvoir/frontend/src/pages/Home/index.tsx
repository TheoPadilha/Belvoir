import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FadeIn, AnimatedText, AnimatedProductGrid, PageTransition } from '../../components/animations';
import {
  HorizontalText,
  ProductGalleryParallax,
  BrandTimeline,
  ManifestoSection,
  ScrollFrameAnimation,
} from '../../components/ultra-premium';
import { getFeaturedProducts, getNewArrivals, collections } from '../../data/products';

export const HomePage = () => {
  const featuredProducts = getFeaturedProducts(6);
  const newArrivals = getNewArrivals(4);

  return (
    <PageTransition>
      {/* Apple-style Scroll Frame Animation - Hero Section */}
      <ScrollFrameAnimation
        frameCount={243}
        title="Precisão em Cada Detalhe"
        subtitle="Mergulhe no universo da alta relojoaria e descubra a arte por trás de cada movimento."
      />

      {/* Texto Horizontal Infinito */}
      <HorizontalText
        text="COLEÇÃO PREMIUM • ELEGÂNCIA ATEMPORAL • DESIGN EXCLUSIVO • TRADIÇÃO SUÍÇA •"
        speed={1}
      />

      {/* Galeria de Produtos com Parallax Extremo */}
      <ProductGalleryParallax
        products={featuredProducts}
        title="Coleção Premium"
        subtitle="Peças selecionadas que representam o melhor da nossa tradição relojoeira"
      />

      {/* Seção Manifesto com Typography Dinâmica */}
      <ManifestoSection
        text="Nós não fazemos relógios. Criamos legados. Esculpimos o tempo. Desenhamos eternidade. Cada peça é uma obra de arte que transcende gerações."
      />

      {/* Collections Grid */}
      <section className="py-24 md:py-32 bg-cream">
        <div className="container-custom">
          <div className="text-center mb-16">
            <FadeIn>
              <span className="text-sm uppercase tracking-[0.3em] text-primary-500 mb-4 block">
                Coleções
              </span>
            </FadeIn>
            <AnimatedText
              as="h2"
              className="font-display text-5xl md:text-6xl lg:text-7xl text-charcoal"
              animation="fadeUp"
            >
              Explore por Categoria
            </AnimatedText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.slice(0, 3).map((collection, index) => (
              <FadeIn key={collection.id} delay={index * 0.15}>
                <Link
                  to={`/shop?categoria=${collection.handle}`}
                  className="group relative aspect-[4/5] overflow-hidden block rounded-2xl"
                >
                  {/* Image Container */}
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={collection.image}
                      alt={collection.title}
                      className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
                    />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-500 ease-out group-hover:-translate-y-2">
                    <h3 className="font-display text-3xl text-white mb-3">
                      {collection.title}
                    </h3>
                    <p className="text-white/70 text-sm mb-4 transition-colors duration-300 group-hover:text-white/90">
                      {collection.description}
                    </p>
                    <span className="inline-flex items-center text-primary-400 text-sm uppercase tracking-wider transition-all duration-300 group-hover:text-primary-300">
                      Explorar
                      <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-2" />
                    </span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline da Marca */}
      <BrandTimeline />

      {/* New Arrivals */}
      <section className="py-24 md:py-32 bg-cream">
        <div className="container-custom">
          <div className="text-center mb-16">
            <FadeIn>
              <span className="text-sm uppercase tracking-[0.3em] text-primary-500 mb-4 block">
                Novidades
              </span>
            </FadeIn>
            <AnimatedText
              as="h2"
              className="font-display text-5xl md:text-6xl lg:text-7xl text-charcoal"
              animation="fadeUp"
            >
              Lançamentos Recentes
            </AnimatedText>
          </div>

          <AnimatedProductGrid products={newArrivals} columns={4} />

          <FadeIn delay={0.4}>
            <div className="text-center mt-12">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-body font-medium tracking-wider uppercase transition-all duration-300 ease-out bg-transparent border border-charcoal text-charcoal hover:bg-charcoal hover:text-white hover:scale-[1.02] active:scale-[0.98]"
              >
                Ver Toda a Coleção
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageTransition>
  );
};

export default HomePage;
