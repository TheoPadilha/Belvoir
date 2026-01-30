/**
 * Shopify Storefront API Client
 *
 * Este cliente se conecta à API Storefront do Shopify para buscar produtos,
 * gerenciar carrinho e processar checkouts.
 *
 * CONFIGURAÇÃO:
 * 1. No Shopify Admin, vá em Apps > Develop apps
 * 2. Crie um app e ative o Storefront API access
 * 3. Gere um Storefront access token
 * 4. Adicione ao .env.local:
 *    - VITE_SHOPIFY_STORE_DOMAIN=sua-loja.myshopify.com
 *    - VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=seu_token
 */

// Configurações do Shopify
const SHOPIFY_STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '';
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

// URL da API Storefront
const STOREFRONT_API_URL = SHOPIFY_STORE_DOMAIN
  ? `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`
  : '';

// Versão da API
export const SHOPIFY_API_VERSION = '2024-01';

/**
 * Verifica se o Shopify está configurado
 */
export const isShopifyConfigured = (): boolean => {
  return Boolean(SHOPIFY_STORE_DOMAIN && SHOPIFY_STOREFRONT_ACCESS_TOKEN);
};

/**
 * Interface para respostas da API Shopify
 */
export interface ShopifyResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
    extensions?: Record<string, unknown>;
  }>;
}

/**
 * Erro customizado para operações Shopify
 */
export class ShopifyError extends Error {
  public errors: ShopifyResponse<unknown>['errors'];

  constructor(message: string, errors?: ShopifyResponse<unknown>['errors']) {
    super(message);
    this.name = 'ShopifyError';
    this.errors = errors;
  }
}

/**
 * Cliente principal para requisições à Storefront API
 */
export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  // Verificar se Shopify está configurado
  if (!isShopifyConfigured()) {
    throw new ShopifyError(
      'Shopify não está configurado. Adicione VITE_SHOPIFY_STORE_DOMAIN e VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN ao .env.local'
    );
  }

  try {
    const response = await fetch(STOREFRONT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new ShopifyError(
        `Erro na requisição Shopify: ${response.status} ${response.statusText}`
      );
    }

    const json: ShopifyResponse<T> = await response.json();

    if (json.errors) {
      console.error('Shopify GraphQL Errors:', json.errors);
      throw new ShopifyError(
        json.errors[0]?.message || 'Erro desconhecido na API Shopify',
        json.errors
      );
    }

    return json.data as T;
  } catch (error) {
    if (error instanceof ShopifyError) {
      throw error;
    }
    throw new ShopifyError(
      `Erro de conexão com Shopify: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    );
  }
}

/**
 * Extrair ID numérico de um GID do Shopify
 * Ex: "gid://shopify/Product/123" -> "123"
 */
export function extractShopifyId(gid: string): string {
  const parts = gid.split('/');
  return parts[parts.length - 1];
}

/**
 * Criar GID do Shopify a partir de tipo e ID
 * Ex: ("Product", "123") -> "gid://shopify/Product/123"
 */
export function createShopifyGid(type: string, id: string | number): string {
  return `gid://shopify/${type}/${id}`;
}

/**
 * Formatar preço do Shopify (vem como string "12345.00")
 */
export function formatShopifyPrice(amount: string, currencyCode: string = 'BRL'): string {
  const numericAmount = parseFloat(amount);
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currencyCode,
  }).format(numericAmount);
}

/**
 * Configuração exportada para verificação
 */
export const shopifyConfig = {
  domain: SHOPIFY_STORE_DOMAIN,
  apiUrl: STOREFRONT_API_URL,
  apiVersion: SHOPIFY_API_VERSION,
  isConfigured: isShopifyConfigured(),
};

export default shopifyFetch;
