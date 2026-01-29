import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Hero3DProps {
  productImage?: string;
  title?: string;
  subtitle?: string;
}

export const Hero3D = ({
  productImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
  title = 'BELVOIR',
  subtitle = 'O Tempo é a Nossa Obra-Prima',
}: Hero3DProps) => {
  const mainRef = useRef<HTMLElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const main = mainRef.current;
    const outer = outerRef.current;
    const inner = innerRef.current;
    const textContainer = textRef.current;

    if (!main || !outer || !inner || !textContainer) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsAnimated(true);
      return;
    }

    // Setup 3D perspective
    gsap.set(main, { perspective: 800 });
    gsap.set(outer, { transformStyle: 'preserve-3d' });

    // QuickTo for optimized performance
    const outerRX = gsap.quickTo(outer, 'rotationX', {
      duration: 0.8,
      ease: 'power3.out',
    });
    const outerRY = gsap.quickTo(outer, 'rotationY', {
      duration: 0.8,
      ease: 'power3.out',
    });
    const innerX = gsap.quickTo(inner, 'x', {
      duration: 0.8,
      ease: 'power3.out',
    });
    const innerY = gsap.quickTo(inner, 'y', {
      duration: 0.8,
      ease: 'power3.out',
    });

    const handlePointerMove = (e: PointerEvent) => {
      const xPercent = e.clientX / window.innerWidth;
      const yPercent = e.clientY / window.innerHeight;

      // 3D rotation of outer container
      outerRX(gsap.utils.interpolate(12, -12, yPercent));
      outerRY(gsap.utils.interpolate(-12, 12, xPercent));

      // Parallax movement of inner element
      innerX(gsap.utils.interpolate(-25, 25, xPercent));
      innerY(gsap.utils.interpolate(-25, 25, yPercent));
    };

    const handlePointerLeave = () => {
      outerRX(0);
      outerRY(0);
      innerX(0);
      innerY(0);
    };

    main.addEventListener('pointermove', handlePointerMove);
    main.addEventListener('pointerleave', handlePointerLeave);

    // Trigger animation state after mount
    requestAnimationFrame(() => {
      setIsAnimated(true);
    });

    return () => {
      main.removeEventListener('pointermove', handlePointerMove);
      main.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  // Split title into characters
  const titleChars = title.split('').map((char, i) => (
    <span
      key={i}
      className="title-char inline-block"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));

  return (
    <section
      ref={mainRef}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-charcoal -mt-20 lg:-mt-24"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-secondary-900 to-charcoal" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(184, 115, 51, 0.15) 0%, transparent 60%)',
          }}
        />
        {/* Noise texture */}
        <div className="absolute inset-0 noise-overlay opacity-20" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary-400 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 12}s`,
              opacity: 0.3 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>

      {/* 3D Container */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 px-4">
        {/* Product Image 3D */}
        <div
          ref={outerRef}
          className={`relative transition-all duration-1000 ease-out ${
            isAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div ref={innerRef} className="relative">
            {/* Main product image */}
            <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]">
              <img
                src={productImage}
                alt="Relógio Premium Belvoir"
                className="w-full h-full object-contain drop-shadow-2xl"
                style={{
                  filter: 'drop-shadow(0 50px 100px rgba(184, 115, 51, 0.3))',
                }}
              />
              {/* Glow effect behind image */}
              <div
                className="absolute inset-0 -z-10 blur-3xl opacity-50"
                style={{
                  background: 'radial-gradient(circle, rgba(184, 115, 51, 0.4) 0%, transparent 70%)',
                  transform: 'translateZ(-50px) scale(1.2)',
                }}
              />
            </div>

            {/* Rotating ring decoration */}
            <div
              className="absolute inset-0 border-2 border-primary-500/20 rounded-full animate-spin-slow"
              style={{
                transform: 'translateZ(-30px) scale(1.3)',
                animationDuration: '20s',
              }}
            />
          </div>
        </div>

        {/* Text Content */}
        <div ref={textRef} className="text-center lg:text-left max-w-lg">
          {/* Brand name */}
          <h1
            className={`font-display text-6xl md:text-7xl lg:text-8xl text-white mb-4 tracking-wider transition-all duration-700 delay-300 ${
              isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              textShadow: '0 0 80px rgba(184, 115, 51, 0.3)',
              perspective: '1000px',
            }}
          >
            {titleChars}
          </h1>

          {/* Subtitle */}
          <p className={`hero-subtitle-text text-xl md:text-2xl text-white/70 mb-8 font-light tracking-wide transition-all duration-700 delay-500 ${
            isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}>
            {subtitle}
          </p>

          {/* CTAs */}
          <div className={`hero-cta-container flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-700 delay-700 ${
            isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <Link
              to="/shop"
              className="group relative px-8 py-4 bg-primary-500 text-white rounded-full font-medium overflow-hidden transition-all duration-500 hover:bg-primary-600 hover:scale-105"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Explorar Coleção
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>

            <Link
              to="/sobre"
              className="px-8 py-4 border border-white/30 text-white rounded-full font-medium backdrop-blur-sm hover:bg-white/10 hover:border-white/50 transition-all duration-300"
            >
              Nossa História
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
        <span className="text-white/50 text-xs uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
      </div>

      {/* Corner decorations */}
      <div className="absolute top-32 left-8 w-20 h-[1px] bg-gradient-to-r from-primary-500/50 to-transparent" />
      <div className="absolute top-32 left-8 w-[1px] h-20 bg-gradient-to-b from-primary-500/50 to-transparent" />
      <div className="absolute bottom-32 right-8 w-20 h-[1px] bg-gradient-to-l from-primary-500/50 to-transparent" />
      <div className="absolute bottom-32 right-8 w-[1px] h-20 bg-gradient-to-t from-primary-500/50 to-transparent" />
    </section>
  );
};

export default Hero3D;
