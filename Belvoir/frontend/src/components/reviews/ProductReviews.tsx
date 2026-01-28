import { useState } from 'react';
import { ReviewSummary } from './ReviewSummary';
import { ReviewPhotoGallery } from './ReviewPhotoGallery';
import { ReviewCard } from './ReviewCard';
import { ReviewForm } from './ReviewForm';
import { getReviewsByProductId, getReviewSummaryByProductId } from '../../data/reviews';

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

export const ProductReviews = ({ productId, productName }: ProductReviewsProps) => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  const reviews = getReviewsByProductId(productId);
  const summary = getReviewSummaryByProductId(productId);

  const handleSubmitReview = (review: {
    rating: number;
    title: string;
    comment: string;
  }) => {
    // In a real app, this would send the review to the API
    console.log('New review:', review);
    // For now, just close the modal
    setIsReviewFormOpen(false);
  };

  const loadMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  if (summary.totalReviews === 0) {
    return (
      <section className="py-12">
        <div className="text-center">
          <h2 className="text-2xl font-display font-semibold text-charcoal mb-4">
            Avaliações
          </h2>
          <p className="text-secondary-500 mb-6">
            Este produto ainda não possui avaliações. Seja o primeiro a avaliar!
          </p>
          <button
            onClick={() => setIsReviewFormOpen(true)}
            className="px-6 py-3 bg-charcoal text-white rounded-lg font-medium hover:bg-secondary-800 transition-all duration-300"
          >
            Escrever avaliação
          </button>
        </div>

        <ReviewForm
          isOpen={isReviewFormOpen}
          onClose={() => setIsReviewFormOpen(false)}
          productName={productName}
          onSubmit={handleSubmitReview}
        />
      </section>
    );
  }

  return (
    <section className="py-12">
      {/* Section Title */}
      <h2 className="text-2xl font-display font-semibold text-charcoal mb-8">
        Avaliações dos Clientes
      </h2>

      {/* Summary */}
      <div className="mb-10">
        <ReviewSummary
          summary={summary}
          onWriteReview={() => setIsReviewFormOpen(true)}
        />
      </div>

      {/* Photo Gallery */}
      {reviews.some(r => r.images && r.images.length > 0) && (
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-charcoal mb-4">
            Fotos dos Clientes
          </h3>
          <ReviewPhotoGallery reviews={reviews} />
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.slice(0, visibleCount).map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Load More */}
      {visibleCount < reviews.length && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            className="px-8 py-3 border border-secondary-300 rounded-lg font-medium text-charcoal hover:bg-secondary-50 transition-all duration-300"
          >
            Carregar mais avaliações ({reviews.length - visibleCount} restantes)
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
