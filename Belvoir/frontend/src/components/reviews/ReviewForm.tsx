import { useState } from 'react';
import { Upload, Star } from 'lucide-react';
import { Modal } from '../ui';

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  onSubmit?: (review: {
    rating: number;
    title: string;
    comment: string;
    images?: string[];
  }) => void;
}

export const ReviewForm = ({ isOpen, onClose, productName, onSubmit }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (onSubmit) {
      onSubmit({ rating, title, comment });
    }

    setIsSubmitting(false);
    onClose();

    // Reset form
    setRating(0);
    setTitle('');
    setComment('');
  };

  const displayRating = hoverRating || rating;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Escrever Avaliação">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Info */}
        <div className="text-center pb-4 border-b border-secondary-100">
          <p className="text-secondary-500 text-sm">Você está avaliando</p>
          <p className="font-display font-semibold text-charcoal mt-1">{productName}</p>
        </div>

        {/* Star Rating */}
        <div className="text-center">
          <p className="text-secondary-600 mb-3">Qual sua avaliação?</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-10 h-10 ${
                    star <= displayRating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-secondary-200 text-secondary-200'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-secondary-500 mt-2">
              {rating === 5 && 'Excelente!'}
              {rating === 4 && 'Muito bom!'}
              {rating === 3 && 'Bom'}
              {rating === 2 && 'Regular'}
              {rating === 1 && 'Ruim'}
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="review-title" className="block text-sm font-medium text-charcoal mb-2">
            Título da avaliação
          </label>
          <input
            id="review-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Resuma sua experiência"
            className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-400 transition-colors"
          />
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="review-comment" className="block text-sm font-medium text-charcoal mb-2">
            Sua avaliação
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Conte sobre sua experiência com o produto..."
            rows={4}
            className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:border-primary-400 transition-colors resize-none"
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Adicionar fotos (opcional)
          </label>
          <div className="border-2 border-dashed border-secondary-200 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 mx-auto text-secondary-400 mb-2" />
            <p className="text-sm text-secondary-500">
              Clique para adicionar fotos ou arraste aqui
            </p>
            <p className="text-xs text-secondary-400 mt-1">
              PNG, JPG até 5MB
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={rating === 0 || isSubmitting}
            className="flex-1 px-6 py-3 bg-charcoal text-white rounded-lg font-medium hover:bg-secondary-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-secondary-200 rounded-lg font-medium text-secondary-600 hover:bg-secondary-50 transition-all duration-300"
          >
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReviewForm;
