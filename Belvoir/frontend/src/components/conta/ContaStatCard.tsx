import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

type CardVariant = 'primary' | 'secondary' | 'accent';

interface ContaStatCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  variant?: CardVariant;
  badge?: {
    text: string;
    type: 'new' | 'verified' | 'info';
  };
  linkText: string;
  onLinkClick?: () => void;
}

const variantStyles: Record<CardVariant, string> = {
  primary: 'bg-primary-500',
  secondary: 'bg-charcoal',
  accent: 'bg-accent-600',
};

const linkColors: Record<CardVariant, string> = {
  primary: 'text-primary-600 hover:text-primary-700',
  secondary: 'text-charcoal hover:text-secondary-700',
  accent: 'text-accent-600 hover:text-accent-700',
};

const badgeStyles = {
  new: 'text-primary-700 bg-primary-100',
  verified: 'text-green-700 bg-green-100',
  info: 'text-primary-600 bg-primary-50',
};

export const ContaStatCard = ({
  icon,
  value,
  label,
  variant = 'primary',
  badge,
  linkText,
  onLinkClick,
}: ContaStatCardProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-500 group cursor-pointer border border-secondary-100 hover:border-primary-300">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg ${variantStyles[variant]} flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300`}
        >
          {icon}
        </div>
        {badge && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full flex items-center ${badgeStyles[badge.type]}`}
          >
            {badge.type === 'verified' && (
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {badge.text}
          </span>
        )}
      </div>

      <h3 className="text-3xl font-display font-semibold text-charcoal mb-1">{value}</h3>
      <p className="text-secondary-500 font-medium">{label}</p>

      <div className="mt-4 pt-4 border-t border-secondary-100">
        <button
          onClick={onLinkClick}
          className={`text-sm ${linkColors[variant]} font-medium flex items-center group-hover:gap-2 transition-all duration-300`}
        >
          {linkText}
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default ContaStatCard;
