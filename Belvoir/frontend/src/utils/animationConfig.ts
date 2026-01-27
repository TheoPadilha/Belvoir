// Configurações centralizadas de animações
export const animationConfig = {
  // Anime.js defaults
  anime: {
    duration: 800,
    easing: 'easeOutExpo',
    stagger: {
      cards: 100,
      list: 50,
      fast: 30,
    },
  },

  // Framer Motion defaults (transições de página)
  framer: {
    page: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
      transition: { duration: 0.4, ease: 'easeOut' },
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.5 },
    },
    slideUp: {
      initial: { opacity: 0, y: 40 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
    slideLeft: {
      initial: { opacity: 0, x: -40 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
    slideRight: {
      initial: { opacity: 0, x: 40 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.5 },
    },
  },

  // GSAP ScrollTrigger defaults
  gsap: {
    scrub: 0.5,
    start: 'top 80%',
    end: 'bottom 20%',
  },

  // Easings customizados
  easings: {
    smooth: [0.22, 1, 0.36, 1],
    bounce: [0.175, 0.885, 0.32, 1.275],
    sharp: [0.4, 0, 0.2, 1],
  },
};

// Helper para verificar preferência de movimento reduzido
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Desabilitar animações se usuário preferir
export const getAnimationProps = <T extends object>(props: T): T | Record<string, never> => {
  if (prefersReducedMotion()) {
    return {};
  }
  return props;
};
