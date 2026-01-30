/**
 * Customer Service - Shopify Storefront API
 *
 * Serviço para autenticação e gerenciamento de clientes.
 * Usa Customer Account API do Shopify Storefront.
 */

import shopifyFetch, { extractShopifyId, isShopifyConfigured } from './shopifyClient';
import type { Customer, Address } from '../types';

// ============================================
// TIPOS SHOPIFY
// ============================================

interface ShopifyCustomer {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  acceptsMarketing: boolean;
  createdAt: string;
  defaultAddress: ShopifyAddress | null;
  addresses: {
    edges: Array<{
      node: ShopifyAddress;
    }>;
  };
}

interface ShopifyAddress {
  id: string;
  firstName: string | null;
  lastName: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  country: string | null;
  zip: string | null;
  phone: string | null;
}

interface CustomerAccessToken {
  accessToken: string;
  expiresAt: string;
}

// ============================================
// STORAGE KEYS
// ============================================

const ACCESS_TOKEN_KEY = 'belvoir_customer_token';
const CUSTOMER_CACHE_KEY = 'belvoir_customer_cache';

// ============================================
// GRAPHQL QUERIES & MUTATIONS
// ============================================

const CUSTOMER_FRAGMENT = `
  fragment CustomerFields on Customer {
    id
    email
    firstName
    lastName
    phone
    acceptsMarketing
    createdAt
    defaultAddress {
      id
      firstName
      lastName
      address1
      address2
      city
      province
      country
      zip
      phone
    }
    addresses(first: 10) {
      edges {
        node {
          id
          firstName
          lastName
          address1
          address2
          city
          province
          country
          zip
          phone
        }
      }
    }
  }
`;

const CUSTOMER_CREATE_MUTATION = `
  mutation CustomerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = `
  mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

const CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION = `
  mutation CustomerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      userErrors {
        field
        message
      }
    }
  }
`;

const CUSTOMER_QUERY = `
  ${CUSTOMER_FRAGMENT}
  query GetCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      ...CustomerFields
    }
  }
`;

const CUSTOMER_UPDATE_MUTATION = `
  ${CUSTOMER_FRAGMENT}
  mutation CustomerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        ...CustomerFields
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

const CUSTOMER_ADDRESS_CREATE_MUTATION = `
  mutation CustomerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
      customerAddress {
        id
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

const CUSTOMER_ADDRESS_UPDATE_MUTATION = `
  mutation CustomerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
    customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
      customerAddress {
        id
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

const CUSTOMER_ADDRESS_DELETE_MUTATION = `
  mutation CustomerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      deletedCustomerAddressId
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

const CUSTOMER_DEFAULT_ADDRESS_UPDATE_MUTATION = `
  mutation CustomerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
    customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
      customer {
        id
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

const CUSTOMER_RECOVER_MUTATION = `
  mutation CustomerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

const CUSTOMER_RESET_MUTATION = `
  mutation CustomerReset($id: ID!, $input: CustomerResetInput!) {
    customerReset(id: $id, input: $input) {
      customer {
        id
        email
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

// ============================================
// FUNÇÕES DE MAPEAMENTO
// ============================================

/**
 * Mapeia endereço Shopify para tipo local
 */
function mapShopifyAddress(address: ShopifyAddress | null): Address | undefined {
  if (!address) return undefined;

  return {
    firstName: address.firstName || '',
    lastName: address.lastName || '',
    address1: address.address1 || '',
    address2: address.address2 || undefined,
    city: address.city || '',
    state: address.province || '',
    zipCode: address.zip || '',
    country: address.country || 'Brasil',
    phone: address.phone || '',
  };
}

/**
 * Mapeia cliente Shopify para tipo local
 */
function mapShopifyCustomer(customer: ShopifyCustomer): Customer {
  return {
    id: extractShopifyId(customer.id),
    email: customer.email,
    firstName: customer.firstName || '',
    lastName: customer.lastName || '',
    phone: customer.phone || undefined,
    defaultAddress: mapShopifyAddress(customer.defaultAddress),
    addresses: customer.addresses.edges
      .map((e) => mapShopifyAddress(e.node))
      .filter((a): a is Address => a !== undefined),
    createdAt: customer.createdAt,
    acceptsMarketing: customer.acceptsMarketing,
  };
}

/**
 * Mapeia endereço local para Shopify
 */
function mapAddressToShopify(address: Address): Record<string, string | null> {
  return {
    firstName: address.firstName,
    lastName: address.lastName,
    address1: address.address1,
    address2: address.address2 || null,
    city: address.city,
    province: address.state,
    country: address.country || 'BR',
    zip: address.zipCode,
    phone: address.phone || null,
  };
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Salvar token de acesso
 */
function saveAccessToken(token: CustomerAccessToken): void {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, JSON.stringify(token));
  } catch (error) {
    console.warn('Erro ao salvar token:', error);
  }
}

/**
 * Recuperar token de acesso
 */
function getStoredAccessToken(): CustomerAccessToken | null {
  try {
    const stored = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!stored) return null;

    const token: CustomerAccessToken = JSON.parse(stored);

    // Verificar se expirou
    if (new Date(token.expiresAt) < new Date()) {
      clearAccessToken();
      return null;
    }

    return token;
  } catch {
    return null;
  }
}

/**
 * Limpar token de acesso
 */
function clearAccessToken(): void {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(CUSTOMER_CACHE_KEY);
  } catch (error) {
    console.warn('Erro ao limpar token:', error);
  }
}

// ============================================
// FUNÇÕES PÚBLICAS (API DO SERVIÇO)
// ============================================

/**
 * Criar nova conta de cliente
 */
export async function createCustomer(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  acceptsMarketing: boolean = false
): Promise<{ success: boolean; message?: string }> {
  if (!isShopifyConfigured()) {
    // Modo demo - simular criação
    return { success: true, message: 'Conta criada com sucesso (modo demo)' };
  }

  const data = await shopifyFetch<{
    customerCreate: {
      customer: { id: string } | null;
      customerUserErrors: Array<{ field: string[]; message: string; code: string }>;
    };
  }>(CUSTOMER_CREATE_MUTATION, {
    input: {
      email,
      password,
      firstName,
      lastName,
      acceptsMarketing,
    },
  });

  if (data.customerCreate.customerUserErrors.length > 0) {
    const error = data.customerCreate.customerUserErrors[0];
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Conta criada com sucesso!' };
}

/**
 * Login do cliente
 */
export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; customer?: Customer; message?: string }> {
  if (!isShopifyConfigured()) {
    // Modo demo - simular login
    const mockCustomer: Customer = {
      id: 'demo_123',
      email,
      firstName: email.split('@')[0],
      lastName: '',
      addresses: [],
      createdAt: new Date().toISOString(),
      acceptsMarketing: false,
    };
    return { success: true, customer: mockCustomer };
  }

  const data = await shopifyFetch<{
    customerAccessTokenCreate: {
      customerAccessToken: CustomerAccessToken | null;
      customerUserErrors: Array<{ field: string[]; message: string; code: string }>;
    };
  }>(CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION, {
    input: { email, password },
  });

  if (data.customerAccessTokenCreate.customerUserErrors.length > 0) {
    const error = data.customerAccessTokenCreate.customerUserErrors[0];
    return { success: false, message: error.message };
  }

  if (!data.customerAccessTokenCreate.customerAccessToken) {
    return { success: false, message: 'Erro ao fazer login' };
  }

  // Salvar token
  saveAccessToken(data.customerAccessTokenCreate.customerAccessToken);

  // Buscar dados do cliente
  const customer = await getCustomer();
  if (!customer) {
    return { success: false, message: 'Erro ao carregar dados do cliente' };
  }

  return { success: true, customer };
}

/**
 * Logout do cliente
 */
export async function logout(): Promise<void> {
  const token = getStoredAccessToken();

  if (token && isShopifyConfigured()) {
    try {
      await shopifyFetch(CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION, {
        customerAccessToken: token.accessToken,
      });
    } catch {
      // Ignorar erro - token pode já ter expirado
    }
  }

  clearAccessToken();
}

/**
 * Buscar cliente logado
 */
export async function getCustomer(): Promise<Customer | null> {
  const token = getStoredAccessToken();
  if (!token) return null;

  if (!isShopifyConfigured()) {
    return null;
  }

  try {
    const data = await shopifyFetch<{
      customer: ShopifyCustomer | null;
    }>(CUSTOMER_QUERY, {
      customerAccessToken: token.accessToken,
    });

    if (!data.customer) {
      clearAccessToken();
      return null;
    }

    return mapShopifyCustomer(data.customer);
  } catch {
    clearAccessToken();
    return null;
  }
}

/**
 * Verificar se cliente está logado
 */
export function isLoggedIn(): boolean {
  return getStoredAccessToken() !== null;
}

/**
 * Obter token de acesso atual
 */
export function getAccessToken(): string | null {
  return getStoredAccessToken()?.accessToken || null;
}

/**
 * Atualizar dados do cliente
 */
export async function updateCustomer(
  updates: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    acceptsMarketing: boolean;
  }>
): Promise<{ success: boolean; customer?: Customer; message?: string }> {
  const token = getStoredAccessToken();
  if (!token) {
    return { success: false, message: 'Não autenticado' };
  }

  if (!isShopifyConfigured()) {
    return { success: true, message: 'Dados atualizados (modo demo)' };
  }

  const data = await shopifyFetch<{
    customerUpdate: {
      customer: ShopifyCustomer | null;
      customerUserErrors: Array<{ field: string[]; message: string; code: string }>;
    };
  }>(CUSTOMER_UPDATE_MUTATION, {
    customerAccessToken: token.accessToken,
    customer: updates,
  });

  if (data.customerUpdate.customerUserErrors.length > 0) {
    return { success: false, message: data.customerUpdate.customerUserErrors[0].message };
  }

  if (!data.customerUpdate.customer) {
    return { success: false, message: 'Erro ao atualizar dados' };
  }

  return {
    success: true,
    customer: mapShopifyCustomer(data.customerUpdate.customer),
  };
}

/**
 * Adicionar endereço
 */
export async function addAddress(
  address: Address
): Promise<{ success: boolean; message?: string }> {
  const token = getStoredAccessToken();
  if (!token) {
    return { success: false, message: 'Não autenticado' };
  }

  if (!isShopifyConfigured()) {
    return { success: true, message: 'Endereço adicionado (modo demo)' };
  }

  const data = await shopifyFetch<{
    customerAddressCreate: {
      customerAddress: { id: string } | null;
      customerUserErrors: Array<{ field: string[]; message: string; code: string }>;
    };
  }>(CUSTOMER_ADDRESS_CREATE_MUTATION, {
    customerAccessToken: token.accessToken,
    address: mapAddressToShopify(address),
  });

  if (data.customerAddressCreate.customerUserErrors.length > 0) {
    return { success: false, message: data.customerAddressCreate.customerUserErrors[0].message };
  }

  return { success: true, message: 'Endereço adicionado com sucesso!' };
}

/**
 * Atualizar endereço
 */
export async function updateAddress(
  addressId: string,
  address: Address
): Promise<{ success: boolean; message?: string }> {
  const token = getStoredAccessToken();
  if (!token) {
    return { success: false, message: 'Não autenticado' };
  }

  if (!isShopifyConfigured()) {
    return { success: true, message: 'Endereço atualizado (modo demo)' };
  }

  const data = await shopifyFetch<{
    customerAddressUpdate: {
      customerAddress: { id: string } | null;
      customerUserErrors: Array<{ field: string[]; message: string; code: string }>;
    };
  }>(CUSTOMER_ADDRESS_UPDATE_MUTATION, {
    customerAccessToken: token.accessToken,
    id: `gid://shopify/MailingAddress/${addressId}`,
    address: mapAddressToShopify(address),
  });

  if (data.customerAddressUpdate.customerUserErrors.length > 0) {
    return { success: false, message: data.customerAddressUpdate.customerUserErrors[0].message };
  }

  return { success: true, message: 'Endereço atualizado com sucesso!' };
}

/**
 * Remover endereço
 */
export async function deleteAddress(
  addressId: string
): Promise<{ success: boolean; message?: string }> {
  const token = getStoredAccessToken();
  if (!token) {
    return { success: false, message: 'Não autenticado' };
  }

  if (!isShopifyConfigured()) {
    return { success: true, message: 'Endereço removido (modo demo)' };
  }

  const data = await shopifyFetch<{
    customerAddressDelete: {
      deletedCustomerAddressId: string | null;
      customerUserErrors: Array<{ field: string[]; message: string; code: string }>;
    };
  }>(CUSTOMER_ADDRESS_DELETE_MUTATION, {
    customerAccessToken: token.accessToken,
    id: `gid://shopify/MailingAddress/${addressId}`,
  });

  if (data.customerAddressDelete.customerUserErrors.length > 0) {
    return { success: false, message: data.customerAddressDelete.customerUserErrors[0].message };
  }

  return { success: true, message: 'Endereço removido com sucesso!' };
}

/**
 * Definir endereço padrão
 */
export async function setDefaultAddress(
  addressId: string
): Promise<{ success: boolean; message?: string }> {
  const token = getStoredAccessToken();
  if (!token) {
    return { success: false, message: 'Não autenticado' };
  }

  if (!isShopifyConfigured()) {
    return { success: true, message: 'Endereço padrão definido (modo demo)' };
  }

  const data = await shopifyFetch<{
    customerDefaultAddressUpdate: {
      customer: { id: string } | null;
      customerUserErrors: Array<{ field: string[]; message: string; code: string }>;
    };
  }>(CUSTOMER_DEFAULT_ADDRESS_UPDATE_MUTATION, {
    customerAccessToken: token.accessToken,
    addressId: `gid://shopify/MailingAddress/${addressId}`,
  });

  if (data.customerDefaultAddressUpdate.customerUserErrors.length > 0) {
    return { success: false, message: data.customerDefaultAddressUpdate.customerUserErrors[0].message };
  }

  return { success: true, message: 'Endereço padrão atualizado!' };
}

/**
 * Recuperar senha (enviar email)
 */
export async function recoverPassword(
  email: string
): Promise<{ success: boolean; message?: string }> {
  if (!isShopifyConfigured()) {
    return { success: true, message: 'Email de recuperação enviado (modo demo)' };
  }

  const data = await shopifyFetch<{
    customerRecover: {
      customerUserErrors: Array<{ field: string[]; message: string; code: string }>;
    };
  }>(CUSTOMER_RECOVER_MUTATION, { email });

  if (data.customerRecover.customerUserErrors.length > 0) {
    return { success: false, message: data.customerRecover.customerUserErrors[0].message };
  }

  return { success: true, message: 'Email de recuperação enviado!' };
}

/**
 * Resetar senha (com token do email)
 */
export async function resetPassword(
  customerId: string,
  resetToken: string,
  newPassword: string
): Promise<{ success: boolean; customer?: Customer; message?: string }> {
  if (!isShopifyConfigured()) {
    return { success: true, message: 'Senha alterada (modo demo)' };
  }

  const data = await shopifyFetch<{
    customerReset: {
      customer: ShopifyCustomer | null;
      customerAccessToken: CustomerAccessToken | null;
      customerUserErrors: Array<{ field: string[]; message: string; code: string }>;
    };
  }>(CUSTOMER_RESET_MUTATION, {
    id: `gid://shopify/Customer/${customerId}`,
    input: {
      resetToken,
      password: newPassword,
    },
  });

  if (data.customerReset.customerUserErrors.length > 0) {
    return { success: false, message: data.customerReset.customerUserErrors[0].message };
  }

  if (data.customerReset.customerAccessToken) {
    saveAccessToken(data.customerReset.customerAccessToken);
  }

  return {
    success: true,
    customer: data.customerReset.customer
      ? mapShopifyCustomer(data.customerReset.customer)
      : undefined,
    message: 'Senha alterada com sucesso!',
  };
}

// Export default
export default {
  createCustomer,
  login,
  logout,
  getCustomer,
  isLoggedIn,
  getAccessToken,
  updateCustomer,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  recoverPassword,
  resetPassword,
};
