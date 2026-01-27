import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  icon,
  title,
  description,
  actionText,
  actionLink,
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-400">
        {icon}
      </div>
      <h3 className="text-lg font-display font-semibold text-charcoal mb-2">{title}</h3>
      <p className="text-secondary-500 mb-6">{description}</p>
      {actionText && (actionLink || onAction) && (
        actionLink ? (
          <Link
            to={actionLink}
            className="inline-block px-6 py-2.5 bg-charcoal text-white rounded-lg font-medium hover:bg-secondary-800 transition-all duration-300"
          >
            {actionText}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="inline-block px-6 py-2.5 bg-charcoal text-white rounded-lg font-medium hover:bg-secondary-800 transition-all duration-300"
          >
            {actionText}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;
