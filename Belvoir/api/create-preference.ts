/**
 * Vercel Serverless Function - Criar Preferência MercadoPago
 *
 * Usa a API REST diretamente para evitar problemas de compatibilidade com o SDK
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

interface CartItem {
  id: string;
  title: string;
  variantTitle?: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: {
    zipCode: string;
    street: string;
    number: string;
    city: string;
    state: string;
  };
}

interface CreatePreferenceBody {
  items: CartItem[];
  customer: CustomerInfo;
  shippingCost: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verificar token
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    console.error('MERCADOPAGO_ACCESS_TOKEN não configurado');
    return res.status(500).json({
      error: 'Configuração de pagamento incompleta',
      details: 'Token não configurado'
    });
  }

  try {
    const { items, customer, shippingCost } = req.body as CreatePreferenceBody;

    // Validação básica
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Carrinho vazio' });
    }

    if (!customer?.email) {
      return res.status(400).json({ error: 'E-mail obrigatório' });
    }

    // Criar itens para o MercadoPago
    const preferenceItems = items.map((item) => ({
      id: item.id,
      title: item.variantTitle ? `${item.title} - ${item.variantTitle}` : item.title,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: 'BRL',
      picture_url: item.image || undefined,
    }));

    // Adicionar frete se houver
    if (shippingCost > 0) {
      preferenceItems.push({
        id: 'shipping',
        title: 'Frete',
        quantity: 1,
        unit_price: shippingCost,
        currency_id: 'BRL',
        picture_url: undefined,
      });
    }

    // URL base
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:5173';

    console.log('Criando preferência para:', customer.email);

    // Criar preferência via API REST do MercadoPago
    const preferenceData = {
      items: preferenceItems,
      payer: {
        email: customer.email,
        name: customer.firstName,
        surname: customer.lastName,
        phone: customer.phone ? { number: customer.phone.replace(/\D/g, '') } : undefined,
        address: customer.address ? {
          zip_code: customer.address.zipCode.replace(/\D/g, ''),
          street_name: customer.address.street,
          street_number: customer.address.number,
        } : undefined,
      },
      back_urls: {
        success: `${baseUrl}/checkout/sucesso`,
        failure: `${baseUrl}/checkout/erro`,
        pending: `${baseUrl}/checkout/pendente`,
      },
      auto_return: 'approved',
      notification_url: `${baseUrl}/api/webhook-mercadopago`,
      statement_descriptor: 'BELVOIR',
      external_reference: `order-${Date.now()}`,
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferenceData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro MercadoPago:', response.status, errorData);
      return res.status(500).json({
        error: 'Erro ao criar preferência no MercadoPago',
        details: errorData,
      });
    }

    const result = await response.json();
    console.log('Preferência criada:', result.id);

    return res.status(200).json({
      preferenceId: result.id,
      initPoint: result.init_point,
      sandboxInitPoint: result.sandbox_init_point,
    });
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    return res.status(500).json({
      error: 'Erro ao processar pagamento',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
}
