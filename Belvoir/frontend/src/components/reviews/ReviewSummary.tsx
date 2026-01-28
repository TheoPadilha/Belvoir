import { Star } from 'lucide-react';
import { StarRating } from './StarRating';
import type { ReviewSummary as ReviewSummaryType } from '../../types';

interface ReviewSummaryProps {
  summary: ReviewSummaryType;
  onWriteReview?: () => void;
}

export const ReviewSummary = ({ summary, onWriteReview }: ReviewSummaryProps) => {
  const { averageRating, totalReviews, ratingDistribution } = summary;

  // Calculate percentages for bars
  const getPercentage = (count: number) => {
    if (totalReviews === 0) return 0;
    return (count / totalReviews) * 100;
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      {/* Left - Big Rating */}
      <div className="text-center md:text-left">
        <div className="text-6xl font-display font-bold text-charcoal">
          {averageRating > 0 ? averageRating.toFixed(1).replace('.', ',') : '-'}
        </div>
        <div className="mt-2">
          <StarRating rating={averageRating} size="lg" />
        </div>
        <p className="text-secondary-500 mt-2">
          {totalReviews} {totalReviews === 1 ? 'avaliação' : 'avaliações'}
        </p>
      </div>

      {/* Middle - Rating Distribution */}
      <div className="flex-1 w-full md:max-w-sm">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1 w-8">
              <span className="text-sm text-secondary-600">{rating}</span>
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="flex-1 h-2.5 bg-secondary-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                style={{ width: `${getPercentage(ratingDistribution[rating as keyof typeof ratingDistribution])}%` }}
              />
            </div>
            <span className="text-sm text-secondary-500 w-6 text-right">
              {ratingDistribution[rating as keyof typeof ratingDistribution]}
            </span>
          </div>
        ))}
      </div>

      {/* Right - Write Review Button */}
      <div className="w-full md:w-auto">
        <button
          onClick={onWriteReview}
          className="w-full md:w-auto px-6 py-3 bg-charcoal text-white rounded-lg font-medium hover:bg-secondary-800 transition-all duration-300"
        >
          Escrever avaliação
        </button>

        {/* Filter dropdown placeholder */}
        <div className="mt-3">
          <select className="w-full md:w-48 px-4 py-2.5 border border-secondary-200 rounded-lg text-secondary-600 bg-white focus:outline-none focus:border-primary-400">
            <option value="all">Todas</option>
            <option value="5">5 estrelas</option>
            <option value="4">4 estrelas</option>
            <option value="3">3 estrelas</option>
            <option value="2">2 estrelas</option>
            <option value="1">1 estrela</option>
            <option value="with-photos">Com fotos</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ReviewSummary;
