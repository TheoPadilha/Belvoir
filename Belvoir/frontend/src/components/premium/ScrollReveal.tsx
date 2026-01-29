import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
}

export const ScrollReveal = ({
  children,
  className = '',
  stagger = 0.15,
  delay = 0,
  direction = 'up',
  distance = 60,
  duration = 0.8,
  threshold = 0.2,
  once = true,
}: ScrollRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const elements = containerRef.current.children;
    if (elements.length === 0) return;

    // Set initial states
    const getInitialTransform = () => {
      switch (direction) {
        case 'up': return { y: distance, x: 0 };
        case 'down': return { y: -distance, x: 0 };
        case 'left': return { x: distance, y: 0 };
        case 'right': return { x: -distance, y: 0 };
        default: return { y: 0, x: 0 };
      }
    };

    const { x: initialX, y: initialY } = getInitialTransform();

    // Set initial state for all children
    gsap.set(elements, {
      opacity: 0,
      y: initialY,
      x: initialX,
    });

    // Create ScrollTrigger animation
    const ctx = gsap.context(() => {
      gsap.to(elements, {
        opacity: 1,
        y: 0,
        x: 0,
        duration: duration,
        stagger: stagger,
        delay: delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: `top ${(1 - threshold) * 100}%`,
          end: 'bottom 20%',
          toggleActions: once ? 'play none none none' : 'play none none reverse',
          onEnter: () => {
            hasAnimated.current = true;
          },
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [stagger, delay, direction, distance, duration, threshold, once]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

// Single element reveal (not for children)
export const RevealOnScroll = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 40,
  duration = 0.6,
  threshold = 0.2,
}: Omit<ScrollRevealProps, 'stagger' | 'once'>) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const getInitialTransform = () => {
      switch (direction) {
        case 'up': return { y: distance };
        case 'down': return { y: -distance };
        case 'left': return { x: distance };
        case 'right': return { x: -distance };
        default: return {};
      }
    };

    gsap.set(elementRef.current, {
      opacity: 0,
      ...getInitialTransform(),
    });

    const ctx = gsap.context(() => {
      gsap.to(elementRef.current, {
        opacity: 1,
        y: 0,
        x: 0,
        duration: duration,
        delay: delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: elementRef.current,
          start: `top ${(1 - threshold) * 100}%`,
          toggleActions: 'play none none none',
        },
      });
    }, elementRef);

    return () => ctx.revert();
  }, [delay, direction, distance, duration, threshold]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};

export default ScrollReveal;
