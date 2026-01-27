import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import type { Toast as ToastType } from '../../types';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: 'bg-green-50 border-green-500 text-green-800',
  error: 'bg-red-50 border-red-500 text-red-800',
  info: 'bg-blue-50 border-blue-500 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
};

const iconColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
  warning: 'text-yellow-500',
};

const ToastItem = ({ toast }: { toast: ToastType }) => {
  const { removeToast } = useUIStore();
  const Icon = icons[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className={`
        flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-lg
        ${colors[toast.type]}
      `}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${iconColors[toast.type]}`} />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const ToastContainer = () => {
  const { toasts } = useUIStore();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};
