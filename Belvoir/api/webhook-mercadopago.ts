/**
 * Vercel Serverless Function - Webhook MercadoPago
 *
 * Recebe notificações de pagamento do MercadoPago.
 * Aqui você pode:
 * - Atualizar status do pedido no banco de dados
 * - Criar pedido no Shopify via Admin API
 * - Enviar e-mail de confirmação
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // MercadoPago envia notificações via POST e GET
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, data } = req.body || req.query;

    console.log('[Webhook MercadoPago] Recebido:', { type, data });

    // Notificação de pagamento
    if (type === 'payment' && data?.id) {
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: data.id });

      console.log('[Webhook MercadoPago] Payment info:', {
        id: paymentInfo.id,
        status: paymentInfo.status,
        status_detail: paymentInfo.status_detail,
        external_reference: paymentInfo.external_reference,
      });

      // Status possíveis: approved, pending, in_process, rejected, refunded, cancelled
      switch (paymentInfo.status) {
        case 'approved':
          // Pagamento aprovado!
          // TODO: Criar pedido no Shopify, enviar e-mail, etc.
          console.log('[Webhook] Pagamento APROVADO:', paymentInfo.external_reference);
          break;

        case 'pending':
        case 'in_process':
          // Aguardando pagamento (boleto, PIX, etc.)
          console.log('[Webhook] Pagamento PENDENTE:', paymentInfo.external_reference);
          break;

        case 'rejected':
          // Pagamento rejeitado
          console.log('[Webhook] Pagamento REJEITADO:', paymentInfo.external_reference);
          break;

        case 'refunded':
        case 'cancelled':
          // Pagamento cancelado ou reembolsado
          console.log('[Webhook] Pagamento CANCELADO:', paymentInfo.external_reference);
          break;
      }
    }

    // Sempre retornar 200 para o MercadoPago
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('[Webhook MercadoPago] Erro:', error);
    // Mesmo com erro, retornar 200 para evitar retentativas
    return res.status(200).json({ received: true, error: true });
  }
}
