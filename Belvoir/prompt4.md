# Animações Premium Inspiradas no Shopify Editions Winter '26

## 🎯 OBJETIVO

Implementar animações de ALTÍSSIMO NÍVEL inspiradas no site **Shopify Editions Winter '26**, transformando o e-commerce em uma experiência visual cinematográfica e glamurosa. Foco em interatividade, movimento fluido e efeitos que seguem o cursor.

---

## 🔍 ANÁLISE DO SITE SHOPIFY EDITIONS WINTER '26

### Stack Técnica Identificada:

- **Three.js** (172) - Renderização 3D e efeitos WebGL
- **Theatre.js** - Animações sequenciais e orquestração
- **Anime.js** - Micro-animações e transições
- **Lenis** (1.3.11) - Smooth scroll premium
- **GSAP** - ScrollTrigger e animações complexas
- **React** - Framework principal
- **React Router** (6) - Roteamento
- **HeroUI** - Componentes UI
- **Remix** - Framework web (servidor + SSR)
- **Google Tag Manager** - Analytics
- **Facebook Pixel** - Tracking
- **Open Graph** - Meta tags sociais

### Características Visuais Identificadas:

✨ **Background que segue o mouse** (gradiente/luz interativa)
✨ **Parallax 3D** em múltiplas camadas
✨ **Elementos 3D** renderizados em WebGL
✨ **Scroll hijacking** suave (storytelling por scroll)
✨ **Magnetic elements** (botões/cards que atraem cursor)
✨ **Reveal animations** em cascata
✨ **Text splitting** com animação letra por letra
✨ **Cursor customizado** que muda por contexto
✨ **Hero sections** com vídeos/3D interativos
✨ **Typography dinâmica** que responde ao scroll
✨ **Color transitions** fluidas entre seções
✨ **Glassmorphism** e efeitos de blur
✨ **Particle effects** sutis no background

---

## 🎨 ANIMAÇÕES PRIORITÁRIAS A IMPLEMENTAR

### 1. **Background Interativo que Segue o Mouse** ⭐⭐⭐

**O que é:**
Gradiente ou luz no background que se move suavemente seguindo a posição do cursor, criando profundidade e interatividade.

**Tecnologias:**

- Three.js para renderização WebGL
- GSAP para interpolação suave
- React hooks para tracking do mouse

**Implementação:**

#### **Opção A - Gradiente CSS Animado (Simples, performático):**

```jsx
// components/InteractiveBackground.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const InteractiveBackground = () => {
  const bgRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      };
    };

    // Smooth interpolation
    const animate = () => {
      targetPos.current.x += (mousePos.current.x - targetPos.current.x) * 0.05;
      targetPos.current.y += (mousePos.current.y - targetPos.current.y) * 0.05;

      if (bgRef.current) {
        bgRef.current.style.background = `
          radial-gradient(
            circle at ${targetPos.current.x}% ${targetPos.current.y}%,
            rgba(139, 92, 246, 0.15) 0%,
            rgba(59, 130, 246, 0.1) 25%,
            rgba(17, 24, 39, 1) 60%
          )
        `;
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={bgRef}
      className="fixed inset-0 -z-10 transition-colors duration-1000"
      style={{
        background:
          "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, rgba(17, 24, 39, 1) 60%)",
      }}
    />
  );
};

export default InteractiveBackground;
```

#### **Opção B - Three.js com Shader (Premium, mais complexo):**

```jsx
// components/ThreeBackground.jsx
import { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeBackground = () => {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Shader material para gradiente interativo
    const geometry = new THREE.PlaneGeometry(20, 20);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color("#8b5cf6") },
        uColor2: { value: new THREE.Color("#3b82f6") },
        uColor3: { value: new THREE.Color("#111827") },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec2 uMouse;
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        varying vec2 vUv;

        void main() {
          vec2 center = uMouse;
          float dist = distance(vUv, center);
          
          vec3 color = mix(uColor1, uColor2, dist * 0.5);
          color = mix(color, uColor3, smoothstep(0.3, 1.0, dist));
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse tracking
    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1 - e.clientY / window.innerHeight,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      material.uniforms.uMouse.value.x +=
        (mouseRef.current.x - material.uniforms.uMouse.value.x) * 0.05;
      material.uniforms.uMouse.value.y +=
        (mouseRef.current.y - material.uniforms.uMouse.value.y) * 0.05;
      material.uniforms.uTime.value = elapsedTime;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 -z-10" />;
};

export default ThreeBackground;
```

---

### 2. **Cursor Customizado que Muda por Contexto** ⭐⭐⭐

**O que é:**
Cursor personalizado que aumenta, muda de cor ou forma dependendo do elemento sobre o qual está (link, botão, imagem, etc.)

**Implementação:**

```jsx
// components/CustomCursor.jsx
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const [cursorState, setCursorState] = useState("default");

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    let mouseX = 0,
      mouseY = 0;
    let cursorX = 0,
      cursorY = 0;

    // Smooth cursor follow
    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;

      gsap.set(cursor, { x: cursorX - 20, y: cursorY - 20 });
      gsap.set(cursorDot, { x: mouseX - 4, y: mouseY - 4 });

      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Detectar elementos interativos
    const handleMouseEnter = (e) => {
      const target = e.target;

      if (target.tagName === "A" || target.tagName === "BUTTON") {
        setCursorState("link");
      } else if (target.classList.contains("product-card")) {
        setCursorState("view");
      } else if (target.tagName === "IMG") {
        setCursorState("zoom");
      }
    };

    const handleMouseLeave = () => {
      setCursorState("default");
    };

    // Event listeners
    document.addEventListener("mousemove", handleMouseMove);

    const interactiveElements = document.querySelectorAll(
      "a, button, img, .product-card",
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    animate();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Main cursor */}
      <div
        ref={cursorRef}
        className={`
          fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9999]
          rounded-full border-2 transition-all duration-300
          ${cursorState === "default" ? "border-gray-400 scale-100" : ""}
          ${cursorState === "link" ? "border-blue-500 scale-150" : ""}
          ${cursorState === "view" ? "border-purple-500 scale-150" : ""}
          ${cursorState === "zoom" ? "border-green-500 scale-200" : ""}
        `}
        style={{ mixBlendMode: "difference" }}
      />

      {/* Cursor dot */}
      <div
        ref={cursorDotRef}
        className={`
          fixed top-0 left-0 w-2 h-2 pointer-events-none z-[9999]
          rounded-full transition-all duration-200
          ${cursorState === "default" ? "bg-gray-900" : ""}
          ${cursorState === "link" ? "bg-blue-500 scale-150" : ""}
          ${cursorState === "view" ? "bg-purple-500 scale-150" : ""}
          ${cursorState === "zoom" ? "bg-green-500 scale-200" : ""}
        `}
      />

      {/* Texto no cursor (quando hover em produto) */}
      {cursorState === "view" && (
        <div
          ref={cursorRef}
          className="fixed top-0 left-0 pointer-events-none z-[9999] text-xs font-bold text-white bg-black px-2 py-1 rounded"
          style={{ transform: "translate(-50%, -150%)" }}
        >
          VER DETALHES
        </div>
      )}
    </>
  );
};

export default CustomCursor;
```

**CSS Global (para esconder cursor padrão):**

```css
/* globals.css */
* {
  cursor: none !important;
}

a,
button {
  cursor: none !important;
}
```

---

### 3. **Magnetic Elements (Botões que Atraem o Cursor)** ⭐⭐

**O que é:**
Elementos (botões, cards) que se movem sutilmente em direção ao cursor quando ele se aproxima.

**Implementação:**

```jsx
// components/MagneticButton.jsx
import { useRef, useEffect } from "react";
import { gsap } from "gsap";

const MagneticButton = ({ children, className, ...props }) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * 0.3; // 30% da distância
      const deltaY = (e.clientY - centerY) * 0.3;

      gsap.to(button, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <button ref={buttonRef} className={`relative ${className}`} {...props}>
      {children}
    </button>
  );
};

export default MagneticButton;

// USO:
<MagneticButton className="px-8 py-4 bg-black text-white rounded-xl font-bold">
  Comprar Agora
</MagneticButton>;
```

---

### 4. **Parallax 3D em Múltiplas Camadas** ⭐⭐

**O que é:**
Elementos se movem em velocidades diferentes baseadas na posição do scroll E do mouse, criando profundidade 3D.

**Implementação:**

```jsx
// components/ParallaxSection.jsx
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ParallaxSection = () => {
  const sectionRef = useRef(null);
  const layer1Ref = useRef(null);
  const layer2Ref = useRef(null);
  const layer3Ref = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    // Parallax no scroll
    gsap.to(layer1Ref.current, {
      y: -100,
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    gsap.to(layer2Ref.current, {
      y: -200,
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
      },
    });

    gsap.to(layer3Ref.current, {
      y: -300,
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 2,
      },
    });

    // Parallax com mouse
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;

      gsap.to(layer1Ref.current, {
        x: xPercent * 20,
        y: yPercent * 20,
        duration: 0.5,
      });

      gsap.to(layer2Ref.current, {
        x: xPercent * 40,
        y: yPercent * 40,
        duration: 0.7,
      });

      gsap.to(layer3Ref.current, {
        x: xPercent * 60,
        y: yPercent * 60,
        duration: 0.9,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Layer 1 - Mais longe */}
      <div ref={layer1Ref} className="absolute inset-0 opacity-20">
        <img
          src="/images/layer-back.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Layer 2 - Meio */}
      <div ref={layer2Ref} className="absolute inset-0 opacity-40">
        <img
          src="/images/layer-mid.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Layer 3 - Frente */}
      <div ref={layer3Ref} className="relative z-10">
        <h2 className="text-6xl font-bold text-white">Relógios Premium</h2>
      </div>
    </section>
  );
};

export default ParallaxSection;
```

---

### 5. **Text Splitting com Animação Letra por Letra** ⭐⭐

**O que é:**
Texto que aparece letra por letra, palavra por palavra, ou com efeitos de reveal sofisticados.

**Implementação:**

```jsx
// components/AnimatedText.jsx
import { useEffect, useRef } from "react";
import anime from "animejs";

const AnimatedText = ({ text, className, delay = 0 }) => {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    // Quebrar texto em spans (uma por letra)
    const chars = text
      .split("")
      .map((char, i) => {
        return `<span class="inline-block char" style="opacity: 0; transform: translateY(20px);">${char === " " ? "&nbsp;" : char}</span>`;
      })
      .join("");

    textRef.current.innerHTML = chars;

    // Animar com anime.js
    anime({
      targets: textRef.current.querySelectorAll(".char"),
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      delay: anime.stagger(50, { start: delay }),
      easing: "easeOutExpo",
    });
  }, [text, delay]);

  return <h1 ref={textRef} className={className} />;
};

export default AnimatedText;

// USO:
<AnimatedText
  text="Bem-vindo à Nossa Coleção"
  className="text-6xl font-bold"
  delay={500}
/>;
```

---

### 6. **Scroll Reveal em Cascata** ⭐⭐

**O que é:**
Elementos aparecem progressivamente conforme você scrolla, com efeito de cascata (um após o outro).

**Implementação:**

```jsx
// components/ScrollReveal.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({ children, stagger = 0.2 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const elements = containerRef.current.children;

    gsap.from(elements, {
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: stagger,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });
  }, [stagger]);

  return <div ref={containerRef}>{children}</div>;
};

export default ScrollReveal;

// USO:
<ScrollReveal stagger={0.15}>
  <ProductCard />
  <ProductCard />
  <ProductCard />
  <ProductCard />
</ScrollReveal>;
```

---

### 7. **Glassmorphism com Blur Dinâmico** ⭐

**O que é:**
Cards/elementos com efeito de vidro fosco (glassmorphism) que ficam mais ou menos transparentes.

**Implementação CSS:**

```css
/* Glassmorphism component */
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transform: translateY(-5px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
}
```

**Componente React:**

```jsx
const GlassCard = ({ children, className }) => {
  return (
    <div className={`glass-card rounded-2xl p-6 ${className}`}>{children}</div>
  );
};
```

---

### 8. **Hero Section com Efeito Cinematográfico** ⭐⭐⭐

**O que é:**
Hero gigante que ocupa a tela toda, com vídeo/animação de fundo, texto que aparece gradualmente e parallax.

**Implementação:**

```jsx
// components/HeroSection.jsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import AnimatedText from "./AnimatedText";

const HeroSection = () => {
  const videoRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    // Fade in do overlay
    gsap.from(overlayRef.current, {
      opacity: 0,
      duration: 2,
      delay: 0.5,
      ease: "power2.out",
    });

    // Parallax no scroll
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (videoRef.current) {
        videoRef.current.style.transform = `translateY(${scrollY * 0.5}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video/Imagem de fundo */}
      <div ref={videoRef} className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Conteúdo */}
      <div
        ref={overlayRef}
        className="relative z-10 text-center text-white px-4"
      >
        <AnimatedText
          text="Elegância Atemporal"
          className="text-7xl md:text-9xl font-serif font-bold mb-6"
          delay={800}
        />
        <p
          className="text-xl md:text-2xl mb-12 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "1.5s" }}
        >
          Descubra a coleção que define o seu estilo
        </p>
        <MagneticButton className="px-12 py-5 bg-white text-black rounded-full text-lg font-bold hover:bg-gray-100 transition-colors">
          Explorar Coleção
        </MagneticButton>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
```

**Animações CSS necessárias:**

```css
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 1s ease-out forwards;
}
```

---

## 📦 ESTRUTURA DE IMPLEMENTAÇÃO

### Ordem Prioritária:

**FASE 1 - Fundações (1 semana):**

1. ✅ Background interativo que segue mouse (Opção A - CSS)
2. ✅ Lenis smooth scroll (configurar globalmente)
3. ✅ Scroll Reveal básico em todas as seções

**FASE 2 - Interatividade (1 semana):** 4. ✅ Cursor customizado 5. ✅ Magnetic buttons nos CTAs 6. ✅ Text splitting animado nos títulos principais 7. ✅ Hero section cinematográfico

**FASE 3 - Premium (1-2 semanas):** 8. ✅ Background Three.js (se tempo permitir) 9. ✅ Parallax 3D multi-layer 10. ✅ Glassmorphism em cards/modais 11. ✅ Polish geral (timings, easings, performance)

---

## 🎯 LOCAIS DE APLICAÇÃO NO E-COMMERCE

### Homepage:

- ✅ Background interativo global
- ✅ Hero section com vídeo + AnimatedText
- ✅ Scroll reveal nos produtos em destaque
- ✅ Parallax na seção "Sobre a Marca"
- ✅ Magnetic buttons nos CTAs principais

### Página de Produto:

- ✅ Galeria de imagens com parallax mouse
- ✅ Cursor customizado ("ZOOM" ao hover nas fotos)
- ✅ Glassmorphism no card de variantes
- ✅ Magnetic button "Adicionar ao Carrinho"

### Catálogo/Shop:

- ✅ Scroll reveal em cascata nos cards de produtos
- ✅ Cursor "VER DETALHES" ao hover nos produtos
- ✅ Magnetic effect nos filtros

### Página de Conta (/conta):

- ✅ Sidebar com scroll reveal
- ✅ Cards de estatísticas com glassmorphism
- ✅ Magnetic buttons de ação

### Checkout:

- ✅ Progress bar animado (Theatre.js para sequência)
- ✅ Glassmorphism nos formulários
- ✅ Animações de validação suaves

---

## 🛠️ INSTALAÇÃO DE DEPENDÊNCIAS

```bash
# Animações
npm install gsap three @react-three/fiber @react-three/drei
npm install animejs
npm install @studio-freight/lenis
npm install theatre

# React utilities
npm install framer-motion
npm install react-intersection-observer

# Performance
npm install react-lazy-load-image-component
```

---

## ⚙️ CONFIGURAÇÃO GLOBAL

### 1. **Lenis Smooth Scroll (App.jsx ou Layout.jsx):**

```jsx
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <InteractiveBackground />
      <CustomCursor />
      {/* resto do app */}
    </>
  );
}
```

### 2. **Configurar prefers-reduced-motion (acessibilidade):**

```javascript
// utils/animations.js
export const shouldReduceMotion = () => {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Usar em animações:
if (!shouldReduceMotion()) {
  // executar animação
} else {
  // versão sem animação
}
```

---

## 🎨 PALETA DE CORES PREMIUM

```css
/* Design System - Cores Glamurosas */
:root {
  /* Cores principais */
  --color-primary: #111827; /* Gray-900 - preto elegante */
  --color-secondary: #8b5cf6; /* Purple-500 - roxo luxuoso */
  --color-accent: #3b82f6; /* Blue-500 - azul vibrante */

  /* Background gradientes */
  --gradient-luxury: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-gold: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
  --gradient-dark: linear-gradient(135deg, #1f1c2c 0%, #928dab 100%);

  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);

  /* Shadows premium */
  --shadow-soft: 0 10px 40px rgba(0, 0, 0, 0.1);
  --shadow-medium: 0 20px 60px rgba(0, 0, 0, 0.15);
  --shadow-hard: 0 30px 80px rgba(0, 0, 0, 0.2);
}
```

---

## 🚀 CHECKLIST DE IMPLEMENTAÇÃO

### Background & Ambiente:

- [ ] Background interativo seguindo mouse (CSS ou Three.js)
- [ ] Lenis smooth scroll configurado globalmente
- [ ] Cursor customizado com estados contextuais
- [ ] Esconder cursor padrão no CSS

### Hero & Seções Principais:

- [ ] Hero cinematográfico com vídeo/imagem
- [ ] AnimatedText nos títulos principais
- [ ] Scroll indicator animado
- [ ] Parallax multi-layer em seção destaque

### Interatividade:

- [ ] Magnetic buttons em todos os CTAs
- [ ] Hover states elaborados
- [ ] Glassmorphism em cards e modais
- [ ] Ripple effect nos botões (opcional)

### Scroll Animations:

- [ ] Scroll reveal em todas as seções
- [ ] Stagger effect nos grids de produtos
- [ ] Fade-in progressivo de conteúdo
- [ ] Parallax em imagens (velocidades diferentes)

### Performance:

- [ ] Lazy load de imagens pesadas
- [ ] Debounce em eventos de mouse
- [ ] requestAnimationFrame para animações
- [ ] will-change CSS nos elementos animados
- [ ] Respeitar prefers-reduced-motion

### Polish:

- [ ] Easings suaves (easeOutExpo, easeOutQuad)
- [ ] Timings consistentes (0.3s, 0.5s, 0.8s, 1.2s)
- [ ] Transições entre páginas (Swup.js já configurado)
- [ ] Loading states animados
- [ ] Feedback visual em todas as interações

---

## 💰 IMPACTO NO ORÇAMENTO

Essas animações premium adicionam significativo valor ao projeto:

**Tempo estimado:** +30-40 horas
**Complexidade:** Muito Alta
**Valor agregado:** Transforma o site em experiência AAA

**Sugestão de precificação adicional:**

- Background interativo + Cursor customizado: +R$ 2.000
- Parallax 3D + Hero cinematográfico: +R$ 2.500
- Magnetic elements + Text animations: +R$ 1.500
- Polish geral + otimizações: +R$ 1.000

**Total adicional:** R$ 7.000 - R$ 9.000

**Valor total do projeto (com tudo):** R$ 17.000 - R$ 22.000

---

## 🎬 REFERÊNCIAS VISUAIS

Além do Shopify Editions Winter '26, inspire-se também em:

- Apple Product Pages (iPhone, AirPods)
- Awwwards winners (https://awwwards.com)
- Stripe Press (https://press.stripe.com)
- Linear App (https://linear.app)
- Vercel (https://vercel.com)

---

## 📝 NOTAS FINAIS

**IMPORTANTE:**

- Essas animações transformam o site de "bom" para "WOW"
- Exigem atenção especial à performance (60fps obrigatório)
- Testar em múltiplos dispositivos é CRÍTICO
- Mobile pode ter versões simplificadas das animações
- Sempre ter fallback para navegadores antigos

**PRIORIZE:**

1. Performance (nada adianta ser bonito se travar)
2. Acessibilidade (respeitar prefers-reduced-motion)
3. Mobile (70% dos acessos são mobile)
4. Wow-factor (escolha 3-4 animações para focar, não todas)

---

Vamos criar um e-commerce que IMPRESSIONA! 🚀✨🎨
