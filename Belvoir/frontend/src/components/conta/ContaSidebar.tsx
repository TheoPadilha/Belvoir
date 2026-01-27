import { useRef, useEffect } from 'react';
import { User, Package, MapPin, Settings, LogOut } from 'lucide-react';
import { animate, stagger } from 'animejs';

type TabType = 'overview' | 'orders' | 'addresses' | 'settings';

interface ContaSidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onLogout: () => void;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  ordersCount: number;
}

const tabs = [
  { id: 'overview' as TabType, label: 'Visão Geral', icon: User },
  { id: 'orders' as TabType, label: 'Meus Pedidos', icon: Package },
  { id: 'addresses' as TabType, label: 'Endereços', icon: MapPin },
  { id: 'settings' as TabType, label: 'Configurações', icon: Settings },
];

export const ContaSidebar = ({
  activeTab,
  onTabChange,
  onLogout,
  customer,
  ordersCount,
}: ContaSidebarProps) => {
  const sidebarRef = useRef<HTMLElement>(null);
  const menuItemsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // Pequeno delay para garantir que o DOM está pronto
    const timer = setTimeout(() => {
      if (sidebarRef.current) {
        animate(sidebarRef.current, {
          translateX: [-30, 0],
          opacity: [0, 1],
          duration: 600,
          easing: 'easeOutExpo',
        });
      }

      if (menuItemsRef.current && menuItemsRef.current.children.length > 0) {
        animate(menuItemsRef.current.children, {
          translateX: [-20, 0],
          opacity: [0, 1],
          duration: 500,
          easing: 'easeOutExpo',
          delay: stagger(80, { start: 100 }),
        });
      }
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const getInitials = () => {
    return `${customer.firstName.charAt(0)}${customer.lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <aside className="lg:col-span-3">
      <nav
        ref={sidebarRef}
        className="bg-white rounded-lg shadow-sm p-6 sticky top-24 border border-secondary-100"
        style={{ opacity: 0 }}
      >
        {/* Avatar/Perfil */}
        <div className="mb-6 text-center pb-6 border-b border-secondary-100">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-charcoal flex items-center justify-center text-white text-xl font-display font-semibold">
            {getInitials()}
          </div>
          <h3 className="font-display font-semibold text-charcoal">
            {customer.firstName} {customer.lastName}
          </h3>
          <p className="text-sm text-secondary-500 truncate">{customer.email}</p>
        </div>

        {/* Menu Items */}
        <ul ref={menuItemsRef} className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <li key={tab.id} style={{ opacity: 0 }}>
                <button
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
                    ${isActive
                      ? 'bg-charcoal text-white'
                      : 'text-secondary-600 hover:bg-secondary-50 hover:text-charcoal'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                  {tab.id === 'orders' && ordersCount > 0 && (
                    <span
                      className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-primary-100 text-primary-700'
                      }`}
                    >
                      {ordersCount}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Botão Sair */}
        <button
          onClick={onLogout}
          className="w-full mt-6 pt-6 border-t border-secondary-100 flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair</span>
        </button>
      </nav>
    </aside>
  );
};

export default ContaSidebar;
