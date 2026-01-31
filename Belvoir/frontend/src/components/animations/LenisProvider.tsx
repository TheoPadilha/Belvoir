import { useEffect, useRef, createContext, useContext } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface LenisContextType {
  lenis: Lenis | null;
}

const LenisContext = createContext<LenisContextType>({ lenis: null });

export const useLenis = () => useContext(LenisContext);

interface LenisProviderProps {
  children: React.ReactNode;
}

export const LenisProvider = ({ children }: LenisProviderProps) => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    // Verificar preferência de movimento reduzido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Se usuário prefere movimento reduzido, não inicializar Lenis
    if (prefersReducedMotion) {
      return;
    }

    // Inicializar Lenis com configurações otimizadas
    const lenis = new Lenis({
      duration: 1.0, // Reduzido para scroll mais responsivo
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8, // Reduzido para menor uso de CPU
      touchMultiplier: 1.5, // Ajustado para touch mais natural
    });

    lenisRef.current = lenis;

    // Integrar com GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Função do RAF para referência na limpeza
    rafRef.current = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafRef.current);
    gsap.ticker.lagSmoothing(0);

    // Cleanup
    return () => {
      if (rafRef.current) {
        gsap.ticker.remove(rafRef.current);
      }
      lenis.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current }}>
      <div className="relative min-h-screen">
        {children}
      </div>
    </LenisContext.Provider>
  );
};

// Hook para scroll para elemento
export const useScrollTo = () => {
  const { lenis } = useLenis();

  const scrollTo = (target: string | number | HTMLElement, options?: {
    offset?: number;
    duration?: number;
    immediate?: boolean;
  }) => {
    if (lenis) {
      lenis.scrollTo(target, {
        offset: options?.offset ?? 0,
        duration: options?.duration ?? 1.2,
        immediate: options?.immediate ?? false,
      });
    }
  };

  return scrollTo;
};
