import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { ScrollToTop } from './ScrollToTop';
import { CartDrawer } from '../cart/CartDrawer';
import { ToastContainer } from '../ui/Toast';
import { UltraPremiumFooter } from '../ultra-premium';
import { PromoBanner } from '../ecommerce';
import { CartProvider } from '../../contexts/CartContext';

// Versão Ultra-Leve: Removido LenisProvider (Smooth Scroll), SpotlightCursor e InteractiveBackground.
// O scroll agora é o nativo do navegador, que é o mais performático possível.
export const Layout = () => {
  return (
    <CartProvider>
      <ScrollToTop />
      <PromoBanner />
      <div className="min-h-screen flex flex-col relative">
        <Header />
        <main className="flex-1 pt-32 lg:pt-36">
          <Outlet />
        </main>
        <UltraPremiumFooter />
        <CartDrawer />
        <ToastContainer />
      </div>
    </CartProvider>
  );
};
