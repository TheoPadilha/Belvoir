import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { ArrowRight, Award, Shield, Truck } from 'lucide-react';
import { Button } from '../../components/ui';
import { FadeIn, AnimatedText, AnimatedProductGrid, PageTransition } from '../../components/animations';
import { getFeaturedProducts, getNewArrivals, collections } from '../../data/products';

gsap.registerPlugin(ScrollTrigger);

export const HomePage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

  const featuredProducts = getFeaturedProducts(4);
  const newArrivals = getNewArrivals(4);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero parallax effect
      if (heroImageRef.current) {
        gsap.to(heroImageRef.current, {
          yPercent: 30,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // Hero text animation
      gsap.fromTo(
        '.hero-title',
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.3,
        }
      );

      gsap.fromTo(
        '.hero-subtitle',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          delay: 0.6,
        }
      );

      gsap.fromTo(
        '.hero-cta',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.9,
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <PageTransition>
      {/* Hero Section - margin negativo para compensar o padding-top do layout */}
      <section ref={heroRef} className="relative h-screen overflow-hidden -mt-20 lg:-mt-24">
        {/* Background Image */}
        <div
          ref={heroImageRef}
          className="absolute inset-0 w-full h-[130%] -top-[15%]"
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1920&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center">
          <div className="container-custom">
            <div className="max-w-3xl">
              <h1 className="hero-title font-display text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6">
                O Tempo é a Nossa
                <span className="block text-primary-400">Obra-Prima</span>
              </h1>
              <p className="hero-subtitle text-xl md:text-2xl text-white/80 mb-8 max-w-xl">
                Descubra relógios que transcendem gerações. Cada peça Belvoir é uma celebração da arte relojoeira.
              </p>
              <div className="hero-cta flex flex-col sm:flex-row gap-4">
                <Link to="/shop">
                  <Button variant="gold" size="lg">
                    Explorar Coleção
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
                <Link to="/sobre">
                  <Button variant="secondary" size="lg" className="border-white text-white hover:bg-white hover:text-charcoal">
                    Nossa História
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-white/50 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Bar */}
      <section className="bg-charcoal py-6">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Truck, text: 'Frete Grátis em compras acima de R$ 5.000' },
              { icon: Shield, text: 'Garantia Internacional de 5 Anos' },
              { icon: Award, text: 'Certificado de Autenticidade' },
            ].map((item, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="flex items-center justify-center gap-3 text-white">
                  <item.icon size={20} className="text-primary-500" />
                  <span className="text-sm">{item.text}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section ref={featuredRef} className="py-20 md:py-32">
        <div className="container-custom">
          <div className="text-center mb-16">
            <FadeIn>
              <span className="text-sm uppercase tracking-widest text-primary-500 mb-4 block">
                Seleção Exclusiva
              </span>
            </FadeIn>
            <AnimatedText
              as="h2"
              className="font-display text-4xl md:text-5xl text-charcoal mb-6"
              animation="fadeUp"
            >
              Destaques da Coleção
            </AnimatedText>
            <FadeIn delay={0.2}>
              <p className="text-secondary-600 max-w-2xl mx-auto">
                Peças selecionadas que representam o melhor da nossa tradição relojoeira.
                Cada relógio conta uma história única de precisão e elegância.
              </p>
            </FadeIn>
          </div>

          <AnimatedProductGrid products={featuredProducts} columns={4} />

          <FadeIn delay={0.4}>
            <div className="text-center mt-12">
              <Link to="/shop">
                <Button variant="secondary">
                  Ver Todos os Relógios
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-20 bg-secondary-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <FadeIn>
              <span className="text-sm uppercase tracking-widest text-primary-500 mb-4 block">
                Coleções
              </span>
            </FadeIn>
            <AnimatedText
              as="h2"
              className="font-display text-4xl md:text-5xl text-charcoal"
              animation="fadeUp"
            >
              Explore por Categoria
            </AnimatedText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.slice(0, 3).map((collection, index) => (
              <FadeIn key={collection.id} delay={index * 0.15}>
                <Link
                  to={`/shop?categoria=${collection.handle}`}
                  className="group relative aspect-[4/5] overflow-hidden block"
                >
                  {/* Image Container */}
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={collection.image}
                      alt={collection.title}
                      className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105"
                    />
                  </div>

                  {/* Overlay - sutil e elegante */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300 ease-out group-hover:-translate-y-1">
                    <h3 className="font-display text-2xl text-white mb-2">
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

      {/* Brand Story */}
      <section className="py-20 md:py-32">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FadeIn direction="left">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80"
                  alt="Atelier Belvoir"
                  className="w-full aspect-[4/5] object-cover"
                />
                <div className="absolute -bottom-6 -right-6 bg-primary-500 text-white p-6 hidden md:block">
                  <span className="font-display text-4xl block">37</span>
                  <span className="text-sm uppercase tracking-wider">Anos de Tradição</span>
                </div>
              </div>
            </FadeIn>

            <div>
              <FadeIn>
                <span className="text-sm uppercase tracking-widest text-primary-500 mb-4 block">
                  Nossa História
                </span>
              </FadeIn>
              <AnimatedText
                as="h2"
                className="font-display text-4xl md:text-5xl text-charcoal mb-6"
                animation="fadeUp"
              >
                Tradição que Transcende o Tempo
              </AnimatedText>
              <FadeIn delay={0.2}>
                <p className="text-secondary-600 mb-6">
                  Desde 1987, a Belvoir tem se dedicado à arte da relojoaria de precisão.
                  Nosso atelier em São Paulo combina técnicas centenárias suíças com o
                  design contemporâneo brasileiro, criando peças que são verdadeiras
                  obras de arte mecânica.
                </p>
                <p className="text-secondary-600 mb-8">
                  Cada relógio Belvoir passa por mais de 200 horas de trabalho artesanal,
                  garantindo que você receba não apenas um instrumento de precisão,
                  mas um legado para as próximas gerações.
                </p>
              </FadeIn>
              <FadeIn delay={0.3}>
                <Link to="/sobre">
                  <Button variant="secondary">
                    Conhecer Nossa História
                    <ArrowRight className="ml-2" size={18} />
                  </Button>
                </Link>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 bg-charcoal">
        <div className="container-custom">
          <div className="text-center mb-16">
            <FadeIn>
              <span className="text-sm uppercase tracking-widest text-primary-400 mb-4 block">
                Novidades
              </span>
            </FadeIn>
            <AnimatedText
              as="h2"
              className="font-display text-4xl md:text-5xl text-white"
              animation="fadeUp"
            >
              Lançamentos Recentes
            </AnimatedText>
          </div>

          <AnimatedProductGrid products={newArrivals} columns={4} theme="dark" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="container-custom relative">
          <div className="max-w-2xl mx-auto text-center">
            <FadeIn>
              <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
                Encontre o Seu Relógio Perfeito
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-white/80 text-lg mb-8">
                Nossa equipe de especialistas está pronta para ajudá-lo a encontrar
                a peça ideal para você ou para presentear alguém especial.
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/shop">
                  <Button variant="gold" size="lg">
                    Explorar Coleção
                  </Button>
                </Link>
                <Link to="/contato">
                  <Button variant="secondary" size="lg" className="border-white text-white hover:bg-white hover:text-charcoal">
                    Falar com Especialista
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default HomePage;
