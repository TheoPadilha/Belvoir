import { type ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'light' | 'dark' | 'gold';
  hover?: boolean;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
}

export const GlassCard = ({
  children,
  className = '',
  variant = 'light',
  hover = true,
  blur = 'md',
}: GlassCardProps) => {
  const blurValues = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  };

  const variantStyles = {
    light: `
      bg-white/70
      border-white/30
      shadow-[0_8px_32px_rgba(0,0,0,0.08)]
      ${hover ? 'hover:bg-white/80 hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)]' : ''}
    `,
    dark: `
      bg-charcoal/80
      border-white/10
      shadow-[0_8px_32px_rgba(0,0,0,0.3)]
      ${hover ? 'hover:bg-charcoal/90 hover:shadow-[0_12px_48px_rgba(0,0,0,0.4)]' : ''}
    `,
    gold: `
      bg-primary-500/10
      border-primary-400/30
      shadow-[0_8px_32px_rgba(184,115,51,0.1)]
      ${hover ? 'hover:bg-primary-500/15 hover:shadow-[0_12px_48px_rgba(184,115,51,0.15)]' : ''}
    `,
  };

  return (
    <div
      className={`
        ${blurValues[blur]}
        border
        rounded-2xl
        transition-all
        duration-300
        ${variantStyles[variant]}
        ${hover ? 'hover:-translate-y-1' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;
