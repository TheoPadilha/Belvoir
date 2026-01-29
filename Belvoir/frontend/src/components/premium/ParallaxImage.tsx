import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number; // Parallax speed (0.1 = slow, 1 = fast)
  mouseParallax?: boolean;
  mouseStrength?: number;
}

export const ParallaxImage = ({
  src,
  alt,
  className = '',
  speed = 0.3,
  mouseParallax = false,
  mouseStrength = 20,
}: ParallaxImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!containerRef.current || !imageRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const image = imageRef.current;
    const container = containerRef.current;

    // Scale image to allow parallax movement
    gsap.set(image, { scale: 1 + speed });

    // Scroll parallax
    const ctx = gsap.context(() => {
      gsap.to(image, {
        y: `${speed * 100}%`,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, containerRef);

    // Mouse parallax
    if (mouseParallax) {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (!isVisible) return;

        const centerX = rect.left + rect.width / 2;
        const xPercent = (e.clientX - centerX) / window.innerWidth;

        gsap.to(image, {
          x: xPercent * mouseStrength,
          duration: 0.5,
          ease: 'power2.out',
        });
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        ctx.revert();
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }

    return () => ctx.revert();
  }, [speed, mouseParallax, mouseStrength]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover will-change-transform"
      />
    </div>
  );
};

// Parallax container for layered effects
interface ParallaxLayerProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export const ParallaxLayer = ({
  children,
  speed = 0.2,
  className = '',
}: ParallaxLayerProps) => {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!layerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(layerRef.current, {
        y: `${speed * 100}%`,
        ease: 'none',
        scrollTrigger: {
          trigger: layerRef.current?.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, layerRef);

    return () => ctx.revert();
  }, [speed]);

  return (
    <div ref={layerRef} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
};

export default ParallaxImage;
