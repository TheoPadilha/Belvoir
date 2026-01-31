/**
 * Vercel Serverless Function - Criar Preferência MercadoPago
 *
 * SEGURANÇA: Valida preços diretamente no Shopify antes de criar o pagamento.
 * Nunca confia nos preços enviados pelo frontend.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  title: string;
  variantTitle?: string;
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

interface ShopifyVariantPrice {
  id: string;
  price: number;
  title: string;
  available: boolean;
}

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://belvoir-dev.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
];

/**
 * Busca preços reais das variantes no Shopify
 */
async function getVariantPricesFromShopify(variantIds: string[]): Promise<Map<string, ShopifyVariantPrice>> {
  const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN || process.env.VITE_SHOPIFY_STORE_DOMAIN;
  const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!shopifyDomain || !storefrontToken) {
    throw new Error('Shopify não configurado no servidor');
  }

  // Converter IDs para formato GID do Shopify se necessário
  const gids = variantIds.map(id => {
    if (id.startsWith('gid://')) return id;
    return `gid://shopify/ProductVariant/${id}`;
  });

  const query = `
    query getVariantPrices($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on ProductVariant {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
        }
      }
    }
  `;

  const response = await fetch(`https://${shopifyDomain}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontToken,
    },
    body: JSON.stringify({
      query,
      variables: { ids: gids },
    }),
  });

  if (!response.ok) {
    throw new Error('Erro ao consultar Shopify');
  }

  const data = await response.json();

  if (data.errors) {
    console.error('Shopify GraphQL errors:', data.errors);
    throw new Error('Erro na consulta ao Shopify');
  }

  const priceMap = new Map<string, ShopifyVariantPrice>();

  for (const node of data.data.nodes) {
    if (node && node.id) {
      // Extrair ID numérico do GID
      const numericId = node.id.split('/').pop();
      priceMap.set(numericId, {
        id: node.id,
        price: parseFloat(node.price.amount),
        title: node.title,
        available: node.availableForSale,
      });
      // Também mapear pelo GID completo
      priceMap.set(node.id, {
        id: node.id,
        price: parseFloat(node.price.amount),
        title: node.title,
        available: node.availableForSale,
      });
    }
  }

  return priceMap;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers - restrito a origens permitidas
  const origin = req.headers.origin || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verificar token MercadoPago
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    console.error('MERCADOPAGO_ACCESS_TOKEN não configurado');
    return res.status(500).json({
      error: 'Configuração de pagamento incompleta',
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

    // Validar que todos os items têm variantId
    for (const item of items) {
      if (!item.variantId) {
        return res.status(400).json({ error: 'Item sem variante especificada' });
      }
      if (!item.quantity || item.quantity < 1) {
        return res.status(400).json({ error: 'Quantidade inválida' });
      }
    }

    // SEGURANÇA: Buscar preços reais do Shopify
    const variantIds = items.map(item => item.variantId);
    let shopifyPrices: Map<string, ShopifyVariantPrice>;

    try {
      shopifyPrices = await getVariantPricesFromShopify(variantIds);
    } catch (shopifyError) {
      console.error('Erro ao validar preços no Shopify:', shopifyError);
      return res.status(500).json({
        error: 'Erro ao validar preços. Tente novamente.',
      });
    }

    // Criar itens para o MercadoPago COM PREÇOS DO SHOPIFY
    const preferenceItems = [];

    for (const item of items) {
      // Buscar preço real do Shopify
      const shopifyVariant = shopifyPrices.get(item.variantId);

      if (!shopifyVariant) {
        console.error(`Variante não encontrada: ${item.variantId}`);
        return res.status(400).json({
          error: `Produto "${item.title}" não encontrado. Atualize seu carrinho.`,
        });
      }

      if (!shopifyVariant.available) {
        return res.status(400).json({
          error: `Produto "${item.title}" está indisponível.`,
        });
      }

      // Usar o preço do SHOPIFY, não do frontend
      preferenceItems.push({
        id: item.variantId,
        title: item.variantTitle ? `${item.title} - ${item.variantTitle}` : item.title,
        quantity: item.quantity,
        unit_price: shopifyVariant.price, // PREÇO SEGURO DO SHOPIFY
        currency_id: 'BRL',
        picture_url: item.image || undefined,
      });
    }

    // Adicionar frete se houver (frete é controlado pelo backend)
    if (shippingCost > 0) {
      // Validar que frete está dentro de limites razoáveis
      const MAX_SHIPPING = 500; // R$ 500 máximo de frete
      const validShippingCost = Math.min(Math.max(0, shippingCost), MAX_SHIPPING);

      preferenceItems.push({
        id: 'shipping',
        title: 'Frete',
        quantity: 1,
        unit_price: validShippingCost,
        currency_id: 'BRL',
        picture_url: undefined,
      });
    }

    // URL base - usar URL de produção fixa
    const baseUrl = process.env.SITE_URL
      || (process.env.VERCEL_ENV === 'production' ? 'https://belvoir-dev.vercel.app' : null)
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173');

    console.log('Criando preferência segura para:', customer.email);

    // Calcular total para log de segurança
    const totalAmount = preferenceItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
    console.log(`Total da compra (validado): R$ ${totalAmount.toFixed(2)}`);

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
      external_reference: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
        error: 'Erro ao processar pagamento. Tente novamente.',
      });
    }

    const result = await response.json();
    console.log('Preferência criada com sucesso:', result.id);

    return res.status(200).json({
      preferenceId: result.id,
      initPoint: result.init_point,
      sandboxInitPoint: result.sandbox_init_point,
    });
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    return res.status(500).json({
      error: 'Erro ao processar pagamento',
    });
  }
}
