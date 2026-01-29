import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { ScrollToTop } from './ScrollToTop';
import { CartDrawer } from '../cart/CartDrawer';
import { ToastContainer } from '../ui/Toast';
import { LenisProvider } from '../animations';
import { InteractiveBackground } from '../premium';
import { SpotlightCursor, UltraPremiumFooter } from '../ultra-premium';

export const Layout = () => {
  return (
    <LenisProvider>
      <ScrollToTop />
      {/* Premium Interactive Background */}
      <InteractiveBackground />
      {/* Ultra-Premium Spotlight Cursor */}
      <SpotlightCursor />
      <div className="min-h-screen flex flex-col relative z-10">
        <Header />
        <main className="flex-1 pt-20 lg:pt-24">
          <Outlet />
        </main>
        <UltraPremiumFooter />
        <CartDrawer />
        <ToastContainer />
      </div>
    </LenisProvider>
  );
};
