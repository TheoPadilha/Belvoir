/**
 * Página de Sucesso do Checkout
 *
 * Exibida após pagamento aprovado pelo MercadoPago.
 */

import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useCheckoutStore } from '../../store/checkoutStore';
import { Button } from '../../components/ui';
import { PageTransition } from '../../components/animations';

export const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const { resetCheckout, email } = useCheckoutStore();

  // Parâmetros do MercadoPago
  const paymentId = searchParams.get('payment_id');
  const externalReference = searchParams.get('external_reference');

  // Limpar carrinho e checkout após sucesso
  useEffect(() => {
    clearCart();
    resetCheckout();
  }, [clearCart, resetCheckout]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-secondary-50 py-16">
        <div className="container-custom max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 md:p-12 text-center shadow-sm"
          >
            {/* Ícone de sucesso */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
            >
              <CheckCircle size={48} className="text-green-500" />
            </motion.div>

            <h1 className="font-display text-3xl md:text-4xl text-charcoal mb-4">
              Pedido Confirmado!
            </h1>

            <p className="text-secondary-600 mb-8 max-w-md mx-auto">
              Obrigado pela sua compra! Seu pagamento foi aprovado e seu pedido está sendo processado.
            </p>

            {/* Detalhes do pedido */}
            <div className="bg-secondary-50 p-6 rounded-lg mb-8 text-left">
              <h3 className="font-medium text-charcoal mb-4">Detalhes do Pedido</h3>
              <div className="space-y-2 text-sm">
                {externalReference && (
                  <div className="flex justify-between">
                    <span className="text-secondary-500">Número do Pedido:</span>
                    <span className="font-medium">{externalReference}</span>
                  </div>
                )}
                {paymentId && (
                  <div className="flex justify-between">
                    <span className="text-secondary-500">ID do Pagamento:</span>
                    <span className="font-medium">{paymentId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-secondary-500">Status:</span>
                  <span className="font-medium text-green-600">Aprovado</span>
                </div>
              </div>
            </div>

            {/* Próximos passos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg text-left">
                <Mail size={24} className="text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-charcoal">E-mail de Confirmação</h4>
                  <p className="text-sm text-secondary-600">
                    Enviamos os detalhes do pedido para {email || 'seu e-mail'}.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg text-left">
                <Package size={24} className="text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-charcoal">Acompanhe seu Pedido</h4>
                  <p className="text-sm text-secondary-600">
                    Você receberá o código de rastreio por e-mail.
                  </p>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop">
                <Button variant="secondary">
                  Continuar Comprando
                </Button>
              </Link>
              <Link to="/">
                <Button variant="primary">
                  Voltar ao Início
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CheckoutSuccess;
