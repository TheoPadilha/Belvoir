/**
 * Vercel Serverless Function - Webhook MercadoPago
 *
 * Recebe notificações de pagamento do MercadoPago.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // MercadoPago envia notificações via POST e GET
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

  try {
    const { type, data } = req.body || req.query;

    console.log('[Webhook MercadoPago] Recebido:', { type, data });

    // Notificação de pagamento
    if (type === 'payment' && data?.id) {
      // Buscar info do pagamento via API REST
      const paymentResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${data.id}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (paymentResponse.ok) {
        const paymentInfo = await paymentResponse.json();

        console.log('[Webhook MercadoPago] Payment info:', {
          id: paymentInfo.id,
          status: paymentInfo.status,
          status_detail: paymentInfo.status_detail,
          external_reference: paymentInfo.external_reference,
        });

        // Status possíveis: approved, pending, in_process, rejected, refunded, cancelled
        switch (paymentInfo.status) {
          case 'approved':
            console.log('[Webhook] Pagamento APROVADO:', paymentInfo.external_reference);
            break;
          case 'pending':
          case 'in_process':
            console.log('[Webhook] Pagamento PENDENTE:', paymentInfo.external_reference);
            break;
          case 'rejected':
            console.log('[Webhook] Pagamento REJEITADO:', paymentInfo.external_reference);
            break;
          case 'refunded':
          case 'cancelled':
            console.log('[Webhook] Pagamento CANCELADO:', paymentInfo.external_reference);
            break;
        }
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
