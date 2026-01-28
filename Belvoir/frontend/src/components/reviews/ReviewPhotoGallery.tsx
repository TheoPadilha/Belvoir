import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { StarRating } from './StarRating';
import type { Review } from '../../types';

interface ReviewPhotoGalleryProps {
  reviews: Review[];
}

export const ReviewPhotoGallery = ({ reviews }: ReviewPhotoGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<{
    image: string;
    review: Review;
    index: number;
  } | null>(null);

  // Get all reviews with images
  const reviewsWithImages = reviews.filter(r => r.images && r.images.length > 0);

  // Flatten all images with their associated review
  const allImages = reviewsWithImages.flatMap(review =>
    (review.images || []).map(image => ({ image, review }))
  );

  if (allImages.length === 0) return null;

  const handlePrev = () => {
    if (selectedImage) {
      const currentIndex = allImages.findIndex(
        item => item.image === selectedImage.image && item.review.id === selectedImage.review.id
      );
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : allImages.length - 1;
      setSelectedImage({
        ...allImages[prevIndex],
        index: prevIndex,
      });
    }
  };

  const handleNext = () => {
    if (selectedImage) {
      const currentIndex = allImages.findIndex(
        item => item.image === selectedImage.image && item.review.id === selectedImage.review.id
      );
      const nextIndex = currentIndex < allImages.length - 1 ? currentIndex + 1 : 0;
      setSelectedImage({
        ...allImages[nextIndex],
        index: nextIndex,
      });
    }
  };

  return (
    <>
      {/* Photo Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {allImages.slice(0, 6).map((item, index) => (
          <button
            key={`${item.review.id}-${index}`}
            onClick={() => setSelectedImage({ ...item, index })}
            className="relative aspect-square rounded-lg overflow-hidden group"
          >
            <img
              src={item.image}
              alt={`Foto de ${item.review.customerName}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

            {/* Hover overlay with review info */}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <StarRating rating={item.review.rating} size="sm" />
              <p className="text-white text-xs mt-1 truncate">{item.review.customerName}</p>
            </div>
          </button>
        ))}

        {/* Show more button if there are more images */}
        {allImages.length > 6 && (
          <button
            onClick={() => setSelectedImage({ ...allImages[6], index: 6 })}
            className="aspect-square rounded-lg bg-secondary-100 flex items-center justify-center text-secondary-600 hover:bg-secondary-200 transition-colors"
          >
            <span className="text-lg font-medium">+{allImages.length - 6}</span>
          </button>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation */}
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-4 text-white/80 hover:text-white p-2"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-4 text-white/80 hover:text-white p-2"
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          {/* Content */}
          <div
            className="flex flex-col md:flex-row max-w-5xl mx-4 gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="flex-1">
              <img
                src={selectedImage.image}
                alt={`Foto de ${selectedImage.review.customerName}`}
                className="max-h-[70vh] w-auto mx-auto rounded-lg"
              />
            </div>

            {/* Review Info */}
            <div className="w-full md:w-80 bg-white rounded-lg p-6">
              <StarRating rating={selectedImage.review.rating} size="md" />
              <div className="flex items-center gap-2 mt-3">
                <span className="font-semibold text-charcoal">
                  {selectedImage.review.customerName}
                </span>
                {selectedImage.review.verified && (
                  <span className="w-2 h-2 rounded-full bg-primary-500" />
                )}
              </div>
              <p className="text-secondary-600 mt-3 leading-relaxed">
                {selectedImage.review.comment}
              </p>
              {selectedImage.review.comment.length > 150 && (
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2">
                  Mostrar mais
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewPhotoGallery;
