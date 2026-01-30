import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import logoHorizontal from '../../assets/images/brand/logo-horizontal.png';
import logoHorizontalWhite from '../../assets/images/brand/logo-horizontal-white.png';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Coleção', href: '/shop' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'Contato', href: '/contato' },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { openCart, itemCount } = useCart();
  const { isMenuOpen, openMenu, closeMenu } = useUIStore();
  const { isAuthenticated, customer } = useAuthStore();

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fechar menu ao mudar de rota
  useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  // Prevenir scroll quando menu está aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const isHome = location.pathname === '/';
  const headerBg = isScrolled || !isHome ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent';
  const textColor = isScrolled || !isHome ? 'text-charcoal' : 'text-white';
  // Na home, header fica mais baixo (top-10). Em outras páginas, gruda no promo banner
  const headerTop = isHome ? 'top-5' : 'top-[20px]';

  return (
    <>
      <header
        className={`
          fixed ${headerTop} left-0 right-0 z-50 transition-all duration-500
          ${headerBg}
        `}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Menu Button (Mobile) */}
            <button
              onClick={openMenu}
              className={`lg:hidden p-2 -ml-2 ${textColor} transition-colors`}
              aria-label="Abrir menu"
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link
              to="/"
              className="transition-opacity hover:opacity-80"
            >
              <img
                src={isScrolled || !isHome ? logoHorizontal : logoHorizontalWhite}
                alt="Belvoir"
                className="h-12 lg:h-14 w-auto"
              />
            </Link>

            {/* Navigation (Desktop) */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`
                    relative font-body text-sm uppercase tracking-widest
                    ${textColor} transition-colors
                    hover:opacity-70
                  `}
                >
                  {link.label}
                  {location.pathname === link.href && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-[1px] bg-current"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <button
                className={`p-2 ${textColor} transition-colors hover:opacity-70 hidden md:block`}
                aria-label="Buscar"
              >
                <Search size={20} />
              </button>

              <Link
                to={isAuthenticated ? '/conta' : '/login'}
                className={`p-2 ${textColor} transition-colors hover:opacity-70 flex items-center gap-2`}
                aria-label={isAuthenticated ? 'Minha conta' : 'Entrar'}
              >
                <User size={20} />
                {isAuthenticated && customer && (
                  <span className="hidden md:inline text-sm font-medium truncate max-w-25">
                    {customer.firstName}
                  </span>
                )}
              </Link>

              <button
                onClick={openCart}
                className={`relative p-2 ${textColor} transition-colors hover:opacity-70`}
                aria-label="Carrinho"
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-medium rounded-full flex items-center justify-center"
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-[300px] bg-white lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-secondary-100">
                  <span className="font-display text-xl font-semibold">Menu</span>
                  <button
                    onClick={closeMenu}
                    className="p-2 -mr-2 text-charcoal hover:opacity-70 transition-opacity"
                    aria-label="Fechar menu"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Menu Links */}
                <nav className="flex-1 py-6">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={link.href}
                        className={`
                          block px-6 py-4 font-body text-lg
                          ${location.pathname === link.href ? 'text-primary-500 font-medium' : 'text-charcoal'}
                          hover:bg-secondary-50 transition-colors
                        `}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Menu Footer */}
                <div className="p-6 border-t border-secondary-100">
                  <Link
                    to={isAuthenticated ? '/conta' : '/login'}
                    className="flex items-center gap-3 mb-4 text-charcoal hover:text-primary-500 transition-colors"
                  >
                    <User size={20} />
                    <span className="font-medium">
                      {isAuthenticated ? `Olá, ${customer?.firstName}` : 'Entrar / Criar conta'}
                    </span>
                  </Link>
                  <p className="text-sm text-secondary-500">
                    Relógios de luxo para momentos únicos
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
