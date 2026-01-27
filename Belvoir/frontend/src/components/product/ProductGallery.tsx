import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import type { ProductImage } from '../../types';
import { Modal } from '../ui/Modal';

interface ProductGalleryProps {
  images: ProductImage[];
  productTitle: string;
}

export const ProductGallery = ({ images, productTitle }: ProductGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const currentImage = images[selectedIndex];

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-secondary-50 overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage.id}
            src={currentImage.src}
            alt={currentImage.alt || productTitle}
            className="w-full h-full object-cover cursor-zoom-in"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsZoomed(true)}
          />
        </AnimatePresence>

        {/* Zoom Button */}
        <button
          onClick={() => setIsZoomed(true)}
          className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-sm text-charcoal rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          aria-label="Ampliar imagem"
        >
          <ZoomIn size={20} />
        </button>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm text-charcoal rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              aria-label="Imagem anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm text-charcoal rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              aria-label="Próxima imagem"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/80 backdrop-blur-sm text-sm text-charcoal rounded-full">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={`
                relative aspect-square overflow-hidden bg-secondary-50
                ${index === selectedIndex ? 'ring-2 ring-primary-500' : 'ring-1 ring-secondary-200 hover:ring-secondary-400'}
                transition-all
              `}
            >
              <img
                src={image.src}
                alt={image.alt || `${productTitle} - Imagem ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <Modal isOpen={isZoomed} onClose={() => setIsZoomed(false)} size="xl">
        <div className="relative">
          <img
            src={currentImage.src}
            alt={currentImage.alt || productTitle}
            className="w-full h-auto max-h-[80vh] object-contain"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white text-charcoal rounded-full shadow-lg hover:bg-secondary-50"
                aria-label="Imagem anterior"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white text-charcoal rounded-full shadow-lg hover:bg-secondary-50"
                aria-label="Próxima imagem"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails in modal */}
        {images.length > 1 && (
          <div className="flex gap-2 p-4 justify-center overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedIndex(index)}
                className={`
                  flex-shrink-0 w-16 h-16 overflow-hidden
                  ${index === selectedIndex ? 'ring-2 ring-primary-500' : 'ring-1 ring-secondary-200'}
                `}
              >
                <img
                  src={image.src}
                  alt={image.alt || `${productTitle} - ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};
