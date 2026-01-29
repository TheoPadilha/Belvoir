# Homepage Premium Ultra-Complexa - Animações GSAP Avançadas

## 🎯 OBJETIVO

Criar uma homepage que seja **VISUALMENTE IMPRESSIONANTE**, com animações complexas que gritam "SITE CARO". Nada de simplicidade - queremos complexidade, movimento, interatividade 3D e efeitos WOW em cada seção.

---

## ❌ O QUE NÃO QUEREMOS

- ❌ Mouse virando bolinha simples (remover completamente)
- ❌ Homepage "limpa" e minimalista
- ❌ Animações básicas de fade-in
- ❌ Layout estático
- ❌ Visual "seguro" e corporativo

## ✅ O QUE QUEREMOS

- ✅ Logo/elementos 3D que seguem o mouse com perspective
- ✅ Texto horizontal infinito que scrolla lateralmente
- ✅ Scroll hijacking com snap entre seções
- ✅ Parallax complexo em múltiplas camadas
- ✅ Transições cinematográficas entre seções
- ✅ Elementos que rotacionam, escalem e se movem com física
- ✅ Typography dinâmica e experimental
- ✅ Cada seção deve ter uma animação única

---

## 🎨 ANIMAÇÕES OBRIGATÓRIAS

### 1. **Hero Section - Logo/Produto 3D que Segue o Mouse** ⭐⭐⭐

**O que é:**
Logo ou imagem do produto em 3D que rotaciona seguindo o movimento do mouse, criando efeito de profundidade e parallax 3D.

**Código Base:**

```jsx
// components/Hero3D.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Hero3D = () => {
  const mainRef = useRef(null);
  const outerRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const main = mainRef.current;
    const outer = outerRef.current;
    const inner = innerRef.current;

    // Configurar perspectiva 3D
    gsap.set(main, { perspective: 650 });

    // QuickTo para performance otimizada
    const outerRX = gsap.quickTo(outer, "rotationX", {
      duration: 0.8,
      ease: "power3.out",
    });
    const outerRY = gsap.quickTo(outer, "rotationY", {
      duration: 0.8,
      ease: "power3.out",
    });
    const innerX = gsap.quickTo(inner, "x", {
      duration: 0.8,
      ease: "power3.out",
    });
    const innerY = gsap.quickTo(inner, "y", {
      duration: 0.8,
      ease: "power3.out",
    });

    const handlePointerMove = (e) => {
      const xPercent = e.x / window.innerWidth;
      const yPercent = e.y / window.innerHeight;

      // Rotação do container externo (3D)
      outerRX(gsap.utils.interpolate(15, -15, yPercent));
      outerRY(gsap.utils.interpolate(-15, 15, xPercent));

      // Movimento do elemento interno (parallax)
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
      delay: 0.3,
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

      {/* Container 3D externo */}
      <div
        ref={outerRef}
        className="logo-outer relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Elemento interno (produto/logo) */}
        <div ref={innerRef} className="logo relative">
          {/* Imagem do produto/logo */}
          <img
            src="/images/product-hero.png"
            alt="Produto Premium"
            className="w-[600px] h-auto drop-shadow-2xl"
            style={{
              filter: "drop-shadow(0 50px 100px rgba(139, 92, 246, 0.5))",
              transformStyle: "preserve-3d",
            }}
          />

          {/* Layers adicionais para profundidade */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-3xl -z-10"
            style={{ transform: "translateZ(-100px)" }}
          />
        </div>

        {/* Texto principal */}
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 text-center w-full">
          <h1
            className="text-8xl font-bold text-white mb-4"
            style={{ textShadow: "0 0 80px rgba(139, 92, 246, 0.5)" }}
          >
            BELVOIR
          </h1>
          <p className="text-2xl text-gray-400 font-light">
            Elegância que se move com você
          </p>
        </div>
      </div>

      {/* Partículas flutuantes (opcional) */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero3D;
```

**CSS necessário:**

```css
/* globals.css */
@keyframes float {
  0%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }
  50% {
    transform: translateY(-100vh) scale(1.5);
    opacity: 0.8;
  }
}

.animate-float {
  animation: float linear infinite;
}
```

---

### 2. **Seção de Texto Horizontal Infinito (Scroll Lateral)** ⭐⭐⭐

**O que é:**
Texto GIGANTE que scrolla horizontalmente quando você faz scroll vertical, com letras que aparecem randomicamente de diferentes ângulos.

**Código:**

```jsx
// components/HorizontalText.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

const HorizontalText = () => {
  const wrapperRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const text = textRef.current;

    // Split text into chars
    const split = new SplitType(text, { types: "chars, words" });

    // Scroll horizontal do texto
    const scrollTween = gsap.to(text, {
      xPercent: -100,
      ease: "none",
      scrollTrigger: {
        trigger: wrapper,
        pin: true,
        start: "top top",
        end: "+=5000px",
        scrub: 1,
        anticipatePin: 1,
      },
    });

    // Animar cada caractere individualmente
    split.chars.forEach((char) => {
      gsap.from(char, {
        yPercent: gsap.utils.random(-200, 200),
        rotation: gsap.utils.random(-20, 20),
        opacity: 0,
        scale: 0,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: char,
          containerAnimation: scrollTween,
          start: "left 100%",
          end: "left 30%",
          scrub: 1,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      split.revert();
    };
  }, []);

  return (
    <section
      ref={wrapperRef}
      className="Horizontal relative h-screen bg-black overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center">
        <h2
          ref={textRef}
          className="Horizontal__text text-[25vw] font-bold text-transparent whitespace-nowrap"
          style={{
            WebkitTextStroke: "2px white",
            textStroke: "2px white",
            fontFamily: "serif",
          }}
        >
          COLEÇÃO PREMIUM • ELEGÂNCIA ATEMPORAL • DESIGN EXCLUSIVO •
        </h2>
      </div>

      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />
    </section>
  );
};

export default HorizontalText;
```

---

### 3. **Scroll Snap Infinito entre Seções (Loop Seamless)** ⭐⭐⭐

**O que é:**
Cada seção ocupa a tela inteira e o scroll "prende" em cada uma. Quando chega no final, volta pro início suavemente (loop infinito).

**Código:**

```jsx
// components/SnappingSections.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SnappingSections = ({ children }) => {
  const containerRef = useRef(null);
  const maxScrollRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const panels = gsap.utils.toArray(".panel");

    // Clonar primeiro painel pro final (loop seamless)
    const copy = panels[0].cloneNode(true);
    container.appendChild(copy);

    // Pin cada painel
    panels.forEach((panel) => {
      ScrollTrigger.create({
        trigger: panel,
        start: "top top",
        pin: true,
        pinSpacing: false,
      });
    });

    // Função para calcular maxScroll
    const onResize = () => {
      maxScrollRef.current = ScrollTrigger.maxScroll(window) - 1;
    };
    onResize();

    // Snap pro painel mais próximo
    const pageScrollTrigger = ScrollTrigger.create({
      snap: (value) => {
        let snappedValue = gsap.utils.snap(1 / panels.length, value);

        // Prevent wrapping at edges
        if (snappedValue <= 0) {
          return 1.05 / maxScrollRef.current;
        } else if (snappedValue >= 1) {
          return maxScrollRef.current / (maxScrollRef.current + 1.05);
        }
        return snappedValue;
      },
    });

    // Loop infinito
    const handleScroll = (e) => {
      const scroll = pageScrollTrigger.scroll();

      if (scroll > maxScrollRef.current) {
        pageScrollTrigger.scroll(1);
        e.preventDefault();
      } else if (scroll < 1) {
        pageScrollTrigger.scroll(maxScrollRef.current - 1);
        e.preventDefault();
      }
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", handleScroll, { passive: false });

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", handleScroll);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <div ref={containerRef}>{children}</div>;
};

// Componente de Painel Individual
const Panel = ({ children, bgColor = "bg-black", index }) => {
  return (
    <section
      className={`panel relative h-screen flex items-center justify-center ${bgColor}`}
    >
      <div className="relative z-10 text-center px-8">{children}</div>

      {/* Número do painel */}
      <div className="absolute top-8 right-8 text-8xl font-bold text-white/5">
        {String(index + 1).padStart(2, "0")}
      </div>
    </section>
  );
};

export { SnappingSections, Panel };
```

**Uso:**

```jsx
// pages/Home.jsx
import { SnappingSections, Panel } from "../components/SnappingSections";

const Home = () => {
  return (
    <>
      <Hero3D />
      <HorizontalText />

      <SnappingSections>
        <Panel bgColor="bg-gradient-to-br from-purple-900 to-black" index={0}>
          <h2 className="text-7xl font-bold text-white mb-6">Seção 1</h2>
          <p className="text-2xl text-gray-300">Conteúdo incrível aqui</p>
        </Panel>

        <Panel bgColor="bg-gradient-to-br from-blue-900 to-black" index={1}>
          <h2 className="text-7xl font-bold text-white mb-6">Seção 2</h2>
          <p className="text-2xl text-gray-300">Mais conteúdo premium</p>
        </Panel>

        <Panel bgColor="bg-gradient-to-br from-pink-900 to-black" index={2}>
          <h2 className="text-7xl font-bold text-white mb-6">Seção 3</h2>
          <p className="text-2xl text-gray-300">E mais ainda</p>
        </Panel>
      </SnappingSections>
    </>
  );
};
```

---

### 4. **Galeria de Produtos com Parallax Extremo** ⭐⭐

**O que é:**
Cards de produtos que se movem em diferentes velocidades/direções ao scrollar, criando profundidade 3D.

**Código:**

```jsx
// components/ProductGalleryParallax.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ProductGalleryParallax = ({ products }) => {
  const galleryRef = useRef(null);

  useEffect(() => {
    const cards = gsap.utils.toArray(".product-card-parallax");

    cards.forEach((card, index) => {
      const speed = (index % 3) + 1; // velocidades: 1, 2, 3
      const direction = index % 2 === 0 ? 1 : -1; // alternando direção

      gsap.to(card, {
        y: direction * speed * 150,
        rotationZ: direction * speed * 5,
        scrollTrigger: {
          trigger: galleryRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Hover effect 3D
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          scale: 1.1,
          rotationY: 10,
          z: 100,
          duration: 0.5,
          ease: "power2.out",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          scale: 1,
          rotationY: 0,
          z: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={galleryRef}
      className="relative min-h-screen py-32 bg-black"
      style={{ perspective: "1000px" }}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-7xl font-bold text-white text-center mb-24">
          Coleção Premium
        </h2>

        <div className="grid grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="product-card-parallax relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden group cursor-pointer"
              style={{
                transformStyle: "preserve-3d",
                height: "500px",
              }}
            >
              {/* Imagem do produto */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Info do produto */}
              <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-3xl font-bold text-white mb-2">
                  {product.name}
                </h3>
                <p className="text-xl text-gray-300 mb-4">{product.price}</p>
                <button className="px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors">
                  Ver Detalhes
                </button>
              </div>

              {/* Shine effect */}
              <div
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ transform: "translateX(-100%) rotate(45deg)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGalleryParallax;
```

---

### 5. **Timeline de Marca com Scroll Reveal Progressivo** ⭐⭐

**O que é:**
História da marca contada através de uma linha do tempo vertical onde cada item aparece com animação complexa ao scrollar.

**Código:**

```jsx
// components/BrandTimeline.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BrandTimeline = () => {
  const timelineRef = useRef(null);

  useEffect(() => {
    const items = gsap.utils.toArray(".timeline-item");

    items.forEach((item, index) => {
      const isLeft = index % 2 === 0;

      gsap.from(item, {
        x: isLeft ? -200 : 200,
        opacity: 0,
        rotationY: isLeft ? -45 : 45,
        scale: 0.8,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
          toggleActions: "play none none reverse",
        },
      });
    });

    // Animar linha central
    gsap.from(".timeline-line", {
      scaleY: 0,
      transformOrigin: "top",
      ease: "none",
      scrollTrigger: {
        trigger: timelineRef.current,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const timelineData = [
    {
      year: "1995",
      title: "Fundação",
      description: "Nasceu o sonho de criar relógios excepcionais",
    },
    {
      year: "2005",
      title: "Expansão Global",
      description: "Abertura de boutiques em 15 países",
    },
    {
      year: "2015",
      title: "Inovação",
      description: "Lançamento da coleção revolucionária",
    },
    {
      year: "2025",
      title: "Sustentabilidade",
      description: "Compromisso com o futuro do planeta",
    },
  ];

  return (
    <section
      ref={timelineRef}
      className="relative py-32 bg-gradient-to-b from-black via-gray-900 to-black"
      style={{ perspective: "1500px" }}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-7xl font-bold text-white text-center mb-24">
          Nossa História
        </h2>

        <div className="relative max-w-5xl mx-auto">
          {/* Linha central */}
          <div className="timeline-line absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-blue-500 to-pink-500 transform -translate-x-1/2" />

          {/* Items da timeline */}
          {timelineData.map((item, index) => {
            const isLeft = index % 2 === 0;

            return (
              <div
                key={index}
                className={`timeline-item relative mb-32 flex items-center ${
                  isLeft ? "flex-row" : "flex-row-reverse"
                }`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Conteúdo */}
                <div
                  className={`w-5/12 ${isLeft ? "text-right pr-16" : "text-left pl-16"}`}
                >
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-purple-500 transition-colors">
                    <span className="text-5xl font-bold text-purple-400 block mb-4">
                      {item.year}
                    </span>
                    <h3 className="text-3xl font-bold text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-lg">{item.description}</p>
                  </div>
                </div>

                {/* Dot central */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <div className="w-6 h-6 bg-purple-500 rounded-full border-4 border-black shadow-lg shadow-purple-500/50" />
                </div>

                {/* Espaçador */}
                <div className="w-5/12" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BrandTimeline;
```

---

### 6. **Seção de Manifesto com Typography Dinâmica** ⭐⭐⭐

**O que é:**
Texto grande que aparece palavra por palavra, com cada palavra tendo animação e tamanho únicos.

**Código:**

```jsx
// components/ManifestoSection.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

const ManifestoSection = () => {
  const textRef = useRef(null);

  useEffect(() => {
    const text = textRef.current;
    const split = new SplitType(text, { types: "words" });

    split.words.forEach((word, index) => {
      const randomScale = gsap.utils.random(0.8, 1.5);
      const randomRotation = gsap.utils.random(-5, 5);

      gsap.from(word, {
        opacity: 0,
        scale: 0,
        rotation: randomRotation,
        y: gsap.utils.random(-100, 100),
        duration: 1.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: word,
          start: "top 90%",
          end: "top 50%",
          scrub: 1,
          onEnter: () => {
            gsap.to(word, {
              scale: randomScale,
              duration: 0.3,
            });
          },
        },
      });

      // Hover effect
      word.addEventListener("mouseenter", () => {
        gsap.to(word, {
          scale: randomScale * 1.2,
          color: "#8b5cf6",
          duration: 0.3,
        });
      });

      word.addEventListener("mouseleave", () => {
        gsap.to(word, {
          scale: randomScale,
          color: "#ffffff",
          duration: 0.3,
        });
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      split.revert();
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black py-32">
      <div className="container mx-auto px-4">
        <p
          ref={textRef}
          className="text-5xl md:text-7xl font-bold text-white text-center leading-relaxed"
          style={{ fontFamily: "serif" }}
        >
          Nós não fazemos relógios. Criamos legados. Esculpimos o tempo.
          Desenhamos eternidade. Cada peça é uma obra de arte que transcende
          gerações.
        </p>
      </div>

      {/* Background animated gradient */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 30% 50%, rgba(139, 92, 246, 0.3), transparent 70%), radial-gradient(circle at 70% 50%, rgba(59, 130, 246, 0.3), transparent 70%)",
            animation: "pulse 8s ease-in-out infinite",
          }}
        />
      </div>
    </section>
  );
};

export default ManifestoSection;
```

---

### 7. **Footer Interativo com Distorção de Imagem** ⭐⭐

**O que é:**
Footer com imagem de fundo que distorce conforme você move o mouse.

**Código:**

```jsx
// components/InteractiveFooter.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const InteractiveFooter = () => {
  const imageRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const image = imageRef.current;
    const overlay = overlayRef.current;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;

      gsap.to(image, {
        x: xPercent * 50,
        y: yPercent * 50,
        scale: 1.1,
        rotation: xPercent * 2,
        duration: 1,
        ease: "power2.out",
      });

      gsap.to(overlay, {
        x: -xPercent * 30,
        y: -yPercent * 30,
        duration: 1,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <footer className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Imagem de fundo com distorção */}
      <div className="absolute inset-0">
        <img
          ref={imageRef}
          src="/images/footer-bg.jpg"
          alt="Background"
          className="w-full h-full object-cover"
          style={{ transformOrigin: "center" }}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Overlay com gradiente */}
      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 0%, rgba(139, 92, 246, 0.3) 100%)",
        }}
      />

      {/* Conteúdo */}
      <div className="relative z-10 text-center text-white">
        <h2 className="text-8xl font-bold mb-8">BELVOIR</h2>
        <p className="text-2xl text-gray-300 mb-12">
          Onde o tempo encontra a perfeição
        </p>

        <div className="flex gap-8 justify-center mb-12">
          {["Instagram", "Facebook", "WhatsApp"].map((social) => (
            <button
              key={social}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-lg font-medium hover:bg-white/20 hover:scale-110 transition-all duration-300"
            >
              {social}
            </button>
          ))}
        </div>

        <p className="text-gray-500">
          © 2026 Belvoir. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default InteractiveFooter;
```

---

## 📋 ESTRUTURA COMPLETA DA HOMEPAGE

```jsx
// pages/Home.jsx
import Hero3D from "../components/Hero3D";
import HorizontalText from "../components/HorizontalText";
import { SnappingSections, Panel } from "../components/SnappingSections";
import ProductGalleryParallax from "../components/ProductGalleryParallax";
import BrandTimeline from "../components/BrandTimeline";
import ManifestoSection from "../components/ManifestoSection";
import InteractiveFooter from "../components/InteractiveFooter";

const Home = () => {
  const products = [
    {
      id: 1,
      name: "Relógio Premium 1",
      price: "R$ 24.900",
      image: "/products/1.jpg",
    },
    {
      id: 2,
      name: "Relógio Premium 2",
      price: "R$ 32.500",
      image: "/products/2.jpg",
    },
    {
      id: 3,
      name: "Relógio Premium 3",
      price: "R$ 18.700",
      image: "/products/3.jpg",
    },
    // ... mais produtos
  ];

  return (
    <div className="homepage-container">
      {/* 1. Hero 3D que segue mouse */}
      <Hero3D />

      {/* 2. Texto horizontal infinito */}
      <HorizontalText />

      {/* 3. Seções com snap scroll */}
      <SnappingSections>
        {/* 3a. Galeria de produtos com parallax extremo */}
        <Panel bgColor="bg-black" index={0}>
          <ProductGalleryParallax products={products} />
        </Panel>

        {/* 3b. Timeline da marca */}
        <Panel bgColor="bg-gradient-to-br from-gray-900 to-black" index={1}>
          <BrandTimeline />
        </Panel>

        {/* 3c. Manifesto com typography dinâmica */}
        <Panel bgColor="bg-black" index={2}>
          <ManifestoSection />
        </Panel>
      </SnappingSections>

      {/* 4. Footer interativo */}
      <InteractiveFooter />
    </div>
  );
};

export default Home;
```

---

## 🎨 ANIMAÇÕES ADICIONAIS (OPCIONAL - EXTRA WOW)

### 8. **Cursor de Spotlight que Revela Conteúdo**

```jsx
// components/SpotlightCursor.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const SpotlightCursor = () => {
  const spotlightRef = useRef(null);

  useEffect(() => {
    const spotlight = spotlightRef.current;
    let mouseX = 0,
      mouseY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      gsap.to(spotlight, {
        x: mouseX - 150,
        y: mouseY - 150,
        duration: 0.3,
        ease: "power2.out",
      });
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={spotlightRef}
      className="fixed w-[300px] h-[300px] rounded-full pointer-events-none z-50"
      style={{
        background:
          "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
        mixBlendMode: "screen",
      }}
    />
  );
};

export default SpotlightCursor;
```

---

## 📦 DEPENDÊNCIAS NECESSÁRIAS

```bash
npm install gsap
npm install split-type
npm install @studio-freight/lenis
```

---

## ⚙️ CONFIGURAÇÃO DO PROJETO

### 1. **Remover cursor de bolinha (CustomCursor anterior)**

```jsx
// Remover do App.jsx ou Layout:
// import CustomCursor from './components/CustomCursor'; ❌
```

### 2. **Configurar GSAP globalmente**

```jsx
// App.jsx ou _app.jsx
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Conectar Lenis com ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove();
    };
  }, []);

  return (
    <>
      {/* <SpotlightCursor /> opcional */}
      {/* suas rotas */}
    </>
  );
}
```

---

## 🎯 CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1 - Fundações (Semana 1):

- [ ] Remover cursor de bolinha antigo
- [ ] Configurar GSAP + ScrollTrigger globalmente
- [ ] Configurar Lenis smooth scroll
- [ ] Instalar split-type para text animations

### Fase 2 - Hero & Principais (Semana 2):

- [ ] Hero 3D com logo/produto seguindo mouse
- [ ] Texto horizontal infinito com scroll lateral
- [ ] Scroll snap entre seções (loop infinito)
- [ ] Background gradiente animado

### Fase 3 - Seções Complexas (Semana 3):

- [ ] Galeria de produtos com parallax extremo
- [ ] Timeline da marca com scroll reveal
- [ ] Manifesto com typography dinâmica
- [ ] Footer interativo com distorção

### Fase 4 - Polish (Semana 4):

- [ ] Ajustar timings e easings
- [ ] Otimizar performance (60fps)
- [ ] Testar em diferentes resoluções
- [ ] Adicionar loading states
- [ ] Mobile: versões simplificadas

---

## 💰 IMPACTO NO ORÇAMENTO

Homepage ULTRA-COMPLEXA com essas animações:

**Tempo estimado:** +50-70 horas
**Complexidade:** ALTÍSSIMA
**Wow-factor:** 💯💯💯

**Valor adicional sugerido:**

- Hero 3D + Mouse interactions: +R$ 3.000
- Texto horizontal infinito: +R$ 2.500
- Scroll snap infinito: +R$ 2.000
- Parallax gallery complexo: +R$ 2.500
- Timeline + Manifesto: +R$ 2.000
- Polish e otimizações: +R$ 2.000

**Total adicional:** R$ 14.000 - R$ 18.000

**VALOR TOTAL DO PROJETO:**

- Projeto base: R$ 6.500
- Login + Contato: R$ 2.000
- Animações anteriores (Shopify-style): R$ 7.000
- **Homepage ultra-complexa: R$ 15.000**
- **TOTAL: R$ 30.500 - R$ 35.000** 🔥

---

## 🚨 NOTAS CRÍTICAS

**Performance:**

- TODAS as animações devem rodar a 60fps
- Usar `will-change` com cuidado
- requestAnimationFrame para loops
- Lazy load de imagens pesadas
- Reduzir animações em mobile

**Mobile:**

- Versões simplificadas das animações
- Desabilitar parallax complexo
- Reduzir quantidade de elementos 3D
- Touch gestures otimizados

**Acessibilidade:**

- Respeitar `prefers-reduced-motion`
- Fallbacks para navegadores antigos
- Garantir que conteúdo é acessível sem JS

---

## 🎬 RESULTADO FINAL

Uma homepage que:

- ✅ Parece custar R$ 100.000+
- ✅ Tem animações em CADA elemento
- ✅ Nunca fica parada (sempre tem movimento)
- ✅ Interatividade com mouse em 3D
- ✅ Scroll experience cinematográfica
- ✅ Typography experimental
- ✅ Transições complexas entre seções
- ✅ Visual PREMIUM e LUXUOSO

**É ISSO que o mercado de luxo espera!** 💎✨🚀
