// Product types
export interface ProductImage {
  id: string;
  src: string;
  alt: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  available: boolean;
  sku: string;
  option1?: string; // e.g., color
  option2?: string; // e.g., size
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  images: ProductImage[];
  variants: ProductVariant[];
  category: string;
  tags: string[];
  available: boolean;
  totalInventory: number;
  brand: string;
  material: string;
  movement: string;
  waterResistance: string;
  caseDiameter: string;
  features: string[];
  createdAt: string;
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: string;
  products: Product[];
}

// Cart types
export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  title: string;
  variantTitle: string;
  price: number;
  quantity: number;
  image: string;
  handle: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  itemCount: number;
}

// Checkout types
export interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface ShippingMethod {
  id: string;
  title: string;
  price: number;
  estimatedDays: string;
}

export interface CheckoutState {
  step: 1 | 2 | 3;
  email: string;
  shippingAddress: Address | null;
  billingAddress: Address | null;
  sameAsShipping: boolean;
  shippingMethod: ShippingMethod | null;
  paymentMethod: string;
  notes: string;
}

// Filter types
export interface FilterState {
  category: string[];
  priceRange: [number, number];
  brand: string[];
  material: string[];
  sortBy: 'relevance' | 'price-asc' | 'price-desc' | 'newest';
}

// UI types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// Authentication types
export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  defaultAddress?: Address;
  addresses: Address[];
  createdAt: string;
  acceptsMarketing: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  financialStatus: 'pending' | 'paid' | 'refunded' | 'partially_refunded';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: Address;
  trackingNumber?: string;
  trackingUrl?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  title: string;
  variantTitle: string;
  quantity: number;
  price: number;
  image: string;
}

export interface AuthState {
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
}

// Contact form types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// Review types
export interface Review {
  id: string;
  productId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  images?: string[];
  verified: boolean; // Compra verificada
  helpful: number; // Número de pessoas que acharam útil
  createdAt: string;
}

export interface ReviewSummary {
  productId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
