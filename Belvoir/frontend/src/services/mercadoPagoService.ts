/**
 * MercadoPago Service
 *
 * Serviço para integração com MercadoPago no frontend.
 * Comunica com a API serverless para criar preferências de pagamento.
 */

import type { CartItem, Address } from '../types';

// ============================================
// TIPOS
// ============================================

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

interface PreferenceResponse {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
}

// ============================================
// CONFIGURAÇÃO
// ============================================

// Chave pública do MercadoPago (seguro para frontend)
const MP_PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || '';

// URL da API (em produção será /api, em dev pode ser diferente)
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Modo sandbox para testes
const IS_SANDBOX = import.meta.env.VITE_MERCADOPAGO_SANDBOX === 'true';

// ============================================
// SERVIÇO
// ============================================

class MercadoPagoService {
  private scriptLoaded = false;

  /**
   * Carrega o SDK do MercadoPago
   */
  async loadSDK(): Promise<void> {
    if (this.scriptLoaded) return;

    return new Promise((resolve, reject) => {
      // Verificar se já está carregado
      if (window.MercadoPago) {
        this.scriptLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.async = true;

      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };

      script.onerror = () => {
        reject(new Error('Falha ao carregar SDK do MercadoPago'));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Cria uma preferência de pagamento
   */
  async createPreference(
    items: CartItem[],
    customer: CustomerInfo,
    shippingCost: number
  ): Promise<PreferenceResponse> {
    const response = await fetch(`${API_URL}/create-preference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: items.map((item) => ({
          id: item.id,
          title: item.title,
          variantTitle: item.variantTitle,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        customer,
        shippingCost,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar preferência de pagamento');
    }

    return response.json();
  }

  /**
   * Inicia o checkout do MercadoPago (Checkout Pro)
   * Redireciona para a página de pagamento do MercadoPago
   */
  async redirectToCheckout(
    items: CartItem[],
    customer: CustomerInfo,
    shippingCost: number
  ): Promise<void> {
    const preference = await this.createPreference(items, customer, shippingCost);

    // Em sandbox usa sandboxInitPoint, em produção usa initPoint
    const checkoutUrl = IS_SANDBOX ? preference.sandboxInitPoint : preference.initPoint;

    if (!checkoutUrl) {
      throw new Error('URL de checkout não disponível');
    }

    // Redirecionar para o MercadoPago
    window.location.href = checkoutUrl;
  }

  /**
   * Inicializa o Checkout Bricks (pagamento inline)
   * Permite manter o cliente no seu site durante o pagamento
   */
  async initCheckoutBricks(
    containerId: string,
    items: CartItem[],
    customer: CustomerInfo,
    shippingCost: number,
    callbacks: {
      onSubmit?: (formData: unknown) => Promise<void>;
      onReady?: () => void;
      onError?: (error: Error) => void;
    }
  ): Promise<void> {
    await this.loadSDK();

    if (!MP_PUBLIC_KEY) {
      throw new Error('Chave pública do MercadoPago não configurada');
    }

    const preference = await this.createPreference(items, customer, shippingCost);

    const mp = new window.MercadoPago(MP_PUBLIC_KEY, {
      locale: 'pt-BR',
    });

    const bricks = mp.bricks();

    await bricks.create('wallet', containerId, {
      initialization: {
        preferenceId: preference.preferenceId,
        redirectMode: 'modal', // 'modal' ou 'self' ou 'blank'
      },
      callbacks: {
        onReady: callbacks.onReady,
        onSubmit: callbacks.onSubmit,
        onError: callbacks.onError,
      },
    });
  }

  /**
   * Converte Address para formato do MercadoPago
   */
  addressToMPFormat(address: Address): CustomerInfo['address'] {
    return {
      zipCode: address.zipCode,
      street: address.address1,
      number: address.address2 || 'S/N',
      city: address.city,
      state: address.state,
    };
  }
}

// Exportar instância única
export const mercadoPagoService = new MercadoPagoService();

// Type augmentation para Window
declare global {
  interface Window {
    MercadoPago: new (
      publicKey: string,
      options?: { locale?: string }
    ) => {
      bricks: () => {
        create: (
          type: string,
          containerId: string,
          options: unknown
        ) => Promise<void>;
      };
    };
  }
}

export default mercadoPagoService;
