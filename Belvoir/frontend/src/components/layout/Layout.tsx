import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { ScrollToTop } from './ScrollToTop';
import { CartDrawer } from '../cart/CartDrawer';
import { ToastContainer } from '../ui/Toast';
import { LenisProvider } from '../animations';
import { UltraPremiumFooter } from '../ultra-premium';
import { PromoBanner } from '../ecommerce';
import { CartProvider } from '../../contexts/CartContext';

export const Layout = () => {
  return (
    <CartProvider>
      <LenisProvider>
        <ScrollToTop />
        {/* Promo Banner - Fixed at top */}
        <PromoBanner />
        <div className="min-h-screen flex flex-col relative z-10">
          <Header />
          <main className="flex-1 pt-36 lg:pt-40">
            <Outlet />
          </main>
          <UltraPremiumFooter />
          <CartDrawer />
          <ToastContainer />
        </div>
      </LenisProvider>
    </CartProvider>
  );
};
