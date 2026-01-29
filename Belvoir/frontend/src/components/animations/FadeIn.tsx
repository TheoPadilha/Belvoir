import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FadeInProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

export const FadeIn = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  distance = 40,
  className = '',
  once = true,
  threshold = 0.2,
}: FadeInProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(element, { opacity: 1, x: 0, y: 0 });
      return;
    }

    const directionMap = {
      up: { y: distance, x: 0 },
      down: { y: -distance, x: 0 },
      left: { x: distance, y: 0 },
      right: { x: -distance, y: 0 },
      none: { x: 0, y: 0 },
    };

    const { x, y } = directionMap[direction];

    gsap.set(element, { opacity: 0, x, y });

    const animation = gsap.to(element, {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: `top ${100 - threshold * 100}%`,
        toggleActions: once ? 'play none none none' : 'play reverse play reverse',
      },
    });

    // Fallback: ensure visibility after reasonable delay
    const fallbackTimeout = setTimeout(() => {
      if (element && window.getComputedStyle(element).opacity === '0') {
        gsap.set(element, { opacity: 1, x: 0, y: 0 });
      }
    }, (delay + duration + 2) * 1000);

    return () => {
      clearTimeout(fallbackTimeout);
      animation.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [direction, delay, duration, distance, once, threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

// Staggered fade in for lists
interface StaggerFadeInProps {
  children: React.ReactNode[];
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  stagger?: number;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  itemClassName?: string;
}

export const StaggerFadeIn = ({
  children,
  direction = 'up',
  stagger = 0.1,
  delay = 0,
  duration = 0.6,
  distance = 30,
  className = '',
  itemClassName = '',
}: StaggerFadeInProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.children;
    const itemsArray = Array.from(items);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(items, { opacity: 1, x: 0, y: 0 });
      return;
    }

    const directionMap = {
      up: { y: distance, x: 0 },
      down: { y: -distance, x: 0 },
      left: { x: distance, y: 0 },
      right: { x: -distance, y: 0 },
      none: { x: 0, y: 0 },
    };

    const { x, y } = directionMap[direction];

    gsap.set(items, { opacity: 0, x, y });

    const animation = gsap.to(items, {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      delay,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    // Fallback: ensure visibility after reasonable delay
    const totalDuration = delay + duration + (itemsArray.length * stagger) + 2;
    const fallbackTimeout = setTimeout(() => {
      itemsArray.forEach((item) => {
        if (window.getComputedStyle(item).opacity === '0') {
          gsap.set(item, { opacity: 1, x: 0, y: 0 });
        }
      });
    }, totalDuration * 1000);

    return () => {
      clearTimeout(fallbackTimeout);
      animation.kill();
    };
  }, [direction, stagger, delay, duration, distance]);

  return (
    <div ref={containerRef} className={className}>
      {children.map((child, index) => (
        <div key={index} className={itemClassName}>
          {child}
        </div>
      ))}
    </div>
  );
};
