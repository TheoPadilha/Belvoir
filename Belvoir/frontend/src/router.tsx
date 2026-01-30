import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/layout';

// Lazy load pages for code splitting
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('./pages/Home'));
const ShopPage = lazy(() => import('./pages/Shop'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetail'));
const CheckoutPage = lazy(() => import('./pages/Checkout'));
const CheckoutSuccessPage = lazy(() => import('./pages/CheckoutResult/Success'));
const CheckoutErrorPage = lazy(() => import('./pages/CheckoutResult/Error'));
const CheckoutPendingPage = lazy(() => import('./pages/CheckoutResult/Pending'));
const AboutPage = lazy(() => import('./pages/About'));
const ContactPage = lazy(() => import('./pages/Contact'));
const LoginPage = lazy(() => import('./pages/Login'));
const RegisterPage = lazy(() => import('./pages/Register'));
const AccountPage = lazy(() => import('./pages/Account'));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-secondary-500">Carregando...</span>
    </div>
  </div>
);

// Wrapper with Suspense
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <HomePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'shop',
        element: (
          <SuspenseWrapper>
            <ShopPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'produto/:handle',
        element: (
          <SuspenseWrapper>
            <ProductDetailPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'checkout',
        element: (
          <SuspenseWrapper>
            <CheckoutPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'checkout/sucesso',
        element: (
          <SuspenseWrapper>
            <CheckoutSuccessPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'checkout/erro',
        element: (
          <SuspenseWrapper>
            <CheckoutErrorPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'checkout/pendente',
        element: (
          <SuspenseWrapper>
            <CheckoutPendingPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'sobre',
        element: (
          <SuspenseWrapper>
            <AboutPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'contato',
        element: (
          <SuspenseWrapper>
            <ContactPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'login',
        element: (
          <SuspenseWrapper>
            <LoginPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'cadastro',
        element: (
          <SuspenseWrapper>
            <RegisterPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'conta',
        element: (
          <SuspenseWrapper>
            <AccountPage />
          </SuspenseWrapper>
        ),
      },
      // Fallback 404
      {
        path: '*',
        element: (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <h1 className="font-display text-6xl text-charcoal mb-4">404</h1>
              <p className="text-secondary-500 mb-6">Página não encontrada</p>
              <a
                href="/"
                className="inline-flex px-6 py-3 bg-charcoal text-white uppercase tracking-wider text-sm hover:bg-secondary-800 transition-colors"
              >
                Voltar ao Início
              </a>
            </div>
          </div>
        ),
      },
    ],
  },
]);
