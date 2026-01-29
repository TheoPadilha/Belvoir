# Homepage E-Commerce Premium - Belvoir Relógios

## 🎯 OBJETIVO
Transformar a homepage em um **E-COMMERCE PREMIUM DE VERDADE**, com foco em CONVERSÃO e VENDAS, mantendo animações sofisticadas mas priorizando produtos, CTAs e experiência de compra.

---

## ❌ O QUE REMOVER DA HOMEPAGE ATUAL

### Seção "Nossa Jornada" (Timeline)
- ❌ **REMOVER COMPLETAMENTE** (não excluir código, apenas comentar)
- Motivo: Não agrega em conversão imediata
- Mover para página "/sobre" ou "/nossa-historia"

```jsx
{/* SEÇÃO TEMPORARIAMENTE REMOVIDA - MOVER PARA /SOBRE
<BrandTimeline />
*/}
```

---

## ✅ ESTRUTURA COMPLETA DA NOVA HOMEPAGE E-COMMERCE

### **Ordem das Seções:**
1. Hero 3D Premium (produto em destaque)
2. Banner Promocional (frete grátis, descontos)
3. Grid de Categorias
4. Produtos em Destaque (best sellers)
5. Texto Horizontal Infinito (branding)
6. Coleções Premium (com parallax)
7. Depoimentos/Social Proof
8. Newsletter + Footer

---

## 1. HERO PREMIUM COM PRODUTO EM DESTAQUE ⭐⭐⭐

**O que é:**
Hero gigante com produto 3D que segue o mouse + CTA forte de compra.

```jsx
// components/HeroEcommerce.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';

const HeroEcommerce = () => {
  const mainRef = useRef(null);
  const outerRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const main = mainRef.current;
    const outer = outerRef.current;
    const inner = innerRef.current;

    gsap.set(main, { perspective: 650 });

    const outerRX = gsap.quickTo(outer, "rotationX", { duration: 0.8, ease: "power3.out" });
    const outerRY = gsap.quickTo(outer, "rotationY", { duration: 0.8, ease: "power3.out" });
    const innerX = gsap.quickTo(inner, "x", { duration: 0.8, ease: "power3.out" });
    const innerY = gsap.quickTo(inner, "y", { duration: 0.8, ease: "power3.out" });

    const handlePointerMove = (e) => {
      const xPercent = e.x / window.innerWidth;
      const yPercent = e.y / window.innerHeight;

      outerRX(gsap.utils.interpolate(15, -15, yPercent));
      outerRY(gsap.utils.interpolate(-15, 15, xPercent));
      innerX(gsap.utils.interpolate(-30, 30, xPercent));
      innerY(gsap.utils.interpolate(-30, 30, yPercent));
    };

    const handlePointerLeave = () => {
      outerRX(0);
      outerRY(0);
      innerX(0);
      innerY(0);
    };

    main.addEventListener("pointermove", handlePointerMove);
    main.addEventListener("pointerleave", handlePointerLeave);

    // Animação de entrada
    gsap.from(outer, {
      scale: 0,
      opacity: 0,
      duration: 1.5,
      ease: "back.out(1.7)",
      delay: 0.3
    });

    return () => {
      main.removeEventListener("pointermove", handlePointerMove);
      main.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <section 
      ref={mainRef} 
      className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.3),transparent_50%)]"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Coluna Esquerda - Produto 3D */}
          <div 
            ref={outerRef}
            className="logo-outer relative order-2 lg:order-1"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div 
              ref={innerRef}
              className="logo relative"
            >
              <img 
                src="/images/hero-product.png" 
                alt="Relógio Belvoir Premium" 
                className="w-full max-w-lg mx-auto drop-shadow-2xl"
                style={{ 
                  filter: 'drop-shadow(0 50px 100px rgba(139, 92, 246, 0.5))',
                  transformStyle: 'preserve-3d'
                }}
              />
              
              {/* Glow effect */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-3xl -z-10"
                style={{ transform: 'translateZ(-100px)' }}
              />
            </div>
          </div>

          {/* Coluna Direita - Copy + CTA */}
          <div className="text-left order-1 lg:order-2">
            {/* Badge/Tag */}
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              <span className="text-purple-300 text-sm font-medium">Novo Lançamento</span>
            </div>

            {/* Título */}
            <h1 className="text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Elegância<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Atemporal
              </span>
            </h1>

            {/* Descrição */}
            <p className="text-xl text-gray-300 mb-4">
              Coleção Premium 2026
            </p>
            <p className="text-lg text-gray-400 mb-8 max-w-md">
              Onde o design encontra a precisão. Cada relógio é uma obra de arte que transcende o tempo.
            </p>

            {/* Preço */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-5xl font-bold text-white">R$ 24.900</span>
              <span className="text-2xl text-gray-500 line-through">R$ 32.500</span>
              <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">-23%</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link 
                to="/produto/belvoir-premium-2026"
                className="group relative px-8 py-4 bg-white text-black rounded-full text-lg font-bold overflow-hidden hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10">Comprar Agora</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link 
                to="/colecao/premium-2026"
                className="px-8 py-4 border-2 border-white/20 text-white rounded-full text-lg font-bold hover:bg-white/10 hover:border-white/40 transition-all duration-300"
              >
                Ver Coleção
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Frete Grátis</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Garantia 2 Anos</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>12x sem juros</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default HeroEcommerce;
```

---

## 2. BANNER PROMOCIONAL (STICKY TOP) ⭐⭐

**O que é:**
Banner fino no topo com promoções rotativas (inspirado no Saint Germain).

```jsx
// components/PromoBanner.jsx
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const PromoBanner = () => {
  const [currentPromo, setCurrentPromo] = useState(0);
  const bannerRef = useRef(null);

  const promos = [
    { icon: '🎁', text: 'FRETE GRÁTIS acima de R$350', highlight: true },
    { icon: '💳', text: 'Parcele em até 12x sem juros', highlight: false },
    { icon: '⏰', text: 'HOJE: Compre 1 relógio e ganhe 1 óculos', highlight: true },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promos.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    gsap.from(bannerRef.current, {
      y: -10,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out'
    });
  }, [currentPromo]);

  const promo = promos[currentPromo];

  return (
    <div className={`
      fixed top-0 left-0 right-0 z-40 
      ${promo.highlight ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gray-900'}
      text-white text-center py-3 px-4
    `}>
      <div 
        ref={bannerRef}
        className="flex items-center justify-center gap-3"
      >
        <span className="text-2xl">{promo.icon}</span>
        <span className="font-medium text-sm sm:text-base">
          {promo.text}
        </span>
      </div>

      {/* Dots indicator */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1.5">
        {promos.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              index === currentPromo ? 'bg-white w-4' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromoBanner;
```

---

## 3. GRID DE CATEGORIAS (SHOP BY CATEGORY) ⭐⭐⭐

**O que é:**
Grid visual com fotos das categorias + hover effects (inspirado no Yucca).

```jsx
// components/CategoryGrid.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const CategoryGrid = () => {
  const gridRef = useRef(null);

  useEffect(() => {
    const cards = gsap.utils.toArray('.category-card');

    cards.forEach((card, index) => {
      gsap.from(card, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        },
        delay: index * 0.1
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const categories = [
    {
      name: 'Relógios Femininos',
      image: '/images/categories/feminino.jpg',
      count: '120+ modelos',
      link: '/relogios/feminino'
    },
    {
      name: 'Relógios Masculinos',
      image: '/images/categories/masculino.jpg',
      count: '150+ modelos',
      link: '/relogios/masculino'
    },
    {
      name: 'Vintage',
      image: '/images/categories/vintage.jpg',
      count: '80+ modelos',
      link: '/relogios/vintage'
    },
    {
      name: 'Minimalista',
      image: '/images/categories/minimalista.jpg',
      count: '90+ modelos',
      link: '/relogios/minimalista'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Explore por Categoria
          </h2>
          <p className="text-xl text-gray-600">
            Encontre o relógio perfeito para o seu estilo
          </p>
        </div>

        {/* Grid */}
        <div 
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className="category-card group relative h-96 rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* Imagem */}
              <img 
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Conteúdo */}
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-300 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {category.count}
                </p>
                <div className="flex items-center gap-2 text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span>Ver Coleção</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>

              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-x-full group-hover:translate-x-0" />
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategoryGrid;
```

---

## 4. PRODUTOS EM DESTAQUE (BEST SELLERS) ⭐⭐⭐

**O que é:**
Grid de produtos com animações de entrada + quick view + add to cart.

```jsx
// components/FeaturedProducts.jsx
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const FeaturedProducts = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const cards = gsap.utils.toArray('.product-card-featured');

    gsap.from(cards, {
      y: 80,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%'
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const products = [
    {
      id: 1,
      name: 'Belvoir Classic Gold',
      price: 24900,
      originalPrice: 32500,
      image: '/images/products/classic-gold.jpg',
      badge: 'BEST SELLER',
      rating: 4.9
    },
    {
      id: 2,
      name: 'Belvoir Minimal Silver',
      price: 18700,
      originalPrice: 24500,
      image: '/images/products/minimal-silver.jpg',
      badge: 'NOVO',
      rating: 4.8
    },
    {
      id: 3,
      name: 'Belvoir Vintage Rose',
      price: 21200,
      originalPrice: 28000,
      image: '/images/products/vintage-rose.jpg',
      badge: null,
      rating: 4.7
    },
    {
      id: 4,
      name: 'Belvoir Sport Black',
      price: 19900,
      originalPrice: 26500,
      image: '/images/products/sport-black.jpg',
      badge: 'OFERTA',
      rating: 4.9
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <section ref={sectionRef} className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-5xl font-bold text-gray-900 mb-3">
              Mais Vendidos
            </h2>
            <p className="text-xl text-gray-600">
              Os relógios favoritos dos nossos clientes
            </p>
          </div>
          <Link 
            to="/shop"
            className="hidden sm:flex items-center gap-2 text-lg font-medium text-gray-900 hover:gap-4 transition-all"
          >
            <span>Ver Todos</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Grid de produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const discount = Math.round((1 - product.price / product.originalPrice) * 100);

            return (
              <div
                key={product.id}
                className="product-card-featured group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-500"
              >
                {/* Imagem */}
                <Link to={`/produto/${product.id}`} className="relative block aspect-square overflow-hidden bg-gray-100">
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-4 left-4 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      {product.badge}
                    </div>
                  )}

                  {/* Desconto */}
                  {discount > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      -{discount}%
                    </div>
                  )}

                  {/* Quick actions (aparecem no hover) */}
                  <div className="absolute inset-x-4 bottom-4 flex gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    <button className="flex-1 bg-white text-black py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
                      Quick View
                    </button>
                  </div>
                </Link>

                {/* Info */}
                <div className="p-6">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
                  </div>

                  {/* Nome */}
                  <Link to={`/produto/${product.id}`}>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-purple-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Preço */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  </div>

                  {/* Add to cart */}
                  <button className="w-full bg-black text-white py-3 rounded-full font-bold hover:bg-gray-800 transition-colors">
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ver todos (mobile) */}
        <div className="sm:hidden text-center mt-8">
          <Link 
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full font-bold"
          >
            <span>Ver Todos os Produtos</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;
```

---

## 5. TEXTO HORIZONTAL INFINITO (BRANDING) ⭐⭐

**Manter do prompt anterior** - já está perfeito para branding!

```jsx
// Já implementado anteriormente - manter!
<HorizontalText />
```

---

## 6. COLEÇÕES PREMIUM (COM PARALLAX) ⭐⭐

**O que é:**
Showcase das coleções principais com parallax suave.

```jsx
// components/CollectionsShowcase.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const CollectionsShowcase = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const cards = gsap.utils.toArray('.collection-card');

    cards.forEach((card, index) => {
      const speed = (index % 2) + 1;
      const direction = index % 2 === 0 ? 1 : -1;

      gsap.to(card, {
        y: direction * speed * 100,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const collections = [
    {
      name: 'Coleção Vintage',
      description: 'Clássicos reinventados',
      image: '/images/collections/vintage.jpg',
      link: '/colecoes/vintage'
    },
    {
      name: 'Coleção Minimal',
      description: 'Elegância discreta',
      image: '/images/collections/minimal.jpg',
      link: '/colecoes/minimal'
    },
    {
      name: 'Coleção Sport',
      description: 'Performance e estilo',
      image: '/images/collections/sport.jpg',
      link: '/colecoes/sport'
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-black">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">
            Nossas Coleções
          </h2>
          <p className="text-xl text-gray-400">
            Cada coleção conta uma história única
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <Link
              key={index}
              to={collection.link}
              className="collection-card group relative h-[600px] rounded-2xl overflow-hidden"
            >
              <img 
                src={collection.image}
                alt={collection.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-3xl font-bold text-white mb-2">
                  {collection.name}
                </h3>
                <p className="text-gray-300 mb-4">
                  {collection.description}
                </p>
                <div className="flex items-center gap-2 text-white font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <span>Explorar</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CollectionsShowcase;
```

---

## 7. SOCIAL PROOF (DEPOIMENTOS) ⭐⭐

```jsx
// components/Testimonials.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Testimonials = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const cards = gsap.utils.toArray('.testimonial-card');

    gsap.from(cards, {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%'
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const testimonials = [
    {
      name: 'Ana Silva',
      role: 'Arquiteta',
      image: '/images/testimonials/ana.jpg',
      text: 'Comprei meu segundo relógio Belvoir. A qualidade é incomparável e o atendimento impecável.',
      rating: 5
    },
    {
      name: 'Carlos Eduardo',
      role: 'Empresário',
      image: '/images/testimonials/carlos.jpg',
      text: 'O relógio perfeito para qualquer ocasião. Elegante, discreto e de altíssima qualidade.',
      rating: 5
    },
    {
      name: 'Mariana Costa',
      role: 'Designer',
      image: '/images/testimonials/mariana.jpg',
      text: 'Design impecável! Recebo elogios toda vez que uso. Vale cada centavo investido.',
      rating: 5
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            O Que Dizem Nossos Clientes
          </h2>
          <div className="flex items-center justify-center gap-2 text-yellow-400 mb-3">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-gray-600">Mais de 10.000 clientes satisfeitos</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-500"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
```

---

## 8. NEWSLETTER + FOOTER ⭐

```jsx
// components/NewsletterFooter.jsx
const NewsletterFooter = () => {
  return (
    <>
      {/* Newsletter */}
      <section className="py-24 bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Fique por Dentro
          </h2>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Receba lançamentos exclusivos, ofertas especiais e conteúdo sobre relojoaria
          </p>

          <form className="max-w-md mx-auto flex gap-3">
            <input 
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-8 py-4 bg-white text-purple-900 rounded-full font-bold hover:bg-gray-100 transition-colors whitespace-nowrap">
              Inscrever
            </button>
          </form>

          <p className="text-sm text-purple-300 mt-4">
            🎁 Ganhe 10% OFF na primeira compra
          </p>
        </div>
      </section>

      {/* Footer - usar o InteractiveFooter já criado anteriormente */}
    </>
  );
};

export default NewsletterFooter;
```

---

## 📋 ESTRUTURA FINAL DA HOMEPAGE

```jsx
// pages/Home.jsx
import PromoBanner from '../components/PromoBanner';
import HeroEcommerce from '../components/HeroEcommerce';
import CategoryGrid from '../components/CategoryGrid';
import FeaturedProducts from '../components/FeaturedProducts';
import HorizontalText from '../components/HorizontalText';
import CollectionsShowcase from '../components/CollectionsShowcase';
import Testimonials from '../components/Testimonials';
import NewsletterFooter from '../components/NewsletterFooter';
import InteractiveFooter from '../components/InteractiveFooter';

const Home = () => {
  return (
    <>
      {/* Banner fixo no topo */}
      <PromoBanner />
      
      {/* 1. Hero com produto 3D */}
      <HeroEcommerce />
      
      {/* 2. Categorias */}
      <CategoryGrid />
      
      {/* 3. Produtos em destaque */}
      <FeaturedProducts />
      
      {/* 4. Texto horizontal (branding) */}
      <HorizontalText />
      
      {/* 5. Coleções */}
      <CollectionsShowcase />
      
      {/* 6. Depoimentos */}
      <Testimonials />
      
      {/* 7. Newsletter */}
      <NewsletterFooter />
      
      {/* 8. Footer */}
      <InteractiveFooter />
      
      {/* REMOVIDO TEMPORARIAMENTE:
      <BrandTimeline />
      Mover para /sobre ou /nossa-historia
      */}
    </>
  );
};

export default Home;
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Remover/Comentar:
- [ ] Seção "Nossa Jornada" (BrandTimeline)
- [ ] Mover BrandTimeline para página /sobre

### Adicionar:
- [ ] PromoBanner (sticky top)
- [ ] HeroEcommerce (produto 3D + copy + CTA)
- [ ] CategoryGrid (4 categorias principais)
- [ ] FeaturedProducts (best sellers)
- [ ] CollectionsShowcase (3 coleções)
- [ ] Testimonials (3 depoimentos)
- [ ] NewsletterFooter (newsletter + footer)

### Manter:
- [ ] HorizontalText (já implementado)
- [ ] InteractiveFooter (já implementado)
- [ ] Todas animações GSAP

---

## 💰 IMPACTO NO ORÇAMENTO

**Homepage E-Commerce Completa:**
- Mais focada em conversão
- Produtos visíveis desde o início
- CTAs claros
- Social proof
- **Complexidade:** Média-Alta (menos que a versão anterior)
- **Tempo:** 3-4 semanas

**Valor sugerido:** R$ 12.000 - R$ 15.000
(Menos que a versão ultra-complexa, mais focada em resultados)

---

## 🎯 DIFERENCIAIS DA NOVA HOMEPAGE

**E-commerce focado:**
- ✅ Produtos aparecem logo no scroll
- ✅ Categorias visuais
- ✅ CTAs em todas as seções
- ✅ Preços e promoções destacados
- ✅ Social proof (depoimentos)
- ✅ Newsletter capture

**Mantém o WOW:**
- ✅ Hero 3D que segue mouse
- ✅ Animações GSAP sofisticadas
- ✅ Texto horizontal infinito
- ✅ Parallax em coleções
- ✅ Visual premium

**Inspirado em:**
- Yucca (categorias visuais, grid limpo)
- Saint Germain (banner promo, produtos em destaque)

---

Agora sim tá com cara de **E-COMMERCE PREMIUM DE VERDADE**! 🛍️💎✨