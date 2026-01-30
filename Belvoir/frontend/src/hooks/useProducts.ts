/**
 * Hook para buscar e gerenciar produtos
 *
 * Utiliza o productService para buscar dados do Shopify
 * ou dados mock quando o Shopify não está configurado.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Product, Collection } from '../types';
import productService from '../services/productService';

// ============================================
// TIPOS
// ============================================

interface UseProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

interface UseProductState {
  product: Product | null;
  isLoading: boolean;
  error: string | null;
}

interface UseCollectionState {
  collection: Collection | null;
  isLoading: boolean;
  error: string | null;
}

// ============================================
// HOOKS
// ============================================

/**
 * Hook para buscar todos os produtos
 */
export function useProducts(limit: number = 50) {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    isLoading: true,
    error: null,
  });

  // Ref para controlar se já foi feito o fetch (evita duplicação no Strict Mode)
  const fetchedRef = useRef(false);
  const isMountedRef = useRef(true);

  const fetchProducts = useCallback(async (force: boolean = false) => {
    // Se já buscou e não é forçado, não buscar novamente
    if (fetchedRef.current && !force) {
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const products = await productService.getAllProducts(limit);

      // Só atualiza estado se o componente ainda estiver montado
      if (isMountedRef.current) {
        fetchedRef.current = true;
        setState({ products, isLoading: false, error: null });
      }
    } catch (error) {
      if (isMountedRef.current) {
        setState((prev) => ({
          // Mantém produtos anteriores em caso de erro
          products: prev.products,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Erro ao carregar produtos',
        }));
      }
    }
  }, [limit]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchProducts();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchProducts]);

  // Função para forçar re-fetch
  const refetch = useCallback(() => {
    fetchedRef.current = false;
    return fetchProducts(true);
  }, [fetchProducts]);

  return { ...state, refetch };
}

/**
 * Hook para buscar produto por handle
 */
export function useProduct(handle: string | undefined) {
  const [state, setState] = useState<UseProductState>({
    product: null,
    isLoading: true,
    error: null,
  });

  const fetchProduct = useCallback(async () => {
    if (!handle) {
      setState({ product: null, isLoading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const product = await productService.getProductByHandle(handle);
      if (!product) {
        setState({ product: null, isLoading: false, error: 'Produto não encontrado' });
      } else {
        setState({ product, isLoading: false, error: null });
      }
    } catch (error) {
      setState({
        product: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar produto',
      });
    }
  }, [handle]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { ...state, refetch: fetchProduct };
}

/**
 * Hook para buscar produtos por coleção
 */
export function useCollection(collectionHandle: string | undefined, limit: number = 50) {
  const [state, setState] = useState<UseCollectionState>({
    collection: null,
    isLoading: true,
    error: null,
  });

  const fetchCollection = useCallback(async () => {
    if (!collectionHandle) {
      setState({ collection: null, isLoading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const collection = await productService.getProductsByCollection(collectionHandle, limit);
      if (!collection) {
        setState({ collection: null, isLoading: false, error: 'Coleção não encontrada' });
      } else {
        setState({ collection, isLoading: false, error: null });
      }
    } catch (error) {
      setState({
        collection: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar coleção',
      });
    }
  }, [collectionHandle, limit]);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  return { ...state, refetch: fetchCollection };
}

/**
 * Hook para buscar produtos em destaque
 */
export function useFeaturedProducts(limit: number = 8) {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    isLoading: true,
    error: null,
  });

  const fetchFeatured = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const products = await productService.getFeaturedProducts(limit);
      setState({ products, isLoading: false, error: null });
    } catch (error) {
      setState({
        products: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar destaques',
      });
    }
  }, [limit]);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  return { ...state, refetch: fetchFeatured };
}

/**
 * Hook para buscar produtos relacionados
 */
export function useRelatedProducts(productHandle: string | undefined, limit: number = 4) {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    isLoading: true,
    error: null,
  });

  const fetchRelated = useCallback(async () => {
    if (!productHandle) {
      setState({ products: [], isLoading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const products = await productService.getRelatedProducts(productHandle, limit);
      setState({ products, isLoading: false, error: null });
    } catch (error) {
      setState({
        products: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar relacionados',
      });
    }
  }, [productHandle, limit]);

  useEffect(() => {
    fetchRelated();
  }, [fetchRelated]);

  return { ...state, refetch: fetchRelated };
}

/**
 * Hook para pesquisar produtos
 */
export function useProductSearch() {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    isLoading: false,
    error: null,
  });

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setState({ products: [], isLoading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const products = await productService.searchProducts(query);
      setState({ products, isLoading: false, error: null });
    } catch (error) {
      setState({
        products: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro na pesquisa',
      });
    }
  }, []);

  const clear = useCallback(() => {
    setState({ products: [], isLoading: false, error: null });
  }, []);

  return { ...state, search, clear };
}

/**
 * Hook para buscar categorias (coleções)
 */
export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await productService.getAllCollections();
      setCategories(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar categorias');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, isLoading, error, refetch: fetchCategories };
}

export default {
  useProducts,
  useProduct,
  useCollection,
  useFeaturedProducts,
  useRelatedProducts,
  useProductSearch,
  useCategories,
};
