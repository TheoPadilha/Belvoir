import { useState, useMemo, useEffect } from 'react';
import { Star } from 'lucide-react';
import { ReviewForm } from './ReviewForm';
import { ReviewCard } from './ReviewCard';
import { StarRating } from './StarRating';
import { getTopReviews } from '../../data/reviews';
import type { Review } from '../../types';

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

// Helper para localStorage
const REVIEWS_STORAGE_KEY = 'belvoir_user_reviews';

const getUserReviews = (productId: string): Review[] => {
  try {
    const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (stored) {
      const allReviews: Review[] = JSON.parse(stored);
      return allReviews.filter(r => r.productId === productId);
    }
  } catch {
    // Ignore errors
  }
  return [];
};

const saveUserReview = (review: Review): void => {
  try {
    const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
    const allReviews: Review[] = stored ? JSON.parse(stored) : [];
    allReviews.unshift(review);
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(allReviews));
  } catch {
    // Ignore errors
  }
};

export const ProductReviews = ({ productId, productName }: ProductReviewsProps) => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(5);
  const [userReviews, setUserReviews] = useState<Review[]>([]);

  // Carregar reviews do usuário do localStorage
  useEffect(() => {
    setUserReviews(getUserReviews(productId));
  }, [productId]);

  // Combinar reviews do usuário com reviews existentes
  const allReviews = useMemo(() => {
    const existingReviews = getTopReviews(10);
    return [...userReviews, ...existingReviews];
  }, [userReviews]);

  // Calcular média
  const averageRating = useMemo(() => {
    if (allReviews.length === 0) return 0;
    const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / allReviews.length) * 10) / 10;
  }, [allReviews]);

  const handleSubmitReview = (review: {
    rating: number;
    title: string;
    comment: string;
    images?: string[];
  }) => {
    const newReview: Review = {
      id: `user_${Date.now()}`,
      productId,
      customerName: 'Você',
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      images: review.images,
      verified: false,
      helpful: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    saveUserReview(newReview);
    setUserReviews(prev => [newReview, ...prev]);
    setIsReviewFormOpen(false);
  };

  const handleLoadMore = () => {
    setVisibleReviews(prev => Math.min(prev + 5, allReviews.length));
  };

  return (
    <section className="py-12">
      {/* Header simples e elegante */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 pb-8 border-b border-secondary-100">
        <div>
          <h2 className="text-2xl font-display font-semibold text-charcoal mb-2">
            Avaliações
          </h2>
          <div className="flex items-center gap-3">
            <StarRating rating={averageRating} size="md" />
            <span className="text-secondary-500">
              {averageRating.toFixed(1)} ({allReviews.length} {allReviews.length === 1 ? 'avaliação' : 'avaliações'})
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsReviewFormOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-charcoal text-white rounded-lg font-medium hover:bg-secondary-800 transition-all duration-300"
        >
          <Star className="w-4 h-4" />
          Escrever avaliação
        </button>
      </div>

      {/* Reviews List - estilo simples */}
      {allReviews.length > 0 ? (
        <div>
          {allReviews.slice(0, visibleReviews).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-secondary-500">
          <p>Ainda não há avaliações para este produto.</p>
          <p className="text-sm mt-2">Seja o primeiro a avaliar!</p>
        </div>
      )}

      {/* Load More Button */}
      {visibleReviews < allReviews.length && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            className="text-charcoal hover:text-primary-600 font-medium underline underline-offset-4 transition-colors"
          >
            Ver mais avaliações
          </button>
        </div>
      )}

      {/* Review Form Modal */}
      <ReviewForm
        isOpen={isReviewFormOpen}
        onClose={() => setIsReviewFormOpen(false)}
        productName={productName}
        onSubmit={handleSubmitReview}
      />
    </section>
  );
};

export default ProductReviews;
