import { useEffect, useRef } from 'react';

interface InteractiveBackgroundProps {
  variant?: 'light' | 'dark';
}

export const InteractiveBackground = ({ variant = 'light' }: InteractiveBackgroundProps) => {
  const bgRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 50, y: 50 });
  const targetPos = useRef({ x: 50, y: 50 });
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      };
    };

    // Smooth interpolation animation
    const animate = () => {
      targetPos.current.x += (mousePos.current.x - targetPos.current.x) * 0.03;
      targetPos.current.y += (mousePos.current.y - targetPos.current.y) * 0.03;

      if (bgRef.current) {
        if (variant === 'dark') {
          // Dark variant - for dark sections
          bgRef.current.style.background = `
            radial-gradient(
              ellipse 80% 60% at ${targetPos.current.x}% ${targetPos.current.y}%,
              rgba(184, 115, 51, 0.08) 0%,
              rgba(139, 92, 36, 0.04) 30%,
              rgba(28, 28, 28, 0) 70%
            )
          `;
        } else {
          // Light variant - for light sections (cream background)
          bgRef.current.style.background = `
            radial-gradient(
              ellipse 70% 50% at ${targetPos.current.x}% ${targetPos.current.y}%,
              rgba(184, 115, 51, 0.06) 0%,
              rgba(184, 115, 51, 0.02) 40%,
              transparent 70%
            )
          `;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [variant]);

  return (
    <div
      ref={bgRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
      aria-hidden="true"
    />
  );
};

export default InteractiveBackground;
