/**
 * Vercel Serverless Function - Criar Preferência MercadoPago
 *
 * Esta função cria uma preferência de pagamento no MercadoPago
 * com os itens do carrinho e dados do cliente.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// MercadoPago SDK
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configuração do MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

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
  // Apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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
      picture_url: item.image,
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

    // URL base (produção ou desenvolvimento)
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:5173';

    // Criar preferência
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: preferenceItems,
        payer: {
          email: customer.email,
          name: customer.firstName,
          surname: customer.lastName,
          phone: customer.phone
            ? {
                number: customer.phone.replace(/\D/g, ''),
              }
            : undefined,
          address: customer.address
            ? {
                zip_code: customer.address.zipCode.replace(/\D/g, ''),
                street_name: customer.address.street,
                street_number: customer.address.number,
              }
            : undefined,
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
      },
    });

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
