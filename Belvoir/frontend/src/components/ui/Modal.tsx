import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[90vw]',
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}: ModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Fechar com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Fechar ao clicar no overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
            className={`
              w-full ${sizes[size]} bg-white rounded-lg shadow-2xl overflow-hidden
            `}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-100">
                <h2 className="text-xl font-display font-semibold text-charcoal">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 text-secondary-400 hover:text-charcoal transition-colors rounded-full hover:bg-secondary-100"
                >
                  <X size={20} />
                </button>
              </div>
            )}
            <div className={!title ? 'relative' : ''}>
              {!title && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 text-secondary-400 hover:text-charcoal transition-colors rounded-full hover:bg-secondary-100"
                >
                  <X size={20} />
                </button>
              )}
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
