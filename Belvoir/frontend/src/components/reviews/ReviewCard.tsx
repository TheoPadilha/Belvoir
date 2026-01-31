import { CheckCircle } from 'lucide-react';
import { StarRating } from './StarRating';
import { formatReviewDate } from '../../data/reviews';
import type { Review } from '../../types';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <div className="border-b border-secondary-100 py-6 last:border-b-0">
      {/* Stars and Date */}
      <div className="flex items-center justify-between mb-3">
        <StarRating rating={review.rating} size="sm" />
        <span className="text-sm text-secondary-400">{formatReviewDate(review.createdAt)}</span>
      </div>

      {/* Name with verified badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="font-medium text-charcoal">{review.customerName}</span>
        {review.verified && (
          <CheckCircle className="w-4 h-4 text-green-500" />
        )}
      </div>

      {/* Comment */}
      <p className="text-secondary-600 leading-relaxed">
        {review.comment}
      </p>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {review.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Foto ${index + 1}`}
              className="w-20 h-20 object-cover rounded-lg"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
