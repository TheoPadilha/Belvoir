/**
 * Página de Erro do Checkout
 *
 * Exibida quando o pagamento é rejeitado pelo MercadoPago.
 */

import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, RefreshCw, MessageCircle } from 'lucide-react';
import { Button } from '../../components/ui';
import { PageTransition } from '../../components/animations';

export const CheckoutError = () => {
  const [searchParams] = useSearchParams();

  // Parâmetros do MercadoPago
  const paymentId = searchParams.get('payment_id');

  return (
    <PageTransition>
      <div className="min-h-screen bg-secondary-50 py-16">
        <div className="container-custom max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 md:p-12 text-center shadow-sm"
          >
            {/* Ícone de erro */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center"
            >
              <XCircle size={48} className="text-red-500" />
            </motion.div>

            <h1 className="font-display text-3xl md:text-4xl text-charcoal mb-4">
              Pagamento não Aprovado
            </h1>

            <p className="text-secondary-600 mb-8 max-w-md mx-auto">
              Infelizmente não foi possível processar seu pagamento.
              Isso pode acontecer por diversos motivos.
            </p>

            {/* Possíveis causas */}
            <div className="bg-red-50 p-6 rounded-lg mb-8 text-left">
              <h3 className="font-medium text-charcoal mb-4">Possíveis Causas</h3>
              <ul className="space-y-2 text-sm text-secondary-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Dados do cartão incorretos ou expirado
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Limite insuficiente no cartão
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Transação bloqueada pelo banco emissor
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Problema temporário de conexão
                </li>
              </ul>
            </div>

            {/* Sugestões */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg text-left">
                <RefreshCw size={24} className="text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-charcoal">Tente Novamente</h4>
                  <p className="text-sm text-secondary-600">
                    Verifique os dados e tente com outro cartão ou forma de pagamento.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg text-left">
                <MessageCircle size={24} className="text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-charcoal">Fale Conosco</h4>
                  <p className="text-sm text-secondary-600">
                    Nossa equipe está pronta para ajudar.
                  </p>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/checkout">
                <Button variant="primary">
                  <RefreshCw size={18} className="mr-2" />
                  Tentar Novamente
                </Button>
              </Link>
              <Link to="/contato">
                <Button variant="secondary">
                  Falar com Suporte
                </Button>
              </Link>
            </div>

            {/* ID do erro */}
            {paymentId && (
              <p className="mt-8 text-xs text-secondary-400">
                ID da transação: {paymentId}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CheckoutError;
