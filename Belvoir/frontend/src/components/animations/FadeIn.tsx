import { useEffect, useRef, useState } from 'react';

interface FadeInProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  className?: string;
}

// Versão otimizada usando CSS + IntersectionObserver (sem GSAP)
export const FadeIn = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.5,
  className = '',
}: FadeInProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Verificar preferência de movimento reduzido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const getTransformStyle = () => {
    if (isVisible) return 'translate(0, 0)';

    switch (direction) {
      case 'up': return 'translate(0, 30px)';
      case 'down': return 'translate(0, -30px)';
      case 'left': return 'translate(30px, 0)';
      case 'right': return 'translate(-30px, 0)';
      default: return 'translate(0, 0)';
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransformStyle(),
        transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

// Versão simplificada do StaggerFadeIn
interface StaggerFadeInProps {
  children: React.ReactNode[];
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  stagger?: number;
  className?: string;
  itemClassName?: string;
}

export const StaggerFadeIn = ({
  children,
  direction = 'up',
  stagger = 0.1,
  className = '',
  itemClassName = '',
}: StaggerFadeInProps) => {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <FadeIn key={index} direction={direction} delay={index * stagger}>
          <div className={itemClassName}>{child}</div>
        </FadeIn>
      ))}
    </div>
  );
};
