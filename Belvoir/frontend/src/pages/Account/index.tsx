import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Package,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Edit2,
  Trash2,
  Plus,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button, Input, Modal } from '../../components/ui';
import { PageTransition, FadeIn } from '../../components/animations';
import { toast } from '../../store/uiStore';
import { formatPrice } from '../../data/products';
import type { Address, Order } from '../../types';

type TabType = 'overview' | 'orders' | 'addresses' | 'settings';

const tabs = [
  { id: 'overview' as TabType, label: 'Visão Geral', icon: User },
  { id: 'orders' as TabType, label: 'Meus Pedidos', icon: Package },
  { id: 'addresses' as TabType, label: 'Endereços', icon: MapPin },
  { id: 'settings' as TabType, label: 'Configurações', icon: Settings },
];

const orderStatusConfig = {
  pending: { label: 'Pendente', color: 'text-yellow-600 bg-yellow-100', icon: Clock },
  processing: { label: 'Processando', color: 'text-blue-600 bg-blue-100', icon: Package },
  shipped: { label: 'Enviado', color: 'text-purple-600 bg-purple-100', icon: Truck },
  delivered: { label: 'Entregue', color: 'text-green-600 bg-green-100', icon: CheckCircle },
  cancelled: { label: 'Cancelado', color: 'text-red-600 bg-red-100', icon: XCircle },
};

export const AccountPage = () => {
  const navigate = useNavigate();
  const {
    customer,
    isAuthenticated,
    isLoading,
    orders,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    fetchOrders,
  } = useAuthStore();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(null);
  const [addressForm, setAddressForm] = useState<Address>({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Brasil',
    phone: '',
  });

  const [profileForm, setProfileForm] = useState({
    firstName: customer?.firstName || '',
    lastName: customer?.lastName || '',
    phone: customer?.phone || '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/conta' } });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);

  useEffect(() => {
    if (customer) {
      setProfileForm({
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone || '',
      });
    }
  }, [customer]);

  const handleLogout = () => {
    logout();
    toast.info('Você saiu da sua conta');
    navigate('/');
  };

  const handleSaveProfile = async () => {
    const success = await updateProfile(profileForm);
    if (success) {
      toast.success('Perfil atualizado com sucesso!');
    } else {
      toast.error('Erro ao atualizar perfil');
    }
  };

  const handleOpenAddressModal = (index?: number) => {
    if (index !== undefined && customer?.addresses[index]) {
      setAddressForm(customer.addresses[index]);
      setEditingAddressIndex(index);
    } else {
      setAddressForm({
        firstName: customer?.firstName || '',
        lastName: customer?.lastName || '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Brasil',
        phone: customer?.phone || '',
      });
      setEditingAddressIndex(null);
    }
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async () => {
    let success: boolean;

    if (editingAddressIndex !== null) {
      success = await updateAddress(editingAddressIndex, addressForm);
    } else {
      success = await addAddress(addressForm);
    }

    if (success) {
      toast.success(
        editingAddressIndex !== null ? 'Endereço atualizado!' : 'Endereço adicionado!'
      );
      setIsAddressModalOpen(false);
    } else {
      toast.error('Erro ao salvar endereço');
    }
  };

  const handleDeleteAddress = async (index: number) => {
    if (confirm('Tem certeza que deseja excluir este endereço?')) {
      const success = await deleteAddress(index);
      if (success) {
        toast.success('Endereço removido');
      } else {
        toast.error('Erro ao remover endereço');
      }
    }
  };

  const handleSetDefault = async (index: number) => {
    const success = await setDefaultAddress(index);
    if (success) {
      toast.success('Endereço padrão atualizado');
    }
  };

  if (!customer) {
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-secondary-50 py-8 md:py-12">
        <div className="container-custom">
          {/* Header */}
          <FadeIn>
            <div className="mb-8">
              <h1 className="font-display text-3xl md:text-4xl text-charcoal mb-2">
                Minha Conta
              </h1>
              <p className="text-secondary-500">
                Olá, {customer.firstName}! Gerencie suas informações e pedidos.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <FadeIn delay={0.1}>
              <aside className="lg:col-span-1">
                <div className="bg-white shadow-sm p-4 sticky top-24">
                  <nav className="space-y-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                          ${activeTab === tab.id
                            ? 'bg-charcoal text-white'
                            : 'text-secondary-600 hover:bg-secondary-100'
                          }
                        `}
                      >
                        <tab.icon size={20} />
                        <span className="font-medium">{tab.label}</span>
                        <ChevronRight
                          size={16}
                          className={`ml-auto transition-transform ${
                            activeTab === tab.id ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                    ))}
                  </nav>

                  <div className="mt-6 pt-6 border-t border-secondary-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut size={20} />
                      <span className="font-medium">Sair</span>
                    </button>
                  </div>
                </div>
              </aside>
            </FadeIn>

            {/* Content */}
            <FadeIn delay={0.2}>
              <main className="lg:col-span-3">
                <AnimatePresence mode="wait">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      {/* Quick Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-5 shadow-sm rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                              <Package size={24} className="text-primary-600" />
                            </div>
                            <div>
                              <p className="text-2xl font-display font-semibold">{orders.length}</p>
                              <p className="text-sm text-secondary-500">Pedidos</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white p-5 shadow-sm rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                              <MapPin size={24} className="text-green-600" />
                            </div>
                            <div>
                              <p className="text-2xl font-display font-semibold">
                                {customer.addresses.length}
                              </p>
                              <p className="text-sm text-secondary-500">Endereços</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white p-5 shadow-sm rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                              <User size={24} className="text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate max-w-[180px]" title={customer.email}>
                                {customer.email}
                              </p>
                              <p className="text-sm text-secondary-500">Email</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recent Orders */}
                      <div className="bg-white shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="font-display text-xl">Pedidos Recentes</h2>
                          <button
                            onClick={() => setActiveTab('orders')}
                            className="text-sm text-primary-600 hover:text-primary-700"
                          >
                            Ver todos
                          </button>
                        </div>

                        {orders.length > 0 ? (
                          <div className="space-y-4">
                            {orders.slice(0, 3).map((order) => (
                              <OrderCard key={order.id} order={order} compact />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-secondary-500">
                            <Package size={48} className="mx-auto mb-4 opacity-30" />
                            <p>Você ainda não tem pedidos</p>
                            <Link to="/shop" className="text-primary-600 hover:underline mt-2 block">
                              Explorar produtos
                            </Link>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Orders Tab */}
                  {activeTab === 'orders' && (
                    <motion.div
                      key="orders"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="bg-white shadow-sm p-6">
                        <h2 className="font-display text-xl mb-6">Meus Pedidos</h2>

                        {orders.length > 0 ? (
                          <div className="space-y-4">
                            {orders.map((order) => (
                              <OrderCard key={order.id} order={order} />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 text-secondary-500">
                            <Package size={64} className="mx-auto mb-4 opacity-30" />
                            <p className="text-lg mb-2">Nenhum pedido encontrado</p>
                            <p className="text-sm mb-4">
                              Quando você fizer uma compra, seus pedidos aparecerão aqui.
                            </p>
                            <Link to="/shop">
                              <Button variant="primary">Explorar Produtos</Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Addresses Tab */}
                  {activeTab === 'addresses' && (
                    <motion.div
                      key="addresses"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="bg-white shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="font-display text-xl">Meus Endereços</h2>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenAddressModal()}
                          >
                            <Plus size={16} className="mr-2" />
                            Adicionar
                          </Button>
                        </div>

                        {customer.addresses.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {customer.addresses.map((address, index) => (
                              <div
                                key={index}
                                className={`p-4 border rounded-lg ${
                                  customer.defaultAddress === address
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-secondary-200'
                                }`}
                              >
                                {customer.defaultAddress === address && (
                                  <span className="inline-block text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded mb-2">
                                    Padrão
                                  </span>
                                )}
                                <p className="font-medium">
                                  {address.firstName} {address.lastName}
                                </p>
                                <p className="text-sm text-secondary-600">
                                  {address.address1}
                                  {address.address2 && `, ${address.address2}`}
                                </p>
                                <p className="text-sm text-secondary-600">
                                  {address.city}, {address.state} - {address.zipCode}
                                </p>
                                <p className="text-sm text-secondary-600">{address.phone}</p>

                                <div className="flex gap-2 mt-4">
                                  <button
                                    onClick={() => handleOpenAddressModal(index)}
                                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                                  >
                                    <Edit2 size={14} />
                                    Editar
                                  </button>
                                  {customer.defaultAddress !== address && (
                                    <>
                                      <button
                                        onClick={() => handleSetDefault(index)}
                                        className="text-sm text-secondary-600 hover:text-secondary-700 flex items-center gap-1"
                                      >
                                        Definir como padrão
                                      </button>
                                      <button
                                        onClick={() => handleDeleteAddress(index)}
                                        className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                                      >
                                        <Trash2 size={14} />
                                        Remover
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 text-secondary-500">
                            <MapPin size={64} className="mx-auto mb-4 opacity-30" />
                            <p className="text-lg mb-2">Nenhum endereço cadastrado</p>
                            <p className="text-sm mb-4">
                              Adicione um endereço para facilitar suas compras.
                            </p>
                            <Button variant="secondary" onClick={() => handleOpenAddressModal()}>
                              <Plus size={16} className="mr-2" />
                              Adicionar Endereço
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Settings Tab */}
                  {activeTab === 'settings' && (
                    <motion.div
                      key="settings"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      {/* Profile Settings */}
                      <div className="bg-white shadow-sm p-6">
                        <h2 className="font-display text-xl mb-6">Dados Pessoais</h2>

                        <div className="space-y-4 max-w-md">
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="Nome"
                              value={profileForm.firstName}
                              onChange={(e) =>
                                setProfileForm({ ...profileForm, firstName: e.target.value })
                              }
                            />
                            <Input
                              label="Sobrenome"
                              value={profileForm.lastName}
                              onChange={(e) =>
                                setProfileForm({ ...profileForm, lastName: e.target.value })
                              }
                            />
                          </div>

                          <Input label="Email" value={customer.email} disabled />

                          <Input
                            label="Telefone"
                            value={profileForm.phone}
                            onChange={(e) =>
                              setProfileForm({ ...profileForm, phone: e.target.value })
                            }
                            placeholder="(11) 99999-9999"
                          />

                          <Button onClick={handleSaveProfile} isLoading={isLoading}>
                            Salvar Alterações
                          </Button>
                        </div>
                      </div>

                      {/* Email Preferences */}
                      <div className="bg-white shadow-sm p-6">
                        <h2 className="font-display text-xl mb-6">Preferências de Email</h2>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={customer.acceptsMarketing}
                            onChange={async (e) => {
                              await updateProfile({ acceptsMarketing: e.target.checked });
                              toast.success('Preferências atualizadas');
                            }}
                            className="w-4 h-4 text-primary-500 rounded border-secondary-300"
                          />
                          <span className="text-secondary-700">
                            Receber novidades e ofertas exclusivas por email
                          </span>
                        </label>
                      </div>

                      {/* Danger Zone */}
                      <div className="bg-white shadow-sm p-6 border border-red-100">
                        <h2 className="font-display text-xl mb-4 text-red-600">Zona de Perigo</h2>
                        <p className="text-sm text-secondary-600 mb-4">
                          Ao excluir sua conta, todos os seus dados serão permanentemente removidos.
                          Esta ação não pode ser desfeita.
                        </p>
                        <Button
                          variant="secondary"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                          onClick={() => toast.info('Entre em contato conosco para excluir sua conta')}
                        >
                          Excluir Conta
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </main>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title={editingAddressIndex !== null ? 'Editar Endereço' : 'Novo Endereço'}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveAddress();
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nome"
              value={addressForm.firstName}
              onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })}
              required
            />
            <Input
              label="Sobrenome"
              value={addressForm.lastName}
              onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })}
              required
            />
          </div>

          <Input
            label="Endereço"
            value={addressForm.address1}
            onChange={(e) => setAddressForm({ ...addressForm, address1: e.target.value })}
            placeholder="Rua, número"
            required
          />

          <Input
            label="Complemento"
            value={addressForm.address2 || ''}
            onChange={(e) => setAddressForm({ ...addressForm, address2: e.target.value })}
            placeholder="Apartamento, bloco (opcional)"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Cidade"
              value={addressForm.city}
              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
              required
            />
            <Input
              label="Estado"
              value={addressForm.state}
              onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="CEP"
              value={addressForm.zipCode}
              onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
              placeholder="00000-000"
              required
            />
            <Input
              label="Telefone"
              value={addressForm.phone}
              onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
              placeholder="(11) 99999-9999"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" isLoading={isLoading} className="flex-1">
              Salvar
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsAddressModalOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
};

// Order Card Component
const OrderCard = ({ order, compact = false }: { order: Order; compact?: boolean }) => {
  const status = orderStatusConfig[order.status];
  const StatusIcon = status.icon;

  return (
    <div className="border border-secondary-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-medium">{order.orderNumber}</p>
          <p className="text-sm text-secondary-500">
            {new Date(order.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${status.color}`}>
          <StatusIcon size={12} />
          {status.label}
        </span>
      </div>

      {!compact && (
        <div className="space-y-2 mb-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <img
                src={item.image}
                alt={item.title}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <p className="text-xs text-secondary-500">{item.variantTitle}</p>
                <p className="text-xs text-secondary-500">Qtd: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium">{formatPrice(item.price)}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-secondary-100">
        <p className="font-medium">Total: {formatPrice(order.total)}</p>
        {order.trackingUrl && (
          <a
            href={order.trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <Eye size={14} />
            Rastrear
          </a>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
