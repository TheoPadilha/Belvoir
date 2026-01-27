import { motion } from 'framer-motion';
import { prefersReducedMotion } from '../../utils/animationConfig';

type TransitionType = 'fade' | 'slideUp' | 'slideLeft' | 'scale' | 'overlay';

interface PageTransitionProps {
  children: React.ReactNode;
  type?: TransitionType;
}

// Easing customizado (cubic-bezier)
const smoothEase = [0.22, 1, 0.36, 1] as const;

export const PageTransition = ({ children, type = 'slideUp' }: PageTransitionProps) => {
  // Se usuário prefere movimento reduzido, usar transição simples
  if (prefersReducedMotion()) {
    return <>{children}</>;
  }

  const getTransitionProps = () => {
    switch (type) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.3 },
        };
      case 'slideUp':
        return {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
          transition: { duration: 0.4, ease: smoothEase },
        };
      case 'slideLeft':
        return {
          initial: { opacity: 0, x: 50 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -50 },
          transition: { duration: 0.4, ease: smoothEase },
        };
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.98 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.02 },
          transition: { duration: 0.35 },
        };
      case 'overlay':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.5, ease: 'easeInOut' as const },
        };
      default:
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
          transition: { duration: 0.4, ease: 'easeOut' as const },
        };
    }
  };

  const props = getTransitionProps();

  return (
    <motion.div
      initial={props.initial}
      animate={props.animate}
      exit={props.exit}
      transition={props.transition}
    >
      {children}
    </motion.div>
  );
};
