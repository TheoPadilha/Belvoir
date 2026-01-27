import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { animate, stagger } from 'animejs';
import {
  Package,
  MapPin,
  Mail,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button, Input, Modal } from '../../components/ui';
import { PageTransition } from '../../components/animations';
import { toast } from '../../store/uiStore';
import {
  ContaSidebar,
  ContaStatCard,
  PedidoCard,
  EmptyState,
} from '../../components/conta';
import type { Address } from '../../types';

type TabType = 'overview' | 'orders' | 'addresses' | 'settings';

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

  // Refs for animations
  const statCardsRef = useRef<HTMLDivElement>(null);
  const ordersRef = useRef<HTMLElement>(null);

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

  // Function to animate overview content - called after framer-motion animation completes
  const animateOverviewContent = () => {
    // Animate stat cards
    if (statCardsRef.current && statCardsRef.current.children.length > 0) {
      animate(statCardsRef.current.children, {
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutExpo',
        delay: stagger(100, { start: 50 }),
      });
    }

    // Animate orders section
    if (ordersRef.current) {
      animate(ordersRef.current, {
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutExpo',
      });
    }
  };

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
      <div className="min-h-screen bg-cream">
        <div className="container-custom py-8 pt-28">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-secondary-500 hover:text-primary-500 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <span className="text-secondary-400">/</span>
              </li>
              <li>
                <span className="text-charcoal font-medium">Minha Conta</span>
              </li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-display font-semibold text-charcoal mb-2">
              Minha Conta
            </h1>
            <p className="text-secondary-500 text-lg">
              Olá, {customer.firstName}! Gerencie suas informações e pedidos.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar */}
            <ContaSidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onLogout={handleLogout}
              customer={customer}
              ordersCount={orders.length}
            />

            {/* Main Content */}
            <main className="lg:col-span-9">
              <AnimatePresence mode="wait">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onAnimationComplete={animateOverviewContent}
                    className="space-y-6"
                  >
                    {/* Stat Cards */}
                    <div
                      ref={statCardsRef}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <div className="opacity-0 translate-y-[30px]">
                        <ContaStatCard
                          icon={<Package className="w-6 h-6" />}
                          value={orders.length}
                          label="Pedidos Ativos"
                          variant="primary"
                          badge={
                            orders.length > 0
                              ? { text: `${orders.length} total`, type: 'info' }
                              : undefined
                          }
                          linkText="Ver detalhes"
                          onLinkClick={() => setActiveTab('orders')}
                        />
                      </div>
                      <div className="opacity-0 translate-y-[30px]">
                        <ContaStatCard
                          icon={<MapPin className="w-6 h-6" />}
                          value={customer.addresses.length}
                          label="Endereços Salvos"
                          variant="secondary"
                          linkText="Adicionar endereço"
                          onLinkClick={() => {
                            setActiveTab('addresses');
                            handleOpenAddressModal();
                          }}
                        />
                      </div>
                      <div className="opacity-0 translate-y-[30px]">
                        <ContaStatCard
                          icon={<Mail className="w-6 h-6" />}
                          value={customer.email.split('@')[0]}
                          label="Email da Conta"
                          variant="accent"
                          badge={{ text: 'Verificado', type: 'verified' }}
                          linkText="Editar perfil"
                          onLinkClick={() => setActiveTab('settings')}
                        />
                      </div>
                    </div>

                    {/* Recent Orders Section */}
                    <section
                      ref={ordersRef}
                      className="bg-white rounded-lg shadow-sm p-6 border border-secondary-100 opacity-0 translate-y-[20px]"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-xl font-display font-semibold text-charcoal mb-1">
                            Pedidos Recentes
                          </h2>
                          <p className="text-secondary-500 text-sm">
                            Acompanhe seus últimos pedidos
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveTab('orders')}
                          className="px-5 py-2.5 bg-charcoal text-white rounded-lg font-medium hover:bg-secondary-800 transition-all duration-300"
                        >
                          Ver Todos
                        </button>
                      </div>

                      {orders.length > 0 ? (
                        <div className="space-y-3">
                          {orders.slice(0, 3).map((order) => (
                            <PedidoCard key={order.id} order={order} compact />
                          ))}
                        </div>
                      ) : (
                        <EmptyState
                          icon={<Package className="w-12 h-12" />}
                          title="Nenhum pedido ainda"
                          description="Comece a explorar nossa coleção"
                          actionText="Ver Coleção"
                          actionLink="/shop"
                        />
                      )}
                    </section>
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
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-secondary-100">
                      <h2 className="text-xl font-display font-semibold text-charcoal mb-6">
                        Meus Pedidos
                      </h2>

                      {orders.length > 0 ? (
                        <div className="space-y-4">
                          {orders.map((order) => (
                            <PedidoCard key={order.id} order={order} />
                          ))}
                        </div>
                      ) : (
                        <EmptyState
                          icon={<Package className="w-16 h-16" />}
                          title="Nenhum pedido encontrado"
                          description="Quando você fizer uma compra, seus pedidos aparecerão aqui."
                          actionText="Explorar Produtos"
                          actionLink="/shop"
                        />
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
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-secondary-100">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-display font-semibold text-charcoal">
                          Meus Endereços
                        </h2>
                        <Button
                          variant="secondary"
                          onClick={() => handleOpenAddressModal()}
                          className="flex items-center gap-2"
                        >
                          <Plus size={16} />
                          Adicionar
                        </Button>
                      </div>

                      {customer.addresses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {customer.addresses.map((address, index) => (
                            <div
                              key={index}
                              className={`p-4 border rounded-lg transition-all duration-300 hover:shadow-sm ${
                                customer.defaultAddress === address
                                  ? 'border-primary-400 bg-primary-50'
                                  : 'border-secondary-200 hover:border-secondary-300'
                              }`}
                            >
                              {customer.defaultAddress === address && (
                                <span className="inline-flex items-center text-xs font-medium text-primary-700 bg-primary-100 px-2 py-0.5 rounded-full mb-2">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Padrão
                                </span>
                              )}
                              <p className="font-medium text-charcoal">
                                {address.firstName} {address.lastName}
                              </p>
                              <p className="text-sm text-secondary-600 mt-1">
                                {address.address1}
                                {address.address2 && `, ${address.address2}`}
                              </p>
                              <p className="text-sm text-secondary-600">
                                {address.city}, {address.state} - {address.zipCode}
                              </p>
                              <p className="text-sm text-secondary-600">{address.phone}</p>

                              <div className="flex gap-3 mt-4 pt-3 border-t border-secondary-100">
                                <button
                                  onClick={() => handleOpenAddressModal(index)}
                                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium"
                                >
                                  <Edit2 size={14} />
                                  Editar
                                </button>
                                {customer.defaultAddress !== address && (
                                  <>
                                    <button
                                      onClick={() => handleSetDefault(index)}
                                      className="text-sm text-secondary-600 hover:text-charcoal font-medium"
                                    >
                                      Definir como padrão
                                    </button>
                                    <button
                                      onClick={() => handleDeleteAddress(index)}
                                      className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
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
                        <EmptyState
                          icon={<MapPin className="w-16 h-16" />}
                          title="Nenhum endereço cadastrado"
                          description="Adicione um endereço para facilitar suas compras."
                          actionText="Adicionar Endereço"
                          onAction={() => handleOpenAddressModal()}
                        />
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
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-secondary-100">
                      <h2 className="text-xl font-display font-semibold text-charcoal mb-6">
                        Dados Pessoais
                      </h2>

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
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-secondary-100">
                      <h2 className="text-xl font-display font-semibold text-charcoal mb-6">
                        Preferências de Email
                      </h2>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customer.acceptsMarketing}
                          onChange={async (e) => {
                            await updateProfile({ acceptsMarketing: e.target.checked });
                            toast.success('Preferências atualizadas');
                          }}
                          className="w-4 h-4 text-primary-500 rounded border-secondary-300 focus:ring-primary-500"
                        />
                        <span className="text-secondary-700">
                          Receber novidades e ofertas exclusivas por email
                        </span>
                      </label>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-red-200">
                      <h2 className="text-xl font-display font-semibold text-red-600 mb-4">
                        Zona de Perigo
                      </h2>
                      <p className="text-sm text-secondary-600 mb-4">
                        Ao excluir sua conta, todos os seus dados serão permanentemente
                        removidos. Esta ação não pode ser desfeita.
                      </p>
                      <Button
                        variant="secondary"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() =>
                          toast.info('Entre em contato conosco para excluir sua conta')
                        }
                      >
                        Excluir Conta
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
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

export default AccountPage;
