import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, Lock, CreditCard, Truck, MapPin } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useCheckoutStore } from '../../store/checkoutStore';
import { formatPrice, shippingMethods } from '../../data/products';
import { Button, Input } from '../../components/ui';
import { PageTransition } from '../../components/animations';
import { toast } from '../../store/uiStore';
import type { Address } from '../../types';

const steps = [
  { number: 1, title: 'Informações', icon: MapPin },
  { number: 2, title: 'Entrega', icon: Truck },
  { number: 3, title: 'Pagamento', icon: CreditCard },
];

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, clearCart } = useCartStore();
  const {
    step,
    setStep,
    email,
    setEmail,
    shippingAddress,
    setShippingAddress,
    shippingMethod,
    setShippingMethod,
    canProceedToStep,
    resetCheckout,
  } = useCheckoutStore();

  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getSubtotal();
  const shippingCost = shippingMethod?.price || 0;
  const total = subtotal + shippingCost;

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/shop');
    }
  }, [items.length, navigate]);

  const handleNextStep = () => {
    if (step === 1 && canProceedToStep(2)) {
      setStep(2);
    } else if (step === 2 && canProceedToStep(3)) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    // Simular processamento do pedido
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success('Pedido realizado com sucesso! Você receberá um e-mail de confirmação.');
    clearCart();
    resetCheckout();
    navigate('/');

    setIsProcessing(false);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="container-custom">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="font-display text-2xl font-semibold">
              BELVOIR
            </Link>
            <div className="flex items-center gap-2 text-sm text-secondary-500">
              <Lock size={16} />
              Checkout Seguro
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              {steps.map((s, index) => (
                <div key={s.number} className="flex items-center">
                  <div
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-full transition-colors
                      ${step === s.number
                        ? 'bg-charcoal text-white'
                        : step > s.number
                          ? 'bg-green-500 text-white'
                          : 'bg-white text-secondary-400'
                      }
                    `}
                  >
                    {step > s.number ? (
                      <Check size={18} />
                    ) : (
                      <s.icon size={18} />
                    )}
                    <span className="hidden sm:inline text-sm font-medium">
                      {s.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 h-0.5 mx-2 ${
                        step > s.number ? 'bg-green-500' : 'bg-secondary-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 md:p-8 shadow-sm">
                <AnimatePresence mode="wait">
                  {/* Step 1: Information */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="font-display text-2xl mb-6">Informações de Contato</h2>
                      <div className="space-y-6">
                        <Input
                          label="E-mail"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="seu@email.com"
                          required
                        />

                        <h3 className="font-display text-xl pt-4 border-t border-secondary-100">
                          Endereço de Entrega
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Nome"
                            value={shippingAddress?.firstName || ''}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                firstName: e.target.value,
                              } as Address)
                            }
                            required
                          />
                          <Input
                            label="Sobrenome"
                            value={shippingAddress?.lastName || ''}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                lastName: e.target.value,
                              } as Address)
                            }
                            required
                          />
                        </div>

                        <Input
                          label="Endereço"
                          value={shippingAddress?.address1 || ''}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              address1: e.target.value,
                            } as Address)
                          }
                          placeholder="Rua, número"
                          required
                        />

                        <Input
                          label="Complemento"
                          value={shippingAddress?.address2 || ''}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              address2: e.target.value,
                            } as Address)
                          }
                          placeholder="Apartamento, bloco (opcional)"
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Cidade"
                            value={shippingAddress?.city || ''}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                city: e.target.value,
                              } as Address)
                            }
                            required
                          />
                          <Input
                            label="Estado"
                            value={shippingAddress?.state || ''}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                state: e.target.value,
                              } as Address)
                            }
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="CEP"
                            value={shippingAddress?.zipCode || ''}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                zipCode: e.target.value,
                              } as Address)
                            }
                            placeholder="00000-000"
                            required
                          />
                          <Input
                            label="Telefone"
                            type="tel"
                            value={shippingAddress?.phone || ''}
                            onChange={(e) =>
                              setShippingAddress({
                                ...shippingAddress,
                                phone: e.target.value,
                              } as Address)
                            }
                            placeholder="(11) 99999-9999"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex justify-between mt-8 pt-6 border-t border-secondary-100">
                        <Link
                          to="/shop"
                          className="flex items-center gap-2 text-secondary-500 hover:text-charcoal"
                        >
                          <ChevronLeft size={18} />
                          Continuar Comprando
                        </Link>
                        <Button
                          onClick={handleNextStep}
                          disabled={!canProceedToStep(2)}
                        >
                          Continuar para Entrega
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Shipping */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="font-display text-2xl mb-6">Método de Entrega</h2>

                      <div className="space-y-4">
                        {shippingMethods.map((method) => (
                          <label
                            key={method.id}
                            className={`
                              flex items-center justify-between p-4 border cursor-pointer transition-colors
                              ${shippingMethod?.id === method.id
                                ? 'border-charcoal bg-secondary-50'
                                : 'border-secondary-200 hover:border-secondary-400'
                              }
                            `}
                          >
                            <div className="flex items-center gap-4">
                              <input
                                type="radio"
                                name="shipping"
                                checked={shippingMethod?.id === method.id}
                                onChange={() => setShippingMethod(method)}
                                className="w-4 h-4 text-charcoal"
                              />
                              <div>
                                <p className="font-medium">{method.title}</p>
                                <p className="text-sm text-secondary-500">
                                  {method.estimatedDays}
                                </p>
                              </div>
                            </div>
                            <span className="font-medium">
                              {method.price === 0 ? 'Grátis' : formatPrice(method.price)}
                            </span>
                          </label>
                        ))}
                      </div>

                      <div className="flex justify-between mt-8 pt-6 border-t border-secondary-100">
                        <button
                          onClick={handlePrevStep}
                          className="flex items-center gap-2 text-secondary-500 hover:text-charcoal"
                        >
                          <ChevronLeft size={18} />
                          Voltar
                        </button>
                        <Button
                          onClick={handleNextStep}
                          disabled={!canProceedToStep(3)}
                        >
                          Continuar para Pagamento
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Payment */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="font-display text-2xl mb-6">Pagamento</h2>

                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                        <p className="text-sm text-yellow-800">
                          <strong>Modo Demonstração:</strong> Este é um ambiente de teste.
                          Nenhum pagamento real será processado.
                        </p>
                      </div>

                      <div className="space-y-6">
                        <div className="p-4 border border-secondary-200 rounded-lg">
                          <div className="flex items-center gap-3 mb-4">
                            <CreditCard size={24} className="text-secondary-400" />
                            <span className="font-medium">Cartão de Crédito</span>
                          </div>

                          <div className="space-y-4">
                            <Input
                              label="Número do Cartão"
                              placeholder="0000 0000 0000 0000"
                            />
                            <Input
                              label="Nome no Cartão"
                              placeholder="Como aparece no cartão"
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <Input label="Validade" placeholder="MM/AA" />
                              <Input label="CVV" placeholder="123" />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            id="terms"
                            className="mt-1"
                            defaultChecked
                          />
                          <label htmlFor="terms" className="text-sm text-secondary-600">
                            Li e aceito os{' '}
                            <a href="/politicas/termos" className="text-primary-500 hover:underline">
                              Termos de Uso
                            </a>{' '}
                            e a{' '}
                            <a href="/politicas/privacidade" className="text-primary-500 hover:underline">
                              Política de Privacidade
                            </a>
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-between mt-8 pt-6 border-t border-secondary-100">
                        <button
                          onClick={handlePrevStep}
                          className="flex items-center gap-2 text-secondary-500 hover:text-charcoal"
                        >
                          <ChevronLeft size={18} />
                          Voltar
                        </button>
                        <Button
                          onClick={handlePlaceOrder}
                          isLoading={isProcessing}
                          variant="gold"
                          size="lg"
                        >
                          <Lock size={18} className="mr-2" />
                          Finalizar Pedido - {formatPrice(total)}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 shadow-sm sticky top-8">
                <h3 className="font-display text-xl mb-4">Resumo do Pedido</h3>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-16 h-16 bg-secondary-100 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-charcoal text-white text-xs flex items-center justify-center rounded-full">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        <p className="text-xs text-secondary-500">{item.variantTitle}</p>
                        <p className="text-sm font-medium mt-1">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-secondary-100 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-500">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-500">Frete</span>
                    <span>
                      {shippingMethod
                        ? shippingMethod.price === 0
                          ? 'Grátis'
                          : formatPrice(shippingMethod.price)
                        : 'Calcular na próxima etapa'}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-display font-semibold pt-3 border-t border-secondary-100">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-secondary-100">
                  <div className="flex items-center gap-2 text-sm text-secondary-500 mb-2">
                    <Lock size={14} />
                    Pagamento 100% seguro
                  </div>
                  <p className="text-xs text-secondary-400">
                    Seus dados estão protegidos com criptografia de ponta.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CheckoutPage;
