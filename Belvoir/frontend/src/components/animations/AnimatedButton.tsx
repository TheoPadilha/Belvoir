import { useRef, forwardRef } from 'react';
import { animate } from 'animejs';
import { prefersReducedMotion } from '../../utils/animationConfig';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  animationType?: 'pulse' | 'bounce' | 'ripple';
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      animationType = 'pulse',
      className = '',
      onClick,
      ...props
    },
    ref
  ) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const rippleRef = useRef<HTMLSpanElement>(null);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (prefersReducedMotion() || isLoading) {
        onClick?.(e);
        return;
      }

      const button = buttonRef.current;
      if (!button) {
        onClick?.(e);
        return;
      }

      switch (animationType) {
        case 'pulse':
          animate(button, {
            scale: [1, 0.95, 1.02, 1],
            duration: 400,
            ease: 'inOutQuad',
          });
          break;

        case 'bounce':
          animate(button, {
            translateY: [0, -4, 0],
            duration: 300,
            ease: 'outQuad',
          });
          break;

        case 'ripple':
          if (rippleRef.current) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            rippleRef.current.style.left = `${x}px`;
            rippleRef.current.style.top = `${y}px`;

            animate(rippleRef.current, {
              scale: [0, 4],
              opacity: [0.5, 0],
              duration: 600,
              ease: 'outExpo',
            });
          }
          break;
      }

      onClick?.(e);
    };

    const baseStyles =
      'relative overflow-hidden inline-flex items-center justify-center font-body uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-charcoal text-white hover:bg-secondary-800 active:bg-secondary-900',
      secondary:
        'bg-transparent border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white',
      gold: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl',
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base',
    };

    return (
      <button
        ref={(node) => {
          buttonRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        onClick={handleClick}
        disabled={isLoading || props.disabled}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {animationType === 'ripple' && (
          <span
            ref={rippleRef}
            className="absolute w-4 h-4 bg-white/30 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{ transform: 'scale(0)' }}
          />
        )}

        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Carregando...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';
