import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll suave para o topo quando a rota mudar
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', // Usar 'instant' para não conflitar com Lenis
    });
  }, [pathname]);

  return null;
};
