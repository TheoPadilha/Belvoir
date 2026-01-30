import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { FadeIn } from '../animations';
import logoWhite from '../../assets/images/brand/logo-horizontal-white.png';

const footerLinks = {
  shop: [
    { label: 'Todos os Relógios', href: '/shop' },
    { label: 'Cronógrafos', href: '/shop?categoria=cronografos' },
    { label: 'Clássicos', href: '/shop?categoria=classicos' },
    { label: 'Esportivos', href: '/shop?categoria=esportivos' },
    { label: 'Alta Relojoaria', href: '/shop?categoria=alta-relojoaria' },
  ],
  institucional: [
    { label: 'Sobre a Belvoir', href: '/sobre' },
    { label: 'Nossa História', href: '/sobre#historia' },
    { label: 'Atelier', href: '/sobre#atelier' },
    { label: 'Contato', href: '/contato' },
  ],
  suporte: [
    { label: 'Perguntas Frequentes', href: '/faq' },
    { label: 'Política de Trocas', href: '/politicas/trocas' },
    { label: 'Política de Privacidade', href: '/politicas/privacidade' },
    { label: 'Termos de Uso', href: '/politicas/termos' },
  ],
};

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/belvoirrelogios', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com/belvoirrelogios', label: 'Facebook' },
  { icon: Youtube, href: 'https://youtube.com/belvoirrelogios', label: 'Youtube' },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container-custom py-16">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="font-display text-2xl md:text-3xl mb-4">
                Receba Novidades Exclusivas
              </h3>
              <p className="text-secondary-300 mb-8">
                Inscreva-se para receber lançamentos, ofertas especiais e conteúdos exclusivos sobre o mundo da alta relojoaria.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-secondary-400 focus:outline-none focus:border-primary-500 transition-colors"
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-primary-500 text-white font-medium uppercase tracking-wider hover:bg-primary-600 transition-colors"
                >
                  Inscrever
                </button>
              </form>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <FadeIn>
              <Link to="/" className="inline-block mb-6">
                <img
                  src={logoWhite}
                  alt="Belvoir"
                  className="h-10 w-auto"
                />
              </Link>
              <p className="text-secondary-300 mb-6 max-w-sm">
                Desde 1987, a Belvoir representa a excelência em relojoaria de luxo.
                Cada peça conta uma história de tradição, inovação e paixão pelo tempo.
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Shop Links */}
          <div>
            <FadeIn delay={0.1}>
              <h4 className="font-display text-lg mb-6">Coleção</h4>
              <ul className="space-y-3">
                {footerLinks.shop.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-secondary-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>

          {/* Institutional Links */}
          <div>
            <FadeIn delay={0.2}>
              <h4 className="font-display text-lg mb-6">Institucional</h4>
              <ul className="space-y-3">
                {footerLinks.institucional.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-secondary-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>

          {/* Contact Info */}
          <div>
            <FadeIn delay={0.3}>
              <h4 className="font-display text-lg mb-6">Contato</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-primary-500 flex-shrink-0 mt-1" />
                  <span className="text-secondary-300">
                    Rua Oscar Freire, 123<br />
                    Jardins - São Paulo, SP
                  </span>
                </li>
                <li>
                  <a
                    href="tel:+551130001234"
                    className="flex items-center gap-3 text-secondary-300 hover:text-white transition-colors"
                  >
                    <Phone size={18} className="text-primary-500 flex-shrink-0" />
                    (11) 3000-1234
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:contato@belvoirrelogios.com"
                    className="flex items-center gap-3 text-secondary-300 hover:text-white transition-colors"
                  >
                    <Mail size={18} className="text-primary-500 flex-shrink-0" />
                    contato@belvoirrelogios.com
                  </a>
                </li>
              </ul>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-secondary-400">
            <p>© {currentYear} Belvoir Relógios. Todos os direitos reservados.</p>
            <div className="flex items-center gap-6">
              {footerLinks.suporte.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
