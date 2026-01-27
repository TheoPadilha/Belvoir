import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';
import { CartDrawer } from '../cart/CartDrawer';
import { ToastContainer } from '../ui/Toast';
import { LenisProvider } from '../animations';

export const Layout = () => {
  return (
    <LenisProvider>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20 lg:pt-24">
          <Outlet />
        </main>
        <Footer />
        <CartDrawer />
        <ToastContainer />
      </div>
    </LenisProvider>
  );
};
