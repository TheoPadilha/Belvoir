import { CheckCircle, Package, Truck } from 'lucide-react';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface PedidoTimelineProps {
  status: OrderStatus;
}

const steps = [
  { id: 'confirmed', label: 'Confirmado', icon: CheckCircle },
  { id: 'shipped', label: 'Enviado', icon: Truck },
  { id: 'delivered', label: 'Entregue', icon: Package },
];

const getStepStatus = (stepId: string, orderStatus: OrderStatus): 'completed' | 'current' | 'pending' => {
  const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
  const currentIndex = statusOrder.indexOf(orderStatus);

  if (stepId === 'confirmed') {
    return currentIndex >= 1 ? 'completed' : currentIndex === 0 ? 'current' : 'pending';
  }
  if (stepId === 'shipped') {
    return currentIndex >= 2 ? 'completed' : currentIndex === 2 ? 'current' : 'pending';
  }
  if (stepId === 'delivered') {
    return currentIndex >= 3 ? 'completed' : 'pending';
  }
  return 'pending';
};

export const PedidoTimeline = ({ status }: PedidoTimelineProps) => {
  return (
    <div className="mt-6 pt-6 border-t border-secondary-100">
      <div className="flex items-center justify-between text-sm">
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(step.id, status);
          const Icon = step.icon;
          const isCompleted = stepStatus === 'completed';
          const isCurrent = stepStatus === 'current';

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div
                className={`flex items-center ${
                  isCompleted || isCurrent ? 'text-primary-600' : 'text-secondary-400'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span className="font-medium whitespace-nowrap">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    isCompleted ? 'bg-primary-300' : 'bg-secondary-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PedidoTimeline;
