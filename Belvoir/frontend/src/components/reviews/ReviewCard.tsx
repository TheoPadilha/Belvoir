import { useState } from 'react';
import { ThumbsUp, CheckCircle } from 'lucide-react';
import { StarRating } from './StarRating';
import { formatReviewDate } from '../../data/reviews';
import type { Review } from '../../types';

interface ReviewCardProps {
  review: Review;
  compact?: boolean;
}

export const ReviewCard = ({ review, compact = false }: ReviewCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpful);
  const [hasVoted, setHasVoted] = useState(false);

  const shouldTruncate = review.comment.length > 200 && !compact;
  const displayComment = shouldTruncate && !isExpanded
    ? review.comment.slice(0, 200) + '...'
    : review.comment;

  const handleHelpful = () => {
    if (!hasVoted) {
      setHelpfulCount(prev => prev + 1);
      setHasVoted(true);
    }
  };

  if (compact) {
    return (
      <div className="bg-white rounded-lg p-4 border border-secondary-100">
        <div className="flex items-start gap-3">
          <StarRating rating={review.rating} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-charcoal text-sm">{review.customerName}</span>
              {review.verified && (
                <CheckCircle className="w-3.5 h-3.5 text-primary-500 fill-primary-100" />
              )}
            </div>
            <p className="text-sm text-secondary-600 line-clamp-2">{review.comment}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-secondary-100 hover:border-secondary-200 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {review.customerAvatar ? (
            <img
              src={review.customerAvatar}
              alt={review.customerName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-charcoal flex items-center justify-center text-white font-medium">
              {review.customerName.charAt(0)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-charcoal">{review.customerName}</span>
              {review.verified && (
                <span className="flex items-center gap-1 text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  Verificado
                </span>
              )}
            </div>
            <p className="text-xs text-secondary-500">{formatReviewDate(review.createdAt)}</p>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>

      {/* Title */}
      {review.title && (
        <h4 className="font-semibold text-charcoal mb-2">{review.title}</h4>
      )}

      {/* Comment */}
      <p className="text-secondary-600 leading-relaxed">
        {displayComment}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2"
        >
          {isExpanded ? 'Mostrar menos' : 'Mostrar mais'}
        </button>
      )}

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mt-4">
          {review.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Foto ${index + 1} de ${review.customerName}`}
              className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-secondary-100">
        <button
          onClick={handleHelpful}
          disabled={hasVoted}
          className={`flex items-center gap-2 text-sm transition-colors ${
            hasVoted
              ? 'text-primary-600 cursor-default'
              : 'text-secondary-500 hover:text-primary-600'
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${hasVoted ? 'fill-primary-100' : ''}`} />
          <span>Útil ({helpfulCount})</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
