import { useEffect, useRef, memo } from "react";

interface InteractiveBackgroundProps {
  variant?: "light" | "dark";
}

// Otimização: Memoização para evitar re-renderizações já que o componente é fixo e puramente visual
export const InteractiveBackground = memo(
  ({ variant = "light" }: InteractiveBackgroundProps) => {
    const bgRef = useRef<HTMLDivElement>(null);
    const mousePos = useRef({ x: 50, y: 50 });
    const targetPos = useRef({ x: 50, y: 50 });
    const animationRef = useRef<number | undefined>(undefined);
    const lastUpdate = useRef(0);

    useEffect(() => {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReducedMotion) return;

      const handleMouseMove = (e: MouseEvent) => {
        mousePos.current = {
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        };
      };

      // Smooth interpolation animation
      const animate = (time: number) => {
        targetPos.current.x +=
          (mousePos.current.x - targetPos.current.x) * 0.03;
        targetPos.current.y +=
          (mousePos.current.y - targetPos.current.y) * 0.03;

        if (bgRef.current && time - lastUpdate.current > 16) {
          // ~60fps throttle
          const { x, y } = targetPos.current;

          if (variant === "dark") {
            bgRef.current.style.background = `radial-gradient(ellipse 80% 60% at ${x}% ${y}%, rgba(184,115,51,0.08) 0%, rgba(139,92,36,0.04) 30%, transparent 70%)`;
          } else {
            bgRef.current.style.background = `radial-gradient(ellipse 70% 50% at ${x}% ${y}%, rgba(184,115,51,0.06) 0%, rgba(184,115,51,0.02) 40%, transparent 70%)`;
          }
          lastUpdate.current = time;
        }

        animationRef.current = requestAnimationFrame(animate);
      };

      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      animationRef.current = requestAnimationFrame(animate);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [variant]);

    return (
      <div
        ref={bgRef}
        className="fixed inset-0 pointer-events-none z-0 will-change-[background]"
        aria-hidden="true"
      />
    );
  },
);

InteractiveBackground.displayName = "InteractiveBackground";
export default InteractiveBackground;
