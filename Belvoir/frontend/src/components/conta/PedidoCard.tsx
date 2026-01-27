import { Eye, MoreHorizontal, RotateCcw, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { formatPrice } from '../../data/products';
import type { Order } from '../../types';
import { PedidoTimeline } from './PedidoTimeline';

interface PedidoCardProps {
  order: Order;
  compact?: boolean;
}

const orderStatusConfig = {
  pending: { label: 'Pendente', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: Clock },
  processing: { label: 'Processando', color: 'bg-primary-50 text-primary-700 border-primary-200', icon: Package },
  shipped: { label: 'Enviado', color: 'bg-accent-50 text-accent-700 border-accent-200', icon: Truck },
  delivered: { label: 'Entregue', color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle },
  cancelled: { label: 'Cancelado', color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
};

export const PedidoCard = ({ order, compact = false }: PedidoCardProps) => {
  const status = orderStatusConfig[order.status];
  const StatusIcon = status.icon;
  const isDelivered = order.status === 'delivered';

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (compact) {
    return (
      <div className="border border-secondary-200 rounded-lg p-4 hover:border-primary-400 transition-all duration-300 hover:shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-display font-semibold text-charcoal">{order.orderNumber}</h3>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center border ${status.color}`}
              >
                <StatusIcon className="w-3 h-3 mr-1" />
                {status.label}
              </span>
            </div>
            <p className="text-sm text-secondary-500">{formatDate(order.createdAt)}</p>
          </div>
          <p className="text-lg font-display font-semibold text-charcoal">{formatPrice(order.total)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-card border border-secondary-200 rounded-lg p-6 hover:border-primary-400 transition-all duration-300 hover:shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-display font-semibold text-charcoal">{order.orderNumber}</h3>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full flex items-center border ${status.color}`}
            >
              {isDelivered && (
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              )}
              <StatusIcon className="w-3 h-3 mr-1" />
              {status.label}
            </span>
          </div>
          <p className="text-sm text-secondary-500">{formatDate(order.createdAt)}</p>
        </div>

        <button className="text-secondary-400 hover:text-charcoal transition-colors p-2 rounded-lg hover:bg-secondary-50">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Items do pedido */}
      {order.items && order.items.length > 0 && (
        <div className="space-y-3 mb-4">
          {order.items.slice(0, 2).map((item) => (
            <div key={item.id} className="flex gap-3">
              <img
                src={item.image}
                alt={item.title}
                className="w-14 h-14 object-cover rounded-lg border border-secondary-100"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-charcoal truncate">{item.title}</p>
                <p className="text-xs text-secondary-500">{item.variantTitle}</p>
                <p className="text-xs text-secondary-500">Qtd: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium text-charcoal">{formatPrice(item.price)}</p>
            </div>
          ))}
          {order.items.length > 2 && (
            <p className="text-sm text-secondary-500">
              +{order.items.length - 2} {order.items.length - 2 === 1 ? 'item' : 'itens'}
            </p>
          )}
        </div>
      )}

      {/* Detalhes do pedido */}
      <div className="border-t border-secondary-100 pt-4 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-secondary-500 mb-1">Total do Pedido</p>
            <p className="text-2xl font-display font-semibold text-charcoal">{formatPrice(order.total)}</p>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 border border-secondary-300 rounded-lg text-sm font-medium text-charcoal hover:bg-secondary-50 transition-all duration-300 flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Ver Detalhes
            </button>
            {order.trackingUrl && (
              <a
                href={order.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-charcoal text-white rounded-lg text-sm font-medium hover:bg-secondary-800 transition-all duration-300 flex items-center"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Rastrear
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Timeline de entrega */}
      {!compact && order.status !== 'cancelled' && (
        <PedidoTimeline status={order.status} />
      )}
    </div>
  );
};

export default PedidoCard;
