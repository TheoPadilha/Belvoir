/**
 * Vercel Serverless Function - Webhook MercadoPago
 *
 * Recebe notificações de pagamento do MercadoPago.
 * SEGURANÇA: Verifica assinatura HMAC antes de processar.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

/**
 * Verifica a assinatura do webhook do MercadoPago
 * Documentação: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
 */
function verifyWebhookSignature(
  xSignature: string | undefined,
  xRequestId: string | undefined,
  dataId: string | undefined,
  secret: string
): boolean {
  if (!xSignature || !xRequestId) {
    console.warn('[Webhook] Assinatura ou request ID ausente');
    return false;
  }

  try {
    // Formato do x-signature: ts=xxx,v1=xxx
    const signatureParts = xSignature.split(',');
    const tsMatch = signatureParts.find(p => p.startsWith('ts='));
    const v1Match = signatureParts.find(p => p.startsWith('v1='));

    if (!tsMatch || !v1Match) {
      console.warn('[Webhook] Formato de assinatura inválido');
      return false;
    }

    const ts = tsMatch.split('=')[1];
    const receivedSignature = v1Match.split('=')[1];

    // Montar template para verificação
    // Template: id:[data.id];request-id:[x-request-id];ts:[ts];
    let template = '';
    if (dataId) {
      template += `id:${dataId};`;
    }
    template += `request-id:${xRequestId};ts:${ts};`;

    // Gerar HMAC
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(template);
    const expectedSignature = hmac.digest('hex');

    // Comparar de forma segura (timing-safe)
    const isValid = crypto.timingSafeEqual(
      Buffer.from(receivedSignature),
      Buffer.from(expectedSignature)
    );

    if (!isValid) {
      console.warn('[Webhook] Assinatura inválida');
      console.warn(`[Webhook] Template: ${template}`);
    }

    return isValid;
  } catch (error) {
    console.error('[Webhook] Erro ao verificar assinatura:', error);
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // MercadoPago envia notificações via POST e GET
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;

  // Se não tem webhook secret configurado, apenas logar aviso
  // Em produção, isso DEVE estar configurado
  if (!webhookSecret) {
    console.warn('[Webhook] MERCADOPAGO_WEBHOOK_SECRET não configurado - CONFIGURE PARA PRODUÇÃO!');
  }

  try {
    const { type, data } = req.body || req.query;
    const dataId = data?.id?.toString();

    console.log('[Webhook MercadoPago] Recebido:', { type, dataId });

    // Verificar assinatura se o secret estiver configurado
    if (webhookSecret) {
      const xSignature = req.headers['x-signature'] as string | undefined;
      const xRequestId = req.headers['x-request-id'] as string | undefined;

      const isValid = verifyWebhookSignature(xSignature, xRequestId, dataId, webhookSecret);

      if (!isValid) {
        console.error('[Webhook] Requisição com assinatura inválida rejeitada');
        // Retornar 401 para assinatura inválida
        return res.status(401).json({ error: 'Invalid signature' });
      }

      console.log('[Webhook] Assinatura verificada com sucesso');
    }

    // Notificação de pagamento
    if (type === 'payment' && dataId) {
      // Buscar info do pagamento via API REST
      const paymentResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${dataId}`,
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
          transaction_amount: paymentInfo.transaction_amount,
        });

        // Status possíveis: approved, pending, in_process, rejected, refunded, cancelled
        switch (paymentInfo.status) {
          case 'approved':
            console.log('[Webhook] Pagamento APROVADO:', paymentInfo.external_reference);
            // TODO: Atualizar status do pedido no seu banco de dados
            // TODO: Enviar email de confirmação
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
      } else {
        console.error('[Webhook] Erro ao buscar pagamento:', paymentResponse.status);
      }
    }

    // Notificação de merchant_order (pedido)
    if (type === 'merchant_order' && dataId) {
      console.log('[Webhook] Merchant order recebida:', dataId);
      // Processar merchant order se necessário
    }

    // Sempre retornar 200 para o MercadoPago confirmar recebimento
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('[Webhook MercadoPago] Erro:', error);
    // Mesmo com erro interno, retornar 200 para evitar retentativas infinitas
    // Mas logar o erro para investigação
    return res.status(200).json({ received: true, error: true });
  }
}
