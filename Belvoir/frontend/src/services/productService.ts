/**
 * Product Service - Shopify Storefront API
 *
 * Serviço para buscar produtos e coleções da loja Shopify.
 * Inclui queries GraphQL e funções de mapeamento para tipos locais.
 */

import shopifyFetch, { extractShopifyId, isShopifyConfigured } from './shopifyClient';
import type { Product, ProductImage, ProductVariant, Collection } from '../types';

// ============================================
// TIPOS SHOPIFY (Respostas da API)
// ============================================

interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

interface ShopifyImage {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  sku: string;
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  quantityAvailable?: number | null;
}

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  totalInventory?: number;
  productType: string;
  vendor: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  compareAtPriceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  variants: {
    edges: Array<{
      node: ShopifyProductVariant;
    }>;
  };
  metafields: Array<{
    key: string;
    value: string;
    namespace: string;
  } | null>;
}

interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: ShopifyImage | null;
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
}

// ============================================
// GRAPHQL FRAGMENTS
// ============================================

// Fragment otimizado - imagens com tamanho reduzido para performance
const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    title
    handle
    description
    availableForSale
    productType
    vendor
    tags
    createdAt
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 3) {
      edges {
        node {
          id
          url(transform: { maxWidth: 600, maxHeight: 600, crop: CENTER })
          altText
        }
      }
    }
    variants(first: 5) {
      edges {
        node {
          id
          title
          availableForSale
          sku
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
    metafields(identifiers: [
      { namespace: "custom", key: "short_description" }
    ]) {
      key
      value
      namespace
    }
  }
`;

// ============================================
// GRAPHQL QUERIES
// ============================================

const GET_ALL_PRODUCTS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetAllProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ...ProductFields
        }
      }
    }
  }
`;

const GET_PRODUCT_BY_HANDLE_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
`;

const GET_PRODUCTS_BY_COLLECTION_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetProductsByCollection($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image {
        url
        altText
      }
      products(first: $first) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
  }
`;

const GET_ALL_COLLECTIONS_QUERY = `
  query GetAllCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

const SEARCH_PRODUCTS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query SearchProducts($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
      edges {
        node {
          ...ProductFields
        }
      }
    }
  }
`;

// ============================================
// FUNÇÕES DE MAPEAMENTO
// ============================================

/**
 * Mapeia imagem Shopify para tipo local
 */
function mapShopifyImage(image: ShopifyImage): ProductImage {
  return {
    id: extractShopifyId(image.id),
    src: image.url,
    alt: image.altText || '',
  };
}

/**
 * Mapeia variante Shopify para tipo local
 */
function mapShopifyVariant(variant: ShopifyProductVariant): ProductVariant {
  const options = variant.selectedOptions || [];
  const option1 = options.find((o) => o.name.toLowerCase() === 'color')?.value;
  const option2 = options.find((o) => o.name.toLowerCase() === 'size')?.value;

  return {
    id: extractShopifyId(variant.id),
    title: variant.title || 'Default',
    price: parseFloat(variant.price?.amount || '0'),
    compareAtPrice: variant.compareAtPrice?.amount
      ? parseFloat(variant.compareAtPrice.amount)
      : undefined,
    available: variant.availableForSale ?? true,
    sku: variant.sku || '',
    option1,
    option2,
  };
}

/**
 * Extrai valor de metafield
 */
function getMetafieldValue(
  metafields: ShopifyProduct['metafields'],
  key: string
): string {
  const field = metafields?.find((m) => m?.key === key);
  return field?.value || '';
}

/**
 * Mapeia produto Shopify para tipo local (versão otimizada)
 */
function mapShopifyProduct(product: ShopifyProduct): Product {
  const images = product.images?.edges?.map((e) => mapShopifyImage(e.node)) || [];
  const variants = product.variants?.edges?.map((e) => mapShopifyVariant(e.node)) || [];
  const firstVariant = variants[0];

  // Extrair short_description do metafield
  const shortDescription = getMetafieldValue(product.metafields, 'short_description');

  // Valores seguros
  const description = product.description || '';
  const priceAmount = product.priceRange?.minVariantPrice?.amount || '0';
  const compareAtAmount = product.compareAtPriceRange?.minVariantPrice?.amount || '0';

  return {
    id: extractShopifyId(product.id),
    title: product.title || 'Produto',
    handle: product.handle || '',
    description,
    shortDescription: shortDescription || (description.length > 150 ? description.slice(0, 150) + '...' : description),
    price: firstVariant?.price || parseFloat(priceAmount),
    compareAtPrice: firstVariant?.compareAtPrice ||
      (compareAtAmount !== '0.0' && compareAtAmount !== '0'
        ? parseFloat(compareAtAmount)
        : undefined),
    images,
    variants,
    category: product.productType || 'Geral',
    tags: product.tags || [],
    available: product.availableForSale ?? true,
    totalInventory: 0,
    brand: product.vendor || 'Belvoir',
    material: '',
    movement: '',
    waterResistance: '',
    caseDiameter: '',
    features: [],
    createdAt: product.createdAt || new Date().toISOString(),
  };
}

/**
 * Mapeia coleção Shopify para tipo local
 */
function mapShopifyCollection(collection: ShopifyCollection): Collection {
  return {
    id: extractShopifyId(collection.id),
    title: collection.title,
    handle: collection.handle,
    description: collection.description,
    image: collection.image?.url || '',
    products: collection.products.edges.map((e) => mapShopifyProduct(e.node)),
  };
}

// ============================================
// CACHE SIMPLES PARA EVITAR RE-FETCHES
// ============================================

const cache: {
  products: Product[] | null;
  categories: string[] | null;
  timestamp: number;
} = {
  products: null,
  categories: null,
  timestamp: 0,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

function isCacheValid(): boolean {
  return Date.now() - cache.timestamp < CACHE_DURATION;
}

// ============================================
// FUNÇÕES PÚBLICAS (API DO SERVIÇO)
// ============================================

/**
 * Buscar todos os produtos do Shopify (com cache)
 */
export async function getAllProducts(limit: number = 50): Promise<Product[]> {
  // Retorna do cache se válido
  if (cache.products && isCacheValid()) {
    console.log('[ProductService] Retornando do cache');
    return cache.products;
  }

  // Se Shopify não está configurado, retorna array vazio
  if (!isShopifyConfigured()) {
    console.log('[ProductService] Shopify não configurado');
    return [];
  }

  console.log('[ProductService] Buscando produtos do Shopify...');

  try {
    const data = await shopifyFetch<{
      products: {
        edges: Array<{ node: ShopifyProduct }>;
      };
    }>(GET_ALL_PRODUCTS_QUERY, { first: limit });

    console.log('[ProductService] Resposta recebida, produtos:', data?.products?.edges?.length || 0);

    if (!data?.products?.edges) {
      console.log('[ProductService] Nenhum produto encontrado');
      return [];
    }

    const products = data.products.edges.map((e) => mapShopifyProduct(e.node));

    // Salvar no cache
    cache.products = products;
    cache.timestamp = Date.now();

    console.log('[ProductService] Produtos mapeados e cacheados:', products.length);

    return products;
  } catch (error) {
    console.error('[ProductService] Erro ao buscar produtos:', error);
    return [];
  }
}

/**
 * Buscar produto por handle (slug)
 */
export async function getProductByHandle(handle: string): Promise<Product | null> {
  // Se Shopify não está configurado, retorna null
  if (!isShopifyConfigured()) {
    console.log('[ProductService] Shopify não configurado');
    return null;
  }

  const data = await shopifyFetch<{
    product: ShopifyProduct | null;
  }>(GET_PRODUCT_BY_HANDLE_QUERY, { handle });

  if (!data.product) return null;
  return mapShopifyProduct(data.product);
}

/**
 * Buscar produtos por coleção
 */
export async function getProductsByCollection(
  collectionHandle: string,
  limit: number = 50
): Promise<Collection | null> {
  // Se Shopify não está configurado, retorna null
  if (!isShopifyConfigured()) {
    console.log('[ProductService] Shopify não configurado');
    return null;
  }

  const data = await shopifyFetch<{
    collection: ShopifyCollection | null;
  }>(GET_PRODUCTS_BY_COLLECTION_QUERY, { handle: collectionHandle, first: limit });

  if (!data.collection) return null;
  return mapShopifyCollection(data.collection);
}

/**
 * Buscar todas as coleções (categorias)
 */
export async function getAllCollections(limit: number = 20): Promise<string[]> {
  // Se Shopify não está configurado, retorna array vazio
  if (!isShopifyConfigured()) {
    console.log('[ProductService] Shopify não configurado');
    return [];
  }

  const data = await shopifyFetch<{
    collections: {
      edges: Array<{
        node: {
          title: string;
          handle: string;
        };
      }>;
    };
  }>(GET_ALL_COLLECTIONS_QUERY, { first: limit });

  return data.collections.edges.map((e) => e.node.title);
}

/**
 * Buscar produtos por termo de pesquisa
 */
export async function searchProducts(query: string, limit: number = 20): Promise<Product[]> {
  // Se Shopify não está configurado, retorna array vazio
  if (!isShopifyConfigured()) {
    console.log('[ProductService] Shopify não configurado');
    return [];
  }

  const data = await shopifyFetch<{
    products: {
      edges: Array<{ node: ShopifyProduct }>;
    };
  }>(SEARCH_PRODUCTS_QUERY, { query, first: limit });

  return data.products.edges.map((e) => mapShopifyProduct(e.node));
}

/**
 * Buscar produtos em destaque (novos ou featured)
 */
export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  // Se Shopify não está configurado, retorna array vazio
  if (!isShopifyConfigured()) {
    console.log('[ProductService] Shopify não configurado');
    return [];
  }

  // Busca produtos com tag "featured" ou os mais recentes
  const data = await shopifyFetch<{
    products: {
      edges: Array<{ node: ShopifyProduct }>;
    };
  }>(SEARCH_PRODUCTS_QUERY, { query: 'tag:featured', first: limit });

  const featured = data.products.edges.map((e) => mapShopifyProduct(e.node));

  // Se não tiver produtos featured, busca os mais recentes
  if (featured.length === 0) {
    return getAllProducts(limit);
  }

  return featured;
}

/**
 * Buscar produtos relacionados (mesma categoria)
 */
export async function getRelatedProducts(
  productHandle: string,
  limit: number = 4
): Promise<Product[]> {
  // Primeiro busca o produto atual
  const product = await getProductByHandle(productHandle);
  if (!product) return [];

  // Busca produtos da mesma categoria
  const collection = await getProductsByCollection(
    product.category.toLowerCase().replace(/\s+/g, '-'),
    limit + 1
  );

  if (!collection) return [];

  return collection.products
    .filter((p) => p.handle !== productHandle)
    .slice(0, limit);
}

// Export default para conveniência
export default {
  getAllProducts,
  getProductByHandle,
  getProductsByCollection,
  getAllCollections,
  searchProducts,
  getFeaturedProducts,
  getRelatedProducts,
};
