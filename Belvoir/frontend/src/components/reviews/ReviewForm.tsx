import { useState, useRef } from 'react';
import { X, ImagePlus, Star } from 'lucide-react';
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
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert('Imagem muito grande. Máximo 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (onSubmit) {
      onSubmit({ rating, title, comment, images });
    }

    setIsSubmitting(false);
    handleClose();
  };

  const handleClose = () => {
    setRating(0);
    setHoverRating(0);
    setTitle('');
    setComment('');
    setImages([]);
    onClose();
  };

  const displayRating = hoverRating || rating;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="">
      <div className="space-y-6">
        {/* Header elegante */}
        <div className="text-center">
          <h3 className="text-xl font-display font-semibold text-charcoal mb-1">
            Sua opinião importa
          </h3>
          <p className="text-secondary-500 text-sm">{productName}</p>
        </div>

        {/* Star Rating - mais elegante */}
        <div className="text-center py-4">
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-all duration-200 hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 transition-colors duration-200 ${
                    star <= displayRating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-transparent text-secondary-300'
                  }`}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-primary-600 mt-2 font-medium">
              {rating === 5 && 'Excelente!'}
              {rating === 4 && 'Muito bom!'}
              {rating === 3 && 'Bom'}
              {rating === 2 && 'Regular'}
              {rating === 1 && 'Ruim'}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título (opcional)"
              className="w-full px-4 py-3 bg-secondary-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all placeholder:text-secondary-400"
            />
          </div>

          {/* Comentário */}
          <div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte sua experiência..."
              rows={3}
              className="w-full px-4 py-3 bg-secondary-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all resize-none placeholder:text-secondary-400"
            />
          </div>

          {/* Fotos selecionadas */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`Foto ${index + 1}`}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Botão de adicionar foto */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-secondary-600 hover:text-charcoal cursor-pointer transition-colors"
            >
              <ImagePlus className="w-5 h-5" />
              Adicionar fotos
            </label>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={rating === 0 || isSubmitting}
              className="flex-1 px-6 py-3 bg-charcoal text-white rounded-lg font-medium hover:bg-secondary-800 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Enviando...' : 'Publicar'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 text-secondary-500 hover:text-charcoal font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ReviewForm;
