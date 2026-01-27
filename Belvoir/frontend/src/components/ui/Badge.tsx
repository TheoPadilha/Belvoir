interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'sale' | 'new' | 'soldout';
  className?: string;
}

const variants = {
  default: 'bg-secondary-100 text-charcoal',
  sale: 'bg-red-500 text-white',
  new: 'bg-primary-500 text-white',
  soldout: 'bg-secondary-400 text-white',
};

export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => (
  <span
    className={`
      inline-flex items-center px-2 py-1 text-xs font-medium uppercase tracking-wider
      ${variants[variant]}
      ${className}
    `}
  >
    {children}
  </span>
);
