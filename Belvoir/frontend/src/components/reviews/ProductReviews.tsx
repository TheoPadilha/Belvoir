import { useState } from 'react';
import { ReviewForm } from './ReviewForm';

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

export const ProductReviews = ({ productName }: ProductReviewsProps) => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  const handleSubmitReview = (review: {
    rating: number;
    title: string;
    comment: string;
  }) => {
    // In a real app, this would send the review to the API
    console.log('New review:', review);
    setIsReviewFormOpen(false);
  };

  // Sem sistema de reviews integrado, sempre mostra estado vazio
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
};

export default ProductReviews;
